# Quick Start

شروع سریع با یک پروژه React.

---

## 📖 مفهوم

سریع‌ترین راه شروع: `create-react-app` (قدیمی) یا Vite + React (توصیه فعلی).

---

## چرا این ویژگی وجود دارد؟

نیاز به `setup` سریع بدون پیکربندی پیچیده.

---

## چه مشکلی را حل می‌کند؟

راه‌اندازی پروژه از صفر.

---

## ⚙️ نحوه کار

از Vite به‌عنوان `bundler` سبک استفاده می‌شود؛ HMR سریع دارد.

---

## Syntax

```bash
npm create vite@latest my-app -- --template react
npm install
cd my-app
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

---

## مثال واقعی در پروژه

پروژه‌های course شما (worldwise، fast-react-pizza) با Vite ساخته شده‌اند.

---

## 🚀 Best Practices

✅ از Vite استفاده کنید
✅ JSX در فایل `.jsx` یا `.tsx`
✅ ESLint + Prettier از ابتدا

---

## ارتباط با مفاهیم دیگر

- [Installation](./Installation.md)
- [Project Structure](./Project-Structure.md)

---

## خلاصه

با `npm create vite@latest` → `npm run dev` شروع کدنویسی کنید.

---

## 📚 منابع

- [React Documentation](https://react.dev)
- [Vite](https://vitejs.dev)
