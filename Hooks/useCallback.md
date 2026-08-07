# useCallback

> برای `cache` کردن **تابع** بین `render`ها — reference تابع تا زمانی که `deps` تغییر نکنند ثابت می‌ماند.

> 🧭 پیش‌نیاز: [useMemo](./useMemo.md) · بعدی: [useRef](./useRef.md)

---

## 📖 مفهوم

برای نگه‌داری یک تابع با همان `reference` بین `render`ها، از `useCallback` استفاده می‌شود. اگر `deps` تغییر نکنند، همان تابع قبلی برمی‌گردد — از نظر مکانیزم معادل `useMemo(() => fn, deps)` است.

---

## چرا

در JavaScript هر بار که کامپوننت `render` می‌شود، توابع داخلش **جدید** ساخته می‌شوند (`handleClick !== handleClick`). اگر `DataRow` با `React.memo` بهینه شده باشد، ولی هر بار `onDelete` جدید بگیرد، مثل این است که قفل بهینه‌سازی را باز گذاشته‌اید — `child` باز هم `re-render` می‌شود.

---

## چه مشکلی را حل می‌کند؟

- `wrap` کردن همه `handler`ها بدون دلیل → پیچیدگی بی‌فایده.
- `deps` ناقص → `stale closure` (تابع مقادیر قدیمی را می‌بیند).
- فکر کردن `useCallback` همیشه `performance` را بهتر می‌کند — اشتباه است.

---

## ⚙️ نحوه کار

1. React تابع را با `deps` ذخیره می‌کند.
2. `render` بعدی: اگر `deps` برابر باشند → همان تابع قبلی.
3. اگر `deps` تغییر کرده → تابع جدید ساخته و `cache` می‌شود.

---

## Syntax

```jsx
const cachedFn = useCallback(fn, dependencies);
```

```jsx
const handleClick = useCallback(() => {
  setCount((c) => c + 1);
}, []);
```

---

## پارامترها

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `fn` | `(...args) => T` | تابعی که `cache` می‌شود |
| `dependencies` | `unknown[]` | وابستگی‌ها |

---

## مقدار بازگشتی

| مقدار | نوع | توضیح |
|-------|-----|-------|
| `cachedFn` | `(...args) => T` | همان تابع (یا reference پایدار) |

---

## مثال ساده

```jsx
import { useCallback, useState, memo } from 'react';

const Button = memo(function Button({ onClick, label }) {
  console.log('Button render');
  return <button onClick={onClick}>{label}</button>;
});

function Counter() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  return (
    <>
      <p>{count}</p>
      <Button onClick={increment} label="+" />
    </>
  );
}
```

---

## مثال واقعی

### Dashboard — handler پایدار برای جدول `memoized`

```jsx
const DataRow = memo(function DataRow({ row, onDelete }) {
  return (
    <tr>
      <td>{row.name}</td>
      <td><button onClick={() => onDelete(row.id)}>Delete</button></td>
    </tr>
  );
});

function DataTable({ rows }) {
  const [data, setData] = useState(rows);

  const handleDelete = useCallback((id) => {
    setData((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return (
    <table>
      {data.map((row) => (
        <DataRow key={row.id} row={row} onDelete={handleDelete} />
      ))}
    </table>
  );
}
```

### Auth — callback در `useEffect` `deps`

```jsx
function SessionWatcher({ userId }) {
  const fetchSession = useCallback(async () => {
    const res = await fetch(`/api/session/${userId}`);
    return res.json();
  }, [userId]);

  useEffect(() => {
    fetchSession().then(/* ... */);
  }, [fetchSession]);

  return null;
}
```

### E-commerce — add to cart

```jsx
function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleAdd = useCallback(() => {
    addItem({ id: product.id, qty: 1 });
  }, [addItem, product.id]);

  return <button onClick={handleAdd}>Add to cart</button>;
}
```

---

## ⚠️ اشتباهات رایج

```jsx
// ❌ useCallback با deps ناقص
const save = useCallback(() => {
  api.save(formData); // formData stale!
}, []);

// ✅ formData در deps
const save = useCallback(() => {
  api.save(formData);
}, [formData]);

// ❌ useCallback بدون memo child — بی‌فایده
const onClick = useCallback(() => setOpen(true), []);
return <button onClick={onClick}>Open</button>; // button not memoized
```

---

## 🚀 Best Practices

- فقط وقتی `child` `memo` شده یا تابع در `useEffect` `deps` است.
- اگر می‌توانید تابع را داخل `useEffect` منتقل کنید، `useCallback` لازم نیست.
- با `setState(prev => ...)` می‌توانید `deps` را کم کنید — `useCallback(() => setCount(c => c + 1), [])` اغلب کافی است.
- `dispatch` از `useReducer` پایدار است — برای آن `useCallback` لازم نیست.
- ابتدا بدون `useCallback` بنویسید؛ [React Compiler](../Escape-Hatches/React-Compiler.md) در آینده بسیاری را خودکار می‌کند.

---

## When to Use / Not

| استفاده کنید | استفاده نکنید |
|-------------|---------------|
| `prop` به `memo` `child` | `handler` ساده روی `native element` |
| `dependency` در `useEffect` | `premature optimization` |
| `custom hook` که `callback` برمی‌گرداند | هر `onClick` در اپ |

---

## ارتباط با مفاهیم دیگر

- [useMemo.md](./useMemo.md) — `cache` مقدار
- [useReducer.md](./useReducer.md) — `dispatch` پایدار، بدون نیاز به `useCallback`
- [Patterns/React-Memo.md](../Patterns/React-Memo.md) — `React.memo`
- [useEffect.md](./useEffect.md) — `deps` و `stale closure`
- [Escape-Hatches/React-Compiler.md](../Escape-Hatches/React-Compiler.md) — memoization خودکار

---

## نکات

- `useCallback(fn, [])` با `functional setState` اغلب کافی است.
- React 19 Compiler می‌تواند خودکار `memoize` کند.

---

## Interview

**سوال:** `useCallback` چه مشکلی را حل می‌کند؟  
**جواب:** برای `reference stability` — جلوگیری از `re-render` `child`های `memoized` و `re-run` `effect` وقتی تابع در `deps` است.

**سوال:** آیا `useCallback` همیشه سریع‌تر است؟  
**جواب:** نه. خودش هزینه دارد. فقط وقتی `reference stability` لازم است مفید است.

---

## خلاصه

با `useCallback` تابع بین `render`ها با همان `reference` نگه داشته می‌شود. برای `props` به `memo` `child` و `deps` در `useEffect` استفاده کنید؛ `overuse` نکنید.

---

## 📚 منابع

- [useCallback — react.dev](https://react.dev/reference/react/useCallback)
