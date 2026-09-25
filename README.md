# 🍲 Surplus-to-Shelter (Food Rescue Hub)
### *AI-Powered Surplus Food Redistribution & Statutory Good Samaritan Compliance Platform*

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.115+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/Frontend-React_19_Vite-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/AI_Engine-Gemini_2.5_Flash_Lite-4285F4?style=flat&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![FSSAI 2019 Compliant](https://img.shields.io/badge/Statutory-FSSAI_2019_Good_Samaritan-065f46?style=flat&logo=shield&logoColor=white)](https://fssai.gov.in)
[![Twilio WhatsApp](https://img.shields.io/badge/Messaging-Twilio_WhatsApp_API-25D366?style=flat&logo=whatsapp&logoColor=white)](https://www.twilio.com)

---

## 📌 Problem Statement

Every day across Indian urban centers, **hundreds of tons of fresh cooked food and banquet surplus are thrown into landfills**, contributing significantly to methane emissions and resource waste. Concurrently, thousands of homeless shelters, orphanage clusters, and community kitchens struggle with daily food insecurity.

### Why doesn't surplus food reach those in need?
1. **Fear of Legal Liability:** Restaurants and caterers fear civil or criminal action if someone falls ill after consuming donated food.
2. **Logistical Decay:** Prepared hot meals spoil within 3 to 4 hours without immediate hot-hold or cold-chain dispatch.
3. **Impersonal & Robotic Outreach:** Cold automated donor requests are universally ignored by busy kitchen managers.
4. **Lack of Verifiable Audits:** Corporates and hotel chains cannot claim CSR deductions (Section 80G) or demonstrate ESG impact without certified proof.

---

## 💡 The Solution: Surplus-to-Shelter AI

**Surplus-to-Shelter** is an end-to-end emergency food rescue network bridging hotels, banquets, and restaurants with verified NGOs and volunteer drivers in real-time.

1. **AI Empathy Outreach (Google Gemini):** Generates warm, respectful, multilingual conversational messages to nearby restaurant managers instead of robotic alerts, boosting response rates.
2. **Dual-Party Confirmation Engine:** Enforces an immutable chain of custody with **Server Timestamp 1 (Donor Offer)** and **Server Timestamp 2 (NGO Physical Acceptance)**.
3. **Statutory FSSAI 2019 Immunity Certificate:** Automatically generates an authentic **Good Samaritan Liability Protection Certificate** under *Regulation 4 of the FSSAI (Recovery and Distribution of Surplus Food) Regulations, 2019* and *Section 80 of the Food Safety & Standards Act, 2006*.
4. **Turn-by-Turn Rescue Navigation:** Live Leaflet/GPS routing for volunteer drivers with temperature-controlled handling instructions.
5. **Instant WhatsApp Integration:** Delivers the signed, scannable PDF certificate straight to the donor's WhatsApp with a live tamper-proof QR code.

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph PresentationTier [" 🌐 1. Client & Presentation Layer (React 19 + Tailwind v4) "]
        UI_NGO["🏢 NGO Dashboard & Schedule Grid<br/><i>Nearby Map, Volunteer Calendar</i>"]
        UI_Driver["🚚 Volunteer Driver Portal<br/><i>Dispatch, Turn-by-Turn GPS Routes</i>"]
        UI_Admin["⚡ Admin Operations & Compliance<br/><i>Audit Ledger, CSR Metrics, Analytics</i>"]
        UI_Verify["📜 Public FSSAI Verification Portal<br/><i>Live QR Code, SHA-256 Authenticity</i>"]
    end

    subgraph APITier [" ⚡ 2. API Gateway & Micro-Routers (FastAPI / Uvicorn ASGI) "]
        Router_Auth["/api/v1/auth — JWT Auth & RBAC"]
        Router_Restaurants["/api/v1/restaurants — Discovery & Outreach"]
        Router_Certs["/api/v1/certificates — Dual Verification & PDF"]
        Router_NGOs["/api/v1/ngos — Shelter Clusters & Capacity"]
        Router_Verify["/api/v1/ngo-verification — DARPAN & FSSAI Check"]
    end

    subgraph CoreServices [" 🧠 3. Business Intelligence & Automation Layer "]
        Service_Gemini["🤖 Google Gemini 2.5 Flash Lite<br/><i>AI Contextual Empathy Outreach Engine</i>"]
        Service_Twilio["💬 Twilio WhatsApp Bot Gateway<br/><i>Bi-directional donor chats & PDF dispatch</i>"]
        Service_Cert["🛡️ FSSAI Certificate & Crypto Service<br/><i>Dual-Timestamp Lock & SHA-256 Hash</i>"]
        Service_PDF["📄 ReportLab Statutory PDF Engine<br/><i>Official Seals, Guilloche Frames & QR</i>"]
    end

    subgraph DataTier [" 💾 4. Persistence & Audit Tier "]
        DB_Postgres[("🐘 PostgreSQL Relational DB<br/><i>Users, Donations, Recipients, Logs</i>")]
        DB_Memory[("⚡ Immutable In-Memory Ledger<br/><i>Real-time certificate store fallback</i>")]
        Cloud_Storage["☁️ Public Storage CDN<br/><i>WhatsApp Deliverable Signed PDFs</i>"]
    end

    PresentationTier -->|REST API Calls & Axios| APITier
    APITier --> CoreServices
    CoreServices --> DataTier
```

---

## 🔄 End-to-End Operational Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Donor as 🍴 Donor (Restaurant/Banquet)
    participant WhatsApp as 💬 WhatsApp Bot (Twilio)
    participant FastAPI as ⚡ FastAPI Backend
    participant Gemini as 🤖 Google Gemini AI
    participant NGO as 🏢 NGO Field Team
    participant CertEngine as 🛡️ FSSAI Crypto Engine
    participant PDFEngine as 📄 ReportLab PDF Generator
    actor Auditor as ⚖️ FSSAI Food Inspector / Public

    Note over Donor, WhatsApp: 1. Surplus Discovery & Smart Outreach
    FastAPI->>Gemini: Generate warm, polite outreach prompt
    Gemini-->>FastAPI: Conversational Hindi/English message
    FastAPI->>WhatsApp: Send automated surplus check to nearby partner
    Donor->>WhatsApp: "Yes, 50 fresh meals available till 3 PM"

    Note over FastAPI, NGO: 2. Server Timestamp 1 & Shelter Dispatch
    WhatsApp->>FastAPI: Webhook: Donor Offer & Timestamp 1 recorded
    FastAPI->>NGO: Real-time notification on NGO Schedule Grid
    NGO->>FastAPI: Accept donation & assign volunteer (Timestamp 2)

    Note over FastAPI, CertEngine: 3. Cryptographic Dual-Party Sealing
    FastAPI->>CertEngine: Create FSSAI 2019 Good Samaritan Certificate
    CertEngine->>CertEngine: Compute SHA-256 tamper-proof hash
    CertEngine->>PDFEngine: Render authentic Government certificate
    PDFEngine-->>FastAPI: A4 Statutory PDF with Official Seals

    Note over WhatsApp, Donor: 4. Instant WhatsApp PDF Handover
    FastAPI->>WhatsApp: Deliver signed PDF + Live Verification Link to Donor
    WhatsApp-->>Donor: "Here is your FSSAI Immunity Protection Certificate."

    Note over Auditor, FastAPI: 5. Public & Regulatory Verification
    Auditor->>FastAPI: Scan QR code or visit /verify/{CERT-ID}
    FastAPI-->>Auditor: Return verified, tamper-proof audit record
```

---

## 🌟 Key Features

| Feature | Description |
| :--- | :--- |
| **🏢 NGO Schedule Grid & Hub** | Full-width interactive calendar for scheduling pickups, managing team assignments, and tracking surplus consignments in real-time. |
| **🗺️ Nearby Restaurant Discovery** | Interactive map view visualizing donors within a 1–5 km radius with one-click outreach triggers. |
| **🤖 Gemini AI Empathy Engine** | Dynamic AI messaging tailored by tone, distance, and meal category to ensure respectful communication with busy kitchen managers. |
| **🛡️ FSSAI 2019 Legal Protection** | Form C and Schedule-I compliant certificates granting civil and criminal liability immunity under Indian Food Safety laws. |
| **🔒 Cryptographic Tamper-Proofing** | SHA-256 digital signature locking timestamps, donor contact, and NGO DARPAN IDs. |
| **🚚 Driver Turn-by-Turn GPS** | Mobile-responsive dispatch portal with route navigation and safe handling guidelines. |
| **📱 WhatsApp Automation** | Automated chat flows for donor notification and instant dispatch of signed PDF certificates. |
| **📈 Impact & CSR Ledger** | Analytics dashboard quantifying meals rescued, carbon offset, and 80G tax deductions. |

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS v4, Vanilla CSS Design System
- **Icons & Visuals:** Lucide React, Canvas Confetti
- **Mapping & GIS:** Leaflet, React-Leaflet
- **QR Generation:** QRCodeSVG (`qrcode.react`)
- **Routing & State:** React Router v7, React Context API

### Backend
- **Framework:** Python 3.12+, FastAPI, Uvicorn ASGI
- **Validation & Models:** Pydantic v2, Pydantic-Settings
- **Security & Auth:** Passlib (bcrypt), Python-JOSE (JWT)
- **PDF Engine:** ReportLab 4.2+ (Official Government Guilloche borders, vector seals)
- **Database:** PostgreSQL (SQLAlchemy async engine) + In-memory resilience fallback
- **AI / LLM:** Google Gemini API (`gemini-2.5-flash-lite`) via HTTPX
- **Messaging:** Twilio REST API (WhatsApp Business Gateway)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **PostgreSQL** (Optional — platform includes automatic fallback storage)

---

### 2. Backend Setup

```bash
# Navigate to backend directory
cd AMIHACK/backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn app.main:app --reload --port 8000
```
Backend API will be running at: `http://localhost:8000`  
Interactive Swagger Docs: `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd AMIHACK/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend Web Application will be running at: `http://localhost:5173`

---

### 4. Environment Variables (`.env`)

Create a `.env` file in `AMIHACK/backend/`:

```env
APP_NAME=Surplus-to-Shelter API
PORT=8000
HOST=0.0.0.0
DEBUG=True
FRONTEND_URL=http://localhost:5173

# Database (PostgreSQL)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/surplus_to_shelter?schema=public

# Security
JWT_SECRET_KEY=surplus-to-shelter-secure-jwt-secret-key-2026-hackathon
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Google Gemini AI Key
GEMINI_API_KEY=your_gemini_api_key_here

# Twilio WhatsApp Credentials
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=+14155238886
DEFAULT_RESTAURANT_NUMBER=+919829407512
```

---

## ⚖️ Statutory Legal Compliance Notice

All donation protection certificates generated by the platform cite:
- **Food Safety and Standards (Recovery and Distribution of Surplus Food) Regulations, 2019** (Gazette Notification 26 July 2019).
- **Section 80 of the Food Safety and Standards Act, 2006** (Statutory Defense of Bona Fide Good-Faith Surplus Food Donation).
- **Sections 4 & 5 of the Information Technology Act, 2000** (Legal recognition of electronic records and digital timestamp signatures).

---

## 👥 Team Innovix
Developed with ❤️ for **AMI-Hackathon 2026**.
Dedicated to eradicating urban hunger through intelligent, trust-first technology.