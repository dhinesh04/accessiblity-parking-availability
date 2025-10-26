import { useState, useEffect } from "react";
import { ParkingLot, ParkingStats } from "@/types/parking";
import { ParkingMap } from "@/components/ParkingMap";
import { ParkingTable } from "@/components/ParkingTable";
import { StatsCard } from "@/components/StatsCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accessibility,
  ParkingSquare,
  TrendingUp,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Detector } from "@/pages/Detector";

// ---- Backend base URL (edit if your backend runs elsewhere) ----
const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

const Index = () => {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ----- Fetch Google Maps key and parking data -----
  useEffect(() => {
    const init = async () => {
      try {
        // 1️⃣ Fetch Google Maps key from backend
        const keyRes = await fetch(`${API_BASE}/config`);
        const keyJson = await keyRes.json();
        if (keyJson.googleMapsApiKey) {
          setApiKey(keyJson.googleMapsApiKey);
          setIsApiLoaded(true);
        } else {
          toast.error("Google Maps API key missing from backend");
        }

        // 2️⃣ Fetch parking lots
        await fetchLots();
      } catch (err) {
        console.error("Initialization error:", err);
        toast.error("Failed to connect to backend");
      }
    };
    init();
  }, []);

  // ----- Fetch all lots from backend -----
  const fetchLots = async () => {
    try {
      const res = await fetch(`${API_BASE}/lots`);
      if (!res.ok) throw new Error("Failed to fetch parking lots");
      const data = await res.json();
      setParkingLots(data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Fetch lots error:", err);
      toast.error("Error fetching parking data");
    }
  };

  // ----- Auto refresh every 10 seconds -----
  useEffect(() => {
    if (!isApiLoaded) return;
    const interval = setInterval(() => {
      handleRefresh();
    }, 10000);
    return () => clearInterval(interval);
  }, [isApiLoaded]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLots();
    setIsRefreshing(false);
  };

  const handleLotClick = (lot: ParkingLot) => {
    setSelectedLot(selectedLot?.lot_id === lot.lot_id ? null : lot);
  };

  // ----- Compute summary stats -----
  const stats: ParkingStats = {
    totalLots: parkingLots.length,
    totalAccessibleSpots: parkingLots.reduce(
      (sum, lot) => sum + (lot.total_accessible_spots || 0),
      0
    ),
    totalOccupied: parkingLots.reduce(
      (sum, lot) => sum + (lot.occupied_accessible_spots || 0),
      0
    ),
    totalAvailable: parkingLots.reduce(
      (sum, lot) => sum + (lot.available_accessible_spots || 0),
      0
    ),
    occupancyRate: 0,
  };
  stats.occupancyRate =
    stats.totalAccessibleSpots > 0
      ? (stats.totalOccupied / stats.totalAccessibleSpots) * 100
      : 0;

  // ----- If API key not loaded yet -----
  if (!isApiLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading Google Maps and parking data...</p>
      </div>
    );
  }

  // ----- Render main UI -----
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Accessibility className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Accessible Parking Tracker</h1>
              <p className="text-sm text-muted-foreground">
                The Ohio State University
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-muted-foreground">Last updated</p>
              <p className="text-sm font-medium">
                {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="rounded-full"
            >
              <RefreshCw
                className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Stats */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Locations" value={stats.totalLots} icon={MapPin} />
          <StatsCard
            title="Total Accessible Spots"
            value={stats.totalAccessibleSpots}
            icon={ParkingSquare}
          />
          <StatsCard
            title="Available Now"
            value={stats.totalAvailable}
            icon={Accessibility}
            subtitle={`${stats.totalOccupied} occupied`}
          />
          <StatsCard
            title="Occupancy Rate"
            value={`${stats.occupancyRate.toFixed(1)}%`}
            icon={TrendingUp}
            subtitle={
              stats.occupancyRate > 80 ? "High demand" : "Moderate usage"
            }
          />
        </div>

        {/* Map & Table Tabs */}
        <Tabs defaultValue="map" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="detector">Detector</TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <div className="h-[600px] rounded-lg overflow-hidden border shadow-lg">
              <ParkingMap
                lots={parkingLots}
                apiKey={apiKey}
                selectedLot={selectedLot}
                onMarkerClick={handleLotClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="table">
            <ParkingTable lots={parkingLots} onLotClick={handleLotClick} />
          </TabsContent>

                  <TabsContent value="detector" className="space-y-4">
          <div className="p-6 border rounded-lg shadow-lg bg-card">
            <h2 className="text-xl font-semibold mb-4 text-center">License Plate Detector</h2>
            <Detector />
          </div>
        </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 mt-12">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            Data updates every 10 seconds • Live data from backend
          </p>
          <p className="text-sm text-muted-foreground">
            © 2025 The Ohio State University
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;