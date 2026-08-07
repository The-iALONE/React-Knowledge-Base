# JSX

> 🧭 پیش‌نیاز: [Project Structure](./Project-Structure.md) · بعدی: [Components](./Components.md)

نحو XML در JavaScript برای نوشتن UI در React.

---

## 📖 مفهوم

نحو JSX شبیه HTML است اما زیر `hood` به `React.createElement()` تبدیل می‌شود. JSX اختیاری نیست در عمل — تقریباً همه پروژه‌های React از آن استفاده می‌کنند چون UI را `declarative` و خوانا می‌کند.

---

## چرا این ویژگی وجود دارد؟

نوشتن UI به‌صورت `declarative` و خوانا — بدون فراخوانی دستی `createElement` برای هر تگ.

---

## چه مشکلی را حل می‌کند؟

ترکیب ساختار HTML و منطق JavaScript در یک فایل؛ بازگشت یک `expression` JSX از کامپوننت.

---

## ⚙️ نحوه کار

- فقط **یک** `root` در `return` (یا Fragment `<>...</>`)
- `{}` برای JavaScript داخل markup
- `className` به‌جای `class`؛ `htmlFor` به‌جای `for`
- تگ‌های خودبسته باید بسته شوند: `<img />`، `<br />`
- `null`، `undefined`، `false` رندر نمی‌شوند؛ `true` هم رندر نمی‌شود (مراقب `&&` با عدد `0`)

---

## Syntax

```jsx
const element = <h1 className="title">سلام، {name}</h1>;

// چند root element:
return (
  <>
    <Header />
    <Main />
  </>
);

// style به‌صورت object
<div style={{ color: "red", fontSize: 14 }} />
```

---

## مثال واقعی در پروژه

در fast-react-pizza، JSX هر `PizzaCard` ترکیب `props` (`pizza.name`، `pizza.price`) و رویداد `onClick` است — بدون دستکاری DOM.

---

## ⚠️ اشتباهات رایج

- ❌ `class` به‌جای `className`
- ❌ بستن نکردن تگ‌های self-closing
- ❌ `if` مستقیم در JSX (از ternary یا `&&` یا متغیر بیرون `return`)
- ❌ `{count && <Badge />}` وقتی `count` می‌تواند `0` باشد

---

## 🚀 Best Practices

- Fragment (`<>...</>`) برای چند `element` بدون `div` اضافی
- پرانتز برای `multi-line` JSX
- منطق شرطی پیچیده را به متغیر یا کامپوننت جدا ببرید

---

## ارتباط با مفاهیم دیگر

- [Components](./Components.md)
- [Conditional Rendering](./Conditional-Rendering.md)
- [Events](./Events.md)

---

## خلاصه

نحو شبیه HTML به نام JSX به JavaScript `compile` می‌شود. قوانین `className`، Fragment و `expression` در `{}` از اصول پایه‌اند.

---

## 📚 منابع

- [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx)
- [JavaScript in JSX with Curly Braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces)
