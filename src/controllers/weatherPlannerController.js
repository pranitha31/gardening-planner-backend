import supabase from "../config/supabaseClient.js";
import { getWeather, getForecast } from "../services/weatherService.js";

export const getSmartPlanner = async (req, res) => {
  try {
    // console.log("Weather API response sent");
    // 1️⃣ Get user location
    const { data: user, error } = await supabase
      .from("users")
      .select("country , state ,city")
      .eq("id", req.user.id)
      .single();

    if (error) throw error;

    if (!user.city) {
      return res.status(400).json({
        error: "Please update your location first",
      });
    }

    // 2️⃣ Get weather
    const weatherData = await getWeather(user.country, user.state, user.city);

    const temp = weatherData.main.temp;
    const condition = weatherData.weather[0].main;
    const forecastData = await getForecast(user.country, user.state, user.city);

    // const forecast = forecastData.list.slice(0, 5).map((item) => ({
    //   date: item.dt_txt.split(" ")[0],
    //   temp: item.main.temp,
    //   condition: item.weather[0].main,
    // }));
    // Group by unique dates
    const dailyMap = {};

    forecastData.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];

      if (!dailyMap[date]) {
        dailyMap[date] = {
          temps: [],
          conditions: [],
        };
      }

      dailyMap[date].temps.push(item.main.temp);
      dailyMap[date].conditions.push(item.weather[0].main);
    });

    // Convert to 5-day summary
    const forecast = Object.keys(dailyMap)
      .slice(0, 5)
      .map((date) => {
        const temps = dailyMap[date].temps;

        const min = Math.min(...temps);
        const max = Math.max(...temps);

        return {
          date,
          minTemp: min.toFixed(1),
          maxTemp: max.toFixed(1),
          condition: dailyMap[date].conditions[0],
        };
      });
    // 3️⃣ Smart Gardening Advice
    let advice = "";

    // if (temp > 35) {
    //   advice = "High temperature. Increase watering frequency.";
    // } else if (temp < 10) {
    //   advice = "Cold weather. Protect plants from frost.";
    // } else if (condition === "Rain") {
    //   advice = "Rain expected. Reduce manual watering.";
    // } else {
    //   advice = "Weather is moderate. Normal care routine.";
    // }
    if (temp <= 5) {
      advice = "⚠ Frost risk! Cover sensitive plants.";
    } else if (temp > 35) {
      advice = "🔥 Extreme heat. Water early morning or evening.";
    } else if (condition === "Rain") {
      advice = "🌧 Rain expected. Reduce watering.";
    } else if (condition === "Clouds") {
      advice = "☁ Cloudy weather. Moderate watering.";
    } else {
      advice = "🌤 Good weather. Normal plant care routine.";
    }
    // if (temp > 35) {
    //   await supabase.from("reminders").insert({
    //     user_id: req.user.id,
    //     title: "Increase Watering 🌡️",
    //     reminder_date: new Date().toISOString().split("T")[0],
    //     status: "pending",
    //   });
    // }
    if (temp > 35) {
      const today = new Date().toISOString().split("T")[0];

      const { data: existing } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", req.user.id)
        .eq("title", "Increase Watering 🌡️")
        .eq("reminder_date", today);

      if (!existing || existing.length === 0) {
        await supabase.from("reminders").insert({
          user_id: req.user.id,
          title: "Increase Watering 🌡️",
          reminder_date: today,
          status: "pending",
        });
      }
    }

    res.json({
      location: `${user.city}, ${user.state}`,
      temperature: temp,
      condition,
      smart_advice: advice,
      forecast,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
