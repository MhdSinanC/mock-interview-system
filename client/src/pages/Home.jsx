import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Terminal,
  Brain,
  Video,
  Mic,
  FileCheck,
  TrendingUp,
  Shield,
  BookOpen
} from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuth();

  const tracks = [
    {
      title: "Full Stack (MERN)",
      desc: "MongoDB, Express, React, Node.js, REST architecture, state management, and full-stack security.",
      color: "from-blue-500/10 to-indigo-500/10 border-blue-500/30",
      tag: "Most Popular"
    },
    {
      title: "Frontend Engineering",
      desc: "React 19, Virtual DOM, Hooks, state patterns, JavaScript ES6+, browser internals, and CSS layout.",
      color: "from-purple-500/10 to-pink-500/10 border-purple-500/30",
      tag: "In Demand"
    },
    {
      title: "Backend & Systems",
      desc: "Node.js Event Loop, asynchronous I/O, middleware pipelines, databases, and microservices.",
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/30",
      tag: "Core Tech"
    },
    {
      title: "Data Structures & Alg",
      desc: "Arrays, Linked Lists, Hash Tables, Trees, Graphs, Sorting, and Big-O algorithmic complexity.",
      color: "from-amber-500/10 to-orange-500/10 border-amber-500/30",
      tag: "Technical Prep"
    },
    {
      title: "Database & SQL/NoSQL",
      desc: "MongoDB collections, indexing strategies, aggregation pipelines, ACID transactions, and normalization.",
      color: "from-cyan-500/10 to-blue-500/10 border-cyan-500/30",
      tag: "Data Modeling"
    },
    {
      title: "HR & Behavioral (STAR)",
      desc: "Structured behavioral questions, leadership scenarios, conflict resolution, and soft skills.",
      color: "from-rose-500/10 to-pink-500/10 border-rose-500/30",
      tag: "Placement Ready"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-pink-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-300 mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Mock Interview System</span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span className="text-slate-600 dark:text-slate-400">Built with MERN Stack</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
            Master Your Technical <br />
            <span className="gradient-text">Interviews With Confidence.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Practice real-world technical and HR interview questions across 
            <strong className="text-slate-900 dark:text-slate-200"> Beginner, Intermediate, and Hard</strong> tiers. 
            Receive instant keyword analytics, score breakdowns, and constructive feedback.
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/select" : "/register"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Start Mock Interview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white shadow-sm transition-all"
            >
              <Terminal className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Explore Demo Accounts</span>
            </Link>
          </div>

          {/* Key Metric Highlights */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 shadow-sm backdrop-blur-sm">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">3 Difficulty</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Simple, Intermediate, Hard</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 shadow-sm backdrop-blur-sm">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Real-Time</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Voice Dictation & TTS</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 shadow-sm backdrop-blur-sm">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Smart Engine</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Keyword & Concept Scoring</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 shadow-sm backdrop-blur-sm">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">100% Offline</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Zero external API dependencies</p>
            </div>
          </div>

        </div>
      </section>

      {/* Process Flow Diagram (DFD Section) */}
      <section className="py-20 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold mb-2">Architectural Workflow</h2>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">How The Mock Interview System Works</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
              Aligned with the Software Development Life Cycle (SDLC) and Data Flow Diagrams (DFD Level 0, 1, 2) in the project synopsis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 shadow-sm transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Step 1.0</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">Difficulty Selection</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Choose between Simple, Intermediate, or Hard levels and select interview category (MERN, DSA, HR).
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 shadow-sm transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Step 2.0</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">Live Simulation</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Candidate answers questions one by one with live webcam feed, audio TTS, and voice-to-text dictation.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-pink-500/40 shadow-sm transition-all group">
              <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">Step 3.0</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">Answer Evaluation</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                The evaluation engine compares candidate answers with ideal models, matching essential technical terminology.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 shadow-sm transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileCheck className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Step 4.0</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">Score & Feedback</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Detailed report generated with percentage grade, strengths, improvement areas, and printable PDF transcript.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Tracks Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold mb-2">Category Tracks</h2>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Choose Your Specialization</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
            Pre-loaded with verified technical and behavioral questions mapped to industry standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl bg-gradient-to-br ${track.color} bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm flex flex-col justify-between hover:-translate-y-1 transition-all duration-300`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10">
                    {track.tag}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{track.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">{track.desc}</p>
              </div>

              <Link
                to="/select"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-white transition-colors"
              >
                <span>Practice this track</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Academic Citation Box */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-100 via-indigo-50/60 to-slate-100 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center relative overflow-hidden">
          <div className="relative z-10">
            <BookOpen className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Academic Project Submission</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">Submitted By: <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Jezeem Muhammed</span></p>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl mx-auto mt-3 leading-relaxed">
              Designed as a comprehensive solution for students, placement cells, and freshers to overcome interview anxiety and achieve high technical placement scores through realistic mock sessions.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                to="/select"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
              >
                Launch Interview Room Now
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
