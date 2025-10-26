# 🅿️ OSU Accessible Parking Tracker

> **A comprehensive accessibility-focused web application** for monitoring and finding accessible parking at The Ohio State University.

A full-stack solution designed specifically for students, faculty, and visitors with disabilities. Features real-time parking availability, voice control, predictive analytics, and comprehensive accessibility ratings to help users find the best parking spots with minimal friction.

---

## 🌟 Key Features

### 🗺️ **Core Functionality**
- **Interactive Google Map** - Real-time visualization of all OSU parking locations with color-coded availability markers
- **Smart Table View** - Sortable data with favorites-first ordering and detailed status information
- **Live Updates** - Auto-refresh every 10 seconds to show current parking availability
- **License Plate Detection** - Computer vision OCR to automatically update parking counts from uploaded images

### ♿ **Advanced Accessibility Features**

#### 🎤 **Voice Control System**
Navigate hands-free with 8 voice commands:
- `"find parking"` - Shows nearest available spots
- `"show favorites"` - Displays saved locations
- `"call emergency"` - Quick dial to OSU parking services
- `"refresh"` - Updates parking data
- `"weather"` - Current weather conditions
- `"nearest"` - Finds closest accessible parking
- `"help"` - Lists all available commands

#### 🔊 **Text-to-Speech Announcements**
- Audible notifications for parking updates
- Urgent voice alerts for emergencies
- Screen reader compatible throughout

#### ⭐ **Favorites System**
- Save frequently used parking locations
- Quick access to preferred spots
- Persistent storage across sessions

#### 🆘 **Emergency Contact**
- One-tap calling to OSU Parking Services: **(614) 292-4636**
- SMS messaging option
- Quick access emergency button in header

#### 🌤️ **Weather Integration**
- Real-time weather alerts
- Covered parking recommendations in bad weather
- Cold/snow advisories for accessibility planning

#### 📊 **Predictive Availability**
- Historical pattern analysis
- Peak hour predictions (morning rush, midday, afternoon)
- Time-based availability forecasts

#### 🤝 **Parking Buddy System**
Request volunteer assistance for:
- Vehicle navigation to accessible spots
- Door assistance getting in/out
- Walking assistance to building entrance
- Heavy item carrying (groceries, equipment)

#### ⚡ **Accessibility Score Card**
Comprehensive rating system for each parking lot based on:
- **Distance to Entrance** (30% weight) - Proximity to building entrances
- **Path Quality** (30% weight) - Smooth surfaces, no obstacles
- **Lighting Quality** (20% weight) - Well-lit for safety
- **Covered Parking** (10% weight) - Weather protection
- **EV Charging** (10% weight) - Electric vehicle accessibility

Visual indicators with star ratings, progress bars, and detailed notes.

#### 📅 **Campus Calendar Integration**
Smart parking demand predictions based on:
- **Football Game Days** - High demand alerts for Ohio Stadium events
- **Class Schedules** - Peak hour warnings (8-10 AM rush, midday, afternoon)
- **Campus Events** - Special event parking advisories (graduations, conferences)
- **Weekend Status** - Reduced demand notifications

Shows current day alerts and upcoming events to help plan visits.

---

## 🎯 User Interface Highlights

### 📱 **Four Main Tabs**
1. **Map View** - Interactive map with accessibility scores and calendar alerts
2. **Table View** - Sortable list with favorites starred at the top
3. **Assistance** - Emergency contacts and parking buddy requests
4. **Detector** - Upload photos for license plate recognition

### 🎨 **Design Features**
- Clean, intuitive interface with large touch targets
- High contrast for visibility
- ARIA labels throughout for screen readers
- Keyboard navigation support (Tab, Enter, Space)
- Dark mode compatible
- Responsive design for mobile and desktop

---

## 🛠️ Tech Stack

**Frontend:**
- React 18.3 with TypeScript
- Vite 5.4 - Fast development server with HMR
- TailwindCSS 3.4 - Utility-first styling
- shadcn/ui - Accessible component library (Radix UI)
- @vis.gl/react-google-maps - Interactive mapping
- Web Speech API - Voice recognition and synthesis

**Backend:**
- FastAPI - Modern Python web framework
- Uvicorn - ASGI server
- EasyOCR - License plate recognition
- OpenCV - Image processing
- python-multipart - File upload handling

**Database:**
- Supabase (PostgreSQL) - Real-time data with graceful fallback

**Additional Libraries:**
- Lucide React - Accessible icons
- Sonner - Toast notifications
- date-fns - Date utilities

---

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10, 3.11, or 3.12
- **Supabase Project** (optional - app works with demo data)
  - Project URL
  - Service role key
- **Google Maps API Key** (optional - defaults provided)

---

## ⚙️ Environment Variables

### Backend Setup
Create `backend/.env`:

```env
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>
APP_ENV=local
```

### Frontend Setup
Create `frontend/.env`:

```env
VITE_API_BASE=http://127.0.0.1:8000
VITE_GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>
```

> **Note:** The app includes fallback demo data and will work without Supabase configured.

---

## 🗄️ Database Setup (Optional)

If using Supabase, run this SQL to create the table:

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
```

---

## 🚀 Quick Start

### 1️⃣ Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Backend will run at:** `http://127.0.0.1:8000`

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

**Frontend will run at:** `http://localhost:8080` (or next available port)

### 3️⃣ Access the App

Open your browser to the frontend URL and start using the accessible parking tracker!

---

## 📖 Usage Guide

### 🎙️ **Using Voice Commands**
1. Click the red microphone button in the header
2. Allow microphone permissions when prompted
3. Say a command like "find parking" or "show favorites"
4. Listen for voice confirmation

### ⭐ **Saving Favorites**
1. Go to the Table View tab
2. Click the star icon next to any parking lot
3. Favorites will appear at the top of the list
4. Data persists in browser localStorage

### 📊 **Viewing Accessibility Scores**
1. Click on any parking lot marker on the map
2. View the Accessibility Score Card in the right sidebar
3. See ratings for distance, path quality, lighting, and amenities
4. Read detailed notes about accessibility features

### 📅 **Checking Campus Events**
1. Scroll to the top of the Map View
2. See current day parking demand status
3. View upcoming events that may impact parking
4. Plan your visit accordingly

### 🤝 **Requesting Parking Assistance**
1. Go to the Assistance tab
2. Select a parking lot
3. Click "Request Assistance"
4. Choose the type of help needed
5. A volunteer will be notified

---

## 🏗️ Project Structure

```
accessiblity-parking-availability/
├── backend/
│   ├── main.py                  # FastAPI application entry
│   ├── db.py                    # Supabase connection with fallback
│   ├── models.py                # Pydantic data models
│   ├── schemas.py               # API schemas
│   ├── routes/
│   │   └── license_plate.py     # OCR endpoint
│   └── requirements.txt         # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ParkingMap.tsx              # Interactive map
│   │   │   ├── ParkingTable.tsx            # Data table with favorites
│   │   │   ├── StatsCard.tsx               # Statistics display
│   │   │   ├── VoiceControlButton.tsx      # Voice command UI
│   │   │   ├── EmergencyContact.tsx        # Quick dial/SMS
│   │   │   ├── WeatherAlert.tsx            # Weather notifications
│   │   │   ├── PredictiveAvailability.tsx  # Time-based predictions
│   │   │   ├── ParkingBuddySystem.tsx      # Assistance requests
│   │   │   ├── AccessibilityScoreCard.tsx  # Lot ratings
│   │   │   └── CampusCalendarAlert.tsx     # Event notifications
│   │   ├── hooks/
│   │   │   ├── useVoiceControl.ts          # Web Speech API
│   │   │   ├── useTextToSpeech.ts          # Voice synthesis
│   │   │   └── useFavorites.ts             # localStorage management
│   │   ├── pages/
│   │   │   ├── Index.tsx                   # Main dashboard
│   │   │   ├── Detector.tsx                # License plate upload
│   │   │   └── NotFound.tsx                # 404 page
│   │   └── data/
│   │       └── parkingLots.ts              # Demo/fallback data
│   ├── package.json
│   └── vite.config.ts
│
├── ACCESSIBILITY_FEATURES.md   # Technical documentation
├── USER_GUIDE.md              # End-user instructions
└── README.md                  # This file
```

---

## 🔌 API Endpoints

### **GET** `/health`
Health check endpoint
```json
{ "status": "healthy" }
```

### **GET** `/config`
Returns Google Maps API key for frontend

### **GET** `/lots`
Returns all parking lots with availability data
```json
[
  {
    "lot_id": "12th_avenue",
    "lot_name": "12th Avenue Garage",
    "latitude": 40.0067,
    "longitude": -83.0305,
    "total_accessible_spots": 15,
    "occupied_accessible_spots": 8,
    "available_accessible_spots": 7
  }
]
```

### **POST** `/detect`
Upload image for license plate OCR
- **Body:** `multipart/form-data` with `file` field
- **Returns:** Detected plate and updated availability

---

## 🎓 Accessibility Compliance

This application follows **WCAG 2.1 Level AA** guidelines:

✅ **Perceivable**
- Text alternatives for all images and icons
- Color is not the only means of conveying information
- Content is readable with 200% zoom
- High contrast ratios throughout

✅ **Operable**
- All functionality available via keyboard
- No keyboard traps
- Sufficient time for interactions
- Clear focus indicators

✅ **Understandable**
- Consistent navigation and layout
- Error identification and suggestions
- Clear labels and instructions
- Predictable interface behavior

✅ **Robust**
- Compatible with screen readers (NVDA, JAWS, VoiceOver)
- Semantic HTML structure
- ARIA landmarks and roles
- Works across modern browsers

---

## 🤝 Contributing

We welcome contributions to improve accessibility! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Test with screen readers and keyboard navigation
4. Commit with clear messages (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **The Ohio State University** - Campus parking data and support
- **shadcn/ui** - Accessible component library
- **Radix UI** - Primitive accessible components
- **Web Speech API** - Voice control functionality
- **EasyOCR** - License plate recognition
- **OpenStreetMap contributors** - Mapping data

---

## 📞 Support

For questions or issues:
- 📧 Email: parking@osu.edu
- 📞 Phone: (614) 292-4636
- 🌐 Web: https://osu.edu/parking

For technical issues, please open a GitHub issue.

---

## 🚧 Roadmap

### Upcoming Features
- [ ] Push notifications for parking availability
- [ ] Real-time occupancy sensors integration
- [ ] Mobile app (iOS/Android)
- [ ] Integration with OSU Buckeye ID system
- [ ] Historical analytics dashboard
- [ ] Multi-language support
- [ ] Indoor navigation to accessible spots
- [ ] Parking reservation system
- [ ] Weather-based route suggestions

---

**Made with ❤️ for accessibility at The Ohio State University**