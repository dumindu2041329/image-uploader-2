# 🖼️ ImageVault - Local-First Image Management Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)

**A modern, fast, and intuitive image management platform built entirely in your browser** 🚀

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Tech Stack](#-tech-stack)

</div>

---

## ✨ Features

### 🎨 **Beautiful & Modern UI**
- 🌓 **Dark/Light Theme** - Seamless theme switching with system preference support
- 💎 **Glassmorphism Design** - Modern, sleek interface with glass effects
- 📱 **Fully Responsive** - Perfect experience on desktop, tablet, and mobile
- ♿ **Accessible** - WCAG AA compliant with keyboard navigation

### 🖼️ **Image Management**
- 📤 **Drag & Drop Upload** - Simply drag images to upload
- 🏷️ **Tags & Organization** - Tag images for easy categorization
- 🔍 **Smart Search** - Search by name or tags instantly
- 📊 **Multiple Views** - Grid view with comfortable/compact density options
- ⚡ **Fast Preview** - Quick image preview with keyboard navigation
- 💾 **Bulk Operations** - Upload multiple images at once

### 🔐 **Privacy First**
- 🏠 **Local-Only Storage** - All data stays in your browser (IndexedDB)
- 🔒 **No Backend** - Zero server-side processing or data transmission
- 🚫 **No Cloud Upload** - Your images never leave your device
- 👤 **Multi-User Support** - Multiple accounts on the same device

### ⚙️ **Advanced Features**
- 📈 **Dashboard Analytics** - Track total images, storage used, recent uploads
- 👤 **Profile Management** - Customize your profile with avatar and bio
- 🎯 **Smart Filtering** - Filter by tags, sort by date or name
- 📥 **Export Data** - Export metadata as JSON
- ⌨️ **Keyboard Shortcuts** - Power user features (Cmd/Ctrl + K for search)

### 🎭 **Rich Landing Page**
- 🌊 **3D Animated Hero** - Three.js powered 3D visualization
- 📖 **Feature Showcase** - Comprehensive feature grid
- ❓ **FAQ Section** - Common questions answered
- 💰 **Pricing Display** - Mock pricing tiers (frontend-only demo)

---

## 🎮 Demo

### 🏠 Landing Page
Beautiful marketing page with animated 3D hero section, feature highlights, testimonials, and FAQ.

### 📊 Dashboard
- **Overview**: Stats cards showing total images, storage used, and recent uploads
- **Upload**: Drag-and-drop interface with preview and tag management
- **Gallery**: Responsive grid with search, filter, and sort capabilities
- **Profile**: User profile management with avatar upload
- **Settings**: Theme preferences and gallery customization

---

## 🚀 Quick Start

### Prerequisites

- 📦 **Node.js** 20.x or higher
- 📦 **npm** (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dumindu2041329/image-uploader-2.git
   cd image-uploader-2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) 🎉

### 🏗️ Build for Production

```bash
# Create optimized production build
npm run build

# Run production server
npm start
```

### 🧹 Linting

```bash
npm run lint
```

---

## 📚 Documentation

📖 **[Complete Documentation (WARP.md)](./WARP.md)** - Comprehensive guide covering:
- Architecture overview
- Authentication system
- Image storage with IndexedDB
- UI component library
- Theme system
- Development workflow
- Deployment guides
- Troubleshooting

---

## 🛠️ Tech Stack

### Core
- ⚛️ **[Next.js 16.1.1](https://nextjs.org/)** - React framework with App Router
- ⚛️ **[React 19.2.3](https://react.dev/)** - UI library
- 📘 **[TypeScript 5.x](https://www.typescriptlang.org/)** - Type safety

### Styling
- 🎨 **[Tailwind CSS 4.x](https://tailwindcss.com/)** - Utility-first CSS
- 🎭 **[class-variance-authority](https://cva.style/docs)** - Component variants
- ✂️ **[clsx](https://github.com/lukeed/clsx)** - Conditional classes

### 3D Graphics
- 🎮 **[Three.js](https://threejs.org/)** - 3D rendering
- 🔷 **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)** - React renderer for Three.js
- 🛠️ **[React Three Drei](https://github.com/pmndrs/drei)** - Useful helpers

### Storage & State
- 💾 **[IndexedDB (idb)](https://github.com/jakearchibald/idb)** - Browser database for images
- 🗃️ **localStorage** - User authentication and preferences
- ⚡ **React Context** - State management

### UI Components
- 🎨 **Custom UI Kit** - Built from scratch with Tailwind
- 🎯 **[Lucide React](https://lucide.dev)** - Beautiful icons

---

## 🏗️ Project Structure

```
image-uploader-2/
├── 📁 app/                    # Next.js App Router
│   ├── (public)/             # Landing page
│   ├── (auth)/               # Sign in/up pages
│   ├── (app)/dashboard/      # Protected dashboard
│   └── layout.tsx            # Root layout
├── 📁 components/
│   ├── auth/                 # Auth components
│   ├── images/               # Image components
│   ├── landing/              # Landing page components
│   ├── layout/               # Layout components
│   ├── theme/                # Theme system
│   └── ui/                   # UI component library
├── 📁 lib/
│   ├── auth.ts              # Authentication logic
│   ├── imageStore.ts        # IndexedDB wrapper
│   ├── settings.ts          # User settings
│   └── utils.ts             # Utilities
└── 📁 public/                # Static assets
```

---

## ⚠️ Important Notes

### 🔐 Demo Authentication

This project uses **client-side only authentication** for demonstration purposes:

- ❌ **NOT SECURE** - Do not use in production
- 🎓 **Educational Only** - For learning purposes
- 🏠 **Local Storage** - Data stored in browser localStorage
- 🔓 **No Encryption** - Passwords hashed client-side with SHA-256

**For production**, use:
- [NextAuth.js](https://next-auth.js.org/)
- [Clerk](https://clerk.com/)
- [Auth0](https://auth0.com/)
- [Supabase Auth](https://supabase.com/auth)

### 💾 Storage Limitations

- 📦 Data stored in **IndexedDB** (typically 50MB+, varies by browser)
- 🚫 **No cloud sync** - Data is device/browser-specific
- 🧹 **Clearing browser data** will delete all images and accounts
- 📱 **No cross-device sync** - Each device has its own data

---

## 🎯 Use Cases

✅ **Perfect For:**
- 🎓 Learning Next.js, React, and IndexedDB
- 🧪 Prototyping image management interfaces
- 📚 Understanding local-first architecture
- 🎨 Studying modern UI design patterns
- 🏗️ Building similar frontend-only applications

❌ **Not Suitable For:**
- 🏢 Production applications requiring data persistence
- 🌐 Multi-device synchronization
- 👥 Collaborative features
- 🔒 Applications handling sensitive data
- ☁️ Cloud-based image hosting

---

## 🌟 Key Features Explained

### 🖼️ Image Upload & Management
- Drag files into the upload zone or click to browse
- Add custom names and tags to each image
- Images stored as Blobs in IndexedDB
- Memory-safe with proper Object URL cleanup

### 🔍 Search & Filter
- Real-time search across image names and tags
- Filter by specific tags
- Sort by: Newest, Oldest, or Name (A-Z)
- Responsive gallery grid with density options

### 🎨 Theme System
- Three modes: Light, Dark, System (follows OS preference)
- Smooth transitions between themes
- Persisted in localStorage
- Cross-tab synchronization

### 📊 Dashboard Analytics
- Total image count
- Storage usage in MB
- Recent uploads (last 7 days)
- Visual stats cards with icons

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Focus search input |
| `Arrow Left/Right` | Navigate image preview |
| `Escape` | Close dialogs/menus |
| `Tab` | Navigate between elements |
| `Enter/Space` | Activate buttons |

---

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dumindu2041329/image-uploader-2)

```bash
npm i -g vercel
vercel
```

### Other Platforms
- 🌐 **Netlify** - Drag and drop deployment
- 📦 **Static Export** - Deploy to any static host
- ☁️ **AWS S3 + CloudFront** - Static hosting
- 🔥 **Firebase Hosting** - Google's hosting platform

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🎉 Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- 🎨 **Design Inspiration** - Modern glassmorphism and minimalist UI trends
- 📚 **Next.js Team** - For the amazing framework
- ⚛️ **React Team** - For the powerful UI library
- 🎨 **Tailwind CSS** - For the utility-first CSS framework
- 🎮 **Three.js Community** - For 3D graphics capabilities

---

## 📧 Contact

**Developer**: ImageUploader Team  
**Project Link**: [https://github.com/dumindu2041329/image-uploader-2](https://github.com/dumindu2041329/image-uploader-2)

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with ❤️ using Next.js, React, and TypeScript**

</div>
