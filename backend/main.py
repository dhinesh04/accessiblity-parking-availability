import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List
from schemas import ParkingLot, UpdateOccupancyRequest
from models import fetch_lots, fetch_lot_by_lot_id, update_lot_occupancy
from dotenv import load_dotenv
from routes import license_plate
load_dotenv()

APP_ENV = os.getenv("APP_ENV", "local")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

app = FastAPI(title="OSU Accessible Parking API")

app.include_router(license_plate.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust if you want to lock to your Vite dev origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "env": APP_ENV}

@app.get("/config")
def get_config() -> Dict[str, str]:
    if not GOOGLE_MAPS_API_KEY:
        # You can still return empty and handle on FE
        return {"googleMapsApiKey": ""}
    return {"googleMapsApiKey": GOOGLE_MAPS_API_KEY}

@app.get("/lots", response_model=List[ParkingLot])
def get_lots():
    lots = fetch_lots()
    # If you want to support “mock mode when empty”, uncomment:
    # if not lots:
    #     return load_mock_lots()  # implement from your previous mock list
    return lots

@app.get("/lots/{lot_id}", response_model=ParkingLot)
def get_lot(lot_id: str):
    lot = fetch_lot_by_lot_id(lot_id)
    if not lot:
        raise HTTPException(status_code=404, detail="Lot not found")
    return lot

@app.post("/lots/{lot_id}/occupancy", response_model=ParkingLot)
def set_occupied(lot_id: str, payload: UpdateOccupancyRequest):
    if payload.occupied_accessible_spots < 0:
        raise HTTPException(status_code=400, detail="occupied must be >= 0")
    try:
        updated = update_lot_occupancy(lot_id, payload.occupied_accessible_spots)
        return updated
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
