Below are copy‑pasteable **prompts (page by page)** you can feed to an AI code generator to build a **frontend‑only** image uploader web app in **Next.js (App Router)** with a **rich landing page**, **mock authentication**, **protected dashboard**, and **profile management**, with a **modern sleek responsive UI**.

Note on your version request: I’m not sure what you mean by “Next.js latest version (16.1.1)” because I don’t recognize that exact Next.js version string. These prompts assume **Next.js App Router + React + TypeScript + Tailwind** and will work on current modern Next versions.

---

## Prompt 00 — Project setup and shared foundation

**Prompt to generate:**

Build a Next.js App Router project (TypeScript) with Tailwind CSS. Frontend-only: no backend, no API routes. Create a clean modern design system (light + dark), responsive, with reusable UI components.

**Must include:**
- Tailwind configured with CSS variables for theming (light/dark).
- `app/globals.css` with base styles, container, typography, smooth gradients.
- A small UI kit in `components/ui/*`: `Button`, `Input`, `Label`, `Card`, `Badge`, `Tabs`, `Dialog`, `DropdownMenu`, `Textarea`, `Toast` (or a minimal toast hook).
- Icon set: `lucide-react`.
- Animations: subtle hover/press, skeleton loaders.
- Accessibility: focus states, labels, aria where needed.

**Auth (frontend-only)**
- Implement `lib/auth.ts`:
  - Local “user database” stored in `localStorage` under `iu_users`.
  - Session stored in `localStorage` under `iu_session`.
  - Types: `User { id, email, passwordHash, name, avatarDataUrl?, bio?, createdAt }`
  - Use browser crypto to hash passwords: `crypto.subtle.digest('SHA-256', ...)` → hex string.
  - Functions: `signUp(email, password, name)`, `signIn(email, password)`, `signOut()`, `getSession()`, `getCurrentUser()`, `updateProfile(partial)`.
  - This is not secure; add a comment banner explaining it’s demo-only.
- Implement `components/auth/AuthProvider.tsx` (client component):
  - React context with `user`, `session`, `loading`, and actions (`signIn`, `signUp`, `signOut`, `refresh`).
  - Persist to localStorage and sync across tabs via `storage` event.

**Route protection (frontend-only)**
- Create `components/auth/RequireAuth.tsx` (client):
  - If loading: show dashboard skeleton.
  - If not authenticated: redirect to `/auth/sign-in?next=/dashboard` using `next/navigation`.

**Image storage (frontend-only)**
- Use IndexedDB for images with `idb` (or a small custom wrapper) in `lib/imageStore.ts`:
  - Store: `{ id, userId, name, tags[], createdAt, blob }`
  - Functions: `addImages(userId, files)`, `listImages(userId)`, `deleteImage(id)`, `renameImage(id, name)`, `updateTags(id, tags)`, `getImageBlob(id)`.
- Images must persist across reloads and be per-user.

**App structure**
Use route groups:
- `app/(public)/page.tsx` (landing)
- `app/(auth)/auth/*` (sign-in/up)
- `app/(app)/dashboard/*` (protected)

Also add:
- `components/layout/PublicNav.tsx`, `components/layout/Footer.tsx`
- `components/layout/DashboardShell.tsx` with sidebar + topbar + mobile nav.

Keep UI sleek: glassy cards, subtle borders, gradient hero, responsive spacing.

---

## Prompt 01 — Root layout: `app/layout.tsx`

**Prompt to generate:**

Create `app/layout.tsx` with:
- Global metadata (title template, description, open graph placeholders).
- Import `globals.css`.
- Wrap the app in `AuthProvider`.
- Add a `ThemeProvider` (class-based `dark` toggle) and a `Toaster`.
- Use a clean background (gradient + noise optional) and set `min-h-screen`.

Also create:
- `components/theme/ThemeProvider.tsx` + `ThemeToggle.tsx` (store preference in localStorage, respect system preference).
- Ensure no server-only dependencies; theme toggle is client.

---

## Prompt 02 — Landing page: `app/(public)/page.tsx`

**Prompt to generate:**

Build a rich modern landing page for an “Image Uploader” app (frontend-only). Route: `/`.

**Sections (must include):**
1. **Top nav** (use `PublicNav`):
   - Logo “ImageVault”
   - Links: Features, How it works, Pricing, FAQ
   - Buttons: “Sign in” → `/auth/sign-in`, “Get started” → `/auth/sign-up`
   - Theme toggle
2. **Hero section**:
   - Headline: “Upload, preview, and organize images — instantly.”
   - Subtext explaining it’s private and stored locally (IndexedDB) since no backend.
   - Primary CTA: Get started
   - Secondary CTA: View demo (scroll to dashboard preview section)
   - Include a hero mock UI (a fake uploader card + gallery grid).
3. **Feature grid** (6 cards):
   - Drag & drop upload
   - Local-first storage (IndexedDB)
   - Tags & search
   - Profile customization
   - Responsive gallery
   - Dark mode
4. **How it works** (3 steps with icons)
5. **Testimonials** (3 cards, realistic but clearly sample)
6. **Pricing** (Free / Pro (mock) / Team (mock)) with disclaimer “Billing not implemented”.
7. **FAQ** (accordion)
8. **Final CTA** band
9. **Footer**

**Polish:**
- Smooth scroll to anchors
- Responsive layout with excellent spacing
- Use `next/link`, `lucide-react`, Tailwind, and your UI components.

---

## Prompt 03 — Auth layout: `app/(auth)/auth/layout.tsx`

**Prompt to generate:**

Create an auth-only layout with a split screen:
- Left: brand panel with gradient, feature bullets, small “privacy/local-first” note.
- Right: centered card where auth pages render.
- Top left logo link back to `/`.
- Mobile: single column.

Add subtle background and keep it sleek.

---

## Prompt 04 — Sign in page: `app/(auth)/auth/sign-in/page.tsx`

**Prompt to generate:**

Build `/auth/sign-in` page (client component) with:
- Form fields: Email, Password
- “Remember me” checkbox (controls session expiry in localStorage; e.g., 7 days vs 1 day)
- Submit calls `auth.signIn(email, password)` from AuthContext
- On success redirect:
  - If query param `next` exists → redirect there
  - Else → `/dashboard`
- Provide inline validation and toast errors (invalid credentials, missing fields).
- Link: “Don’t have an account? Sign up” → `/auth/sign-up`

Add a small “Demo-only auth (localStorage)” disclaimer.

---

## Prompt 05 — Sign up page: `app/(auth)/auth/sign-up/page.tsx`

**Prompt to generate:**

Build `/auth/sign-up` (client component) with:
- Fields: Name, Email, Password, Confirm Password
- Password strength hints (simple rules)
- On submit: `auth.signUp(name, email, password)` then redirect to `/dashboard`
- Handle errors: email already used.
- Link back to Sign in.

Keep visuals consistent with sign-in page.

---

## Prompt 06 — Dashboard layout (protected): `app/(app)/dashboard/layout.tsx`

**Prompt to generate:**

Create a protected dashboard layout:
- Wrap children with `RequireAuth`.
- Use `DashboardShell`:
  - Sidebar (desktop): links
    - Overview `/dashboard`
    - Upload `/dashboard/upload`
    - Gallery `/dashboard/gallery`
    - Profile `/dashboard/profile`
    - Settings `/dashboard/settings`
  - Topbar: search input (searches gallery when on gallery page), theme toggle, user dropdown (name + avatar), sign out.
  - Mobile: bottom nav or hamburger drawer.

Add active link highlighting, keyboard accessibility, and good responsive behavior.

---

## Prompt 07 — Dashboard overview: `app/(app)/dashboard/page.tsx`

**Prompt to generate:**

Build dashboard overview page:
- Header: “Welcome back, {name}”
- Stats cards (computed from IndexedDB images for current user):
  - Total images
  - Storage used (sum of blob sizes; display MB)
  - Recent uploads (count last 7 days)
- “Quick actions” buttons:
  - Upload images → `/dashboard/upload`
  - View gallery → `/dashboard/gallery`
  - Edit profile → `/dashboard/profile`
- “Recent uploads” horizontal list (up to 8 thumbnails):
  - Click → opens dialog preview with image, name, tags, created date, download button.
- Loading states while images load from IndexedDB.

---

## Prompt 08 — Upload page: `app/(app)/dashboard/upload/page.tsx`

**Prompt to generate:**

Build `/dashboard/upload` page with a modern drag-and-drop uploader (client component).

**Must have:**
- Dropzone area (drag & drop + click to browse)
- Accept common image types (png, jpg, jpeg, webp, gif)
- Multiple uploads
- For each selected file: show thumbnail preview, file name, size, and an editable “Display name”.
- Optional tags input (comma-separated) applied to all selected images, plus per-image tags editing (nice-to-have).
- Upload button saves into IndexedDB via `lib/imageStore.addImages(userId, files)` with metadata.
- Show progress UI (simulated progress is fine since local save is fast; but don’t fake too aggressively).
- Success toast: “Saved to your local gallery”
- After upload: show “Go to Gallery” CTA.

Also include a “Privacy” info card: “Stored locally in your browser (IndexedDB). Clearing site data removes images.”

---

## Prompt 09 — Gallery page: `app/(app)/dashboard/gallery/page.tsx`

**Prompt to generate:**

Build `/dashboard/gallery` page (client component) that displays all images for the current user from IndexedDB.

**Features:**
- Responsive grid (masonry-like with CSS columns or a neat grid)
- Controls bar:
  - Search by name and tags
  - Sort: Newest, Oldest, Name
  - Filter by tag (derived from existing tags)
- Each image card:
  - Thumbnail
  - Name
  - Tags
  - Created date
  - Actions: Preview, Rename, Edit tags, Download, Delete
- Preview dialog:
  - Larger image
  - Metadata
  - Next/previous navigation within current filtered set
- Empty state with CTA to upload.
- Skeleton loaders while reading from IndexedDB.

Implementation notes:
- Create object URLs from blobs and revoke them on unmount to avoid memory leaks.
- Download action uses blob URL + `<a download>`.

---

## Prompt 10 — Profile management page: `app/(app)/dashboard/profile/page.tsx`

**Prompt to generate:**

Build `/dashboard/profile` page where user can manage profile (frontend-only).

**Must include:**
- Avatar section:
  - Upload avatar image (convert to DataURL and store in user profile via `updateProfile`)
  - Preview circle avatar
  - Remove avatar
- Fields:
  - Name
  - Bio (textarea)
  - Email shown but disabled (or allow change with a warning)
- Save button with toast confirmation.
- “Account” card:
  - Created at date
  - Local-only notice
- “Danger zone”:
  - Sign out
  - Clear local data (profile + images) with a confirmation dialog:
    - Clears `iu_users` entry for this user? (or keep account but wipe images—choose one and implement consistently)
    - Clears IndexedDB images for this user

Make it polished and responsive.

---

## Prompt 11 — Settings page: `app/(app)/dashboard/settings/page.tsx`

**Prompt to generate:**

Build `/dashboard/settings` page with frontend-only preferences:
- Theme: Light / Dark / System
- Gallery density: Comfortable / Compact (stored in localStorage, affects gallery card sizes)
- Default sort: Newest/Oldest/Name
- Export data:
  - Button: “Export metadata JSON” (downloads JSON of image metadata without blobs, or optionally include blobs as a warning)
- About card:
  - App version string (hardcoded)
  - “No backend — local-first demo” note

---

## Prompt 12 — Public nav and footer components

**Prompt to generate:**

Create:
- `components/layout/PublicNav.tsx`
- `components/layout/Footer.tsx`

Requirements:
- PublicNav supports anchor links on landing page and auth/dashboard links.
- If user is authenticated, show “Go to dashboard” instead of “Sign in”.
- Footer includes links, social placeholders, and a clear disclaimer about local-only storage.

---

## Prompt 13 — Dashboard shell components

**Prompt to generate:**

Create `components/layout/DashboardShell.tsx` with:
- Sidebar + Topbar + content area layout
- User dropdown menu:
  - Profile
  - Settings
  - Sign out
- Mobile behavior:
  - Collapsible sidebar or drawer
- Uses Tailwind and the UI kit components
- Active route highlighting using `usePathname()`

---

## Prompt 14 — Image components

**Prompt to generate:**

Create reusable image features:
- `components/images/DropzoneUploader.tsx` used by upload page
- `components/images/ImageCard.tsx`
- `components/images/ImagePreviewDialog.tsx`

Quality requirements:
- Memory-safe object URL usage (revoke URLs).
- Keyboard accessible dialogs and menus.
- Good empty / loading states.

---

### If you want, I can also output a **single “mega prompt”** that forces an AI codegen tool to generate the *entire repo* in one go (still page-by-page structure internally).