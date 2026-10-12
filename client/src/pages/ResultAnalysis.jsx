import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import ScoreGauge from '../components/ScoreGauge';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Printer,
  RotateCcw,
  LayoutDashboard,
  Check,
  X,
  Sparkles,
  Clock,
  Calendar,
  Share2
} from 'lucide-react';

export default function ResultAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.getResultById(id);
        if (res.success && res.result) {
          setResult(res.result);
          if (res.result.percentage >= 70) {
            triggerConfetti();
          }
        } else {
          setError(res.message || 'Report not found.');
        }
      } catch (err) {
        setError(err.message || 'Error fetching evaluation report.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti effect ignored:', e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400">
        <Sparkles className="w-8 h-8 text-indigo-400 mx-auto animate-spin mb-3" />
        <p className="text-sm font-semibold text-white">Synthesizing Evaluation Report...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Evaluation Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'Unable to retrieve report details.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const durationMinutes = Math.floor((result.timeSpentSeconds || 0) / 60);
  const durationSeconds = (result.timeSpentSeconds || 0) % 60;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 print:py-2 print:px-0">
      
      {/* Top Banner & Print Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 print:hidden">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
            Module 5.0 • Result Analysis & Evaluation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Interview Performance Report
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Candidate: <strong className="text-white">{result.userName}</strong> • {result.category} Track
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Academic Report</span>
          </button>

          <Link
            to="/select"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Interview</span>
          </Link>
        </div>
      </div>

      {/* Header Card for Print */}
      <div className="hidden print:block text-center pb-4 border-b border-slate-300 text-black">
        <h2 className="text-2xl font-bold">MOCK INTERVIEW SYSTEM — PERFORMANCE REPORT</h2>
        <p className="text-xs">Academic Submission by Jezeem Muhammed</p>
        <p className="text-xs mt-1">Candidate: {result.userName} ({result.userEmail}) | Date: {new Date(result.createdAt).toLocaleString()}</p>
      </div>

      {/* Primary Performance Metric Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl print:bg-white print:border-black print:text-black">
        
        {/* Left: Score Gauge */}
        <div className="flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-6">
          <ScoreGauge
            percentage={result.percentage}
            grade={result.performanceGrade}
            size={180}
          />
        </div>

        {/* Center: Session Metrics & Statistics */}
        <div className="space-y-4 md:col-span-2 flex flex-col justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 print:border-gray-300">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Score</span>
              <p className="text-xl font-bold text-white print:text-black mt-1">
                {result.totalScore} <span className="text-xs text-slate-400 font-normal">/ {result.maxPossibleScore}</span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 print:border-gray-300">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Difficulty Level</span>
              <p className="text-sm font-bold text-indigo-400 mt-1 capitalize">{result.difficulty}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 print:border-gray-300">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Duration</span>
              <p className="text-sm font-bold text-white print:text-black mt-1">
                {durationMinutes}m {durationSeconds}s
              </p>
            </div>
          </div>

          {/* Feedback Summary */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <h4 className="text-xs font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Executive Performance Feedback</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {result.overallFeedback}
            </p>
          </div>
        </div>

      </div>

      {/* Strengths & Improvement Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Demonstrated Strengths</span>
          </h3>

          {result.strengths && result.strengths.length > 0 ? (
            <ul className="space-y-2">
              {result.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">Continue practicing foundational technical answers.</p>
          )}
        </div>

        {/* Improvement Areas */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Recommended Areas For Improvement</span>
          </h3>

          {result.areasForImprovement && result.areasForImprovement.length > 0 ? (
            <ul className="space-y-2">
              {result.areasForImprovement.map((area, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">Consistently solid technical performance across all areas.</p>
          )}
        </div>

      </div>

      {/* Question-by-Question Detailed Review */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Detailed Answer Diagnostics</span>
          <span className="text-xs text-slate-400 font-normal">
            ({result.answers?.length || 0} Questions Evaluated)
          </span>
        </h2>

        <div className="space-y-6">
          {result.answers?.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg"
            >
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-white">{item.category}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase bg-slate-800 text-slate-400">
                    {item.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Score:</span>
                  <span className="text-sm font-bold text-white">
                    {item.score} / {item.maxScore} pts
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.accuracyPercentage >= 75
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : item.accuracyPercentage >= 50
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    {item.accuracyPercentage}%
                  </span>
                </div>
              </div>

              {/* Question Statement */}
              <p className="text-sm font-bold text-white">
                {item.questionText}
              </p>

              {/* Candidate's Answer */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Your Answer:
                </span>
                <p className="text-xs text-slate-200 whitespace-pre-wrap font-mono leading-relaxed">
                  {item.userAnswer || <span className="text-rose-400 italic">No answer submitted.</span>}
                </p>
              </div>

              {/* Model / Ideal Answer */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Ideal Model Answer:
                </span>
                <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {item.idealAnswer}
                </p>
              </div>

              {/* Keyword Analytics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Matched Keywords */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Matched Keywords ({item.matchedKeywords?.length || 0})</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.matchedKeywords && item.matchedKeywords.length > 0 ? (
                      item.matchedKeywords.map((k, kIdx) => (
                        <span key={kIdx} className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          {k}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">None matched</span>
                    )}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-amber-400 flex items-center gap-1">
                    <X className="w-3 h-3" />
                    <span>Missing / Suggested Keywords ({item.missingKeywords?.length || 0})</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.missingKeywords && item.missingKeywords.length > 0 ? (
                      item.missingKeywords.map((k, kIdx) => (
                        <span key={kIdx} className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          {k}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-emerald-400">All key terms covered!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Evaluator Commentary */}
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed">
                💬 <strong>Examiner Feedback:</strong> {item.feedback}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-slate-800 flex items-center justify-between print:hidden">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <Link
          to="/select"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start Another Interview Session</span>
        </Link>
      </div>

    </div>
  );
}
