# Quick Start

> 🧭 پیش‌نیاز: [Introduction](./Introduction.md) · بعدی: [Thinking in React](./Thinking-in-React.md)

شروع سریع با یک پروژه React.

---

## 📖 مفهوم

سریع‌ترین راه شروع در سال‌های اخیر: **Vite + React** (سبک، HMR سریع). `create-react-app` منسوخ شده؛ برای پروژه جدید Vite یا فریم‌ورک‌هایی مثل Next.js توصیه می‌شود.

بعد از `npm run dev`، یک اپ کوچک با `src/main.jsx` (نقطه ورود) و `src/App.jsx` (ریشه UI) دارید.

---

## چرا این ویژگی وجود دارد؟

نیاز به `setup` سریع بدون پیکربندی webpack دستی. Vite با `esbuild` و HMR، حلقهٔ بازخورد توسعه را کوتاه می‌کند.

---

## چه مشکلی را حل می‌کند؟

راه‌اندازی پروژه از صفر با `toolchain` استاندارد (build، dev server، JSX).

---

## ⚙️ نحوه کار

1. Node.js LTS نصب کنید
2. پروژه Vite بسازید (`react` یا `react-ts`)
3. `npm install` وابستگی‌ها
4. `npm run dev` — سرور محلی (معمولاً پورت 5173)
5. `src/main.jsx` درخت React را روی `#root` در `index.html` `mount` می‌کند

---

## Syntax

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

---

## 💡 مثال ساده

```jsx
// src/App.jsx
function App() {
  return <h1>Hello React</h1>;
}
export default App;
```

**ساختار معمول Vite:**

```
my-app/
├── index.html          # root DOM
├── src/
│   ├── main.jsx        # createRoot + render
│   ├── App.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

---

## مثال واقعی در پروژه

پروژه‌های course شما (worldwise، fast-react-pizza) با Vite ساخته شده‌اند. همان الگو: `features/` یا `components/` + `services/` برای API.

---

## 🚀 Best Practices

- از Vite استفاده کنید
- JSX در فایل `.jsx` یا `.tsx`
- ESLint + Prettier از ابتدا
- React DevTools را در مرورگر نصب کنید — درخت کامپوننت و `props`/`state` را نشان می‌دهد

---

## ⚠️ اشتباهات رایج

- ❌ استفاده از `create-react-app` برای پروژه جدید
- ❌ فراموش کردن `export default` برای `App`
- ❌ ویرایش `index.html` بدون درک نقش `#root` و `main.jsx`

---

## ارتباط با مفاهیم دیگر

- [Installation](./Installation.md)
- [Project Structure](./Project-Structure.md)
- [Components](./Components.md)

---

## خلاصه

با `npm create vite@latest` → `npm run dev` شروع کدنویسی کنید. Vite قالب مدرن؛ `main.jsx` نقطه ورود است.

---

## 📚 منابع

- [React — Quick Start](https://react.dev/learn)
- [Vite](https://vitejs.dev)
