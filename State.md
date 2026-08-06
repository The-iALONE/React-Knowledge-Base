# State

داده‌ای که با تغییر آن، کامپوننت بازرندر می‌شود.

---

## 📖 مفهوم

دادهٔ داخلی کامپوننت را `state` می‌نامند (برخلاف `props`). با `useState` یا `useReducer` مدیریت می‌شود.

---

## چرا این ویژگی وجود دارد؟

رابط کاربری باید با داده همگام باشد.

---

## چه مشکلی را حل می‌کند؟

نگهداری و به‌روزرسانی داده تعاملی.

---

## ⚙️ نحوه کار

با `setState` → `trigger` کردن `re-render` → محاسبه JSX جدید در React → به‌روزرسانی DOM.

---

## Syntax

```jsx
const [count, setCount] = useState(0);
setCount((prev) => prev + 1); // functional update
```

---

## مثال واقعی در پروژه

**داشبورد:** فیلتر کابین‌ها (`filter` در `state`)، مرتب‌سازی (`sortBy` در `state`)، صفحه‌بندی (`page` در `state`).

---

## ⚠️ اشتباهات رایج

❌ `mutate` مستقیم `state` (`state.push()`)
❌ فراخوانی `setState` در `render`

---

## 🚀 Best Practices

✅ به‌روزرسانی `functional` برای `state` وابسته به قبلی
✅ `colocate` کردن `state`

---

## ارتباط با مفاهیم دیگر

- [Hooks/useState](./Hooks/useState.md)
- [Lifting State Up](./Lifting-State-Up.md)

---

## خلاصه

معنی `state` = دادهٔ `reactive` که `re-render` را `trigger` می‌کند.

---

## 📚 منابع

- [React Documentation](https://react.dev)
