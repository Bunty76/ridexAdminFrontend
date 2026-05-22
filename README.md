# 🚗 Ridex — Admin Web Dashboard

Ridex Admin Dashboard is the central control center of a modern, MERN-stack travel/ride-hailing platform. Built with React.js, Vite, TailwindCSS, and Redux Toolkit, it enables operations managers and admins to manage drivers, monitor live trips, track payments, and visualize real-time moving vehicles on interactive maps.

It connects seamlessly with the **Driver App** (React Native), **User Panel App** (React Native), and the **Ridex Backend** (Node.js + Express + MongoDB + Socket.IO).

---

## 🏗️ Architecture

```
[Driver Mobile App]           [User Mobile App]
       │                              │
       └──────────────┬───────────────┘
                      ▼
               [Ridex Backend]
         (Node.js + Express + Socket.IO)
                      │
                      ▼
            [Admin Web Dashboard] ◄── You are here
```

---

## ⚡ Key Features

* **🔐 Role-Based Authentication**: Secure admin login with JWT-based session handling.
* **👨‍✈️ Driver Lifecycle Management**:
  * Comprehensive table listing all registered drivers, categorized by vehicle type (Car, Bike, Auto, etc.).
  * Real-time status badges: 🟢 Online, ⚫ Offline, 🔵 Busy (On Trip).
  * Interactive driver approvals system (Pending → Approved / Rejected / Suspended).
* **📍 Live Tracking System**:
  * Real-time vehicle coordinate updates via Socket.IO.
  * Google Maps integration visualizing active drivers, passenger pickups, dropoffs, and live route paths.
* **🚕 Trip / Ride Monitoring**:
  * Live status tracking of trips (Pending → Accepted → Arrived → Started → Completed → Cancelled).
  * Modal drawer displaying trip details and dispatch channels.
* **💰 Payments & Invoice Systems**:
  * Historical records of completed rides with payment status indicators (Pending, Paid, Failed).
  * Direct manual payment updates.
* **🔔 Notifications Center**: Real-time Socket.IO broadcasts for new trip requests, system alerts, and status changes.

---

## 🛠️ Tech Stack

* **Core**: React.js (v18+), Vite (fast bundler)
* **State Management**: Redux Toolkit (RTK)
* **Styling**: TailwindCSS, Lucide Icons
* **Realtime Services**: Socket.IO-Client
* **Testing Frameworks**: 
  * Playwright (End-to-End Headed/Headless Testing)
  * Vitest + React Testing Library (Unit/Component Testing)
* **API Integration**: Axios

---

## ⚙️ Installation & Setup

### 1. Prerequisites
Ensure you have **Node.js (>=18.0.0)** and **npm** installed on your system.

### 2. Clone the Repository
```bash
git clone https://github.com/Bunty76/ridexAdminFrontend.git
cd ridexAdminFrontend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Variables (`.env`)
Create a `.env` file in the root directory and define the following keys:
```env
# Backend Connection URLs
VITE_API_URL=https://ridexbackend.onrender.com/api
VITE_SOCKET_URL=https://ridexbackend.onrender.com

# Map Integrations
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

---

## 🚀 Running the Project

### Development Server
Starts the local development server at `http://localhost:5173/`.
```bash
npm run dev
```

### Production Build
Compiles and bundles the application for high-performance static hosting.
```bash
npm run build
```

---

## 🧪 Testing

The dashboard contains robust test suites to ensure UI components and state logic function perfectly.

### Unit Tests (Vitest)
Executes component and Redux store unit tests:
```bash
npm run test
```

### End-to-End Browser Tests (Playwright)
Validates E2E user authentication, navigation transitions, and real-time live page rendering:
```bash
# Run tests in headless mode
npm run test:e2e

# Run tests with headed browser visualization
npx playwright test --headed
```
