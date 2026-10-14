export type Package = {
  id: string;
  name: string;
  diamonds: string;
  price: number; // precio de venta al cliente (USD)
  cost?: number; // costo real de Shop2TopUp (opcional)
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
  categoryId?: number; // ID de categoría en Shop2TopUp (cuando conectes la API)
  packages: Package[];
  requiresServer?: boolean;
  servers?: string[];
};

// Datos de ejemplo (mock). Cuando conectes la API real de Shop2TopUp
// estos paquetes se cargarán dinámicamente desde /catalog/subcategories
export const GAMES: Game[] = [
  {
    id: "free-fire",
    name: "Free Fire",
    shortName: "FF",
    description: "Diamantes Free Fire — entrega automática",
    color: "#ff6b00",
    gradient: "from-orange-500 to-red-600",
    emoji: "🔥",
    requiresServer: false,
    packages: [
      { id: "ff-100", name: "100 Diamantes", diamonds: "100", price: 0.99, popular: false },
      { id: "ff-310", name: "310 Diamantes", diamonds: "310", price: 2.99, popular: true, bonus: "+31" },
      { id: "ff-520", name: "520 Diamantes", diamonds: "520", price: 4.99, popular: false },
      { id: "ff-1060", name: "1060 Diamantes", diamonds: "1060", price: 9.99, popular: true, bonus: "+106" },
      { id: "ff-2180", name: "2180 Diamantes", diamonds: "2180", price: 19.99, popular: false },
      { id: "ff-5600", name: "5600 Diamantes", diamonds: "5600", price: 49.99, popular: false },
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
    id: "honor-of-kings",
    name: "Honor of Kings",
    shortName: "HoK",
    description: "Tokens Honor of Kings",
    color: "#f43f5e",
    gradient: "from-rose-500 to-pink-600",
    emoji: "👑",
    requiresServer: false,
    packages: [
      { id: "hok-60", name: "60 Tokens", diamonds: "60", price: 0.99 },
      { id: "hok-300", name: "300 Tokens", diamonds: "300", price: 4.99, popular: true },
      { id: "hok-980", name: "980 Tokens", diamonds: "980", price: 14.99 },
      { id: "hok-1980", name: "1980 Tokens", diamonds: "1980", price: 29.99, popular: true },
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
