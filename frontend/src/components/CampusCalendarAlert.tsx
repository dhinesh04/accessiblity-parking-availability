import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Users, Trophy, GraduationCap, AlertTriangle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface CampusEvent {
  date: Date;
  title: string;
  type: "game" | "class" | "event";
  impact: "high" | "medium" | "low";
  description: string;
}

export function CampusCalendarAlert() {
  const [upcomingEvents, setUpcomingEvents] = useState<CampusEvent[]>([]);
  const [currentImpact, setCurrentImpact] = useState<"high" | "medium" | "low" | null>(null);

  useEffect(() => {
    // Mock campus events - in production, fetch from calendar API
    const today = new Date();
    const dayOfWeek = today.getDay();
    const hour = today.getHours();

    const mockEvents: CampusEvent[] = [];

    // Check for football game day (Saturday in fall)
    if (dayOfWeek === 6 && today.getMonth() >= 8 && today.getMonth() <= 11) {
      mockEvents.push({
        date: today,
        title: "OSU Football Game Day",
        type: "game",
        impact: "high",
        description: "Ohio Stadium - Expect very high parking demand. Arrive 3+ hours early.",
      });
    }

    // Class schedule impact (Monday-Friday, 8 AM - 5 PM)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      if (hour >= 6 && hour < 8) {
        mockEvents.push({
          date: today,
          title: "Early Morning - Low Demand",
          type: "class",
          impact: "low",
          description: "Great time to find parking! Most students haven't arrived yet.",
        });
      } else if (hour >= 8 && hour <= 10) {
        mockEvents.push({
          date: today,
          title: "Morning Class Rush",
          type: "class",
          impact: "high",
          description: "Peak class arrival time. Most garages near capacity.",
        });
      } else if (hour >= 11 && hour <= 14) {
        mockEvents.push({
          date: today,
          title: "Midday Classes",
          type: "class",
          impact: "medium",
          description: "Moderate parking demand throughout campus.",
        });
      } else if (hour >= 15 && hour <= 17) {
        mockEvents.push({
          date: today,
          title: "Afternoon Classes",
          type: "class",
          impact: "low",
          description: "Lower demand as many students are leaving campus.",
        });
      }
    }
    
    // Weekend notice
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      if (hour >= 6 && hour <= 22) {
        mockEvents.push({
          date: today,
          title: "Weekend - Reduced Demand",
          type: "event",
          impact: "low",
          description: "Great time for accessible parking! Most campus lots have high availability.",
        });
      }
    }

    // Special campus events (mock - would be from calendar API)
    // Always show some upcoming events for demo purposes
    const futureDate1 = new Date(today);
    futureDate1.setDate(today.getDate() + 1); // Tomorrow
    
    const futureDate2 = new Date(today);
    futureDate2.setDate(today.getDate() + 5); // In 5 days
    
    // Add upcoming football game (next Saturday)
    mockEvents.push({
      date: futureDate2,
      title: "OSU Football Game - Penn State",
      type: "game",
      impact: "high",
      description: "Ohio Stadium - Expect very high parking demand. Arrive 3+ hours early.",
    });
    
    // Add upcoming campus event
    mockEvents.push({
      date: futureDate1,
      title: "Career Fair - Ohio Union",
      type: "event",
      impact: "medium",
      description: "High visitor traffic expected in South Campus area.",
    });

    setUpcomingEvents(mockEvents);
    
    // Set current impact level
    const currentEvent = mockEvents.find(e => 
      e.date.toDateString() === today.toDateString()
    );
    if (currentEvent) {
      setCurrentImpact(currentEvent.impact);
    }
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />;
      case "medium":
        return <TrendingUp className="h-4 w-4" />;
      case "low":
        return <TrendingUp className="h-4 w-4 rotate-180" />;
      default:
        return null;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "game":
        return <Trophy className="h-5 w-5 text-scarlet-600" />;
      case "class":
        return <GraduationCap className="h-5 w-5 text-gray-600" />;
      case "event":
        return <Users className="h-5 w-5 text-blue-600" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-600" />;
    }
  };

  if (upcomingEvents.length === 0) {
    return null;
  }

  const todayEvents = upcomingEvents.filter(
    e => e.date.toDateString() === new Date().toDateString()
  );
  const futureEvents = upcomingEvents.filter(
    e => e.date.toDateString() !== new Date().toDateString()
  );

  return (
    <>
      {/* Current Day Alert */}
      {todayEvents.length > 0 && (
        <Alert 
          className={`border-2 ${
            currentImpact === 'high' 
              ? 'bg-red-50 border-red-300' 
              : currentImpact === 'medium'
              ? 'bg-yellow-50 border-yellow-300'
              : 'bg-blue-50 border-blue-300'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {getEventIcon(todayEvents[0].type)}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                {todayEvents[0].title}
                <Badge className={`${getImpactColor(todayEvents[0].impact)} border`}>
                  {getImpactIcon(todayEvents[0].impact)}
                  <span className="ml-1 uppercase text-xs font-bold">
                    {todayEvents[0].impact} Demand
                  </span>
                </Badge>
              </h3>
              <AlertDescription className="text-sm">
                {todayEvents[0].description}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      {/* Upcoming Events Card */}
      {futureEvents.length > 0 && (
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" aria-hidden="true" />
              Upcoming Campus Events
            </CardTitle>
            <CardDescription>Plan ahead for busy times</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {futureEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="mt-0.5">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm">{event.title}</h4>
                      <Badge className={`${getImpactColor(event.impact)} border text-xs`}>
                        {event.impact}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      {event.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-gray-700">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
