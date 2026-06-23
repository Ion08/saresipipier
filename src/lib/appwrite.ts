import { Client, Account, Databases, Storage, ID } from "appwrite";
import { env } from "./env";

let client: Client | null = null;

export function getClient(): Client {
  if (!client) {
    client = new Client()
      .setEndpoint(env.appwrite.endpoint)
      .setProject(env.appwrite.projectId);
  }
  return client;
}

export function getAccount(): Account {
  return new Account(getClient());
}

export function getDatabases(): Databases {
  return new Databases(getClient());
}

export function getStorage(): Storage {
  return new Storage(getClient());
}

export function getAdminHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Project": env.appwrite.projectId,
    "X-Appwrite-Key": env.appwrite.apiKey,
  };
}

async function adminFetch(path: string) {
  const url = `${env.appwrite.endpoint}${path}`;
  const res = await fetch(url, {
    headers: getAdminHeaders(),
    next: { revalidate: 0 },
  });
  if (!res.ok) return null;
  return res.json();
}

/** Fetch all documents from a collection, handling pagination automatically (25 per page). */
export async function adminListDocuments(collectionId: string) {
  const seen = new Set<string>();
  const allDocs: any[] = [];
  let offset = 0;
  const limit = 25;
  let total = Infinity;
  let stalledPages = 0;

  while (allDocs.length < total) {
    const result: any = await adminFetch(
      `/databases/${env.appwrite.databaseId}/collections/${collectionId}/documents?limit=${limit}&offset=${offset}`
    );
    if (!result || !result.documents || result.documents.length === 0) break;

    total = result.total ?? allDocs.length + result.documents.length;

    let newDocs = 0;
    for (const doc of result.documents) {
      if (!seen.has(doc.$id)) {
        seen.add(doc.$id);
        allDocs.push(doc);
        newDocs++;
      }
    }

    // If no new unique docs, we've exhausted the available data
    if (newDocs === 0) {
      stalledPages++;
      if (stalledPages >= 3) break;
    } else {
      stalledPages = 0;
    }
    offset += limit;
  }

  return { documents: allDocs, total: allDocs.length };
}

export async function adminGetDocument(collectionId: string, documentId: string) {
  return adminFetch(
    `/databases/${env.appwrite.databaseId}/collections/${collectionId}/documents/${documentId}`
  );
}

export async function adminCreateDocument(
  collectionId: string,
  data: Record<string, unknown>
) {
  const url = `${env.appwrite.endpoint}/databases/${env.appwrite.databaseId}/collections/${collectionId}/documents`;
  const res = await fetch(url, {
    method: "POST",
    headers: getAdminHeaders(),
    body: JSON.stringify({ documentId: ID.unique(), data }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

export async function adminUpdateDocument(
  collectionId: string,
  documentId: string,
  data: Record<string, unknown>
) {
  const url = `${env.appwrite.endpoint}/databases/${env.appwrite.databaseId}/collections/${collectionId}/documents/${documentId}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: getAdminHeaders(),
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

export async function adminDeleteDocument(collectionId: string, documentId: string) {
  const url = `${env.appwrite.endpoint}/databases/${env.appwrite.databaseId}/collections/${collectionId}/documents/${documentId}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: getAdminHeaders(),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return true;
}

export async function adminUploadFile(file: File) {
  const url = `${env.appwrite.endpoint}/storage/buckets/${env.appwrite.storageBucketId}/files`;
  const formData = new FormData();
  formData.append("fileId", ID.unique());
  formData.append("file", file);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "X-Appwrite-Project": env.appwrite.projectId,
      "X-Appwrite-Key": env.appwrite.apiKey,
    },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

export async function adminDeleteFile(fileId: string) {
  const url = `${env.appwrite.endpoint}/storage/buckets/${env.appwrite.storageBucketId}/files/${fileId}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: getAdminHeaders(),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return true;
}

export { ID };
