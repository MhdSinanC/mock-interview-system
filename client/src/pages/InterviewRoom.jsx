import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import WebcamSimulator from '../components/WebcamSimulator';
import SpeechRecognitionButton from '../components/SpeechRecognitionButton';
import {
  Volume2,
  VolumeX,
  Timer,
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  Bot,
  CheckCircle2,
  Code2
} from 'lucide-react';

export default function InterviewRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const sessionData = location.state;

  // Fallback if accessed directly without state
  useEffect(() => {
    if (!sessionData || !sessionData.questions || sessionData.questions.length === 0) {
      navigate('/select');
    }
  }, [sessionData, navigate]);

  if (!sessionData || !sessionData.questions || sessionData.questions.length === 0) {
    return null;
  }

  const { questions, difficulty, category, enableWebcam, enableVoice } = sessionData;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(() => {
    const initial = {};
    questions.forEach(q => { initial[q.id] = ''; });
    return initial;
  });

  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimitSeconds || 120);
  const [sessionTimeSpent, setSessionTimeSpent] = useState(0);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [confirmSubmitModal, setConfirmSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];

  // Global Session Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Per-Question Countdown Timer
  useEffect(() => {
    setTimeLeft(currentQuestion?.timeLimitSeconds || 120);
  }, [currentIndex, currentQuestion]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Audio Text-to-Speech for Interviewer Question
  const speakCurrentQuestion = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeakingQuestion) {
      window.speechSynthesis.cancel();
      setIsSpeakingQuestion(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentQuestion.questionText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeakingQuestion(false);
    utterance.onerror = () => setIsSpeakingQuestion(false);

    setIsSpeakingQuestion(true);
    window.speechSynthesis.speak(utterance);
  };

  // Auto-speak on first mount if voice enabled
  useEffect(() => {
    if (enableVoice && currentQuestion) {
      speakCurrentQuestion();
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentIndex]);

  const handleAnswerChange = (val) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: val
    }));
  };

  const handleVoiceTranscript = (text) => {
    setAnswers(prev => {
      const existing = prev[currentQuestion.id] || '';
      return {
        ...prev,
        [currentQuestion.id]: existing ? `${existing} ${text}` : text
      };
    });
  };

  const answeredCount = Object.values(answers).filter(a => a.trim().length > 0).length;

  const handleSubmitInterview = async () => {
    setIsSubmitting(true);
    try {
      const answersPayload = questions.map(q => ({
        questionId: q.id,
        answer: answers[q.id] || '',
        timeSpent: q.timeLimitSeconds - timeLeft
      }));

      const res = await api.submitInterview({
        difficulty,
        category,
        answers: answersPayload,
        timeSpentSeconds: sessionTimeSpent
      });

      if (res.success && res.result) {
        navigate(`/results/${res.result._id}`, { replace: true });
      } else {
        alert(res.message || 'Submission failed.');
        setIsSubmitting(false);
      }
    } catch (err) {
      alert(err.message || 'Error evaluating interview.');
      setIsSubmitting(false);
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentText = answers[currentQuestion.id] || '';
  const wordCount = currentText.trim() ? currentText.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Session Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
        
        {/* Left: Progress info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white px-3 py-1 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300">
              Q{currentIndex + 1} of {questions.length}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg uppercase ${
              difficulty === 'Simple' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {difficulty}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              {currentQuestion.category}
            </span>
          </div>
        </div>

        {/* Center: Question Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {questions.map((q, idx) => {
            const hasAnswer = (answers[q.id] || '').trim().length > 0;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 scale-105'
                    : hasAnswer
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Right: Timer & Finish CTA */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
            timeLeft < 30
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
              : 'bg-slate-950 text-slate-300 border-slate-800'
          }`}>
            <Timer className="w-3.5 h-3.5" />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          <button
            onClick={() => setConfirmSubmitModal(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Finish Interview</span>
          </button>
        </div>

      </div>

      {/* Main Interview Chamber: 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): AI Interviewer & Question Statement */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Interviewer Persona Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Technical Interviewer</h3>
                  <p className="text-[11px] text-slate-400">Mock Interview Assessment Engine</p>
                </div>
              </div>

              {/* Audio Reader Toggle */}
              <button
                onClick={speakCurrentQuestion}
                className={`p-2 rounded-xl transition-colors border ${
                  isSpeakingQuestion
                    ? 'bg-indigo-600 text-white border-indigo-500 animate-pulse'
                    : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                }`}
                title={isSpeakingQuestion ? "Mute audio" : "Listen to question voice"}
              >
                {isSpeakingQuestion ? <Volume2 className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                  Question #{currentIndex + 1}
                </span>
                <span className="text-[11px] text-slate-500">Max Score: {currentQuestion.maxScore} pts</span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentQuestion.questionText}
              </h2>
            </div>

            {/* Tips / Hint Drawer */}
            {currentQuestion.tips && (
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setShowTips(!showTips)}
                  className="flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showTips ? 'Hide Interviewer Tip' : 'Show Interviewer Tip / Guideline'}</span>
                </button>

                {showTips && (
                  <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
                    💡 <strong>Tip:</strong> {currentQuestion.tips}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Webcam Simulator View (if enabled) */}
          {enableWebcam && (
            <WebcamSimulator
              candidateName={user?.name || 'Candidate'}
              isSpeaking={isListeningVoice}
            />
          )}

        </div>

        {/* Right Column (7 cols): Candidate Answer Workspace */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl flex flex-col h-full justify-between">
            
            <div className="space-y-3">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white">Your Technical Response</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Voice Dictation (Mic) */}
                  <SpeechRecognitionButton
                    onTranscript={handleVoiceTranscript}
                    isListening={isListeningVoice}
                    setIsListening={setIsListeningVoice}
                  />
                </div>
              </div>

              {/* Textarea Input Box */}
              <div className="relative">
                <textarea
                  rows={13}
                  value={currentText}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Type or speak your answer here... Be clear, mention technical terminology, architecture trade-offs, and edge cases to maximize evaluation points."
                  className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-y"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
                  <span>{wordCount} words • {currentText.length} characters</span>
                  <span>Auto-saved locally</span>
                </div>
              </div>
            </div>

            {/* Bottom Nav Controls */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Question</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmSubmitModal(true)}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all"
                >
                  <span>Submit for Evaluation</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {confirmSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Complete & Evaluate Interview?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              You have answered <strong className="text-indigo-400">{answeredCount} of {questions.length}</strong> questions.
              {answeredCount < questions.length && (
                <span className="block mt-1 text-amber-300">
                  ⚠️ Note: Unanswered questions will receive 0 points.
                </span>
              )}
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmSubmitModal(false)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
              >
                Keep Answering
              </button>
              <button
                type="button"
                onClick={handleSubmitInterview}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Evaluating with AI Engine...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
