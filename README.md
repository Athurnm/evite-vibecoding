# 💍 Athur & Dara Wedding E-Vite

A premium, "Ethereal Earth" themed wedding invitation web application. Built as a responsive Single Page Application (SPA) with a custom backend for RSVPs and dynamic wishes.

![Couple Illustration](public/assets/couple-illustration.png)

## ✨ Features

- **Modern Aesthetic:** "Ethereal Earth" design system (White/Bone/Warm Taupe).
- **Dynamic Content:**
  - **Guest Personalization:** `?to=Name` logic to personalize the greeting.
  - **Time Variants:** `?type=akad` vs `?type=resepsi` (default) views.
  - **Wishes Carousel:** Read wishes from other guests in real-time.
- **Bilingual Support:**
  - Full English and Bahasa Indonesia translations.
  - Sticky language toggle for easy switching.
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
    git clone https://github.com/Athurnm/evite-vibecoding.git
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

### Deployment via Vercel (Recommended)

1. Push this repository to GitHub.
2. Log in to [Vercel](https://vercel.com).
3. **Add New Project** -> Import this repository.
4. **Database:**
    - In the Vercel Project Dashboard, click **Storage**.
    - Click **Connect Store** -> **Postgres** -> **Create New**.
    - Follow the prompts. Vercel will automatically add the necessary environment variables (`POSTGRES_URL`, etc.).
5. **Environment Variables:** Ensure the database links are correct (handled auto by Vercel usually).
6. **Deploy:** Click Deploy.
7. **Initialize Database:**
    - After deployment, visit `https://your-project.vercel.app/api/seed` in your browser once. This creates the `rsvp` table.

### 🏃‍♂️ Running Locally (Vercel)

For the best local experience with Serverless Functions:

1. Install Vercel CLI: `npm i -g vercel`
2. Link project: `vercel link`
3. Pull env vars: `vercel env pull .env.local`
4. Run:

    ```bash
    vercel dev
    ```

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
