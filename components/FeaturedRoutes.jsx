import Link from 'next/link';
import { FAMOUS_ROUTES } from '@/lib/api';

const CARD_COLORS = [
  'from-emerald-500 to-teal-600',
  'from-blue-500 to-indigo-600',
  'from-violet-500 to-purple-600',
  'from-green-600 to-emerald-700',
  'from-rose-500 to-pink-600',
  'from-slate-600 to-slate-800',
];

export default function FeaturedRoutes({ originCity }) {
  const from = originCity || 'Delhi';
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Popular Escapes from {from}</h2>
          <p className="text-sm text-slate-500 mt-0.5">Select your city above for accurate travel times</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FAMOUS_ROUTES.map((route, i) => {
          const slug = route.to.toLowerCase().replace(/\s+/g, '-');
          return (
            <Link
              key={route.to}
              href={`/destination/${slug}`}
              className={`relative rounded-2xl bg-gradient-to-br ${CARD_COLORS[i]} p-5 text-white overflow-hidden group hover:scale-[1.02] transition-transform duration-200`}
            >
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <span className="text-3xl mb-3 block">{route.emoji}</span>
                <div className="text-white/70 text-sm font-medium mb-0.5">{from} →</div>
                <div className="text-xl font-bold mb-2">{route.to}</div>
                <div className="flex items-center gap-3 text-sm text-white/80 mb-3">
                  <span>📍 {route.distanceKm} km</span>
                  <span>·</span>
                  <span>🕐 {route.durationLabel}</span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{route.tagline}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
