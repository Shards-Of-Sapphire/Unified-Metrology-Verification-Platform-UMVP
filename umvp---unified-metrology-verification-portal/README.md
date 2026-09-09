# ⚖️ UMVP — Unified Metrology Verification Portal

<div align="center">
  <h3>Department of Legal Metrology • Government of India</h3>
  <p><b>National Platform for Verification, Calibration, Inspection & Digital Certification of Weights and Measures</b></p>
</div>

---

## 📋 Overview

**UMVP (Unified Metrology Verification Portal)** is a digital government portal for the Department of Legal Metrology (Weights & Measures Directorate, Ministry of Consumer Affairs, India). It provides a unified, secure, tamper-evident ecosystem connecting Citizens, Government Approved Test Centres (GATC), Legal Metrology Officers (LMO), and State Controllers.

### Key Capabilities
- 📜 **Tamper-Evident Digital Certificates**: Generated with SHA-256 HMAC digital signatures and high-density scannable QR codes.
- 📱 **Mobile QR Code Verification**: Dynamic network IP detection (`/api/server-info`) allows mobile devices on the same Wi-Fi network to scan QR codes on printed or digital certificates to verify authenticity instantly (`http://<LAN_IP>:3000/?verify=<CERT_ID>`).
- 👥 **Multi-Role Portals**: Role-based access control (RBAC) tailored for Citizens, GATC Laboratories, LMO Field Officers, and State Controllers.
- 🔐 **End-to-End Encrypted Messaging (E2EE)**: Secure messaging between enforcement officers, laboratories, and applicants.
- 🤖 **AI Metrology Assistant**: Embedded AI assistant powered by LLM for rule references (Legal Metrology Rules 2011), tolerance calculations, and compliance guidance.
- 🛡️ **DPDP / GDPR Compliance**: Integrated data privacy controls, consent logs, data export, and audit trails.
- 🔄 **Hybrid Database Engine**: Dual-mode data access using PostgreSQL with Drizzle ORM, with seamless fallback to an in-memory database when offline.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons |
| **PDF & QR Generation** | `jsPDF`, `html2canvas`, `qrcode` |
| **Backend API** | Node.js, Express.js, TypeScript (`tsx` runner) |
| **Database & ORM** | PostgreSQL, Drizzle ORM, In-Memory Standby DB Fallback |
| **Cryptography** | Crypto API (HMAC SHA-256), Web Crypto E2EE |
| **AI Integration** | Google Gemini API / Custom LLM Assistant |

---

## 👥 Multi-Role Portal Architecture

```
                                  ┌─────────────────────────────┐
                                  │      UMVP Gateway Portal    │
                                  └──────────────┬──────────────┘
                                                 │
          ┌──────────────────────┬───────────────┴──────────────┬──────────────────────┐
          ▼                      ▼                              ▼                      ▼
┌──────────────────┐   ┌──────────────────┐           ┌──────────────────┐   ┌──────────────────┐
│  Citizen Portal  │   │   GATC Portal    │           │    LMO Portal    │   │ Controller Portal│
│                  │   │  (Lab Verifier)  │           │  (Field Inspector)│  │ (Admin Dashboard)│
├──────────────────┤   ├──────────────────┤           ├──────────────────┤   ├──────────────────┤
│ • My Equipment   │   │ • Lab Tests      │           │ • Field Audits   │   │ • Analytics      │
│ • Applications   │   │ • Verification   │           │ • GPS / Photos   │   │ • Fraud Alerts   │
│ • Download PDFs  │   │ • Batch Issue    │           │ • Revocation     │   │ • DB Explorer    │
│ • QR Test & Scan │   │ • Calibration    │           │ • Inspection Logs│   │ • Audit Trails   │
└──────────────────┘   └──────────────────┘           └──────────────────┘   └──────────────────┘
```

### 1. 🙋‍♂️ Citizen Portal
- View all registered weights, measures, weighing scales, and dispensing pumps.
- Track application status in real-time (Submitted, Under Test, Approved, Issued).
- Download official **Certificate of Verification** in high-resolution PDF format.
- Submit grievances and complaints for non-compliant commercial scales or short-weighting.

### 2. 🧪 GATC Laboratory Portal (Government Approved Test Centre)
- Receive equipment for secondary and working standard calibration.
- Record calibration data, error margins, and standard weight comparisons.
- Electronically sign and issue **Verification Certificates** with HMAC cryptographic protection.

### 3. 🔍 LMO Portal (Legal Metrology Officer)
- Field enforcement dashboard for on-site inspection of commercial establishments.
- Inspect traders, fuel stations, supermarkets, and industrial weighbridges.
- Capture geotagged inspection evidence, photo logs, and equipment serial numbers.
- Issue compliance certificates or place rejection seals on uncalibrated devices.

### 4. 👑 State Controller & Central Admin Portal
- Executive dashboard with state-wide compliance statistics.
- Automated anomaly & fraud detection alerts (e.g., duplicate serial numbers, tampered seals).
- Database Explorer with raw table views and query execution.
- User management, role permissions, and full regulatory audit trails.

---

## 🔒 Cryptographic Verification & Mobile QR System

```
[ Certificate Generated ] ──► [ HMAC-SHA256 Signature Calculated ]
                                              │
                                              ▼
[ Mobile Phone Scans QR ] ◄─── [ Dynamic LAN IP QR Code Embed ]
            │
            ▼
[ URL: http://192.168.x.x:3000/?verify=CERT-2026-X89K ]
            │
            ▼
[ Portal Opens Public Verifier & Auto-Validates Digital Signature ]
```

1. **HMAC Signature Creation**: Every certificate receives a unique SHA-256 HMAC signature derived from its certificate number, serial number, validity date, and issuing officer credentials.
2. **Network IP Resolution**: The server runs an IP auto-detection service (`GET /api/server-info`) that returns the host machine's Wi-Fi / Local Area Network IP address (`http://192.168.x.x:3000`).
3. **Dynamic QR Code**: The QR code on both the modal screen and downloaded PDF embeds the LAN URL. When scanned by any smartphone on the local network, it opens the **Public Verifier** view and confirms authenticity automatically.

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/server-info` | Returns local LAN IP and base URL for QR code generation |
| `GET` | `/api/health` | Service health check |
| `GET` | `/api/certificates` | Fetch verification certificates (DB or standby memory fallback) |
| `POST` | `/api/certificates/issue` | Issue a new verification certificate with HMAC signature |
| `GET` | `/api/verify/:certificateNumber` | Public verification API endpoint |
| `GET` | `/api/db/browser` | Admin database browser & table inspector |
| `GET/POST` | `/api/e2ee/messages` | Encrypted messaging endpoints |

---

## 🚀 Getting Started & Running Locally

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

### Quick Setup

1. **Clone the repository & install dependencies**:
   ```bash
   git clone <repository-url>
   cd umvp---unified-metrology-verification-portal
   npm install
   ```

2. **Configure Environment Variables** (Optional for local development):
   Create or edit `.env.local` in the project root:
   ```env
   PORT=3000
   NODE_ENV=development
   GEMINI_API_KEY=your_gemini_api_key_here
   # DATABASE_URL=postgresql://user:password@localhost:5432/umvp_db
   ```
   *Note: If PostgreSQL is not configured or offline, UMVP automatically runs in **Standby Memory Database** mode with pre-populated demo data.*

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the Portal**:
   - Open your browser at `http://localhost:3000`
   - Use the **One-Click Demo Logins** at the bottom of the landing page:
     - 🙋 **Citizen Demo**: `Rahul Sharma`
     - 🧪 **GATC Lab Demo**: `National Metrology Lab (GATC-DEL-01)`
     - 🔍 **LMO Officer Demo**: `Vikram Singh (LMO-8842)`
     - 👑 **Controller Demo**: `Dr. A. K. Verma (State Controller)`

---

## 🧪 Testing Mobile QR Verification

1. Log in as **Citizen (Rahul Sharma)**.
2. Click **View Certificate** on any active verification card.
3. Observe the generated **QR Code** at the bottom of the certificate.
4. Scan the QR code using your smartphone camera (ensure your phone is connected to the same Wi-Fi network as your host computer).
5. The phone will navigate directly to `http://<YOUR_LAN_IP>:3000/?verify=CERT-...` and display the **Authenticity Verified** badge.

---

## 📄 License

This project is developed for the **Department of Legal Metrology, Ministry of Consumer Affairs, Government of India**.
All rights reserved.
