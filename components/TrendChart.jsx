'use client';
import { displayVibeScore, vibeScore } from '@/lib/api';

const W = 600, H = 160, PL = 40, PR = 12, PT = 10, PB = 30;
const PLOT_W = W - PL - PR;
const PLOT_H = H - PT - PB;

export default function TrendChart({ data }) {
  if (!data || data.length < 2) {
    return <div className="h-32 flex items-center justify-center text-slate-400 text-sm">Not enough data yet</div>;
  }

  const scores = data.map(d => vibeScore(d.avg_score) ?? 0);
  const minS = Math.max(0, Math.min(...scores) - 1);
  const maxS = Math.min(10, Math.max(...scores) + 1);

  const x = (i) => PL + (i / (data.length - 1)) * PLOT_W;
  const y = (s) => PT + PLOT_H - ((s - minS) / (maxS - minS)) * PLOT_H;

  const pathD = scores.map((s, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(s)}`).join(' ');
  const areaD = `${pathD} L${x(scores.length - 1)},${H - PB} L${x(0)},${H - PB} Z`;

  const yTicks = [Math.round(minS), Math.round((minS + maxS) / 2), Math.round(maxS)];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map(t => (
        <g key={t}>
          <line x1={PL} y1={y(t)} x2={W - PR} y2={y(t)} stroke="#e2e8f0" strokeWidth="1" />
          <text x={PL - 6} y={y(t) + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{t}</text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaD} fill="url(#areaGrad)" />

      {/* Line */}
      <path d={pathD} fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinejoin="round" />

      {/* Dots */}
      {scores.map((s, i) => (
        <circle key={i} cx={x(i)} cy={y(s)} r="3" fill="#0ea5e9" />
      ))}

      {/* X labels — show every ~4th */}
      {data.filter((_, i) => i % 4 === 0 || i === data.length - 1).map((d, _, arr) => {
        const idx = data.indexOf(d);
        return (
          <text key={idx} x={x(idx)} y={H - 4} textAnchor="middle" fontSize="9" fill="#94a3b8">
            {new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </text>
        );
      })}
    </svg>
  );
}
