# Components

ساختن و استفاده از کامپوننت‌های React.

---

## 📖 مفهوم

کامپوننت تابعی (`function component`) واحد سازماندهی UI است. هر کامپوننت JSX برمی‌گرداند.

---

## چرا این ویژگی وجود دارد؟

تقسیم UI به قطعات قابل استفاده مجدد.

---

## چه مشکلی را حل می‌کند؟

کد تکراری و غیرقابل نگهداری.

---

## ⚙️ نحوه کار

کامپوننت = تابع با نام `CapitalCase` که JSX `return` می‌کند.

---

## Syntax

```jsx
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}

// استفاده:
<Button label="Save" onClick={handleSave} />
```

---

## مثال واقعی در پروژه

**پروژه worldwise:** `CityItem`, `Sidebar`, `Map` — هر کدام یک `responsibility`.

---

## ⚠️ اشتباهات رایج

❌ نام با حرف کوچک (`function button`)
❌ `mutate` کردن `props`

---

## 🚀 Best Practices

✅ یک فایل = یک کامپوننت اصلی
✅ `destructuring` `props` در signature

---

## ارتباط با مفاهیم دیگر

- [Props](./Props.md)
- [State](./State.md)

---

## خلاصه

کامپوننت = تابع UI قابل ترکیب.

---

## 📚 منابع

- [React Documentation](https://react.dev)
