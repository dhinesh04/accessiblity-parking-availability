import { ParkingLot } from "@/types/parking";

// OSU Campus center coordinates
export const OSU_CENTER = {
  lat: 40.0067,
  lng: -83.0305,
};

// Mock data for all 20 OSU parking lots
export const parkingLots: ParkingLot[] = [
  {
    lot_id: "12th_avenue",
    lot_name: "12th Avenue Garage",
    total_accessible_spots: 15,
    occupied_accessible_spots: 8,
    available_accessible_spots: 7,
    latitude: 40.0067,
    longitude: -83.0305,
  },
  {
    lot_id: "9th_avenue_east",
    lot_name: "9th Avenue East Garage",
    total_accessible_spots: 12,
    occupied_accessible_spots: 10,
    available_accessible_spots: 2,
    latitude: 40.0015,
    longitude: -83.0145,
  },
  {
    lot_id: "9th_avenue_west",
    lot_name: "9th Avenue West Garage",
    total_accessible_spots: 10,
    occupied_accessible_spots: 5,
    available_accessible_spots: 5,
    latitude: 40.0018,
    longitude: -83.0195,
  },
  {
    lot_id: "safeauto",
    lot_name: "SAFEAUTO Garage",
    total_accessible_spots: 18,
    occupied_accessible_spots: 12,
    available_accessible_spots: 6,
    latitude: 40.0012,
    longitude: -83.0168,
  },
  {
    lot_id: "medical_center",
    lot_name: "Medical Center Garage",
    total_accessible_spots: 25,
    occupied_accessible_spots: 22,
    available_accessible_spots: 3,
    latitude: 40.0009,
    longitude: -83.0321,
  },
  {
    lot_id: "old_cannon",
    lot_name: "Old Cannon Garage",
    total_accessible_spots: 8,
    occupied_accessible_spots: 3,
    available_accessible_spots: 5,
    latitude: 40.0098,
    longitude: -83.0289,
  },
  {
    lot_id: "neil_avenue",
    lot_name: "Neil Avenue Garage",
    total_accessible_spots: 14,
    occupied_accessible_spots: 9,
    available_accessible_spots: 5,
    latitude: 40.0076,
    longitude: -83.0145,
  },
  {
    lot_id: "11th_avenue",
    lot_name: "11th Avenue Garage",
    total_accessible_spots: 11,
    occupied_accessible_spots: 7,
    available_accessible_spots: 4,
    latitude: 40.0087,
    longitude: -83.0278,
  },
  {
    lot_id: "ohio_union_north",
    lot_name: "Ohio Union North Garage",
    total_accessible_spots: 12,
    occupied_accessible_spots: 8,
    available_accessible_spots: 4,
    latitude: 40.0045,
    longitude: -83.0147,
  },
  {
    lot_id: "ohio_union_south",
    lot_name: "Ohio Union South Garage",
    total_accessible_spots: 10,
    occupied_accessible_spots: 6,
    available_accessible_spots: 4,
    latitude: 40.0038,
    longitude: -83.0149,
  },
  {
    lot_id: "gateway",
    lot_name: "Gateway Garage",
    total_accessible_spots: 16,
    occupied_accessible_spots: 11,
    available_accessible_spots: 5,
    latitude: 40.0003,
    longitude: -83.0098,
  },
  {
    lot_id: "tuttle",
    lot_name: "Tuttle Garage",
    total_accessible_spots: 13,
    occupied_accessible_spots: 8,
    available_accessible_spots: 5,
    latitude: 40.0089,
    longitude: -83.0321,
  },
  {
    lot_id: "northwest",
    lot_name: "Northwest Garage",
    total_accessible_spots: 9,
    occupied_accessible_spots: 4,
    available_accessible_spots: 5,
    latitude: 40.0112,
    longitude: -83.0334,
  },
  {
    lot_id: "arps",
    lot_name: "Arps Garage",
    total_accessible_spots: 11,
    occupied_accessible_spots: 7,
    available_accessible_spots: 4,
    latitude: 40.0054,
    longitude: -83.0198,
  },
  {
    lot_id: "lane_avenue",
    lot_name: "Lane Avenue Garage",
    total_accessible_spots: 14,
    occupied_accessible_spots: 10,
    available_accessible_spots: 4,
    latitude: 40.0098,
    longitude: -83.0254,
  },
  {
    lot_id: "west_lane_avenue",
    lot_name: "West Lane Avenue Garage",
    total_accessible_spots: 12,
    occupied_accessible_spots: 5,
    available_accessible_spots: 7,
    latitude: 40.0101,
    longitude: -83.0389,
  },
  {
    lot_id: "james_outpatient",
    lot_name: "James Outpatient Care Garage",
    total_accessible_spots: 20,
    occupied_accessible_spots: 16,
    available_accessible_spots: 4,
    latitude: 40.0003,
    longitude: -83.0356,
  },
  {
    lot_id: "carmack_2_3",
    lot_name: "Carmack Lot 2/3",
    total_accessible_spots: 8,
    occupied_accessible_spots: 3,
    available_accessible_spots: 5,
    latitude: 40.0123,
    longitude: -83.0301,
  },
  {
    lot_id: "carmack_4",
    lot_name: "Carmack Lot 4",
    total_accessible_spots: 6,
    occupied_accessible_spots: 2,
    available_accessible_spots: 4,
    latitude: 40.0127,
    longitude: -83.0287,
  },
  {
    lot_id: "carmack_5",
    lot_name: "Carmack Lot 5",
    total_accessible_spots: 7,
    occupied_accessible_spots: 4,
    available_accessible_spots: 3,
    latitude: 40.0131,
    longitude: -83.0276,
  },
];

// Function to simulate random updates
export const updateParkingData = (lots: ParkingLot[]): ParkingLot[] => {
  return lots.map((lot) => {
    // Randomly change occupancy by -2 to +2
    const change = Math.floor(Math.random() * 5) - 2;
    const newOccupied = Math.max(
      0,
      Math.min(lot.total_accessible_spots, lot.occupied_accessible_spots + change)
    );
    
    return {
      ...lot,
      occupied_accessible_spots: newOccupied,
      available_accessible_spots: lot.total_accessible_spots - newOccupied,
    };
  });
};
