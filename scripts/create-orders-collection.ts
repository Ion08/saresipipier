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
  const res = await fetch(url, {
    method,
    headers: {
      "X-Appwrite-Project": PROJECT_ID,
      "X-Appwrite-Key": API_KEY,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`Failed: ${method} ${path} (${res.status}): ${text}`);
    return null;
  }
  return text ? JSON.parse(text) : {};
}

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

async function createAttr(collection: string, type: string, key: string, extra: Record<string, unknown> = {}) {
  await api("POST", `/databases/${DATABASE_ID}/collections/${collection}/attributes/${type}`, { key, ...extra });
  console.log(`  ✓ ${key} (${type})`);
  await sleep(200);
}

async function main() {
  console.log("Creating orders collection...\n");

  const existing = await api("GET", `/databases/${DATABASE_ID}/collections/orders`);
  if (existing && existing.$id) {
    console.log("  → orders collection already exists, skipping creation");
  } else {
    await api("POST", `/databases/${DATABASE_ID}/collections`, {
      collectionId: "orders",
      name: "orders",
      permissions: ['read("any")'],
      documentSecurity: false,
    });
    console.log("  ✓ Collection 'orders' created");
    await sleep(300);

    await createAttr("orders", "string", "customerName", { size: 128, required: true });
    await createAttr("orders", "string", "customerPhone", { size: 32, required: true });
    await createAttr("orders", "string", "customerEmail", { size: 128, required: false });
    await createAttr("orders", "string", "deliveryType", { size: 16, required: true });
    await createAttr("orders", "string", "address", { size: 256, required: false });
    await createAttr("orders", "string", "paymentMethod", { size: 16, required: true });
    await createAttr("orders", "string", "items", { size: 8000, required: true });
    await createAttr("orders", "float", "totalAmount", { required: true });
    await createAttr("orders", "string", "notes", { size: 1000, required: false });
    await createAttr("orders", "string", "status", { size: 32, required: true });
    await createAttr("orders", "string", "createdAt", { size: 64, required: false });
  }

  console.log("\nDone!");
}

main().catch(console.error);
