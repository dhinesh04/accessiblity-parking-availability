from typing import List, Optional, Dict, Any
from db import supabase

def fetch_lots() -> List[Dict[str, Any]]:
    print("DEBUG: Fetching all lots from Supabase...")
    res = supabase.table("parking_lots").select("*").order("lot_name").execute()
    print("DEBUG: Supabase response =", res)
    return res.data or []

def fetch_lot_by_lot_id(lot_id: str) -> Optional[Dict[str, Any]]:
    print("DEBUG: Fetching lot", lot_id)
    res = supabase.table("parking_lots").select("*").eq("lot_id", lot_id).single().execute()
    print("DEBUG: Supabase response =", res)
    return res.data

def update_lot_occupancy(lot_id: str, occupied: int) -> Dict[str, Any]:
    # Note: available_accessible_spots is generated; we just update occupied
    res = supabase.table("parking_lots") \
        .update({"occupied_accessible_spots": occupied}) \
        .eq("lot_id", lot_id) \
        .execute()
    if not res.data:
        raise ValueError("Update failed or lot not found")
    return res.data[0]
