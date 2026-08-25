# Maap Pramaan: Unified Legal Metrology Verification System

## 📜 Overview
Maap Pramaan is a secure, web-based and mobile-enabled platform developed for the **Department of Consumer Affairs (DoCA)**. It digitizes the end-to-end workflow mandated by the **Legal Metrology Act, 2009**, replacing manual processes with automated scheduling, digital inspections, and QR-enabled certification.

## ✨ Key Features
*   **Stakeholder Onboarding:** Role-based access for Users, State LMOs, and Government Approved Test Centres (GATCs).
*   **Workflow Automation:** Online application submission, automated officer allocation, and re-verification scheduling.
*   **Digital Certification:** Real-time generation of tamper-proof, QR-coded verification certificates.
*   **Field Inspections:** Mobile-first interface for LMOs to record observations and upload geotagged photos directly from the field.
*   **Compliance Tracking:** Automated alerts for expiry and an integrated dashboard for monitoring pendency and enforcement.
*   **Centralized Repository:** A searchable database for regulators and consumers to verify instrument validity.

## 🛠️ Tech Stack (Proposed)
*   **Frontend:** Next.js (Vyne-compatible), React, Tailwind CSS
*   **Backend:** Node.js / Python (FastAPI/Django)
*   **Database:** PostgreSQL (Relational integrity for legal records)
*   **Mobile:** React Native / Flutter (For field officer support)
*   **DevOps:** Docker, Kubernetes (Scalable orchestration)

## 🏗️ Architecture
The system follows a microservices architecture to handle high-concurrency requests across multiple states, ensuring high availability and a secure audit trail for every verification activity.

## ⚖️ Legal Framework
Aligned with:
- The Legal Metrology Act, 2009
- The Legal Metrology (General) Rules, 2011
