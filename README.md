# 👑 TRIBE DESIGNS | Pro African Heritage Jersey Lab

![Tribe Designs Header](https://hsctgucjbzbxmzcgpgga.supabase.co/storage/v1/object/public/assets/dark-front.png)

**TRIBE DESIGNS** is a premium, high-performance athletic wear design lab focused on African heritage and modern streetwear excellence. This platform allows users to customize professional-grade jerseys with authentic cultural motifs and high-end typography.

---

## 🚀 Live Features

- **Photorealistic Customizer:** Advanced 2D layering and blend modes using high-resolution jersey photography.
- **Dual-Mode Visualization:** Real-time toggling between "Dark Elite" and "Pure Light" base kits.
- **Professional Typography:** Four industry-standard jersey font styles (Futuristic, Angular, Collegiate, Varsity).
- **Identity Lab:** Smart name-wrapping logic and shoulder-wing numbering for an authentic pro athlete look.
- **Dynamic Shop:** Live inventory management powered by Supabase.
- **Supabase Integration:** Full authentication, persistent user profiles, and order history syncing.

---

## 🛠 Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS (via CDN)
- **Backend:** Supabase (Auth, PostgreSQL, Storage)
- **Icons:** Lucide React
- **Animation:** Tailwind Animate, Framer Motion (Ready for expansion)

---

## 📦 Vercel Deployment Instructions

### 1. Environment Variables
To ensure the backend works on Vercel, you must add these variables in the **Settings > Environment Variables** section of your Vercel project:

| Key | Value |
| :--- | :--- |
| `VITE_SUPABASE_URL` | *Your Supabase Project URL* |
| `VITE_SUPABASE_ANON_KEY` | *Your Supabase Public/Anon Key* |
| `VITE_GEMINI_API_KEY` | *Your Google GenAI API Key* |

### 2. Database Prerequisites
Ensure you have executed the setup scripts in your Supabase SQL Editor:
1.  **Profiles & Products:** Create the tables for inventory and user data.
2.  **RLS Policies:** Enable row-level security so users can only access their own data.
3.  **Public Storage:** Set the `assets` and `jersey-designs` buckets to **Public**.

---

## 🧬 Project Architecture

- `src/components/JerseyPreview.tsx`: The photorealistic rendering engine.
- `src/services/supabaseService.ts`: Central hub for all database/storage operations.
- `src/App.tsx`: Refactored specialized contexts (`UIProvider`, `AuthProvider`, `CartProvider`) for maximum performance.
- `docs/`: Comprehensive project documentation (Logic, Errors, Missing Features).

---

## 🌍 SEO & Socials

- **Optimized Meta Tags:** Built-in OpenGraph and Twitter card support for high-impact social sharing.
- **Semantic HTML:** High readability for search engine indexing.

© 2026 TRIBE DESIGNS. PAN-AFRICAN EXCELLENCE.
