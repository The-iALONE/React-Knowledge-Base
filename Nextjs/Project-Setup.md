# Project Setup

راه‌اندازی پروژه Next.js 14+ با App Router، TypeScript و ابزارهای توسعه.

---

## 📖 مفهوم

ایجاد پروژه با `create-next-app` و پیکربندی اولیه برای توسعه محلی، lint و ساختار پوشه `app/`.

---

## چرا این ویژگی وجود دارد؟

شروع سریع با تنظیمات بهینه (Turbopack، ESLint، Tailwind اختیاری) بدون webpack config دستی.

---

## چه مشکلی را حل می‌کند؟

- صرفه‌جویی در زمان setup
- استانداردسازی ساختار پروژه
- آماده‌سازی برای `deployment` روی Vercel

---

## ⚙️ نحوه کار

`create-next-app` اسکلت `app/`، `next.config.js`، `tsconfig.json` و اسکریپت‌های npm را می‌سازد.

---

## چه زمانی استفاده کنیم؟

هر پروژه جدید با Next.js (مثل Wild Oasis clone).

---

## چه زمانی استفاده نکنیم؟

افزودن Next به monorepo موجود — از `next` در workspace استفاده کنید.

---

## Syntax

```bash
npx create-next-app@latest wild-oasis
# ✓ TypeScript
# ✓ ESLint
# ✓ Tailwind CSS
# ✓ src/ directory (اختیاری)
# ✓ App Router
# ✓ Turbopack (dev)

cd wild-oasis
npm run dev
```

---

## ساختار پیشنهادی

```
wild-oasis/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
├── lib/
│   ├── supabase.ts
│   └── auth.ts
├── public/
├── next.config.ts
├── package.json
└── .env.local          # NEXTAUTH_SECRET, SUPABASE keys
```

---

## 💡 مثال ساده

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wild Oasis",
  description: "Luxury cabins in the heart of nature",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

---

## متغیرهای محیطی (.env.local)

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

> هرگز `.env.local` را commit نکنید.

---

## next.config.ts — تنظیمات رایج

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "your-supabase-project.supabase.co",
      },
    ],
  },
};

export default nextConfig;
```

---

## مثال واقعی در پروژه

در Wild Oasis پس از setup:
1. نصب `@supabase/supabase-js` و `next-auth`
2. ساخت `lib/supabase.ts` و `app/api/auth/[...nextauth]/route.ts`
3. پیکربندی `remotePatterns` برای تصاویر کابین از Supabase Storage

---

## 🚀 Best Practices

✅ TypeScript را از ابتدا فعال کنید  
✅ `src/` فقط اگر تیم ترجیح می‌دهد — هر دو معتبر است  
✅ `.env.example` بدون secret برای تیم commit کنید  
✅ برای پروژه جدید از App Router استفاده کنید، نه Pages Router  

---

## ارتباط با مفاهیم دیگر

- [Routing-And-Pages](./Routing-And-Pages.md)
- [Layouts](./Layouts.md)
- [Backend-Integration-Supabase](./Backend-Integration-Supabase.md)
- [Authentication-NextAuth](./Authentication-NextAuth.md)
- [Installation](../Installation.md)

---

## خلاصه

`npx create-next-app@latest` → App Router + TypeScript → `.env.local` → `npm run dev`.

---

## 📚 منابع

- [Installation — Next.js](https://nextjs.org/docs/app/getting-started/installation)
- [Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
