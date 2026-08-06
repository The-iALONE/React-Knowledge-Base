# Thinking in React

روش طراحی UI با تفکر `component-based`.

---

## 📖 مفهوم

با شکستن UI به کامپوننت‌های سلسله‌مراتبی در React، `state` را تعریف کنید و جریان داده را مشخص کنید.

---

## چرا این ویژگی وجود دارد؟

طراحی بدون ساختار منجر به `spaghetti code` می‌شود.

---

## چه مشکلی را حل می‌کند؟

سازماندهی UI پیچیده.

---

## ⚙️ نحوه کار

1. رابط کاربری را به کامپوننت بشکنید
2. نسخه استاتیک با `props` بسازید
3. `state` کمینه را شناسایی کنید
4. `state` را `colocate` کنید
5. `inverse data flow` برای رویدادها

---

## مثال واقعی در پروژه

**داشبورد رزرو کابین (Wild Oasis):** `CabinList` → `CabinItem` → `ReservationForm`. `state` رزرو در URL یا Context؛ لیست کابین از React Query.

---

## 🚀 Best Practices

✅ کامپوننت‌های کوچک و تک‌مسئولیتی
✅ `state` را پایین‌ترین سطح ممکن نگه دارید

---

## ارتباط با مفاهیم دیگر

- [Components](./Components.md)
- [State](./State.md)
- [Lifting State Up](./Lifting-State-Up.md)

---

## خلاصه

درخت کامپوننت + `state` کمینه + یک‌طرفه `data flow` = UI.

---

## 📚 منابع

- [React Documentation](https://react.dev)
- [Thinking in React](https://react.dev/learn/thinking-in-react)
