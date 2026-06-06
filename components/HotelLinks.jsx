import { getHotelLinks } from '@/lib/api';

const BRAND_COLORS = {
  'Booking.com': '#003580',
  'MakeMyTrip':  '#E63946',
  'OYO Rooms':   '#EE2E24',
  'Goibibo':     '#E03A3C',
  'Agoda':       '#5392F9',
};

export default function HotelLinks({ destName }) {
  const links = getHotelLinks(destName);
  return (
    <div className="bg-white rounded-2xl border border-[#E2EAF4] shadow-sm p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-bold text-[#0D1B2A] text-sm">Book Your Stay</h2>
        <span className="text-xs text-[#64748B]">Opens in new tab</span>
      </div>
      <p className="text-xs text-[#64748B] mb-4">Compare prices across major booking platforms</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {links.map(link => (
          <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-xl border border-[#E2EAF4] p-3 hover:border-[#B4D0F5] hover:shadow-sm transition-all group bg-white card-lift">
            <span className="text-xl">{link.icon}</span>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#0D1B2A] group-hover:text-[#0770E3] transition-colors truncate">{link.name}</div>
              <div className="text-[10px] text-[#94a3b8]">Search hotels →</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
