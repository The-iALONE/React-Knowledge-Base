# React.memo

> بهینه‌سازی رندر با جلوگیری از `re-render` غیرضروری کامپوننت‌های تابعی.

> 🧭 پیش‌نیاز: [Higher-Order Components](./Higher-Order-Components.md) · [useMemo](../Hooks/useMemo.md) · [useCallback](../Hooks/useCallback.md) · بعدی: [Performance/README](../Performance/README.md)

---

## 📖 مفهوم

برای جلوگیری از `re-render` غیرضروری کامپوننت‌های تابعی، از `React.memo` استفاده می‌شود — یک کامپوننت مرتبه‌بالاتر (`Higher-Order Component`) داخلی که کامپوننت تابعی را `wrap` می‌کند و فقط وقتی `props` تغییر کرده باشند، دوباره رندر می‌کند (مقایسه سطحی/`shallow`).

فرض کنید والد هر بار `re-render` می‌شود ولی `props` فرزند ثابت است — بدون `memo`، React فرزند را هم دوباره رندر می‌کند؛ با `memo`، اگر `props` از نظر `shallow` برابر باشند، رندر رد می‌شود.

---

## چرا

در درخت کامپوننت، تغییر `state` والد باعث `re-render` همه فرزندان می‌شود — حتی اگر `props` آن‌ها عوض نشده باشد. `memo` این هزینه را کاهش می‌دهد.

---

## چه مشکلی را حل می‌کند؟

`re-render`های تکراری کامپوننت‌های «خالص» (`pure`) که فقط به `props` وابسته‌اند.

---

## ⚙️ نحوه کار

1. در React، `props` جدید را با `props` قبلی `shallow compare` می‌کند.
2. اگر برابر بودند → `re-render` رد می‌شود.
3. می‌توانید تابع `arePropsEqual` سفارشی بدهید.

### مقایسه سطحی با `Object.is`

در React، هر `prop` را با `Object.is` مقایسه می‌کند:

- مقادیر `primitive` (`3 === 3`) → برابر
- `object`/`array`/`function` → مقایسه `reference` (مثلاً `{}` و `{}` برابر نیستند)

بنابراین اگر والد در هر `render` `object` یا `callback` جدید بسازد، `memo` بی‌فایده است — باید `useMemo` / `useCallback` در والد استفاده شود.

```jsx
// تابع comparator سفارشی — true = props برابرند، re-render نکن
const UserCard = memo(
  function UserCard({ user }) {
    return <div>{user.name}</div>;
  },
  (prev, next) => prev.user.id === next.user.id,
);
```

---

## تفاوت با گزینه‌های مشابه

| ابزار | هدف | سطح |
|-------|-----|-----|
| `React.memo` | رد `re-render` کامپوننت | کامپوننت |
| `useMemo` | `cache` نتیجه محاسبه | مقدار داخل کامپوننت |
| `useCallback` | `cache` تابع | تابع داخل کامپوننت |
| React Compiler | `memoization` خودکار | کل پروژه |
| `key` در لیست | هویت آیتم در reconciliation | لیست |

---

## کامپایلر React

با [کامپایلر React](https://react.dev/learn/react-compiler) می‌توانید `memo`، `useMemo` و `useCallback` دستی را در بسیاری از موارد حذف کنید — کامپایلر به‌صورت خودکار `memoization` اعمال می‌کند.

- بدون `Compiler`: ابتدا پروفایل، بعد `memo` + `props` پایدار
- با `Compiler`: معمولاً `memo` دستی لازم نیست؛ `Compiler` جامع‌تر از `memo` تنها عمل می‌کند

---

## چه زمانی استفاده کنیم؟

- کامپوننت سنگین با `props` پایدار
- لیست‌های بزرگ با آیتم‌های `memoized`
- همراه با `useCallback` / `useMemo` برای `props` پایدار

---

## چه زمانی استفاده نکنیم؟

- کامپوننت سبک (هزینه `memo` بیشتر از سودش است)
- `props` هر بار `reference` جدید می‌گیرند (`object`/`array`/`function` بدون `memoization`)
- بهینه‌سازی زودهنگام (`premature optimization`) قبل از پروفایل
- پروژه با کامپایلر React فعال — مگر پروفایل نشان دهد `bottleneck` خاصی مانده

---

## Syntax

```jsx
import { memo } from "react";

const ExpensiveList = memo(function ExpensiveList({ items, onSelect }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id} onClick={() => onSelect(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
});

// مقایسه سفارشی (اختیاری)
const UserCard = memo(
  function UserCard({ user }) {
    return <div>{user.name}</div>;
  },
  (prev, next) => prev.user.id === next.user.id,
);
```

---

## 💡 مثال ساده

```jsx
import { memo, useState, useCallback } from "react";

const Child = memo(function Child({ label, onClick }) {
  console.log("Child render:", label);
  return <button onClick={onClick}>{label}</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  const handleClick = useCallback(() => setCount((c) => c + 1), []);

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <Child label={`Count: ${count}`} onClick={handleClick} />
    </div>
  );
}
```

با تایپ در `input`، `Child` `re-render` نمی‌شود چون `props`ش ثابت مانده‌اند.

---

## مثال واقعی در پروژه

در لیست سفارش‌های پیتزا (fast-react-pizza)، آیتم‌های سبد خرید با `memo` و `callback` پایدار از `re-render` کل لیست هنگام تغییر یک فیلد دیگر جلوگیری می‌کنند.

---

## 🚀 Best Practices

✅ ابتدا پروفایل کنید، بعد `memo` بزنید — [Profiler](../Performance/Profiling.md)  
✅ `props` پایدار با `useCallback` / `useMemo`  
✅ `key` درست در لیست‌ها  
✅ کامپایلر React را در پروژه‌های جدید بررسی کنید

---

## ⚠️ اشتباهات رایج

❌ `memo` روی همه کامپوننت‌ها بدون دلیل  
❌ فراموش کردن `memoization` والد برای `function props`  
❌ `memo` روی کامپوننتی که `props` هر بار `reference` جدید می‌گیرد  
❌ بهینه‌سازی قبل از پروفایل (`premature optimization`)  
❌ انتظار معجزه از `memo` بدون [State Colocation](../Performance/State-Colocation.md)

---

## ارتباط با مفاهیم دیگر

- [useMemo](../Hooks/useMemo.md) · [useCallback](../Hooks/useCallback.md)
- [Performance/Memoization.md](../Performance/Memoization.md)
- [Performance/Render-Cycle.md](../Performance/Render-Cycle.md)
- [Performance/Re-render.md](../Performance/Re-render.md)
- [Escape-Hatches/React-Compiler.md](../Escape-Hatches/React-Compiler.md)
- [Higher-Order Components](./Higher-Order-Components.md)
- [Reusability Patterns](./Reusability-Patterns.md)

---

## خلاصه

با `React.memo` می‌توان `re-render` را رد کرد وقتی `props` از نظر `shallow` برابرند. همراه با `props` پایدار مؤثر است؛ با کامپایلر React اغلب `memo` دستی لازم نیست.

---

## 📚 منابع

- [React.memo — react.dev](https://react.dev/reference/react/memo)
- [React Compiler — react.dev](https://react.dev/learn/react-compiler)
- [Render and Commit — react.dev](https://react.dev/learn/render-and-commit)
