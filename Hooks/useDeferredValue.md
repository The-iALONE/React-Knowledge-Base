# useDeferredValue

> برای `defer` کردن یک مقدار — React ابتدا UI فوری را نشان می‌دهد و مقدار `deferred` را با اولویت پایین‌تر به‌روز می‌کند.

---

## 📖 مفهوم

برای `defer` کردن یک مقدار و اولویت پایین‌تر به‌روزرسانی آن، از `useDeferredValue` استفاده می‌شود — React ابتدا UI فوری را نشان می‌دهد و مقدار `deferred` را با اولویت پایین‌تر به‌روز می‌کند. مثل `debounce` داخلی React برای نگه داشتن UI `responsive`.

---

## چرا

وقتی کاربر سریع تایپ می‌کند و هر `keystroke` باعث فیلتر لیست ۱۰هزار تایی می‌شود، UI کند می‌شود. با `defer` کردن مقدار فیلتر، `input` فوری به‌روز می‌ماند ولی لیست با تأخیر کوتاه `sync` می‌شود.

---

## مشکل

- جایگزین `useTransition` نیست — `useDeferredValue` `passive` است (فقط `value` را `defer` می‌کند).
- برای داده سمت `server` کافی نیست — Suspense/React Query لازم است.
- ممکن است دو نسخه `value` (قدیم و جدید) موقتاً نمایش داده شود.

---

## نحوه کار

1. `deferredQuery = useDeferredValue(query)` — وقتی `query` عوض شود.
2. اگر `render` سنگین در صف باشد، `deferredQuery` مقدار قبلی را نگه می‌دارد.
3. وقتی React وقت دارد، `deferredQuery` به `query` جدید می‌رسد.
4. کامپوننت با `deferredQuery` `render` می‌شود (سبک‌تر برای `urgent` path).

---

## Syntax

```jsx
const deferredValue = useDeferredValue(value);
const deferredValue = useDeferredValue(value, initialValue); // React 19
```

```jsx
const deferredQuery = useDeferredValue(query);
const results = useMemo(() => search(items, deferredQuery), [items, deferredQuery]);
```

---

## پارامترها

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `value` | `T` | مقداری که `defer` می‌شود |
| `initialValue` | `T` (optional, React 19) | مقدار در اولین `render`؛ بدون آن در `mount` اول `defer` نمی‌شود |

---

## مقدار بازگشتی

| مقدار | نوع | توضیح |
|-------|-----|-------|
| `deferredValue` | `T` | همان نوع `value`؛ ممکن است یک `render` عقب باشد |

---

## مثال ساده

```jsx
import { useState, useDeferredValue, useMemo } from 'react';

function SearchPage({ items }) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(
    () => items.filter((i) => i.name.includes(deferredQuery)),
    [items, deferredQuery]
  );

  const isStale = query !== deferredQuery;

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul style={{ opacity: isStale ? 0.6 : 1 }}>
        {results.map((r) => <li key={r.id}>{r.name}</li>)}
      </ul>
    </>
  );
}
```

---

## مثال واقعی

### Dashboard — جستجوی جدول بزرگ

```jsx
function DataTable({ rows }) {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const visibleRows = useMemo(() => {
    return rows.filter((r) =>
      r.name.toLowerCase().includes(deferredSearch.toLowerCase())
    );
  }, [rows, deferredSearch]);

  return (
    <>
      <SearchInput value={search} onChange={setSearch} />
      <Table rows={visibleRows} dimmed={search !== deferredSearch} />
    </>
  );
}
```

### E-commerce — پیش‌نمایش محصول

```jsx
function ProductPreview({ config }) {
  const deferredConfig = useDeferredValue(config);
  return <Heavy3DPreview config={deferredConfig} />;
}
```

---

## اشتباهات

```jsx
// ❌ بدون useMemo — هنوز هر render فیلتر می‌شود
const results = items.filter((i) => i.name.includes(deferredQuery));

// ✅ محاسبه سنگین با deferred value
const results = useMemo(
  () => items.filter((i) => i.name.includes(deferredQuery)),
  [items, deferredQuery]
);

// ❌ برای API call
const deferredUserId = useDeferredValue(userId);
useEffect(() => fetchUser(deferredUserId), [deferredUserId]);
```

---

## Best Practices

- همیشه با `useMemo` برای محاسبه سنگین ترکیب کنید.
- `query !== deferredQuery` برای نشان دادن `stale` `state`.
- اگر خودتان `update` را کنترل می‌کنید → `useTransition`.
- اگر فقط `value` را `defer` می‌خواهید → `useDeferredValue`.

---

## When to Use / Not

| استفاده کنید | استفاده نکنید |
|-------------|---------------|
| `search` + لیست سنگین | `state` ساده |
| `preview` سنگین از `props` | `data fetching` |
| `defer` کردن `prop` به `child` سنگین | جایگزین `virtualization` |

---

## ارتباط با مفاهیم

- [useTransition.md](./useTransition.md) — کنترل فعال `update`
- [Performance/README.md](../Performance/README.md)
- [useMemo.md](./useMemo.md)

---

## نکات

- React 18 `Concurrent` feature.
- `useDeferredValue` و `useTransition` اغلب به یک هدف می‌رسند — انتخاب بر اساس کنترل.
- با `memo` روی `child` سنگین مؤثرتر است.

---

## Interview

**سوال:** `useDeferredValue` vs `useTransition`؟  
**جواب:** در `deferredValue` مقدار به‌صورت `passive` `defer` می‌شود؛ در `transition` خودتان `update` را با `startTransition` `wrap` می‌کنید. هر دو UI را `responsive` نگه می‌دارند.

---

## خلاصه

با `useDeferredValue` می‌توان یک `value` را با اولویت پایین‌تر `sync` کرد. برای `search` و `render` سنگین با `input` فوری ایده‌آل است.

---

## منابع

- [useDeferredValue — react.dev](https://react.dev/reference/react/useDeferredValue)
