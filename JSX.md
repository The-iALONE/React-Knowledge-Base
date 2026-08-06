# JSX

نحو XML در JavaScript برای نوشتن UI در React.

---

## 📖 مفهوم

نحو JSX شبیه HTML است اما زیر `hood` به `React.createElement()` تبدیل می‌شود.

---

## چرا این ویژگی وجود دارد؟

نوشتن UI به‌صورت `declarative` و خوانا.

---

## چه مشکلی را حل می‌کند؟

ترکیب HTML و JavaScript در یک فایل.

---

## ⚙️ نحوه کار

در JSX فقط یک `expression` برمی‌گرداند. `{}` برای JavaScript است. `className` به‌جای `class` استفاده می‌شود.

---

## Syntax

```jsx
const element = <h1 className="title">Hello, {name}</h1>;

// چند root element:
return (
  <>
    <Header />
    <Main />
  </>
);
```

---

## ⚠️ اشتباهات رایج

❌ `class` به‌جای `className`
❌ بستن تگ‌های self-closing (`<img />`)
❌ `if` مستقیم در JSX (از ternary یا `&&` استفاده کنید)

---

## 🚀 Best Practices

✅ Fragment (`<>...</>`) برای چند `element`
✅ پرانتز برای `multi-line` JSX

---

## ارتباط با مفاهیم دیگر

- [Components](./Components.md)
- [Conditional Rendering](./Conditional-Rendering.md)

---

## خلاصه

نحو شبیه HTML به نام JSX به JavaScript `compile` می‌شود.

---

## 📚 منابع

- [React Documentation](https://react.dev)
- [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx)
