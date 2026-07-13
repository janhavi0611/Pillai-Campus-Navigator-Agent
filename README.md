# Pillai Navigator AI

An intelligent indoor campus navigation and student assistance web application built exclusively for Pillai College of Engineering (Pillai University). Powered by Gemini AI and standard-compliant React + Vite + Express full-stack architecture.

## Features

- 📍 **Landmark-First Navigation**: Detailed routes for classrooms, laboratories, offices, departments, sports facilities, and amenities using memorable physical landmarks.
- 🛗 **Smart Route Planning**: Offers optimal options such as **Standard Route**, **Accessible Route** (wheelchair-friendly, lift-primary, no-stairs), and **Fastest Route** (staircases for speed).
- 🗺️ **Interactive Floor Explorer**: Highly visual floor directory with offices, labs, and interactive navigation charting.
- 🤖 **Gemini AI Campus Assistant**: Seamless indoor assistant to resolve navigation questions, guide lost visitors, and assist new students.
- 🏥 **Emergency Protocols**: Quick directional access to the First Aid Room and safety locations.

---

## Technical Setup & Fixes

### Module Import Resolution Fix
If you previously encountered a `Cannot find module '.../api.js' imported from server.ts` error during local execution on Windows/OneDrive, this has been resolved. 

- We explicitly configured `tsconfig.json` to support direct TS imports via `"allowImportingTsExtensions": true`.
- All local server imports have been converted to native `.ts` imports (e.g., `import apiRouter from "./src/server/api.ts"`), ensuring perfect resolution in both dev-time execution (`tsx`) and compile-time bundling (`esbuild`).

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (installed automatically with Node.js)

### Installation
1. Clone your repository:
   ```bash
   git clone <your-github-repo-url>
   cd <your-repo-folder-name>
   ```

2. Install the project dependencies:
   ```bash
   npm install
   ```

3. Configure your Environment Variables:
   Create a `.env` file in the root directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and replace `MY_GEMINI_API_KEY` with your actual Gemini API Key from Google AI Studio:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   ```

---

## Running the Application

### Development Mode
Runs the backend Express server with Vite's HMR middleware:
```bash
npm run dev
```
Your application will be live at: **[http://localhost:3000](http://localhost:3000)**

### Production Build
Builds the client SPA assets via Vite, and bundles the server into a single standalone, high-performance module via `esbuild`:
```bash
npm run build
```

### Start Production Server
Launches the compiled standalone server:
```bash
npm run start
```

---

## Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Motion (Framer Motion)
- **Backend**: Node.js, Express
- **AI Engine**: `@google/genai` TypeScript SDK (powered by Gemini models)
- **Bundler/Compiler**: `esbuild` (for Node server), `vite` (for React client)
