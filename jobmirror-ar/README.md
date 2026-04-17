# JobMirror AR

JobMirror AR is a browser-based mock interview application built with React and Vite. It lets a candidate upload a resume, uses Google Gemini to generate interview questions from that resume, captures spoken answers through the browser microphone, and returns AI-generated feedback with a score. The interview is presented through a 3D animated avatar layered over a live webcam feed to create a more immersive practice experience.

## Project Purpose

This project is designed as an AI-assisted interview simulator. Instead of showing generic questions, the app reads the candidate's resume and creates a short personalized interview flow. It then evaluates each spoken answer and gives fast feedback so the candidate can practice technical interview responses in a more realistic setting.

## Main Features

- Resume upload with drag-and-drop support
- PDF text extraction using `pdfjs-dist`
- Plain text resume support through `.txt` files
- Gemini-powered interview question generation
- Gemini-powered answer scoring and short feedback
- Speech-to-text answer capture using browser speech recognition
- Text-to-speech playback for interviewer prompts and feedback
- 3D interviewer avatar rendered with React Three Fiber
- Live webcam preview for both interviewer and candidate panels

## How The App Works

### 1. Resume Upload

The app starts on an upload screen where the user drags in a resume file. The current implementation accepts:

- `.pdf`
- `.txt`

If the file is a PDF, the app reads every page and concatenates the extracted text into a single string. If the file is a text file, it reads the raw text directly.

### 2. AI Question Generation

Once the resume text is available, the app sends a prompt to Google Gemini asking for:

- 2 short technical questions
- a strict JSON array response

The application then prepends a fixed opening question:

- `Briefly introduce yourself and your background.`

If the AI request fails or returns malformed output, the app falls back to three default interview questions.

### 3. Interview Session

During the interview:

- the app speaks the current question using the browser Speech Synthesis API
- the 3D avatar animates while speaking
- the candidate answers using the microphone
- browser speech recognition converts the answer into text in real time

### 4. Answer Analysis

When the user stops recording, the transcribed answer is sent to Gemini with the current question. Gemini is asked to return JSON with:

- `score`
- `feedback`
- `confidence`

The UI then displays:

- a numeric score out of 100
- a short feedback message
- a button to move to the next question

### 5. Interview Completion

After the last question, the app shows a browser alert and resets back to the upload screen.

## Tech Stack

### Frontend

- React 19
- Vite 7

### 3D and Media

- `@react-three/fiber`
- `@react-three/drei`
- `three`
- `react-webcam`

### AI and Document Processing

- `@google/generative-ai`
- `pdfjs-dist`

### Input and UI Utilities

- `react-dropzone`
- `lucide-react`

## Current Project Structure

```text
jobmirror-ar/
├─ public/
│  ├─ avatar.glb            # 3D interviewer model
│  └─ vite.svg
├─ src/
│  ├─ App.jsx               # Main interview UI and app logic
│  ├─ gemini.js             # Gemini integration for questions and scoring
│  ├─ main.jsx              # React entry point
│  ├─ index.css             # Global base styles
│  ├─ App.css               # Default Vite styles, mostly unused
│  └─ test-api.js           # Simple script for testing Gemini model access
├─ index.html
├─ vite.config.js
├─ eslint.config.js
├─ package.json
└─ README.md
```

## Key Files Explained

### `src/App.jsx`

This is the heart of the application. It contains:

- upload handling
- PDF reading logic
- app step/state management
- speech synthesis
- speech recognition
- answer analysis flow
- interview UI
- avatar rendering and animation

The app uses a step-based flow:

- `upload`
- `scanning`
- `interview`
- `feedback`

### `src/gemini.js`

This file handles all Gemini communication. It exports two functions:

- `generateInterviewQuestions(resumeText)`
- `analyzeCandidateAnswer(question, answer)`

It also includes fallback behavior so the UI still works if the model call fails.

### `public/avatar.glb`

This GLB file is the 3D interviewer avatar displayed in the left interview panel. The app traverses the arm, head, and jaw bones and animates them while speech is playing.

## Installation

### Prerequisites

- Node.js 18 or newer is recommended
- npm
- A Chromium-based browser is strongly recommended for speech recognition

### Steps

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the local Vite URL shown in the terminal.

4. Allow browser access to:

- microphone
- camera

## Build For Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Browser Requirements

This app depends on browser APIs that are not implemented consistently across all browsers.

### Required or Recommended Capabilities

- `webkitSpeechRecognition` for speech-to-text
- `speechSynthesis` for spoken questions and spoken feedback
- camera permission for webcam streams
- microphone permission for spoken answers

### Best Experience

- Google Chrome or another Chromium-based browser

The current code explicitly checks for `webkitSpeechRecognition`, so non-Chrome browsers may not support the interview recording flow.

## AI Configuration

The project currently connects to Google Gemini through `@google/generative-ai`.

### Current Implementation

The API key is hardcoded in:

- `src/gemini.js`
- `src/test-api.js`

### Important Security Note

Hardcoding API keys in frontend code is not safe for production because the key becomes visible to anyone using the app. A better production setup would be:

- store the key in environment variables
- move Gemini requests to a backend service
- keep the API key private on the server

## Data Flow Summary

```text
Resume Upload
   -> FileReader
   -> PDF or text extraction
   -> Gemini question generation
   -> Interview question shown and spoken
   -> Candidate speech captured by microphone
   -> Browser speech recognition transcript
   -> Gemini answer evaluation
   -> Score and feedback displayed
```

## UI Overview

The interface is split into two main areas:

### Sidebar

- Branding for JobMirror
- Static navigation items for Dashboard, Interview, and Profile

### Main Workspace

Depending on the app state, the workspace shows:

- upload screen
- scanning screen
- interview layout
- feedback panel

During the interview, the layout becomes a two-column dashboard:

- left side: AI interviewer with avatar and webcam background
- right side: candidate webcam and answer transcript/feedback panel

## Animation Behavior

The avatar animation is bone-driven:

- head bones are used for subtle nodding
- jaw candidate bones are rotated while the avatar is speaking
- arms are rotated downward during setup

Speech playback controls the avatar's speaking state. When text-to-speech starts, `isSpeaking` becomes true and the jaw/head motion runs in the render loop.

## Error Handling And Fallbacks

The app includes a few defensive fallbacks:

- malformed or failed Gemini question responses fall back to default questions
- malformed or failed Gemini analysis responses fall back to a generic score and feedback
- very short or empty answers return a zero score with a retry message
- speech synthesis errors are caught and logged

## Known Limitations

- The API key is exposed in frontend source code
- Speech recognition currently depends on `webkitSpeechRecognition`
- The UI says resume upload is PDF-focused, but the app also supports `.txt`
- The PDF worker is loaded from a CDN, so the app depends on that external URL
- The app uses inline styles rather than a reusable component styling system
- There is no backend, authentication, persistence, or saved interview history
- There are no automated tests in the current codebase
- The interview ends with a browser alert instead of a summary/results page
- Gemini prompts are simple and generate only a very short interview flow

## Possible Future Improvements

- Move AI requests to a backend API
- Store secrets in environment variables
- Add interview history and result summaries
- Add more question categories and difficulty levels
- Support role-based question generation
- Save transcripts and feedback for later review
- Add progress indicators and final performance reports
- Improve responsiveness for smaller screens
- Replace browser alert completion with a dedicated results screen
- Add automated tests for upload, question generation, and scoring flows

## Available Scripts

From `package.json`:

- `npm run dev` starts the Vite development server
- `npm run build` creates a production build
- `npm run preview` previews the production build locally
- `npm run lint` runs ESLint

## Notes For Reviewers Or Examiners

If this project is part of a final year project or prototype demonstration, the most important idea is that it combines:

- resume-aware interview generation
- real-time voice interaction
- AI scoring
- a 3D avatar-based interface

That makes it more than a standard chatbot UI. It aims to simulate a lightweight interview environment inside the browser using only frontend technologies plus Gemini API access.

## Suggested README Summary

JobMirror AR is an AI-powered mock interview web app that turns a candidate's resume into a short personalized interview. It uses Gemini to generate questions and analyze answers, browser APIs for speech input/output, and React Three Fiber to present an animated 3D interviewer avatar over a live webcam scene.
