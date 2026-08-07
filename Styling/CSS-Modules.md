# CSS Modules

> 🧭 پیش‌نیاز: [Global CSS](./Global-CSS.md) · بعدی: [Tailwind CSS](./Tailwind-CSS.md)

---

## 📖 مفهوم

در CSS Modules هر فایل `*.module.css` فقط به کامپوننتی که آن را import کرده scope می‌شود. build tool (Vite، webpack، Lightning CSS) نام کلاس را به یک شناسه یکتا تبدیل می‌کند — مثلاً `Button_error_ax7yz` (فرمت CRA: `[filename]_[classname]__[hash]`) — تا دو فایل جدا هر دو `.nav` داشته باشند بدون collision.

طبق [spec رسمی CSS Modules](https://github.com/css-modules/css-modules): هر فایل به **دو خروجی** compile می‌شود — CSS نهایی (global-safe) و یک **object داده** که نام‌های خوانا را به کلاس hash‌شده map می‌کند. در JSX مقدار `styles.btn` همان map است.

در JSX مقدار `styles.btn` در runtime همان کلاس hash‌شده است؛ شبیه CSS معمولی می‌نویسید ولی collision سراسری ندارید. جزوه Worldwise (Button، City، PageNav) روی این روش بنا شده است.

> **منبع رسمی:** [css-modules/css-modules](https://github.com/css-modules/css-modules) (spec) · پیاده‌سازی در React SPA: [Vite — CSS Modules](https://vite.dev/guide/features#css-modules) (Lightning CSS) · [react.dev](https://react.dev/learn#adding-styles) روش CSS را تجویز نمی‌کند و به docs ابزار build ارجاع می‌دهد.

---

## چرا این ویژگی وجود دارد؟

در CSS کلاسیک، یک selector `.nav` در دو فایل می‌تواند استایل منوی اصلی را با sidebar خراب کند. Modules بدون نیاز به نام‌گذاری دستی مثل `header-nav` و `sidebar-nav`، scope را در build time تضمین می‌کند.

---

## چه مشکلی را حل می‌کند؟

- collision کلاس بین کامپوننت‌ها
- نگه‌داری استایل کنار کامپوننت (`Button.jsx` + `Button.module.css`)
- variant با چند کلاس (`primary`، `back`)
- استایل `NavLink` فعال با `:global(.active)`

---

## ⚙️ نحوه کار

### نام‌گذاری و import

فایل باید پسوند `*.module.css` داشته باشد:

```jsx
// Button.jsx
import styles from "./Button.module.css";

function Button({ children, onClick, type }) {
  return (
    <button
      onClick={onClick}
      className={`${styles.btn} ${styles[type]}`}
    >
      {children}
    </button>
  );
}

export default Button;
```

```css
/* Button.module.css */
.btn {
  color: inherit;
  text-transform: uppercase;
  padding: 0.8rem 1.6rem;
  font-family: inherit;
  font-size: 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.primary {
  font-weight: 700;
  background-color: var(--color-brand--2);
  color: var(--color-dark--1);
}

.back {
  font-weight: 600;
  background: none;
  border: 1px solid currentColor;
}
```

`type="primary"` → کلاس `styles.primary` اضافه می‌شود.

### فرمت نام hash (Create React App / webpack)

وقتی دو فایل هر دو `.error` دارند:

```css
/* Button.module.css */
.error { background-color: red; }

/* another-stylesheet.css — global */
.error { color: red; }
```

```jsx
import styles from "./Button.module.css";
import "./another-stylesheet.css";

<button className={styles.error}>Error Button</button>
```

خروجی HTML — پس‌زمینه قرمز، متن قرمز **نمی‌شود** (collision نیست):

```html
<button class="Button_error_ax7yz">Error Button</button>
```

### Sass / Less / Stylus

با pre-processor هم کار می‌کند — پسوند `.module` قبل از extension:

```
Button.module.scss
Button.module.sass
Button.module.less
```

نیاز به نصب `sass`/`less`/`stylus` در پروژه (مثلاً Vite: `npm add -D sass`).

### `composes` — ترکیب کلاس‌ها (spec رسمی)

به‌جای تکرار استایل، یک کلاس را داخل کلاس دیگر «بچسبانید»:

```css
/* Base.module.css */
.baseBtn {
  padding: 0.8rem 1.6rem;
  border-radius: 5px;
  cursor: pointer;
}

.primary {
  composes: baseBtn;
  background-color: var(--color-brand--2);
  color: var(--color-dark--1);
}
```

```jsx
// فقط styles.primary کافی است — baseBtn هم اعمال می‌شود
<button className={styles.primary}>Save</button>
```

چند کلاس همزمان:

```css
.card {
  composes: paddingLarge rounded from './utils.module.css';
}
```

از کلاس **global**:

```css
.search {
  composes: search-widget from global;
}
```

> `composes` فقط برای selector تک‌کلاسهٔ local کار می‌کند. pseudo-classهای کلاس مبدأ (مثل `:hover`) همراه منتقل می‌شوند. وابستگی دایره‌ای تعریف‌نشده است — از سلسله‌مراتب ساده استفاده کنید.

### `camelCase` در import (Vite)

اگر در CSS از `kebab-case` استفاده کردید:

```css
.apply-color { color: red; }
```

با تنظیم `css.modules.localsConvention: 'camelCaseOnly'` در `vite.config.js`:

```js
// vite.config.js
export default {
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
};
```

می‌توانید named import بزنید:

```jsx
import { applyColor } from "./example.module.css";
```

### TypeScript

در پروژه Vite، `vite/client` در `tsconfig.json` نوع `*.module.css` را می‌دهد:

```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

یا در `vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
```

### مثال City (جزوه)

```jsx
// City.jsx
import styles from "./City.module.css";

function City() {
  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>
    </div>
  );
}
```

```css
/* City.module.css */
.city {
  padding: 2rem 3rem;
  background-color: var(--color-dark--2);
  border-radius: 7px;
}

.row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* selector تو در تو — فقط داخل .city hash‌شده */
.city h6 {
  text-transform: uppercase;
  font-size: 1.1rem;
  color: var(--color-light--1);
}
```

### چه کاری نکنید

از element selector خام **بدون** wrapper module استفاده نکنید:

```css
/* ❌ در module — روی همه ulهای اپ اثر می‌گذارد */
ul { list-style: none; }

/* ✅ داخل scope */
.nav ul { list-style: none; }
```

### `:global()` و `:local()` — scope

پیش‌فرض: همه selectorها **local** (hash می‌شوند). `:global` استثناست:

```css
/* فقط .bar global می‌ماند؛ .foo local */
.foo :global(.bar) {
  color: red;
}

/* معادل */
.foo .bar { color: red; }  /* هر دو .bar داخل .foo local هستند */
```

برعکس، `:local(.name)` صریحاً local می‌کند (در spec برای edge caseها).

### `:global()` — کلاس کاملاً global

وقتی کلاس باید global بماند (بدون hash):

```css
/* در هر module.css */
:global(.test) {
  background-color: cyan;
}
```

حالا `className="test"` در هر جای اپ همان استایل را می‌گیرد.

### CSS variables محلی (Lightning CSS / Vite)

در پیاده‌سازی‌های مدرن (Lightning CSS)، با `dashedIdents` متغیرهای CSS هم scope می‌شوند:

```css
:root {
  --accent-color: hotpink;
}

.button {
  background: var(--accent-color);
}
```

compile می‌شود به نام hash‌شده مثل `--EgL3uq_accent-color` — collision بین فایل‌ها ندارید. import از فایل دیگر:

```css
.button {
  background: var(--accent-color from './vars.module.css');
}
```

> در بسیاری پروژه‌ها (مثل Worldwise) variables در `:root` **global** نگه‌داری می‌شوند — هر دو الگو معتبر است.

### `NavLink` و کلاس active

`NavLink` به لینک فعال کلاس `active` می‌دهد. در module:

```css
/* PageNav.module.css */
.nav :global(.active) {
  background-color: grey;
}
```

یا با callback در JSX (روش ترجیحی در [Navigation](../React-Router/Navigation.md)):

```jsx
<NavLink
  to="/login"
  className={({ isActive }) =>
    isActive ? styles.activeLink : undefined
  }
>
  Log in
</NavLink>
```

### Snippet VS Code (جزوه)

```json
"importCSSModule": {
  "prefix": "csm",
  "scope": "javascript,typescript,javascriptreact",
  "body": ["import styles from './${TM_FILENAME_BASE}.module.css'"],
  "description": "Import CSS Module as `styles`"
}
```

### react-icons (نکتهٔ جزوه)

برای آیکون در منو:

```bash
npm i react-icons
```

```jsx
import { HiOutlineCalendarDays, HiOutlineHome } from "react-icons/hi2";

<HiOutlineCalendarDays />
```

---

## تفاوت با گزینه‌های مشابه

| | CSS Modules | Global CSS | Tailwind |
|---|-------------|------------|----------|
| فایل جدا | `*.module.css` | `index.css` | کمتر |
| collision | خیلی کم | زیاد | خیلی کم |
| `composes` | ✅ (spec) | ❌ | ❌ |
| pseudo / nested | ✅ کامل | ✅ | محدود به utility |
| Sass/Less module | ✅ `.module.scss` | ✅ | — |
| runtime JS | ندارد | ندارد | ندارد |

---

## مثال واقعی در پروژه

**Worldwise:** `Button.module.css` با variantهای `primary`/`back`/`position`؛ `City.module.css` با layout کارت شهر؛ `PageNav.module.css` برای منو.

مثال کد: [Examples/styling/](../Examples/styling/)

---

## 🚀 Best Practices

✅ یک module per component (یا feature کوچک)  
✅ از `var(--color-*)` در module برای هماهنگی با [Global-CSS](./Global-CSS.md)  
✅ `composes` برای reuse استایل پایه بدون تکرار property  
✅ ترکیب کلاس: template string یا `clsx`/`classnames`  
✅ `:global()` فقط وقتی واقعاً لازم است (مثلاً کلاس third-party)  
✅ در Lightning CSS حالت `pure` خطای selector بدون class/id (`div {}`) می‌دهد — کمک می‌کند اشتباه global ننویسید  
❌ element selector خام (`h1`، `ul`) در root module  
❌ import module در global CSS  
❌ `composes` دایره‌ای بین فایل‌ها

---

## ⚠️ اشتباهات رایج

❌ نام فایل `Button.css` بدون `.module` — scope نمی‌شود  
❌ `className="btn"` به‌جای `className={styles.btn}`  
❌ فراموش کردن backtick در `` `${styles.btn} ${styles.primary}` ``  
❌ انتظار داشتن `styles` شامل نام کلاس خام browser باشد  
❌ `composes` از چند فایل با property متضاد برای یک selector  
❌ dynamic class name در import: `` styles[`btn-${type}`] `` — build نمی‌تواند map کند

---

## ارتباط با مفاهیم دیگر

- [Global-CSS](./Global-CSS.md) — variables و reset
- [React-Router/Navigation](../React-Router/Navigation.md) — `NavLink` و active state
- [Components](../Components.md) — colocation
- [CSS-in-JS](./CSS-in-JS.md) — جایگزین برای استایل پویا
- [Nextjs — CSS Modules](../Nextjs/Project-Setup.md) — ordering و توصیه Next.js (M10)
- [Project-Structure](../Project-Structure.md) — نام فایل در کنار کامپوننت

---

## خلاصه

با `import styles from "./X.module.css"` و `className={styles.xxx}` در CSS Modules، collision کلاس حل می‌شود. spec رسمی: `composes` برای mixin، `:global`/`:local` برای scope، و map نام→hash. variables از `:root` global یا scoped (Lightning CSS). `NavLink` با callback یا `:global(.active)`. هستهٔ جزوه Worldwise + تکمیل از [css-modules/css-modules](https://github.com/css-modules/css-modules).

---

## 📚 منابع

- [CSS Modules — Official spec (GitHub)](https://github.com/css-modules/css-modules) — **Source of Truth**
- [CSS Modules — Composition](https://github.com/css-modules/css-modules/blob/master/docs/composition.md) — `composes`، `:global`، `:local`
- [CSS Modules — Get started](https://github.com/css-modules/css-modules/blob/master/docs/get-started.md) — ابزارها و فریم‌ورک‌ها
- [Vite — CSS Modules](https://vite.dev/guide/features#css-modules) — `.module.css`، `localsConvention`، pre-processors
- [Lightning CSS — CSS Modules](https://lightningcss.dev/css-modules.html) — `composes`، scoped variables، `pure` mode
- [Create React App — CSS Modules](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/) — فرمت `[filename]_[name]__[hash]`
- [Next.js — CSS Modules](https://nextjs.org/docs/app/getting-started/css#css-modules) — App Router (M10)
- [React — Adding styles](https://react.dev/learn#adding-styles) — `className`؛ ارجاع به build tool
