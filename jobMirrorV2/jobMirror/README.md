# JobMirror

JobMirror is a React + Vite interview preparation platform prototype focused on mock interview practice, learning roadmaps, timed quizzes, and profile-based progress tracking. The current implementation is a frontend-heavy demo that combines a polished landing experience with a dashboard for interview and learning workflows.

## Project Overview

The app is designed around two major experiences:

1. A public marketing site with a video hero section, feature highlights, user reviews, and pricing cards.
2. A private-style dashboard experience where users can sign in, manage a profile, practice interviews, and follow learning plans.

Although the UI presents JobMirror as an AI-powered interview coach, the current codebase is mostly a frontend prototype:

- Authentication is simulated with `localStorage`
- Profile data is stored in `localStorage`
- Dashboard analytics use mock data
- Interview recording uses browser media APIs
- Quiz questions are fetched live from Open Trivia DB
- Upload and backend integrations are currently stubbed or only partially wired

## Core Features

### Public Website

- Full-screen landing page with a background video from `public/hero.mp4`
- Transparent/glass-style navigation bar with session-aware buttons
- Dedicated features page with spotlight hover cards
- Reviews marquee and pricing section
- Sign-up call-to-action linked into the auth flow

### Authentication

- Unified authentication page for both `/login` and `/signup`
- Animated flip-style auth UI driven by route changes
- Demo local account creation and sign-in using browser storage
- Demo social sign-in buttons for Google and GitHub
- Session persistence using `jobmirror:session` in `localStorage`

### Dashboard

- Sidebar-based dashboard layout
- Overview page with stat cards, recent interview results, activity feed, and a Recharts performance chart
- Profile management page with editable user details, links, skills, and resume URL
- Interview category selection page
- Guided interview runner with:
  - speech synthesis for reading out the question
  - camera and microphone permission flow
  - countdown before recording
  - local video preview
  - download/discard controls
- Learning page linking into quizzes and roadmaps

### Learning Tools

- Timed computer science quiz page
- Live question fetch from Open Trivia DB
- Per-question countdown timer
- End-of-quiz review and score summary
- Multi-track roadmap explorer with milestone progress tracking
- Roadmap export/import as JSON
- Local persistence of roadmap completion state

## Tech Stack

- React 19
- Vite 7
- React Router DOM 7
- Tailwind CSS 4
- Axios
- Recharts
- Browser APIs:
  - `localStorage`
  - `MediaRecorder`
  - `getUserMedia`
  - `speechSynthesis`
  - `FileReader`

## Project Structure

```text
jobMirror/
├─ public/
│  ├─ hero.mp4
│  └─ vite.svg
├─ src/
│  ├─ api/
│  │  ├─ axios.js
│  │  ├─ authService.js
│  │  └─ ProtectedRoute.jsx
│  ├─ assets/
│  ├─ components/
│  │  ├─ dashboard/
│  │  └─ ui/
│  ├─ layouts/
│  ├─ pages/
│  │  ├─ dashboard/
│  │  └─ learning/
│  ├─ routes/
│  ├─ styles/
│  └─ utils/
├─ index.html
├─ package.json
└─ vite.config.js
```

## Routing Summary

### Public Routes

- `/` - landing page
- `/features` - product features, reviews, pricing
- `/login` - auth page in login mode
- `/signup` - auth page in signup mode

### Dashboard and Learning Routes

- `/dashboard` - dashboard home
- `/dashboard/profile` - editable profile page
- `/dashboard/interviews` - interview category selection
- `/dashboard/interviews/:type` - interview runner
- `/dashboard/learning` - learning hub
- `/learning/quiz` - timed quiz
- `/learning/roadmap` - learning roadmap explorer

## How Authentication Works

The current authentication flow is local/demo only.

- User records are stored under `jobmirror:users`
- Session info is stored under `jobmirror:session`
- Passwords are only base64-encoded in the browser for demonstration
- Social login buttons create synthetic demo users locally
- The navbar reacts to session state and changes its CTA buttons

There is also an Axios setup for a backend auth API:

- Base URL: `http://localhost:5000/api`
- Auth service helpers for register, login, refresh, and logout
- Refresh-token retry logic on `401` responses

However, this backend auth flow is not fully connected to the main auth page yet, which currently uses only `localStorage`.

## Interview System Details

The interview experience is one of the more advanced parts of the frontend:

- Users choose a category such as technical, behavioral, or case interview
- The interview runner loads a predefined prompt based on route params
- Speech synthesis can read the prompt aloud
- The user must explicitly enable camera and microphone first
- Recording is handled through `MediaRecorder`
- The recording can be previewed, downloaded, discarded, or mock-uploaded

This makes the feature interactive even without a backend, but it still behaves like a prototype:

- category cards currently navigate to `http://localhost:5174/` instead of the nested runner routes
- upload is simulated with a timeout and alert
- recorded answers are not analyzed by AI yet

## Learning Module Details

### Quiz

The quiz feature pulls 10 multiple-choice computer science questions from Open Trivia DB:

- Category: Science: Computers
- One question shown at a time
- Shuffled answers
- 30-second timer per question
- Score and review shown at the end

This means the quiz depends on internet connectivity when running in the browser.

### Roadmaps

The roadmap feature contains curated tracks such as:

- Frontend
- Backend
- Data Structures and Algorithms
- Machine Learning
- DevOps
- Security
- Web3
- Mobile Development

Each track includes milestones, estimated effort, descriptions, and external learning resources. Progress is saved locally and can be exported/imported as JSON.

## UI and Styling

The interface uses a dark, futuristic visual style built mainly with Tailwind CSS classes. A few areas include custom CSS:

- `src/styles/auth-flip.css` for the authentication card animation
- `src/components/ui/SpotlightCard.css` for hover spotlight effects

The dashboard is visually separate from the public site:

- `MainLayout` includes the navbar and footer
- `DashboardLayout` uses a left sidebar and full-height app shell

## Setup and Run

### Prerequisites

- Node.js 18+ recommended
- npm

### Install

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal, typically:

```text
http://localhost:5173
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Data and Persistence

This project currently relies on browser storage for most user state:

- `jobmirror:users` - registered demo users
- `jobmirror:session` - current signed-in user session
- `jobmirror:roadmap:progress` - roadmap completion state

If you want a clean demo state, clear `localStorage` in the browser.

## Current Limitations and Gaps

These are important if you plan to extend the project beyond demo use:

- Dashboard routes are not currently wrapped with `ProtectedRoute`
- The main auth UI does not use the Axios backend auth service
- `ProtectedRoute.jsx` exists but is not active in routing
- Interview category cards point to `http://localhost:5174/` instead of `/dashboard/interviews/technical`, `/behavioral`, or `/case`
- Several UI strings contain character-encoding artifacts
- The app mixes mock frontend data with partially prepared backend API utilities
- There are unused or legacy pages such as `src/pages/Dashboard.jsx` and `src/pages/Signup.jsx`
- Password handling is not secure and is only suitable for demos
- The video upload action is simulated and does not hit a real backend endpoint

## Suggested Next Steps

If you want to continue developing JobMirror, the highest-value improvements would be:

1. Connect the auth page to a real backend using the existing Axios/auth service layer.
2. Protect dashboard routes using `ProtectedRoute`.
3. Fix interview navigation so the three interview categories open the in-app runner routes.
4. Replace mock dashboard data with persisted interview history and analytics.
5. Add real AI feedback processing for recorded interview responses.
6. Normalize text encoding and clean up unused pages/components.
7. Move configuration values like API base URLs into environment variables.

## Notes for Developers

- This project does not currently use environment variables, but backend URLs should ideally move to `.env`
- The Axios client assumes a backend at `http://localhost:5000/api`
- Quiz functionality depends on Open Trivia DB being reachable from the browser
- Camera and microphone features require browser permission support
- Speech synthesis availability depends on the user’s browser and installed voices

## Verification

The source code was fully reviewed to generate this README. A production build verification was attempted, but the build could not be completed in this session because the sandbox blocked the required process spawn (`spawn EPERM`), so runtime/build validation is still recommended on a normal local shell.
