# Props

ویژگی‌ها (`Properties`) — داده‌ای که از والد به فرزند پاس داده می‌شود.

---

## 📖 مفهوم

ورودی کامپوننت‌ها `props` نام دارند؛ `read-only` و یک‌طرفه (`parent` → `child`) هستند.

---

## چرا این ویژگی وجود دارد؟

ارتباط بین کامپوننت‌ها بدون `global state`.

---

## چه مشکلی را حل می‌کند؟

پاس دادن داده و `callback` بین کامپوننت‌ها.

---

## ⚙️ نحوه کار

والد JSX با attribute می‌نویسد؛ فرزند از اولین argument (`destructured`) می‌خواند.

---

## Syntax

```jsx
function ProductCard({ name, price, onAddToCart }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{price}</p>
      <button onClick={onAddToCart}>Add</button>
    </div>
  );
}
```

---

## مثال واقعی در پروژه

**پروژه fast-react-pizza:** `MenuItem` با `props`: شیء `pizza` + `handler` برای افزودن به سبد.

---

## ⚠️ اشتباهات رایج

❌ تغییر `props` در فرزند
❌ spread بی‌هدف `{...props}`

---

## 🚀 Best Practices

✅ `destructuring` در signature
✅ `default values`

---

## ارتباط با مفاهیم دیگر

- [Components](./Components.md)
- [Lifting State Up](./Lifting-State-Up.md)

---

## خلاصه

ورودی `read-only` کامپوننت = `props`.

---

## 📚 منابع

- [React Documentation](https://react.dev)
