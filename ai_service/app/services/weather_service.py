import requests
import logging

logger = logging.getLogger(__name__)

def fetch_weather_data(city: str) -> dict:
    """
    Fetch weather data from the mock API for a given city.
    Returns a dict with weather fields or None if failed.
    """
    url = f"http://localhost:3000/api/mock/weather?city={city}"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        logger.info(f"Fetched weather data for {city}: {data}")
        return data
    except requests.RequestException as e:
        logger.error(f"Failed to fetch weather data for {city}: {e}")
        return None