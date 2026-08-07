# Rendering — نحوه رندر و بازرندر در React

> 🧭 پیش‌نیاز: [State](./State.md) · بعدی: [Conditional Rendering](./Conditional-Rendering.md)

> هر بار که `state` یا `props` تغییر کند، React کامپوننت را دوباره اجرا می‌کند تا UI به‌روز شود. درک فاز رندر و فاز commit پایهٔ بهینه‌سازی و دیباگ است.

## 📖 مفهوم

در React، `Rendering` یعنی اجرای تابع کامپوننت و ساخت درخت JSX (Virtual DOM). این فرآیند دو فاز اصلی دارد:

1. `Render Phase` — محاسبه JSX، مقایسه با نسخه قبلی (`Reconciliation`)، تعیین تغییرات لازم. این فاز قابل قطع و تکرار است.
2. `Commit Phase` — اعمال تغییرات روی DOM واقعی، اجرای `useLayoutEffect` و سپس `useEffect`. این فاز همگام و غیرقابل قطع است.

در React از `State Batching` استفاده می‌شود: چند `setState` پشت‌سرهم در یک `event handler` معمولاً فقط یک `re-render` ایجاد می‌کنند.

## چرا این ویژگی وجود دارد؟

رابط کاربری باید با داده همگام بماند بدون اینکه توسعه‌دهنده مستقیماً DOM را دستکاری کند. مدل `declarative` React این همگام‌سازی را با یک چرخه رندر قابل پیش‌بینی انجام می‌دهد.

## چه مشکلی را حل می‌کند؟

- جلوگیری از دستکاری دستی و پراکنده DOM
- پیش‌بینی‌پذیری: تغییر `state` → خروجی JSX جدید
- امکان بهینه‌سازی با `Diffing` و `Pure Components`

## ⚙️ نحوه کار

```
تغییر state/props
    ↓
فاز رندر (محاسبه JSX + Diff)
    ↓
فاز commit (اعمال به DOM + Effects)
    ↓
به‌روزرسانی UI
```

**کامپوننت `pure`:** کامپوننتی که با همان `props` و `state` همیشه همان JSX را برمی‌گرداند. React می‌تواند با `React.memo` از `re-render` غیرضروری جلوگیری کند.

**بهینه‌سازی `children`:** اگر کامپوننت سنگین را به‌صورت `children` پاس دهید، والد هنگام `re-render` خودش، آن `children` از قبل ساخته‌شده را دوباره نمی‌سازد — مگر اینکه والدِ `children` `re-render` شود.

```jsx
// والد فقط Counter را re-render می‌کند، نه ExpensiveChart
<Layout>
  <ExpensiveChart data={data} />
</Layout>
```

## Syntax

```jsx
function Dashboard({ user }) {
  const [count, setCount] = useState(0);

  // Render Phase: این تابع دوباره اجرا می‌شود
  return (
    <div>
      <p>{user.name}</p>
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>
    </div>
  );
}
```

**در React 18+، `Batching` (همه جا):**

```jsx
function handleClick() {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // فقط یک re-render
}
```

## 💡 مثال ساده

```jsx
function App() {
  const [text, setText] = useState("");

  return (
    <input value={text} onChange={(e) => setText(e.target.value)} />
  );
}
```

هر `keystroke` یک `render` + `commit` ایجاد می‌کند (مگر با `debounce` بهینه شود).

## مثال واقعی در پروژه

**داشبورد هتل (الهام از `Wild Oasis`):** صفحه آمار با چند کارت `KPI`. `state` فیلتر تاریخ در `DashboardHeader` است؛ جدول رزروها `ReservationTable` جداست.

```jsx
function DashboardPage() {
  const [dateRange, setDateRange] = useState({ from: today, to: today });

  return (
    <div className="dashboard">
      <DashboardHeader dateRange={dateRange} onChange={setDateRange} />
      {/* children-style: جدول فقط وقتی props خودش عوض شود re-render می‌شود */}
      <DashboardSection title="رزروها">
        <ReservationTable dateRange={dateRange} />
      </DashboardSection>
    </div>
  );
}

const ReservationTable = React.memo(function ReservationTable({ dateRange }) {
  const { data } = useReservations(dateRange);
  return <table>{/* ... */}</table>;
});
```

## ⚠️ اشتباهات رایج

- فکر کردن هر `setState` حتماً یک `re-render` جدا ایجاد می‌کند (در `event handler` معمولاً `batch` می‌شود)
- ساختن `object`/`array` جدید در `render` بدون نیاز → شکستن `memoization`
- قرار دادن منطق سنگین مستقیم در `body` کامپوننت بدون `useMemo`
- اشتباه گرفتن `Render Phase` با «نمایش روی صفحه» — نمایش در `Commit Phase` است

## 🚀 Best Practices

- کامپوننت‌ها را `pure` نگه دارید
- `state` را `colocate` کنید (نزدیک مصرف‌کننده)
- برای بخش‌های سنگین از `React.memo`، `useMemo` و الگوی `children` استفاده کنید
- با React DevTools `Profiler` نقاط کند را پیدا کنید

## چه زمانی استفاده کنیم؟ / چه زمانی استفاده نکنیم؟

| استفاده کنیم | استفاده نکنیم |
|--------------|---------------|
| وقتی UI باید با `state` همگام شود | وقتی فقط یک مقدار DOM یک‌بار لازم است (از `ref` استفاده کنید) |
| مدل `declarative` برای UI پیچیده | برای انیمیشن‌های پرتکرار سنگین (شاید `ref` + CSS بهتر باشد) |

## ارتباط با مفاهیم دیگر

- [State](./State.md) — `trigger` اصلی `re-render`
- [Props](./Props.md) — ورودی `render`
- [Effects](./Effects.md) — بعد از `Commit Phase`
- [Lifecycle](./Lifecycle.md) — چرخه عمر کامپوننت
- [Performance/Re-render](./Performance/Re-render.md)
- [Performance/Render-Cycle](./Performance/Render-Cycle.md)
- [Performance/Reconciliation](./Performance/Reconciliation.md)
- [Performance/README.md](./Performance/README.md) — ادامه عمیق M6 (Virtual DOM، Memoization، Profiling و…)
- [Conditional-Rendering](./Conditional-Rendering.md)
- [Lists](./Lists.md) — اهمیت `key`

## 💡 نکات مهم

- `render` ≠ `paint`: `render` محاسبه است؛ `commit` به DOM می‌رسد.
- در React 18 `Automatic Batching` در `setTimeout`، `Promise` و... هم اعمال می‌شود.
- در `development`، `Strict Mode` بعضی `render`ها را دوبار اجرا می‌کند تا `side effect`ها را `expose` کند.

## 🎯 سوالات رایج مصاحبه

1. تفاوت `Render Phase` و `Commit Phase` چیست؟
2. `State Batching` چیست و از React 18 چه تغییری کرد؟
3. کامپوننت `pure` یعنی چه؟
4. چرا پاس دادن کامپوننت به‌صورت `children` می‌تواند `re-render` را کم کند؟
5. آیا `Virtual DOM` همیشه سریع‌تر از DOM مستقیم است؟ (خیر — در همه موارد نه)

## خلاصه

در React، `Rendering` یعنی اجرای کامپوننت (`Render Phase`) و سپس اعمال تغییرات DOM (`Commit Phase`). `Batching` چند `update` را ادغام می‌کند. کامپوننت‌های `pure` و بهینه‌سازی `children`/`memo` کلید `performance` هستند.

## 📚 منابع (react.dev)

- [Render and Commit](https://react.dev/learn/render-and-commit)
- [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
- [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)
