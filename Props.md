# Props

> 🧭 پیش‌نیاز: [Components](./Components.md) · بعدی: [State](./State.md)

ویژگی‌ها (`Properties`) — داده‌ای که از والد به فرزند پاس داده می‌شود.

---

## 📖 مفهوم

ورودی کامپوننت‌ها `props` نام دارند؛ `read-only` و یک‌طرفه (`parent` → `child`) هستند. فرزند نباید `props` را تغییر دهد — اگر نیاز به نوشتن دارد، `callback` از والد می‌گیرد (`onChange`).

`children` هم یک `prop` است — محتوای JSX بین تگ‌های کامپوننت.

---

## چرا این ویژگی وجود دارد؟

ارتباط بین کامپوننت‌ها بدون `global state` — والد داده و رفتار را کنترل می‌کند.

---

## چه مشکلی را حل می‌کند؟

پاس دادن داده و `callback` بین کامپوننت‌ها؛ ساخت کامپوننت‌های قابل استفاده مجدد.

---

## ⚙️ نحوه کار

والد attribute می‌نویسد؛ فرزند از اولین argument می‌خواند (معمولاً `destructure`).

- **مقادیر پیش‌فرض:** `function Button({ size = "md" })`
- **پاس JSX:** `<Modal footer={<Button>OK</Button>} />`
- **پاس کامپوننت:** `icon={SearchIcon}` — `elementType` به‌عنوان `prop`
- **تغییرناپذیری (`Immutability`):** هر `render` `props` جدید است؛ تغییر مستقیم ممنوع

```jsx
function ProductCard({ name, price, onAddToCart, children }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{price}</p>
      {children}
      <button onClick={onAddToCart}>افزودن</button>
    </div>
  );
}
```

---

## Syntax

```jsx
<ProductCard name="Margherita" price={12} onAddToCart={handleAdd} />
```

---

## مثال واقعی در پروژه

در fast-react-pizza، `MenuItem` شیء `pizza` و `handler` افزودن به سبد را به‌صورت `props` می‌گیرد — والد (`Menu`) مالک `cart` است.

---

## ⚠️ اشتباهات رایج

- ❌ تغییر `props` در فرزند (`props.items.push()`)
- ❌ spread بی‌هدف `{...props}` — API نامشخص
- ❌ پاس دادن `object`/`function` جدید در هر `render` بدون نیاز → شکستن `memo`

---

## 🚀 Best Practices

- `destructuring` در signature
- مقادیر پیش‌فرض برای `optional` props
- نام `callback` با پیشوند `on` (`onSave`، `onClose`)

---

## ارتباط با مفاهیم دیگر

- [Components](./Components.md)
- [State](./State.md) — تفاوت: `state` داخلی و قابل تغییر توسط همان کامپوننت
- [Lifting State Up](./Lifting-State-Up.md)

---

## خلاصه

ورودی `read-only` کامپوننت = `props`. جریان یک‌طرفه از والد به فرزند؛ برای برگشت رویداد از `callback` استفاده کنید.

---

## 📚 منابع

- [Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [Rendering Lists](https://react.dev/learn/rendering-lists)
