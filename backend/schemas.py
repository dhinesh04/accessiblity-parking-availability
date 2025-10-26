from pydantic import BaseModel
from typing import Optional

class ParkingLot(BaseModel):
    id: str
    lot_id: str
    lot_name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    total_accessible_spots: int
    occupied_accessible_spots: int
    available_accessible_spots: int
    updated_at: str

class UpdateOccupancyRequest(BaseModel):
    occupied_accessible_spots: int
