# Portals — رندر خارج از والد

> 🧭 پیش‌نیاز: [Error Boundaries](./Error-Boundaries.md) · بعدی: [Custom Hooks](./Custom-Hooks.md)

> با `createPortal` می‌توانید فرزند را در DOM node دیگری (مثلاً `document.body`) رندر کنید، در حالی که در درخت React زیر همان والد باقی می‌ماند.

## 📖 مفهوم

یکی از APIهای `react-dom` است که `Portal` نام دارد. JSX را در جای دیگری از DOM قرار می‌دهد بدون اینکه موقعیت کامپوننت در `React tree` عوض شود. `event bubbling` همچنان از طریق `React tree` بالا می‌رود.

## چرا این ویژگی وجود دارد؟

مودال، `tooltip` و `dropdown` اغلب باید از `overflow: hidden` والد فرار کنند و روی `body` رندر شوند.

## چه مشکلی را حل می‌کند؟

- `overflow: hidden` والد روی مودال تأثیر نمی‌گذارد
- `z-index` `stacking context` والد محدود نمی‌کند
- دسترسی‌پذیری و `focus trap` برای مودال

## ⚙️ نحوه کار

```jsx
import { createPortal } from "react-dom";

function Modal({ children, onClose }) {
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}>×</button>
        {children}
      </div>
    </div>,
    document.body
  );
}
```

| آرگومان | توضیح |
|---------|--------|
| `children` | JSX برای رندر |
| `domNode` | DOM node مقصد (معمولاً `document.body`) |

## مثال واقعی در پروژه

**تأیید حذف کابین:** مودال با Portal روی `document.body` رندر می‌شود تا `overflow: hidden` جدول تأثیر نگذارد. الگوی Compound Component: [Examples/patterns/CompoundModal.jsx](./Examples/patterns/CompoundModal.jsx)

```jsx
// Compound Modal pattern
<ModalProvider>
  <Modal.Open>Delete cabin</Modal.Open>
  <Modal>
    <h2>Are you sure?</h2>
    <Modal.Close>Cancel</Modal.Close>
  </Modal>
</ModalProvider>
```

## ⚠️ اشتباهات رایج

- ❌ استفاده از Portal بدون بستن `modal` با Escape یا `click outside`
- ❌ فراموش `stopPropagation` روی محتوای مودال
- ❌ استفاده از Portal در SSR بدون `check` `typeof document`

## 🚀 Best Practices

- ✅ `overlay` + `focus trap` برای `accessibility`
- ✅ بستن با Escape و `click outside`
- ✅ `aria-modal` و `role="dialog"`
- ✅ در Next.js `"use client"` برای Portal

## چه زمانی استفاده کنیم؟

- `Modal`، `drawer`، `tooltip`
- هر UI که باید از `stacking`/`overflow` والد خارج شود

## چه زمانی استفاده نکنیم؟

- `dropdown` ساده داخل `container` — CSS کافی است
- جایگزین `layout` عادی

## ارتباط با مفاهیم دیگر

- [Patterns/Compound-Components](./Patterns/Compound-Components.md)
- [DOM Manipulation](./DOM-Manipulation.md)
- [createPortal — react.dev](https://react.dev/reference/react-dom/createPortal)

## 💡 نکات مهم

- با Portal فقط **مکان DOM** عوض می‌شود؛ `React tree` و `context`/`event` همان‌طور کار می‌کند
- `createPortal` از `react-dom` `import` می‌شود
- **رویدادها** در فاز `bubble` از طریق **درخت React** (نه لزوماً DOM) بالا می‌روند — کلیک روی مودال همچنان `handler` والد React را می‌بیند اگر `stopPropagation` نکرده باشید ([react.dev — Portals](https://react.dev/reference/react-dom/createPortal))

## 🎯 سوالات رایج مصاحبه

- چه مشکلی را Portal حل می‌کند؟
- `event bubbling` در Portal چطور است؟

## خلاصه

رندر در DOM دیگر، بدون جدا شدن از `React tree` = Portal.

## 📚 منابع

- [createPortal](https://react.dev/reference/react-dom/createPortal)
- [Portals](https://react.dev/reference/react-dom/components/portal)
