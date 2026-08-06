# Re-render — بازرندر در React

> هر بار که React تابع کامپوننت را دوباره اجرا می‌کند، یک `re-render` رخ داده — حتی اگر در نهایت DOM تغییری نکند.

---

## 📖 مفهوم

بازرندر (`re-render`) یعنی React دوباره تابع کامپوننت را صدا می‌زند تا JSX جدید بسازد و با نسخه قبلی مقایسه کند. این کار در `Render Phase` انجام می‌شود و لزوماً به تغییر DOM منجر نمی‌شود — اگر خروجی JSX همان باشد، `Commit Phase` خالی می‌ماند.

دو دلیل اصلی برای رندر وجود دارد: **رندر اولیه** (mount) و **به‌روزرسانی** (`state` یا `props` والد/جدول).

---

## چرا این ویژگی وجود دارد؟

مدل `declarative` React بر این اصل است که UI تابعی از `state` و `props` باشد. هر تغییر داده باید مسیر رندر را دوباره طی کند تا UI همگام بماند — بدون دستکاری دستی DOM.

---

## چه مشکلی را حل می‌کند؟

- همگام‌سازی خودکار UI با داده
- پیش‌بینی‌پذیری: تغییر ورودی → اجرای دوباره تابع → مقایسه → commit انتخابی
- پایه بهینه‌سازی: فهم `trigger`ها قبل از `memo` یا `Compiler`

---

## ⚙️ نحوه کار — `trigger`های بازرندر

| `trigger` | توضیح | مثال |
|-----------|--------|------|
| `setState` / `dispatch` | به‌روزرسانی `state` محلی یا `reducer` | `setCount(c => c + 1)` |
| `props` جدید از والد | والد `re-render` شد و `props` عوض شد | `<Child name={user.name} />` |
| `parent re-render` | والد رندر شد؛ فرزند بدون `memo` هم رندر می‌شود | حتی با `props` یکسان |
| `Context` | مقدار `context` مصرف‌شده تغییر کرد | `useContext(ThemeContext)` |
| `useSyncExternalStore` | منبع خارجی عوض شد | `store.subscribe` |
| رندر اولیه | `root.render()` یا mount | بار اول اپ |

```
والد re-render
    ↓
فرزند بدون memo → همیشه re-render
فرزند با memo + props برابر → bail out (اغلب)
```

---

## تفاوت `re-render` و تغییر DOM

```jsx
function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
```

با هر ثانیه `time` عوض می‌شود → `Clock` دوباره رندر می‌شود → فقط متن `<h1>` در DOM به‌روز می‌شود؛ مقدار تایپ‌شده در `<input>` حفظ می‌ماند چون React همان node را نگه می‌دارد.

جزئیات فازها: [Render-Cycle.md](./Render-Cycle.md)

---

## 💡 مثال — Counter و فرزند سنگین

```jsx
function SlowChild() {
  console.log("SlowChild render");
  return <p>من سنگینم</p>;
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>
      <SlowChild />
    </div>
  );
}
```

هر کلیک → `Counter` و `SlowChild` هر دو `re-render` می‌شوند، حتی اگر `SlowChild` به `count` وابسته نباشد.

**راه‌حل‌ها:** `memo`، الگوی `children`، `state colocation` — [Memoization.md](./Memoization.md)، [State-Colocation.md](./State-Colocation.md)

---

## `bail out` — وقتی React رندر را رد می‌کند

| مکانیزم | شرط |
|--------|-----|
| `React.memo` | `props` با `Object.is` برابر باشند |
| `useMemo` / `useCallback` | `deps` تغییر نکرده (برای مقدار/تابع، نه کل کامپوننت) |
| `React Compiler` | بهینه‌سازی خودکار در build |
| خروجی JSX یکسان | `commit` خالی؛ تابع ممکن است اجرا شده باشد |

**مهم:** `memo` تضمین عملکرد نیست — فقط بهینه‌سازی است. اگر `props` همیشه جدید باشند (`{}` یا `() => {}` در هر رندر)، `memo` بی‌فایده است.

---

## مثال واقعی در پروژه

**فرم جستجو + جدول رزرو (Wild Oasis):** تایپ در `input` جستجو فقط باید فیلتر را به‌روز کند. اگر `state` جستجو در ریشه `App` باشد، کل درخت `re-render` می‌شود. با colocation، `state` جستجو داخل `SearchBar` می‌ماند و جدول فقط وقتی `props` داده عوض شود رندر می‌شود.

---

## ⚠️ اشتباهات رایج

- فکر کردن هر `re-render` بد است — در اکثر اپ‌ها طبیعی و ارزان است
- اضافه کردن `memo` قبل از اندازه‌گیری با Profiler
- نادیده گرفتن `Context` — `memo` جلوی `context` تغییرکرده را نمی‌گیرد
- اشتباه گرفتن `console.log` در render با تغییر DOM

---

## 🚀 Best Practices

- اول با Profiler ببینید کجا کند است → [Profiling.md](./Profiling.md)
- `state` را نزدیک مصرف‌کننده نگه دارید → [State-Colocation.md](./State-Colocation.md)
- فرزند سنگین را به‌صورت `children` پاس دهید → [Memoization.md](./Memoization.md)
- از `Strict Mode` در dev برای کشف رندر ناپاک استفاده کنید

---

## ارتباط با مفاهیم دیگر

- [Render-Cycle.md](./Render-Cycle.md) — فازهای Trigger / Render / Commit
- [Reconciliation.md](./Reconciliation.md) — مقایسه JSX بعد از رندر
- [Patterns/React-Memo.md](../Patterns/React-Memo.md) — API `memo`
- [Rendering.md](../Rendering.md) — مقدمه M2
- [Escape-Hatches/React-Compiler.md](../Escape-Hatches/React-Compiler.md)

---

## خلاصه

بازرندر (`re-render`) یعنی اجرای دوباره تابع کامپوننت در `Render Phase`. `trigger`ها: `state`، `props`، والد، `Context`. رندر ≠ تغییر DOM. قبل از بهینه‌سازی، اندازه بگیرید و `state` را colocate کنید.

---

## 📚 منابع

- [React — Render and Commit](https://react.dev/learn/render-and-commit)
- [React — memo](https://react.dev/reference/react/memo)
- [React — Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
