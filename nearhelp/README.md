# NearHelp — Real-time Emergency Community Response Platform

NearHelp is a production-ready SOS platform designed to connect people in crisis with nearby community responders.

## 🚀 Features

- **Real-time SOS Broadcasting**: Geospatial alerts sent to nearby users.
- **AI Crisis Assistant**: Immediate step-by-step guidance powered by Gemini.
- **Live Map Tracking**: Pulsing markers and responder locations.
- **Emergency Chat**: Dedicated real-time communication for each SOS.
- **Skill Registry**: Highlights responders with medical or safety skills.

## 🏗 Tech Stack

- **Frontend**: React, TailwindCSS, Leaflet.js, Socket.io-client
- **Backend**: Node.js, Express, Socket.io, SQLite (better-sqlite3)
- **AI**: Google Gemini API
- **Auth**: JWT, bcryptjs

## 🛠 Setup

1. Run the setup script:
   ```bash
   chmod +x setup.sh web.sh
   ./setup.sh
   ```

2. Add your `GEMINI_API_KEY` to the `.env` file.

3. Start the application:
   ```bash
   ./web.sh
   ```

## 📍 Architecture

- `/server.ts`: Main entry point.
- `/server/`: Backend logic (routes, sockets, services).
- `/src/`: Frontend React application.
- `/nearhelp.db`: SQLite database.
