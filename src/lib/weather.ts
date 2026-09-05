export type CityCode = "PTA" | "JHB" | "CPT" | "DBN";
export type WeatherCondition = "Clear" | "Cloudy" | "Rain";
export type CityWeather = Partial<Record<CityCode, { temperature: number; condition: WeatherCondition }>>;

// Open-Meteo's forecast endpoint is free and keyless — no credential to
// leak to the client, no account to provision.
const CITY_COORDS: Record<CityCode, { lat: number; lon: number }> = {
  PTA: { lat: -25.7479, lon: 28.2293 },
  JHB: { lat: -26.2041, lon: 28.0473 },
  CPT: { lat: -33.9249, lon: 18.4241 },
  DBN: { lat: -29.8587, lon: 31.0218 },
};

// Collapses Open-Meteo's WMO weather codes down to the three broad
// conditions the header icon actually distinguishes between.
function conditionForCode(code: number): WeatherCondition {
  if (code === 0 || code === 1) return "Clear";
  if (code >= 51) return "Rain";
  return "Cloudy";
}

async function fetchCityWeather(city: CityCode) {
  const { lat, lon } = CITY_COORDS[city];
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  try {
    const response = await fetch(url, { next: { revalidate: 1800 } });
    if (!response.ok) return null;
    const data = await response.json();
    const temperature = data?.current_weather?.temperature;
    const weathercode = data?.current_weather?.weathercode;
    if (typeof temperature !== "number" || typeof weathercode !== "number") return null;
    return { city, temperature: Math.round(temperature), condition: conditionForCode(weathercode) };
  } catch {
    return null;
  }
}

// Cities whose fetch fails (or times out, or the API is unreachable) are
// simply absent from the returned record — the header falls back to
// "CITY · TIME" per-city rather than showing a broken or fabricated reading.
export async function fetchAllCitiesWeather(): Promise<CityWeather> {
  const cityCodes = Object.keys(CITY_COORDS) as CityCode[];
  const results = await Promise.all(cityCodes.map(fetchCityWeather));

  const weather: CityWeather = {};
  for (const result of results) {
    if (result) weather[result.city] = { temperature: result.temperature, condition: result.condition };
  }
  return weather;
}
