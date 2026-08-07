# Image and Font Optimization

> 🧭 پیش‌نیاز: [Metadata & SEO](./Metadata-And-SEO.md) · بعدی: [Backend Integration (Supabase)](./Backend-Integration-Supabase.md)

بهینه‌سازی تصویر با `next/image` و فونت با `next/font`.

---

## 📖 مفهوم

کامپوننت‌های `next/image` و `next/font` تصاویر و فونت‌ها را به‌صورت خودکار بهینه می‌کنند — resize، format مدرن (WebP/AVIF)، lazy loading، و کاهش Cumulative Layout Shift (`CLS`).

---

## چرا این ویژگی وجود دارد؟

تصاویر و فونت‌های سنگین بزرگ‌ترین عامل کندی و layout shift هستند. `<img>` و `@font-face` دستی نیاز به pipeline بهینه‌سازی جدا دارند.

---

## چه مشکلی را حل می‌کند؟

- تصاویر responsive بدون چند نسخه دستی
- lazy load پیش‌فرض
- فونت بدون flash of unstyled text (FOUT)
- کاهش CLS با `width`/`height` یا `fill`

---

## ⚙️ نحوه کار — next/image

```
<Image src="..." /> → optimizer Next.js → فرمت/سایز مناسب → CDN (در Vercel)
```

برای تصاویر خارجی: `remotePatterns` در `next.config.ts` — [Project-Setup](./Project-Setup.md).

---

## Syntax — next/image

```tsx
// app/about/page.tsx
import Image from "next/image";

export default function AboutPage() {
  return (
    <Image
      src="/hero.jpg"
      alt="Mountain cabin"
      width={1200}
      height={600}
      priority // برای LCP image
      className="rounded-lg"
    />
  );
}
```

### fill + object-fit

```tsx
<div className="relative h-64 w-full">
  <Image
    src={cabin.image}
    alt={cabin.name}
    fill
    sizes="(max-width: 768px) 100vw, 50vw"
    className="object-cover"
  />
</div>
```

### تصویر remote (Supabase)

```tsx
<Image
  src="https://xxx.supabase.co/storage/v1/object/public/cabins/1.jpg"
  alt="Cabin"
  width={400}
  height={300}
/>
```

---

## Syntax — next/font

```tsx
// app/layout.tsx
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

فونت در build دانلود و self-host می‌شود — بدون request به Google Fonts در runtime.

---

## 💡 مثال ساده

```tsx
import Image from "next/image";

export default function Avatar() {
  return (
    <Image src="/avatar.png" alt="User" width={48} height={48} className="rounded-full" />
  );
}
```

---

## مثال واقعی در پروژه

در پروژهٔ Wild Oasis (طبق جزوه):

- کارت کابین — `Image` با `fill` و `sizes`
- صفحه about — تصاویر responsive
- `Outfit` یا فونت مشابه در root `layout`
- `remotePatterns` برای Supabase Storage در `next.config.ts`

---

## 🚀 Best Practices

✅ همیشه `alt` معنادار  
✅ `priority` فقط برای image بالای fold (LCP)  
✅ `sizes` صحیح برای responsive  
✅ `next/font` به‌جای `<link>` Google Fonts  
✅ `width`/`height` یا `fill` — هرگز بدون ابعاد

---

## ⚠️ اشتباهات رایج

❌ `<img>` معمولی برای تصاویر بزرگ  
❌ فراموش کردن `remotePatterns` — خطای optimizer  
❌ `priority` روی همهٔ تصاویر  
❌ `fill` بدون `position: relative` روی parent  
❌ import فونت در هر component — یک بار در layout

---

## ارتباط با مفاهیم دیگر

- [Project-Setup](./Project-Setup.md) — `next.config.ts`
- [Metadata-And-SEO](./Metadata-And-SEO.md) — OG images
- [Performance — Best Practices](../Performance/Best-Practices.md)
- [Styling — Tailwind](../Styling/Tailwind-CSS.md)

---

## خلاصه

برای تصویر از `next/image` (بهینه‌سازی خودکار) و برای فونت از `next/font` (self-hosted) استفاده کنید. `remotePatterns` برای URL خارجی؛ `sizes` و `priority` را درست تنظیم کنید.

---

## 📚 منابع

- [Image Optimization — Next.js](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Font Optimization — Next.js](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [next/image API](https://nextjs.org/docs/app/api-reference/components/image)
