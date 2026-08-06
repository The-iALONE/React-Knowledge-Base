# useImperativeHandle

> برای سفارشی‌سازی `ref` که به `parent` `expose` می‌شود — معمولاً با `forwardRef` روی `child component`.

---

## 📖 مفهوم

برای تعیین مقدار `ref.current` که `parent` می‌بیند، از `useImperativeHandle` استفاده می‌شود. به‌جای `expose` کردن کل `DOM node`، فقط متدهای خاص (مثل `focus()`، `scrollTo()`) در اختیار `parent` قرار می‌گیرد.

---

## چرا

گاهی `parent` باید `action` `imperative` روی `child` انجام دهد (`focus` روی `input`، `play` ویدیو، `reset` فرم). `expose` کردن کل DOM شکنندگی و `coupling` زیاد ایجاد می‌کند. با `useImperativeHandle` API محدود و کنترل‌شده در دسترس است.

---

## مشکل

- `overuse` → کد `imperative` و سخت برای نگهداری.
- خلاف مدل `declarative` React — فقط وقتی لازم است.
- React 19: `ref` به‌عنوان `prop` — دیگر `forwardRef` الزامی نیست.

---

## نحوه کار

1. `Parent` `ref` را به `child` `pass` می‌دهد (`forwardRef` در React 18، یا `ref` `prop` در React 19).
2. `Child` `useImperativeHandle(ref, () => ({ method }))` تعریف می‌کند.
3. `Parent` `ref.current.focus()` صدا می‌زند — نه دسترسی مستقیم به DOM.

---

## Syntax

```jsx
useImperativeHandle(ref, createHandle, dependencies?);
```

```jsx
const FancyInput = forwardRef(function FancyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
    clear() {
      inputRef.current.value = '';
    },
  }), []);

  return <input ref={inputRef} {...props} />;
});
```

---

## پارامترها

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `ref` | `Ref` | ref دریافتی از `forwardRef` |
| `createHandle` | `() => T` | `object` متدهایی که `expose` می‌شود |
| `dependencies` | `unknown[]` (optional) | مثل `useEffect` |

---

## مقدار بازگشتی

`undefined`

---

## مثال ساده

```jsx
// React 19 — بدون forwardRef
function CustomInput({ ref, ...props }) {
  const innerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => innerRef.current?.focus(),
  }));

  return <input ref={innerRef} {...props} />;
}
```

```jsx
// React 18 — با forwardRef
import { forwardRef, useRef, useImperativeHandle } from 'react';

const CustomInput = forwardRef(function CustomInput(props, ref) {
  const innerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => innerRef.current?.focus(),
    getValue: () => innerRef.current?.value,
  }));

  return <input ref={innerRef} {...props} />;
});

function Form() {
  const inputRef = useRef(null);

  return (
    <>
      <CustomInput ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
    </>
  );
}
```

---

## مثال واقعی

### Dashboard — modal با imperative close

```jsx
const Modal = forwardRef(function Modal({ children }, ref) {
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  if (!open) return null;
  return <div className="modal">{children}</div>;
});

function Toolbar() {
  const modalRef = useRef(null);
  return (
    <>
      <button onClick={() => modalRef.current?.open()}>Settings</button>
      <Modal ref={modalRef}><SettingsPanel /></Modal>
    </>
  );
}
```

### Auth — OTP input focus chain

```jsx
const OtpDigit = forwardRef(function OtpDigit(_, ref) {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    value: () => inputRef.current?.value ?? '',
  }));
  return <input ref={inputRef} maxLength={1} className="otp-digit" />;
});
```

### E-commerce — video player controls

```jsx
const ProductVideo = forwardRef(function ProductVideo({ src }, ref) {
  const videoRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
    seekTo: (time) => { if (videoRef.current) videoRef.current.currentTime = time; },
  }));

  return <video ref={videoRef} src={src} />;
});
```

---

## اشتباهات

```jsx
// ❌ بدون forwardRef
function BadComponent({ ref }) {
  useImperativeHandle(ref, () => ({})); // ref undefined
}

// ❌ expose کل DOM
useImperativeHandle(ref, () => inputRef.current);

// ✅ API محدود
useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }));

// ❌ imperative به‌جای props
// parent باید open={isOpen} بدهد نه ref.current.open()
```

---

## Best Practices

- API کوچک و `stable` `expose` کنید.
- ترجیحاً `declarative` `props` (`open`، `onClose`) — `imperative` آخرین راه.
- `deps` را درست `set` کنید اگر `handle` به `props` وابسته است.
- React 19: `ref` به‌عنوان `prop` بدون `forwardRef` در برخی موارد.

---

## When to Use / Not

| استفاده کنید | استفاده نکنید |
|-------------|---------------|
| `focus`، `scroll`، کنترل `media` | `state`/UI معمولی |
| کتابخانه `imperative` (`map`، `chart`) | جایگزین `props`/`events` |
| فرم پیچیده با زنجیره `ref` | هر `child` |

---

## ارتباط با مفاهیم

- [useRef.md](./useRef.md) — ref پایه
- [Refs.md](../Refs.md) — `forwardRef`
- [DOM-Manipulation.md](../DOM-Manipulation.md)

---

## نکات

- باید با `forwardRef` (یا `ref` prop در React 19) ترکیب شود.
- `createHandle` در `mount` و وقتی `deps` عوض شود اجرا می‌شود.
- `library authors` بیشتر از `app code` استفاده می‌کنند.

---

## Interview

**سوال:** `useImperativeHandle` چرا وجود دارد؟  
**جواب:** برای `expose` کردن API محدود `imperative` به `parent` بدون افشای کل DOM — `encapsulation` بهتر.

**سوال:** چرا کم استفاده می‌شود؟  
**جواب:** React `declarative` است؛ `props`/`events` ترجیح دارند. فقط `integration` و `focus`/`media` نیاز دارند.

---

## خلاصه

با `useImperativeHandle` `ref` والد سفارشی می‌شود. با `forwardRef` برای API `imperative` محدود (`focus`، `play`، `reset`) — به‌ندرت استفاده کنید.

---

## منابع

- [useImperativeHandle — react.dev](https://react.dev/reference/react/useImperativeHandle)
- [Manipulating the DOM with Refs — react.dev](https://react.dev/learn/manipulating-the-dom-with-refs)
