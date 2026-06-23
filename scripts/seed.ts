import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env.local") });
config({ path: resolve(__dirname, "../.env") });
import { ID } from "appwrite";

const ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";
const API_KEY = process.env.APPWRITE_API_KEY || "";
const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "saresipiper-db";

const API_BASE = `${ENDPOINT}`;

async function api(
  method: string,
  path: string,
  body?: Record<string, unknown>
) {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    "X-Appwrite-Project": PROJECT_ID,
    "X-Appwrite-Key": API_KEY,
    "Content-Type": "application/json",
  };
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `API ${method} ${path} failed (${res.status}): ${JSON.stringify(data)}`
    );
  }
  return data;
}

function log(step: string, status: string, detail = "") {
  const icon = status === "OK" ? "\u2713" : status === "SKIP" ? "\u2192" : "\u2717";
  console.log(`  ${icon} ${step}${detail ? ` - ${detail}` : ""}`);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureDatabase(): Promise<string> {
  console.log("\n[1] Database");
  try {
    const dbs = await api("GET", "/databases");
    const existing = dbs.databases?.find(
      (d: { $id: string; name: string }) =>
        d.$id === DATABASE_ID || d.name === DATABASE_ID
    );
    if (existing) {
      log(`Database "${DATABASE_ID}"`, "SKIP", "already exists");
      return existing.$id;
    }
    const db = await api("POST", "/databases", {
      databaseId: DATABASE_ID,
      name: DATABASE_ID,
    });
    log(`Database "${DATABASE_ID}"`, "OK", `id: ${db.$id || DATABASE_ID}`);
    return db.$id || DATABASE_ID;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  Database setup failed: ${msg}`);
    throw e;
  }
}

async function ensureBucket(): Promise<string> {
  console.log("\n[2] Storage Bucket");
  try {
    const buckets = await api("GET", "/storage/buckets");
    const existing = buckets.buckets?.find(
      (b: { $id: string; name: string }) => b.name === "restaurant-images"
    );
    if (existing) {
      log(`Bucket "restaurant-images"`, "SKIP", `id: ${existing.$id}`);
      return existing.$id;
    }
    const bucket = await api("POST", "/storage/buckets", {
      bucketId: ID.unique(),
      name: "restaurant-images",
      maximumFileSize: 10_485_760,
      allowedFileExtensions: [],
      fileSecurity: true,
      enabled: true,
    });
    log(`Bucket "restaurant-images"`, "OK", `id: ${bucket.$id}`);

    await api("PUT", `/storage/buckets/${bucket.$id}`, {
      name: "restaurant-images",
      maximumFileSize: 10_485_760,
      allowedFileExtensions: ["jpg", "jpeg", "png", "webp", "avif"],
      fileSecurity: true,
    });
    log(`Bucket MIME/extension restrictions`, "OK");
    return bucket.$id;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  Bucket setup failed: ${msg}`);
    throw e;
  }
}

interface AttrDef {
  key: string;
  type: "string" | "integer" | "float" | "boolean";
  required?: boolean;
  default?: unknown;
  size?: number;
  min?: number;
  max?: number;
  array?: boolean;
}

interface IndexDef {
  key: string;
  type: "key" | "unique";
  attributes: string[];
  orders?: ("ASC" | "DESC")[];
}

async function ensureCollection(
  collectionId: string,
  name: string,
  attrs: AttrDef[],
  indexes: IndexDef[]
) {
  const label = `${collectionId} (${name})`;

  try {
    let collections;
    try {
      collections = await api("GET", `/databases/${DATABASE_ID}/collections`);
    } catch {
      collections = { collections: [] };
    }
    const existing = collections.collections?.find(
      (c: { $id: string; name: string }) => c.$id === collectionId
    );
    if (existing) {
      log(`Collection "${label}"`, "SKIP", "already exists");
      return;
    }

    await api("POST", `/databases/${DATABASE_ID}/collections`, {
      collectionId,
      name,
      permissions: ['read("any")'],
      documentSecurity: false,
    });
    log(`Collection "${label}"`, "OK", "created");

    for (const attr of attrs) {
      const attrPath = `/databases/${DATABASE_ID}/collections/${collectionId}/attributes/${attr.type}`;
      const payload: Record<string, unknown> = {
        key: attr.key,
        required: attr.required ?? false,
        ...(attr.array !== undefined ? { array: attr.array } : {}),
      };
      if (attr.default !== undefined) payload.default = attr.default;
      if (attr.type === "string") {
        payload.size = attr.size ?? 256;
      }
      if (attr.type === "integer" || attr.type === "float") {
        if (attr.min !== undefined) payload.min = attr.min;
        if (attr.max !== undefined) payload.max = attr.max;
      }

      await api("POST", attrPath, payload);
      log(`  Attribute "${attr.key}" (${attr.type})`, "OK");
      await sleep(300);
    }

    for (const idx of indexes) {
      await api(
        "POST",
        `/databases/${DATABASE_ID}/collections/${collectionId}/indexes`,
        {
          key: idx.key,
          type: idx.type,
          attributes: idx.attributes,
          orders: idx.orders ?? idx.attributes.map(() => "ASC"),
        }
      );
      log(`  Index "${idx.key}" (${idx.type})`, "OK");
      await sleep(300);
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  Collection "${label}" failed: ${msg}`);
    throw e;
  }
}

async function setupCollections() {
  console.log("\n[3] Collections");

  const categoriesAttrs: AttrDef[] = [
    { key: "name", type: "string", required: true },
    { key: "slug", type: "string", required: true },
    { key: "description", type: "string" },
    { key: "order", type: "integer", default: 0 },
    { key: "createdAt", type: "string" },
    { key: "updatedAt", type: "string" },
  ];
  const categoriesIndexes: IndexDef[] = [
    { key: "slug", type: "unique", attributes: ["slug"] },
    { key: "order_idx", type: "key", attributes: ["order"] },
  ];
  await ensureCollection(
    "categories",
    "categories",
    categoriesAttrs,
    categoriesIndexes
  );

  const productsAttrs: AttrDef[] = [
    { key: "name", type: "string", required: true },
    { key: "slug", type: "string", required: true },
    { key: "description", type: "string" },
    { key: "ingredients", type: "string" },
    { key: "price", type: "float", required: true },
    { key: "weight", type: "string" },
    { key: "category", type: "string", required: true },
    { key: "featured", type: "boolean", default: false },
    { key: "new", type: "boolean", default: false },
    { key: "available", type: "boolean", default: true },
    { key: "image", type: "string" },
    { key: "order", type: "integer", default: 0 },
    { key: "createdAt", type: "string" },
    { key: "updatedAt", type: "string" },
  ];
  const productsIndexes: IndexDef[] = [
    { key: "slug", type: "unique", attributes: ["slug"] },
    { key: "category_idx", type: "key", attributes: ["category"] },
    { key: "featured_idx", type: "key", attributes: ["featured"] },
    { key: "available_idx", type: "key", attributes: ["available"] },
    { key: "order_idx", type: "key", attributes: ["order"] },
  ];
  await ensureCollection(
    "products",
    "products",
    productsAttrs,
    productsIndexes
  );

  const reservationsAttrs: AttrDef[] = [
    { key: "name", type: "string", required: true },
    { key: "phone", type: "string", required: true },
    { key: "email", type: "string", required: true },
    { key: "guests", type: "integer", required: true },
    { key: "date", type: "string", required: true },
    { key: "time", type: "string", required: true },
    { key: "specialRequests", type: "string" },
    { key: "status", type: "string", default: "pending" },
    { key: "createdAt", type: "string" },
    { key: "updatedAt", type: "string" },
  ];
  const reservationsIndexes: IndexDef[] = [
    { key: "status_idx", type: "key", attributes: ["status"] },
    { key: "date_idx", type: "key", attributes: ["date"] },
    { key: "createdAt_idx", type: "key", attributes: ["createdAt"], orders: ["DESC"] },
  ];
  await ensureCollection(
    "reservations",
    "reservations",
    reservationsAttrs,
    reservationsIndexes
  );

  const galleryAttrs: AttrDef[] = [
    { key: "title", type: "string", required: true },
    { key: "description", type: "string" },
    { key: "image", type: "string", required: true },
    { key: "category", type: "string" },
    { key: "featured", type: "boolean", default: false },
    { key: "order", type: "integer", default: 0 },
    { key: "createdAt", type: "string" },
    { key: "updatedAt", type: "string" },
  ];
  const galleryIndexes: IndexDef[] = [
    { key: "featured_idx", type: "key", attributes: ["featured"] },
    { key: "order_idx", type: "key", attributes: ["order"] },
  ];
  await ensureCollection("gallery", "gallery", galleryAttrs, galleryIndexes);

  const homepageAttrs: AttrDef[] = [
    { key: "heroTitle", type: "string" },
    { key: "heroSubtitle", type: "string" },
    { key: "heroDescription", type: "string" },
    { key: "heroImage", type: "string" },
    { key: "aboutTitle", type: "string" },
    { key: "aboutDescription", type: "string" },
    { key: "aboutImage", type: "string" },
    { key: "stats", type: "string" },
    { key: "featuredTitle", type: "string" },
    { key: "featuredDescription", type: "string" },
  ];
  await ensureCollection("homepage", "homepage", homepageAttrs, []);

  const settingsAttrs: AttrDef[] = [
    { key: "restaurantName", type: "string" },
    { key: "tagline", type: "string" },
    { key: "address", type: "string" },
    { key: "addressLine2", type: "string" },
    { key: "city", type: "string" },
    { key: "phone", type: "string" },
    { key: "instagram", type: "string" },
    { key: "instagramUrl", type: "string" },
    { key: "email", type: "string" },
    { key: "openingHours", type: "string" },
    { key: "openingHoursDaily", type: "string" },
    { key: "googleMapsUrl", type: "string" },
    { key: "facebook", type: "string" },
    { key: "whatsapp", type: "string" },
    { key: "seoTitle", type: "string" },
    { key: "seoDescription", type: "string" },
    { key: "seoKeywords", type: "string" },
  ];
  await ensureCollection("settings", "settings", settingsAttrs, []);

  const testimonialsAttrs: AttrDef[] = [
    { key: "name", type: "string", required: true },
    { key: "role", type: "string" },
    { key: "content", type: "string", required: true },
    { key: "rating", type: "integer", default: 5 },
    { key: "avatar", type: "string" },
    { key: "featured", type: "boolean", default: false },
    { key: "order", type: "integer", default: 0 },
    { key: "createdAt", type: "string" },
    { key: "updatedAt", type: "string" },
  ];
  const testimonialsIndexes: IndexDef[] = [
    { key: "featured_idx", type: "key", attributes: ["featured"] },
    { key: "order_idx", type: "key", attributes: ["order"] },
  ];
  await ensureCollection(
    "testimonials",
    "testimonials",
    testimonialsAttrs,
    testimonialsIndexes
  );

  const contactsAttrs: AttrDef[] = [
    { key: "name", type: "string", required: true },
    { key: "email", type: "string", required: true },
    { key: "phone", type: "string" },
    { key: "subject", type: "string", required: true },
    { key: "message", type: "string", required: true },
    { key: "createdAt", type: "string" },
  ];
  const contactsIndexes: IndexDef[] = [
    { key: "createdAt_idx", type: "key", attributes: ["createdAt"], orders: ["DESC"] },
  ];
  await ensureCollection("contacts", "contacts", contactsAttrs, contactsIndexes);
}

function makeDocUrl(collectionId: string) {
  return `/databases/${DATABASE_ID}/collections/${collectionId}/documents`;
}

async function seedData() {
  console.log("\n[4] Seed Data");

  const now = new Date().toISOString();

  async function createDoc(
    collectionId: string,
    data: Record<string, unknown>
  ) {
    try {
      const path = makeDocUrl(collectionId);
      await api("POST", path, {
        documentId: ID.unique(),
        data,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`  Failed to create document in ${collectionId}: ${msg}`);
    }
  }

  async function collectionExists(collectionId: string): Promise<boolean> {
    try {
      const path = `/databases/${DATABASE_ID}/collections/${collectionId}`;
      await api("GET", path);
      return true;
    } catch {
      return false;
    }
  }

  async function hasDocuments(collectionId: string): Promise<boolean> {
    try {
      const path = makeDocUrl(collectionId);
      const result = await api("GET", `${path}?total=true&limit=0`);
      return (result.total ?? 0) > 0;
    } catch {
      return false;
    }
  }

  const catsReady = await collectionExists("categories");
  if (!catsReady) {
    console.log("  Collections not ready yet, waiting...");
    await sleep(3000);
  }

  // Categories
  if (await hasDocuments("categories")) {
    log("Categories", "SKIP", "already seeded");
  } else {
    const categories = [
      { name: "Salate", slug: "salate", description: "Salate proaspete și sănătoase", order: 1 },
      { name: "Gustări", slug: "gustari", description: "Gustări delicioase pentru început", order: 2 },
      { name: "Supe & Ciorbe", slug: "supe-ciorbe", description: "Supe și ciorbe tradiționale", order: 3 },
      { name: "Preparate din Pește", slug: "preparate-din-peste", description: "Pește proaspăt și fructe de mare", order: 4 },
      { name: "Preparate din Carne", slug: "preparate-din-carne", description: "Preparate din carne la grătar", order: 5 },
      { name: "Paste & Risotto", slug: "paste-risotto", description: "Paste și risotto italienești", order: 6 },
      { name: "Pizza", slug: "pizza", description: "Pizza autentică, coaptă în cuptor", order: 7 },
      { name: "Garnituri", slug: "garnituri", description: "Garnituri pentru orice preparat", order: 8 },
      { name: "Desert", slug: "desert", description: "Deserturi savuroase", order: 9 },
      { name: "Băuturi Răcoritoare", slug: "bauturi-racoritoare", description: "Băuturi răcoritoare", order: 10 },
      { name: "Băuturi Alcoolice", slug: "bauturi-alcoolice", description: "Selecție de băuturi alcoolice", order: 11 },
      { name: "Cafea & Ceai", slug: "cafea-ceai", description: "Cafea și ceai de calitate", order: 12 },
    ];
    for (const cat of categories) {
      await createDoc("categories", {
        ...cat,
        createdAt: now,
        updatedAt: now,
      });
    }
    log("Categories", "OK", `${categories.length} seeded`);
  }

  // Products
  if (await hasDocuments("products")) {
    log("Products", "SKIP", "already seeded");
  } else {
    const catMap: Record<string, string> = {};
    try {
      const cats = await api("GET", makeDocUrl("categories"));
      for (const c of cats.documents) {
        catMap[c.slug as string] = c.$id;
      }
    } catch {
      console.error("  Could not fetch categories for product mapping");
    }

    const featured = [
      "salata-ceasar",
      "carpaccio-de-vita",
      "somn-la-gratar",
      "antricot-de-vita",
      "spaghetti-carbonara",
      "pizza-quattro-stagioni",
      "papanasi-cu-smantana-si-dulceata",
    ];
    const newItems = [
      "salata-de-avocado",
      "pui-taranesc",
      "pizza-diavola",
      "tagliatelle-cu-somon",
      "risotto-cu-frutti-di-mare",
    ];

    interface ProductSeed {
      name: string;
      slug: string;
      description: string;
      ingredients: string;
      price: number;
      weight: string;
      category: string;
      order: number;
    }

    const products: ProductSeed[] = [
      // Salate
      { name: "Salată Caesar", slug: "salata-ceasar", description: "Salată romană, parmezan, crutoane, dressing Caesar", ingredients: "Salată romană, parmezan, crutoane, dressing Caesar, ulei de măsline", price: 115, weight: "300g", category: "salate", order: 1 },
      { name: "Salată Grecească", slug: "salata-greceasca", description: "Roșii, castraveți, brânză feta, măsline, ceapă roșie", ingredients: "Roșii, castraveți, brânză feta, măsline Kalamata, ceapă roșie, oregano", price: 105, weight: "300g", category: "salate", order: 2 },
      { name: "Salată Caprese", slug: "salata-caprese", description: "Mozzarella proaspătă, roșii cherry, busuioc, dressing balsamic", ingredients: "Mozzarella di bufala, roșii cherry, busuioc proaspăt, oțet balsamic, ulei de măsline", price: 110, weight: "280g", category: "salate", order: 3 },
      { name: "Salată de Avocado", slug: "salata-de-avocado", description: "Avocado, mix de verdețuri, roșii cherry, semințe de rodie", ingredients: "Avocado, rucola, spanac, roșii cherry, semințe de rodie, dressing lime", price: 130, weight: "280g", category: "salate", order: 4 },
      { name: "Salată de Ton", slug: "salata-de-ton", description: "Ton la grătar, mix de verdețuri, ou fiert, măsline", ingredients: "Ton, rucola, ou fiert, măsline, roșii cherry, dressing de muștar", price: 120, weight: "300g", category: "salate", order: 5 },

      // Gustări
      { name: "Bruschete cu Roșii și Busuioc", slug: "bruschete-cu-rosii-si-busuioc", description: "Pâine prăjită cu roșii proaspete, busuioc și ulei de măsline", ingredients: "Pâine artizanală, roșii, busuioc, usturoi, ulei de măsline extravirgin", price: 85, weight: "200g", category: "gustari", order: 1 },
      { name: "Platou de Brânzeturi", slug: "platou-de-branzeturi", description: "Selecție de brânzeturi fine, nuci, fructe uscate", ingredients: "Brânză maturată, brie, gorgonzola, nuci, smochine, miere, struguri", price: 180, weight: "350g", category: "gustari", order: 2 },
      { name: "Carpaccio de Vită", slug: "carpaccio-de-vita", description: "Felii subțiri de mușchi de vită, parmezan, rucola, lămâie", ingredients: "Mușchi de vită, parmezan, rucola, lămâie, ulei de trufe, capere", price: 145, weight: "200g", category: "gustari", order: 3 },
      { name: "Melc de Casă", slug: "melc-de-casa", description: "Melc tradițional cu nucă și cacao", ingredients: "Aluat dospit, nucă, cacao, zahăr, vanilie", price: 50, weight: "1 buc", category: "gustari", order: 4 },
      { name: "Pâine cu Usturoi", slug: "paine-cu-usturoi", description: "Pâine prăjită cu unt și usturoi", ingredients: "Pâine, unt, usturoi, pătrunjel", price: 45, weight: "200g", category: "gustari", order: 5 },
      { name: "Platou de Mezeluri", slug: "platou-de-mezeluri", description: "Selecție de mezeluri fine, murături și pâine", ingredients: "Prosciutto crudo, salam italian, pate, murături asortate, pâine", price: 165, weight: "300g", category: "gustari", order: 6 },

      // Supe & Ciorbe
      { name: "Ciorbă de Burtă", slug: "ciorba-de-burta", description: "Ciorbă tradițională de burtă cu smântână și usturoi", ingredients: "Burtă de vită, smântână, usturoi, oțet, legume", price: 75, weight: "400ml", category: "supe-ciorbe", order: 1 },
      { name: "Supă de Pui cu Tăieței", slug: "supa-de-pui-cu-taitei", description: "Supă de pui cu tăieței de casă și legume", ingredients: "Pui, tăieței de casă, morcov, pătrunjel, țelină", price: 65, weight: "400ml", category: "supe-ciorbe", order: 2 },
      { name: "Ciorbă de Perișoare", slug: "ciorba-de-perisoare", description: "Ciorbă de perișoare cu orez și legume", ingredients: "Carne tocată de porc, orez, legume, borș, smântână", price: 70, weight: "400ml", category: "supe-ciorbe", order: 3 },
      { name: "Supa Crema de Ciuperci", slug: "supa-crema-de-ciuperci", description: "Supă cremoasă de ciuperci cu crutoane", ingredients: "Ciuperci, smântână, unt, ceapă, crutoane, ulei de trufe", price: 80, weight: "350ml", category: "supe-ciorbe", order: 4 },

      // Preparate din Pește
      { name: "Somon la Grătar", slug: "somn-la-gratar", description: "Somon proaspăt la grătar cu lămâie și verdețuri", ingredients: "Somon, lămâie, mărar, unt, legume la grătar", price: 195, weight: "250g", category: "preparate-din-peste", order: 1 },
      { name: "Păstrăv cu Legume", slug: "pastrav-cu-legume", description: "Păstrăv proaspăt la cuptor cu legume", ingredients: "Păstrăv, roșii, ardei, ceapă, lămâie, ierburi aromatice", price: 175, weight: "300g", category: "preparate-din-peste", order: 2 },
      { name: "Midii cu Vin Alb", slug: "midii-cu-vin-alb", description: "Midii proaspete în sos de vin alb cu usturoi", ingredients: "Midii, vin alb, usturoi, pătrunjel, unt", price: 155, weight: "400g", category: "preparate-din-peste", order: 3 },
      { name: "Calamari Prăjiți", slug: "calamari-prajiti", description: "Calamari pane, prăjiți, cu sos tartar și lămâie", ingredients: "Calamari, făină, ou, lămâie, sos tartar", price: 145, weight: "250g", category: "preparate-din-peste", order: 4 },

      // Preparate din Carne
      { name: "Antricot de Vită", slug: "antricot-de-vita", description: "Antricot de vită grill, cu unt de ierburi și legume", ingredients: "Antricot de vită, unt, ierburi aromatice, legume la grătar", price: 295, weight: "300g", category: "preparate-din-carne", order: 1 },
      { name: "Friptură de Pui", slug: "friptura-de-pui", description: "Piept de pui la grătar cu garnitură", ingredients: "Piept de pui, usturoi, rozmarin, ulei de măsline", price: 145, weight: "250g", category: "preparate-din-carne", order: 2 },
      { name: "Ceafă de Porc la Grătar", slug: "ceafa-de-porc-la-gratar", description: "Ceafă de porc marinată și la grătar", ingredients: "Ceafă de porc, bere, usturoi, boia, cimbru", price: 165, weight: "250g", category: "preparate-din-carne", order: 3 },
      { name: "Mici", slug: "mici", description: "Mici tradiționali la grătar, cu muștar și pâine", ingredients: "Carne tocată de vită și porc, usturoi, cimbru, bicarbonat", price: 55, weight: "100g", category: "preparate-din-carne", order: 4 },
      { name: "Aripioare Picante", slug: "aripioare-picante", description: "Aripioare de pui în sos picant BBQ", ingredients: "Aripioare de pui, sos BBQ, chili, usturoi, miere", price: 95, weight: "300g", category: "preparate-din-carne", order: 5 },
      { name: "Burger Classic", slug: "burger-classic", description: "Burger cu carne de vită, cheddar, salată, roșii și sos special", ingredients: "Carne de vită, cheddar, salată, roșii, castraveți murați, sos secret", price: 135, weight: "300g", category: "preparate-din-carne", order: 6 },
      { name: "Mușchi de Vită în Sos de Vin", slug: "muschi-de-vita-in-sos-de-vin", description: "Mușchi de vită în sos de vin roșu cu ciuperci", ingredients: "Mușchi de vită, vin roșu, ciuperci, smântână, ierburi aromatice", price: 265, weight: "280g", category: "preparate-din-carne", order: 7 },
      { name: "Pui Țăranesc", slug: "pui-taranesc", description: "Pui la cuptor cu cartofi, usturoi și rozmarin", ingredients: "Pui, cartofi, usturoi, rozmarin, ulei de măsline, lămâie", price: 125, weight: "350g", category: "preparate-din-carne", order: 8 },
      { name: "Ficăței de Pui", slug: "ficatei-de-pui", description: "Ficăței de pui prăjiți cu ceapă și mămăliguță", ingredients: "Ficăței de pui, ceapă, unt, pătrunjel, mămăligă", price: 95, weight: "250g", category: "preparate-din-carne", order: 9 },
      { name: "Snitel de Pui", slug: "snitel-de-pui", description: "Snitel de pui pane, cu lămâie și garnitură", ingredients: "Piept de pui, pesmet, ou, lămâie, garnitură la alegere", price: 115, weight: "250g", category: "preparate-din-carne", order: 10 },
      { name: "Frigarui de Pui", slug: "frigarui-de-pui", description: "Frigărui de pui marinate cu legume la grătar", ingredients: "Piept de pui, ardei, ceapă, roșii, marinată de iaurt și ierburi", price: 125, weight: "250g", category: "preparate-din-carne", order: 11 },
      { name: "Piept de Rață", slug: "piept-de-rata", description: "Piept de rață cu sos de portocale și legume", ingredients: "Piept de rață, portocale, miere, unt, cimbru", price: 225, weight: "250g", category: "preparate-din-carne", order: 12 },
      { name: "Cotlet de Miel", slug: "cotlet-de-miel", description: "Cotlet de miel la grătar cu ierburi aromatice", ingredients: "Cotlet de miel, rozmarin, usturoi, ulei de măsline, lămâie", price: 235, weight: "250g", category: "preparate-din-carne", order: 13 },

      // Paste & Risotto
      { name: "Spaghetti Carbonara", slug: "spaghetti-carbonara", description: "Spaghetti cu ou, parmezan, guanciale și piper negru", ingredients: "Spaghetti, ouă, guanciale, parmezan, piper negru", price: 135, weight: "350g", category: "paste-risotto", order: 1 },
      { name: "Penne Arrabiata", slug: "penne-arrabiata", description: "Penne în sos picant de roșii cu usturoi și chili", ingredients: "Penne, roșii, usturoi, chili, ulei de măsline, busuioc", price: 115, weight: "350g", category: "paste-risotto", order: 2 },
      { name: "Risotto cu Ciuperci", slug: "risotto-cu-ciuperci", description: "Risotto cremos cu ciuperci și parmezan", ingredients: "Orez arborio, ciuperci, parmezan, unt, vin alb, supă de legume", price: 145, weight: "300g", category: "paste-risotto", order: 3 },
      { name: "Tagliatelle cu Somon", slug: "tagliatelle-cu-somon", description: "Tagliatelle cu somon afumat în sos cremos", ingredients: "Tagliatelle, somon afumat, smântână, mărar, parmezan", price: 165, weight: "350g", category: "paste-risotto", order: 4 },
      { name: "Lasagna Bolognese", slug: "lasagna-bolognese", description: "Lasagna clasică cu sos bolognese și bechamel", ingredients: "Foi de lasagna, carne tocată de vită, sos bechamel, parmezan, roșii", price: 145, weight: "350g", category: "paste-risotto", order: 5 },
      { name: "Risotto cu Frutti di Mare", slug: "risotto-cu-frutti-di-mare", description: "Risotto cu fructe de mare și vin alb", ingredients: "Orez arborio, creveți, midii, calamari, vin alb, parmezan", price: 175, weight: "300g", category: "paste-risotto", order: 6 },

      // Pizza
      { name: "Pizza Margherita", slug: "pizza-margherita", description: "Pizza clasică cu sos de roșii, mozzarella și busuioc", ingredients: "Sos de roșii, mozzarella, busuioc proaspăt, ulei de măsline", price: 95, weight: "400g", category: "pizza", order: 1 },
      { name: "Pizza Pepperoni", slug: "pizza-pepperoni", description: "Pizza cu pepperoni și mozzarella", ingredients: "Sos de roșii, mozzarella, pepperoni, oregano", price: 115, weight: "450g", category: "pizza", order: 2 },
      { name: "Pizza Quattro Stagioni", slug: "pizza-quattro-stagioni", description: "Pizza cu patru toppinguri: ciuperci, șuncă, măsline, ardei", ingredients: "Sos de roșii, mozzarella, ciuperci, șuncă, măsline, ardei", price: 135, weight: "480g", category: "pizza", order: 3 },
      { name: "Pizza Diavola", slug: "pizza-diavola", description: "Pizza picantă cu salam iute și ardei chili", ingredients: "Sos de roșii, mozzarella, salam iute, ardei chili, oregano", price: 125, weight: "450g", category: "pizza", order: 4 },
      { name: "Pizza Prosciutto", slug: "pizza-prosciutto", description: "Pizza cu prosciutto crudo și rucola", ingredients: "Sos de roșii, mozzarella, prosciutto crudo, rucola, parmezan", price: 130, weight: "460g", category: "pizza", order: 5 },

      // Garnituri
      { name: "Cartofi Prăjiți", slug: "cartofi-prajiti", description: "Cartofi prăjiți aurii și crocanți", ingredients: "Cartofi, ulei, sare", price: 45, weight: "200g", category: "garnituri", order: 1 },
      { name: "Orez cu Legume", slug: "orez-cu-legume", description: "Orez sălbatic cu legume sotate", ingredients: "Orez, morcov, ardei, porumb, ceapă", price: 45, weight: "200g", category: "garnituri", order: 2 },
      { name: "Legume la Grătar", slug: "legume-la-gratar", description: "Legume proaspete la grătar", ingredients: "Dovlecel, ardei, ciuperci, vinete, ulei de măsline", price: 55, weight: "200g", category: "garnituri", order: 3 },
      { name: "Piure de Cartofi", slug: "piure-de-cartofi", description: "Piure cremos de cartofi cu unt", ingredients: "Cartofi, unt, lapte, sare, piper", price: 45, weight: "200g", category: "garnituri", order: 4 },
      { name: "Cartofi Natur", slug: "cartofi-natur", description: "Cartofi fierți cu mărar și unt", ingredients: "Cartofi, unt, mărar, sare", price: 35, weight: "200g", category: "garnituri", order: 5 },

      // Desert
      { name: "Papanasi cu Smântână și Dulceață", slug: "papanasi-cu-smantana-si-dulceata", description: "Papanasi tradiționali cu smântână și dulceață de afine", ingredients: "Brânză de vaci, ouă, făină, smântână, dulceață de afine", price: 85, weight: "250g", category: "desert", order: 1 },
      { name: "Tiramisu", slug: "tiramisu", description: "Tiramisu clasic italian cu mascarpone și cafea", ingredients: "Mascarpone, cafea espresso, pișcoturi, ouă, cacao", price: 75, weight: "200g", category: "desert", order: 2 },
      { name: "Tort de Ciocolată", slug: "tort-de-ciocolata", description: "Tort decadent de ciocolată cu ganache", ingredients: "Ciocolată neagră, unt, ouă, făină, smântână", price: 85, weight: "200g", category: "desert", order: 3 },
      { name: "Crème Brûlée", slug: "creme-brulee", description: "Crema franțuzească cu caramel", ingredients: "Smântână, ouă, vanilie, zahăr caramelizat", price: 75, weight: "200g", category: "desert", order: 4 },
      { name: "Înghețată", slug: "inghetata", description: "Înghețată artizanală - vanilie, ciocolată, căpșuni", ingredients: "Lapte, smântână, zahăr, arome naturale", price: 45, weight: "150g", category: "desert", order: 5 },

      // Băuturi Răcoritoare
      { name: "Cola, Fanta, Sprite", slug: "cola-fanta-sprite", description: "Băuturi răcoritoare carbogazoase", ingredients: "Apă carbogazoasă, zahăr, arome naturale", price: 25, weight: "330ml", category: "bauturi-racoritoare", order: 1 },
      { name: "Apă Plată / Minerală", slug: "apa-plata-minerala", description: "Apă plată sau minerală", ingredients: "Apă", price: 20, weight: "500ml", category: "bauturi-racoritoare", order: 2 },
      { name: "Suc Natural de Portocale", slug: "suc-natural-de-portocale", description: "Suc proaspăt stors de portocale", ingredients: "Portocale proaspete", price: 45, weight: "330ml", category: "bauturi-racoritoare", order: 3 },
      { name: "Limonadă Proaspătă", slug: "limonada-proaspata", description: "Limonadă de casă cu mentă și lămâie", ingredients: "Lămâi, mentă, zahăr, apă", price: 45, weight: "400ml", category: "bauturi-racoritoare", order: 4 },
      { name: "Fresh de Grapefruit", slug: "fresh-de-grapefruit", description: "Fresh proaspăt de grapefruit roz", ingredients: "Grapefruit roz proaspăt", price: 50, weight: "330ml", category: "bauturi-racoritoare", order: 5 },
      { name: "Aperol Spritz (non-alc)", slug: "aperol-spritz-non-alc", description: "Aperol Spritz non-alcoolic", ingredients: "Aperol non-alcoolic, apă minerală, portocală", price: 65, weight: "300ml", category: "bauturi-racoritoare", order: 6 },

      // Băuturi Alcoolice
      { name: "Bere La Halbă", slug: "bere-la-halba", description: "Bere la halbă - draft", ingredients: "Apă, malț, hamei, drojdie", price: 35, weight: "500ml", category: "bauturi-alcoolice", order: 1 },
      { name: "Vin alb", slug: "vin-alb", description: "Vin alb sec - selecția casei", ingredients: "Struguri albi", price: 120, weight: "750ml", category: "bauturi-alcoolice", order: 2 },
      { name: "Vin roșu", slug: "vin-rosu", description: "Vin roșu sec - selecția casei", ingredients: "Struguri roșii", price: 140, weight: "750ml", category: "bauturi-alcoolice", order: 3 },
      { name: "Prosecco", slug: "prosecco", description: "Prosecco italian brut", ingredients: "Struguri Glera", price: 180, weight: "750ml", category: "bauturi-alcoolice", order: 4 },
      { name: "Whisky", slug: "whisky", description: "Whisky de calitate - selecția casei", ingredients: "Whisky", price: 55, weight: "50ml", category: "bauturi-alcoolice", order: 5 },
      { name: "Vodka", slug: "vodka", description: "Vodka premium", ingredients: "Vodka", price: 45, weight: "50ml", category: "bauturi-alcoolice", order: 6 },
      { name: "Gin", slug: "gin", description: "Gin London Dry", ingredients: "Gin", price: 50, weight: "50ml", category: "bauturi-alcoolice", order: 7 },
      { name: "Rom", slug: "rom", description: "Rom învechit", ingredients: "Rom", price: 50, weight: "50ml", category: "bauturi-alcoolice", order: 8 },

      // Cafea & Ceai
      { name: "Espresso", slug: "espresso", description: "Espresso italian autentic", ingredients: "Cafea Arabica", price: 25, weight: "30ml", category: "cafea-ceai", order: 1 },
      { name: "Cappuccino", slug: "cappuccino", description: "Cappuccino cremos cu spumă de lapte", ingredients: "Espresso, lapte, spumă de lapte", price: 30, weight: "200ml", category: "cafea-ceai", order: 2 },
      { name: "Latte Macchiato", slug: "latte-macchiato", description: "Latte macchiato cu strat de espresso", ingredients: "Espresso, lapte, spumă de lapte", price: 30, weight: "250ml", category: "cafea-ceai", order: 3 },
      { name: "Ceai", slug: "ceai", description: "Selecție de ceaiuri premium", ingredients: "Ceai verde, negru, sau de fructe", price: 20, weight: "300ml", category: "cafea-ceai", order: 4 },
      { name: "Americano", slug: "americano", description: "Espresso cu apă caldă", ingredients: "Espresso, apă caldă", price: 25, weight: "200ml", category: "cafea-ceai", order: 5 },
      { name: "Frappe", slug: "frappe", description: "Frappe rece cu gheață și frișcă", ingredients: "Cafea, gheață, frișcă, zahăr", price: 40, weight: "300ml", category: "cafea-ceai", order: 6 },
    ];

    for (const p of products) {
      const catId = catMap[p.category];
      if (!catId) {
        console.error(`  Unknown category slug: ${p.category}, skipping ${p.name}`);
        continue;
      }
      const isFeatured = featured.includes(p.slug);
      const isNew = newItems.includes(p.slug);
      await createDoc("products", {
        name: p.name,
        slug: p.slug,
        description: p.description,
        ingredients: p.ingredients,
        price: p.price,
        weight: p.weight,
        category: catId,
        featured: isFeatured,
        new: isNew,
        available: true,
        image: "",
        order: p.order,
        createdAt: now,
        updatedAt: now,
      });
    }
    log("Products", "OK", `${products.length} seeded`);
  }

  // Homepage
  if (await hasDocuments("homepage")) {
    log("Homepage", "SKIP", "already seeded");
  } else {
    await createDoc("homepage", {
      heroTitle: "Sare și Piper",
      heroSubtitle: "O experiență culinară de neuitat",
      heroDescription:
        "Descoperiți arome autentice într-un ambient elegant, unde fiecare preparat este o operă de artă culinară.",
      heroImage: "",
      aboutTitle: "Povestea Noastră",
      aboutDescription:
        "La Sare și Piper, pasiunea pentru gastronomie se împletește cu tradiția și inovația. Fiecare ingredient este atent selecționat, fiecare preparat este gătit cu dedicare, iar fiecare moment petrecut la masa noastră devine o amintire prețioasă.",
      aboutImage: "",
      stats: JSON.stringify([
        { label: "Ani de experiență", value: "10+" },
        { label: "Preparate", value: "500+" },
        { label: "Clienți fericiți", value: "5000+" },
        { label: "Rating", value: "4.9★" },
      ]),
      featuredTitle: "Specialitățile Casei",
      featuredDescription:
        "Descoperiți preparatele noastre signature, create de bucătarii noștri cu ingrediente proaspete și pasiune pentru arta culinară.",
      createdAt: now,
      updatedAt: now,
    });
    log("Homepage", "OK", "seeded");
  }

  // Settings
  if (await hasDocuments("settings")) {
    log("Settings", "SKIP", "already seeded");
  } else {
    await createDoc("settings", {
      restaurantName: "Sare și Piper",
      tagline: "O experiență culinară de neuitat",
      address: "Calea Orheiului 21",
      addressLine2: "Porumbeni",
      city: "Chișinău, Moldova",
      phone: "+37362000612",
      instagram: "@sare_si__piper",
      instagramUrl: "https://instagram.com/sare_si__piper",
      email: "contact@saresipiper.com",
      openingHours: "Luni - Duminică",
      openingHoursDaily: "09:00 - 21:00",
      googleMapsUrl: "https://maps.app.goo.gl/YOUR_ID",
      facebook: "https://facebook.com/saresipiper",
      whatsapp: "+37362000612",
      seoTitle: "Sare și Piper | Restaurant Premium în Porumbeni, Chișinău",
      seoDescription:
        "Descoperiți o experiență culinară de neuitat la Restaurantul Sare și Piper. Preparate premium, ingrediente proaspete și un ambient elegant în inima Chișinăului.",
      seoKeywords:
        "restaurant, sare și piper, porumbeni, chișinău, cină, evenimente, mâncare premium",
    });
    log("Settings", "OK", "seeded");
  }

  // Testimonials
  if (await hasDocuments("testimonials")) {
    log("Testimonials", "SKIP", "already seeded");
  } else {
    const testimonials = [
      {
        name: "Ana Popescu",
        role: "Client fidel",
        content:
          "Am petrecut o seară minunată la Sare și Piper! Mâncarea este excelentă, iar atmosfera este una deosebită. Recomand cu căldură antricotul de vită și papanagii!",
        rating: 5,
        featured: true,
        order: 1,
      },
      {
        name: "Mihai Rusu",
        role: "Gurmand",
        content:
          "Un restaurant de nota 10! Preparatele sunt gătite cu multă pasiune, iar ingredientele sunt proaspete și de calitate. Servirea este impecabilă.",
        rating: 5,
        featured: true,
        order: 2,
      },
      {
        name: "Elena Cebanu",
        role: "Organizator evenimente",
        content:
          "Am organizat o cină de afaceri aici și totul a fost perfect. Personalul este profesionist și atent la detalii. Mâncarea a fost apreciată de toți invitații.",
        rating: 5,
        featured: true,
        order: 3,
      },
      {
        name: "Andrei Bivol",
        role: "Vizitator regulat",
        content:
          "Cel mai bun restaurant din zonă! Pizza este autentică, iar deserturile sunt de vis. Prețurile sunt corecte pentru calitatea oferită.",
        rating: 4,
        featured: false,
        order: 4,
      },
      {
        name: "Maria Turcanu",
        role: "Recenzent culinar",
        content:
          "Am rămas impresionată de varietatea meniului și de modul în care sunt prezentate preparatele. Risotto cu fructe de mare este absolut delicios!",
        rating: 5,
        featured: true,
        order: 5,
      },
    ];
    for (const t of testimonials) {
      await createDoc("testimonials", {
        ...t,
        avatar: "",
        createdAt: now,
        updatedAt: now,
      });
    }
    log("Testimonials", "OK", `${testimonials.length} seeded`);
  }
}

async function main() {
  console.log("========================================");
  console.log("  Sare și Piper - Seed Script");
  console.log("========================================");

  if (!PROJECT_ID || !API_KEY) {
    console.error(
      "Missing required environment variables: NEXT_PUBLIC_APPWRITE_PROJECT_ID and APPWRITE_API_KEY"
    );
    process.exit(1);
  }

  try {
    await ensureDatabase();
    await ensureBucket();
    await setupCollections();
    await seedData();
    console.log("\n========================================");
    console.log("  Seed completed successfully!");
    console.log("========================================\n");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`\nSeed failed: ${msg}`);
    process.exit(1);
  }
}

main();
