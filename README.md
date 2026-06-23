# Sare și Piper - Restaurant Premium Website

Site oficial pentru restaurantul premium **Sare și Piper**, situat în Porumbeni, Chișinău. O experiență culinară de neuitat, construită cu Next.js și Appwrite.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Backend:** Appwrite (Database, Storage, Auth)
- **Forms:** React Hook Form + Zod
- **HTTP Client:** @tanstack/react-query
- **Notifications:** react-hot-toast

## Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, pnpm, or bun
- Appwrite instance (cloud or self-hosted)

### Installation

```bash
git clone <repository-url>
cd saresipipier
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```env
# Appwrite
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key

# Appwrite Collections
NEXT_PUBLIC_APPWRITE_MENU_DB_ID=your_menu_db_id
NEXT_PUBLIC_APPWRITE_MENU_COLLECTION_ID=your_menu_collection_id
NEXT_PUBLIC_APPWRITE_GALLERY_DB_ID=your_gallery_db_id
NEXT_PUBLIC_APPWRITE_GALLERY_COLLECTION_ID=your_gallery_collection_id
NEXT_PUBLIC_APPWRITE_RESERVATIONS_DB_ID=your_reservations_db_id
NEXT_PUBLIC_APPWRITE_RESERVATIONS_COLLECTION_ID=your_reservations_collection_id
NEXT_PUBLIC_APPWRITE_CONTACT_DB_ID=your_contact_db_id
NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID=your_contact_collection_id

# Storage Buckets
NEXT_PUBLIC_APPWRITE_MENU_IMAGES_BUCKET=your_menu_images_bucket_id
NEXT_PUBLIC_APPWRITE_GALLERY_BUCKET=your_gallery_bucket_id

# Site
NEXT_PUBLIC_SITE_URL=https://saresipiper.com
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Appwrite Setup

### 1. Create a Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io) and create a new project
2. Note the **Project ID** for `NEXT_PUBLIC_APPWRITE_PROJECT_ID`

### 2. Create Databases and Collections

Create the following databases and collections with these attributes:

#### Menu Database (`menu_db`)

**Collection: `menu_items`**

| Attribute      | Type     | Required |
| -------------- | -------- | -------- |
| `name`         | string   | Yes      |
| `description`  | string   | Yes      |
| `price`        | double   | Yes      |
| `category`     | string   | Yes      |
| `image`        | string   | No       |
| `featured`     | boolean  | No       |
| `order`        | integer  | No       |

#### Gallery Database (`gallery_db`)

**Collection: `gallery_items`**

| Attribute      | Type     | Required |
| -------------- | -------- | -------- |
| `title`        | string   | No       |
| `description`  | string   | No       |
| `image`        | string   | Yes      |
| `category`     | string   | No       |
| `featured`     | boolean  | No       |

#### Reservations Database (`reservations_db`)

**Collection: `reservations`**

| Attribute      | Type     | Required |
| -------------- | -------- | -------- |
| `name`         | string   | Yes      |
| `email`        | string   | Yes      |
| `phone`        | string   | Yes      |
| `date`         | datetime | Yes      |
| `time`         | string   | Yes      |
| `guests`       | integer  | Yes      |
| `message`      | string   | No       |
| `status`       | string   | No       |
| `created_at`   | datetime | No       |

#### Contact Database (`contact_db`)

**Collection: `contact_messages`**

| Attribute      | Type     | Required |
| -------------- | -------- | -------- |
| `name`         | string   | Yes      |
| `email`        | string   | Yes      |
| `phone`        | string   | No       |
| `subject`      | string   | Yes      |
| `message`      | string   | Yes      |
| `read`         | boolean  | No       |
| `created_at`   | datetime | No       |

### 3. Create Storage Buckets

Create two storage buckets for images:

1. **Menu Images** — for dish photos
2. **Gallery** — for gallery photos

Set appropriate permissions (read: anyone, write: admin only).

### 4. Create an API Key

Generate an API key in Appwrite console with the following scopes:
- `documents.read`
- `documents.write`
- `files.read`
- `files.write`
- `users.read`

### 5. Set up Security Rules

- Enable email/password authentication for admin panel
- Configure CORS origins to include your domain

## Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run start`   | Start production server  |
| `npm run lint`    | Run ESLint               |

## Project Structure

```
saresipipier/
├── public/              # Static assets
├── src/
│   ├── app/             # App Router pages & API routes
│   │   ├── about/
│   │   ├── admin/
│   │   ├── contact/
│   │   ├── gallery/
│   │   ├── menu/
│   │   ├── reservation/
│   │   ├── privacy/
│   │   ├── terms/
│   │   ├── error/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── not-found.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── manifest.ts
│   ├── components/      # Reusable components
│   │   ├── layout/      # Header, Footer, PageLayout
│   │   ├── sections/    # Hero, FeaturedDishes, etc.
│   │   ├── ui/          # Button, Section, Input, etc.
│   │   └── admin/       # Admin-specific components
│   ├── lib/             # Utilities, config, Appwrite client
│   ├── hooks/           # Custom hooks
│   └── styles/          # Global styles
├── .env.example         # Environment variables template
├── next.config.ts       # Next.js configuration
├── tailwind.config.ts   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## Features

- Responsive design with premium aesthetics
- Interactive menu with categories
- Photo gallery with lightbox
- Online reservation system
- Contact form with validation
- Admin dashboard for content management
- SEO optimized with sitemap, robots.txt, and manifest
- Romanian language interface
- Animations with Framer Motion
- Appwrite backend integration

## Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com/new)
3. Add all environment variables from `.env.local`
4. Deploy

The easiest way to deploy is via the [Vercel Platform](https://vercel.com/new).

## Screenshots

<!-- Add screenshots here -->

## License

All rights reserved. &copy; 2026 Sare și Piper.
