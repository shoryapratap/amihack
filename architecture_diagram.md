# 🏗️ Surplus-to-Shelter (Innovix) — System Architecture

An end-to-end architectural overview of the **Surplus-to-Shelter AI Ecosystem**, designed for high-speed surplus food rescue, dual-party verification, and statutory Good Samaritan liability protection under FSSAI 2019 regulations.

---

## 1. High-Level Multi-Tier Architecture Diagram

```mermaid
graph TB
    %% ==========================================
    %% CLIENT & PRESENTATION TIER
    %% ==========================================
    subgraph PresentationTier [" 🌐 1. Client & Presentation Layer (React 19 + Vite + Tailwind v4) "]
        UI_NGO["🏢 NGO Dashboard & Schedule Grid<br/><i>Nearby Restaurants, Mapbox/Leaflet</i>"]
        UI_Driver["🚚 Volunteer Driver Portal<br/><i>Dispatch, Turn-by-Turn GPS Routes</i>"]
        UI_Admin["⚡ Admin Operations & Compliance<br/><i>Audit Ledger, CSR Metrics, Analytics</i>"]
        UI_Verify["📜 Public FSSAI Verification Portal<br/><i>Live QR Code, SHA-256 Authenticity</i>"]
        UI_Auth["🔐 Role-Based Gate & Auth<br/><i>JWT Session, Multi-Role Switcher</i>"]
    end

    %% ==========================================
    %% API GATEWAY & APPLICATION TIER
    %% ==========================================
    subgraph APITier [" ⚡ 2. API Gateway & Micro-Routers (FastAPI / Uvicorn ASGI) "]
        Router_Auth["/api/v1/auth<br/>JWT Auth, User Profiles"]
        Router_Restaurants["/api/v1/restaurants<br/>Nearby Food Discovery, Outreach"]
        Router_Certs["/api/v1/certificates<br/>Dual-Party Verification & PDF Gen"]
        Router_NGOs["/api/v1/ngos<br/>Shelter Clusters & Capacity"]
        Router_Verify["/api/v1/ngo-verification<br/>DARPAN & FSSAI Registry Check"]
        Router_Admin["/api/v1/admin<br/>System Metrics & Master Controls"]
    end

    %% ==========================================
    %% BUSINESS LOGIC & INTELLIGENCE LAYER
    %% ==========================================
    subgraph CoreServices [" 🧠 3. Business Intelligence & Automation Layer "]
        Service_Gemini["🤖 Google Gemini 2.5 Flash Lite<br/><i>AI Contextual Empathy Outreach Engine</i>"]
        Service_Twilio["💬 Twilio WhatsApp Bot Gateway<br/><i>Bi-directional donor chats & PDF dispatch</i>"]
        Service_Cert["🛡️ FSSAI Certificate & Crypto Service<br/><i>Dual-Timestamp Lock & SHA-256 Hash</i>"]
        Service_PDF["📄 ReportLab Statutory PDF Engine<br/><i>Official Seals, Guilloche Frames & QR</i>"]
        Service_DARPAN["🏛️ NITI Aayog DARPAN Validator<br/><i>NGO Legitimacy & Tax Exemption Audit</i>"]
        Service_FSSAI["🥗 FSSAI Schedule-1 Inspector<br/><i>Temperature & GHP Hygiene Check</i>"]
    end

    %% ==========================================
    %% PERSISTENCE & AUDIT TIER
    %% ==========================================
    subgraph DataTier [" 💾 4. Persistence, Cache & Compliance Ledger "]
        DB_Postgres[("🐘 PostgreSQL Relational DB<br/><i>Users, Donations, Recipients, Logs</i>")]
        DB_Memory[("⚡ Immutable In-Memory Ledger<br/><i>Real-time certificate store fallback</i>")]
        Cloud_Storage["☁️ Public Storage CDN<br/><i>WhatsApp Deliverable Signed PDFs</i>"]
    end

    %% ==========================================
    %% EXTERNAL INTERFACES
    %% ==========================================
    subgraph ExternalEcosystem [" 🌍 5. External Ecosystem & Regulatory Bodies "]
        Ext_FBO["🍴 Donors (Hotels, Banquets, Restaurants)"]
        Ext_WhatsApp["📱 WhatsApp End-Users (Donors & Volunteers)"]
        Ext_Govt["⚖️ FSSAI & District Food Safety Officers"]
    end

    %% CONNECTIONS
    PresentationTier -->|REST API Calls & Axios /api.js| APITier
    
    APITier --> Router_Auth
    APITier --> Router_Restaurants
    APITier --> Router_Certs
    APITier --> Router_NGOs
    APITier --> Router_Verify
    APITier --> Router_Admin

    Router_Restaurants --> Service_Gemini
    Router_Restaurants --> Service_Twilio
    Router_Certs --> Service_Cert
    Router_Certs --> Service_PDF
    Router_Verify --> Service_DARPAN
    Router_Verify --> Service_FSSAI

    Service_Cert --> DB_Postgres
    Service_Cert --> DB_Memory
    Service_PDF --> Cloud_Storage
    Router_Auth --> DB_Postgres

    Service_Twilio <-->|Webhook API| Ext_WhatsApp
    Ext_WhatsApp <--> Ext_FBO
    UI_Verify <-->|Public QR Scan| Ext_Govt
```

---

## 2. End-to-End Operational Lifecycle & Sequence Flow

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

    Note over Donor, WhatsApp: Step 1: Surplus Discovery & Smart Outreach
    FastAPI->>Gemini: Request personalized, empathetic outreach prompt
    Gemini-->>FastAPI: Warm conversational Hindi/English message
    FastAPI->>WhatsApp: Send automated surplus check to nearby restaurants
    Donor->>WhatsApp: "Yes, 50 cooked meals available till 3 PM"

    Note over FastAPI, NGO: Step 2: Timestamp Lock 1 & NGO Dispatch
    WhatsApp->>FastAPI: Webhook payload (Timestamp 1: Donor Offer recorded)
    FastAPI->>NGO: Real-time alert on NGO Dashboard (/ngo/dashboard)
    NGO->>FastAPI: Accept rescue & assign volunteer driver (Timestamp 2: Shelter Acceptance)

    Note over FastAPI, CertEngine: Step 3: Cryptographic Dual-Party Sealing
    FastAPI->>CertEngine: Create FSSAI 2019 Good Samaritan Certificate
    CertEngine->>CertEngine: Generate SHA-256 Tamper-Proof Cryptographic Hash
    CertEngine->>PDFEngine: Build statutory Certificate (Emblem of India + FSSAI Seal)
    PDFEngine-->>FastAPI: Output signed, scannable PDF (A4 format)

    Note over WhatsApp, Donor: Step 4: Instant Legal Immunity Handover
    FastAPI->>WhatsApp: Dispatch signed PDF + Live Verification Link to Donor
    WhatsApp-->>Donor: "Thank you! Your FSSAI 2019 Immunity Certificate is ready."

    Note over Auditor, FastAPI: Step 5: Public & Regulatory Verification
    Auditor->>FastAPI: Scan QR Code or visit /verify/{CERT-ID}
    FastAPI-->>Auditor: Return 100% verified, immutable ledger record & GHP checklist
```

---

## 3. Component Breakdown & Technology Stack

| Layer | Technologies Used | Key Responsibilities |
| :--- | :--- | :--- |
| **Frontend UI** | React 19, Vite, Vanilla CSS + Tailwind v4, Lucide React, Leaflet Maps, QRCodeSVG | Interactive dashboard, calendar schedule grid, real-time nearby restaurant map, print-ready statutory certificate. |
| **API Server** | Python 3.12+, FastAPI, Uvicorn (ASGI), Pydantic v2 | High-throughput async REST API, CORS middleware, request validation, structured JSON schemas. |
| **AI / LLM Engine** | Google Gemini (gemini-2.5-flash-lite) | Context-aware outreach generator, tone tailoring, non-robotic multilingual donor communication. |
| **Messaging Gateway** | Twilio REST API, WhatsApp Business API | Automated surplus intake, volunteer broadcast, instant delivery of signed protection certificates. |
| **Compliance & Crypto** | SHA-256 Hash Chain, Dual-Timestamp Lock, ReportLab | Immutable chain of custody, Regulation 4 safe-harbor legal protections, high-resolution PDF rendering. |
| **Database Tier** | PostgreSQL (SQLAlchemy async engine), In-Memory Ledger Fallback | Normalized relational tables (`User`, `Donation`, `Recipient`, `Driver`), dual fallback for 100% demo uptime. |
| **Security & Auth** | Passlib (bcrypt), PyJWT, RBAC Guards | Secure password hashing, tokenized session management, multi-role separation (NGO, Driver, Admin). |

---

## 4. Key Architectural Differentiators for Hackathon Judges

1. **Dual-Party Confirmation Mechanism**:
   - Unlike basic food apps that assume food was good, this architecture enforces **Server Timestamp 1 (Donor Intake Offer)** + **Server Timestamp 2 (NGO Physical Acceptance)** before an immunity certificate is minted.
2. **Statutory Good Samaritan Safe Harbor**:
   - Directly maps to **FSSAI (Recovery & Distribution of Surplus Food) Regulations, 2019** and **Section 80 of the FSS Act, 2006**, giving businesses legal peace of mind against civil/criminal liability.
3. **Resilient Dual-Tier Data Engine**:
   - Fully integrated with PostgreSQL database with an instant, graceful fallback ledger ensuring zero downtime during live judge evaluations.
4. **Hybrid On-Screen & Physical Verification**:
   - Digital QR verification seamlessly bridges the physical food delivery van with the online Government FoSCoS/NITI Aayog compliance registry.
