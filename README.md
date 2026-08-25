# UMVP: Unified Metrology Verification Portal

## 📋 Overview

**UMVP (Unified Metrology Verification Portal)** is a secure, web-based platform developed for the Legal Metrology Department under the **Ministry of Consumer Affairs, Food & Public Distribution**. It digitizes the end-to-end workflow mandated by the **Legal Metrology Act, 2009**, replacing manual verification processes with automated scheduling, digital inspections, and QR-enabled certification.

## 🎯 Purpose

To improve transparency, efficiency, and ease of compliance within the Legal Metrology ecosystem by providing a unified digital platform for:

- Online registration & verification applications
- Automated scheduling & allocation to Legal Metrology Officers (LMOs)
- Digital inspection recording & certificate generation
- Centralized tracking of instrument validity across jurisdictions
- Mobile-enabled field verification activities

## 🏛️ Key Stakeholders

- **Department of Consumer Affairs (DoCA)** – Central administration
- **State Legal Metrology Departments** – State-level enforcement
- **Legal Metrology Officers (LMOs)** – Inspection & verification officers
- **Government Approved Test Centres (GATCs)** – Authorized testing facilities
- **Instrument Users** – Businesses & individuals requiring verification

## ✨ Core Features

### **Workflow Automation**

- Online application submission for verification/re-verification
- Automated scheduling & allocation to nearest available LMO/GATC
- Re-verification reminders & expiry alerts

### **Digital Certification**

- QR-enabled digital verification certificates
- Tamper-proof certificate authentication system
- Centralized repository accessible to regulators & consumers

### **Field Operations**

- Mobile application for LMOs with offline capability
- Geotagged photo uploads & digital observation recording
- Real-time sync of field data

### **Monitoring & Compliance**

- Role-based dashboards for users, LMOs, GATCs, and administrators
- Real-time pendency tracking & enforcement monitoring
- Analytics & report generation

## 🛠️ Tech Stack (Proposed)

### **Frontend**

- **Next.js 14+** – React framework with App Router
- **TypeScript** – Type safety & maintainability
- **Tailwind CSS** – Utility-first styling
- **Shadcn/ui** – Accessible component library

### **Backend**

- **Python FastAPI** – High-performance API framework
- **PostgreSQL** – Primary database for relational integrity
- **Redis** – Caching & session management

### **Mobile**

- **React Native** – Cross-platform mobile application
- **Expo** – Development & deployment framework

### **DevOps & Infrastructure**

- **Docker** – Containerization
- **Kubernetes** – Orchestration & scaling
- **Nginx** – Reverse proxy & load balancing
- **Digital Ocean/AWS/GCP** – Cloud deployment

## 🗂️ Project Structure

UMVP is built as a Next.js application using the App Router, with a structure designed for scalability, clear separation of concerns, and production deployment.

```text
umvp-core/
├── .github/                   # CI/CD workflows (GitHub Actions)
├── prisma/                    # Database ORM configuration
│   ├── schema.prisma          # Database schema (PostgreSQL)
│   └── migrations/            # SQL migration history
├── public/                    # Static assets (logos, QR placeholders, etc.)
├── src/
│   ├── app/                   # Next.js App Router (Pages & Layouts)
│   │   ├── (auth)/            # Authentication routes (login, register)
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   │   ├── lmo/           # Legal Metrology Officer dashboard
│   │   │   ├── gatc/          # Gov. Approved Test Centre dashboard
│   │   │   ├── admin/         # Ministry/Admin dashboard
│   │   │   └── user/          # Instrument user dashboard
│   │   ├── api/               # Next.js API Routes (Backend logic)
│   │   │   ├── applications/  # Application submission & tracking
│   │   │   ├── certificates/  # QR & Certificate generation
│   │   │   ├── inspections/   # Verification reporting
│   │   │   └── webhooks/      # External integrations
│   │   ├── verify/[id]/       # Public certificate verification route
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable React components
│   │   ├── ui/                # Base UI components (Shadcn/Tailwind)
│   │   ├── forms/             # Application & inspection forms
│   │   ├── layout/            # Navigation, sidebars, headers
│   │   └── certificates/      # Certificate rendering components
│   ├── lib/                   # Utility functions & configuration
│   │   ├── db.ts              # Prisma client instantiation
│   │   ├── auth.ts            # NextAuth/Lucia configuration
│   │   ├── qrcode.ts          # QR generation utility
│   │   └── utils.ts           # General helpers (Tailwind merge, etc.)
│   ├── services/              # External service integrations
│   │   ├── sms.ts             # SMS alerts (Govt SMS gateway)
│   │   └── email.ts           # Email notifications
│   └── types/                 # TypeScript interfaces and types
│       └── index.ts           # Global type definitions
├── scripts/                   # Utility scripts (seed DB, generate docs)
├── docker/                    # Containerization configuration
│   ├── Dockerfile             # Production build instructions
│   └── docker-compose.yml     # Local development environment (DB, Redis)
├── .env.example               # Environment variables template
├── next.config.mjs            # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## 🔧 Getting Started

### Prerequisites

- Node.js 18+ & npm
- Python 3.10+
- Docker & Docker Compose
- PostgreSQL 14+

### Development Setup

```bash
# Clone the repository
git clone https://github.com/DoCA/UMVP-Core.git

# Install dependencies
npm install

# Start development environment
docker-compose up -d

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

📄 Legal Framework
This system complies with:

The Legal Metrology Act, 2009
The Legal Metrology (General) Rules, 2011
Digital India Initiative framework
India Open Government Data (OGD) Policy
📜 License
This project is dual-licensed under:

MIT License – For software distribution
India Open Government License (OGL) – For data accessibility
See LICENSE [blocked] for complete terms.

🤝 Contributing
We welcome contributions from Government Approved Test Centres (GATCs), State Legal Metrology Departments, and authorized developers. Please see CONTRIBUTING.md [blocked] for guidelines.

📞 Contact & Support
Department: Department of Consumer Affairs (DoCA)
Ministry: Ministry of Consumer Affairs, Food & Public Distribution
Technical Issues: Create a GitHub Issue
Policy Queries:  <legalmetrology.doca@gov.in>
Developed by: Sapphire (A Student Innovative Collective from MJCET, Hyderabad)
Implemented under: Digital India Initiative, Department of Consumer Affairs, Government of India
