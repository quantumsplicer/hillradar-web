const API_BASE = 'https://hillradar-api.onrender.com/api';

export async function getDestinations(origin = null) {
  const url = origin
    ? `${API_BASE}/destinations?origin=${encodeURIComponent(origin)}`
    : `${API_BASE}/destinations`;
  const res = await fetch(url, { next: { revalidate: 900 } }); // 15-min cache
  if (!res.ok) throw new Error('Failed to fetch destinations');
  return res.json();
}

export async function getDestinationTrend(id) {
  const res = await fetch(`${API_BASE}/destination/${id}/trend`, { next: { revalidate: 900 } });
  if (!res.ok) return { trend: [] };
  return res.json();
}

export async function getBestTime(id) {
  const res = await fetch(`${API_BASE}/best-time/${id}`, { next: { revalidate: 900 } });
  if (!res.ok) return { best_slot: null };
  return res.json();
}

// Score helpers
export function vibeScore(congestionScore) {
  if (!congestionScore || congestionScore <= 0) return null;
  return Math.min(10, 10 / congestionScore);
}

export function displayVibeScore(congestionScore) {
  const s = vibeScore(congestionScore);
  return s === null ? '--' : s.toFixed(1);
}

export function getScoreColor(congestionScore) {
  const s = vibeScore(congestionScore);
  if (s === null) return { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200', hex: '#94a3b8' };
  if (s >= 9) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', hex: '#16a34a' };
  if (s >= 6) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', hex: '#d97706' };
  return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', hex: '#dc2626' };
}

export function getScoreLabel(congestionScore) {
  const s = vibeScore(congestionScore);
  if (s === null) return 'No data';
  if (s >= 9) return 'Chill';
  if (s >= 6) return 'Busy';
  return 'Avoid';
}

export function getScoreEmoji(congestionScore) {
  const s = vibeScore(congestionScore);
  if (s === null) return '⚪';
  if (s >= 9) return '🟢';
  if (s >= 6) return '🟡';
  return '🔴';
}

export function formatMins(mins) {
  if (!mins) return '--';
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export const CITY_REGIONS = [
  { id: 'ncr', name: 'NCR', cities: ['Delhi', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad', 'Greater Noida'] },
  { id: 'haryana', name: 'Haryana', cities: ['Chandigarh', 'Rohtak', 'Hisar', 'Ambala', 'Karnal', 'Panipat'] },
  { id: 'rajasthan', name: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Ajmer', 'Kota', 'Bikaner', 'Alwar'] },
  { id: 'up', name: 'Uttar Pradesh', cities: ['Agra', 'Meerut', 'Mathura', 'Bareilly', 'Lucknow', 'Kanpur'] },
  { id: 'punjab', name: 'Punjab', cities: ['Amritsar', 'Ludhiana', 'Patiala', 'Jalandhar'] },
];

export const FAMOUS_ROUTES = [
  { to: 'Rishikesh',    distanceKm: 250, durationLabel: '5–6 hrs',   tagline: 'Yoga capital · Ganges ghats · white-water rafting',   emoji: '🏄' },
  { to: 'Nainital',     distanceKm: 310, durationLabel: '6–7 hrs',   tagline: 'Emerald Naini Lake · colonial charm · boating',        emoji: '🏞️' },
  { to: 'Shimla',       distanceKm: 350, durationLabel: '7–8 hrs',   tagline: 'Queen of Hills · Mall Road · pine forests',            emoji: '🏔️' },
  { to: 'Manali',       distanceKm: 540, durationLabel: '10–12 hrs', tagline: 'Snow peaks · Rohtang Pass · adventure sports',         emoji: '⛰️' },
  { to: 'Mussoorie',    distanceKm: 290, durationLabel: '5–6 hrs',   tagline: 'Kempty Falls · Camel Back Road · Himalayan views',     emoji: '🌄' },
  { to: 'McLeod Ganj',  distanceKm: 480, durationLabel: '9–11 hrs',  tagline: 'Little Lhasa · Dalai Lama · Tibetan culture',         emoji: '🙏' },
  { to: 'Haridwar',     distanceKm: 210, durationLabel: '4–5 hrs',   tagline: 'Sacred Ganga Aarti · gateway to the hills',            emoji: '🪔' },
  { to: 'Kasauli',      distanceKm: 300, durationLabel: '5–6 hrs',   tagline: 'Closest hill retreat · colonial cantonment · quiet',   emoji: '🌲' },
  { to: 'Ranikhet',     distanceKm: 350, durationLabel: '6–7 hrs',   tagline: 'Peaceful cantonment · apple orchards · panoramas',     emoji: '🍎' },
  { to: 'Dalhousie',    distanceKm: 555, durationLabel: '9–10 hrs',  tagline: 'Scottish charm · Khajjiar meadows · colonial town',    emoji: '🏡' },
  { to: 'Dharamshala',  distanceKm: 480, durationLabel: '9–10 hrs',  tagline: 'Home of Dalai Lama · Tibetan monasteries · trekking',  emoji: '⛩️' },
  { to: 'Gulmarg',      distanceKm: 800, durationLabel: '13–14 hrs', tagline: "World-class skiing · Asia's highest gondola",          emoji: '🎿' },
];

export const DESTINATION_TAGS = {
  Shimla: ['HP', 'Family', 'Heritage'],
  Manali: ['HP', 'Adventure', 'Snow'],
  Dharamshala: ['HP', 'Culture', 'Trekking'],
  'McLeod Ganj': ['HP', 'Culture', 'Spiritual'],
  Dalhousie: ['HP', 'Heritage', 'Scenic'],
  Kasauli: ['HP', 'Quick Escape', 'Quiet'],
  Chail: ['HP', 'Offbeat', 'Forest'],
  Kufri: ['HP', 'Snow', 'Near Shimla'],
  Narkanda: ['HP', 'Skiing', 'Orchards'],
  Chamba: ['HP', 'Temple', 'Ancient'],
  Solan: ['HP', 'Quick Escape'],
  Khajjiar: ['HP', 'Meadow', 'Scenic'],
  'Spiti Valley': ['HP', 'Remote', 'Desert'],
  Pragpur: ['HP', 'Heritage Village'],
  'Pin Valley': ['HP', 'Remote', 'Wildlife'],
  Mussoorie: ['UK', 'Family', 'Popular'],
  Nainital: ['UK', 'Lake', 'Family'],
  Rishikesh: ['UK', 'Yoga', 'Adventure'],
  Almora: ['UK', 'Culture', 'Scenic'],
  Chakrata: ['UK', 'Offbeat', 'Forest'],
  Lansdowne: ['UK', 'Quiet', 'Cantonment'],
  Ranikhet: ['UK', 'Peaceful', 'Military'],
  Mukteshwar: ['UK', 'Temple', 'Orchards'],
  Haridwar: ['UK', 'Spiritual', 'Ganges'],
  Naukuchiatal: ['UK', 'Lake', 'Quiet'],
  Pangot: ['UK', 'Birdwatching'],
  Ramgarh: ['UK', 'Orchards', 'Quiet'],
  Munsiyari: ['UK', 'Remote', 'Trekking'],
  Lohaghat: ['UK', 'Temple', 'Peaceful'],
  Auli: ['UK', 'Skiing', 'Gondola'],
  Chopta: ['UK', 'Trekking', 'Temple'],
  'New Tehri': ['UK', 'Lake', 'Adventure'],
  Pauri: ['UK', 'Scenic', 'Garhwal'],
  Sankri: ['UK', 'Trek Base', 'Snow'],
  Gulmarg: ['JK', 'Skiing', 'Gondola'],
  Srinagar: ['JK', 'Dal Lake', 'Gardens'],
  Pahalgam: ['JK', 'Valley', 'Meadows'],
  Sonamarg: ['JK', 'Glacier', 'Scenic'],
  Patnitop: ['JK', 'Quick Escape', 'Meadow'],
  Yusmarg: ['JK', 'Offbeat', 'Meadow'],
  Dachigam: ['JK', 'Wildlife'],
  Kasol: ['HP', 'Backpacker', 'River'],
};

export function getHotelLinks(destName) {
  const enc = encodeURIComponent(destName);
  const slug = destName.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '');
  return [
    { name: 'Booking.com', icon: '🏨', color: '#003580', url: `https://www.booking.com/searchresults.html?ss=${enc}+India` },
    { name: 'MakeMyTrip', icon: '✈️', color: '#e63946', url: `https://www.makemytrip.com/hotels/${slug}/` },
    { name: 'OYO Rooms', icon: '🛏️', color: '#ee2e24', url: `https://www.oyorooms.com/search/?location=${enc}` },
    { name: 'Goibibo', icon: '🌐', color: '#e03a3c', url: `https://www.goibibo.com/hotels/hotels-in-${slug}/` },
    { name: 'Agoda', icon: '🌏', color: '#5392f9', url: `https://www.agoda.com/search?city=${enc}+India` },
  ];
}
