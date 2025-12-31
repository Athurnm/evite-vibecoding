# 💍 Athur & Dara Wedding E-Vite

A premium, "Ethereal Earth" themed wedding invitation web application. Built as a responsive Single Page Application (SPA) with a custom backend for RSVPs and dynamic wishes.

![Couple Illustration](public/assets/couple-illustration.png)

## ✨ Features

- **Modern Aesthetic:** "Ethereal Earth" design system (White/Bone/Warm Taupe).
- **Dynamic Content:**
  - **Guest Personalization:** `?to=Name` logic to personalize the greeting.
  - **Time Variants:** `?type=akad` vs `?type=resepsi` (default) views.
  - **Wishes Carousel:** Read wishes from other guests in real-time.
- **Interactive Story:** Vertical timeline with floating floral animations.
- **RSVP System:**
  - Submit Name, Attendance, and Wishes.
  - Data stored securely in SQLite database.
  - "Add to Google Calendar" integration.
- **Admin Features:** Download RSVP data as CSV.

## 🛠️ Tech Stack

- **Frontend:** Vite, Vanilla JS, CSS Variables (No heavy frameworks).
- **Backend:** Node.js, Express.js.
- **Database:** SQLite (Lightweight, file-based).
- **Tools:** `csv-writer` for exports.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- BPM (npm or yarn)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/athurnm/athur-dara-evite.git
    cd athur-dara-evite
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

### 🏃‍♂️ Running the Application

To run the full application (Frontend + Backend), you'll need two terminal windows:

**Terminal 1 (Backend API):**

```bash
node server.js
# Server runs at http://localhost:3000
```

**Terminal 2 (Frontend Dev Server):**

```bash
npm run dev
# Frontend runs at http://localhost:5173
```

> **Note:** The frontend proxies `/api` requests to port 3000. Both must be running for RSVPs to work.

## 📖 API Documentation

| Method | Endpoint | Description | Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/rsvp` | Submit a new RSVP. | `{ "name": "...", "guests": 1, "attendance": "yes", "wishes": "..." }` |
| `GET` | `/api/wishes` | Get latest 20 wishes. | - |
| `GET` | `/api/rsvp/download` | Download all RSVPs as `.csv`. | - |

## 📂 Project Structure

```
├── public/assets/       # Images & Static assets
├── index.html           # Main HTML entry
├── main.js              # Frontend Logic (Carousel, RSVP, URL Params)
├── style.css            # Global Styles (CSS Variables)
├── server.js            # Express Backend & SQLite setup
├── rsvp.db              # SQLite Database (Auto-created)
├── design-guideline.md  # Brand & Design Guidelines
└── package.json         # Dependencies
```

## 🎨 Design Reference

See [design-guideline.md](design-guideline.md) for color palettes and font choices.

---

**Made with ❤️ for Athur & Dara.**
