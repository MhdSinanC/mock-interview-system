import { Award, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ScoreGauge({ percentage = 0, grade = 'Good Potential', size = 160 }) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let colorClass = 'stroke-indigo-500';
  let badgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';

  if (percentage >= 85) {
    colorClass = 'stroke-emerald-500';
    badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  } else if (percentage >= 70) {
    colorClass = 'stroke-blue-500';
    badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  } else if (percentage >= 50) {
    colorClass = 'stroke-amber-500';
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else {
    colorClass = 'stroke-rose-500';
    badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress Indicator */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Percentage Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold text-white tracking-tight">
            {percentage}%
          </span>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Overall Score
          </span>
        </div>
      </div>

      {/* Grade Badge */}
      <div className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}>
        <Award className="w-3.5 h-3.5" />
        <span>{grade}</span>
      </div>
    </div>
  );
}
