# Global CSS

> 🧭 پیش‌نیاز: [Styling — نمای کلی](./README.md) · [JSX](../JSX.md) · بعدی: [CSS Modules](./CSS-Modules.md)

---

## 📖 مفهوم

استایل‌دهی سراسری یعنی فایل CSS که یک‌بار import می‌شود و روی کل اپ اثر می‌گذارد — معمولاً `index.css` یا `globals.css`. شامل reset، typography، CSS variables در `:root`، و کلاس‌های utility مشترک مثل `.cta` است.

در جزوه Worldwise، `main.jsx` فایل `index.css` را import می‌کند؛ رنگ‌های برند (`--color-brand--1`) در `:root` تعریف شده‌اند تا در CSS Modules هم با `var(--color-brand--2)` در دسترس باشند.

---

## چرا این ویژگی وجود دارد؟

برخی قوانین واقعاً global هستند: `box-sizing`، فونت body، reset margin. تکرار آن‌ها در هر module بی‌معناست. variables تم هم یک منبع حقیقت برای رنگ و spacing می‌خواهند.

---

## چه مشکلی را حل می‌کند؟

- یکنواختی typography و رنگ در کل اپ
- reset مرورگر (`* { margin: 0 }`)
- import فونت و CSS کتابخانهٔ third-party (مثلاً Leaflet)
- کلاس‌های مشترک (`.cta`) بدون تکرار در هر کامپوننت

---

## ⚙️ نحوه کار

### `className` در JSX

در JSX به‌جای attribute HTML `class` از `className` استفاده می‌شود:

```jsx
<img className="avatar" alt="Profile" />
```

### import در entry

در فایل `main.jsx` (ریشهٔ پروژه Vite/CRA):

```jsx
// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### ساختار `index.css` (جزوه Worldwise)

```css
/* index.css */

@import "https://unpkg.com/leaflet@1.9.3/dist/leaflet.css";
@import "https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap";

/* variables سراسری — در CSS Modules هم قابل استفاده‌اند */
:root {
  --color-brand--1: #ffb545;
  --color-brand--2: #00c46a;
  --color-dark--0: #242a2e;
  --color-dark--1: #2d3439;
  --color-dark--2: #42484d;
  --color-light--1: #aaa;
  --color-light--2: #ececec;
  --color-light--3: #d6dee0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
}

html {
  font-size: 62.5%; /* 1rem ≈ 10px */
  box-sizing: border-box;
}

body {
  font-family: "Manrope", sans-serif;
  color: var(--color-light--2);
  font-weight: 400;
  line-height: 1.6;
}

label {
  font-size: 1.6rem;
  font-weight: 600;
}

input,
textarea {
  width: 100%;
  padding: 0.8rem 1.2rem;
  font-family: inherit;
  font-size: 1.6rem;
  border: none;
  border-radius: 5px;
  background-color: var(--color-light--3);
  transition: all 0.2s;
}

input:focus {
  outline: none;
  background-color: #fff;
}

.cta:link,
.cta:visited {
  display: inline-block;
  background-color: var(--color-brand--2);
  color: var(--color-dark--1);
  text-transform: uppercase;
  text-decoration: none;
  font-size: 1.6rem;
  font-weight: 600;
  padding: 1rem 3rem;
  border-radius: 5px;
}
```

### استایل inline با `style`

وقتی مقدار از JavaScript می‌آید (نه کلاس ثابت)، از `style` با object استفاده کنید — [react.dev](https://react.dev/learn#adding-styles):

```jsx
const user = { imageSize: 90 };

<img
  className="avatar"
  src={user.imageUrl}
  alt={"Photo of " + user.name}
  style={{
    width: user.imageSize,
    height: user.imageSize,
  }}
/>
```

`style={{}}` یک object JavaScript معمولی داخل `{}` JSX است — syntax خاص React نیست.

---

## تفاوت با گزینه‌های مشابه

| | Global CSS | CSS Modules | inline `style` |
|---|------------|-------------|----------------|
| scope | کل document | فایل/کامپوننت | یک element |
| pseudo (`:hover`) | ✅ | ✅ | ❌ |
| مقادیر از JS | فقط با variables | با `var()` | ✅ مستقیم |
| collision | ممکن است | نادر | ندارد |

---

## مثال واقعی در پروژه

در Worldwise، فرم‌ها و labelها global استایل دارند؛ دکمهٔ CTA با کلاس `.cta` در چند صفحه reuse می‌شود. کامپوننت‌های `City` و `Button` از variables همان `:root` در module خود استفاده می‌کنند.

---

## 🚀 Best Practices

✅ variables تم در `:root`؛ مقادیر ثابت را hard-code نکن در هر module  
✅ reset و typography global؛ layout جزئی در module  
✅ فونت و CSS third-party را در global import کن  
✅ `inline style` فقط برای مقادیر runtime (اندازه، موقعیت از state)  
❌ selectorهای element (`h1`، `ul`) که روی کل اپ اثر می‌گذارند — مگر عمداً global  
❌ هزار خط CSS در یک فایل بدون ساختار

---

## ⚠️ اشتباهات رایج

❌ فراموش کردن import `index.css` در `main.jsx`  
❌ استفاده از `class` در JSX به‌جای `className`  
❌ `style="width: 100px"` (string HTML) به‌جای object  
❌ variables تکراری در هر module به‌جای `:root`

---

## ارتباط با مفاهیم دیگر

- [CSS-Modules](./CSS-Modules.md) — scope محلی؛ variables از global می‌خواند
- [JSX](../JSX.md) — `className` و attributeها
- [Components](../Components.md) — colocation فایل‌ها
- [Nextjs/Project-Setup](../Nextjs/Project-Setup.md) — `globals.css` در layout (M10)

---

## خلاصه

پایهٔ استایل اپ، Global CSS است: import در `main.jsx`، variables در `:root`، reset و utility مشترک. برای استایل مخصوص هر کامپوننت به [CSS-Modules](./CSS-Modules.md) برو؛ برای مقادیر پویا از `style` object استفاده کن.

---

## 📚 منابع

- [React — Adding styles](https://react.dev/learn#adding-styles)
- [MDN — :root](https://developer.mozilla.org/en-US/docs/Web/CSS/:root)
- [MDN — Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
