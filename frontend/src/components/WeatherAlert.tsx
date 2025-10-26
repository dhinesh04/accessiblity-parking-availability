import { useEffect, useState } from "react";
import { Cloud, CloudRain, CloudSnow, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WeatherData {
  temp: number;
  condition: string;
  alert?: string;
}

export function WeatherAlert() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated weather data (in production, use OpenWeatherMap API)
    // For demo purposes, we'll use mock data
    const mockWeather: WeatherData = {
      temp: 45, // Fahrenheit
      condition: "cloudy",
      alert: "Cold weather - use covered parking when possible",
    };

    // Simulate API call
    setTimeout(() => {
      setWeather(mockWeather);
      setLoading(false);
    }, 500);
  }, []);

  if (loading || !weather) return null;

  // Only show alert if weather is significant
  const shouldShowAlert = weather.temp < 50 || weather.condition.includes("rain") || weather.condition.includes("snow");

  if (!shouldShowAlert) return null;

  const getWeatherIcon = () => {
    if (weather.condition.includes("snow")) return <CloudSnow className="h-5 w-5" aria-hidden="true" />;
    if (weather.condition.includes("rain")) return <CloudRain className="h-5 w-5" aria-hidden="true" />;
    return <Cloud className="h-5 w-5" aria-hidden="true" />;
  };

  return (
    <Alert className="bg-yellow-50 border-yellow-300" role="alert">
      <AlertTriangle className="h-5 w-5 text-yellow-600" aria-hidden="true" />
      <AlertTitle className="text-yellow-800">Weather Advisory</AlertTitle>
      <AlertDescription className="flex items-center gap-2 text-yellow-700">
        {getWeatherIcon()}
        <span>{weather.alert || `${weather.temp}°F - ${weather.condition}`}</span>
      </AlertDescription>
    </Alert>
  );
}
