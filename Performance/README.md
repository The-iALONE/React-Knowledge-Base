# Performance — بهینه‌سازی React

> این بخش **کامل‌ترین** بخش Knowledge Base است. هدف: فهم عمیق چرخه رندر، `Reconciliation`، و تکنیک‌های بهینه‌سازی — نه فقط «`memo` بزن».

---

## مسیر یادگیری پیشنهادی

```
Virtual DOM → Render Cycle → Re-render → Reconciliation
    → Diffing Algorithm → Keys → Memoization → State Colocation
    → Code Splitting → Profiling → Optimization Techniques
    → Best Practices / Common Mistakes
```

---

## فهرست کامل

| فایل | موضوع | اولویت |
|------|-------|--------|
| [Virtual-DOM.md](./Virtual-DOM.md) | Virtual DOM چیست و چرا وجود دارد | پایه |
| [Render-Cycle.md](./Render-Cycle.md) | Render Phase vs Commit Phase | پایه |
| [Re-render.md](./Re-render.md) | چه چیزی re-render ایجاد می‌کند | پایه |
| [Reconciliation.md](./Reconciliation.md) | فرآیند همگام‌سازی درخت | پایه |
| [Diffing-Algorithm.md](./Diffing-Algorithm.md) | الگوریتم diff و قوانین آن | پایه |
| [Keys-And-Performance.md](./Keys-And-Performance.md) | `key` و تأثیر روی performance | پایه |
| [Memoization.md](./Memoization.md) | `React.memo`, `useMemo`, `useCallback` | بهینه‌سازی |
| [State-Colocation.md](./State-Colocation.md) | نزدیک‌کردن `state` به مصرف‌کننده | بهینه‌سازی |
| [Code-Splitting.md](./Code-Splitting.md) | `lazy`, `Suspense`, route splitting | بهینه‌سازی |
| [Profiling.md](./Profiling.md) | React DevTools Profiler | اندازه‌گیری |
| [Optimization-Techniques.md](./Optimization-Techniques.md) | جدول کامل تکنیک‌ها + هزینه/فایده | مرجع |
| [Best-Practices.md](./Best-Practices.md) | چک‌لیست عملی | عملی |
| [Common-Mistakes.md](./Common-Mistakes.md) | اشتباهات رایج و ضدالگوها | عملی |

---

## مفاهیم کلیدی (خلاصه)

### فاز رندر در برابر فاز کامیت (`Render Phase` vs `Commit Phase`)

| فاز | کار | قابل قطع؟ | Side Effect مجاز؟ |
|-----|-----|-----------|-------------------|
| `Render` | اجرای کامپوننت، ساخت JSX، Diff | بله (Concurrent) | خیر |
| `Commit` | اعمال به DOM، Effects | خیر | بله (در Effects) |

جزئیات: [Render-Cycle.md](./Render-Cycle.md)

### دسته‌بندی خودکار `state` (`State Batching`)

چند `setState` در یک `event handler` (و در React 18+ در `setTimeout`، `Promise` و...) معمولاً یک `re-render` ایجاد می‌کنند.

```jsx
function handleClick() {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // یک re-render، نه دو
}
```

### بهینه‌سازی `children` به‌عنوان `prop` (`Children as Prop Optimization`)

اگر JSX فرزند **قبل از** `re-render` والد ساخته شده باشد (مثلاً در کامپوننت بالاتر)، تغییر `state` در والد مستقیم باعث `re-render` آن فرزند نمی‌شود.

```jsx
// App re-render → Counter re-render → SlowComponent از قبل ساخته شده، دوباره render نمی‌شود
function App() {
  return (
    <Counter>
      <SlowComponent />
    </Counter>
  );
}
```

جزئیات: [Memoization.md](./Memoization.md#children-as-prop-optimization)

---

## تکنیک‌های بهینه‌سازی — نگاه سریع

| تکنیک | مشکل | هزینه | پیچیدگی اضافه؟ |
|-------|------|-------|----------------|
| `React.memo` | `re-render` فرزند با `props` یکسان | مقایسه `shallow props` | کم |
| `useMemo` | محاسبه گران تکراری | حافظه + مقایسه `deps` | متوسط |
| `useCallback` | تابع جدید هر `render` → شکستن `memo` | حافظه + مقایسه `deps` | متوسط |
| `State colocation` | `re-render` کل `subtree` | ساختار کد | کم (اغلب ساده‌تر) |
| `key` پایدار | `re-mount` و `state` اشتباه | — | خیر |
| `Code splitting` | `bundle` اولیه سنگین | `loading state` | متوسط |
| `Children pattern` | `re-render` `subtree` سنگین | ساختار JSX | کم |

جدول کامل: [Optimization-Techniques.md](./Optimization-Techniques.md)

---

## ارتباط با بخش‌های دیگر

- [Rendering](../Rendering.md) — مقدمه رندر
- [Hooks/useMemo](../Hooks/useMemo.md) · [Hooks/useCallback](../Hooks/useCallback.md)
- [Patterns/React-Memo](../Patterns/React-Memo.md)
- [Lazy Loading](../Lazy-Loading.md) · [Suspense](../Suspense.md)
- [Concurrent Features](../Concurrent-Features.md)
- [React Compiler](../React-Compiler.md)
- [Cheatsheet — Performance](../Cheatsheet.md#performance-سریع)

---

## اصل طلایی

> **اول اندازه بگیر، بعد بهینه کن.** بدون `Profiler`، بهینه‌سازی زودهنگام معمولاً پیچیدگی اضافه می‌کند بدون سود واقعی.

---

## 📚 منابع

- [React — Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
- [React — Render and Commit](https://react.dev/learn/render-and-commit)
- [React — Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
- [React — Optimizing Performance](https://react.dev/learn/render-and-commit#optimizing-performance)
