# WedPlan — Luxury Wedding Planning Platform & Marketplace (Frontend Client)

- **Frontend Repository:** [https://github.com/jonathanavibis/wedplan-a09](https://github.com/jonathanavibis/wedplan-a09)
- **Backend Repository:** [https://github.com/jonathanavibis/wedplan-server-a09](https://github.com/jonathanavibis/wedplan-server-a09)
- **Live Site Link:** [https://wedplan-a09.vercel.app](https://wedplan-a09.vercel.app)

WedPlan is a role-based wedding planning web application built with **Next.js**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Stripe Checkout**. It empowers engaged couples to discover curated wedding vendors and request bookings, while providing vendors and administrators with tools to manage services, bookings, subscriptions, and platform operations.

---

## 🌟 Important Features

### 1. Public Experience & Discovery
- **Hero Banner:** Headline, call-to-actions, and wedding styling.
- **Dynamic Featured Services:** Displays approved and active wedding packages loaded live from MongoDB Atlas.
- **Six Wedding Categories:**
  - Photography & Videography
  - Wedding Venues
  - Decoration & Florist
  - Catering Services
  - Makeup & Styling
  - Wedding Fashion
- **Search & Filtering:** Real-time query search, category pills, location filter, and price ascending/descending sorting.
- **Dynamic Service Details (`/services/[id]`):** High-resolution multi-image galleries, price breakdowns, verified vendor profiles, and booking request options.
- **Authentication Guards:** Redirects unauthenticated visitors to `/login` when trying to view full service details or submit booking requests.

### 2. Multi-Role Authentication & Security
- **Role-Based Accounts:** Distinct flows for **Customers (Couples)**, **Vendors**, and **Admins**.
- **Admin Security:** Public registration for admin roles is prohibited.
- **Password Strength:** Enforced 6+ characters with uppercase and lowercase requirements.
- **1-Click Test Credentials:** Fast evaluator sign-in buttons for Admin, Vendor, and Customer on `/login`.
- **ImgBB Image Uploads:** Live image upload support for avatars and service portfolio photography.

### 3. Dedicated Role Dashboards
- **Vendor Dashboard:**
  - **Overview:** Real-time KPI statistics (Total Services, Active Services, Pending Requests, Confirmed Bookings, Subscription Tier).
  - **My Services:** Portfolio manager with inline editing, availability toggling, and deletion.
  - **Add Service:** Multi-image upload via ImgBB with automatic `Pending` status.
  - **Free Plan Enforcement:** Free tier vendors are limited to 3 active services.
  - **Booking Requests:** Accept or reject customer requests (state-machine locked once resolved).
  - **Stripe Premium Upgrade:** Direct Stripe Checkout integration ($49.00 USD) for unlimited services.
- **Customer Dashboard:**
  - **Overview:** Booking statistics (Total Inquiries, Pending, Accepted, Declined).
  - **My Bookings:** Complete booking itinerary with status tracking and self-cancellation for pending bookings.
- **Admin Dashboard:**
  - **Platform KPIs:** Total users, vendors, customers, services, pending review count, gross revenue.
  - **User Moderation:** Search users, filter by role, block or unblock users.
  - **Service Moderation:** Review queue, approve or reject listings, toggle active status, or delete listings.
  - **Transaction Ledger:** View Stripe transactions and session logs.

---

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & PostCSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Image Hosting:** ImgBB API
- **Payments:** Stripe Checkout (Test Mode)

---

## 🔐 Environment Variables

Create `.env.local` in the `client` directory:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SERVER_URL=http://localhost:5000

# Client App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ImgBB API Key for Service Image Uploads
NEXT_PUBLIC_IMGBB_API_KEY=6d207e02198a847aa5a0a0333f443b32

# Stripe Publishable Key (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

---

## 🚀 Installation & Local Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Evaluation Credentials

| Role | Email | Password | Quick Action |
|---|---|---|---|
| **Admin** | `admin@wedplan.com` | `Admin@123456` | 1-Click button on `/login` |
| **Free Vendor** | `vendor@wedplan.com` | `Vendor@123456` | 1-Click button on `/login` |
| **Premium Vendor** | `premium@wedplan.com` | `Vendor@123456` | 1-Click button on `/login` |
| **Customer** | `customer@wedplan.com` | `Customer@123456` | 1-Click button on `/login` |
