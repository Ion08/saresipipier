import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env.local") });
config({ path: resolve(__dirname, "../.env") });

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";
const API_KEY = process.env.APPWRITE_API_KEY || "";
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "saresipiper-db";

async function api(method: string, path: string, body?: Record<string, unknown>) {
  const url = `${ENDPOINT}${path}`;
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
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`API ${method} ${path} failed (${res.status}): ${text}`);
  }
  if (!text || text === "") return {};
  return JSON.parse(text);
}

function genId(): string {
  return "doc_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

async function deleteAllDocuments(collectionId: string): Promise<number> {
  let total = 0;
  while (true) {
    const res = await api("GET", `/databases/${DATABASE_ID}/collections/${collectionId}/documents?limit=100`);
    if (!res.documents || res.documents.length === 0) break;
    for (const doc of res.documents) {
      await api("DELETE", `/databases/${DATABASE_ID}/collections/${collectionId}/documents/${doc.$id}`);
      total++;
    }
    await sleep(50);
  }
  return total;
}

function log(msg: string) { console.log(msg); }
function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

const NEW_CATEGORIES = [
  { name: "Pizza", slug: "pizza", description: "", order: 1 },
  { name: "Supe & Salate", slug: "supe-salate", description: "", order: 2 },
  { name: "Gustări", slug: "gustari", description: "", order: 3 },
  { name: "Desert", slug: "desert", description: "", order: 4 },
  { name: "Burgeri & Wrap", slug: "burgeri-wrap", description: "", order: 5 },
];

const NEW_PRODUCTS: Array<{
  name: string; slug: string; description: string; ingredients: string;
  price: number; weight: string; category: string; featured: boolean; new: boolean;
  available: boolean; image: string; order: number;
}> = [
  // Pizza
  { name: "Cezar", slug: "cezar", description: "", ingredients: "Sos roșii, mozzarella, file de pui, iceberg, sos cezar, parmezan, roșii", price: 140, weight: "580 gr", category: "pizza", featured: false, new: false, available: true, image: "", order: 1 },
  { name: "Americana", slug: "americana", description: "", ingredients: "Sos roșii, mozzarella, sos alb, file de pui, salam, cartofi pai", price: 140, weight: "580 gr", category: "pizza", featured: false, new: false, available: true, image: "", order: 2 },
  { name: "Tradițională", slug: "traditionala", description: "", ingredients: "Sos roșii, mozzarella, șuncă, ciuperci, vinete, ardei, brânză de oi", price: 140, weight: "550 gr", category: "pizza", featured: true, new: false, available: true, image: "", order: 3 },
  { name: "Napoletana", slug: "napoletana", description: "", ingredients: "Sos roșii, mozzarella, file de pui, ciuperci, roșii, măsline", price: 140, weight: "580 gr", category: "pizza", featured: false, new: false, available: true, image: "", order: 4 },
  { name: "Margherita", slug: "margherita", description: "", ingredients: "Aluat pizza, sos de roșii, mozzarella, roșii, busuioc", price: 105, weight: "450 gr", category: "pizza", featured: true, new: false, available: true, image: "", order: 5 },
  { name: "Mediterraneană", slug: "mediteraneana", description: "", ingredients: "Aluat pizza, sos roșii, mozzarella, creveți, măsline, parmezan, pătrunjel", price: 145, weight: "550 gr", category: "pizza", featured: true, new: true, available: true, image: "", order: 6 },
  { name: "Pazza", slug: "pazza", description: "", ingredients: "Aluat pizza, sos roșii, mozzarella, cașcaval cu mucegai, bacon, pepperoni, salsiccia, ceapă roșie", price: 145, weight: "530 gr", category: "pizza", featured: false, new: true, available: true, image: "", order: 7 },
  { name: "Delicioasa", slug: "delicioasa", description: "", ingredients: "Aluat pizza, sos roșii, mozzarella, becon, ciuperci, roșii, parmezan", price: 135, weight: "510 gr", category: "pizza", featured: false, new: true, available: true, image: "", order: 8 },
  { name: "Saleami", slug: "saleami", description: "", ingredients: "Aluat pizza, sos roșii, mozzarella, saleami", price: 125, weight: "510 gr", category: "pizza", featured: false, new: true, available: true, image: "", order: 9 },
  { name: "Bianco", slug: "bianco", description: "", ingredients: "Aluat pizza, mozzarella, șuncă, ciuperci, parmezan, busuioc verde", price: 135, weight: "520 gr", category: "pizza", featured: false, new: true, available: true, image: "", order: 10 },
  { name: "Dolce", slug: "dolce", description: "", ingredients: "Aluat pizza, nutella, banane, migdale mărunțite, zahăr pudră", price: 105, weight: "480 gr", category: "pizza", featured: false, new: true, available: true, image: "", order: 11 },
  { name: "Carnivora", slug: "carnivora", description: "", ingredients: "Aluat pizza, sos roșii, mozzarella, bacon, șuncă, salsiccia", price: 135, weight: "550 gr", category: "pizza", featured: false, new: false, available: true, image: "", order: 12 },
  { name: "Tonno", slug: "tonno", description: "", ingredients: "Aluat pizza, sos roșii, mozzarella, ton, ceapă roșie", price: 145, weight: "510 gr", category: "pizza", featured: false, new: false, available: true, image: "", order: 13 },
  { name: "Capriciosa", slug: "capriciosa", description: "", ingredients: "Aluat pizza, sos de roșii, mozzarella, șuncă, salam deosebit, măsline", price: 130, weight: "510 gr", category: "pizza", featured: false, new: false, available: true, image: "", order: 14 },
  { name: "Prosciutto", slug: "prosciutto", description: "", ingredients: "Aluat pizza, sos de roșii, mozzarella, roșii, rucola, prosciutto", price: 145, weight: "510 gr", category: "pizza", featured: true, new: false, available: true, image: "", order: 15 },
  { name: "4 Cașcavaluri", slug: "4-cascavaluri", description: "", ingredients: "Aluat pizza, mozzarella, cașcaval maasdam, cașcaval dorblu, parmezan", price: 135, weight: "510 gr", category: "pizza", featured: false, new: false, available: true, image: "", order: 16 },
  { name: "Carbonara", slug: "carbonara", description: "", ingredients: "Aluat pizza, mozzarella, bacon, parmezan, sos usturoi", price: 130, weight: "500 gr", category: "pizza", featured: false, new: false, available: true, image: "", order: 17 },
  { name: "Mimosa", slug: "mimosa", description: "", ingredients: "Sos alb, șuncă, mozzarella, porumb", price: 130, weight: "500 gr", category: "pizza", featured: false, new: false, available: true, image: "", order: 18 },
  { name: "Boscaila", slug: "boscaila", description: "", ingredients: "Sos alb, salsiccia, mozzarella, ciuperci, oregano", price: 135, weight: "510 gr", category: "pizza", featured: false, new: false, available: true, image: "", order: 19 },
  { name: "Pepperoni", slug: "pepperoni", description: "", ingredients: "Aluat pizza, mozzarella, salam pepperoni, sos de roșii", price: 130, weight: "510 gr", category: "pizza", featured: true, new: false, available: true, image: "", order: 20 },
  { name: "Chicken", slug: "chicken", description: "", ingredients: "Aluat pizza, sos roșii, mozzarella, file de pui copt, ciuperci, ardei dulce", price: 130, weight: "500 gr", category: "pizza", featured: false, new: false, available: true, image: "", order: 21 },

  // Supe & Salate
  { name: "Zeamă de Pui cu Tăiței", slug: "zeama-de-pui-cu-taitei", description: "", ingredients: "Supă tradițională de pui cu tăiței de casă", price: 65, weight: "270 gr", category: "supe-salate", featured: false, new: false, available: true, image: "", order: 1 },
  { name: "Supă de Linte cu Nughete", slug: "supa-de-linte-cu-nughete", description: "", ingredients: "Supă cremă de linte, servită cu nughete de pui", price: 55, weight: "270 gr", category: "supe-salate", featured: false, new: false, available: true, image: "", order: 2 },
  { name: "Caesar Salată", slug: "caesar-salata", description: "", ingredients: "Iceberg, roșii, pui pane, sos Cezar, cașcaval Grana Padano", price: 65, weight: "250 gr", category: "supe-salate", featured: false, new: false, available: true, image: "", order: 3 },
  { name: "Greek Salată", slug: "greek-salata", description: "", ingredients: "Roșii, castraveți proaspeți, ardei california, cașcaval feta, măsline, ceapă roșie, oregano, ulei de măsline", price: 55, weight: "250 gr", category: "supe-salate", featured: false, new: false, available: true, image: "", order: 4 },

  // Gustări
  { name: "Crispy Nuggets", slug: "crispy-nuggets", description: "Extra: + SOS RANCH CU USTUROI", ingredients: "", price: 55, weight: "120/30 gr", category: "gustari", featured: false, new: false, available: true, image: "", order: 1 },
  { name: "Mozzarella Sticks", slug: "mozzarella-sticks", description: "Extra: + SOS MUȘTAR", ingredients: "", price: 67, weight: "100/30 gr", category: "gustari", featured: false, new: false, available: true, image: "", order: 2 },
  { name: "Inelușe Ceapă", slug: "ineluse-ceapa", description: "Extra: + SOS RANCH", ingredients: "", price: 35, weight: "100/30 gr", category: "gustari", featured: false, new: false, available: true, image: "", order: 3 },
  { name: "Cartofi ca acasă", slug: "cartofi-ca-acasa", description: "Extra: + SOS CAȘCAVAL", ingredients: "", price: 35, weight: "100/30 gr", category: "gustari", featured: false, new: false, available: true, image: "", order: 4 },
  { name: "Gogoașe Cartofi", slug: "gogoase-cartofi", description: "Extra: + SOS BLUE CHEESE", ingredients: "", price: 35, weight: "100/30 gr", category: "gustari", featured: false, new: false, available: true, image: "", order: 5 },
  { name: "Cartofi Pai", slug: "cartofi-pai", description: "Extra: + SOS KETCHUP", ingredients: "", price: 35, weight: "120/30 gr", category: "gustari", featured: false, new: false, available: true, image: "", order: 6 },

  // Desert
  { name: "Clătite cu Vișină", slug: "clatite-cu-visina", description: "", ingredients: "Clătite proaspete umplute cu vișine dulci-acrișoare", price: 48, weight: "200 gr", category: "desert", featured: false, new: false, available: true, image: "", order: 1 },
  { name: "Clătite cu Nutella și Banane", slug: "clatite-cu-nutella-si-banane", description: "", ingredients: "Clătite proaspete cu cremă de ciocolată și banane", price: 48, weight: "200 gr", category: "desert", featured: false, new: false, available: true, image: "", order: 2 },

  // Burgeri & Wrap
  { name: "Burger Pui și Ananas", slug: "burger-pui-si-ananas", description: "", ingredients: "Chiflă cu susan, sos Big Mac, file de pui, rucolla, roșii, ceapă caramelizată, castraveți proaspeți, cașcaval Cheddar, ananas grill", price: 75, weight: "310 gr", category: "burgeri-wrap", featured: true, new: false, available: true, image: "", order: 1 },
  { name: "Hamburger", slug: "hamburger", description: "", ingredients: "Chiflă cu susan, carne de vită, salată iceberg, ceapă marinată, roșii, castraveți marinați, sos Big Mac", price: 69, weight: "320 gr", category: "burgeri-wrap", featured: false, new: false, available: true, image: "", order: 2 },
  { name: "Double Hamburger", slug: "double-hamburger", description: "", ingredients: "Chiflă cu susan, carne de vită, salată iceberg, ceapă marinată roșie, roșii, castraveți marinați, sos Big Mac", price: 99, weight: "400 gr", category: "burgeri-wrap", featured: false, new: false, available: true, image: "", order: 3 },
  { name: "Cheeseburger", slug: "cheeseburger", description: "", ingredients: "Chiflă cu susan, carne de vită, salată iceberg, ceapă fri, roșii, castraveți marinați, sos Big Mac, cașcaval Cheddar", price: 79, weight: "320 gr", category: "burgeri-wrap", featured: false, new: false, available: true, image: "", order: 4 },
  { name: "Double Cheeseburger", slug: "double-cheeseburger", description: "", ingredients: "Chiflă cu susan, carne de vită, salată iceberg, ceapă fri, roșii, castraveți marinați, sos Big Mac, cașcaval Cheddar", price: 109, weight: "400 gr", category: "burgeri-wrap", featured: true, new: false, available: true, image: "", order: 5 },
  { name: "Kebab Classic", slug: "kebab-classic", description: "", ingredients: "Lavaş, varză, carne pui, roșii, castraveți marinați, morcov, ceapă roșie, sos special", price: 79, weight: "410 gr", category: "burgeri-wrap", featured: false, new: false, available: true, image: "", order: 6 },
  { name: "Wrap Pui cu Mozzarella", slug: "wrap-pui-cu-mozzarella", description: "", ingredients: "Tortilla, mix legume la grătar, file de pui, porumb, cașcaval mozzarella, iceberg, sos Big Mac, sos Salsa", price: 87, weight: "400 gr", category: "burgeri-wrap", featured: false, new: false, available: true, image: "", order: 7 },
  { name: "Wrap-Kebab Vită", slug: "wrap-kebab-vita", description: "", ingredients: "Tortilla, sos Big Mac, carne de vită, Cheddar, ceapă marinată, cartofi pai, iceberg, roșii", price: 89, weight: "400 gr", category: "burgeri-wrap", featured: false, new: false, available: true, image: "", order: 8 },
  { name: "Wrap Pui Crispy", slug: "wrap-pui-crispy", description: "", ingredients: "Tortilla, sos Big Mac, file de pui pane, castraveți marinați, roșii, iceberg, cartofi pai", price: 80, weight: "400 gr", category: "burgeri-wrap", featured: false, new: false, available: true, image: "", order: 9 },
  { name: "Sandwich Bună Dimineața", slug: "sandwich-buna-dimineata", description: "", ingredients: "Pâine toast, ou scrambled, cașcaval Cheddar, bacon, roșii", price: 47, weight: "200 gr", category: "burgeri-wrap", featured: false, new: false, available: true, image: "", order: 10 },
];

async function main() {
  console.log("========================================");
  console.log("  Sare și Piper — Reseed Menu");
  console.log("========================================\n");

  // 1. Delete all existing products
  log("[1] Deleting old products...");
  try {
    const count = await deleteAllDocuments("products");
    log(`  ✓ Deleted ${count} products`);
  } catch (e) {
    log(`  ! Could not delete products: ${(e as Error).message}`);
  }

  // 2. Delete all existing categories
  log("\n[2] Deleting old categories...");
  try {
    const count = await deleteAllDocuments("categories");
    log(`  ✓ Deleted ${count} categories`);
  } catch (e) {
    log(`  ! Could not delete categories: ${(e as Error).message}`);
  }

  await sleep(500);

  // 3. Create new categories
  log("\n[3] Creating new categories...");
  const categoryIdMap: Record<string, string> = {};
  for (const cat of NEW_CATEGORIES) {
    try {
      const docId = genId();
      const doc = await api("POST", `/databases/${DATABASE_ID}/collections/categories/documents`, {
        documentId: docId,
        data: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          order: cat.order,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
      categoryIdMap[cat.slug] = doc.$id;
      log(`  ✓ ${cat.name} (slug: ${cat.slug})`);
    } catch (e) {
      log(`  ! Failed: ${cat.name} — ${(e as Error).message}`);
    }
    await sleep(150);
  }

  // 4. Create new products
  log("\n[4] Creating new products...");
  let count = 0;
  for (const p of NEW_PRODUCTS) {
    try {
      const docId = genId();
      const catId = categoryIdMap[p.category];
      if (!catId) {
        log(`  ! Skipping ${p.name} — category ${p.category} not found`);
        continue;
      }
      await api("POST", `/databases/${DATABASE_ID}/collections/products/documents`, {
        documentId: docId,
        data: {
          name: p.name,
          slug: p.slug,
          description: p.description,
          ingredients: p.ingredients,
          price: p.price,
          weight: p.weight,
          category: catId,
          featured: p.featured,
          new: p.new,
          available: p.available,
          image: p.image,
          order: p.order,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
      count++;
    } catch (e) {
      log(`  ! Failed: ${p.name} — ${(e as Error).message}`);
    }
    await sleep(100);
  }
  log(`  ✓ Created ${count} products`);

  console.log("\n========================================");
  console.log("  Reseed complete!");
  console.log("========================================");
}

main().catch((e) => {
  console.error("\nReseed failed:", e.message);
  process.exit(1);
});
