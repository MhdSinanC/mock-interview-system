import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  History as HistoryIcon,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  FileText,
  Search,
  Filter
} from 'lucide-react';

export default function History() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.getMyHistory();
        if (res.success) {
          setResults(res.results || []);
        }
      } catch (err) {
        console.warn('Error loading history:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filtered = results.filter(r => {
    if (filterDifficulty !== 'All' && r.difficulty !== filterDifficulty) return false;
    if (searchTerm && !r.category.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <HistoryIcon className="w-7 h-7 text-indigo-400" />
            <span>Interview Attempt History</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review past mock interview reports, identify recurring weak spots, and monitor progress.
          </p>
        </div>

        <Link
          to="/select"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Interview</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by category..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">Difficulty:</span>
          {['All', 'Simple', 'Intermediate', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterDifficulty === diff
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading records...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
          <FileText className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-sm font-semibold text-white">No interview records found</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm || filterDifficulty !== 'All'
              ? 'Try adjusting your search filters.'
              : 'You have not attended any mock interviews yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const minutes = Math.floor((item.timeSpentSeconds || 0) / 60);
            const seconds = (item.timeSpentSeconds || 0) % 60;

            return (
              <div
                key={item._id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                      item.difficulty === 'Simple' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      item.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {item.difficulty}
                    </span>
                    <h3 className="text-sm font-bold text-white">{item.category} Track</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {minutes}m {seconds}s
                    </span>
                    <span>•</span>
                    <span>{item.answers?.length || 0} Questions</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-300">{item.performanceGrade}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-white">{item.percentage}%</span>
                    <p className="text-[10px] text-slate-400">{item.totalScore} / {item.maxPossibleScore} pts</p>
                  </div>

                  <Link
                    to={`/results/${item._id}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                  >
                    <span>Full Diagnostics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
