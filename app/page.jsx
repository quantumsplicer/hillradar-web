'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { getLiveDestinations, getDestinations, CITY_REGIONS, DESTINATION_TAGS, formatMins, vibeScore, displayVibeScore, getScoreLabel } from '@/lib/api';
import DestinationCard from '@/components/DestinationCard';
import FeaturedRoutes from '@/components/FeaturedRoutes';
import SkeletonCard, { SkeletonBestPick } from '@/components/SkeletonCard';
import Link from 'next/link';

const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

const REGION_FILTERS = [
  { label: 'All Regions', value: null },
  { label: 'Himachal Pradesh', value: 'HP' },
  { label: 'Uttarakhand', value: 'UK' },
  { label: 'Jammu & Kashmir', value: 'JK' },
];

// ─── Mountain Hero ───────────────────────────────────────────────────
function MountainHero({ children }) {
  return (
    <section className="relative overflow-hidden select-none" style={{ background: 'linear-gradient(175deg, #040E26 0%, #082456 30%, #0D4080 55%, #1A6FB5 75%, #4899D4 90%, #A8D4EE 100%)', minHeight: 480 }}>
      {[
        [8,6],[14,12],[22,4],[31,9],[40,5],[52,14],[61,7],[70,11],[80,4],[88,8],[96,13],
        [5,20],[18,18],[28,22],[45,17],[58,21],[73,19],[91,16],[3,30],[35,26],[67,28],[85,24],
      ].map(([l, t], i) => (
        <div key={i} className="absolute rounded-full bg-white" style={{ left:`${l}%`, top:`${t}%`, width: i%3===0?2:1.5, height: i%3===0?2:1.5, opacity: 0.5+(i%5)*0.1 }} />
      ))}
      <div className="relative z-10" style={{ paddingTop: 72, paddingBottom: 180 }}>{children}</div>
      <svg viewBox="0 0 1440 260" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full" style={{ height: 200 }}>
        <path d="M0,200 L80,155 L160,175 L260,130 L360,155 L440,120 L540,148 L640,125 L740,150 L840,118 L940,145 L1040,122 L1140,150 L1240,130 L1340,155 L1440,140 L1440,260 L0,260 Z" fill="#1A5E9A" opacity="0.55"/>
        <polygon points="440,120 455,100 470,120" fill="white" opacity="0.7"/>
        <polygon points="840,118 855,98 870,118" fill="white" opacity="0.65"/>
        <polygon points="1040,122 1055,102 1070,122" fill="white" opacity="0.6"/>
        <path d="M0,220 L100,165 L180,195 L300,140 L400,170 L500,125 L600,158 L700,130 L800,165 L900,128 L1000,162 L1100,135 L1200,165 L1320,145 L1440,160 L1440,260 L0,260 Z" fill="#0D3F6E" opacity="0.75"/>
        <polygon points="300,140 318,118 336,140" fill="white" opacity="0.75"/>
        <polygon points="500,125 518,104 536,125" fill="white" opacity="0.7"/>
        <polygon points="900,128 918,107 936,128" fill="white" opacity="0.72"/>
        <path d="M0,260 L60,200 L140,235 L240,175 L340,215 L440,168 L540,205 L640,170 L740,208 L820,172 L920,210 L1020,174 L1120,210 L1240,180 L1360,215 L1440,190 L1440,260 Z" fill="#071E3D"/>
        <polygon points="240,175 258,152 276,175" fill="white" opacity="0.85"/>
        <polygon points="440,168 458,146 476,168" fill="white" opacity="0.8"/>
        <polygon points="820,172 838,150 856,172" fill="white" opacity="0.82"/>
        <polygon points="1020,174 1038,152 1056,174" fill="white" opacity="0.78"/>
      </svg>
    </section>
  );
}

// ─── Last updated pill ───────────────────────────────────────────────
function LastUpdated({ isoString, refreshing }) {
  const [label, setLabel] = useState('');
  useEffect(() => {
    function calc() {
      if (!isoString) return setLabel('');
      const mins = Math.round((Date.now() - new Date(isoString).getTime()) / 60000);
      setLabel(mins <= 0 ? 'Just updated' : mins === 1 ? '1 min ago' : `${mins} min ago`);
    }
    calc();
    const t = setInterval(calc, 30000);
    return () => clearInterval(t);
  }, [isoString]);

  return (
    <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${refreshing ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`} />
      {refreshing ? 'Refreshing…' : label ? `Updated ${label}` : ''}
    </div>
  );
}

// ─── Home page ───────────────────────────────────────────────────────
export default function HomePage() {
  const [originCity, setOriginCity] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [regionFilter, setRegionFilter] = useState(null);
  const lastFetchRef = useRef(0);

  // Load saved city once on mount
  useEffect(() => {
    const saved = localStorage.getItem('origin_city');
    if (saved) setOriginCity(saved);
  }, []);

  const fetchData = useCallback(async (city, isBackground = false) => {
    if (!isBackground) { setLoading(true); setError(null); }
    else setRefreshing(true);
    try {
      const data = await getLiveDestinations(city || null);
      setDestinations(data.destinations || []);
      setLastUpdated(data.last_updated);
      lastFetchRef.current = Date.now();
      setError(null);
    } catch {
      // Fallback to regular endpoint
      try {
        const fallback = await getDestinations(city || null);
        setDestinations(fallback);
        setLastUpdated(null);
        lastFetchRef.current = Date.now();
        setError(null);
      } catch {
        if (!isBackground) setError('Could not reach server — it may be waking up (free plan). Retry in 30s.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch when city changes
  useEffect(() => {
    fetchData(originCity);
  }, [originCity, fetchData]);

  // Poll every 10 min
  useEffect(() => {
    const interval = setInterval(() => {
      const age = Date.now() - lastFetchRef.current;
      if (age >= REFRESH_INTERVAL_MS) fetchData(originCity, true);
    }, 60000); // check every minute, refresh if 10 min old
    return () => clearInterval(interval);
  }, [originCity, fetchData]);

  // Refresh on tab focus if data is stale
  useEffect(() => {
    function onFocus() {
      const age = Date.now() - lastFetchRef.current;
      if (age >= REFRESH_INTERVAL_MS) fetchData(originCity, true);
    }
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') onFocus();
    });
    return () => window.removeEventListener('focus', onFocus);
  }, [originCity, fetchData]);

  function handleCitySelect(city) {
    setOriginCity(city);
    localStorage.setItem('origin_city', city);
    setPickerOpen(false);
    setRegionFilter(null);
  }

  const citySelected = !!originCity;
  const best = destinations[0];
  const filteredDests = destinations.filter(dest =>
    !regionFilter || (DESTINATION_TAGS[dest.name] || []).includes(regionFilter)
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F0F6FF' }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#E2EAF4] sticky top-0 z-40" style={{ boxShadow: '0 1px 8px rgba(7,112,227,0.08)' }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 3L4 20h20L14 3z" fill="#0770E3" opacity="0.9"/>
              <path d="M14 3L20 20H8L14 3z" fill="#0770E3" opacity="0.4"/>
              <path d="M10 20L14 10l4 10" fill="none" stroke="white" strokeWidth="1.5"/>
            </svg>
            <span className="font-black text-lg tracking-tight text-[#0D1B2A]">HillRadar</span>
            <span className="hidden md:inline text-xs text-[#64748B] border border-[#E2EAF4] rounded-full px-2 py-0.5 font-medium">India</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-[#64748B] font-medium">
            <a href="#destinations" className="hover:text-[#0770E3] transition-colors">Destinations</a>
            <a href="#routes" className="hover:text-[#0770E3] transition-colors">Routes</a>
          </nav>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <MountainHero>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-white/80 text-xs font-semibold mb-5 tracking-wide uppercase">
            <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Live crowd scores · Updated every 10 minutes
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-3" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
            Find India's quietest<br className="hidden sm:inline" /> hill stations 🏔️
          </h1>
          <p className="text-white/70 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Real-time traffic & crowd scores for 40+ hill stations. Plan smarter, travel better.
          </p>

          {/* City picker card */}
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-2xl p-2 shadow-2xl flex gap-2" style={{ boxShadow: '0 16px 48px rgba(4,14,38,0.35)' }}>
              <button onClick={() => setPickerOpen(true)}
                className="flex-1 flex items-center gap-3 rounded-xl px-4 py-3 text-left hover:bg-[#F0F6FF] transition-colors group">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#E8F3FF' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0770E3" strokeWidth="2.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Starting from</div>
                  <div className={`font-semibold text-sm truncate ${originCity ? 'text-[#0770E3]' : 'text-[#94a3b8]'}`}>
                    {originCity || 'Select your city'}
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={originCity ? '#0770E3' : '#94a3b8'} strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {originCity && (
                <button onClick={() => { setOriginCity(''); localStorage.removeItem('origin_city'); setRegionFilter(null); }}
                  className="px-3 rounded-xl text-[#64748B] hover:text-red-500 hover:bg-red-50 transition-colors" title="Clear">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              )}
              <button onClick={() => setPickerOpen(true)}
                className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm transition-colors"
                style={{ background: '#0770E3' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <span className="hidden sm:inline">Explore</span>
              </button>
            </div>
            <div className="flex items-center justify-center gap-5 mt-4">
              {[{ dot:'#059669', label:'9–10 Chill' }, { dot:'#D97706', label:'6–8 Busy' }, { dot:'#DC2626', label:'<6 Avoid' }].map(({ dot, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-white/70 text-xs font-medium">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: dot }} />{label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </MountainHero>

      {/* ── City Picker Modal ──────────────────────────────────── */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setPickerOpen(false)} />
          <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[88vh] flex flex-col shadow-2xl border border-[#E2EAF4]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2EAF4]">
              <div>
                <h2 className="font-bold text-[#0D1B2A]">Where are you starting from?</h2>
                <p className="text-xs text-[#64748B] mt-0.5">We'll calculate live travel times from your city</p>
              </div>
              <button onClick={() => setPickerOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F0F6FF] text-[#64748B] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4 space-y-5">
              {CITY_REGIONS.map(region => (
                <div key={region.id}>
                  <div className="text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-2.5 flex items-center gap-2">
                    <span className="flex-1 border-t border-[#E2EAF4]" />
                    {region.name}
                    <span className="flex-1 border-t border-[#E2EAF4]" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {region.cities.map(city => (
                      <button key={city} onClick={() => handleCitySelect(city)}
                        className={`px-3.5 py-1.5 rounded-lg border text-sm font-medium transition-all ${originCity === city ? 'text-white border-transparent' : 'bg-white text-[#374151] border-[#E2EAF4] hover:border-[#0770E3] hover:text-[#0770E3]'}`}
                        style={originCity === city ? { background: '#0770E3' } : {}}>
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ───────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-8">

        {error && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5 text-sm text-amber-800">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div className="flex-1">{error}</div>
            <button onClick={() => fetchData(originCity)} className="text-amber-700 font-semibold hover:underline shrink-0">Retry</button>
          </div>
        )}

        {!citySelected && !loading && !error && (
          <div id="routes">
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[{ n:'40+', label:'Hill Stations' }, { n:'28', label:'Origin Cities' }, { n:'10m', label:'Refresh Rate' }].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-[#E2EAF4] shadow-sm p-4 text-center">
                  <div className="text-2xl font-black" style={{ color: '#0770E3' }}>{s.n}</div>
                  <div className="text-xs text-[#64748B] font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
            <FeaturedRoutes originCity={originCity} />
          </div>
        )}

        {loading && citySelected && (
          <div className="space-y-6">
            <SkeletonBestPick />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        )}

        {loading && !citySelected && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-[#E8F3FF] border-t-[#0770E3] animate-spin" />
            <p className="text-[#64748B] text-sm">Loading hill stations…</p>
          </div>
        )}

        {!loading && citySelected && best && (
          <div className="fade-up">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-widest">Best Pick Right Now</span>
              </div>
              <LastUpdated isoString={lastUpdated} refreshing={refreshing} />
            </div>
            <Link href={`/destination/${best.name.toLowerCase().replace(/\s+/g, '-')}?origin=${encodeURIComponent(originCity)}`}
              className="block bg-white rounded-2xl border-2 p-5 sm:p-6 card-lift group" style={{ borderColor: '#0770E3' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: (v => v>=9?'#059669':v>=6?'#D97706':'#DC2626')(vibeScore(best.congestion_score)||0) }} />
                    <span className="text-xs font-semibold text-[#64748B]">{getScoreLabel(best.congestion_score)}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#0D1B2A] group-hover:text-[#0770E3] transition-colors mb-1.5">{best.name}</h2>
                  <p className="text-sm text-[#64748B] mb-3 line-clamp-2">{best.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex items-center gap-1.5">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0770E3" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                      <span className="text-[#64748B]">Now:</span>
                      <strong style={{ color: '#0770E3' }}>{formatMins(best.current_duration_mins)}</strong>
                    </span>
                    <span className="text-[#CBD5E1]">·</span>
                    <span className="text-[#64748B]">Typical: {formatMins(best.typical_duration_mins)}</span>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-center justify-center rounded-2xl px-5 py-4 border" style={{ background: '#E8F3FF', borderColor: '#B4D0F5' }}>
                  <div className="text-4xl font-black" style={{ color: (v => v>=9?'#059669':v>=6?'#D97706':'#DC2626')(vibeScore(best.congestion_score)||0) }}>
                    {displayVibeScore(best.congestion_score)}
                  </div>
                  <div className="text-xs text-[#64748B] mt-0.5">/10 vibe</div>
                  <div className="mt-1.5 text-xs font-bold" style={{ color: '#0770E3' }}>View details →</div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {!loading && citySelected && destinations.length > 0 && (
          <div id="destinations" className="fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
              <div>
                <h2 className="font-bold text-[#0D1B2A]">All Destinations from <span style={{ color: '#0770E3' }}>{originCity}</span></h2>
                <p className="text-xs text-[#64748B] mt-0.5">{filteredDests.length} hill station{filteredDests.length !== 1 ? 's' : ''} · sorted by least crowded</p>
              </div>
              <div className="flex gap-2 flex-wrap sm:ml-auto">
                {REGION_FILTERS.map(f => (
                  <button key={f.label} onClick={() => setRegionFilter(f.value)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${regionFilter === f.value ? 'text-white border-transparent' : 'bg-white text-[#374151] border-[#E2EAF4] hover:border-[#0770E3] hover:text-[#0770E3]'}`}
                    style={regionFilter === f.value ? { background: '#0770E3' } : {}}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDests.map(dest => (
                <DestinationCard key={dest.id} destination={dest} originCity={originCity} showTimes={citySelected} />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto" style={{ background: '#071E3D' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full" style={{ height: 40, display: 'block', marginBottom: -1 }}>
          <path d="M0,60 L120,30 L240,50 L360,20 L480,40 L600,15 L720,35 L840,18 L960,38 L1080,22 L1200,42 L1320,28 L1440,45 L1440,60 Z" fill="#071E3D"/>
        </svg>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none"><path d="M14 3L4 20h20L14 3z" fill="#4A90D9" opacity="0.9"/><path d="M14 3L20 20H8L14 3z" fill="#4A90D9" opacity="0.4"/></svg>
              <span className="font-black text-white">HillRadar</span>
              <span className="text-white/40 text-xs">— find your escape</span>
            </div>
            <div className="flex gap-6 text-xs text-white/50 font-medium">
              <span>Crowd data refreshes every 10 minutes</span>
              <span>Powered by Google Maps</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
