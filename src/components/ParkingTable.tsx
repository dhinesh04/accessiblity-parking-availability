import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ParkingLot } from "@/types/parking";
import { MapPin } from "lucide-react";

interface ParkingTableProps {
  lots: ParkingLot[];
  onLotClick: (lot: ParkingLot) => void;
}

export const ParkingTable = ({ lots, onLotClick }: ParkingTableProps) => {
  const getAvailabilityBadge = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    
    if (percentage > 30) {
      return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Available</Badge>;
    } else if (percentage > 10) {
      return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Limited</Badge>;
    } else {
      return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Full</Badge>;
    }
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
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
            >
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
                <button 
                  className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLotClick(lot);
                  }}
                >
                  <MapPin className="h-4 w-4" />
                  View
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
