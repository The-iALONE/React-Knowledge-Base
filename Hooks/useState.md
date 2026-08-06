# useState

> برای نگه‌داری `state` محلی در کامپوننت‌های تابعی React — `Hook` اصلی.

---

## 📖 مفهوم

در کامپوننت‌های تابعی، از `useState` برای نگه‌داری `state` محلی استفاده می‌شود. یک متغیر `state` و تابع به‌روزرسانی برمی‌گرداند. هر بار `setState` فراخوانی شود، React کامپوننت را دوباره `render` می‌کند.

---

## چرا

کامپوننت‌های React باید با تعامل کاربر (کلیک، تایپ، toggle) واکنش نشان دهند. بدون `state`، UI فقط `props` ثابت را نشان می‌دهد. `useState` ساده‌ترین راه نگه‌داری داده‌ای است که با زمان تغییر می‌کند.

---

## مشکل

- `state` را مستقیم `mutate` نکنید (`state.count++` کار نمی‌کند).
- به‌روزرسانی‌های پشت‌سرهم ممکن است `batch` شوند؛ از `functional update` استفاده کنید.
- `state` اولیه اگر محاسبه سنگین است، با `lazy initializer` بدهید.

---

## نحوه کار

1. در اولین `render`، React مقدار اولیه را ذخیره می‌کند.
2. `setState(newValue)` یا `setState(prev => newValue)`، `state` را `schedule` می‌کند.
3. React `re-render` می‌کند و مقدار جدید برمی‌گردد.
4. `state` بین `render`ها حفظ می‌شود (مثل instance variable در کلاس).

---

## Syntax

```jsx
const [state, setState] = useState(initialState);
```

---

## پارامترها

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `initialState` | `T` یا `() => T` | مقدار اولیه یا تابع `lazy initializer` |

---

## مقدار بازگشتی

| مقدار | نوع | توضیح |
|-------|-----|-------|
| `state` | `T` | مقدار فعلی `state` |
| `setState` | `(value: T \| (prev: T) => T) => void` | تابع به‌روزرسانی |

---

## مثال ساده

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}
```

---

## مثال واقعی

### Dashboard — فیلتر جدول

```jsx
function OrdersTable({ orders }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchSearch = o.id.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="shipped">Shipped</option>
      </select>
      <table>{/* render filtered */}</table>
    </>
  );
}
```

### Auth — فرم لاگین

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

### E-commerce — سبد خرید

```jsx
function Cart() {
  const [items, setItems] = useState([]);

  function addItem(product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (/* UI */);
}
```

---

## اشتباهات

```jsx
// ❌ mutate state
const [user, setUser] = useState({ name: 'Ali' });
user.name = 'Sara'; // wrong!

// ✅ immutable update
setUser({ ...user, name: 'Sara' });

// ❌ stale closure in rapid updates
setCount(count + 1);
setCount(count + 1); // only +1 total

// ✅ functional update
setCount((c) => c + 1);
setCount((c) => c + 1); // +2 total
```

---

## Best Practices

- `state` را کوچک و `focused` نگه دارید؛ `state` نامرتبط را جدا کنید.
- برای `object`/`array` همیشه `immutable update` کنید.
- `initializer` سنگین: `useState(() => expensiveCalc())`.
- `state` مشتق‌شده را در `state` ذخیره نکنید؛ در `render` محاسبه کنید.

---

## When to Use / Not

| استفاده کنید | استفاده نکنید |
|-------------|---------------|
| `state` محلی کامپوننت | `state` سراسری پیچیده → `Context`/Redux |
| فرم ساده، `toggle`، `counter` | `state` با منطق `update` پیچیده → `useReducer` |
| UI موقت (`modal` باز/بسته) | داده `server` → React Query/SWR |

---

## ارتباط با مفاهیم

- [State.md](../State.md) — اصول `state` در React
- [useReducer.md](./useReducer.md) — `state` پیچیده‌تر
- [Lifting-State-Up.md](../Lifting-State-Up.md) — اشتراک `state` بین siblings

---

## نکات

- React 18+ به‌روزرسانی‌های async را `batch` می‌کند.
- `setState` همان reference را برمی‌گرداند اگر مقدار با `Object.is` برابر باشد → `re-render` نمی‌شود.

---

## Interview

**سوال:** تفاوت `setCount(count + 1)` و `setCount(c => c + 1)`؟  
**جواب:** در `functional update` همیشه آخرین `state` گرفته می‌شود؛ مستقیم از `closure` ممکن است `stale` باشد.

**سوال:** چرا `useState({})` و `mutate` کار نمی‌کند؟  
**جواب:** در React تشخیص تغییر با `reference equality` انجام می‌شود؛ `mutate` همان `reference` را نگه می‌دارد.

---

## خلاصه

با `useState` می‌توان پایه `state` محلی در React را مدیریت کرد. مقدار + `setter` برمی‌گرداند؛ همیشه به‌روزرسانی `immutable` کنید و برای `update`های وابسته به `state` قبلی از `functional form` استفاده کنید.

---

## منابع

- [useState — react.dev](https://react.dev/reference/react/useState)
