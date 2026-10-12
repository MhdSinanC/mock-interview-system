import { Bot, Heart, Code2, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <span className="font-bold text-white tracking-tight">MockInterview.AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An intelligent, web-based mock interview platform built for students and job seekers to reduce interview anxiety and master technical rounds.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Full MERN Stack Architecture</span>
            </div>
          </div>

          {/* Column 2: Interview Tracks */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Interview Tracks</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/select" className="hover:text-indigo-400 transition-colors">Frontend Development (React)</Link></li>
              <li><Link to="/select" className="hover:text-indigo-400 transition-colors">Backend Development (Node.js)</Link></li>
              <li><Link to="/select" className="hover:text-indigo-400 transition-colors">Full Stack MERN Architecture</Link></li>
              <li><Link to="/select" className="hover:text-indigo-400 transition-colors">Data Structures & Algorithms</Link></li>
              <li><Link to="/select" className="hover:text-indigo-400 transition-colors">HR & Behavioral (STAR Method)</Link></li>
            </ul>
          </div>

          {/* Column 3: Difficulty Levels */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Difficulty Levels</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Simple / Beginner Track</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Intermediate Competency</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Hard / Senior Architecture</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span>Keyword-based Semantic Evaluation</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Academic Credit & Details */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>Academic Project Synopsis</span>
            </div>
            <p className="text-xs text-slate-300">
              <strong>Submitted By:</strong> Jezeem Muhammed
            </p>
            <p className="text-[11px] text-slate-400 leading-normal">
              Designed as a complete academic submission covering DFD Level 0, 1, 2, ER Diagram, and Software Development Life Cycle (SDLC).
            </p>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} Mock Interview System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">MongoDB • Express • React • Node.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
