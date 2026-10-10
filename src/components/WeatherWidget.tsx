import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudFog, Wind, Droplets, Thermometer } from 'lucide-react';

interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  isDay: boolean;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      // Toshkent koordinatalari
      const lat = 41.2995;
      const lon = 69.2401;
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day&timezone=Asia/Tashkent`
      );
      
      if (!response.ok) throw new Error('Weather fetch failed');
      
      const data = await response.json();
      const current = data.current;
      
      setWeather({
        temperature: Math.round(current.temperature_2m),
        weatherCode: current.weather_code,
        windSpeed: Math.round(current.wind_speed_10m),
        humidity: current.relative_humidity_2m,
        isDay: current.is_day === 1,
      });
      setLoading(false);
    } catch (err) {
      console.error('Weather error:', err);
      setError(true);
      setLoading(false);
    }
  };

  const getWeatherInfo = (code: number, isDay: boolean) => {
    const weatherMap: Record<number, { icon: React.ReactNode; label: string; color: string }> = {
      0: { icon: isDay ? <Sun size={28} /> : <Sun size={28} />, label: 'Ochiq', color: isDay ? 'text-yellow-400' : 'text-blue-300' },
      1: { icon: <Sun size={28} />, label: 'Asosan ochiq', color: 'text-yellow-400' },
      2: { icon: <Cloud size={28} />, label: 'Qisman bulutli', color: 'text-gray-400' },
      3: { icon: <Cloud size={28} />, label: 'Bulutli', color: 'text-gray-400' },
      45: { icon: <CloudFog size={28} />, label: 'Tuman', color: 'text-gray-500' },
      48: { icon: <CloudFog size={28} />, label: 'Muzli tuman', color: 'text-gray-500' },
      51: { icon: <CloudRain size={28} />, label: 'Yengil yomg\'ir', color: 'text-blue-400' },
      53: { icon: <CloudRain size={28} />, label: 'O\'rtacha yomg\'ir', color: 'text-blue-400' },
      55: { icon: <CloudRain size={28} />, label: 'Kuchli yomg\'ir', color: 'text-blue-500' },
      61: { icon: <CloudRain size={28} />, label: 'Yomg\'ir', color: 'text-blue-400' },
      63: { icon: <CloudRain size={28} />, label: 'Kuchli yomg\'ir', color: 'text-blue-500' },
      65: { icon: <CloudRain size={28} />, label: 'Juda kuchli yomg\'ir', color: 'text-blue-600' },
      71: { icon: <CloudSnow size={28} />, label: 'Yengil qor', color: 'text-cyan-300' },
      73: { icon: <CloudSnow size={28} />, label: 'Qor', color: 'text-cyan-400' },
      75: { icon: <CloudSnow size={28} />, label: 'Kuchli qor', color: 'text-cyan-500' },
      80: { icon: <CloudRain size={28} />, label: 'Yomg\'irli shamol', color: 'text-blue-400' },
      95: { icon: <CloudLightning size={28} />, label: 'Momaqaldiroq', color: 'text-purple-400' },
      96: { icon: <CloudLightning size={28} />, label: 'Do\'l bilan momaqaldiroq', color: 'text-purple-500' },
    };
    return weatherMap[code] || { icon: <Cloud size={28} />, label: 'Noma\'lum', color: 'text-gray-400' };
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-sky-500/10 to-blue-500/10 rounded-2xl p-4 border border-sky-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Cloud size={16} className="text-sky-400 animate-pulse" />
          <span className="text-sm font-medium text-gray-300">Toshkent ob-havosi</span>
        </div>
        <div className="animate-pulse space-y-2">
          <div className="h-8 bg-gray-700 rounded w-24"></div>
          <div className="h-4 bg-gray-700 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-gradient-to-br from-sky-500/10 to-blue-500/10 rounded-2xl p-4 border border-sky-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Cloud size={16} className="text-sky-400" />
          <span className="text-sm font-medium text-gray-300">Toshkent ob-havosi</span>
        </div>
        <p className="text-xs text-gray-500">Ob-havo ma'lumotlarini yuklab bo'lmadi</p>
        <button
          onClick={fetchWeather}
          className="mt-2 text-xs text-sky-400 hover:text-sky-300"
        >
          Qayta urinish
        </button>
      </div>
    );
  }

  const weatherInfo = getWeatherInfo(weather.weatherCode, weather.isDay);

  return (
    <div className="bg-gradient-to-br from-sky-500/10 to-blue-500/10 rounded-2xl p-4 border border-sky-500/20">
      <div className="flex items-center gap-2 mb-3">
        <Cloud size={16} className="text-sky-400" />
        <span className="text-sm font-medium text-gray-300">Toshkent ob-havosi</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className={`${weatherInfo.color}`}>
          {weatherInfo.icon}
        </div>
        <div>
          <p className="text-3xl font-bold text-white">{weather.temperature}°C</p>
          <p className="text-xs text-gray-400">{weatherInfo.label}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-sky-500/10">
        <div className="flex items-center gap-1.5">
          <Wind size={12} className="text-gray-400" />
          <span className="text-xs text-gray-400">{weather.windSpeed} km/s</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Droplets size={12} className="text-gray-400" />
          <span className="text-xs text-gray-400">{weather.humidity}%</span>
        </div>
      </div>
    </div>
  );
}
