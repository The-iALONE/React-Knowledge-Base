# Common Mistakes — اشتباهات رایج Performance

> ضدالگوهایی که بیشتر از کمک، پیچیدگی و باگ اضافه می‌کنند.

> 🧭 پیش‌نیاز: [Best Practices](./Best-Practices.md) · بعدی: [State Management](../State-Management/README.md)

---

## 📖 مفهوم

اشتباهات رایج عملکرد (`Common Mistakes`) الگوهای تکرارشونده‌ای هستند که توسعه‌دهندگان هنگام بهینه‌سازی React مرتکب می‌شوند — از `memo` بی‌هدف تا `key` اشتباه و `Context` سنگین.

---

## چرا این ویژگی وجود دارد؟

شناخت ضدالگو سریع‌تر از دیباگ است. بسیاری از «مشکلات performance» در واقع مشکل طراحی `state` یا `reconciliation` هستند.

---

## چه مشکلی را حل می‌کند؟

- هدر رفتن زمان روی بهینه‌سازی بی‌اثر
- باگ‌های `state` غیرقابل پیش‌بینی
- کد ناخوانا با لایه‌های `memo`/`useMemo`

---

## ⚙️ نحوه کار — تشخیص ضدالگو

```
علامت (`lag`، باگ `state`) → علت ریشه‌ای → جایگزین ساختاری
```

مثال: هر `keystroke` کل صفحه رندر → `state` در ریشه → [State-Colocation](./State-Colocation.md)

---

## ⚠️ اشتباهات رایج

### ۱. بهینه‌سازی زودهنگام

**علامت:** `memo` روی همه کامپوننت‌ها قبل از `lag` واقعی.

**چرا بد:** هزینه مقایسه `props` + خوانایی کمتر.

**جایگزین:** [Profiling.md](./Profiling.md) — اصل react.dev: «بهینه‌سازی زودهنگام نکنید»

---

### ۲. `memo` با `props` همیشه جدید

```jsx
<Child config={{ theme: "dark" }} />
<Child onClick={() => doSomething()} />
```

**چرا بد:** `{}` و `() =>` هر رندر `reference` جدید → `memo` بی‌فایده.

**جایگزین:** `useMemo`/`useCallback`، `colocation`، یا `Compiler` — [Memoization.md](./Memoization.md)

---

### ۳. `key={index}` در لیست پویا

**علامت:** بعد از حذف/مرتب‌سازی، `state` ردیف اشتباه است.

**جایگزین:** [Keys-And-Performance.md](./Keys-And-Performance.md)

---

### ۴. `key={Math.random()}`

**علامت:** هر رندر unmount/mount کامل → از دست رفتن فوکوس و `state`.

**جایگزین:** `id` پایدار از داده.

---

### ۵. `useMemo` برای همه چیز

```jsx
const doubled = useMemo(() => count * 2, [count]);
```

**چرا بد:** ضرب ارزان‌تر از `overhead` cache.

**قانون:** فقط محاسبات یا ساخت `object`/`array` گران.

---

### ۶. `state` در ریشه برای همه چیز

**علامت:** هر تایپ در یک `input` کل اپ `re-render`.

**جایگزین:** [State-Colocation.md](./State-Colocation.md)

---

### ۷. `Context` برای `state` پرتکرار محلی

**علامت:** تغییر تم یا فیلتر کوچک → صدها مصرف‌کننده `Context` رندر.

**جایگزین:** `colocation`؛ split `context`؛ [State-Types](../State-Management/State-Types.md)

---

### ۸. `side effect` در body رندر

```jsx
function Bad() {
  document.title = "x"; // هر رندر
  fetch("/api");        // هر رندر
}
```

**جایگزین:** `useEffect` یا event handler — [Effects.md](../Effects.md)

---

### ۹. `useLayoutEffect` برای همه چیز

**علامت:** blocking قبل از paint بدون نیاز.

**جایگزین:** فقط برای `measure`/`layout` قبل از `paint` — [Hooks/useLayoutEffect.md](../Hooks/useLayoutEffect.md)

---

### ۱۰. `flushSync` برای «رفع» lag

**علامت:** شکستن batching و رندر اضافی.

**جایگزین:** ریشه مشکل را پیدا کنید — [Render-Cycle.md](./Render-Cycle.md)

---

### ۱۱. نادیده گرفتن `Strict Mode` double render

**علامت:** فکر کردن production دوبرابر کند است.

**واقعیت:** فقط `dev` برای کشف `impure render`.

---

### ۱۲. Code split بیش از حد

**علامت:** ده‌ها chunk کوچک → waterfall شبکه.

**جایگزین:** `route-level` اول — [Code-Splitting.md](./Code-Splitting.md)

---

## مثال واقعی — آرشیو پست (جزوه)

کامپوننت `Archive` با `memo` ولی `archiveOptions` object جدید هر رندر → حلقه بهینه‌سازی شکسته. راه‌حل: `useMemo` برای options یا colocation.

---

## 🚀 Best Practices — جایگزین‌های ساختاری

| ضدالگو | جایگزین |
|--------|---------|
| `memo` بی‌هدف | Profiler → colocation اول |
| `props` ناپایدار | `useMemo`/`useCallback` یا Compiler |
| `state` در ریشه | [State-Colocation.md](./State-Colocation.md) |
| `Context` سنگین | split `context` یا state library (M7) |
| بهینه‌سازی زودهنگام | [Best-Practices.md](./Best-Practices.md) چک‌لیست |

---

## ارتباط با مفاهیم دیگر

- [Best-Practices.md](./Best-Practices.md) — performance
- [Common-Pitfalls.md](../Common-Pitfalls.md) — اشتباهات عمومی React
- [Optimization-Techniques.md](./Optimization-Techniques.md)
- [Re-render.md](./Re-render.md)
- [State-Management/README.md](../State-Management/README.md) — بعد از Performance

---

## خلاصه

بیشتر اشتباهات = بهینه‌سازی بدون اندازه‌گیری، `props`/`key` ناپایدار، و `state` در جای اشتباه. اول ساختار، بعد پروفایل، بعد `memo`.

---

## 📚 منابع

- [React — memo troubleshooting](https://react.dev/reference/react/memo)
- [React — Preserving State](https://react.dev/learn/preserving-and-resetting-state)
