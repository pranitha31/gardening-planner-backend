import fetch from "node-fetch";

export const getWeather = async (city, country) => {
  const apiKey = process.env.WEATHER_API_KEY;

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`
  );

  if (!response.ok) {
    throw new Error("Weather API failed");
  }

  return await response.json();
};
export const getForecast = async (city, country) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&units=metric&appid=${process.env.WEATHER_API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Forecast fetch failed");
  }

  return response.json();
};