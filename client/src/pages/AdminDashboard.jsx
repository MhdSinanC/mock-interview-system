import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Users,
  HelpCircle,
  FileText,
  BarChart3,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('questions'); // 'questions', 'users', 'results'
  const [stats, setStats] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Question Filters
  const [diffFilter, setDiffFilter] = useState('All');
  const [catFilter, setCatFilter] = useState('All');
  const [searchQ, setSearchQ] = useState('');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [modalForm, setModalForm] = useState({
    questionText: '',
    category: 'Full Stack',
    difficulty: 'Simple',
    idealAnswer: '',
    keywords: '',
    tips: '',
    timeLimitSeconds: 120,
    maxScore: 10
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, questionsRes, usersRes, resultsRes] = await Promise.all([
        api.getAdminStats(),
        api.getQuestions(),
        api.getAllUsers(),
        api.getAllResults()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (questionsRes.success) setQuestions(questionsRes.questions || []);
      if (usersRes.success) setUsers(usersRes.users || []);
      if (resultsRes.success) setResults(resultsRes.results || []);
    } catch (err) {
      console.warn('Error loading admin data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const openAddModal = () => {
    setEditingQuestion(null);
    setModalForm({
      questionText: '',
      category: 'Full Stack',
      difficulty: 'Simple',
      idealAnswer: '',
      keywords: '',
      tips: '',
      timeLimitSeconds: 120,
      maxScore: 10
    });
    setIsModalOpen(true);
  };

  const openEditModal = (q) => {
    setEditingQuestion(q);
    setModalForm({
      questionText: q.questionText,
      category: q.category,
      difficulty: q.difficulty,
      idealAnswer: q.idealAnswer,
      keywords: Array.isArray(q.keywords) ? q.keywords.join(', ') : '',
      tips: q.tips || '',
      timeLimitSeconds: q.timeLimitSeconds || 120,
      maxScore: q.maxScore || 10
    });
    setIsModalOpen(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await api.updateQuestion(editingQuestion._id, modalForm);
      } else {
        await api.createQuestion(modalForm);
      }
      setIsModalOpen(false);
      loadAllData();
    } catch (err) {
      alert(err.message || 'Error saving question.');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question from the bank?')) return;
    try {
      await api.deleteQuestion(id);
      loadAllData();
    } catch (err) {
      alert(err.message || 'Error deleting question.');
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (diffFilter !== 'All' && q.difficulty !== diffFilter) return false;
    if (catFilter !== 'All' && q.category !== catFilter) return false;
    if (searchQ && !q.questionText.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 uppercase">
              Admin & Question Management Module
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-amber-500 dark:text-amber-400" />
            <span>Platform Administration</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage interview questions, monitor registered candidates, and track performance reports.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Question</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Registered Candidates</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats?.totalUsers ?? users.length}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Total student accounts</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Question Bank</span>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{stats?.totalQuestions ?? questions.length}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Active interview items</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Interviews Conducted</span>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats?.totalResults ?? results.length}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Completed assessments</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Platform Avg Score</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats?.avgScore ?? 0}%</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Global candidate average</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'questions'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Question Bank ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Candidates ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'results'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Submissions ({results.length})</span>
        </button>
      </div>

      {/* TAB 1: QUESTION BANK */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search question text..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 dark:text-slate-400">Difficulty:</span>
              {['All', 'Simple', 'Intermediate', 'Hard'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDiffFilter(d)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    diffFilter === d ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Questions Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Question</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Keywords</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                {filteredQuestions.map((q, idx) => (
                  <tr key={q._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-400 dark:text-slate-500 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white max-w-md">
                      <p className="line-clamp-2">{q.questionText}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-300 font-semibold">{q.category}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                        q.difficulty === 'Simple' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                        q.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 max-w-xs">
                      <span className="line-clamp-1">{q.keywords?.slice(0, 3).join(', ') || 'N/A'}</span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(q)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                        title="Edit question"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q._id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: CANDIDATES */}
      {activeTab === 'users' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Target Track</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                  <td className="py-3 px-4 text-slate-800 dark:text-slate-300">{u.email}</td>
                  <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">@{u.username}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      u.role === 'admin' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300' : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-800 dark:text-slate-300">{u.targetRole}</td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{u.experienceLevel}</td>
                  <td className="py-3 px-4 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: PLATFORM SUBMISSIONS */}
      {activeTab === 'results' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Track</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Performance Grade</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              {results.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {r.userName}
                    <span className="block text-[10px] text-slate-500 font-normal">{r.userEmail}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-300">{r.category}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {r.difficulty}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{r.percentage}%</span>
                    <span className="text-[10px] text-slate-500 block">{r.totalScore}/{r.maxPossibleScore} pts</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-indigo-600 dark:text-indigo-300">{r.performanceGrade}</td>
                  <td className="py-3 px-4 text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/results/${r._id}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white"
                    >
                      View Report
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD / EDIT QUESTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl my-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingQuestion ? 'Edit Interview Question' : 'Add New Question To Bank'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Question Text</label>
                <textarea
                  required
                  rows={3}
                  value={modalForm.questionText}
                  onChange={(e) => setModalForm(prev => ({ ...prev, questionText: e.target.value }))}
                  placeholder="e.g. Explain how the Node.js Event Loop works..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={modalForm.category}
                    onChange={(e) => setModalForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Data Structures">Data Structures</option>
                    <option value="Database & SQL">Database & SQL</option>
                    <option value="HR & Behavioral">HR & Behavioral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Difficulty</label>
                  <select
                    value={modalForm.difficulty}
                    onChange={(e) => setModalForm(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Simple">Simple</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Ideal Model Answer (Evaluation Benchmark)</label>
                <textarea
                  required
                  rows={4}
                  value={modalForm.idealAnswer}
                  onChange={(e) => setModalForm(prev => ({ ...prev, idealAnswer: e.target.value }))}
                  placeholder="Provide comprehensive ideal technical answer..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Expected Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={modalForm.keywords}
                  onChange={(e) => setModalForm(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="e.g. event loop, libuv, single thread, non-blocking"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Interviewer Hint / Tip</label>
                <input
                  type="text"
                  value={modalForm.tips}
                  onChange={(e) => setModalForm(prev => ({ ...prev, tips: e.target.value }))}
                  placeholder="e.g. Mention libuv thread pool and microtask queue"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  {editingQuestion ? 'Update Question' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
