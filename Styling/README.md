# Styling — نمای کلی

> 🧭 پیش‌نیاز: [State in URL](../React-Router/State-In-URL.md) · [Components](../Components.md) · بعدی: [Global CSS](./Global-CSS.md)

---

## 📖 مفهوم

راهنمای استایل‌دهی در اپ React — از CSS سراسری و `className` تا CSS Modules، Tailwind، و CSS-in-JS. در React خودِ فریم‌ورک روش خاصی برای CSS تجویز نمی‌کند؛ شما فایل CSS، ماژول، utility class، یا کتابخانه styled را انتخاب می‌کنید.

وقتی دو کامپوننت جدا هر دو کلاس `nav` دارند، CSS معمولی ممکن است استایل‌ها را قاطی کند؛ CSS Modules یا Tailwind این مشکل را با scope یا کلاس‌های یکتا حل می‌کنند. جزوه دوره (Worldwise) روی CSS Modules و variables تمرکز دارد؛ Wild Oasis از `styled-components` استفاده می‌کند.

---

## چرا این ویژگی وجود دارد؟

UI بدون استایل قابل استفاده نیست، ولی «همه چیز در یک `index.css`» در پروژه بزرگ نگه‌داری را سخت می‌کند. روش‌های مختلف trade-off دارند: سادگی، scope، bundle size، و DX تیم.

---

## چه مشکلی را حل می‌کند؟

- جداسازی استایل هر کامپوننت از بقیه
- تم سراسری با CSS variables در `:root`
- استایل شرطی (`type="primary"` روی Button)
- highlight منوی فعال (`NavLink` + `:global(.active)`)
- انتخاب روش مناسب برای تیم و پروژه

---

## ⚙️ نحوه کار — چهار روش اصلی

| روش | ایده | پروژهٔ جزوه | مناسب برای |
|-----|------|-------------|------------|
| **Global CSS** | یک فایل برای reset، variables، utility | Worldwise `index.css` | پایهٔ همهٔ پروژه‌ها |
| **CSS Modules** | `*.module.css` با کلاس‌های hash‌شده | Worldwise Button، City | SPA با Vite/CRA |
| **Tailwind** | کلاس utility در JSX | Wild Oasis (Next.js) | سرعت UI، design system |
| **CSS-in-JS** | `styled.div` در همان فایل JS | Wild Oasis Filter، Login | props پویا، تم داخلی |

همچنین `style={{ }}` برای مقادیر وابسته به JavaScript (مثلاً اندازه آواتار از `user.imageSize`) — [react.dev — Adding styles](https://react.dev/learn#adding-styles).

---

## مسیر یادگیری پیشنهادی

```
Global CSS → CSS Modules → Tailwind CSS → CSS-in-JS
```

پایه را با variables و reset بگذار، scope محلی را با Modules یاد بگیر، بعد utility-first و در نهایت CSS-in-JS را برای مقایسه ببین.

---

## فهرست مستندات

| موضوع | فایل | بهترین برای |
|-------|------|-------------|
| CSS سراسری و `style` inline | [Global-CSS](./Global-CSS.md) | `index.css`، variables |
| scope محلی | [CSS-Modules](./CSS-Modules.md) | `*.module.css`، `:global` |
| utility-first | [Tailwind-CSS](./Tailwind-CSS.md) | کلاس در JSX |
| styled components | [CSS-in-JS](./CSS-in-JS.md) | `styled-components` |

---

## درخت تصمیم — کدام روش؟

```
نیاز به استایل پویا از props زیاد؟
  ├─ بله → CSS-in-JS یا Tailwind + clsx
  └─ خیر → تیم Tailwind دارد؟
        ├─ بله → Tailwind
        └─ خیر → CSS Modules + Global variables
```

| معیار | Global | Modules | Tailwind | CSS-in-JS |
|-------|--------|---------|----------|-----------|
| یادگیری | آسان | متوسط | متوسط | متوسط |
| collision کلاس | زیاد | کم | خیلی کم | کم |
| bundle runtime | ندارد | ندارد | کم (purge) | دارد |
| جزوه دوره | ✅ Worldwise | ✅ Worldwise | Next.js M10 | ✅ Wild Oasis |

---

## تفاوت با Next.js (M10)

| | Styling در SPA (M9) | Next.js (M10) |
|---|---------------------|---------------|
| import CSS | `main.jsx` → `index.css` | `layout.js` → `globals.css` |
| Tailwind config | `tailwind.config.js` در root | همان + `@/` alias |
| CSS Modules | `Component.module.css` | همان؛ در RSC محدودیت import |
| جزئیات | این ماژول | [Project-Setup](../Nextjs/Project-Setup.md) |

---

## مثال واقعی در پروژه

- **Worldwise:** `index.css` با `--color-brand--*` + `City.module.css` + `PageNav` با `NavLink`
- **Wild Oasis:** `StyledFilter`، `LoginLayout` با `styled-components`
- **fast-react-pizza:** استایل ساده‌تر؛ ترکیب global + component

مثال‌های کد: [Examples/styling/](../Examples/styling/)

---

## 🚀 Best Practices

✅ variables تم (`:root`) در global؛ جزئیات کامپوننت در module یا utility  
✅ از element selector خام (`h1`، `ul`) در module پرهیز کن — scope را می‌شکند  
✅ `NavLink` برای منو؛ استایل active با module یا callback `className`  
✅ یک روش غالب در پروژه انتخاب کن — مخلوط بی‌قاعده نگه‌داری را سخت می‌کند  
❌ inline style برای همهٔ UI (فقط مقادیر پویا)  
❌ `!important` برای fix collision — روش scope را عوض کن

---

## ⚠️ اشتباهات رایج

❌ `class` به‌جای `className` در JSX  
❌ import ماژول CSS بدون استفاده از `styles.xxx`  
❌ استایل global روی `ul`/`h1` داخل module که روی کل اپ اثر می‌گذارد  
❌ CSS-in-JS سنگین بدون دلیل وقتی Modules کافی است

---

## ارتباط با مفاهیم دیگر

- [JSX](../JSX.md) — `className` و `style`
- [React-Router/Navigation](../React-Router/Navigation.md) — `NavLink` و کلاس active
- [Hooks/useInsertionEffect](../Hooks/useInsertionEffect.md) — injection CSS-in-JS
- [Escape-Hatches/React-Compiler](../Escape-Hatches/React-Compiler.md) — کاهش نیاز runtime CSS
- [Performance/Code-Splitting](../Performance/Code-Splitting.md) — CSS هم با import lazy می‌آید
- [Nextjs/Project-Setup](../Nextjs/Project-Setup.md) — Tailwind در Next.js (M10)

---

## خلاصه

در React روش واحد برای CSS نیست: global برای پایه، Modules برای scope محلی (جزوه Worldwise)، Tailwind برای utility، CSS-in-JS برای Wild Oasis. با [Global-CSS](./Global-CSS.md) شروع کن و بر اساس پروژه عمیق‌تر برو.

---

## 📚 منابع

- [React — Adding styles](https://react.dev/learn#adding-styles)
- [MDN — CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Vite — CSS](https://vite.dev/guide/features#css)
