import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Navigation, 
  Footprints, 
  Lightbulb, 
  Shield, 
  Zap, 
  Star,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface AccessibilityScoreProps {
  lotId: string;
}

// Mock accessibility data - in production, this would come from backend
const accessibilityData: Record<string, {
  distanceScore: number; // 0-100
  pathQuality: number; // 0-100
  lightingQuality: number; // 0-100
  coveredParking: boolean;
  evCharging: boolean;
  notes: string[];
}> = {
  "12th_avenue": {
    distanceScore: 85,
    pathQuality: 90,
    lightingQuality: 95,
    coveredParking: true,
    evCharging: true,
    notes: ["Smooth paved path", "Well-lit 24/7", "EV chargers available"],
  },
  "medical_center": {
    distanceScore: 95,
    pathQuality: 100,
    lightingQuality: 100,
    coveredParking: true,
    evCharging: true,
    notes: ["Direct indoor access", "Hospital-grade lighting", "Multiple EV stations"],
  },
  "ohio_union_north": {
    distanceScore: 70,
    pathQuality: 85,
    lightingQuality: 80,
    coveredParking: false,
    evCharging: false,
    notes: ["Slight incline", "Good sidewalk condition"],
  },
};

export function AccessibilityScoreCard({ lotId }: AccessibilityScoreProps) {
  // Default data if lot not found
  const data = accessibilityData[lotId] || {
    distanceScore: 75,
    pathQuality: 75,
    lightingQuality: 75,
    coveredParking: false,
    evCharging: false,
    notes: ["Standard accessible parking"],
  };

  // Calculate overall score
  const overallScore = Math.round(
    (data.distanceScore * 0.3 +
      data.pathQuality * 0.3 +
      data.lightingQuality * 0.2 +
      (data.coveredParking ? 100 : 0) * 0.1 +
      (data.evCharging ? 100 : 0) * 0.1)
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-300";
    if (score >= 75) return "text-blue-600 bg-blue-50 border-blue-300";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-300";
    return "text-orange-600 bg-orange-50 border-orange-300";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Very Good";
    if (score >= 60) return "Good";
    return "Fair";
  };

  const metrics = [
    {
      icon: Navigation,
      label: "Distance to Entrance",
      score: data.distanceScore,
      description: data.distanceScore >= 80 ? "Very close" : data.distanceScore >= 60 ? "Moderate distance" : "Longer walk",
    },
    {
      icon: Footprints,
      label: "Path Quality",
      score: data.pathQuality,
      description: data.pathQuality >= 90 ? "Smooth, obstacle-free" : data.pathQuality >= 70 ? "Good condition" : "Some obstacles",
    },
    {
      icon: Lightbulb,
      label: "Lighting Quality",
      score: data.lightingQuality,
      description: data.lightingQuality >= 90 ? "Excellent visibility" : data.lightingQuality >= 70 ? "Well-lit" : "Adequate lighting",
    },
  ];

  return (
    <Card className="border-2 border-scarlet-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-scarlet-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield className="h-6 w-6 text-scarlet-600" aria-hidden="true" />
              Accessibility Score
            </CardTitle>
            <CardDescription>Comprehensive accessibility assessment</CardDescription>
          </div>
          <div className={`px-4 py-2 rounded-full border-2 ${getScoreColor(overallScore)}`}>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" aria-hidden="true" />
              <span className="text-2xl font-bold">{overallScore}</span>
              <span className="text-sm font-semibold">/100</span>
            </div>
            <p className="text-xs font-semibold text-center mt-1">{getScoreLabel(overallScore)}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-6">
        {/* Individual Metrics */}
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-gray-600" aria-hidden="true" />
                  <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                </div>
                <span className="text-sm font-bold text-scarlet-600">{metric.score}%</span>
              </div>
              <Progress value={metric.score} className="h-2" />
              <p className="text-xs text-gray-500">{metric.description}</p>
            </div>
          );
        })}

        {/* Additional Features */}
        <div className="pt-4 border-t border-gray-200 space-y-3">
          <h4 className="font-semibold text-sm text-gray-700">Additional Features</h4>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-600" aria-hidden="true" />
              <span className="text-sm font-medium">Covered Parking</span>
            </div>
            {data.coveredParking ? (
              <Badge className="bg-green-100 text-green-700 border border-green-300">
                <CheckCircle2 className="h-3 w-3 mr-1" aria-hidden="true" />
                Available
              </Badge>
            ) : (
              <Badge variant="outline" className="text-gray-600">
                <AlertCircle className="h-3 w-3 mr-1" aria-hidden="true" />
                Not Available
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-gray-600" aria-hidden="true" />
              <span className="text-sm font-medium">EV Charging</span>
            </div>
            {data.evCharging ? (
              <Badge className="bg-blue-100 text-blue-700 border border-blue-300">
                <CheckCircle2 className="h-3 w-3 mr-1" aria-hidden="true" />
                Available
              </Badge>
            ) : (
              <Badge variant="outline" className="text-gray-600">
                <AlertCircle className="h-3 w-3 mr-1" aria-hidden="true" />
                Not Available
              </Badge>
            )}
          </div>
        </div>

        {/* Notes */}
        {data.notes.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Notes</h4>
            <ul className="space-y-1">
              {data.notes.map((note, index) => (
                <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
