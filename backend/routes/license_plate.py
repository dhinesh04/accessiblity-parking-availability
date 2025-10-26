import io
from fastapi import APIRouter, UploadFile, Form, HTTPException
from models import fetch_lot_by_lot_id, update_lot_occupancy

router = APIRouter()


@router.post("/upload-plate")
async def upload_plate(file: UploadFile, lot_id: str = Form(...)):
    # Lazy-import heavy OCR dependencies so the backend can start without
    # them installed. If they are missing, return a 501 telling the caller
    # that OCR functionality isn't available in this environment.
    try:
        import cv2
        import easyocr
        import numpy as np
    except Exception as e:
        raise HTTPException(status_code=501, detail=f"OCR dependencies not installed: {e}")

    try:
        # instantiate reader lazily (costly, but only when endpoint used)
        reader = easyocr.Reader(["en"])

        # Read image bytes
        contents = await file.read()
        npimg = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        # Run OCR
        results = reader.readtext(img)

        # Combine detected text
        text_detected = " ".join([res[1] for res in results]).upper()
        print("Detected text:", text_detected)

        # Simple disabled-plate detection heuristic
        keywords = ["DISABLED", "HANDICAP", "HC", "WHEELCHAIR", "DP", "DISABILITY"]
        is_disabled = any(k in text_detected for k in keywords)

        if not is_disabled:
            return {"message": "No disabled license plate detected.", "detected_text": text_detected}

        # Fetch current lot data
        lot = fetch_lot_by_lot_id(lot_id)
        if not lot:
            raise HTTPException(status_code=404, detail="Lot not found")

        # Update counts
        occupied = lot["occupied_accessible_spots"] + 1
        available = max(0, lot["total_accessible_spots"] - occupied)
        updated = update_lot_occupancy(lot_id, occupied)

        return {
            "message": "Disabled license plate detected. Count updated.",
            "lot_id": lot_id,
            "detected_text": text_detected,
            "updated_counts": {
                "occupied_accessible_spots": occupied,
                "available_accessible_spots": available,
            },
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
