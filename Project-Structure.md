# Project Structure

ساختار پیشنهادی پروژه React.

---
## 📖 مفهوم

ساختار `feature-based` یا `layer-based` بسته به اندازه پروژه.

---
## چرا این ویژگی وجود دارد؟

سازماندهی فایل‌ها در پروژه بزرگ.

---
## چه مشکلی را حل می‌کند؟

پیدا کردن سریع فایل‌ها.

---
## ⚙️ نحوه کار

```
src/
├── components/   # UI مشترک
├── features/       # ماژول‌های دامنه (cart, auth)
├── hooks/          # custom hooks
├── contexts/       # React contexts
├── services/       # API calls
├── pages/          # route-level components
├── utils/
└── App.jsx
```

---
## مثال واقعی در پروژه

**پروژه fast-react-pizza:** `features/cart/`, `features/menu/`, `ui/`, `services/apiRestaurant.js`

---
## 🚀 Best Practices

✅ فایل‌های مرتبط را `colocate` کنید
✅ پوشه `feature` برای `scale`

---
## ارتباط با مفاهیم دیگر

- [Components](./Components.md)
- [Custom Hooks](./Custom-Hooks.md)

---
## خلاصه

ساختار `feature-based` برای پروژه‌های متوسط به بالا.

---
## 📚 منابع

- [React Documentation](https://react.dev)
