# useTransition

> برای علامت‌گذاری `state update`ها به‌عنوان غیرفوری (`transition`) — UI واکنش‌گرا می‌ماند در حین `render` سنگین.

---

## 📖 مفهوم

برای علامت‌گذاری `state update`ها به‌عنوان غیرفوری (`transition`)، از `useTransition` استفاده می‌شود. دو مقدار برمی‌گرداند: `isPending` (آیا `transition` در جریان است) و `startTransition(fn)` (تابعی که `update`های داخلش را `non-urgent` می‌کند). React می‌تواند `update` فوری (مثل تایپ) را اول انجام دهد و `transition` را `interrupt` کند.

---

## چرا

بعضی `state update`ها (فیلتر لیست بزرگ، تغییر tab، navigation) `render` سنگین ایجاد می‌کنند و UI را `freeze` می‌کنند. `useTransition` اولویت را به تعامل کاربر می‌دهد.

---

## مشکل

- برای هر `async` کار لازم نیست — فقط `state update`های سنگین در React.
- `startTransition` `async function` را `await` نمی‌کند — فقط `sync` `setState` داخلش.
- جایگزین `loading state` دستی برای `Server Actions` نیست (ولی `isPending` کمک می‌کند).

---

## نحوه کار

1. `startTransition(() => setState(...))` `update` را `urgent` نیست علامت می‌زند.
2. React `update` فوری را اول `commit` می‌کند.
3. `transition` در پس‌زمینه `render` می‌شود.
4. `isPending === true` تا `transition` تمام شود.

---

## Syntax

```jsx
const [isPending, startTransition] = useTransition();
```

```jsx
startTransition(() => {
  setTab(nextTab);
});
```

---

## پارامترها

بدون پارامتر — Hook بدون آرگومان فراخوانی می‌شود.

---

## مقدار بازگشتی

| مقدار             | نوع                              | توضیح                          |
| ----------------- | -------------------------------- | ------------------------------ |
| `isPending`       | `boolean`                        | آیا `transition` در حال اجراست |
| `startTransition` | `(callback: () => void) => void` | شروع `transition`              |

---

## مثال ساده

```jsx
import { useState, useTransition } from "react";

function TabPanel() {
  const [tab, setTab] = useState("home");
  const [isPending, startTransition] = useTransition();

  function selectTab(next) {
    startTransition(() => setTab(next));
  }

  return (
    <>
      {isPending && <Spinner />}
      <TabBar active={tab} onSelect={selectTab} />
      <TabContent tab={tab} />
    </>
  );
}
```

---

## مثال واقعی

### Dashboard — حذف رزرو با Server Action

```jsx
"use client";

import { useTransition } from "react";
import { deleteReservation } from "../_lib/actions";

function DeleteReservation({ bookingId }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Are you sure?")) return;
    startTransition(() => deleteReservation(bookingId));
  }

  return (
    <button onClick={handleDelete} disabled={isPending}>
      {isPending ? <SpinnerMini /> : "Delete"}
    </button>
  );
}
```

### E-commerce — فیلتر محصولات سنگین

```jsx
function ProductFilter({ products }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(products);
  const [isPending, startTransition] = useTransition();

  function handleSearch(e) {
    const value = e.target.value;
    setQuery(value); // urgent — input responsive

    startTransition(() => {
      setFiltered(products.filter((p) => p.name.includes(value)));
    });
  }

  return (
    <>
      <input value={query} onChange={handleSearch} />
      {isPending && <span>Filtering...</span>}
      <ProductGrid items={filtered} />
    </>
  );
}
```

### Auth — تغییر route بدون block

```jsx
function NavLink({ href, children }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        startTransition(() => router.push(href));
      }}
      className={isPending ? "opacity-50" : ""}
    >
      {children}
    </a>
  );
}
```

---

## اشتباهات

```jsx
// ❌ async inside startTransition expecting await
startTransition(async () => {
  await fetchData(); // setState inside might be outside transition
});

// ❌ useTransition for every button click
startTransition(() => setCount(c + 1)); // unnecessary

// ✅ heavy list filter / tab switch / server action
```

---

## Best Practices

- `input`/`search` فوری بماند؛ فیلتر/لیست در `transition`.
- `isPending` برای `loading indicator`.
- با `useDeferredValue` مکمل است — یکی برای کنترل `update`، یکی برای `defer` value.
- در Next.js با Server Actions برای UX بهتر حذف/به‌روزرسانی.

---

## When to Use / Not

| استفاده کنید                   | استفاده نکنید                         |
| ------------------------------ | ------------------------------------- |
| `render` سنگین بعد از تعامل    | `update` ساده و سبک                   |
| `Server Action` + UI `pending` | جایگزین Suspense برای `data fetching` |
| `tab`/`filter`/لیست بزرگ       | همه `onClick`ها                       |

---

## ارتباط با مفاهیم

- [useDeferredValue.md](./useDeferredValue.md) — `defer` مقدار
- [useOptimistic.md](./useOptimistic.md) — UI خوش‌بینانه
- [Escape-Hatches/README.md](../Escape-Hatches/README.md) — Concurrent features

---

## نکات

- React 18+ `Concurrent` feature.
- `startTransition` فقط `sync` `update`ها را wrap می‌کند.
- با `useOptimistic` و Server Actions در Next.js 14+ ترکیب رایج است.

---

## Interview

**سوال:** `useTransition` چه مشکلی حل می‌کند؟  
**جواب:** با اولویت‌بندی `update` — `urgent` (تایپ) قبل از `non-urgent` (لیست سنگین) تا UI `responsive` بماند.

**سوال:** تفاوت با `debounce`؟  
**جواب:** در `transition` بخشی از `scheduler` React است؛ `debounce` تایمر خارجی است و `render` را `interrupt` نمی‌کند.

---

## خلاصه

با `useTransition` می‌توان `update`های غیرفوری را با `startTransition` علامت زد و `isPending` برای `loading` دریافت کرد. برای UI واکنش‌گر در `render` سنگین استفاده کنید.

---

## منابع

- [useTransition — react.dev](https://react.dev/reference/react/useTransition)
