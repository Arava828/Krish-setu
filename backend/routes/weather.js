const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  try {
    const { city = 'Delhi' } = req.query;
    const API_KEY = process.env.WEATHER_API_KEY;
    if (!API_KEY || API_KEY === 'your_key_here') {
      return res.json({
        city, temperature: 28, humidity: 65, windSpeed: 12,
        description: 'Partly cloudy', icon: '02d',
        farmingTip: 'Good conditions for irrigation today. Consider watering crops in the evening.',
        isMockData: true
      });
    }
    const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${API_KEY}&units=metric`);
    const data = weatherRes.data;
    res.json({
      city: data.name, temperature: Math.round(data.main.temp),
      humidity: data.main.humidity, windSpeed: Math.round(data.wind.speed * 3.6),
      description: data.weather[0].description, icon: data.weather[0].icon,
      farmingTip: 'Monitor weather closely for optimal farming decisions.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch weather.', error: error.message });
  }
});

module.exports = router;