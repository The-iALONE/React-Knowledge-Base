# Render Cycle — چرخه رندر React

> هر به‌روزرسانی UI از `Trigger` شروع می‌شود، از `Render Phase` عبور می‌کند و با `Commit Phase` روی صفحه دیده می‌شود.

---

## 📖 مفهوم

چرخه رندر (`Render Cycle`) مسیر کامل یک آپدیت است:

```
Trigger → Render Phase → Commit Phase → (Effects) → Browser Paint
```

| فاز | نام دیگر | کار اصلی |
|-----|----------|----------|
| `Render Phase` | `Reconciliation` | اجرای کامپوننت‌ها، ساخت JSX، `diff` |
| `Commit Phase` | — | اعمال تغییرات DOM، `lifecycle`/`effects` |

---

## فاز رندر (`Render Phase`)

- تابع هر کامپوننت affected **دوباره اجرا** می‌شود
- خروجی JSX با نسخه قبلی **مقایسه** می‌شود (`Reconciliation`)
- React تصمیم می‌گیرد چه چیزی باید در DOM عوض شود
- **قابل قطع و از سرگیری** (`Concurrent Mode`) — کار با اولویت بالاتر می‌تواند `interrupt` کند
- `Side effect` ممنوع — نباید DOM را مستقیم تغییر دهید یا `fetch` کنید

```jsx
function SearchBar({ query, onChange }) {
  // ← همه این خطوط در Render Phase اجرا می‌شوند
  const filtered = items.filter((i) => i.name.includes(query));

  return <input value={query} onChange={onChange} />;
}
```

---

## فاز کامیت (`Commit Phase`)

- تغییرات روی **DOM واقعی** اعمال می‌شود
- **همگام** — قابل `interrupt` نیست
- ترتیب Effects:
  1. `useLayoutEffect` (همگام، قبل از `paint`)
  2. مرورگر `paint` می‌کند
  3. `useEffect` (غیرهمگام، بعد از `paint`)

```jsx
function Tooltip({ text }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    // Commit Phase — اندازه DOM خوانده می‌شود
    positionTooltip(ref.current);
  }, [text]);

  useEffect(() => {
    // بعد از paint — analytics، fetch و...
    logTooltipShown(text);
  }, [text]);

  return <div ref={ref}>{text}</div>;
}
```

---

## چرا این ویژگی وجود دارد؟

جداسازی **محاسبه** (`Render`) از **اعمال** (`Commit`) به React اجازه می‌دهد:
- چند `render` را `batch` کند
- کار را `interrupt` و اولویت‌بندی کند
- Effects را بعد از DOM به‌روز اجرا کند

---

## چه مشکلی را حل می‌کند؟

- UI همیشه با آخرین `state` **سازگار** است قبل از نمایش
- `Side effect`ها در زمان **امن** اجرا می‌شوند
- امکان `Concurrent Rendering` بدون نمایش UI نیمه‌کاره

---

## ⚙️ نحوه کار — دیاگرام کامل

```
┌─────────────────────────────────────────────────────────┐
│ TRIGGER                                                  │
│  • setState / set reducer dispatch                       │
│  • props تغییر از والد                                   │
│  • Context value تغییر                                   │
│  • parent re-render (اگر memo نشده)                      │
└──────────────────────────┬──────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ RENDER PHASE (قابل قطع)                                  │
│  1. اجرای component functions                            │
│  2. ساخت React Elements                                  │
│  3. Diffing / Reconciliation                             │
│  4. علامت‌گذاری تغییرات لازم                             │
└──────────────────────────┬──────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ COMMIT PHASE (غیرقابل قطع)                               │
│  1. اعمال mutations به DOM                               │
│  2. useLayoutEffect callbacks                            │
│  3. Browser Paint                                        │
│  4. useEffect callbacks                                  │
└─────────────────────────────────────────────────────────┘
```

---

## دسته‌بندی `state` در چرخه رندر (`State Batching`)

React 18+ `Automatic Batching`: چند `state update` → یک `Render` + `Commit`.

```jsx
// Event handler — همیشه batch
function handleClick() {
  setA(1);
  setB(2);
  // یک چرخه
}

// React 18+ — batch در async هم
async function handleSave() {
  await saveToServer();
  setSaving(false);
  setLastSaved(Date.now());
  // یک چرخه
}
```

`flushSync`: اگر فوراً به DOM نیاز دارید، `batch` را می‌شکند (استفاده نادر).

```jsx
import { flushSync } from 'react-dom';

flushSync(() => {
  setCount(1);
});
// DOM الان به‌روز است
```

---

## 💡 مثال ساده

```jsx
function App() {
  const [count, setCount] = useState(0);

  console.log('Render Phase: App runs');

  useEffect(() => {
    console.log('After Commit: useEffect runs');
  });

  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

خروجی بعد از کلیک: `Render Phase` → (`Commit`) → `After Commit`

---

## مثال واقعی در پروژه

**Modal با اندازه‌گیری DOM:**

```jsx
function ConfirmModal({ isOpen, message }) {
  const dialogRef = useRef(null);

  useLayoutEffect(() => {
    if (!isOpen) return;
    // باید بعد از commit و قبل از paint باشد تا پرش نبینیم
    centerDialog(dialogRef.current);
  }, [isOpen, message]);

  if (!isOpen) return null;

  return (
    <dialog ref={dialogRef}>
      <p>{message}</p>
    </dialog>
  );
}
```

---

## ⚠️ اشتباهات رایج

- انجام `side effect` در body کامپوننت (`fetch`، `subscription`) به‌جای `useEffect`
- استفاده از `useLayoutEffect` برای همه چیز — فقط وقتی قبل از `paint` به DOM نیاز دارید
- فکر کردن `console.log` در `render` یعنی DOM هم عوض شده
- `flushSync` برای «رفع» مشکل `performance` — معمولاً ضدالگو است

---

## 🚀 Best Practices

- منطق `pure` در `render`؛ `side effect` در `event handler` یا `useEffect`
- برای اندازه‌گیری `layout`: `useLayoutEffect`
- برای `fetch` و `subscription`: `useEffect`
- با `Profiler` ببینید `Render Phase` کجا طولانی است → [Profiling.md](./Profiling.md)

---

## چه زمانی استفاده کنیم؟ / چه زمانی استفاده نکنیم؟

| `Render Phase` | `Commit Phase` |
|--------------|--------------|
| محاسبه JSX، فیلتر، `map` | نوشتن DOM، `focus`، `scroll` |
| `useMemo` برای محاسبه گران | `useEffect` برای `fetch` |
| **نه** `fetch`، **نه** `document.title` | **نه** `setState` سنگین بدون نیاز |

---

## ارتباط با مفاهیم دیگر

- [Re-render.md](./Re-render.md) — `trigger`های چرخه
- [Reconciliation.md](./Reconciliation.md) — بخش `Render Phase`
- [Hooks/useLayoutEffect](../Hooks/useLayoutEffect.md)
- [Hooks/useEffect](../Hooks/useEffect.md)
- [Effects](../Effects.md)
- [Concurrent Features](../Concurrent-Features.md)

---

## 💡 نکات مهم

- `Render` ≠ `Commit` ≠ `Paint` — سه مرحله جدا
- `Strict Mode` در `dev`: `render` دوبار، `commit` یکبار (برای کشف `impure render`)
- `useTransition` / `useDeferredValue` `render`های غیرفوری را `defer` می‌کنند

---

## 🎯 سوالات رایج مصاحبه

1. تفاوت `Render Phase` و `Commit Phase`؟
2. `useEffect` vs `useLayoutEffect` در کدام فاز اجرا می‌شوند؟
3. `State Batching` در React 18 چه تغییری کرد؟
4. چرا `side effect` در `render` ممنوع است؟

---

## خلاصه

چرخه رندر: `Trigger` → `Render` (محاسبه + `diff`) → `Commit` (DOM + `effects`). فهم این جداسازی پایه دیباگ و بهینه‌سازی است.

---

## 📚 منابع

- [React — Render and Commit](https://react.dev/learn/render-and-commit)
- [React — State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
- [React — useLayoutEffect](https://react.dev/reference/react/useLayoutEffect)
