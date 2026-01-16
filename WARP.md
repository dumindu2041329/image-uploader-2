# ImageUploader - Codebase Documentation for WARP

This file provides comprehensive guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

ImageUploader (branded as **ImageVault** in UI) is a **frontend-only**, **local-first** image management web application built with Next.js 16.1.1, React 19, TypeScript, and Tailwind CSS v4. All data persists in the browser using IndexedDB for images and localStorage for user credentials—there is no backend, no API routes, and no server-side processing.

**Key characteristics:**
- Modern Next.js App Router with route groups
- Client-side only authentication (demo/educational purposes)
- IndexedDB-based image storage with full CRUD operations
- Rich landing page with Three.js 3D visualization
- Complete dashboard with upload, gallery, profile, and settings
- Dark/light theme system with system preference support
- Glassmorphism UI with responsive design
- Accessibility-first with keyboard navigation and ARIA labels

## Common Commands

This project uses `npm` as the package manager (a `package-lock.json` is present).

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Create production build
npm run build

# Run production server (after build)
npm run start

# Lint the project
npm run lint

# Lint specific file
npx eslint app/(app)/dashboard/page.tsx
```

**Note:** There is currently **no test runner or test script** configured. Do not assume `npm test` exists.

## Technology Stack

### Core
- **Next.js**: 16.1.1 (App Router)
- **React**: 19.2.3
- **TypeScript**: 5.x (strict mode)
- **Node**: 20+

### Styling & UI
- **Tailwind CSS**: 4.x with PostCSS
- **Icons**: lucide-react (0.562.0)
- **Utilities**: class-variance-authority (0.7.1), clsx (2.1.1), tailwind-merge (3.4.0)

### 3D Graphics (Landing Page)
- **Three.js**: 0.182.0
- **React Three Fiber**: 9.5.0  
- **React Three Drei**: 10.7.7

### Storage
- **IndexedDB**: via `idb` library (8.0.3)
- **localStorage**: For user auth and preferences

### Development
- **ESLint**: 9 with Next.js config
- **TypeScript**: Strict mode, path aliases (`@/*`)

## Project Structure

```
image-uploader-2/
├── app/                          # Next.js App Router
│   ├── (public)/                # Public routes
│   │   └── page.tsx            # Landing page with 3D hero
│   ├── (auth)/                 # Auth routes
│   │   └── auth/
│   │       ├── layout.tsx      # Split-screen auth layout
│   │       ├── sign-in/page.tsx
│   │       └── sign-up/page.tsx
│   ├── (app)/                  # Protected dashboard routes
│   │   └── dashboard/
│   │       ├── layout.tsx      # RequireAuth + DashboardShell
│   │       ├── page.tsx        # Dashboard overview with stats
│   │       ├── upload/page.tsx # Drag-and-drop image uploader
│   │       ├── gallery/page.tsx # Gallery with search/filter/sort
│   │       ├── profile/page.tsx # User profile management
│   │       └── settings/page.tsx # App settings
│   ├── layout.tsx              # Root layout with providers
│   └── globals.css             # Global styles & CSS variables
│
├── components/
│   ├── auth/                   # Authentication
│   │   ├── AuthProvider.tsx   # Auth context & state
│   │   └── RequireAuth.tsx    # Route protection wrapper
│   ├── images/                 # Image components
│   │   ├── DropzoneUploader.tsx
│   │   ├── ImageCard.tsx
│   │   ├── ImagePreviewDialog.tsx
│   │   └── index.ts
│   ├── landing/                # Landing page components
│   │   ├── HeroThreeScene.tsx # Three.js 3D scene
│   │   └── HeroVisual.tsx
│   ├── layout/                 # Layout components
│   │   ├── DashboardShell.tsx # Dashboard layout (sidebar + topbar)
│   │   ├── PublicNav.tsx      # Public navigation
│   │   └── Footer.tsx
│   ├── theme/                  # Theme management
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeToggle.tsx
│   └── ui/                     # Reusable UI components
│       ├── accordion.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── skeleton.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       └── use-toast.tsx
│
├── lib/                        # Utility libraries
│   ├── auth.ts                # Client-side auth (demo only)
│   ├── imageStore.ts          # IndexedDB wrapper
│   ├── settings.ts            # User settings management
│   └── utils.ts               # Utilities (cn, etc.)
│
├── public/                     # Static assets
├── next.config.ts             # Next.js config
├── tsconfig.json              # TypeScript config
├── tailwind.config.js         # Tailwind config
├── postcss.config.mjs         # PostCSS config
├── eslint.config.mjs          # ESLint config
└── package.json               # Dependencies
```

## Architecture Overview

### Framework, Routing, and Layout

#### Route Groups
The app uses **Next.js App Router** with three route groups:

1. **`app/(public)/`** - Public marketing/landing page
   - `page.tsx`: Rich landing with hero, features, FAQ, pricing, testimonials

2. **`app/(auth)/auth/`** - Authentication flows
   - `layout.tsx`: Split-screen layout (brand panel + auth form)
   - `sign-in/page.tsx`: Login form with email/password
   - `sign-up/page.tsx`: Registration form with validation

3. **`app/(app)/dashboard/`** - Protected dashboard (requires auth)
   - `layout.tsx`: Wraps routes with `RequireAuth` + `DashboardShell`
   - `page.tsx`: Dashboard overview with stats and recent uploads
   - `upload/page.tsx`: Drag-and-drop image uploader
   - `gallery/page.tsx`: Image gallery with search, filter, sort
   - `profile/page.tsx`: User profile and avatar management
   - `settings/page.tsx`: App preferences (theme, density, etc.)

#### Root Layout (`app/layout.tsx`)
- Configures global SEO metadata and Open Graph tags
- Imports `globals.css` for theme and global styles
- Wraps app in three providers (available to all components):
  - `ThemeProvider`: Light/dark/system theme management
  - `AuthProvider`: User authentication state
  - `ToastProvider`: Toast notification system
- Renders animated glassmorphism background with gradient orbs

#### Dashboard Layout (`app/(app)/dashboard/layout.tsx`)
- Wraps all dashboard routes with:
  - `RequireAuth`: Redirects to `/auth/sign-in?next={path}` if not authenticated
  - `DashboardShell`: Provides sidebar navigation, topbar, search, user menu

### State and Persistence Layers

#### Demo-Only Authentication (`lib/auth.ts` + `components/auth/`)

**⚠️ CRITICAL: This is a client-side only, insecure authentication system for demo/educational purposes. DO NOT use in production.**

##### Storage Keys
- `iu_users`: Array of user objects in localStorage
- `iu_session`: Current session object with userId and expiry

##### User Model
```typescript
interface User {
  id: string;              // UUID
  email: string;
  passwordHash: string;    // SHA-256 hash (client-side)
  name: string;
  avatarDataUrl?: string;  // Base64 encoded image
  bio?: string;
  createdAt: string;       // ISO 8601
}
```

##### Session Model
```typescript
interface Session {
  userId: string;
  createdAt: string;
  expiresAt: string;  // 1 day default, 7 days with rememberMe
}
```

##### API Functions (lib/auth.ts)
- `signUp(email, password, name)` → Creates user, returns session
- `signIn(email, password, rememberMe)` → Validates credentials, creates session
- `signOut()` → Clears session from localStorage
- `getSession()` → Returns current session (checks expiry)
- `getCurrentUser()` → Returns public user data (no password)
- `updateProfile(updates)` → Updates user fields (name, bio, avatar, email)

##### Password Hashing
Uses Web Crypto API's SHA-256:
```typescript
const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
```
**Security note:** Client-side hashing provides no security—passwords are visible in dev tools.

##### AuthProvider (`components/auth/AuthProvider.tsx`)
React Context that:
- Exposes: `{ user, session, loading, signIn, signUp, signOut, updateProfile, refresh }`
- Hydrates auth state from localStorage on mount
- Listens to `storage` events for cross-tab synchronization
- All client components can use `const { user } = useAuth()`

##### RequireAuth (`components/auth/RequireAuth.tsx`)
Route protection wrapper:
```typescript
if (loading) return <Skeleton />          // While checking auth
if (!user) redirect('/auth/sign-in?next={currentPath}')
return children                            // Render protected content
```

##### Auth Flow Example
1. User visits `/dashboard` → `RequireAuth` checks session
2. If no session → redirect to `/auth/sign-in?next=/dashboard`
3. User signs in → `signIn()` creates session in localStorage
4. Redirect to `next` param (or `/dashboard` if not set)
5. `AuthProvider` updates context → app re-renders with user data

**When to use:**
- For demos, prototypes, local development
- Educational purposes to understand auth flows

**When NOT to use:**
- Production applications
- Apps handling sensitive data
- Multi-device sync requirements

**For production auth, consider:**
- Server-side authentication (Next.js API routes + database)
- Third-party providers (Auth0, Clerk, Firebase Auth, Supabase)
- Secure session management with HTTP-only cookies
- OAuth 2.0 / OpenID Connect

#### Image Storage (`lib/imageStore.ts` + Dashboard Pages)

All images are stored **locally in the browser** using IndexedDB via the `idb` library.

##### Database Schema
- **Database name**: `image-uploader-db`
- **Version**: 1
- **Object Store**: `images`
  - **Key path**: `id`
  - **Index**: `by-user` on `userId` (for filtering)

##### ImageRecord Model
```typescript
interface ImageRecord {
  id: string;        // UUID
  userId: string;    // Foreign key to User.id
  name: string;      // Display name (editable)
  tags: string[];    // User-defined tags
  createdAt: string; // ISO 8601 timestamp
  blob: Blob;        // Raw image data
}
```

##### API Functions (lib/imageStore.ts)

**Write Operations:**
- `addImages(userId, files, metadata?)` → Bulk upload, returns ImageRecord[]
- `renameImage(id, name)` → Update display name
- `updateTags(id, tags)` → Replace tags array
- `deleteImage(id)` → Remove image
- `clearUserImages(userId)` → Delete all images for user

**Read Operations:**
- `listImages(userId)` → Get all metadata (no blobs for performance)
- `getImage(id)` → Get single complete record with blob
- `getImageBlob(id)` → Get blob only
- `getImagesWithBlobs(userId)` → Get all records with blobs
- `getImagesWithStats(userId)` → Get images + computed stats:
  ```typescript
  {
    images: ImageWithSize[],
    totalSize: number,      // Sum of blob sizes
    totalCount: number,
    recentCount: number     // Last 7 days
  }
  ```

##### Image Lifecycle Across Dashboard

**Upload Flow** (`app/(app)/dashboard/upload/page.tsx`):
1. User drags/drops files or clicks to browse
2. Files validated (type: png/jpg/jpeg/webp/gif)
3. Thumbnail previews generated via FileReader
4. User can edit display names and add tags
5. Click "Upload" → `imageStore.addImages(user.id, files, metadata)`
6. Records saved to IndexedDB
7. Success toast → Redirect to `/dashboard/gallery`

**Dashboard Overview** (`app/(app)/dashboard/page.tsx`):
1. On mount: `getImagesWithStats(user.id)`
2. Display stats cards: Total images, storage used, recent uploads
3. Show up to 8 most recent images as thumbnails
4. Click thumbnail → Preview dialog with full image and metadata

**Gallery View** (`app/(app)/dashboard/gallery/page.tsx`):
1. On mount: `getImagesWithBlobs(user.id)`
2. Convert blobs to Object URLs: `URL.createObjectURL(blob)`
3. Render responsive grid with ImageCard components
4. Features:
   - Search: Filter by name or tags
   - Sort: Newest, Oldest, Name (A-Z)
   - Filter: By specific tag
   - Density: Comfortable or Compact view
5. Actions per image:
   - Preview: Full-size dialog with next/previous navigation
   - Rename: Dialog with input → `renameImage()`
   - Edit tags: Dialog with comma-separated input → `updateTags()`
   - Download: Create temp `<a>` element with blob URL
   - Delete: Confirmation dialog → `deleteImage()`
6. On unmount: `URL.revokeObjectURL(url)` for cleanup (prevent memory leaks)

**Profile Page** (`app/(app)/dashboard/profile/page.tsx`):
- Avatar upload: Convert File to DataURL → `updateProfile({ avatarDataUrl })`
- Profile fields: name, bio, email
- Danger zone: Clear all images with confirmation

##### Storage Limits
- **IndexedDB**: Typically 50MB+ (varies by browser), can request more
- **localStorage**: ~5-10MB total (shared by auth + settings)
- **No cloud sync**: Data is per-browser, per-device
- **Data loss scenarios**: Clearing site data, browser cache, switching devices

##### Memory Management Best Practices
```typescript
// ✅ Good: Create URLs, then revoke on cleanup
useEffect(() => {
  const url = URL.createObjectURL(blob);
  setImageUrl(url);
  return () => URL.revokeObjectURL(url);
}, [blob]);

// ❌ Bad: Never revoke URLs (memory leak)
const url = URL.createObjectURL(blob);
setImageUrl(url);
```

### UI System and Styling

#### Tailwind CSS v4 with CSS Variables

Styling is built on **Tailwind CSS v4** with design tokens defined in `app/globals.css`.

##### Theme Variables
```css
:root {
  --background: 0 0% 100%;      /* hsl */
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  /* ... more variables */
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  /* ... dark theme overrides */
}
```

##### Exposing to Tailwind
```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... */
}
```

Now use as: `bg-background`, `text-foreground`, `border-border`, etc.

##### Global Utility Classes

**Glassmorphism:**
```css
.glass-subtle {
  background: hsl(var(--background) / 0.6);
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid hsl(var(--border) / 0.3);
}

.glass-strong {
  background: hsl(var(--background) / 0.85);
  backdrop-filter: blur(20px) saturate(200%);
  border: 1px solid hsl(var(--border) / 0.4);
}
```

**Animated Orbs** (in root layout):
```css
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float 20s ease-in-out infinite;
}
```

#### UI Component Library (`components/ui/`)

Reusable primitives built with:
- **Tailwind classes** for styling
- **class-variance-authority** for variants
- **Radix UI primitives** (implied for dialogs, dropdowns)

##### Available Components

1. **Button** (`button.tsx`)
   ```typescript
   <Button variant="default" size="lg" />
   // Variants: default, destructive, outline, secondary, ghost, link
   // Sizes: default, sm, lg, icon
   ```

2. **Card** (`card.tsx`)
   ```typescript
   <Card>
     <CardHeader>
       <CardTitle>Title</CardTitle>
       <CardDescription>Description</CardDescription>
     </CardHeader>
     <CardContent>Content</CardContent>
     <CardFooter>Footer</CardFooter>
   </Card>
   ```

3. **Input** / **Textarea** / **Label**
   ```typescript
   <Label htmlFor="email">Email</Label>
   <Input id="email" type="email" />
   <Textarea placeholder="Bio..." />
   ```

4. **Badge** (`badge.tsx`)
   ```typescript
   <Badge variant="default">New</Badge>
   // Variants: default, secondary, destructive, outline
   ```

5. **Dialog** (`dialog.tsx`)
   ```typescript
   <Dialog open={open} onOpenChange={setOpen}>
     <DialogTrigger asChild>
       <Button>Open</Button>
     </DialogTrigger>
     <DialogContent>
       <DialogHeader>
         <DialogTitle>Title</DialogTitle>
         <DialogDescription>Description</DialogDescription>
       </DialogHeader>
       {/* Content */}
     </DialogContent>
   </Dialog>
   ```

6. **Dropdown Menu** (`dropdown-menu.tsx`)
   ```typescript
   <DropdownMenu>
     <DropdownMenuTrigger asChild>
       <Button variant="ghost">Open</Button>
     </DropdownMenuTrigger>
     <DropdownMenuContent>
       <DropdownMenuItem>Item 1</DropdownMenuItem>
       <DropdownMenuSeparator />
       <DropdownMenuItem>Item 2</DropdownMenuItem>
     </DropdownMenuContent>
   </DropdownMenu>
   ```

7. **Skeleton** (`skeleton.tsx`)
   ```typescript
   <Skeleton className="h-8 w-32" /> // Loading placeholder
   ```

8. **Accordion** (`accordion.tsx`) - Used in FAQ section

9. **Tabs** (`tabs.tsx`) - Tab navigation

10. **Checkbox** (`checkbox.tsx`)

##### Utils (`lib/utils.ts`)
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Usage:
```typescript
<div className={cn(
  "base-class",
  isActive && "active-class",
  className  // Prop from parent
)} />
```

#### Layout Components (`components/layout/`)

##### PublicNav (`PublicNav.tsx`)
- Logo "ImageVault" with icon
- Navigation links: Features, How it works, Pricing, FAQ
- CTA buttons: Sign in, Get started
- Theme toggle
- Responsive: Hamburger menu on mobile
- Shows "Go to dashboard" if authenticated

##### Footer (`Footer.tsx`)
- Links: About, Features, Pricing, Contact
- Social placeholders (GitHub, Twitter, etc.)
- Disclaimer about local-only storage
- Copyright notice

##### DashboardShell (`DashboardShell.tsx`)
**Desktop layout:**
- Fixed sidebar (left, 64 width)
- Topbar with search, theme toggle, user dropdown
- Content area (flex-1)

**Mobile layout:**
- Hidden sidebar, toggle with hamburger
- Bottom navigation bar (fixed, z-50)
- Drawer overlay when menu open

**Sidebar links:**
- Overview (`/dashboard`)
- Upload (`/dashboard/upload`)
- Gallery (`/dashboard/gallery`)
- Profile (`/dashboard/profile`)
- Settings (`/dashboard/settings`)

**Active link highlighting:**
```typescript
function isLinkActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
```

**Search functionality:**
- When on gallery page: Updates URL query param `?q=...`
- When on other pages: Navigates to gallery with search
- Keyboard shortcut: `Cmd/Ctrl + K` to focus

**User dropdown menu:**
- Profile → `/dashboard/profile`
- Settings → `/dashboard/settings`
- Sign out → Calls `signOut()`, redirects to home

### Theming System

#### ThemeProvider (`components/theme/ThemeProvider.tsx`)

Manages global color theme with three modes:
- `light`: Always light colors
- `dark`: Always dark colors  
- `system`: Follows OS preference (`prefers-color-scheme`)

**Storage:** `iu_theme` in localStorage

**Implementation:**
```typescript
const ThemeContext = createContext<{
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}>(...);
```

**Theme application:**
```typescript
if (resolvedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}
```

**System preference detection:**
```typescript
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark' : 'light';

// Listen for changes
matchMedia.addEventListener('change', (e) => {
  if (theme === 'system') setResolvedTheme(e.matches ? 'dark' : 'light');
});
```

**Cross-tab sync:**
```typescript
window.addEventListener('storage', (e) => {
  if (e.key === 'iu_theme') {
    setTheme(e.newValue || 'system');
  }
});
```

#### ThemeToggle (`components/theme/ThemeToggle.tsx`)

Dropdown menu with three options:
- ☀️ Light
- 🌙 Dark
- 💻 System

Usage:
```typescript
const { theme, setTheme } = useTheme();
```

**Best practices when adding new UI:**
- Use semantic color classes: `bg-background`, `text-foreground`, `border-border`
- Never hardcode colors like `text-gray-900` or `bg-white`
- Test in both light and dark modes
- Ensure contrast ratios meet WCAG AA (4.5:1 for text)

### Notifications System

#### Toast Implementation (`components/ui/use-toast.tsx`)

Lightweight notification system with context + hook pattern.

**ToastProvider:**
```typescript
interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

const ToastContext = createContext<{
  toast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismiss: (id: string) => void;
}>(...);
```

**Usage in components:**
```typescript
const { toast } = useToast();

// Success
toast('Profile updated successfully!', 'success');

// Error
toast('Failed to upload image', 'error');

// Info (default)
toast('This feature is coming soon');
```

**Features:**
- Auto-dismiss after 3 seconds
- Manual dismiss with X button
- Stacked in bottom-right corner
- Glass effect styling
- Color-coded left border by type
- Slide-in animation
- Accessible (ARIA live region)

**Wired in root layout:**
```typescript
<ToastProvider>
  {children}
</ToastProvider>
```

All client components can call `useToast()` without additional setup.

### Naming and Branding

**Project name** (package.json): `image-uploader`  
**Brand name** (UI): `ImageVault`  
**Product description**: Offline-first, browser-only image manager

The inconsistency is cosmetic. Treat "ImageUploader" and "ImageVault" as interchangeable when referencing the app.

## Key Features Deep Dive

### 1. Landing Page (`app/(public)/page.tsx`)

**Sections:**
1. **Hero**
   - Headline: "Upload, preview, and organize images — instantly."
   - Subtext about local-first storage
   - CTA buttons: Get started, View demo
   - 3D visualization (Three.js scene with rotating shapes)

2. **Features Grid** (6 cards)
   - Drag & drop upload
   - Local-first storage (IndexedDB)
   - Tags & search
   - Profile customization
   - Responsive gallery
   - Dark mode

3. **How It Works** (3 steps with icons)
   - Sign up for free
   - Upload your images
   - Access anytime, anywhere (on same device)

4. **Testimonials** (3 sample cards)
   - Realistic but clearly demo data

5. **Pricing** (3 tiers)
   - Free, Pro (mock), Team (mock)
   - Disclaimer: "Billing not implemented"

6. **FAQ** (Accordion)
   - Common questions about storage, privacy, features

7. **Final CTA Band**
   - Encouragement to try the app

8. **Footer**
   - Links and social placeholders

**Three.js Scene** (`components/landing/HeroThreeScene.tsx`):
- Animated 3D shapes (torus, sphere, etc.)
- React Three Fiber + Drei for helpers
- Responsive canvas
- Performance-optimized with `useFrame`

### 2. Dashboard Overview (`app/(app)/dashboard/page.tsx`)

**Stats Cards:**
- **Total Images**: Count of all user images
- **Storage Used**: Sum of blob sizes in MB
- **Recent Uploads**: Images from last 7 days

**Quick Actions:**
- Upload images → `/dashboard/upload`
- View gallery → `/dashboard/gallery`
- Edit profile → `/dashboard/profile`

**Recent Uploads Grid:**
- Up to 8 most recent images
- Thumbnail cards with hover effects
- Click → Opens preview dialog

**Preview Dialog:**
- Full-size image
- Metadata: Name, tags, created date, file size
- Download button
- Close with X or Escape key

### 3. Upload Interface (`app/(app)/dashboard/upload/page.tsx`)

**Features:**
- Dropzone area (click to browse or drag files)
- Multiple file selection
- File type validation (png, jpg, jpeg, webp, gif)
- Max file size check (optional, can be added)
- Preview thumbnails for selected files
- Editable display names per image
- Global tags input (applied to all)
- Per-image tags editing (nice-to-have)
- Progress indicators during save
- Success toast → "Saved to your local gallery"
- CTA: "Go to Gallery" after upload

**Privacy Notice Card:**
> "Stored locally in your browser (IndexedDB). Clearing site data removes images."

**Implementation:**
```typescript
// Dropzone component from components/images/DropzoneUploader.tsx
const handleUpload = async () => {
  const metadata = files.map((file, i) => ({
    displayName: editedNames[i] || file.name,
    tags: tagInputs[i] || globalTags
  }));
  
  await imageStore.addImages(user.id, files, metadata);
  toast('Images uploaded successfully!', 'success');
  router.push('/dashboard/gallery');
};
```

### 4. Gallery (`app/(app)/dashboard/gallery/page.tsx`)

**Layout:**
- Responsive grid (masonry-like or CSS grid)
- Adjusts columns based on screen size
- Gallery density setting (comfortable/compact)

**Controls Bar:**
- Search input: Filter by name or tags
- Sort dropdown: Newest, Oldest, Name (A-Z)
- Filter by tag: Dropdown with all tags (derived from images)
- Result count: "Showing X images"

**Image Cards:**
- Thumbnail
- Display name
- Tags (as badges)
- Created date
- Actions dropdown:
  - 👁️ Preview
  - ✏️ Rename
  - 🏷️ Edit tags
  - 💾 Download
  - 🗑️ Delete

**Preview Dialog:**
- Full-size image display
- Image metadata panel
- Navigation:
  - Previous/Next buttons
  - Keyboard: Arrow Left/Right
  - Current index: "3 / 24"
- Download button
- Close: X button or Escape key

**Edit Dialogs:**
- **Rename:** Input field → `renameImage(id, newName)`
- **Edit Tags:** Comma-separated input → `updateTags(id, tags)`
- **Delete:** Confirmation dialog → `deleteImage(id)` + remove from state

**Empty State:**
- "No images yet"
- CTA: "Upload your first image"
- Icon illustration

**Performance:**
- Lazy load images (optional with IntersectionObserver)
- Object URLs created on mount
- Cleanup on unmount

### 5. Profile Management (`app/(app)/dashboard/profile/page.tsx`)

**Avatar Section:**
- Current avatar preview (circular)
- Upload button → File input
- Convert to DataURL:
  ```typescript
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result as string;
    updateProfile({ avatarDataUrl: dataUrl });
  };
  reader.readAsDataURL(file);
  ```
- Remove avatar button → `updateProfile({ avatarDataUrl: undefined })`

**Profile Fields:**
- Name (text input)
- Bio (textarea)
- Email (text input, shown with warning about localStorage limitations)

**Save Button:**
- Calls `updateProfile(changes)`
- Success toast: "Profile updated!"
- Error handling for email conflicts

**Account Info Card:**
- Account created: `formatDate(user.createdAt)`
- Local-only notice

**Danger Zone:**
- Sign out button → `signOut()` → Redirect to home
- Clear local data:
  - Confirmation dialog: "This will delete all your images. Continue?"
  - On confirm:
    ```typescript
    await imageStore.clearUserImages(user.id);
    toast('All images deleted', 'success');
    ```

### 6. Settings (`app/(app)/dashboard/settings/page.tsx`)

**Appearance:**
- Theme selector: Light / Dark / System
- Uses `useTheme()` hook

**Gallery Preferences:**
- Density: Comfortable / Compact
- Default sort: Newest / Oldest / Name
- Stored in localStorage via `lib/settings.ts`:
  ```typescript
  interface Settings {
    galleryDensity: 'comfortable' | 'compact';
    defaultSort: 'newest' | 'oldest' | 'name';
  }
  ```

**Data Management:**
- Export metadata button:
  ```typescript
  const handleExport = async () => {
    const images = await imageStore.listImages(user.id);
    const json = JSON.stringify(images, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `images-metadata-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  ```
- Note: Blobs are not exported (too large)

**About Section:**
- App version (hardcoded string)
- "No backend — local-first demo" disclaimer
- Link to documentation (this file)

## Accessibility Features

### Implemented
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Focus Indicators**: Visible focus rings with `focus-visible:ring-2`
- **ARIA Labels**: Buttons and links have proper `aria-label` attributes
- **Semantic HTML**: Proper heading hierarchy (`<h1>`, `<h2>`, etc.)
- **Alt Text**: Images have descriptive alt attributes
- **Color Contrast**: WCAG AA compliant (4.5:1 for text)
- **Screen Reader Support**: ARIA live regions for toasts
- **Skip Links**: (Could be improved with skip-to-content link)

### Keyboard Shortcuts
- `Cmd/Ctrl + K`: Focus search input
- `Arrow Left/Right`: Navigate image preview
- `Escape`: Close dialogs and mobile menu
- `Tab/Shift+Tab`: Move between focusable elements
- `Enter/Space`: Activate buttons and links

### Focus Management
```typescript
// Trap focus in dialogs
useEffect(() => {
  if (open) {
    const focusableElements = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    firstElement?.focus();
    
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }
}, [open]);
```

## Performance Optimizations

### Implemented
1. **Code Splitting**: Automatic via Next.js App Router
2. **Object URL Cleanup**: Prevent memory leaks
   ```typescript
   useEffect(() => {
     return () => images.forEach(img => URL.revokeObjectURL(img.url));
   }, []);
   ```
3. **IndexedDB Indexes**: Fast user-filtered queries
4. **Skeleton Loaders**: Perceived performance during loading
5. **Lazy Components**: Dynamic imports for heavy components
6. **Efficient Queries**: List without blobs for metadata-only views
7. **Memoization**: `useMemo` for filtered/sorted lists
8. **Debouncing**: (Can be added for search input)

### Potential Improvements
- Virtual scrolling for 1000+ images (react-window or react-virtuoso)
- Thumbnail generation: Store small versions separately
- Web Workers: Image processing off main thread
- Service Worker: Offline support
- Image compression: Compress before IndexedDB storage
- Progressive loading: Load visible images first

## Testing Strategy

### Current State
**No tests currently implemented.**

### Recommended Testing Approach

**Unit Tests** (Jest + Testing Library):
- `lib/auth.ts`: signUp, signIn, session validation
- `lib/imageStore.ts`: CRUD operations
- `lib/utils.ts`: cn utility
- UI components: Button, Card, Input, etc.

**Component Tests**:
- AuthProvider: Context values
- ThemeProvider: Theme switching
- DashboardShell: Navigation and user menu
- DropzoneUploader: File validation

**Integration Tests**:
- Auth flow: Sign up → Sign in → Protected route
- Image flow: Upload → Gallery → Edit → Delete
- Theme persistence: Set theme → Reload → Check applied

**E2E Tests** (Playwright or Cypress):
- Complete user journey: Landing → Sign up → Upload → Gallery → Profile
- Cross-tab sync: Auth in one tab, verify in another
- Keyboard navigation: Tab through forms, dialogs

### Example Test
```typescript
// lib/auth.test.ts
import { signUp, signIn, getSession } from './auth';

beforeEach(() => {
  localStorage.clear();
});

test('signUp creates user and session', async () => {
  const result = await signUp('test@example.com', 'password123', 'Test User');
  
  expect(result.success).toBe(true);
  expect(result.user.email).toBe('test@example.com');
  expect(result.user.name).toBe('Test User');
  
  const session = getSession();
  expect(session).not.toBeNull();
  expect(session.userId).toBe(result.user.id);
});

test('signIn with wrong password fails', async () => {
  await signUp('test@example.com', 'password123', 'Test User');
  const result = await signIn('test@example.com', 'wrongpassword');
  
  expect(result.success).toBe(false);
  expect(result.error).toContain('Invalid');
});
```

## Known Limitations

1. **No Backend**: All data stays in browser, no server persistence
2. **No Sync**: Data doesn't transfer between devices or browsers
3. **No Collaboration**: Single-user only, no sharing
4. **Storage Limits**: Constrained by browser IndexedDB quotas
5. **No Image Processing**: No resize, crop, rotate, filters
6. **No Bulk Operations**: Limited multi-select functionality
7. **Basic Search**: Simple string matching, no fuzzy search or typo tolerance
8. **No Undo/Redo**: Destructive actions are immediate and irreversible
9. **No Image Optimization**: Original blobs stored as-is
10. **No EXIF Handling**: Metadata like GPS, camera info not parsed

## Security Considerations

### ⚠️ Current State (Demo Only)
- **No actual security measures**
- Client-side only authentication
- Passwords visible in browser dev tools
- No encryption at rest
- Vulnerable to XSS attacks
- No CSRF protection
- No rate limiting
- No input sanitization

### For Production (If Implemented)
Would require:

**Server-side authentication:**
- Secure password hashing (bcrypt, argon2)
- HTTP-only, secure cookies for sessions
- CSRF tokens for state-changing requests
- Rate limiting on login attempts

**API security:**
- Authentication middleware
- Authorization checks
- Input validation and sanitization
- SQL injection prevention (if using SQL DB)

**Data encryption:**
- HTTPS everywhere (TLS 1.3)
- Encrypt sensitive data at rest
- Secure key management

**Additional measures:**
- Content Security Policy (CSP)
- CORS configuration
- Security headers (X-Frame-Options, etc.)
- Regular security audits
- Dependency vulnerability scanning

**Recommended production auth solutions:**
- [NextAuth.js](https://next-auth.js.org/) - Open source auth for Next.js
- [Clerk](https://clerk.com/) - Complete user management
- [Auth0](https://auth0.com/) - Enterprise authentication
- [Supabase Auth](https://supabase.com/auth) - Open source Firebase alternative
- [Firebase Auth](https://firebase.google.com/docs/auth) - Google's auth service

## Browser Compatibility

### Minimum Requirements
- Modern browsers with ES2017+ support
- IndexedDB API support (all modern browsers)
- Web Crypto API for SHA-256 (Chrome 37+, Firefox 34+, Safari 11+)
- localStorage support
- CSS Grid and Flexbox
- CSS custom properties (variables)

### Tested/Supported Browsers
- **Chrome/Edge**: 90+
- **Firefox**: 90+
- **Safari**: 14+
- **Mobile**:
  - iOS Safari: 14+
  - Chrome Mobile: 90+
  - Samsung Internet: Recent versions

### Unsupported
- Internet Explorer (any version)
- Opera Mini (limited JS support)
- Browsers without IndexedDB

### Feature Detection
```typescript
if (!window.indexedDB) {
  alert('Your browser does not support IndexedDB. Please use a modern browser.');
}

if (!window.crypto.subtle) {
  alert('Your browser does not support Web Crypto API.');
}
```

## Deployment

### Recommended Platforms

**1. Vercel (Recommended)**
- Zero-config deployment for Next.js
- Automatic HTTPS
- Global CDN
- Edge Functions support
- GitHub integration

```bash
npm i -g vercel
vercel
```

**2. Netlify**
- Similar to Vercel
- Drag-and-drop deploy
- Continuous deployment from Git

**3. Static Export**
Since no backend is required, can be exported as static site:
```javascript
// next.config.ts
const nextConfig = {
  output: 'export',
};
```

Then deploy to:
- AWS S3 + CloudFront
- GitHub Pages
- Cloudflare Pages
- Any static host

### Build Configuration

**No environment variables needed** (all client-side).

**Build command:**
```bash
npm run build
```

**Output:**
- `.next/` directory (for Vercel/Netlify)
- `out/` directory (for static export)

### Production Checklist
- [ ] Test in production mode locally (`npm run build && npm start`)
- [ ] Verify all routes work
- [ ] Test auth flows
- [ ] Test image upload/gallery
- [ ] Check mobile responsiveness
- [ ] Test both light and dark themes
- [ ] Verify accessibility with keyboard navigation
- [ ] Check browser console for errors
- [ ] Test on multiple browsers
- [ ] Verify IndexedDB works in production

## Development Workflow

### Getting Started
1. Clone repository
2. `npm install`
3. `npm run dev`
4. Open http://localhost:3000

### Code Style
- Use TypeScript strictly (no `any` types unless absolutely necessary)
- Follow existing patterns and conventions
- Use functional components + hooks (no class components)
- Prefer composition over inheritance
- Use meaningful variable names
- Add JSDoc comments for complex logic
- Use `const` over `let` when possible

### File Organization
- Keep components small and focused (single responsibility)
- Co-locate related files (component + styles + tests)
- Place shared utilities in `lib/`
- Export from `index.ts` for clean imports
- Use route groups for logical organization

### Git Workflow
1. Create feature branch from `main`
2. Make changes with descriptive commits
3. Test locally
4. Push and create pull request
5. Code review
6. Merge to `main`

### Commit Message Format
```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semi-colons
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(gallery): add filtering by tags

fix(auth): session expiry not checked correctly

docs(readme): update deployment instructions

refactor(imageStore): simplify blob URL creation
```

## Troubleshooting

### Common Issues

**1. "User not authenticated" after refresh**
- Check localStorage for `iu_session`
- Verify session expiry hasn't passed
- Check browser console for errors

**2. Images not displaying in gallery**
- Open browser dev tools → Application → IndexedDB
- Verify `image-uploader-db` exists
- Check if blobs are stored
- Verify Object URLs are created
- Check for memory leak (URLs not revoked)

**3. Theme not persisting**
- Check localStorage for `iu_theme`
- Verify ThemeProvider is wrapping app
- Check for errors in browser console

**4. "Failed to load images"**
- IndexedDB quota may be full
- Check browser storage settings
- Try clearing other site data

**5. Build errors**
- Delete `.next/` folder
- Run `npm install` again
- Check for TypeScript errors: `npx tsc --noEmit`

### Debugging Tips

**View localStorage:**
```javascript
// In browser console
JSON.parse(localStorage.getItem('iu_users'))
JSON.parse(localStorage.getItem('iu_session'))
```

**View IndexedDB:**
- Chrome: DevTools → Application → IndexedDB
- Firefox: DevTools → Storage → IndexedDB

**Clear all data:**
```javascript
// In browser console
localStorage.clear();
indexedDB.deleteDatabase('image-uploader-db');
location.reload();
```

**Enable verbose logging:**
Add to `lib/auth.ts` and `lib/imageStore.ts`:
```typescript
const DEBUG = true;
if (DEBUG) console.log('[auth]', ...args);
```

## Future Enhancement Ideas

### Features
- [ ] Drag-and-drop tag management
- [ ] Image editing (crop, rotate, filters, brightness/contrast)
- [ ] Collections/folders/albums for organization
- [ ] Bulk operations (multi-select, batch delete, batch tag)
- [ ] Advanced search with filters (date range, size, file type)
- [ ] Image metadata viewer (EXIF data: camera, GPS, etc.)
- [ ] Duplicate detection
- [ ] Slideshow mode
- [ ] Favorites/star system
- [ ] Image comparison view
- [ ] Sharing via temporary links (requires backend)
- [ ] Keyboard shortcuts reference modal

### Technical
- [ ] Progressive Web App (PWA) with service worker
- [ ] Offline mode with background sync
- [ ] Virtual scrolling for performance (1000+ images)
- [ ] WebP conversion for smaller file sizes
- [ ] Thumbnail generation (separate smaller copies)
- [ ] Full-text search with Fuse.js or FlexSearch
- [ ] Drag-and-drop image reordering
- [ ] Undo/redo system
- [ ] Export/import full backup (with blobs)
- [ ] Integration with cloud storage (Google Drive, Dropbox)
- [ ] Real-time sync between devices (requires backend)
- [ ] End-to-end encryption
- [ ] Server-side rendering optimization
- [ ] Internationalization (i18n)

### UI/UX
- [ ] Onboarding tour for new users
- [ ] Empty state illustrations
- [ ] Loading state animations
- [ ] Gesture support on mobile (swipe to delete, pinch to zoom)
- [ ] Infinite scroll in gallery
- [ ] Grid size customization
- [ ] Custom themes/color schemes
- [ ] Accessibility improvements (more ARIA labels, better screen reader support)

## Common Tasks for AI Assistants

When working with this codebase, you might be asked to:

### Add a New Page
1. Create page file in appropriate route group
2. If protected, ensure parent layout has `RequireAuth`
3. Use existing UI components from `components/ui/`
4. Follow naming conventions: PascalCase for components
5. Add to sidebar navigation if needed (update `DashboardShell.tsx`)

### Add a New Feature to Gallery
1. Update `app/(app)/dashboard/gallery/page.tsx`
2. If needs new imageStore function, add to `lib/imageStore.ts`
3. Update ImageRecord type if adding new fields
4. Consider IndexedDB migration if schema changes
5. Add UI controls in controls bar
6. Test with multiple images and edge cases

### Modify Auth System
1. Update `lib/auth.ts` for core logic
2. Update `AuthProvider.tsx` to expose new functionality
3. Update User interface if adding fields
4. Consider localStorage data migration
5. Test sign up, sign in, sign out flows

### Add a New UI Component
1. Create in `components/ui/` following existing patterns
2. Use `cn()` utility for className composition
3. Use class-variance-authority for variants
4. Add TypeScript types for props
5. Ensure accessibility (keyboard, ARIA)
6. Test in both light and dark themes

### Style Changes
1. Use Tailwind utility classes
2. For theme colors, use CSS variables: `bg-background`, `text-foreground`
3. Add custom utilities to `globals.css` if reused
4. Test in both themes
5. Ensure responsive design (mobile-first)

## Resources

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs) - Framework
- [React Docs](https://react.dev) - UI library
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Type system
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) - Storage
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) - Hashing

### Libraries
- [idb](https://github.com/jakearchibald/idb) - IndexedDB wrapper
- [Three.js](https://threejs.org/docs/) - 3D graphics
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) - React + Three.js
- [Lucide Icons](https://lucide.dev) - Icon library
- [class-variance-authority](https://cva.style/docs) - Component variants

### Learning Resources
- [Next.js Learn](https://nextjs.org/learn) - Interactive tutorial
- [React Patterns](https://reactpatterns.com/) - Best practices
- [Tailwind UI](https://tailwindui.com/) - Component examples
- [Web.dev](https://web.dev/) - Performance and best practices

---

**Last Updated:** January 2026  
**Project Version:** 0.1.0  
**Maintained By:** ImageUploader Team

**Note:** This is a demonstration project for educational purposes. The authentication system is intentionally insecure and should not be used in production environments.
