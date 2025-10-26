import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { ParkingLot } from "@/types/parking";
import { useState } from "react";
import { OSU_CENTER } from "@/data/parkingLots";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation } from "lucide-react";

interface ParkingMapProps {
  lots: ParkingLot[];
  apiKey: string;
  selectedLot: ParkingLot | null;
  onMarkerClick: (lot: ParkingLot) => void;
}

export const ParkingMap = ({ lots, apiKey, selectedLot, onMarkerClick }: ParkingMapProps) => {
  const [hoveredLot, setHoveredLot] = useState<string | null>(null);

  const getMarkerColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 30) return "#10b981"; // green
    if (percentage > 10) return "#f59e0b"; // orange
    return "#ef4444"; // red
  };

  const getStatusBadge = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 30) {
      return <Badge className="bg-success text-success-foreground">Available</Badge>;
    } else if (percentage > 10) {
      return <Badge className="bg-warning text-warning-foreground">Limited</Badge>;
    } else {
      return <Badge className="bg-destructive text-destructive-foreground">Full</Badge>;
    }
  };

  return (
    <APIProvider apiKey={apiKey}>
      <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
        <Map
          defaultCenter={OSU_CENTER}
          defaultZoom={15}
          mapId="osu-parking-map"
          disableDefaultUI={false}
          gestureHandling="greedy"
        >
          {lots.map((lot) => {
            const isSelected = selectedLot?.lot_id === lot.lot_id;
            const isHovered = hoveredLot === lot.lot_id;
            
            return (
              <AdvancedMarker
                key={lot.lot_id}
                position={{ lat: lot.latitude, lng: lot.longitude }}
                onClick={() => onMarkerClick(lot)}
                onMouseEnter={() => setHoveredLot(lot.lot_id)}
                onMouseLeave={() => setHoveredLot(null)}
              >
                <div className="relative">
                  <div
                    className={`transition-all duration-200 ${
                      isSelected || isHovered ? "scale-125" : "scale-100"
                    }`}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50% 50% 50% 0",
                      transform: "translate(-50%, -100%) rotate(-45deg)",
                      backgroundColor: getMarkerColor(
                        lot.available_accessible_spots,
                        lot.total_accessible_spots
                      ),
                      border: "3px solid white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        transform: "rotate(45deg)",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                    >
                      {lot.available_accessible_spots}
                    </span>
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}

          {selectedLot && (
            <InfoWindow
              position={{ lat: selectedLot.latitude, lng: selectedLot.longitude }}
              onCloseClick={() => onMarkerClick(selectedLot)}
            >
              <div className="p-3 min-w-[240px]">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-base text-foreground pr-2">
                    {selectedLot.lot_name}
                  </h3>
                  {getStatusBadge(
                    selectedLot.available_accessible_spots,
                    selectedLot.total_accessible_spots
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-foreground">Total Accessible:</span>
                    <span className="font-bold text-lg text-primary">
                      {selectedLot.total_accessible_spots}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-foreground">Occupied:</span>
                    <span className="font-bold text-lg text-primary">
                      {selectedLot.occupied_accessible_spots}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-foreground">Available:</span>
                    <span className="font-bold text-xl text-primary">
                      {selectedLot.available_accessible_spots}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${selectedLot.latitude},${selectedLot.longitude}`,
                      "_blank"
                    );
                  }}
                  className="mt-3 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </button>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
};
