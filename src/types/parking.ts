export interface ParkingLot {
  lot_id: string;
  lot_name: string;
  total_accessible_spots: number;
  occupied_accessible_spots: number;
  available_accessible_spots: number;
  latitude: number;
  longitude: number;
}

export interface ParkingStats {
  totalLots: number;
  totalAccessibleSpots: number;
  totalOccupied: number;
  totalAvailable: number;
  occupancyRate: number;
}
