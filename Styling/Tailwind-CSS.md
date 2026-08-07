# Tailwind CSS

> 🧭 پیش‌نیاز: [CSS Modules](./CSS-Modules.md) · بعدی: [CSS-in-JS](./CSS-in-JS.md)

---

## 📖 مفهوم

در Tailwind CSS به‌جای نوشتن فایل CSS جدا، کلاس‌های utility کوچک (مثل `flex`، `p-4`، `text-lg`) را مستقیم در `className` JSX می‌چسبانید. build tool کلاس‌های استفاده‌نشده را حذف می‌کند (`purge`/`content`).

در پروژه Wild Oasis (Next.js) layout ریشه با `className="bg-primary-950 text-primary-100 min-h-screen"` استایل می‌شود — جزئیات setup در Next.js در [Project-Setup](../Nextjs/Project-Setup.md) (M10)؛ این فایل تمرکز روی مفهوم و استفاده در SPA React دارد.

---

## چرا این ویژگی وجود دارد؟

نوشتن CSS جدا برای هر دکمه و کارت زمان‌بر است. utility-first سرعت prototype و یکنواختی design token را بالا می‌برد — به‌خصوص وقتی تیم به کلاس‌های ثابت عادت دارد.

---

## چه مشکلی را حل می‌کند؟

- سرعت ساخت UI بدون سوئیچ بین فایل JS و CSS
- design system از طریق `tailwind.config` (رنگ `primary-950` و غیره)
- حذف CSS مرده در production
- responsive با prefix (`md:flex`، `lg:grid-cols-3`)

---

## ⚙️ نحوه کار

### نصب در Vite + React

```bash
npm install -D tailwindcss @tailwindcss/vite
```

در فایل `vite.config.js`:

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

در فایل CSS ورودی (مثلاً `index.css`):

```css
/* index.css */
@import "tailwindcss";
```

و import در `main.jsx` مثل [Global-CSS](./Global-CSS.md).

### استفاده در JSX

```jsx
// AppLayout.jsx
export default function AppLayout({ children }) {
  return (
    <div className="bg-primary-950 text-primary-100 min-h-screen">
      <header className="border-b border-primary-900 px-8 py-4">
        <Logo />
        <Navigation />
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
```

### سفارشی‌سازی تم

در Tailwind v4 تم اغلب در CSS با `@theme`؛ در v3 فایل `tailwind.config.js`:

```js
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          950: "#1a1a2e",
          100: "#f0f0f5",
        },
      },
    },
  },
};
```

### ترکیب با state

```jsx
<button
  className={`rounded px-4 py-2 font-semibold ${
    isActive ? "bg-brand-500 text-white" : "bg-gray-200"
  }`}
>
  Filter
</button>
```

برای خوانایی بهتر از `clsx` یا `classnames` استفاده کنید.

### `@apply` (اختیاری)

می‌توانید utilityها را در یک کلاس CSS جمع کنید — ولی تیم‌های بزرگ اغلب ترجیح می‌دهند utility را در JSX نگه دارند:

```css
/* components.css */
@layer components {
  .btn-primary {
    @apply rounded bg-brand-500 px-4 py-2 font-bold text-white hover:bg-brand-600;
  }
}
```

---

## تفاوت با گزینه‌های مشابه

| | Tailwind | CSS Modules | CSS-in-JS |
|---|----------|-------------|-----------|
| محل استایل | `className` | فایل `.module.css` | `styled.div` |
| یادگیری اولیه | کلاس‌های زیاد | CSS آشنا | JS + CSS |
| bundle | کوچک با purge | کوچک | runtime بیشتر |
| props پویا | با template/clsx | کلاس اضافه | عالی |

---

## تفاوت با Next.js (M10)

| SPA (این فایل) | Next.js App Router |
|----------------|-------------------|
| `main.jsx` + `index.css` | `app/layout.js` + `globals.css` |
| `@import "tailwindcss"` در CSS | همان + alias `@/` |
| جزئیات | [Nextjs/Project-Setup](../Nextjs/Project-Setup.md) |

---

## مثال واقعی در پروژه

**Wild Oasis (Next.js):** `RootLayout` با `bg-primary-950` و import `@/app/_styles/globals.css` — همان ایدهٔ utility در layout ریشه.

---

## 🚀 Best Practices

✅ `content`/`@source` را درست تنظیم کن تا purge کلاس‌های JSX را ببیند  
✅ design token در config/`@theme`؛ نه hex پراکنده در JSX  
✅ `clsx` برای شرطی‌ها  
✅ برای کامپوننت تکراری شاید `@layer components` یا wrapper کوچک  
❌ رشته `className` ۲۰ خطی بدون شکستن  
❌ مخلوط Tailwind + CSS-in-JS بدون قرارداد تیم

---

## ⚠️ اشتباهات رایج

❌ فراموش کردن import Tailwind در CSS entry  
❌ کلاس dynamic که build نمی‌بیند: `` `text-${color}-500` `` — نام کامل بنویسید  
❌ duplicate کردن همان utility در ده فایل — component wrapper بسازید  
❌ Tailwind بدون config رنگ برای برند پروژه

---

## ارتباط با مفاهیم دیگر

- [CSS-Modules](./CSS-Modules.md) — می‌توان ترکیب کرد (module برای بخش، Tailwind برای layout)
- [Global-CSS](./Global-CSS.md) — entry point import
- [Conditional-Rendering](../Conditional-Rendering.md) — کلاس شرطی
- [Nextjs/Project-Setup](../Nextjs/Project-Setup.md) — Tailwind در Next.js
- [Styling/README](./README.md) — درخت تصمیم

---

## خلاصه

در Tailwind، کلاس utility در `className` است — سریع برای UI، با purge سبک، و تم از config. در SPA از Vite plugin شروع کن؛ در Next.js جزئیات setup را در M10 ببین.

---

## 📚 منابع

- [Tailwind CSS — Docs](https://tailwindcss.com/docs)
- [Tailwind + Vite](https://tailwindcss.com/docs/installation/using-vite)
- [React — Adding styles](https://react.dev/learn#adding-styles)
