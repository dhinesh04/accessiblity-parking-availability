import { useState, useEffect } from "react";
import { ParkingLot, ParkingStats } from "@/types/parking";
import { ParkingMap } from "@/components/ParkingMap";
import { ParkingTable } from "@/components/ParkingTable";
import { StatsCard } from "@/components/StatsCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { VoiceControlButton } from "@/components/VoiceControlButton";
import { EmergencyContact } from "@/components/EmergencyContact";
import { WeatherAlert } from "@/components/WeatherAlert";
import { PredictiveAvailability } from "@/components/PredictiveAvailability";
import { ParkingBuddySystem } from "@/components/ParkingBuddySystem";
import { AccessibilityScoreCard } from "@/components/AccessibilityScoreCard";
import { CampusCalendarAlert } from "@/components/CampusCalendarAlert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accessibility,
  ParkingSquare,
  TrendingUp,
  MapPin,
  RefreshCw,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { Detector } from "@/pages/Detector";
import { parkingLots as mockParkingLots } from "@/data/parkingLots";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useFavorites } from "@/hooks/useFavorites";

// ---- Backend base URL (edit if your backend runs elsewhere) ----
const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

// Default Google Maps API key for demo mode (replace with your own)
const DEMO_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

const Index = () => {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const [activeTab, setActiveTab] = useState("map");

  const { speak } = useTextToSpeech();
  const { favorites } = useFavorites();

  // Filter parking lots to show favorites first
  const sortedParkingLots = [...parkingLots].sort((a, b) => {
    const aIsFav = favorites.includes(a.lot_id);
    const bIsFav = favorites.includes(b.lot_id);
    if (aIsFav && !bIsFav) return -1;
    if (!aIsFav && bIsFav) return 1;
    return 0;
  });

  // ----- Fetch Google Maps key and parking data -----
  useEffect(() => {
    const init = async () => {
      try {
        // 1️⃣ Fetch Google Maps key from backend
        const keyRes = await fetch(`${API_BASE}/config`, { 
          signal: AbortSignal.timeout(3000) // 3 second timeout
        });
        const keyJson = await keyRes.json();
        if (keyJson.googleMapsApiKey) {
          setApiKey(keyJson.googleMapsApiKey);
        } else if (DEMO_API_KEY) {
          setApiKey(DEMO_API_KEY);
          toast.info("Using demo API key from environment");
        } else {
          toast.warning("Google Maps API key missing - map may not load");
        }
        setIsApiLoaded(true);

        // 2️⃣ Fetch parking lots
        await fetchLots();
      } catch (err) {
        console.error("Initialization error:", err);
        toast.warning("Backend offline - showing demo data", {
          description: "Connect to backend for live updates"
        });
        // Fall back to mock data
        setUseMockData(true);
        setParkingLots(mockParkingLots);
        if (DEMO_API_KEY) {
          setApiKey(DEMO_API_KEY);
        }
        setIsApiLoaded(true);
      }
    };
    init();
  }, []);

  // ----- Fetch all lots from backend -----
  const fetchLots = async () => {
    if (useMockData) {
      // When in mock mode, just refresh the timestamp
      setLastUpdate(new Date());
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE}/lots`, {
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      if (!res.ok) throw new Error("Failed to fetch parking lots");
      const data = await res.json();
      setParkingLots(data.length > 0 ? data : mockParkingLots);
      if (data.length === 0) {
        toast.info("No live data - showing demo parking lots");
        setUseMockData(true);
      }
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Fetch lots error:", err);
      if (!useMockData) {
        toast.warning("Using cached demo data");
        setParkingLots(mockParkingLots);
        setUseMockData(true);
      }
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
    speak(`Selected ${lot.lot_name}. ${lot.available_accessible_spots} accessible spots available.`);
  };

  // ----- Handle voice commands -----
  const handleVoiceCommand = (command: string, transcript: string) => {
    switch (command) {
      case 'search':
      case 'nearest':
        // Find nearest lot with available spots
        const available = sortedParkingLots.filter(lot => lot.available_accessible_spots > 0);
        if (available.length > 0) {
          const nearest = available[0];
          setSelectedLot(nearest);
          setActiveTab('map');
          speak(`Nearest available parking: ${nearest.lot_name} with ${nearest.available_accessible_spots} spots.`, { urgent: true });
          toast.success(`Found: ${nearest.lot_name}`);
        } else {
          speak('No available parking spots found at this time.');
          toast.info('No spots currently available');
        }
        break;
      
      case 'favorites':
        const favLots = sortedParkingLots.filter(lot => favorites.includes(lot.lot_id));
        if (favLots.length > 0) {
          setActiveTab('table');
          speak(`You have ${favLots.length} favorite locations.`);
          toast.info(`Showing ${favLots.length} favorites`);
        } else {
          speak('You have no favorite locations saved yet.');
          toast.info('No favorites yet');
        }
        break;
      
      case 'emergency':
      case 'help':
        setActiveTab('assistance');
        speak('Opening emergency contact and assistance options.', { urgent: true });
        break;
      
      case 'weather':
        speak('Weather information displayed at the top of the screen.');
        break;
      
      case 'refresh':
        handleRefresh();
        speak('Refreshing parking data.');
        break;
      
      default:
        toast.info(`Said: "${transcript}"`);
    }
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
            <VoiceControlButton onCommand={handleVoiceCommand} />
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="rounded-full"
              aria-label="Refresh parking data"
            >
              <RefreshCw
                className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Stats */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Weather Alert */}
        <WeatherAlert />

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="map" aria-label="Map view">Map View</TabsTrigger>
            <TabsTrigger value="table" aria-label="Table view">
              <Star className="h-4 w-4 mr-1 inline" aria-hidden="true" />
              Table View
            </TabsTrigger>
            <TabsTrigger value="assistance" aria-label="Assistance and emergency">Assistance</TabsTrigger>
            <TabsTrigger value="detector" aria-label="License plate detector">Detector</TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <div className="h-[600px] rounded-lg overflow-hidden border shadow-lg">
                    <ParkingMap
                      lots={sortedParkingLots}
                      apiKey={apiKey}
                      selectedLot={selectedLot}
                      onMarkerClick={handleLotClick}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  {selectedLot && (
                    <>
                      <AccessibilityScoreCard lotId={selectedLot.lot_id} />
                      <PredictiveAvailability lotId={selectedLot.lot_id} />
                      <EmergencyContact lot={selectedLot} />
                    </>
                  )}
                </div>
              </div>
              
              {/* Campus Calendar below the map */}
              <CampusCalendarAlert />
            </div>
          </TabsContent>

          <TabsContent value="table">
            <ParkingTable lots={sortedParkingLots} onLotClick={handleLotClick} />
          </TabsContent>

          <TabsContent value="assistance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <EmergencyContact lot={selectedLot} />
              <ParkingBuddySystem lot={selectedLot} />
            </div>
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
            {useMockData 
              ? "⚠️ Demo Mode - Connect backend for live data" 
              : "Data updates every 10 seconds • Live data from backend"}
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