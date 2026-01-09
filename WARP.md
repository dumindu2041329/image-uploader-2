# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common commands

This project is a Next.js + TypeScript app. `npm` is the primary package manager (a `package-lock.json` is present).

- Install dependencies: `npm install`
- Run the dev server: `npm run dev` (serves on http://localhost:3000 by default)
- Create a production build: `npm run build`
- Run the production server (after `npm run build`): `npm run start`
- Lint the project: `npm run lint`
- Lint a specific file (bypassing the `npm` script): `npx eslint app/(app)/dashboard/page.tsx`

There is currently **no test runner or `test` script** configured in `package.json`. Do not assume `npm test` or a particular test framework exists.

## Architecture overview

### Framework, routing, and layout

- The app uses the **Next.js App Router** (`app/` directory) with multiple **route groups**:
  - `app/(public)/page.tsx` – public marketing/landing page.
  - `app/(auth)/auth/sign-in/page.tsx` and `sign-up/page.tsx` – authentication flows.
  - `app/(app)/dashboard/...` – authenticated app, including the main dashboard, upload, and profile pages.
- `app/layout.tsx` is the root layout. It:
  - Configures SEO/metadata for the whole site.
  - Imports global styles from `app/globals.css`.
  - Wraps the entire tree in `ThemeProvider`, `AuthProvider`, and `ToastProvider`, so **pages/components can assume these contexts exist**.
- `app/(app)/dashboard/layout.tsx` wraps all dashboard routes in:
  - `RequireAuth` – redirects unauthenticated users to the sign-in page with a `next` query param.
  - `DashboardShell` – provides the authenticated shell (sidebar, top bar, user menu, content area).

### State and persistence layers

#### Demo-only authentication (`lib/auth.ts` + `components/auth`)

- `lib/auth.ts` implements a **purely client-side, demo-only auth system** backed by `localStorage`:
  - Users are stored under the `iu_users` key; sessions under `iu_session`.
  - Passwords are SHA‑256 hashed in the browser and stored with the user record.
  - There is no backend, no token issuance, no expiry, and no security hardening; the file explicitly marks this as **NOT for production use**.
- `components/auth/AuthProvider.tsx` is a React context that:
  - Exposes `user`, `session`, `loading`, and methods `signIn`, `signUp`, `signOut`, `updateProfile`, `refresh`.
  - Hydrates initial auth state from `lib/auth` on mount and listens to `storage` events so auth changes in one tab propagate to others.
- `components/auth/RequireAuth.tsx` is a client component that:
  - Reads auth state from `AuthProvider`.
  - While `loading` is true, shows a skeleton screen.
  - If unauthenticated, pushes the user to `/auth/sign-in?next=<current-path>` and renders nothing.
- Auth flows:
  - `app/(auth)/auth/sign-in/page.tsx` and `sign-up/page.tsx` are client forms that call `useAuth()` methods and then navigate (typically to `/dashboard`).
  - Profile editing in `app/(app)/dashboard/profile/page.tsx` calls `updateProfile` to mutate the user object in `localStorage`.

When adding or modifying auth-related behavior, keep in mind this is a **local-only demo system**. If you are asked to build production-grade auth, you will likely need to introduce a proper backend or external auth provider instead of extending `lib/auth.ts`.

#### Image storage (`lib/imageStore.ts` + dashboard pages)

- All image data is stored **locally in the browser** using IndexedDB via the `idb` library.
- `lib/imageStore.ts` encapsulates all IndexedDB logic:
  - Opens/creates the `image-uploader-db` database and an `images` object store with a `by-user` index.
  - Persists `ImageRecord` objects containing `id`, `userId`, `name`, `tags`, `createdAt`, and the image `blob`.
  - Exposes operations: `addImages`, `listImages`, `getImageBlob`, `getImage`, `deleteImage`, `renameImage`, `updateTags`.
- The **image lifecycle** across the dashboard:
  - `app/(app)/dashboard/upload/page.tsx` collects `File[]` via drag-and-drop or file picker and calls `imageStore.addImages(user.id, files)`, then redirects to `/dashboard`.
  - `app/(app)/dashboard/page.tsx`:
    - Uses `imageStore.listImages(user.id)` to get metadata (excluding blobs) and shows the gallery.
    - For each image, `ImageCard` uses `imageStore.getImageBlob(id)` to lazily fetch blobs, create object URLs, and render `<img>` tags.
    - Supports rename and tag editing via `imageStore.renameImage` and `imageStore.updateTags`.
    - Supports deletion via `imageStore.deleteImage`.

All persistence is **per‑browser and per‑device**. There is no server sync; clearing site data or switching browsers will lose images and accounts.

### UI system and styling

- Styling is built on **Tailwind CSS v4** with design tokens defined in `app/globals.css`:
  - CSS variables for `--background`, `--foreground`, `--primary`, etc. are defined for light and dark themes.
  - `@theme inline` exposes these variables as Tailwind design tokens.
  - Utility classes such as `.container`, `.gradient-bg`, `.glass`, and basic enter/exit animations are defined globally and reused across the app.
- Shared UI primitives live in `components/ui/` and wrap Tailwind class names:
  - Buttons (`button.tsx`), cards (`card.tsx`), form controls, layout primitives, etc.
  - `lib/utils.ts` provides `cn`, a Tailwind-aware `clsx`/`tailwind-merge` helper used extensively for conditional class composition.
- Page and layout components (`components/layout/*`) compose these primitives to build the marketing site (`PublicNav`, `Footer`) and the authenticated shell (`DashboardShell`).

### Theming

- `components/theme/ThemeProvider.tsx` manages the global color theme:
  - Supports `light`, `dark`, and `system` themes, storing the preference under `iu_theme` in `localStorage`.
  - Applies the resolved theme by toggling `light`/`dark` classes on `document.documentElement`, which `globals.css` maps into the color variables.
  - Listens for both system `prefers-color-scheme` changes and cross‑tab `storage` events.
- `components/theme/ThemeToggle.tsx` is a small dropdown in the nav/topbar that calls `setTheme("light" | "dark" | "system")`.

Any new UI that depends on theme should rely on Tailwind class names (e.g. `bg-background`, `text-foreground`, `bg-card`) rather than hard-coded colors so it stays consistent with the theme system.

### Notifications

- `components/ui/use-toast.tsx` implements a lightweight toast system:
  - `ToastProvider` holds an array of toasts in React state and renders them via `ToastContainer` in the bottom-right of the viewport.
  - `useToast()` exposes `toast(message, type?)` and `dismiss(id)`; `type` can be `success`, `error`, or `info`.
  - Toasts auto-dismiss after 3 seconds and use the global `.glass` style plus a colored left border based on `type`.
- `ToastProvider` is wired up at the root layout, so any client component can call `useToast()` without adding additional providers.

### Naming and branding notes

- The project is named `image-uploader` in `package.json` and metadata, but several UI components refer to the product as **ImageVault**. Treat the branding as cosmetic; the underlying architecture is an offline‑first, browser‑only image manager regardless of the displayed name.