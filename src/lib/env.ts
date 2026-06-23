export const env = {
  appwrite: {
    endpoint:
      process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
      "https://cloud.appwrite.io/v1",
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "",
    apiKey: process.env.APPWRITE_API_KEY || "",
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
    storageBucketId:
      process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || "",
  },
  admin: {
    email: process.env.ADMIN_EMAIL || "admin@saresipiper.com",
    password: process.env.ADMIN_PASSWORD || "",
  },
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  },
} as const;
