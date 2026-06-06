import { getHotelLinks } from '@/lib/api';

export default function HotelLinks({ destName }) {
  const links = getHotelLinks(destName);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Book Hotels</h3>
      <p className="text-sm text-slate-400 mb-4">Opens on booking site in a new tab</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-sm px-4 py-3 transition-all group"
          >
            <span className="text-xl">{link.icon}</span>
            <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">{link.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
