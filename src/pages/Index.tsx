import { useState, useEffect } from "react";
import { ParkingLot, ParkingStats } from "@/types/parking";
import { parkingLots as initialParkingLots, updateParkingData } from "@/data/parkingLots";
import { ParkingMap } from "@/components/ParkingMap";
import { ParkingTable } from "@/components/ParkingTable";
import { StatsCard } from "@/components/StatsCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accessibility, 
  ParkingSquare, 
  TrendingUp, 
  MapPin,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>(initialParkingLots);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate overall stats
  const stats: ParkingStats = {
    totalLots: parkingLots.length,
    totalAccessibleSpots: parkingLots.reduce((sum, lot) => sum + lot.total_accessible_spots, 0),
    totalOccupied: parkingLots.reduce((sum, lot) => sum + lot.occupied_accessible_spots, 0),
    totalAvailable: parkingLots.reduce((sum, lot) => sum + lot.available_accessible_spots, 0),
    occupancyRate: 0,
  };
  stats.occupancyRate = (stats.totalOccupied / stats.totalAccessibleSpots) * 100;

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!isApiKeySet) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, 10000);

    return () => clearInterval(interval);
  }, [isApiKeySet]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setParkingLots((prevLots) => updateParkingData(prevLots));
    setLastUpdate(new Date());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setIsApiKeySet(true);
      toast.success("Google Maps loaded successfully!");
    } else {
      toast.error("Please enter a valid API key");
    }
  };

  const handleLotClick = (lot: ParkingLot) => {
    setSelectedLot(selectedLot?.lot_id === lot.lot_id ? null : lot);
  };

  if (!isApiKeySet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 bg-primary/10 rounded-full">
              <MapPin className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">OSU Parking Tracker</h1>
            <p className="text-muted-foreground">
              Enter your Google Maps API key to view accessible parking availability
            </p>
          </div>

          <div className="space-y-4 p-6 bg-card rounded-lg border shadow-md">
            <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-md">
              <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground">
                Get your API key from{" "}
                <a
                  href="https://console.cloud.google.com/google/maps-apis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Google Cloud Console
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter Google Maps API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApiKeySubmit()}
              />
              <Button onClick={handleApiKeySubmit} className="w-full">
                Load Map
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Accessibility className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Accessible Parking Tracker</h1>
                <p className="text-sm text-muted-foreground">The Ohio State University</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">Last updated</p>
                <p className="text-sm font-medium">{lastUpdate.toLocaleTimeString()}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="rounded-full"
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Locations"
            value={stats.totalLots}
            icon={MapPin}
            subtitle="Across campus"
          />
          <StatsCard
            title="Total Accessible Spots"
            value={stats.totalAccessibleSpots}
            icon={ParkingSquare}
            subtitle="Campus-wide"
          />
          <StatsCard
            title="Available Now"
            value={stats.totalAvailable}
            icon={Accessibility}
            subtitle={`${stats.totalOccupied} occupied`}
            trend={stats.totalAvailable > 50 ? "up" : stats.totalAvailable > 20 ? "neutral" : "down"}
          />
          <StatsCard
            title="Occupancy Rate"
            value={`${stats.occupancyRate.toFixed(1)}%`}
            icon={TrendingUp}
            subtitle={stats.occupancyRate > 80 ? "High demand" : "Moderate"}
            trend={stats.occupancyRate > 80 ? "up" : stats.occupancyRate > 50 ? "neutral" : "down"}
          />
        </div>

        {/* Map and Table Tabs */}
        <Tabs defaultValue="map" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-4">
            <div className="h-[600px] rounded-lg overflow-hidden border shadow-lg">
              <ParkingMap
                lots={parkingLots}
                apiKey={apiKey}
                selectedLot={selectedLot}
                onMarkerClick={handleLotClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="table" className="space-y-4">
            <ParkingTable lots={parkingLots} onLotClick={handleLotClick} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              Data updates every 10 seconds • Mock data for demonstration
            </p>
            <p className="text-sm text-muted-foreground">
              © 2025 The Ohio State University
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
