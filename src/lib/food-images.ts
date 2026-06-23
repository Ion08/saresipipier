const BASE = "https://images.unsplash.com/photo-";
const SIZE = "?w=800&h=800&fit=crop";

type PhotoMap = Record<string, string[]>;

const PHOTOS: PhotoMap = {
  pizza: [
    "1565299624946-b28f40a0ae38",
    "1513104890138-7c749659a591",
    "1628840042765-356cda07504e",
    "1534308983496-4fabb1a015ee",
    "1574071318508-1cdbab80d002",
    "1585238342024-78d387f4a707",
    "1604382354936-07c5d9983bd3",
  ],
  "supe-salate": [
    "1547592166-23ac45744acd",
    "1550304943-4f24f54ddde9",
    "1540189549336-e6e99c3679fe",
    "1467003909585-2f8a72700288",
  ],
  gustari: [
    "1562967914-608f82629710",
    "1573080496219-bb080dd4f877",
    "1555949963-aa79dcee981c",
    "1490645935967-10de6ba17061",
  ],
  desert: [
    "1567620905732-2d1ec7ab7445",
    "1484723091739-30a097e8f929",
  ],
  "burgeri-wrap": [
    "1568901346375-23c9450c58cd",
    "1550547660-d9450f859349",
    "1553909489-cd47e0907980",
    "1555949963-aa79dcee981c",
  ],
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const CATEGORY_ALIASES: Record<string, string> = {
  pizza: "pizza",
  "supe-salate": "supe-salate",
  gustari: "gustari",
  desert: "desert",
  "burgeri-wrap": "burgeri-wrap",
};

export function getFoodImage(productName: string, categoryName: string): string {
  const catKey = Object.keys(CATEGORY_ALIASES).find(
    (k) => categoryName.toLowerCase().includes(k) || CATEGORY_ALIASES[k] === categoryName
  );

  const pool = catKey ? PHOTOS[catKey] : PHOTOS.pizza;
  const idx = hashString(productName || "default") % pool.length;
  return `${BASE}${pool[idx]}${SIZE}`;
}
