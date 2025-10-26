# OSU Accessible Parking Tracker

A full-stack web application for monitoring accessible parking availability across garages and lots at The Ohio State University. The system provides an interactive map and table, polls a backend API for live status, and includes a computer-vision endpoint to recognize disabled license plates from uploaded images and update availability counts.

---

## Features

- Interactive Google Map with markers for all OSU garages/lots  
- Table view with status badges and aggregate statistics  
- Auto-refresh of parking data every 10 seconds  
- File upload “Detector” tab: run license plate OCR and update availability if a disabled plate is detected  
- FastAPI backend exposing a small REST API  
- Supabase (PostgreSQL) for persistent storage  
- Pretrained OCR model (EasyOCR) for rapid setup  

---

## Tech Stack

**Frontend:** React, Vite, TypeScript, TailwindCSS, shadcn/ui, @vis.gl/react-google-maps  
**Backend:** FastAPI, Uvicorn, EasyOCR, OpenCV, python-multipart  
**Database:** Supabase (PostgreSQL)

---

## Prerequisites

- Node.js 18+
- Python 3.10–3.12
- Supabase project (URL + service role key)
- Google Maps JavaScript API key

---

## Environment Variables

Create `backend/.env`:

SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>
APP_ENV=local

---


---

# Database (Supabase)/Backend/Frontend Setup 

```sql
create extension if not exists pgcrypto;

create table if not exists public.parking_lots (
  id uuid primary key default gen_random_uuid(),
  lot_id text unique not null,
  lot_name text not null,
  latitude double precision,
  longitude double precision,
  total_accessible_spots integer not null default 0,
  occupied_accessible_spots integer not null default 0,
  available_accessible_spots integer generated always as
    (greatest(total_accessible_spots - occupied_accessible_spots, 0)) stored,
  updated_at timestamptz not null default now(),
  check (total_accessible_spots >= 0),
  check (occupied_accessible_spots >= 0),
  check (occupied_accessible_spots <= total_accessible_spots)
);

---

# Backend Setup

cd backend
python -m venv env
source env/bin/activate        # Windows: env\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

--- 

# Frontend Setup

cd frontend
npm install
npm run dev