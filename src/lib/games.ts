export type Package = {
  id: string;
  name: string;
  diamonds: string;
  price: number;
  s2tItemId?: number;
  popular?: boolean;
  bonus?: string;
};

export type Game = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  color: string;
  gradient: string;
  emoji: string;
  categoryId?: number;
  packages: Package[];
  requiresServer?: boolean;
  servers?: string[];
};

export const GAMES: Game[] = [
  {
    id: "free-fire",
    name: "Free Fire LATAM",
    shortName: "FF LATAM",
    description: "Diamantes Free Fire LATAM (Bolivia, etc.) — entrega automática",
    color: "#ff6b00",
    gradient: "from-orange-500 to-red-600",
    emoji: "🔥",
    categoryId: 484,
    requiresServer: false,
    packages: [
      { id: "ff-latam-100", name: "100 + 10 Diamantes", diamonds: "110", price: 1.10, s2tItemId: 732, bonus: "+10" },
      { id: "ff-latam-310", name: "310 + 31 Diamantes", diamonds: "341", price: 3.20, s2tItemId: 733, popular: true, bonus: "+31" },
      { id: "ff-latam-520", name: "520 + 52 Diamantes", diamonds: "572", price: 5.00, s2tItemId: 734, bonus: "+52" },
      { id: "ff-latam-1060", name: "1060 + 106 Diamantes", diamonds: "1166", price: 9.50, s2tItemId: 735, popular: true, bonus: "+106" },
      { id: "ff-latam-2180", name: "2180 + 218 Diamantes", diamonds: "2398", price: 18.50, s2tItemId: 736, bonus: "+218" },
      { id: "ff-latam-5600", name: "5600 + 560 Diamantes", diamonds: "6160", price: 45.00, s2tItemId: 737, bonus: "+560" },
      { id: "ff-latam-weekly", name: "Weekly Membership", diamonds: "Weekly", price: 3.00, s2tItemId: 741 },
      { id: "ff-latam-booyah", name: "Booyah Pass", diamonds: "Pass", price: 5.00, s2tItemId: 738 },
    ],
  },
  {
    id: "free-fire-br",
    name: "Free Fire Brasil",
    shortName: "FF BR",
    description: "Diamantes Free Fire Brasil — entrega automática",
    color: "#ff6b00",
    gradient: "from-orange-600 to-amber-500",
    emoji: "🇧🇷",
    categoryId: 487,
    requiresServer: false,
    packages: [
      { id: "ff-br-100", name: "100 + 10 Diamantes", diamonds: "110", price: 1.20, s2tItemId: 777, bonus: "+10" },
      { id: "ff-br-310", name: "310 + 31 Diamantes", diamonds: "341", price: 3.50, s2tItemId: 778, popular: true, bonus: "+31" },
      { id: "ff-br-520", name: "520 + 52 Diamantes", diamonds: "572", price: 5.20, s2tItemId: 779, bonus: "+52" },
      { id: "ff-br-1060", name: "1060 + 106 Diamantes", diamonds: "1166", price: 10.90, s2tItemId: 780, popular: true, bonus: "+106" },
      { id: "ff-br-2180", name: "2180 + 218 Diamantes", diamonds: "2398", price: 21.50, s2tItemId: 781, bonus: "+218" },
      { id: "ff-br-5600", name: "5600 + 560 Diamantes", diamonds: "6160", price: 49.90, s2tItemId: 782, bonus: "+560" },
      { id: "ff-br-weekly", name: "Weekly Membership", diamonds: "Weekly", price: 2.50, s2tItemId: 796 },
      { id: "ff-br-booyah", name: "Booyah Pass", diamonds: "Pass", price: 2.50, s2tItemId: 783 },
    ],
  },
  {
    id: "pubg-mobile",
    name: "PUBG Mobile",
    shortName: "PUBG",
    description: "UC PUBG Mobile — entrega rápida",
    color: "#facc15",
    gradient: "from-yellow-400 to-amber-600",
    emoji: "🎯",
    requiresServer: false,
    packages: [
      { id: "pubg-60", name: "60 UC", diamonds: "60", price: 0.99 },
      { id: "pubg-325", name: "325 UC", diamonds: "325", price: 4.99, popular: true },
      { id: "pubg-660", name: "660 UC", diamonds: "660", price: 9.99 },
      { id: "pubg-1800", name: "1800 UC", diamonds: "1800", price: 24.99, popular: true },
      { id: "pubg-3850", name: "3850 UC", diamonds: "3850", price: 49.99 },
      { id: "pubg-8100", name: "8100 UC", diamonds: "8100", price: 99.99 },
    ],
  },
  {
    id: "mobile-legends",
    name: "Mobile Legends",
    shortName: "MLBB",
    description: "Diamantes Mobile Legends",
    color: "#3b82f6",
    gradient: "from-blue-500 to-indigo-600",
    emoji: "⚔️",
    requiresServer: true,
    servers: ["Global", "America", "Europe", "Asia", "Russia"],
    packages: [
      { id: "ml-86", name: "86 Diamantes", diamonds: "86", price: 1.99 },
      { id: "ml-172", name: "172 Diamantes", diamonds: "172", price: 3.99, popular: true },
      { id: "ml-257", name: "257 Diamantes", diamonds: "257", price: 5.99 },
      { id: "ml-344", name: "344 Diamantes", diamonds: "344", price: 7.99 },
      { id: "ml-706", name: "706 Diamantes", diamonds: "706", price: 14.99, popular: true },
      { id: "ml-2195", name: "2195 Diamantes", diamonds: "2195", price: 44.99 },
    ],
  },
  {
    id: "genshin-impact",
    name: "Genshin Impact",
    shortName: "Genshin",
    description: "Genesis Crystals",
    color: "#a78bfa",
    gradient: "from-violet-500 to-purple-700",
    emoji: "✨",
    requiresServer: true,
    servers: ["America", "Europe", "Asia", "TW/HK/MO"],
    packages: [
      { id: "gi-60", name: "60 Cristales", diamonds: "60", price: 0.99 },
      { id: "gi-300", name: "300 + 30", diamonds: "330", price: 4.99, popular: true, bonus: "+30" },
      { id: "gi-980", name: "980 + 110", diamonds: "1090", price: 14.99, popular: true, bonus: "+110" },
      { id: "gi-1980", name: "1980 + 260", diamonds: "2240", price: 29.99, bonus: "+260" },
      { id: "gi-3280", name: "3280 + 600", diamonds: "3880", price: 49.99, bonus: "+600" },
      { id: "gi-6480", name: "6480 + 1600", diamonds: "8080", price: 99.99, bonus: "+1600" },
    ],
  },
  {
    id: "blood-strike",
    name: "Blood Strike",
    shortName: "BS",
    description: "Gold Blood Strike",
    color: "#ef4444",
    gradient: "from-red-500 to-red-700",
    emoji: "🩸",
    requiresServer: false,
    packages: [
      { id: "bs-100", name: "100 Gold", diamonds: "100", price: 0.99 },
      { id: "bs-500", name: "500 Gold", diamonds: "500", price: 4.49, popular: true },
      { id: "bs-1000", name: "1000 Gold", diamonds: "1000", price: 8.99 },
      { id: "bs-2000", name: "2000 Gold", diamonds: "2000", price: 16.99 },
    ],
  },
];

export function getGameById(id: string): Game | undefined {
  return GAMES.find((g) => g.id === id);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
}
