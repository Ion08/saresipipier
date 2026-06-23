# IDENTIFIED: UI Schemas That Won't Bring Customers or Money

## Source file: `src/lib/schemas.ts` (9 Zod schemas, 121 lines)

---

## WILL NOT BRING CUSTOMERS OR MONEY

### 1. `reservationSchema` — Active customer-facing lie

**Status: WILL NOT bring customers or money.**

- **What it is:** 14-line Zod schema (lines 5–17) with 7 fields: name, phone, email, guests, date, time, specialRequests
- **Where it's used:** NOWHERE. Zero customer-facing UI exists.
- **Evidence it fails:**
  - `glob "src/app/reservation/**"` → 0 files. No reservation page exists.
  - `grep "createReservation"` across all .tsx/.ts → only the definition in actions.ts. Zero call sites.
  - No .tsx file in `src/app/` (outside admin) contains "reservation"
  - **Yet the sitemap promises `/reservation`** (sitemap.ts line 10)
  - **And JSON-LD claims `acceptsReservations: true`** (layout.tsx line 102)
- **Why it won't bring customers:** It's a broken promise. Search engines index `/reservation` from the sitemap, users click it and get a 404. Google sees `acceptsReservations: true` in structured data but the mechanism doesn't exist. This is worse than useless — it damages trust and wastes SEO capital.

---

### 2. `testimonialSchema` — Social proof that nobody sees

**Status: WILL NOT bring customers or money.**

- **What it is:** 10-line Zod schema (lines 69–78) with 7 fields: name, role, content, rating, avatar, featured, order
- **Where it's used:** Admin CRUD only. Never rendered for customers.
- **Evidence it fails:**
  - `grep 'from "@/components/sections/testimonials"'` → 0 matches. The 102-line rendering component is never imported anywhere.
  - `grep 'getTestimonials'` in `src/app/` → 0 matches. No page fetches testimonial data for display.
  - Admin can enter testimonials, they get stored in Appwrite, but the component that would show them is dead code.
- **Why it won't bring customers:** Testimonials are one of the highest-conversion trust signals for restaurants (social proof drives purchase decisions). This full pipeline — schema + DB collection + admin CRUD + 102-line animation component — was built to display reviews and delivers them to exactly zero customers.

---

### 3. `gallerySchema` — Preview component never invoked

**Status: WILL NOT bring customers or money.**

- **What it is:** 8-line Zod schema (lines 61–68) with 6 fields
- **Where it's used:** Admin CRUD for gallery items. The `/gallery` page exists (separate) but the `gallery-preview.tsx` homepage section is dead.
- **Evidence it fails:**
  - `grep 'from "@/components/sections/gallery-preview"'` → 0 matches. The 83-line homepage gallery preview component is never imported.
  - `grep 'getGalleryItems'` in `src/app/page.tsx` → not present. Homepage doesn't fetch gallery data either.
- **Why it won't bring customers:** Food photography drives appetite, and a gallery preview on the homepage is a proven engagement tactic. The component is built (with grid layout, image zoom, CTA to full gallery) but zero homepage visitors ever see it.

---

### 4. `homepageSchema` — Admin-only content manager

**Status: WILL NOT bring customers or money.**

- **What it is:** 12-line Zod schema (lines 86–98) with 9 fields for hero/about/featured text
- **Where it's used:** Only in `src/app/admin/homepage/page.tsx`. The *output* (heroTitle, etc.) renders on the homepage, but the schema itself is purely admin infrastructure.
- **Evidence it fails:**
  - `grep 'homepageSchema'` → only in schemas.ts, actions.ts, and admin/homepage/page.tsx
- **Why it won't bring customers:** It's an admin validation tool. It manages content that the homepage displays, but the schema itself doesn't convert anyone.

---

### 5. `settingsSchema` — SEO fields stored but never rendered

**Status: WILL NOT bring customers or money.**

- **What it is:** 17-line Zod schema (lines 106–122) with 19 fields: business info (address, phone, hours), social links (instagram, facebook, whatsapp), SEO fields (seoTitle, seoDescription, seoKeywords)
- **Where it's used:** Admin settings page only.
- **Evidence it fails:**
  - `grep 'getPublicSettings'` → only the definition in actions.ts. **Never called from any page.**
  - The 3 SEO fields (seoTitle, seoDescription, seoKeywords) are editable in admin but the frontend `<head>` metadata is hardcoded in layout.tsx lines 20–80. These fields are stored in Appwrite but never reach the HTML head.
  - Business info fields (phone, address, hours) display in Footer via hardcoded values, not from settings.
- **Why it won't bring customers:** The SEO fields are the only ones that *could* drive discovery, but they're dead data — editable but never output. The business info fields are operational necessities that don't independently generate revenue.

---

### 6. `loginSchema` — Admin auth, zero customer value

**Status: WILL NOT bring customers or money.**

- **What it is:** 4-line Zod schema (lines 24–27) with email + password
- **Where it's used:** Admin login page
- **Why it won't bring customers:** Authentication is necessary for admin operations. Zero customer-facing value.

---

## WILL BRING CUSTOMERS OR MONEY

### 1. `contactSchema` — Lead generation

**Status: WILL bring customers or money.**

- **What it is:** Lines 20–28 in schemas.ts
- **Where it's used:** `/contact` page. Imported in contact/page.tsx line 15, validated with zodResolver line 29, `submitContact` called on form submit line 35.
- **Why it brings customers:** It's a functioning lead generation form. Customers use it to ask about events, catering, group orders — all revenue sources.

### 2. `productSchema` — Menu data → orders

**Status: WILL bring customers or money.**

- **What it is:** Lines 37–52 in schemas.ts
- **Where it's used:** Admin product CRUD. The data feeds `/menu` page where customers browse, get hungry, and add to cart.
- **Why it brings customers:** The menu is the core conversion funnel. Product data drives purchase decisions.

### 3. `categorySchema` — Menu organization

**Status: WILL bring customers or money.**

- **What it is:** Lines 54–61 in schemas.ts
- **Where it's used:** Admin category CRUD + MenuCategories section on homepage.
- **Why it brings customers:** Category organization helps customers navigate the menu and find what they want — directly supports browsing → ordering.

---

## Unused Section Components (Adds to Dead-Schema-Waste)

These components exist but are never imported by any page. They back the schemas above:

| Component | Lines | Backs Schema | Never Imported (grep) |
|---|---|---|---|
| `src/components/sections/testimonials.tsx` | 102 | testimonialSchema | 0 matches |
| `src/components/sections/gallery-preview.tsx` | 83 | gallerySchema | 0 matches |
| `src/components/sections/why-choose-us.tsx` | 110 | — | 0 matches |
| `src/components/sections/instagram-section.tsx` | 73 | — | 0 matches |

**Total dead code: 368 lines of section components + supporting schemas + DB collections + server actions.**

---

## Summary Verdict

| Schema | Brings customers/money? | Why not? |
|---|---|---|
| `reservationSchema` | **NO** | Zero UI. Sitemap + JSON-LD promise reservations that don't exist. |
| `testimonialSchema` | **NO** | Full pipeline built. Zero customers see testimonials. |
| `gallerySchema` | **NO** | Preview component exists but is never imported. |
| `homepageSchema` | **NO** | Admin-only. Doesn't independently drive customers. |
| `settingsSchema` | **NO** | SEO fields stored dead. getPublicSettings never called. |
| `loginSchema` | **NO** | Admin auth. Operational only. |
| `contactSchema` | **YES** | Powers live contact form. Lead generation. |
| `productSchema` | **YES** | Menu data drives the purchase funnel. |
| `categorySchema` | **YES** | Menu navigation supports browsing. |
