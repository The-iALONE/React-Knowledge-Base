# State Colocation — نزدیک‌سازی state

> نگه‌داشتن `state` در پایین‌ترین سطح ممکن در درخت کامپوننت تا فقط همان `subtree` که به داده وابسته است `re-render` شود.

> 🧭 پیش‌نیاز: [Keys & Performance](./Keys-And-Performance.md) · بعدی: [Memoization](./Memoization.md)

---

## 📖 مفهوم

نزدیک‌سازی `state` (`State Colocation`) یعنی داده‌ای که فقط یک بخش UI به آن نیاز دارد، در همان کامپوننت (یا نزدیک‌ترین والد مشترک) نگه داشته شود — نه در ریشه اپ یا `Context` سراسری. اصل رسمی react.dev: «`state` را بیش از حد لازم بالا نبرید.»

---

## چرا این ویژگی وجود دارد؟

هر تغییر `state` در والد، همه فرزندان بدون `memo` را `re-render` می‌کند. `state` سراسری یا در `App` باعث می‌شود تایپ در یک `input` کل صفحه را بیدار کند.

---

## چه مشکلی را حل می‌کند؟

- `re-render` کل `subtree` برای تغییرات محلی
- پیچیدگی غیرضروری `prop drilling`
- نیاز کمتر به `memo`/`useMemo` اگر مرز رندر از ابتدا درست باشد

---

## ⚙️ نحوه کار

### قبل — `state` در ریشه

```jsx
function App() {
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState("dark");
  return (
    <div>
      <Header search={search} onSearch={setSearch} />
      <ReservationTable />  {/* هر تایپ جستجو → re-render */}
      <ThemeToggle theme={theme} onTheme={setTheme} />
    </div>
  );
}
```

### بعد — colocation

```jsx
function App() {
  return (
    <div>
      <Header />           {/* search داخل Header */}
      <ReservationTable />
      <ThemeSection />     {/* theme داخل ThemeSection */}
    </div>
  );
}

function Header() {
  const [search, setSearch] = useState("");
  return <SearchBar value={search} onChange={setSearch} />;
}
```

تایپ جستجو فقط `Header` (و فرزندان مستقیم آن) را رندر می‌کند.

---

## جدا کردن کامپوننت برای محدود کردن رندر

```jsx
function Dashboard() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Counter count={count} onChange={setCount} />
      <ExpensiveChart data={globalData} />
    </div>
  );
}
```

اگر `count` و `ExpensiveChart` مستقل‌اند، `Counter` را جدا کنید تا `state` شمارنده فقط همان بخش را تحت تأثیر قرار دهد:

```jsx
function Dashboard() {
  return (
    <div>
      <CounterSection />
      <ExpensiveChart data={globalData} />
    </div>
  );
}

function CounterSection() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

---

## مقایسه با Context سراسری

| رویکرد | مناسب برای |
|--------|------------|
| Colocation | `state` محلی UI (فرم، hover، تب، جستجو) |
| `Context` | داده واقعاً سراسری (تم، زبان، کاربر لاگین) — M7 |
| State library | داده پیچیده مشترک بین featureها |

تغییر مقدار `Context` همه مصرف‌کنندگان را رندر می‌کند — برای `state` پرتکرار محلی مناسب نیست.

---

## مثال واقعی در پروژه

**فرم رزرو + جدول (Wild Oasis):** `state` ویرایش یک ردیف داخل `EditRowModal` است، نه در `App`. باز/بسته شدن مودال فقط همان شاخه را رندر می‌کند.

مثال کد: [Examples/performance/StateColocation.jsx](../Examples/performance/StateColocation.jsx)

---

## ⚠️ اشتباهات رایج

- قرار دادن همه `state` در Redux/Context «برای راحتی»
- lift کردن `state` قبل از نیاز واقعی به اشتراک
- colocation بدون تفکیک کامپوننت (همه در یک فایل غول‌آسا)

---

## 🚀 Best Practices

- `state` را فقط وقتی بالا ببرید که چند شاخه به آن نیاز دارند → [Lifting-State-Up.md](../Lifting-State-Up.md)
- فرم‌ها و `hover` معمولاً محلی بمانند
- با Profiler تأیید کنید colocation اثر دارد

---

## ارتباط با مفاهیم دیگر

- [Re-render.md](./Re-render.md)
- [Memoization.md](./Memoization.md) — colocation اغلب جایگزین `memo` است
- [Context.md](../Context.md) · [State-Management/README.md](../State-Management/README.md) (M7)
- [State-Types](../State-Management/State-Types.md) — `UI state` محلی vs `Global`
- [Sharing-State.md](../Sharing-State.md)

---

## خلاصه

داده را نزدیک مصرف‌کننده نگه دارید (`state colocation`). جدا کردن کامپوننت = مرز `re-render` طبیعی. قبل از `Context` یا `memo`، colocation را امتحان کنید.

---

## 📚 منابع

- [React — Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [React — memo — principles](https://react.dev/reference/react/memo)
