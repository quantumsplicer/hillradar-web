import { getDestinations, getDestinationTrend, getBestTime, getScoreColor, displayVibeScore, formatMins, getScoreLabel, getScoreEmoji, vibeScore } from '@/lib/api';
import HotelLinks from '@/components/HotelLinks';
import TrendChart from '@/components/TrendChart';
import Link from 'next/link';

function slugToName(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const name = slugToName(slug);
  return {
    title: `${name} — HillRadar`,
    description: `Current crowd score and travel times to ${name} from North India.`,
  };
}

export default async function DestinationPage({ params, searchParams }) {
  // Next.js 15+: params and searchParams are Promises
  const { slug } = await params;
  const resolvedSearch = await searchParams;
  const originCity = resolvedSearch?.origin || '';
  const name = slugToName(slug);

  let destinations = [];
  let fetchError = false;
  try {
    destinations = await getDestinations(originCity || null);
  } catch {
    fetchError = true;
  }

  const dest = destinations.find(d => d.name.toLowerCase() === name.toLowerCase());

  // Backend sleeping or truly unknown slug
  if (!dest) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-slate-700 transition-colors">← Back</Link>
            <div className="flex items-center gap-2">
              <span className="text-xl">🏔️</span>
              <Link href="/" className="font-black text-slate-900 text-lg tracking-tight">HillRadar</Link>
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-5xl mb-4">😴</div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">
              {fetchError ? 'Backend is waking up…' : `${name} not found`}
            </h1>
            <p className="text-slate-500 text-sm mb-6">
              {fetchError
                ? 'The server is on a free plan and sleeps after 15 minutes of inactivity. Please wait 30 seconds and refresh.'
                : "We don't have data for this destination yet."}
            </p>
            <div className="flex gap-3 justify-center">
              <a
                href={`/destination/${slug}${originCity ? `?origin=${encodeURIComponent(originCity)}` : ''}`}
                className="px-5 py-2.5 bg-sky-500 text-white rounded-full text-sm font-semibold hover:bg-sky-600 transition-colors"
              >
                Retry
              </a>
              <Link href="/" className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-full text-sm font-medium hover:border-slate-300 transition-colors">
                Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  let trendData = [];
  let bestTimeData = null;
  try {
    const [trendRes, bestRes] = await Promise.all([
      getDestinationTrend(dest.id),
      getBestTime(dest.id),
    ]);
    trendData = trendRes.trend || [];
    bestTimeData = bestRes.best_slot || null;
  } catch {}

  const c = getScoreColor(dest.congestion_score);
  const scoreDisplay = displayVibeScore(dest.congestion_score);
  const label = getScoreLabel(dest.congestion_score);
  const emoji = getScoreEmoji(dest.congestion_score);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href={originCity ? `/?origin=${encodeURIComponent(originCity)}` : '/'} className="text-slate-400 hover:text-slate-700 transition-colors">
            ← Back
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏔️</span>
            <Link href="/" className="font-black text-slate-900 text-lg tracking-tight">HillRadar</Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Hero score card */}
        <section className={`rounded-2xl border-2 ${c.border} ${c.bg} p-6`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-500 mb-1">Destination</div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">{dest.name}</h1>
              <p className="text-slate-500 max-w-lg">{dest.description}</p>
            </div>
            <div className={`flex flex-col items-center justify-center rounded-2xl ${c.bg} border-2 ${c.border} px-8 py-5 shrink-0`}>
              <div className={`text-5xl font-black ${c.text}`}>{scoreDisplay}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">/ 10</div>
              <div className={`text-sm font-bold mt-2 ${c.text}`}>{emoji} {label}</div>
            </div>
          </div>
        </section>

        {/* Travel times */}
        {originCity ? (
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Travel from {originCity}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Right Now</div>
                <div className="text-2xl font-black text-sky-600">{formatMins(dest.current_duration_mins)}</div>
                <div className="text-xs text-slate-400 mt-0.5">with current traffic</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Typical</div>
                <div className="text-2xl font-black text-slate-700">{formatMins(dest.typical_duration_mins)}</div>
                <div className="text-xs text-slate-400 mt-0.5">without traffic</div>
              </div>
            </div>
            {dest.current_duration_mins && dest.typical_duration_mins && (
              <div className="mt-4 p-3 rounded-xl bg-sky-50 border border-sky-100 text-sm text-sky-700">
                {dest.current_duration_mins > dest.typical_duration_mins
                  ? `Traffic is adding ~${formatMins(dest.current_duration_mins - dest.typical_duration_mins)} to your journey`
                  : 'Roads are clear — typical travel time today'}
              </div>
            )}
          </section>
        ) : (
          <section className="bg-white rounded-2xl border border-dashed border-slate-200 p-6 text-center">
            <p className="text-slate-500 text-sm">
              <Link href="/" className="text-sky-500 hover:underline font-medium">Select your city on the home page</Link>
              {' '}to see travel times to {dest.name}
            </p>
          </section>
        )}

        {/* Best time to go */}
        {bestTimeData && (
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Best Time to Leave</h2>
            <div className="flex items-center gap-4">
              <div className="text-3xl">⏰</div>
              <div>
                <div className="text-xl font-bold text-slate-900">{bestTimeData.time_slot || '--'}</div>
                <div className="text-sm text-slate-500">
                  Avg score: <span className="font-semibold text-green-600">
                    {typeof bestTimeData.avg_score === 'number' ? displayVibeScore(bestTimeData.avg_score) : '--'}/10
                  </span>
                  {bestTimeData.sample_count ? ` · ${bestTimeData.sample_count} samples` : ''}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Trend chart */}
        {trendData.length >= 2 && (
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Vibe Score — 30 Day Trend</h2>
            <p className="text-xs text-slate-400 mb-4">Higher = less crowded</p>
            <TrendChart data={trendData} />
          </section>
        )}

        {/* Hotel links */}
        <HotelLinks destName={dest.name} />

        {/* Back CTA */}
        <div className="pb-4">
          <Link
            href={originCity ? `/?origin=${encodeURIComponent(originCity)}` : '/'}
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700 hover:underline transition-colors"
          >
            ← Browse all hill stations
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-100 bg-white py-6 px-4 mt-8">
        <div className="max-w-4xl mx-auto text-sm text-slate-400 text-center">
          🏔️ <strong className="text-slate-600">HillRadar</strong> · Data refreshes every 4 hours · Powered by Google Maps
        </div>
      </footer>
    </div>
  );
}
