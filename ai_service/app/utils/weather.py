import ssl
import json
import urllib.request
from urllib.error import URLError

def fetch_live_weather(lat: float, lon: float) -> dict:
    """
    Fetches real-time weather from Open-Meteo without requiring API keys.
    """
    # Ask for current weather & hourly precipitation and wind speed
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&hourly=precipitation,windspeed_10m"
    
    try:
        context = ssl._create_unverified_context()
        req = urllib.request.Request(url, headers={'User-Agent': 'SurvivalLens/1.0'})
        with urllib.request.urlopen(req, context=context, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            
            current = data.get("current_weather", {})
            temp = current.get("temperature", 25.0)
            windspeed = current.get("windspeed", 0.0)
            
            # Grab current hour's precipitation
            hourly = data.get("hourly", {})
            precip_list = hourly.get("precipitation", [])
            precipitation = precip_list[0] if precip_list else 0.0
            
            return {
                "temperature": float(temp),
                "windspeed": float(windspeed),
                "precipitation": float(precipitation)
            }
            
    except Exception as e:
        print(f"Open-Meteo Fetch Error: {e}")
        return {
            "temperature": 25.0,
            "windspeed": 0.0,
            "precipitation": 0.0,
            "error": True
        }
