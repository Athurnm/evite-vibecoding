# 💍 The Wedding of Athur & Dara

*A premium, responsive wedding invitation web application built with a custom "Ethereal Earth" design system.*

![Couple Illustration](public/assets/couple-illustration.png)

## ✨ Overview

This application serves as the digital invitation for the wedding of Athur and Dara. It features a sophisticated, nature-inspired design ("Maroon Romance & Ethereal Earth") and provides a seamless experience for guests to RSVP, view the schedule, send wishes, and access the gift registry.

The project is built as a **Single Page Application (SPA)** using Vanilla JavaScript and CSS Variables for maximum performance and design fidelity, backed by Vercel Serverless Functions.

## 🚀 Key Features

### 🎨 Design & Experience

- **"Ethereal Earth" Theme:** A custom design system featuring warm neutrals, maroon accents, and organic textures.
- **Glassmorphism UI:** Translucent cards and containers for a modern, airy feel.
- **Scroll Animations:** Interactive vine growth animation that follows the user as they scroll.
- **Bilingual Support:** Full English and Bahasa Indonesia translations with a sticky language toggle.
- **Background Music:** Auto-play audio ("Love Wins All" - IU) with a floating mute/unmute control.
- **Interactive Story:** A vertical timeline showcasing the couple's journey with floating floral animations.

### 💌 Guest Services

- **Smart RSVP System:**
  - **Personalized Greeting:** `?to=Name` URL parameter auto-fills the guest's name.
  - **Dynamic Guest Limits:** intelligent drop-downs for adults and children based on invite type.
  - **Attendance Tracking:** Simple "Yes/No" confirmation.
  - **State Persistence:** Returning users see their previously submitted RSVP details automatically pre-filled.
- **Wishes Carousel:** A real-time, auto-scrolling display of well-wishes from other guests.
- **Add to Calendar:** One-click integration with Google Calendar (pre-filled with date, time, and location).
- **Direct Navigation:** Deep links to Google Maps for the wedding venue.

### 🎁 Gift Registry & Cash Angpao

- **Dual-Mode Registry:**
  - **Physical Gifts:** Browse a curated list of items or select "Other" to gift a custom item.
  - **Cash Transfer:** Copy bank account numbers (BCA, Mandiri, BSI, Blu) with a single click.
- **WhatsApp Confirmation:** "Share to Bride" button pre-fills a WhatsApp message for transfer proof.
- **Smart Recommendations:** Direct links to recommended e-commerce stores for specific gift items.

### 📊 Analytics & Insights

- **PostHog Integration:** Tracks tracking events for:
  - Page Views
  - RSVP Submissions
  - Registry Interactions (Item Selection, Cash Tab Views)
  - Music Toggles
- **Data Export:** Admin endpoint to download all RSVPs as a CSV file.

## 🛠️ Tech Stack

- **Frontend:**
  - **Core:** Vanilla JavaScript (ES6+), HTML5.
  - **Styling:** CSS Variables (Custom Design System), Flexbox/Grid.
  - **Build Tool:** Vite.
- **Backend:**
  - **Runtime:** Node.js (Vercel Serverless Functions).
  - **Database:** Vercel Postgres (for RSVPs).
  - **APIs:** Custom endpoints for Registry, RSVPs, and State Management.
- **Analytics:** PostHog (`posthog-js`).
- **Utilities:** `csv-writer` (Exports), `google-spreadsheet` (Registry Source).

## 📂 Project Structure

```text
├── public/assets/       # Images, Audio & Static Assets
├── api/                 # Vercel Serverless Functions
│   ├── rsvp.js          # Handle RSVP submissions (POST)
│   ├── registry.js      # Fetch/Update Gift Registry items
│   ├── state.js         # Retrieve user's previous RSVP/Gift state
│   ├── wishes.js        # Fetch latest wishes
│   └── seed.js          # Database initialization
├── index.html           # Main Entry Point
├── main.js              # Core Logic (State, UI, API Calls)
├── translations.js      # Bilingual Dictionary (EN/ID)
├── style.css            # Global Styles & Design System
├── design-guideline.md  # Detailed Brand & UI Documentation
└── package.json         # Dependencies & Scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Vercel CLI (`npm i -g vercel`)

### Local Development

1. **Clone and Install:**

    ```bash
    git clone https://github.com/Athurnm/evite-vibecoding.git
    cd evite-vibecoding
    npm install
    ```

2. **Environment Variables:**
   Create a `.env.local` file with the following keys (ask admin for values):

    ```env
    POSTGRES_URL="..."
    POSTGRES_PRISMA_URL="..."
    POSTGRES_URL_NON_POOLING="..."
    POSTGRES_USER="..."
    POSTGRES_HOST="..."
    POSTGRES_PASSWORD="..."
    POSTGRES_DATABASE="..."
    VITE_POSTHOG_KEY="..."
    VITE_POSTHOG_HOST="..."
    ```

3. **Run Development Server:**

    ```bash
    vercel dev
    # Runs frontend + backend functions at http://localhost:3000
    ```

    *Note: Using `npm run dev` (Vite only) will start the frontend at localhost:5173, but API calls to `/api/...` will fail without the Vercel environment.*

## 📖 API Reference

| Endpoint | Method | Description | Payload Example |
| :--- | :--- | :--- | :--- |
| `/api/rsvp` | `POST` | Submit a new RSVP. | `{ "name": "Athur", "guests": 2, "attendance": "yes", "wishes": "Congrats!" }` |
| `/api/registry` | `GET` | Get available gift items. | - |
| `/api/registry` | `POST` | Reserve a gift item. | `{ "item": "Coffee Maker", "sender": "Dara" }` |
| `/api/wishes` | `GET` | Get the latest 20 wishes. | - |
| `/api/state` | `GET` | Get user's existing state. | `?name=GuestName` |
| `/api/rsvp/download` | `GET` | Download RSVPs as CSV. | - |

## 🎨 Design Reference

See [design-guideline.md](design-guideline.md) for detailed color palettes, typography choices, and vendor guidelines.

---

**Made with ❤️ for Athur & Dara.**
