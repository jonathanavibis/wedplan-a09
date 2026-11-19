# WedPlan — Luxury Wedding Planning Platform & Marketplace (Frontend Client)

**Live Application:** [https://wedplan-a09.vercel.app](https://wedplan-a09.vercel.app)  
**Frontend Repository:** [https://github.com/jonathanavibis/wedplan-a09](https://github.com/jonathanavibis/wedplan-a09)  
**Backend Repository:** [https://github.com/jonathanavibis/wedplan-server-a09](https://github.com/jonathanavibis/wedplan-server-a09)  
**Backend API Server:** [https://wedplan-server-a09.vercel.app](https://wedplan-server-a09.vercel.app)  

---

## 💍 Project Overview

**WedPlan** is a premier role-based luxury wedding planning marketplace designed to connect engaged couples with verified, top-tier wedding professionals (photographers, luxury venues, decorators, gourmet caterers, makeup artists, and bridal fashion designers). 

The client application is built with modern web technologies including **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**, delivering an ethereal, responsive, and seamless experience across all screen sizes.

---

## ✨ Key Features & Architecture

### 1. Public Discovery & Catalog
- **Luxury Hero Banner:** Engaging call-to-actions with fluid transitions and responsive layouts.
- **Dynamic Featured Packages:** Curated wedding packages loaded in real time from the backend database.
- **Six Specialized Wedding Categories:**
  - Photography & Videography
  - Wedding Venues
  - Decoration & Florist
  - Catering Services
  - Makeup & Styling
  - Wedding Fashion
- **Search, Filtering & Sorting:** Real-time keyword search, category pills, location filters, and price ordering (Low to High / High to Low).
- **Service Details (`/services/[id]`):** High-resolution image galleries, pricing breakdown, vendor profile card, and booking request interface.
- **Route Guards & Middleware:** Unauthenticated visitors are automatically directed to sign in when accessing details or booking workflows.

### 2. Multi-Role Authentication & Security
- **Role-Based Workflows:** Tailored user journeys for **Customers (Couples)**, **Vendors**, and **Administrators**.
- **Admin Isolation:** Public registration for administrator privileges is strictly blocked.
- **Password Policies:** Enforced minimum 6-character length with uppercase and lowercase requirements.
- **Change Password Popup:** Dedicated modal on Profile Settings with Old Password, New Password, and Confirm Password verification.
- **Resilient Image Uploads:** Multi-tier upload pipeline (ImgBB API $\rightarrow$ Server Upload Proxy $\rightarrow$ Client Canvas Base64 fallback) ensuring zero-failure avatar and portfolio image uploads.

### 3. Dedicated Role Dashboards
- **Vendor Dashboard:**
  - Real-time KPI analytics (Total Services, Active Services, Pending Requests, Confirmed Bookings).
  - Portfolio manager with inline editing, availability toggling, and deletion.
  - New service creation with multi-image gallery upload (defaults to `Pending` review).
  - Free tier limitation: maximum of 3 active services.
  - Booking request management with immutable Accept/Reject state machine.
  - Stripe Checkout integration ($49.00 USD) for unlimited service listings.
- **Customer Dashboard:**
  - Booking statistics overview (Total Inquiries, Pending, Accepted, Declined).
  - Booking itinerary manager with real-time status tracking and self-cancellation for pending inquiries.
  - Dedicated VIP Concierge support pass page.
- **Admin Dashboard:**
  - Platform-wide KPI analytics (Total Users, Vendors, Customers, Services, Revenue).
  - User moderation: instantaneous account blocking and unblocking.
  - Service approval queue: Approve, Reject, or Delete listings.
  - Complete financial transaction ledger linked with Stripe payment sessions.

---

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router, Version 16.4.6 Patched)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & PostCSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Payment Processing:** Stripe Checkout SDK
- **Deployment:** Vercel

---

## 🔑 Test & Evaluation Credentials

| Role | Email | Password | Access / Capabilities |
|---|---|---|---|
| **Admin** | `admin@wedplan.com` | `Admin@123456` | Full platform moderation, user controls, service reviews, financial ledger |
| **Vendor** | `vendor@wedplan.com` | `Vendor@123456` | Portfolio management, 3-service free limit, booking requests, Stripe Premium |
| **Customer** | `customer@wedplan.com` | `Customer@123456` | Browse packages, submit booking inquiries, cancel pending bookings, VIP Concierge |
