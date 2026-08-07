# Common Pitfalls — اشتباهات رایج React

> 🧭 پیش‌نیاز: [Best Practices](./Best-Practices.md) · بعدی: [FAQ](./FAQ.md)

اشتباهات پرتکرار که باگ، re-render اضافه یا رفتار غیرقابل پیش‌بینی ایجاد می‌کنند — **عمومی** (نه فقط performance).

---

## 📖 مفهوم

اشتباهات رایج React الگوهایی هستند که در کد واقعی و مصاحبه بارها تکرار می‌شوند: mutate کردن `state`، dependency array اشتباه، `key` ناپایدار، یا استفادهٔ نادرست از `ref` و Context. شناخت آن‌ها از debug ساعت‌ها جلوگیری می‌کند.

این فایل مکمل [Best-Practices](./Best-Practices.md) است. اشتباهات **مخصوص performance** در [Performance/Common-Mistakes](./Performance/Common-Mistakes.md).

---

## چرا این ویژگی وجود دارد؟

در React عمداً برخلاف برخی فریم‌ورک‌ها «جادویی» نیست — `reference equality`، batching و قوانین Hook اگر نادیده گرفته شوند، رفتار عجیب می‌دهند. فهرست متمرکز کمک می‌کند سریع تشخیص دهید.

---

## چه مشکلی را حل می‌کند؟

- باگ‌های «گاهی کار می‌کند» از closure قدیمی
- infinite loop در `useEffect`
- UI که با تغییر `state` به‌روز نمی‌شود (mutate)
- re-render کل اپ از Context پر

---

## ⚙️ نحوه کار — فهرست اشتباهات

### ۱. Mutate کردن `state`

```jsx
// ❌
const [user, setUser] = useState({ name: "Ali" });
user.name = "Sara";
setUser(user); // همان reference — re-render ممکن است نشود

// ✅
setUser({ ...user, name: "Sara" });
```

جزئیات: [State](./State.md)، [useState](./Hooks/useState.md).

### ۲. `useEffect` برای چیزی که Effect نیست

| اشتباه | جایگزین |
|--------|---------|
| `setState` از `props` در Effect | مقدار derived در render |
| fetch در Effect بدون cleanup | React Query یا RSC |
| handler کلیک در Effect | تابع `onClick` |

مرجع: [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).

### ۳. Dependency array اشتباه

```jsx
// ❌ — هر render object جدید → loop
useEffect(() => {
  fetchData(options);
}, [options]); // options = { page: 1 } در render

// ✅ — primitive یا useMemo پایدار
useEffect(() => {
  fetchData(page);
}, [page]);
```

جزئیات: [useEffect](./Hooks/useEffect.md)، [useEffectEvent](./Hooks/useEffectEvent.md).

### ۴. Stale closure در `setState`

```jsx
// ❌ — سه بار +1 روی همان count اولیه
setCount(count + 1);
setCount(count + 1);
setCount(count + 1);

// ✅
setCount((c) => c + 1);
setCount((c) => c + 1);
```

### ۵. `key` با `index` در لیست متغیر

حذف/جابجایی آیتم → state اشتباه روی DOM — [Keys-And-Performance](./Performance/Keys-And-Performance.md)، [Lists](./Lists.md).

### ۶. Context برای همهٔ داده

هر تغییر → همهٔ consumerها re-render — split context، `useMemo` value، یا Zustand/selectors — [Context-API](./State-Management/Context-API.md).

### ۷. `ref` به‌جای `state` برای UI

تغییر `ref.current` re-render نمی‌زند — برای نمایش UI از `state` استفاده کنید — [Refs](./Refs.md).

### ۸. فراخوانی Hook شرطی

```jsx
// ❌
if (loggedIn) useEffect(...);

// ✅ — Hook همیشه در همان ترتیب
useEffect(() => {
  if (!loggedIn) return;
  ...
}, [loggedIn]);
```

[Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks).

### ۹. `memo` بدون دلیل یا با props ناپایدار

```jsx
// ❌ — props همیشه جدید
<MemoChild onClick={() => doSomething()} />

// ✅ — useCallback یا تعریف خارج render
```

[Patterns/React-Memo](./Patterns/React-Memo.md)، [Performance/Common-Mistakes](./Performance/Common-Mistakes.md).

### ۱۰. قاطی کردن Client و Server Component

`useState` در Server Component؛ import server-only در client — [Client-Components](./Escape-Hatches/Client-Components.md)، [Nextjs/Client-Server-Interleaving](./Nextjs/Client-Server-Interleaving.md).

### ۱۱. نادیده گرفتن cleanup

subscribe، interval، abort fetch — return cleanup در Effect — [Effects](./Effects.md).

### ۱۲. Strict Mode را «باگ» فرض کردن

در dev، Effect دو بار اجرا می‌شود تا cleanup را تست کند — [Lifecycle](./Lifecycle.md).

---

## جدول سریع: علامت → احتمال

| علامت | احتمال |
|-------|--------|
| UI به‌روز نمی‌شود | mutate state |
| loop بی‌نهایت | deps Effect |
| مقدار قدیمی در handler | stale closure |
| input اشتباه بعد از حذف ردیف | key با index |
| کل اپ کند با Context | value بزرگ در یک Context |

---

## مثال واقعی در پروژه

در CabinTable، `key={cabin.id}` نه index — ویرایش inline state درست می‌ماند. در Wild Oasis، فیلتر در URL است نه `useEffect` sync با `searchParams` — [State-In-URL](./React-Router/State-In-URL.md).

---

## 🚀 Best Practices

✅ قبل از Effect بپرسید: آیا واقعاً sync با خارج است؟  
✅ functional update برای `setState` وابسته به قبلی  
✅ DevTools Profiler برای Context و re-render — [Profiling](./Performance/Profiling.md)  
✅ ESLint `react-hooks/exhaustive-deps` را جدی بگیرید (با درک، نه کورکورانه)  
✅ سؤال دارید؟ [FAQ](./FAQ.md) را ببینید

---

## ⚠️ اشتباهات رایج (دربارهٔ این سند!)

❌ فقط این فایل را خواندن بدون فایل موضوعی عمیق  
❌ کپی کردن `eslint-disable` برای deps بدون فهم  
❌ فرض کردن همهٔ lagها از `memo` — ابتدا ساختار — [Best-Practices](./Best-Practices.md)

---

## ارتباط با مفاهیم دیگر

- [Best-Practices](./Best-Practices.md) — عادت‌های درست
- [Performance/Common-Mistakes](./Performance/Common-Mistakes.md) — اشتباهات performance
- [FAQ](./FAQ.md) — پرسش و پاسخ
- [Interview-Questions](./Interview-Questions.md) — سوالات مصاحبه
- [Effects](./Effects.md) · [State](./State.md) · [Refs](./Refs.md)

---

## خلاصه

بیشتر باگ‌های React از mutate، Effect اشتباه، deps نادرست، key بد و Context سنگین است. functional update، derived state و ابزار مناسب (Query/RSC) بسیاری را حل می‌کنند.

---

## 📚 منابع

- [Common React Pitfalls — react.dev](https://react.dev/learn/removing-effect-dependencies)
- [State as a Snapshot — react.dev](https://react.dev/learn/state-as-a-snapshot)
- [You Might Not Need an Effect — react.dev](https://react.dev/learn/you-might-not-need-an-effect)
- [Rules of Hooks — react.dev](https://react.dev/reference/rules/rules-of-hooks)
