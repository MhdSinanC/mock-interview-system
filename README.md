# Mock Interview System — MERN Stack

An intelligent, web-based mock interview platform designed for students, placement cells, and fresh graduates to overcome interview fear, prepare for recruitment drives, and receive comprehensive performance evaluation.

> **Academic Project Submission**  
> **Submitted By:** Jezeem Muhammed  
> **Stack:** MERN Stack (MongoDB, Express.js, React.js, Node.js) with Tailwind CSS

---

## 🌟 Key Features

1. **User Authentication & Role Management (Module 1.0)**
   - Registration and secure login with JSON Web Tokens (JWT) & bcrypt password hashing.
   - Separate access roles: **Candidate / Student** and **System Administrator**.
   - Profile management with target track (Full Stack, Frontend, Backend, etc.) and experience level.

2. **Difficulty Level & Category Selection (Module 2.0 / DFD Level 1 & 2)**
   - **Simple / Beginner Level:** Foundational syntax, basic definitions, and core mechanisms.
   - **Intermediate Level:** Asynchronous patterns, lifecycles, indexing, and debugging.
   - **Hard / Advanced Level:** High-concurrency architecture, system design, and algorithmic proofs.
   - **Domain Tracks:** Full Stack (MERN), Frontend (React/JS), Backend (Node/Express), Data Structures & Algorithms, Database & SQL/NoSQL, and HR / Behavioral (STAR method).

3. **Interactive Mock Interview Room (Module 3.0)**
   - **Audio Interviewer (Text-to-Speech):** Synthesizes interview questions aloud using browser Web Speech API.
   - **Voice-to-Text Answer Dictation (Speech-to-Text):** Click-to-speak microphone input for candidate answers.
   - **Live Candidate Webcam Simulation:** Real-time video preview with status indicator and virtual avatar mode.
   - **Per-Question & Session Timers:** Dynamic countdown timer with visual progress bar and alert pulse.
   - **Interviewer Tips & Hint drawer:** Optional hints to guide structured responses.

4. **Intelligent Answer Evaluation & Scoring Engine (Module 4.0)**
   - Algorithmic semantic token similarity matching against model answers.
   - Technical terminology & keyword presence detection (e.g. "Virtual DOM", "Reconciliation", "Event Loop", "Indexing").
   - Detailed per-question accuracy score (out of 10), matched keywords, missing keywords, and coaching commentary.
   - Zero external API dependencies needed (100% reliable offline/academic viva ready).

5. **Result Analysis & Diagnostic Report (Module 5.0)**
   - Overall score percentage with animated high-score celebration.
   - Performance verdict grade: *Outstanding*, *Strong Candidate*, *Good Potential*, *Needs Improvement*.
   - Key Strengths & Areas for Improvement breakdown.
   - Question-by-question comparative diagnostics: Candidate answer vs Ideal answer.
   - **Printable / PDF Academic Export:** Formatted specifically for submission and printing (`Ctrl+P`).

6. **Admin & Question Management Module (Module 6.0)**
   - Question Bank CRUD: Add, edit, and delete questions with custom difficulty, category, keywords, and time limits.
   - Candidate monitoring: View all registered candidates, target roles, and dates.
   - Platform analytics: Global candidate scores, submission counts, and difficulty distributions.

7. **Dual-Mode Persistence Architecture**
   - Connects seamlessly to MongoDB via Mongoose when available (`MONGO_URI`).
   - Automatically activates persistent JSON storage fallback if local MongoDB service is inactive, ensuring **zero setup crashes** on any testing PC.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Default Demo Credentials
| Role | Identifier | Password | Access |
|---|---|---|---|
| **Candidate Demo** | `student@mockinterview.com` | `student123` | Candidate Dashboard, Interview Room, Diagnostics |
| **System Admin** | `admin@mockinterview.com` | `admin123` | Admin Dashboard, Question Bank CRUD, User Monitoring |

*(Both accounts are pre-seeded and available via 1-click autofill on the Login page).*

---

### Running the Application

1. **Start the Backend Server (Port 5000):**
   ```bash
   cd server
   npm install
   npm start
   ```

2. **Start the Frontend Client (Port 5173):**
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. Open **`http://localhost:5173`** in your browser.

---

## 📁 Project Structure

```
mock-interview-system/
├── server/
│   ├── config/
│   │   └── db.js                 # Database connection & fallback manager
│   ├── controllers/
│   │   ├── authController.js     # User registration & JWT authentication
│   │   ├── questionController.js # Question Bank CRUD & filters
│   │   ├── interviewController.js# Session generation & evaluation
│   │   └── adminController.js    # Platform metrics & user data
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification & Admin guards
│   ├── models/
│   │   ├── User.js               # Candidate & Admin Mongoose schema
│   │   ├── Question.js           # Interview question schema
│   │   └── Result.js             # Performance report schema
│   ├── data/
│   │   ├── seedQuestions.js      # Comprehensive question bank (Beginner to Hard)
│   │   └── store.js              # Persistence adapter & auto-seeder
│   ├── utils/
│   │   └── evaluationEngine.js   # NLP keyword matching & scoring
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── interviewRoutes.js
│   │   └── adminRoutes.js
│   ├── server.js                 # Express application entrypoint
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Glassmorphic header & profile controls
│   │   │   ├── Footer.jsx        # Project credits & academic details
│   │   │   ├── ScoreGauge.jsx    # Circular progress meter
│   │   │   ├── WebcamSimulator.jsx # Live camera feed & virtual avatar
│   │   │   ├── SpeechRecognitionButton.jsx # Voice dictation (STT)
│   │   │   └── ProtectedRoute.jsx# Auth routing guards
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication state & token management
│   │   │   └── ThemeContext.jsx  # Dark/Light theme mode
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Hero, DFD flow, tracks showcase
│   │   │   ├── Login.jsx         # Auth with 1-click demo fill
│   │   │   ├── Register.jsx      # Candidate onboarding
│   │   │   ├── Dashboard.jsx     # Candidate KPI center
│   │   │   ├── SelectDifficulty.jsx # Setup interview (Simple/Intermediate/Hard)
│   │   │   ├── InterviewRoom.jsx # Interactive interview room
│   │   │   ├── ResultAnalysis.jsx# Performance diagnostics & printable PDF
│   │   │   ├── History.jsx       # Attempt history & records
│   │   │   └── AdminDashboard.jsx# Question Bank CRUD & candidate list
│   │   ├── services/
│   │   │   └── api.js            # Frontend API client
│   │   ├── App.jsx               # Routes setup
│   │   ├── index.css             # Tailwind CSS & theme styling
│   │   └── main.jsx
│   ├── vite.config.js            # Vite configuration with proxy to port 5000
│   └── package.json
└── README.md
```

---

## 🎓 Academic Alignment (Project Synopsis)

| Synopsis Module | Implementation Status | Implementation File / Component |
|---|---|---|
| **1. User Module** | Completed | `authController.js`, `User.js`, `Login.jsx`, `Register.jsx`, `Dashboard.jsx` |
| **2. Admin Module** | Completed | `adminController.js`, `AdminDashboard.jsx`, Admin route protection |
| **3. Interview Module** | Completed | `interviewController.js`, `InterviewRoom.jsx`, Audio TTS & Voice STT |
| **4. Question Management** | Completed | `questionController.js`, `Question.js`, `seedQuestions.js`, Admin CRUD Modal |
| **5. Result Analysis Module** | Completed | `evaluationEngine.js`, `Result.js`, `ResultAnalysis.jsx`, PDF export |
| **DFD Level 0, 1, 2** | Implemented | Flow matches: 1.0 Auth -> 2.0 Difficulty -> 3.0 Interview -> 4.0 Result |

---

## 🛡️ License
Academic Project Submission by **Jezeem Muhammed**. Free for academic presentation, educational learning, and demonstration.
