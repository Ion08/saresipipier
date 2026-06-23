import "dotenv/config";

const APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1";
const PROJECT_ID = "6a37bf04003b662d3bc6";
const API_KEY =
  "standard_0ac68200622fe29f3e1134a22a0f663ef3f100bf7fc227d6abe99683faf5ab1eeba7310811ccaeaf3b690034e735526c63bd633e8537618f853a9c01fea24d50720b190d1534ac58b68f1c610e685ccde00803e9fd14d0db1d1634128e74e1605c7b3475007a6249e5becf112a4a2e5fd227bb0af22c77db8161e5041b4c6fbe";
const DATABASE_ID = "saresipiper-db";
const COLLECTION_ID = "gallery";

const galleryItems = [
  {
    title: "Pizza Margherita",
    description: "Clasica eternă",
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    featured: true,
    order: 1,
  },
  {
    title: "Felie de pizza",
    description: "Crocantă și proaspătă",
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    featured: true,
    order: 2,
  },
  {
    title: "Pizza la cuptor",
    description: "Coaptă în cuptorul nostru cu lemne",
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
    featured: true,
    order: 3,
  },
  {
    title: "Pizza artizanală",
    description: "Preparată cu ingrediente proaspete",
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&q=80",
    featured: false,
    order: 4,
  },
  {
    title: "Pizza prosciutto",
    description: "Cu șuncă și mozzarella",
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
    featured: false,
    order: 5,
  },
  {
    title: "Pizza pepperoni",
    description: "Pentru iubitorii de picant",
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=800&q=80",
    featured: false,
    order: 6,
  },
  {
    title: "Pizza quattro stagioni",
    description: "Patru arome într-una",
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80",
    featured: true,
    order: 7,
  },
  {
    title: "Burger clasic",
    description: "Juicy și proaspăt",
    category: "Burgeri",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    featured: false,
    order: 8,
  },
  {
    title: "Burger cu brânză",
    description: "Cu cheddar topit",
    category: "Burgeri",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
    featured: false,
    order: 9,
  },
  {
    title: "Salată grecească",
    description: "Proaspătă și sănătoasă",
    category: "Salate",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&q=80",
    featured: false,
    order: 10,
  },
  {
    title: "Salată cu pui",
    description: "Cu grilled chicken",
    category: "Salate",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
    featured: false,
    order: 11,
  },
  {
    title: "Supă de casă",
    description: "Ca la mama acasă",
    category: "Supe",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    featured: false,
    order: 12,
  },
  {
    title: "Nuggets pane",
    description: "Crocante și aurii",
    category: "Gustări",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&q=80",
    featured: false,
    order: 13,
  },
  {
    title: "Cartofi pai",
    description: "Prăjiți perfect",
    category: "Gustări",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80",
    featured: false,
    order: 14,
  },
  {
    title: "Sandwich club",
    description: "Pentru o pauză rapidă",
    category: "Gustări",
    image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=800&q=80",
    featured: false,
    order: 15,
  },
  {
    title: "Clătite",
    description: "Cu sirop de arțar",
    category: "Desert",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
    featured: true,
    order: 16,
  },
  {
    title: "Mâncare proaspătă",
    description: "Ingrediente de calitate",
    category: "Food",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
    featured: false,
    order: 17,
  },
  {
    title: "Somon la grătar",
    description: "Cu legume proaspete",
    category: "Food",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
    featured: false,
    order: 18,
  },
  {
    title: "Sushi platou",
    description: "Pentru ocazii speciale",
    category: "Food",
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80",
    featured: false,
    order: 19,
  },
  {
    title: "Interior restaurant",
    description: "Ambiance cozy și primitoare",
    category: "Interior",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    featured: true,
    order: 20,
  },
  {
    title: "Preparate fine",
    description: "Gătite cu pasiune",
    category: "Food",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
    featured: false,
    order: 21,
  },
];

async function createDocument(collectionId: string, data: Record<string, unknown>) {
  const res = await fetch(
    `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/documents`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": PROJECT_ID,
        "X-Appwrite-Key": API_KEY,
      },
      body: JSON.stringify({
        documentId: "unique()",
        data,
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error(`  Failed to create: ${text}`);
    return null;
  }

  return res.json();
}

async function deleteAllDocuments() {
  console.log("Fetching existing gallery documents...");
  const res = await fetch(
    `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents`,
    {
      headers: {
        "X-Appwrite-Project": PROJECT_ID,
        "X-Appwrite-Key": API_KEY,
      },
    }
  );

  if (!res.ok) return;

  const data = await res.json();
  const docs = data.documents || [];
  for (const doc of docs) {
    await fetch(
      `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents/${doc.$id}`,
      { method: "DELETE", headers: { "X-Appwrite-Project": PROJECT_ID, "X-Appwrite-Key": API_KEY } }
    );
  }
  console.log(`Deleted ${docs.length} existing gallery items`);
}

async function seed() {
  console.log("Seeding gallery collection...\n");

  await deleteAllDocuments();

  for (let i = 0; i < galleryItems.length; i++) {
    const item = galleryItems[i];
    console.log(`[${i + 1}/${galleryItems.length}] ${item.title}...`);
    await createDocument(COLLECTION_ID, {
      title: item.title,
      description: item.description ?? "",
      category: item.category ?? "",
      image: item.image,
      featured: item.featured,
      order: item.order,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  console.log(`\nDone! Gallery seeded with ${galleryItems.length} images.`);
}

seed().catch(console.error);
