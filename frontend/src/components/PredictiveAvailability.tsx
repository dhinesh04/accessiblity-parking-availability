import { Clock, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PredictiveAvailabilityProps {
  lotId: string;
}

// Mock historical data - in production, this would come from backend analytics
const historicalPatterns: Record<string, { peakHours: string; lowHours: string; trend: "high" | "medium" | "low" }> = {
  "12th_avenue": {
    peakHours: "8-10 AM, 12-2 PM",
    lowHours: "2-4 PM, 6-8 PM",
    trend: "high",
  },
  "medical_center": {
    peakHours: "7-11 AM",
    lowHours: "3-6 PM",
    trend: "high",
  },
  "ohio_union_north": {
    peakHours: "11 AM - 2 PM",
    lowHours: "Before 9 AM, After 5 PM",
    trend: "medium",
  },
};

export function PredictiveAvailability({ lotId }: PredictiveAvailabilityProps) {
  const pattern = historicalPatterns[lotId] || {
    peakHours: "8-10 AM, 12-2 PM",
    lowHours: "2-4 PM, After 6 PM",
    trend: "medium",
  };

  const currentHour = new Date().getHours();
  const isPeakTime = (currentHour >= 8 && currentHour <= 10) || (currentHour >= 12 && currentHour <= 14);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5" aria-hidden="true" />
          Typical Availability
        </CardTitle>
        <CardDescription>Based on historical patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2">
          <TrendingUp className="h-5 w-5 text-red-500 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-sm text-red-700">High Demand</p>
            <p className="text-sm text-muted-foreground">{pattern.peakHours}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <TrendingDown className="h-5 w-5 text-green-500 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-sm text-green-700">Usually Available</p>
            <p className="text-sm text-muted-foreground">{pattern.lowHours}</p>
          </div>
        </div>
        {isPeakTime && (
          <Alert className="bg-yellow-50 border-yellow-200 mt-2">
            <AlertDescription className="text-yellow-800 text-sm">
              ⚠️ Currently peak hours - consider alternative times or locations
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

// Import Alert component
import { Alert, AlertDescription } from "@/components/ui/alert";
