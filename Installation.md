# Installation

> 🧭 پیش‌نیاز: [Thinking in React](./Thinking-in-React.md) · بعدی: [Project Structure](./Project-Structure.md)

نصب و پیش‌نیازهای React.

---

## 📖 مفهوم

برای توسعه React به **Node.js 18+** و یک package manager (`npm`، `pnpm`، `yarn`) نیاز دارید. خود React دو بسته اصلی است: `react` (هسته — کامپوننت، `hooks`) و `react-dom` (رندر در مرورگر). در پروژه واقعی معمولاً از Vite یا Next.js به‌عنوان `toolchain` استفاده می‌شود.

---

## چرا این ویژگی وجود دارد؟

محیط توسعه استاندارد: transpile JSX، HMR، و build production بدون پیکربندی دستی webpack.

---

## چه مشکلی را حل می‌کند؟

راه‌اندازی `toolchain` برای نوشتن JSX و اجرا در مرورگر.

---

## ⚙️ نحوه کار

1. **Node.js LTS** از [nodejs.org](https://nodejs.org) نصب کنید
2. **پروژه جدید:** `npm create vite@latest` (توصیه) یا `npx create-next-app` برای Next.js
3. **نصب دستی** (کتابخانه در پروژه موجود):

```bash
npm install react react-dom
```

4. **ورود به اپ:** در Vite، `src/main.jsx` با `createRoot` از `react-dom/client` درخت را `mount` می‌کند
5. **مرورگر:** React DevTools افزونه را برای دیباگ نصب کنید

| بسته | نقش |
|------|-----|
| `react` | API کامپوننت، `hooks`، `createContext` |
| `react-dom` | `createRoot`، `createPortal`، رندر DOM |
| `react-dom/client` | نقطه ورود React 18+ (`createRoot`) |

---

## Syntax

```bash
# Vite + React + TypeScript (توصیه)
npm create vite@latest my-app -- --template react-ts
cd my-app && npm install && npm run dev

# نصب مستقیم در پروژه موجود
npm install react react-dom
```

---

## 🚀 Best Practices

- Node LTS نگه دارید
- TypeScript برای پروژه‌های بزرگ
- `pnpm` برای سرعت و صرفه‌جویی فضا (اختیاری)
- ویرایشگر با پشتیبانی ESLint و TypeScript (VS Code + extensionهای رسمی)

---

## ⚠️ اشتباهات رایج

- ❌ نسخه Node قدیمی (زیر 18) — خطاهای عجیب در build
- ❌ نصب فقط `react` بدون `react-dom` در اپ مرورگر
- ❌ مخلوط کردن React 17 و 18 API (`ReactDOM.render` منسوخ — از `createRoot` استفاده کنید)

---

## ارتباط با مفاهیم دیگر

- [Quick Start](./Quick-Start.md)
- [Project Structure](./Project-Structure.md)
- [Escape-Hatches/Server-Components](./Escape-Hatches/Server-Components.md) — نصب جدا در Next.js

---

## خلاصه

با Node.js LTS و قالب Vite/React (یا Next.js) آماده توسعه می‌شوید. `react` + `react-dom` دو بستهٔ اصلی هستند.

---

## 📚 منابع

- [React — Installation](https://react.dev/learn/installation)
- [createRoot](https://react.dev/reference/react-dom/client/createRoot)
