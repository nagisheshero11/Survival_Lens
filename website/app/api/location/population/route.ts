import { NextRequest, NextResponse } from "next/server";

type PopulationRecord = {
  name?: string;
  ascii_name?: string;
  country_code?: string;
  cou_name_en?: string;
  admin1_code?: string;
  alternate_names?: string[];
  population?: number;
};

const BASE_URL =
  "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records";

function escapeQueryValue(value: string) {
  return value.replace(/'/g, "''");
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function cityCandidates(city: string) {
  const candidates = [city.trim()]
    .concat(city.split(",").map((part) => part.trim()))
    .filter(Boolean)
    .map((value) => value.replace(/\s+/g, " "));

  return Array.from(new Set(candidates));
}

function classifyServiceZone(population: number) {
  if (population >= 4000000) return "Metropolitan";
  if (population >= 1000000) return "Urban";
  if (population >= 200000) return "Semi Urban";
  return "Rural";
}

function buildWhere(city: string, country: string) {
  const terms = [
    `(search(name, '${escapeQueryValue(city)}') OR search(alternate_names, '${escapeQueryValue(city)}'))`,
  ];

  if (country) {
    terms.push(`country_code = '${escapeQueryValue(country)}'`);
  }

  return terms.join(" AND ");
}

function chooseBestRecord(records: PopulationRecord[], city: string) {
  if (!records.length) return null;

  const normalizedCity = normalize(city);

  const exactCity = records.find((record) => {
    const name = normalize(record.name || record.ascii_name || "");
    return name === normalizedCity;
  });
  if (exactCity) return exactCity;

  const fuzzyCity = records.find((record) => {
    const name = normalize(record.name || record.ascii_name || "");
    return name.includes(normalizedCity) || normalizedCity.includes(name);
  });
  if (fuzzyCity) return fuzzyCity;

  return records[0];
}

async function fetchPopulationRecords(city: string, country: string) {
  const params = new URLSearchParams({
    select: "name,ascii_name,cou_name_en,country_code,admin1_code,population,alternate_names",
    where: buildWhere(city, country),
    order_by: "population desc",
    limit: "12",
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Population data provider unavailable");
  }

  const payload = await response.json();
  return Array.isArray(payload?.results) ? (payload.results as PopulationRecord[]) : [];
}

export async function GET(request: NextRequest) {
  try {
    const cityRaw = request.nextUrl.searchParams.get("city") || "";
    const stateRaw = request.nextUrl.searchParams.get("state") || "";
    const countryRaw = request.nextUrl.searchParams.get("country") || "IN";

    const city = cityRaw.trim();
    const state = stateRaw.trim();
    const country = countryRaw.trim().toUpperCase();

    if (city.length < 2) {
      return NextResponse.json({ message: "City is required" }, { status: 400 });
    }

    const candidates = cityCandidates(city);
    let records: PopulationRecord[] = [];
    let usedCandidate = city;

    for (const candidate of candidates) {
      usedCandidate = candidate;
      records = await fetchPopulationRecords(candidate, country);
      if (records.length) break;

      if (country) {
        records = await fetchPopulationRecords(candidate, "");
        if (records.length) break;
      }
    }

    const best = chooseBestRecord(records, usedCandidate);
    const population = Number(best?.population);

    if (!best || !Number.isFinite(population) || population <= 0) {
      return NextResponse.json({ message: "Population data not found for this location" }, { status: 404 });
    }

    const serviceZone = classifyServiceZone(population);

    return NextResponse.json(
      {
        cityInput: city,
        matchedCity: best.name || best.ascii_name || city,
        matchedState: state,
        countryCode: best.country_code || country,
        countryName: best.cou_name_en || "",
        population,
        serviceZone,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "Failed to resolve population", error: message }, { status: 500 });
  }
}
