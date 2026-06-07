import { getDestinations, getDestinationTrend, getBestTime, displayVibeScore, formatMins, getScoreLabel, vibeScore, DESTINATION_TAGS } from '@/lib/api';
import HotelLinks from '@/components/HotelLinks';
import TrendChart from '@/components/TrendChart';
import Link from 'next/link';

function slugToName(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function scoreStyle(congestionScore) {
  const s = vibeScore(congestionScore);
  if (s === null) return { color: '#94a3b8', bg: '#F8FAFC', strip: '#E2E8F0', label: 'No data', emoji: '⚪' };
  if (s >= 9)  return { color: '#059669', bg: '#F0FDF4', strip: '#059669', label: 'Chill',   emoji: '🟢' };
  if (s >= 6)  return { color: '#D97706', bg: '#FFFBEB', strip: '#D97706', label: 'Busy',    emoji: '🟡' };
  return           { color: '#DC2626', bg: '#FFF1F1', strip: '#DC2626', label: 'Avoid',   emoji: '🔴' };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const name = slugToName(slug);
  return {
    title: `${name} Travel Guide — HillRadar`,
    description: `Current crowd score, travel times, and trip planning for ${name}. Real-time data from HillRadar.`,
  };
}

export default async function DestinationPage({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearch = await searchParams;
  const originCity = resolvedSearch?.origin || '';
  const name = slugToName(slug);

  let destinations = [];
  let fetchError = false;
  try {
    destinations = await getDestinations(originCity || null);
  } catch { fetchError = true; }

  const dest = destinations.find(d => d.name.toLowerCase() === name.toLowerCase());

  if (!dest) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#F0F6FF' }}>
        <header className="bg-white border-b border-[#E2EAF4] sticky top-0 z-40" style={{ boxShadow: '0 1px 8px rgba(7,112,227,0.08)' }}>
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-[#64748B] hover:text-[#0770E3] transition-colors text-sm font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Back
            </Link>
            <div className="h-4 w-px bg-[#E2EAF4]" />
            <Link href="/" className="font-black text-[#0D1B2A]">HillRadar</Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="text-6xl mb-4">😴</div>
            <h1 className="text-2xl font-black text-[#0D1B2A] mb-2">{fetchError ? 'Server waking up…' : `${name} not found`}</h1>
            <p className="text-[#64748B] text-sm mb-6">{fetchError ? 'The server is on a free plan and sleeps after 15 minutes idle. Wait 30 seconds and retry.' : "We don't have data for this destination yet."}</p>
            <div className="flex gap-3 justify-center">
              <a href={`/destination/${slug}${originCity ? `?origin=${encodeURIComponent(originCity)}` : ''}`}
                className="px-5 py-2.5 text-white rounded-xl text-sm font-semibold" style={{ background: '#0770E3' }}>Retry</a>
              <Link href="/" className="px-5 py-2.5 border border-[#E2EAF4] text-[#374151] rounded-xl text-sm font-medium hover:border-[#0770E3] hover:text-[#0770E3] transition-colors">Home</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  let trendData = [];
  let bestTimeData = null;
  try {
    const [trendRes, bestRes] = await Promise.all([getDestinationTrend(dest.id), getBestTime(dest.id)]);
    trendData = trendRes.trend || [];
    bestTimeData = bestRes.best_slot || null;
  } catch {}

  const st = scoreStyle(dest.congestion_score);
  const scoreVal = vibeScore(dest.congestion_score);
  const scoreDisplay = displayVibeScore(dest.congestion_score);
  const tags = DESTINATION_TAGS[dest.name] || [];
  const regionTag = tags.find(t => ['HP','UK','JK'].includes(t));
  const regionLabel = { HP: 'Himachal Pradesh', UK: 'Uttarakhand', JK: 'Jammu & Kashmir' }[regionTag] || 'Hill Station';
  const featureTags = tags.filter(t => !['HP','UK','JK'].includes(t));

  const trafficDelta = dest.current_duration_mins && dest.typical_duration_mins
    ? dest.current_duration_mins - dest.typical_duration_mins : 0;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F0F6FF' }}>
      {/* Header */}
      <header className="bg-white border-b border-[#E2EAF4] sticky top-0 z-40" style={{ boxShadow: '0 1px 8px rgba(7,112,227,0.08)' }}>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={originCity ? `/?origin=${encodeURIComponent(originCity)}` : '/'} className="flex items-center gap-1.5 text-[#64748B] hover:text-[#0770E3] transition-colors text-sm font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="h-4 w-px bg-[#E2EAF4]" />
            <Link href="/" className="flex items-center gap-1.5">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none"><path d="M14 3L4 20h20L14 3z" fill="#0770E3" opacity="0.9"/><path d="M14 3L20 20H8L14 3z" fill="#0770E3" opacity="0.4"/></svg>
              <span className="font-black text-[#0D1B2A] text-sm">HillRadar</span>
            </Link>
          </div>
          {originCity && (
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] border border-[#E2EAF4] rounded-lg px-2.5 py-1.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0770E3" strokeWidth="2.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              From <strong className="text-[#0D1B2A]">{originCity}</strong>
            </div>
          )}
        </div>
      </header>

      {/* Destination hero banner */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, #050F2C 0%, #0B2B6E 50%, #1461A8 100%)`, minHeight: 180 }}>
        {/* Stars */}
        {[[5,15],[15,8],[28,20],[42,6],[58,18],[72,9],[85,15],[93,22]].map(([l,t],i)=>(
          <div key={i} className="absolute rounded-full bg-white" style={{left:`${l}%`,top:`${t}%`,width:1.5,height:1.5,opacity:0.5}}/>
        ))}
        {/* Mini mountain silhouette */}
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute bottom-0 w-full" style={{ height: 80 }}>
          <path d="M0,80 L160,40 L280,65 L400,30 L540,55 L660,20 L800,48 L920,28 L1060,52 L1180,35 L1320,58 L1440,40 L1440,120 L0,120 Z" fill="#071E3D" opacity="0.7"/>
          <path d="M0,120 L200,70 L360,95 L520,55 L680,80 L840,52 L1000,78 L1160,58 L1320,80 L1440,65 L1440,120 Z" fill="#071E3D"/>
          <polygon points="400,30 415,12 430,30" fill="white" opacity="0.7"/>
          <polygon points="660,20 675,2 690,20" fill="white" opacity="0.7"/>
          <polygon points="920,28 935,10 950,28" fill="white" opacity="0.65"/>
        </svg>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-start gap-3 flex-wrap">
            <span className="text-xs font-semibold text-white/60 border border-white/20 rounded-full px-2.5 py-1">{regionLabel}</span>
            {featureTags.slice(0,3).map(tag => (
              <span key={tag} className="text-xs font-semibold text-white/50 border border-white/15 rounded-full px-2.5 py-1">{tag}</span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-3 mb-1" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>{dest.name}</h1>
          <p className="text-white/65 text-sm max-w-xl leading-relaxed">{dest.description}</p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-5">
        {/* Score + quick stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Score card */}
          <div className="sm:col-span-1 bg-white rounded-2xl border border-[#E2EAF4] shadow-sm p-5 flex flex-col items-center justify-center text-center" style={{ borderTop: `3px solid ${st.strip}` }}>
            <div className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2">Vibe Score</div>
            <div className="text-6xl font-black mb-1" style={{ color: st.color }}>{scoreDisplay}</div>
            <div className="text-sm font-bold" style={{ color: st.color }}>{st.emoji} {st.label}</div>
            <div className="text-[10px] text-[#94a3b8] mt-1">out of 10</div>
          </div>

          {/* Travel now */}
          {originCity ? (
            <>
              <div className="bg-white rounded-2xl border border-[#E2EAF4] shadow-sm p-5" style={{ borderTop: '3px solid #0770E3' }}>
                <div className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2">Right Now</div>
                <div className="text-3xl font-black mb-1" style={{ color: '#0770E3' }}>{formatMins(dest.current_duration_mins)}</div>
                <div className="text-xs text-[#64748B]">with current traffic</div>
                {trafficDelta > 0 && (
                  <div className="mt-2 text-xs font-semibold" style={{ color: '#D97706' }}>+{formatMins(trafficDelta)} vs usual</div>
                )}
                {trafficDelta <= 0 && dest.current_duration_mins && (
                  <div className="mt-2 text-xs font-semibold text-green-600">Roads are clear 🟢</div>
                )}
              </div>
              <div className="bg-white rounded-2xl border border-[#E2EAF4] shadow-sm p-5" style={{ borderTop: '3px solid #94a3b8' }}>
                <div className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2">Typical Time</div>
                <div className="text-3xl font-black text-[#374151] mb-1">{formatMins(dest.typical_duration_mins)}</div>
                <div className="text-xs text-[#64748B]">without traffic</div>
                {bestTimeData && (
                  <div className="mt-2 text-xs text-[#64748B]">Best: <strong className="text-green-600">{bestTimeData.time_slot}</strong></div>
                )}
                <div className="mt-2 text-[10px] text-[#94a3b8] italic">AI-analyzed from the last 15 days of traffic data</div>
              </div>
            </>
          ) : (
            <div className="sm:col-span-2 bg-white rounded-2xl border-2 border-dashed border-[#B4D0F5] shadow-sm p-5 flex items-center justify-center">
              <div className="text-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0770E3" strokeWidth="2" className="mx-auto mb-2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                <p className="text-sm text-[#64748B]">
                  <Link href="/" className="font-semibold hover:underline" style={{ color: '#0770E3' }}>Pick your city</Link> to see live travel times
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Traffic insight bar */}
        {originCity && dest.current_duration_mins && dest.typical_duration_mins && (
          <div className="bg-white rounded-2xl border border-[#E2EAF4] shadow-sm px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: trafficDelta > 15 ? '#FFF1F1' : '#F0FDF4' }}>
              {trafficDelta > 15
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              }
            </div>
            <div>
              <div className="text-sm font-semibold text-[#0D1B2A]">
                {trafficDelta > 15
                  ? `Heavy traffic — ${formatMins(trafficDelta)} longer than usual`
                  : trafficDelta > 0
                    ? `Slight traffic — ${formatMins(trafficDelta)} added today`
                    : 'Roads are clear — great time to leave!'}
              </div>
              <div className="text-xs text-[#64748B] mt-0.5">Based on current Google Maps traffic data</div>
            </div>
          </div>
        )}

        {/* Trend chart */}
        {trendData.length >= 2 && (
          <div className="bg-white rounded-2xl border border-[#E2EAF4] shadow-sm p-5">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="font-bold text-[#0D1B2A] text-sm">15-Day Vibe Score Trend</h2>
                <p className="text-xs text-[#64748B]">Higher score = less crowded = better time to visit · AI-analyzed from the last 15 days of traffic data</p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#64748B]">
                <span className="inline-block w-3 h-0.5 rounded" style={{ background: '#0770E3' }} />
                Vibe score
              </div>
            </div>
            <div className="mt-3">
              <TrendChart data={trendData} />
            </div>
          </div>
        )}

        {/* Best time to leave */}
        {bestTimeData && (
          <div className="bg-white rounded-2xl border border-[#E2EAF4] shadow-sm p-5">
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <h2 className="font-bold text-[#0D1B2A] text-sm">Best Time to Leave</h2>
              <span className="text-[10px] text-[#94a3b8] italic">AI-analyzed · last 15 days of data</span>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-xl" style={{ background: '#F0FDF4', border: '1px solid #D1FAE5' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#DCFCE7' }}>⏰</div>
              <div>
                <div className="font-black text-green-700 text-lg">{bestTimeData.time_slot || '--'}</div>
                <div className="text-xs text-[#64748B]">
                  Average vibe score: <span className="font-semibold text-green-700">{typeof bestTimeData.avg_score === 'number' ? displayVibeScore(bestTimeData.avg_score) : '--'}/10</span>
                  {bestTimeData.sample_count ? ` · from ${bestTimeData.sample_count} data points` : ''}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hotel links */}
        <HotelLinks destName={dest.name} />

        {/* Nearby tip */}
        <div className="bg-white rounded-2xl border border-[#E2EAF4] shadow-sm p-5">
          <h2 className="font-bold text-[#0D1B2A] text-sm mb-3">Planning Tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: '📅', tip: 'Best season', detail: 'March–June & Sep–Nov avoid summer rush and monsoon roads' },
              { icon: '🕐', tip: 'Start early', detail: 'Leave before 7am on weekends to beat traffic from the plains' },
              { icon: '⛽', tip: 'Fuel up', detail: 'Fill tank before the hills — petrol stations can be sparse above 2000m' },
            ].map(({ icon, tip, detail }) => (
              <div key={tip} className="flex gap-3 p-3 rounded-xl" style={{ background: '#F0F6FF' }}>
                <span className="text-xl shrink-0">{icon}</span>
                <div>
                  <div className="text-xs font-bold text-[#0D1B2A]">{tip}</div>
                  <div className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back */}
        <div className="pb-4 text-center">
          <Link href={originCity ? `/?origin=${encodeURIComponent(originCity)}` : '/'}
            className="inline-flex items-center gap-2 text-sm font-semibold hover:underline" style={{ color: '#0770E3' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Browse all hill stations
          </Link>
        </div>
      </main>

      <footer style={{ background: '#071E3D' }}>
        <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full" style={{ height: 30, display: 'block' }}>
          <path d="M0,40 L120,15 L280,30 L440,8 L600,22 L760,5 L920,20 L1080,8 L1240,24 L1440,12 L1440,40 Z" fill="#071E3D"/>
        </svg>
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-xs text-white/40 space-y-1">
          <div>🏔️ <strong className="text-white/60">HillRadar</strong> · Real-time crowd scores for India's hill stations · Powered by Google Maps</div>
          <div className="text-white/30">Typical times & best-time picks are AI-analyzed from the last 15 days of traffic data</div>
        </div>
      </footer>
    </div>
  );
}
