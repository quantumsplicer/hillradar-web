import { displayVibeScore, getScoreColor, getScoreLabel, getScoreEmoji } from '@/lib/api';

export function ScoreBadge({ congestionScore, size = 'md' }) {
  const c = getScoreColor(congestionScore);
  const small = size === 'sm';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-semibold
      ${c.bg} ${c.text} ${c.border} ${small ? 'text-xs' : 'text-sm'}`}>
      <span>{getScoreEmoji(congestionScore)}</span>
      <span>{getScoreLabel(congestionScore)}</span>
    </span>
  );
}

export function ScorePill({ congestionScore, size = 'md' }) {
  const c = getScoreColor(congestionScore);
  const big = size === 'lg';
  return (
    <div className="flex items-end gap-0.5">
      <span className={`font-black leading-none ${c.text} ${big ? 'text-5xl' : 'text-2xl'}`}>
        {displayVibeScore(congestionScore)}
      </span>
      <span className={`font-semibold text-slate-400 pb-0.5 ${big ? 'text-lg' : 'text-xs'}`}>/10</span>
    </div>
  );
}
