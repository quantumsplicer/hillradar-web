import Link from 'next/link';
import { formatMins, getScoreColor } from '@/lib/api';
import { ScorePill, ScoreBadge } from './ScoreBadge';

export default function DestinationCard({ destination, originCity, showTimes }) {
  const c = getScoreColor(destination.congestion_score);
  const slug = destination.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <Link
      href={`/destination/${slug}?origin=${encodeURIComponent(originCity || '')}`}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Score bar top accent */}
      <div className="h-1.5 w-full" style={{ backgroundColor: c.hex }} />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-sky-600 transition-colors truncate">
              {destination.name}
            </h3>
            {showTimes && (
              <p className="text-sm text-slate-500 mt-0.5">
                <span className="font-semibold text-sky-600">{formatMins(destination.current_duration_mins)}</span>
                {' now · '}
                <span>{formatMins(destination.typical_duration_mins)} typical</span>
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <ScorePill congestionScore={destination.congestion_score} />
            <ScoreBadge congestionScore={destination.congestion_score} size="sm" />
          </div>
        </div>

        <p className="text-sm text-slate-500 line-clamp-2 flex-1">
          {destination.description}
        </p>

        <div className="mt-4 text-xs font-semibold text-sky-600 group-hover:underline">
          View details →
        </div>
      </div>
    </Link>
  );
}
