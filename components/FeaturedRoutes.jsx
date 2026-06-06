import Link from 'next/link';
import { FAMOUS_ROUTES } from '@/lib/api';

const ROUTE_BG = [
  { from: '#1565C0', to: '#0D47A1', img: '🏔️' },  // deep blue
  { from: '#00695C', to: '#004D40', img: '🏞️' },  // teal
  { from: '#4527A0', to: '#311B92', img: '⛰️' },  // purple
  { from: '#01579B', to: '#006064', img: '🌊' },  // ocean
  { from: '#2E7D32', to: '#1B5E20', img: '🌲' },  // forest
  { from: '#37474F', to: '#1C313A', img: '🌨️' },  // slate
  { from: '#6A1B9A', to: '#4A148C', img: '🌄' },  // violet
  { from: '#0277BD', to: '#01579B', img: '❄️' },  // sky
  { from: '#558B2F', to: '#33691E', img: '🍃' },  // olive
  { from: '#E65100', to: '#BF360C', img: '🌅' },  // sunset
  { from: '#AD1457', to: '#880E4F', img: '🌸' },  // rose
  { from: '#283593', to: '#1A237E', img: '🏕️' },  // indigo
];

export default function FeaturedRoutes({ originCity }) {
  const from = originCity || 'Delhi';
  return (
    <section id="routes">
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <h2 className="text-xl font-black text-[#0D1B2A]">Popular Escapes</h2>
          <p className="text-sm text-[#64748B] mt-0.5">
            {originCity ? `From ${originCity}` : 'Select your city for travel times'}
          </p>
        </div>
        <span className="text-xs text-[#0770E3] font-semibold">{FAMOUS_ROUTES.length} routes</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FAMOUS_ROUTES.map((route, i) => {
          const bg = ROUTE_BG[i % ROUTE_BG.length];
          const slug = route.to.toLowerCase().replace(/\s+/g, '-');
          return (
            <Link key={route.to} href={`/destination/${slug}`}
              className="group relative rounded-2xl overflow-hidden card-lift" style={{ background: `linear-gradient(135deg, ${bg.from}, ${bg.to})`, minHeight: 170 }}>
              {/* Subtle texture overlay */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, white 1px, transparent 1px), radial-gradient(circle at 70% 70%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

              <div className="relative p-5 flex flex-col h-full">
                <div className="flex items-start justify-between gap-2 mb-auto">
                  <div>
                    <div className="text-white/60 text-xs font-medium mb-0.5">{from} →</div>
                    <h3 className="text-xl font-black text-white leading-tight">{route.to}</h3>
                  </div>
                  <span className="text-3xl">{route.emoji}</span>
                </div>

                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex items-center gap-3 text-white/80 text-xs mb-1.5">
                    <span className="flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                      {route.distanceKm} km
                    </span>
                    <span className="text-white/30">·</span>
                    <span className="flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                      {route.durationLabel}
                    </span>
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed">{route.tagline}</p>
                </div>

                {/* Hover CTA */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1 text-white text-xs font-semibold">
                    Explore →
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
