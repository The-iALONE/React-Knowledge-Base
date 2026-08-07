# Metadata and SEO

> 🧭 پیش‌نیاز: [Authentication (NextAuth)](./Authentication-NextAuth.md) · بعدی: [Image & Font Optimization](./Image-And-Font-Optimization.md)

متادیتای صفحه، favicon و SEO با `metadata` export و `generateMetadata`.

---

## 📖 مفهوم

در App Router، هر `layout` یا `page` می‌تواند **metadata** (title، description، Open Graph، favicon) را با export ثابت `metadata` یا تابع `generateMetadata` تعریف کند. Next.js تگ‌های `<head>` را خودکار می‌سازد.

---

## چرا این ویژگی وجود دارد؟

SEO و اشتراک‌گذاری در شبکه‌های اجتماعی به `<title>`، `description` و OG image وابسته‌اند. مدیریت دستی `<head>` در هر صفحه خطاپذیر است.

---

## چه مشکلی را حل می‌کند؟

- title/description یکتا per route
- Open Graph و Twitter cards
- favicon و manifest
- metadata پویا (مثلاً نام کابین در title)

---

## ⚙️ نحوه کار

```
layout/page → export metadata | generateMetadata → <head> در HTML
```

Metadata از parent به child **merge** می‌شود — child می‌تواند override کند.

---

## Syntax — static metadata

```tsx
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Wild Oasis",
    template: "%s | Wild Oasis",
  },
  description: "Luxury cabins in the heart of nature",
  icons: {
    icon: "/favicon.ico",
  },
};
```

```tsx
// app/about/page.tsx
export const metadata: Metadata = {
  title: "About",
  // → "About | Wild Oasis"
};
```

---

## Syntax — dynamic metadata

```tsx
// app/cabins/[cabinId]/page.tsx
import type { Metadata } from "next";

type Props = { params: Promise<{ cabinId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cabinId } = await params;
  const cabin = await getCabin(cabinId);

  if (!cabin) return { title: "Cabin not found" };

  return {
    title: cabin.name,
    description: cabin.description,
    openGraph: {
      title: cabin.name,
      images: [cabin.image],
    },
  };
}
```

---

## فایل‌های static در app/

```
app/
├── favicon.ico
├── icon.png
├── apple-icon.png
└── opengraph-image.png
```

Next.js به‌صورت convention-based آن‌ها را تشخیص می‌دهد.

---

## 💡 مثال ساده

```tsx
export const metadata = {
  title: "Home",
  description: "Welcome to our site",
};
```

---

## مثال واقعی در پروژه

در پروژهٔ Wild Oasis (طبق جزوه):

- `layout` ریشه — title template و favicon
- `/about` — metadata ثابت
- `/cabins/[cabinId]` — `generateMetadata` با نام و تصویر کابین
- OG image برای share در شبکه‌های اجتماعی

---

## 🚀 Best Practices

✅ `title.template` در root layout  
✅ `generateMetadata` برای dynamic routes  
✅ description منحصربه‌فرد per page (نه تکراری)  
✅ `openGraph` و `twitter` برای share  
✅ از `metadataBase` برای URL مطلق تصاویر OG

---

## ⚠️ اشتباهات رایج

❌ title یکسان برای همهٔ صفحات  
❌ `generateMetadata` بدون handle کردن `notFound`  
❌ URL نسبی برای OG image بدون `metadataBase`  
❌ فراموش کردن `await params` در Next.js 15+  
❌ metadata در Client Component — فقط Server

---

## ارتباط با مفاهیم دیگر

- [Routing-And-Pages](./Routing-And-Pages.md) — dynamic `[cabinId]`
- [Server-Components](./Server-Components.md)
- [Image-And-Font-Optimization](./Image-And-Font-Optimization.md) — OG images
- [Rendering-Strategies](./Rendering-Strategies.md) — static metadata

---

## خلاصه

برای metadata ثابت `export const metadata` و برای پویا `generateMetadata` — root template + override هر صفحه = سئوی تمیز.

---

## 📚 منابع

- [Metadata — Next.js](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [File conventions — favicon, opengraph-image](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
