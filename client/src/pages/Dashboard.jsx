import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  PlayCircle,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileText,
  Sparkles,
  BarChart3,
  Calendar
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.getMyHistory();
        if (res.success) {
          setHistory(res.results || []);
        }
      } catch (err) {
        console.warn('Error loading history:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Compute metrics
  const totalInterviews = history.length;
  const avgScore = totalInterviews > 0
    ? Math.round(history.reduce((acc, curr) => acc + curr.percentage, 0) / totalInterviews)
    : 0;
  const bestScore = totalInterviews > 0
    ? Math.max(...history.map(h => h.percentage))
    : 0;
  const totalMinutes = Math.round(
    history.reduce((acc, curr) => acc + (curr.timeSpentSeconds || 0), 0) / 60
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Candidate Portal
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-400">{user?.targetRole || 'Full Stack Developer'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Ready to sharpen your interview technique? Select a difficulty level and practice real technical challenges.
          </p>
        </div>

        <Link
          to="/select"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 transition-all text-sm shrink-0"
        >
          <PlayCircle className="w-5 h-5 text-amber-300" />
          <span>Launch Mock Interview</span>
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Interviews Taken</span>
            <BarChart3 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{totalInterviews}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Total sessions logged</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Average Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{avgScore}%</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Across all difficulty tiers</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Best Score</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">{bestScore}%</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Top performance recorded</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Practice Time</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">{totalMinutes} <span className="text-sm font-normal text-slate-400">min</span></p>
          <p className="text-[11px] text-slate-400 mt-0.5">Active interview answering</p>
        </div>
      </div>

      {/* Main Content Area: Recent Interviews & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Attempts (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Recent Mock Interviews</span>
            </h2>
            {history.length > 0 && (
              <Link to="/history" className="text-xs font-semibold text-indigo-400 hover:underline">
                View All History
              </Link>
            )}
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Loading sessions...</div>
          ) : history.length === 0 ? (
            <div className="p-10 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
              <p className="text-sm font-semibold text-white">No interviews completed yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Begin your first mock interview to evaluate your technical understanding and see detailed analytics.
              </p>
              <Link
                to="/select"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all mt-2"
              >
                Start First Interview
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 5).map((item) => (
                <div
                  key={item._id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        item.difficulty === 'Simple' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        item.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {item.difficulty}
                      </span>
                      <span className="text-xs font-semibold text-white">{item.category} Track</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{item.answers?.length || 0} Questions</span>
                      <span>•</span>
                      <span className="text-slate-300 font-medium">{item.performanceGrade}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-white">{item.percentage}%</span>
                      <p className="text-[10px] text-slate-400">{item.totalScore}/{item.maxPossibleScore} pts</p>
                    </div>
                    <Link
                      to={`/results/${item._id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 hover:text-white transition-colors"
                    >
                      Report
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Coaching Advice & Prep Checklist */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Placement Preparation Checklist</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                <div>
                  <strong className="text-white block">Speak Clearly & Structured</strong>
                  State definition first, explain architectural purpose, and conclude with a practical example.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
                <div>
                  <strong className="text-white block">Use Technical Terminology</strong>
                  The evaluation engine scores keywords like "Reconciliation", "Event Loop", "Indexes", and "B-Tree".
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0"></span>
                <div>
                  <strong className="text-white block">Behavioral: Use STAR Method</strong>
                  For HR questions, specify Situation, Task, Action taken, and measurable Result.
                </div>
              </div>
            </div>

            <Link
              to="/select"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-all mt-4"
            >
              <span>Practice Questions Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
