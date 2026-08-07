# CSS-in-JS

> 🧭 پیش‌نیاز: [Tailwind CSS](./Tailwind-CSS.md) · بعدی: [Next.js — نمای کلی](../Nextjs/README.md)

---

## 📖 مفهوم

در CSS-in-JS استایل داخل JavaScript (یا TypeScript) نوشته می‌شود — معمولاً با کتابخانه‌ای مثل `styled-components` که کامپوننت styled می‌سازد (`styled.button`، `styled(NavLink)`). props کامپوننت می‌تواند مستقیم به CSS map شود (`$active`، template literal).

جزوه Wild Oasis از این روش برای `StyledFilter`، `LoginLayout`، `FullPage` و جدول‌ها استفاده می‌کند. React خودش CSS-in-JS را تجویز نمی‌کند؛ یکی از گزینه‌هاست با trade-off bundle و runtime.

---

## چرا این ویژگی وجود دارد؟

وقتی استایل به props وابسته است (`active`، `type`، `columns`)، نوشتن ده کلاس شرطی در JSX خسته‌کننده می‌شود. CSS-in-JS استایل را کنار منطق کامپوننت نگه می‌دارد و variant را declarative می‌کند.

---

## چه مشکلی را حل می‌کند؟

- استایل پویا از props/state
- wrap کردن کامپوننت third-party (`styled(NavLink)`)
- تم و variant بدون نام‌گذاری دستی کلاس
- co-location کامل (یک فایل `.jsx`)

---

## ⚙️ نحوه کار

### نصب styled-components

```bash
npm install styled-components
```

### کامپوننت پایه

```jsx
// ui/Filter.jsx — الهام از Wild Oasis
import styled, { css } from "styled-components";

const StyledFilter = styled.div`
  border: 1px solid var(--color-grey-100);
  display: flex;
  gap: 0.8rem;
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
`;

const FilterButton = styled.button`
  background: none;
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;
  cursor: pointer;

  ${(props) =>
    props.$active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-0);
    `}
`;

function Filter({ filter, onFilterChange }) {
  return (
    <StyledFilter>
      <FilterButton
        $active={filter === "all"}
        onClick={() => onFilterChange("all")}
      >
        All
      </FilterButton>
      <FilterButton
        $active={filter === "discounted"}
        onClick={() => onFilterChange("discounted")}
      >
        Discounted
      </FilterButton>
    </StyledFilter>
  );
}

export default Filter;
```

> از prefix `$` برای transient props استفاده کنید تا به DOM پاس داده نشوند.

### wrap کردن کامپوننت کتابخانه (جزوه)

به‌جای `styled.a` برای لینک ساده، کامپوننت React Router را wrap کنید:

```jsx
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    color: var(--color-grey-600);
    font-size: 1.6rem;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
  }

  &.active {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
  }
`;
```

`NavLink` خودش کلاس `active` می‌دهد — در styled با `&.active` هدف می‌گیرید.

### layout صفحه

```jsx
// features/authentication/LoginLayout.jsx
import styled from "styled-components";

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: var(--color-grey-50);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
```

---

## تفاوت با گزینه‌های مشابه

| | CSS-in-JS | CSS Modules | Tailwind |
|---|-----------|-------------|----------|
| props → style | عالی | کلاس شرطی | `clsx` + utility |
| runtime JS | دارد | ندارد | ندارد |
| SSR | نیاز به setup | ساده | ساده |
| DevTools | کلاس تولیدی | hash module | utility خوانا |

### و `useInsertionEffect`

کتابخانه‌های CSS-in-JS با runtime `<style>` از [useInsertionEffect](../Hooks/useInsertionEffect.md) برای inject قبل از `layout` استفاده می‌کنند — برای نویسنده اپ معمولی مهم نیست؛ برای انتخاب ابزار مهم است.

### React Compiler

[React Compiler](../Escape-Hatches/React-Compiler.md) و static extraction برخی کتابخانه‌ها نیاز runtime را کم می‌کند — قبل از انتخاب ابزار جدید چک کنید.

---

## مثال واقعی در پروژه

**Wild Oasis:** فیلتر کابین (`StyledFilter` + `FilterButton` با `$active`)، صفحه login (`LoginLayout`)، `FullPage` spinner، جدول `StyledTable`.

مثال کد: [Examples/styling/StyledFilter.jsx](../Examples/styling/StyledFilter.jsx)

---

## 🚀 Best Practices

✅ transient props با `$`  
✅ variables CSS global برای رنگ/فاصله مشترک  
✅ برای منوی `NavLink` هم styled و هم [CSS Modules](./CSS-Modules.md) با `:global` ممکن است — یکی را در پروژه ثابت کنید  
✅ قبل از CSS-in-JS بپرسید: آیا Modules + variables کافی است؟  
❌ styled برای هر `div` کوچک — boilerplate  
❌ props غیر-transient که به DOM leak می‌شوند

---

## ⚠️ اشتباهات رایج

❌ فراموش کردن `styled(NavLink)` و استفاده از `styled.a` برای routing داخلی  
❌ هر فیلتر state با inline style به‌جای یک `FilterButton` styled  
❌ نصب CSS-in-JS در پروژه‌ای که تیم فقط Tailwind می‌خواهد  
❌ نادیده گرفتن هزینه bundle در موبایل

---

## ارتباط با مفاهیم دیگر

- [CSS-Modules](./CSS-Modules.md) — جایگزین سبک‌تر برای بیشتر UI
- [Hooks/useInsertionEffect](../Hooks/useInsertionEffect.md) — inject استایل
- [React-Router/Navigation](../React-Router/Navigation.md) — `NavLink`
- [Patterns/Compound-Components](../Patterns/Compound-Components.md) — Modal styled در جزوه
- [Escape-Hatches/React-Compiler](../Escape-Hatches/React-Compiler.md)
- [Nextjs/README](../Nextjs/README.md) — شروع M10

---

## خلاصه

با CSS-in-JS (مثلاً `styled-components`) استایل را به `props` وصل می‌کنید — مناسب Wild Oasis. برای پروژه جدید ابتدا Modules یا Tailwind را در نظر بگیر؛ CSS-in-JS وقتی variant پویا واقعاً ارزش runtime را دارد.

---

## 📚 منابع

- [styled-components — Docs](https://styled-components.com/docs)
- [React — useInsertionEffect](https://react.dev/reference/react/useInsertionEffect)
- [React — Adding styles](https://react.dev/learn#adding-styles)
