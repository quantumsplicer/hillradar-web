import Link from 'next/link';
import { formatMins, vibeScore, displayVibeScore, getScoreLabel, DESTINATION_TAGS } from '@/lib/api';

function scoreStyle(congestionScore) {
  const s = vibeScore(congestionScore);
  if (s === null) return { color: '#94a3b8', bg: '#F8FAFC', label: 'No data', strip: '#E2E8F0' };
  if (s >= 9)  return { color: '#059669', bg: '#F0FDF4', label: 'Chill',   strip: '#059669' };
  if (s >= 6)  return { color: '#D97706', bg: '#FFFBEB', label: 'Busy',    strip: '#D97706' };
  return           { color: '#DC2626', bg: '#FFF1F1', label: 'Avoid',   strip: '#DC2626' };
}

export default function DestinationCard({ destination, originCity, showTimes }) {
  const st = scoreStyle(destination.congestion_score);
  const score = displayVibeScore(destination.congestion_score);
  const slug = destination.name.toLowerCase().replace(/\s+/g, '-');
  const tags = (DESTINATION_TAGS[destination.name] || []).filter(t => !['HP','UK','JK'].includes(t)).slice(0, 2);

  return (
    <Link href={`/destination/${slug}?origin=${encodeURIComponent(originCity || '')}`}
      className="group bg-white rounded-2xl border border-[#E2EAF4] shadow-sm overflow-hidden flex flex-col card-lift">
      {/* Score strip */}
      <div className="h-1 w-full" style={{ background: st.strip }} />

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Top row: name + score bubble */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#0D1B2A] group-hover:text-[#0770E3] transition-colors truncate text-base">
              {destination.name}
            </h3>
            {showTimes && destination.current_duration_mins ? (
              <p className="text-xs text-[#64748B] mt-0.5">
                <span className="font-semibold" style={{ color: '#0770E3' }}>{formatMins(destination.current_duration_mins)}</span>
                <span className="text-[#CBD5E1] mx-1">·</span>
                <span>{formatMins(destination.typical_duration_mins)} typical</span>
              </p>
            ) : null}
          </div>

          {/* Score bubble */}
          <div className="shrink-0 flex flex-col items-center rounded-xl px-3 py-2 border" style={{ background: st.bg, borderColor: st.color + '40' }}>
            <span className="text-xl font-black leading-none" style={{ color: st.color }}>{score}</span>
            <span className="text-[9px] font-bold mt-0.5" style={{ color: st.color }}>{st.label}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#64748B] line-clamp-2 flex-1 leading-relaxed">{destination.description}</p>

        {/* Footer: tags + CTA */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F0F6FF]">
          <div className="flex gap-1.5 flex-wrap flex-1">
            {tags.map(tag => (
              <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ background: '#E8F3FF', color: '#0770E3' }}>
                {tag}
              </span>
            ))}
          </div>
          <span className="text-[11px] font-semibold flex items-center gap-0.5 shrink-0 group-hover:gap-1.5 transition-all" style={{ color: '#0770E3' }}>
            View <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
