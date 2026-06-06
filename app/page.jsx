'use client';
import { useState, useEffect } from 'react';
import { getDestinations, CITY_REGIONS, DESTINATION_TAGS, formatMins } from '@/lib/api';
import DestinationCard from '@/components/DestinationCard';
import FeaturedRoutes from '@/components/FeaturedRoutes';
import { ScorePill, ScoreBadge } from '@/components/ScoreBadge';
import Link from 'next/link';

const REGION_FILTERS = [
  { label: 'All', value: null },
  { label: 'Himachal Pradesh', value: 'HP' },
  { label: 'Uttarakhand', value: 'UK' },
  { label: 'Jammu & Kashmir', value: 'JK' },
];

export default function HomePage() {
  const [originCity, setOriginCity] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [regionFilter, setRegionFilter] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('origin_city');
    if (saved) setOriginCity(saved);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getDestinations(originCity || null)
      .then(setDestinations)
      .catch(() => setError('Could not reach backend. It may be waking up — try again in 30s.'))
      .finally(() => setLoading(false));
  }, [originCity]);

  function handleCitySelect(city) {
    setOriginCity(city);
    localStorage.setItem('origin_city', city);
    setPickerOpen(false);
  }

  const best = destinations[0];
  const citySelected = !!originCity;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏔️</span>
            <div>
              <span className="font-black text-xl text-slate-900 tracking-tight">HillRadar</span>
              <span className="hidden sm:inline text-slate-400 text-sm ml-2">— find your escape</span>
            </div>
          </div>
          <a
            href="https://expo.dev/accounts/maanav_seth/projects/hillradar/builds/8de48046-ffd5-4ec3-8b20-a2d24722bb26"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
          >
            <span>📱</span>
            <span className="hidden sm:inline">Get Android App</span>
            <span className="sm:hidden">App</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 leading-tight">
            Find the least-crowded<br className="sm:hidden" /> hill station 🗺️
          </h1>
          <p className="text-slate-500 text-base mb-6 max-w-lg">
            Real-time traffic scores for 12 hill stations. Know before you go.
          </p>

          {/* City picker */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <button
              onClick={() => setPickerOpen(true)}
              className="flex-1 flex items-center gap-3 bg-white border-2 border-slate-200 hover:border-sky-400 rounded-xl px-4 py-3 text-left transition-colors group"
            >
              <span className="text-lg">📍</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Starting from</div>
                <div className={`font-bold truncate ${originCity ? 'text-slate-900' : 'text-slate-400'}`}>
                  {originCity || 'Select your city'}
                </div>
              </div>
              <span className="text-slate-300 group-hover:text-sky-400 transition-colors text-lg">▼</span>
            </button>
            {originCity && (
              <button
                onClick={() => { setOriginCity(''); localStorage.removeItem('origin_city'); }}
                className="sm:w-auto px-4 py-3 rounded-xl border border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-500 text-sm font-medium transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Score legend */}
          <div className="flex items-center gap-4 mt-5 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />9–10 Chill</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />6–8 Busy</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />below 6 Avoid</span>
          </div>
        </div>
      </section>

      {/* City picker modal */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPickerOpen(false)} />
          <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Where are you starting from?</h2>
              <button onClick={() => setPickerOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">×</button>
            </div>
            <div className="overflow-y-auto p-5 space-y-5">
              {CITY_REGIONS.map(region => (
                <div key={region.id}>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{region.name}</div>
                  <div className="flex flex-wrap gap-2">
                    {region.cities.map(city => (
                      <button
                        key={city}
                        onClick={() => handleCitySelect(city)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors
                          ${originCity === city
                            ? 'bg-sky-500 text-white border-sky-500'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:text-sky-600'
                          }`}
                      >
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

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-5 py-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-4 border-sky-200 border-t-sky-500 animate-spin" />
              <p className="text-slate-400 text-sm">
                {originCity ? `Finding routes from ${originCity}…` : 'Loading hill stations…'}
              </p>
            </div>
          </div>
        )}

        {!loading && !citySelected && destinations.length > 0 && (
          <FeaturedRoutes originCity={originCity} />
        )}

        {!loading && citySelected && best && (
          <section>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">✨ Best Pick Right Now</h2>
            <Link
              href={`/destination/${best.name.toLowerCase().replace(/\s+/g, '-')}?origin=${encodeURIComponent(originCity)}`}
              className="block bg-gradient-to-r from-sky-50 to-indigo-50 border-2 border-sky-200 rounded-2xl p-6 hover:border-sky-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-sky-600 transition-colors mb-1">{best.name}</h3>
                  <p className="text-slate-500 text-sm mb-3 line-clamp-2">{best.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>Now: <strong className="text-sky-600">{formatMins(best.current_duration_mins)}</strong></span>
                    <span>·</span>
                    <span>Typical: {formatMins(best.typical_duration_mins)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <ScorePill congestionScore={best.congestion_score} size="lg" />
                  <ScoreBadge congestionScore={best.congestion_score} />
                </div>
              </div>
            </Link>
          </section>
        )}

        {!loading && citySelected && destinations.length > 0 && (
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                All Destinations from {originCity}
              </h2>
              <div className="flex gap-2 flex-wrap">
                {REGION_FILTERS.map(f => (
                  <button
                    key={f.label}
                    onClick={() => setRegionFilter(f.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors
                      ${regionFilter === f.value
                        ? 'bg-sky-500 text-white border-sky-500'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {destinations
                .filter(dest => {
                  if (!regionFilter) return true;
                  const tags = DESTINATION_TAGS[dest.name] || [];
                  return tags.includes(regionFilter);
                })
                .map(dest => (
                  <DestinationCard
                    key={dest.id}
                    destination={dest}
                    originCity={originCity}
                    showTimes={citySelected}
                  />
                ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-100 bg-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
          <span>🏔️ <strong className="text-slate-600">HillRadar</strong> — real-time crowd scores for hill stations</span>
          <span>Data refreshes every 4 hours · Powered by Google Maps</span>
        </div>
      </footer>
    </div>
  );
}
