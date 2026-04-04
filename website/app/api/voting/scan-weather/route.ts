import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { getWorkerProfileModel } from '@/models/WorkerProfile';
import SystemJobState from '@/models/SystemJobState';
import VotingIncident from '@/models/VotingIncident';
import User from '@/models/User';
import UserNotification from '@/models/UserNotification';
import WeatherScanRun from '@/models/WeatherScanRun';

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
const NEARBY_RADIUS_KM = 50;

type GeoriskResponse = {
  status: 'success' | 'error';
  coordinates?: { lat: number; lon: number };
  live_weather?: {
    temperature_celsius: number;
    rain_mm_hr: number;
    windspeed_kmh: number;
  };
  ai_analysis?: {
    risk_level: 'SAFE' | 'WARNING' | 'CRITICAL';
    action: string;
    safety_probability: number;
  };
  message?: string;
};

type UserGeo = {
  userId: string;
  city: string;
  lat: number;
  lon: number;
};

function normalizeCity(city: string): string {
  return city.trim().toLowerCase();
}

function getCurrentTwoHourWindow(now = new Date()): { start: Date; end: Date } {
  const start = new Date(now);
  start.setMinutes(0, 0, 0);
  start.setHours(Math.floor(start.getHours() / 2) * 2);

  const end = new Date(start.getTime() + TWO_HOURS_MS);
  return { start, end };
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const earthRadiusKm = 6371;
  const dLat = toRadians(bLat - aLat);
  const dLon = toRadians(bLon - aLon);
  const lat1 = toRadians(aLat);
  const lat2 = toRadians(bLat);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return earthRadiusKm * y;
}

async function geocodeCity(city: string): Promise<{ lat: number; lon: number } | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;

  try {
    const response = await fetch(url, { method: 'GET', cache: 'no-store' });
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const result = data?.results?.[0];
    if (!result) {
      return null;
    }

    return {
      lat: Number(result.latitude),
      lon: Number(result.longitude),
    };
  } catch {
    return null;
  }
}

async function callGeorisk(lat: number, lon: number): Promise<GeoriskResponse | null> {
  const aiBaseUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
  const endpoint = `${aiBaseUrl}/v1/analyze/georisk`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: lat, longitude: lon }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as GeoriskResponse;
    return payload;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const startedAt = new Date();

  try {
    const forceRun = request.nextUrl.searchParams.get('force') === 'true';

    await connectDB();

    const now = new Date();
    const state = await SystemJobState.findOne({ jobKey: 'weather-georisk-scan' });
    if (!forceRun && state?.lastRanAt && now.getTime() - state.lastRanAt.getTime() < TWO_HOURS_MS) {
      const nextAt = new Date(state.lastRanAt.getTime() + TWO_HOURS_MS).toISOString();

      await WeatherScanRun.create({
        startedAt,
        finishedAt: new Date(),
        status: 'skipped',
        reason: 'already-ran-within-2-hours',
        scannedCities: [],
        createdIncidents: 0,
        createdNotifications: 0,
      });

      return NextResponse.json(
        {
          message: 'Skipped: weather scan already executed within the last 2 hours',
          lastRanAt: state.lastRanAt.toISOString(),
          nextRunAt: nextAt,
          createdIncidents: 0,
          createdNotifications: 0,
        },
        { status: 200 }
      );
    }

    const WorkerProfile = await getWorkerProfileModel();
    const workerProfiles = await WorkerProfile.find({
      city: { $exists: true, $ne: '' },
      userId: { $exists: true, $ne: '' },
    })
      .select('userId city -_id')
      .lean();

    const workerPartnerIds = Array.from(new Set(workerProfiles.map((item) => String(item.userId))));

    if (!workerPartnerIds.length) {
      await SystemJobState.findOneAndUpdate(
        { jobKey: 'weather-georisk-scan' },
        { $set: { lastRanAt: now } },
        { upsert: true, new: true }
      );

      await WeatherScanRun.create({
        startedAt,
        finishedAt: new Date(),
        status: 'completed',
        reason: 'no-worker-users',
        scannedCities: [],
        createdIncidents: 0,
        createdNotifications: 0,
      });

      return NextResponse.json({
        message: 'No worker profiles found; scan finished.',
        createdIncidents: 0,
        createdNotifications: 0,
      });
    }

    const users = await User.find({ 'kyc.companies.partnerId': { $in: workerPartnerIds } })
      .select('_id kyc.city kyc.latitude kyc.longitude kyc.companies')
      .lean();

    const cityCoordinates = new Map<string, { lat: number; lon: number }>();

    async function getCoordsForCity(city: string) {
      const normalized = normalizeCity(city);
      if (cityCoordinates.has(normalized)) {
        return cityCoordinates.get(normalized) || null;
      }

      const coords = await geocodeCity(city);
      if (coords) {
        cityCoordinates.set(normalized, coords);
      }

      return coords;
    }

    const userGeoList: UserGeo[] = [];

    for (const user of users) {
      const userId = String(user._id);
      const partnerIds = (user.kyc?.companies || [])
        .map((company) => String(company?.partnerId || '').trim())
        .filter((partnerId) => partnerId.length > 0);

      const userWorkerProfile = workerProfiles.find((w) => partnerIds.includes(String(w.userId)));
      const city = (user.kyc?.city || userWorkerProfile?.city || '').trim();
      if (!city) {
        continue;
      }

      let lat: number | null = null;
      let lon: number | null = null;

      if (typeof user.kyc?.latitude === 'number' && typeof user.kyc?.longitude === 'number') {
        lat = user.kyc.latitude;
        lon = user.kyc.longitude;
      } else {
        const geocoded = await getCoordsForCity(city);
        if (geocoded) {
          lat = geocoded.lat;
          lon = geocoded.lon;
        }
      }

      if (lat === null || lon === null) {
        continue;
      }

      userGeoList.push({ userId, city, lat, lon });
    }

    const uniqueCities = Array.from(new Set(userGeoList.map((u) => u.city)));

    if (!uniqueCities.length) {
      await SystemJobState.findOneAndUpdate(
        { jobKey: 'weather-georisk-scan' },
        { $set: { lastRanAt: now } },
        { upsert: true, new: true }
      );

      await WeatherScanRun.create({
        startedAt,
        finishedAt: new Date(),
        status: 'completed',
        reason: 'no-user-geocoordinates',
        scannedCities: [],
        createdIncidents: 0,
        createdNotifications: 0,
      });

      return NextResponse.json({
        message: 'No user coordinates available; scan finished.',
        createdIncidents: 0,
        createdNotifications: 0,
      });
    }

    const { start: windowStartAt, end: windowEndAt } = getCurrentTwoHourWindow(now);

    let createdIncidents = 0;
    let createdNotifications = 0;
    const scannedCities: string[] = [];

    for (const city of uniqueCities) {
      const sourceCoords = await getCoordsForCity(city);
      if (!sourceCoords) {
        continue;
      }

      const georisk = await callGeorisk(sourceCoords.lat, sourceCoords.lon);
      if (!georisk || georisk.status !== 'success' || !georisk.ai_analysis || !georisk.live_weather) {
        continue;
      }

      scannedCities.push(city);

      if (georisk.ai_analysis.risk_level === 'SAFE') {
        continue;
      }

      const impactedUsers = userGeoList.filter((userGeo) => {
        const distance = haversineKm(sourceCoords.lat, sourceCoords.lon, userGeo.lat, userGeo.lon);
        return distance <= NEARBY_RADIUS_KM;
      });

      const targetCities = Array.from(new Set(impactedUsers.map((item) => item.city)));
      const targetCitiesNormalized = targetCities.map(normalizeCity);
      const targetUserIds = impactedUsers.map((item) => new mongoose.Types.ObjectId(item.userId));

      const existingIncident = await VotingIncident.findOne({ sourceCity: city, windowStartAt });

      const incident = await VotingIncident.findOneAndUpdate(
        {
          sourceCity: city,
          windowStartAt,
        },
        {
          $setOnInsert: {
            sourceCity: city,
            windowStartAt,
            votes: 0,
            voterIds: [],
          },
          $set: {
            sourceCoordinates: sourceCoords,
            targetCities,
            targetCitiesNormalized,
            targetUserIds,
            riskLevel: georisk.ai_analysis.risk_level,
            action: georisk.ai_analysis.action,
            safetyProbability: georisk.ai_analysis.safety_probability,
            weather: {
              temperatureCelsius: georisk.live_weather.temperature_celsius,
              rainMmHr: georisk.live_weather.rain_mm_hr,
              windspeedKmh: georisk.live_weather.windspeed_kmh,
            },
            status: 'open',
            windowEndAt,
          },
        },
        { upsert: true, new: true }
      );

      if (!existingIncident) {
        createdIncidents += 1;

        if (incident && targetUserIds.length) {
          const rows = targetUserIds.map((userId) => ({
            userId,
            title: `Weather alert near ${city}`,
            message: `A ${georisk.ai_analysis?.risk_level} incident is open for voting in your area.`,
            type: 'weather-incident' as const,
            incidentId: incident._id,
            read: false,
          }));

          if (rows.length) {
            await UserNotification.insertMany(rows);
            createdNotifications += rows.length;
          }
        }
      }
    }

    await VotingIncident.updateMany(
      { windowEndAt: { $lte: now }, status: 'open' },
      { $set: { status: 'closed' } }
    );

    await SystemJobState.findOneAndUpdate(
      { jobKey: 'weather-georisk-scan' },
      { $set: { lastRanAt: now } },
      { upsert: true, new: true }
    );

    await WeatherScanRun.create({
      startedAt,
      finishedAt: new Date(),
      status: 'completed',
      scannedCities,
      createdIncidents,
      createdNotifications,
    });

    return NextResponse.json({
      message: 'Weather scan completed',
      scannedCities,
      createdIncidents,
      createdNotifications,
      windowStartAt: windowStartAt.toISOString(),
      windowEndAt: windowEndAt.toISOString(),
      nearbyRadiusKm: NEARBY_RADIUS_KM,
    });
  } catch (error) {
    console.error('Voting weather scan error:', error);

    await WeatherScanRun.create({
      startedAt,
      finishedAt: new Date(),
      status: 'failed',
      reason: error instanceof Error ? error.message : 'unknown-error',
      scannedCities: [],
      createdIncidents: 0,
      createdNotifications: 0,
    }).catch(() => undefined);

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
