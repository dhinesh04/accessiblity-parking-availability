import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ParkingLot } from "@/types/parking";
import { MapPin, Star } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

interface ParkingTableProps {
  lots: ParkingLot[];
  onLotClick: (lot: ParkingLot) => void;
}

export const ParkingTable = ({ lots, onLotClick }: ParkingTableProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const getAvailabilityBadge = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    
    if (percentage > 30) {
      return <Badge variant="outline" className="bg-success/10 text-success border-success/20" aria-label="Available parking">Available</Badge>;
    } else if (percentage > 10) {
      return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20" aria-label="Limited parking">Limited</Badge>;
    } else {
      return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20" aria-label="Parking full">Full</Badge>;
    }
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Favorite</TableHead>
            <TableHead className="font-semibold">Location</TableHead>
            <TableHead className="text-center font-semibold">Total Spots</TableHead>
            <TableHead className="text-center font-semibold">Occupied</TableHead>
            <TableHead className="text-center font-semibold">Available</TableHead>
            <TableHead className="text-center font-semibold">Status</TableHead>
            <TableHead className="text-center font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lots.map((lot) => (
            <TableRow 
              key={lot.lot_id}
              className="hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onLotClick(lot)}
              role="button"
              tabIndex={0}
              aria-label={`${lot.lot_name} - ${lot.available_accessible_spots} spots available`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onLotClick(lot);
                }
              }}
            >
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(lot.lot_id);
                  }}
                  aria-label={isFavorite(lot.lot_id) ? `Remove ${lot.lot_name} from favorites` : `Add ${lot.lot_name} to favorites`}
                  aria-pressed={isFavorite(lot.lot_id)}
                >
                  <Star
                    className={`h-4 w-4 ${
                      isFavorite(lot.lot_id) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                    }`}
                    aria-hidden="true"
                  />
                </Button>
              </TableCell>
              <TableCell className="font-medium">{lot.lot_name}</TableCell>
              <TableCell className="text-center">{lot.total_accessible_spots}</TableCell>
              <TableCell className="text-center">{lot.occupied_accessible_spots}</TableCell>
              <TableCell className="text-center font-semibold text-primary">
                {lot.available_accessible_spots}
              </TableCell>
              <TableCell className="text-center">
                {getAvailabilityBadge(lot.available_accessible_spots, lot.total_accessible_spots)}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="inline-flex items-center gap-1 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLotClick(lot);
                  }}
                  aria-label={`View ${lot.lot_name} on map`}
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
