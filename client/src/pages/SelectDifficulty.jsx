import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  Sparkles,
  Zap,
  Flame,
  Layers,
  Video,
  Volume2,
  HelpCircle,
  ArrowRight,
  Check,
  ShieldCheck,
  Clock
} from 'lucide-react';

export default function SelectDifficulty() {
  const [difficulty, setDifficulty] = useState('Simple');
  const [category, setCategory] = useState('All');
  const [questionCount, setQuestionCount] = useState(5);
  const [enableWebcam, setEnableWebcam] = useState(true);
  const [enableVoice, setEnableVoice] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const difficulties = [
    {
      id: 'Simple',
      title: 'Simple / Beginner',
      subtitle: 'Fundamentals & Syntax',
      description: 'Ideal for campus placements, fresh graduates, and junior engineers. Focuses on core definitions, basic mechanisms, and fundamental concepts.',
      icon: Zap,
      badge: 'Level 1',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      activeBorder: 'border-emerald-500/80 bg-emerald-50/70 dark:bg-emerald-950/20 shadow-emerald-500/10',
      timePerQ: '2 mins / question'
    },
    {
      id: 'Intermediate',
      title: 'Intermediate',
      subtitle: 'Core Patterns & Internals',
      description: 'Focuses on architectural lifecycles, async execution, event loop, indexing, and debugging real-world scenarios.',
      icon: Sparkles,
      badge: 'Level 2',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      activeBorder: 'border-amber-500/80 bg-amber-50/70 dark:bg-amber-950/20 shadow-amber-500/10',
      timePerQ: '2.5 mins / question'
    },
    {
      id: 'Hard',
      title: 'Hard / Advanced',
      subtitle: 'High Concurrency & Architecture',
      description: 'Senior software engineering level. System design, distributed caching, algorithm proofs, and complex architectural decisions.',
      icon: Flame,
      badge: 'Level 3',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
      activeBorder: 'border-rose-500/80 bg-rose-50/70 dark:bg-rose-950/20 shadow-rose-500/10',
      timePerQ: '3 mins / question'
    }
  ];

  const categories = [
    { id: 'All', name: 'All Categories (Comprehensive Exam)' },
    { id: 'Full Stack', name: 'Full Stack MERN' },
    { id: 'Frontend', name: 'Frontend (React & JS)' },
    { id: 'Backend', name: 'Backend (Node & Express)' },
    { id: 'Data Structures', name: 'Data Structures & Alg' },
    { id: 'Database & SQL', name: 'Database & MongoDB' },
    { id: 'HR & Behavioral', name: 'HR & Behavioral (STAR)' }
  ];

  const handleStart = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await api.startInterview({
        difficulty,
        category,
        count: questionCount
      });

      if (res.success && res.questions?.length > 0) {
        navigate('/interview', {
          state: {
            questions: res.questions,
            difficulty: res.difficulty,
            category: res.category,
            totalQuestions: res.totalQuestions,
            enableWebcam,
            enableVoice
          }
        });
      } else {
        setError(res.message || 'Failed to initialize questions.');
      }
    } catch (err) {
      setError(err.message || 'Error starting interview.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
          <span>Module 2.1 — Step 2.0</span>
          <span>•</span>
          <span>Difficulty & Track Selection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Configure Your Mock Interview
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
          Select your target difficulty tier and specialization track to simulate an authentic recruitment experience.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-medium text-center">
          {error}
        </div>
      )}

      {/* Step 1: Difficulty Levels Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
            <span>Select Interview Difficulty Level</span>
          </label>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Mandatory requirement</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {difficulties.map((diff) => {
            const Icon = diff.icon;
            const isSelected = difficulty === diff.id;

            return (
              <div
                key={diff.id}
                onClick={() => setDifficulty(diff.id)}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-200 border relative flex flex-col justify-between ${
                  isSelected
                    ? `${diff.activeBorder} shadow-lg ring-1 ring-indigo-500/20`
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                {/* Active Checkmark Pill */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-white">
                      <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${diff.badgeColor}`}>
                      {diff.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{diff.title}</h3>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2">{diff.subtitle}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{diff.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{diff.timePerQ}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Category Track */}
      <div className="space-y-4">
        <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">2</span>
          <span>Choose Domain / Subject Track</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`py-3 px-4 rounded-xl text-xs font-semibold text-left transition-all border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white shadow-sm'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Session Simulation Options */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-200">
        <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">3</span>
          <span>Simulation Environment Settings</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Question Count */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Question Count</span>
            <div className="flex items-center gap-2">
              {[3, 5, 7].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    questionCount === num
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {num} Qs
                </button>
              ))}
            </div>
          </div>

          {/* Webcam Preview Toggle */}
          <div
            onClick={() => setEnableWebcam(!enableWebcam)}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Webcam Preview</span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Live candidate video feed</p>
            </div>
            <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${enableWebcam ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${enableWebcam ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>

          {/* Audio TTS Voice Toggle */}
          <div
            onClick={() => setEnableVoice(!enableVoice)}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Audio Questions</span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Interviewer voice synthesis</p>
            </div>
            <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${enableVoice ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${enableVoice ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-2 text-center">
        <button
          onClick={handleStart}
          disabled={loading}
          className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] transition-all text-base disabled:opacity-50"
        >
          {loading ? (
            <span>Preparing Session Questions...</span>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Launch Mock Interview Room</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

    </div>
  );
}
