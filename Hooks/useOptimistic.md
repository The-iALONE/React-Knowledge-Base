# useOptimistic

> برای نمایش UI خوش‌بینانه — قبل از اتمام `async operation`، `state` موقت نشان می‌دهد و بعد با نتیجه واقعی `sync` می‌شود.

---

## 📖 مفهوم

برای نمایش UI خوش‌بینانه قبل از اتمام عملیات `async`، از `useOptimistic` استفاده می‌شود — `state` موقت نشان داده می‌شود و بعد با نتیجه واقعی `sync` می‌شود.

---

## چرا

کاربر نباید منتظر پاسخ `server` برای دیدن نتیجه عمل (حذف، لایک، افزودن) بماند. UI خوش‌بینانه (`Optimistic UI`) احساس سرعت می‌دهد؛ اگر `server` خطا داد، `rollback` به `actualState` انجام می‌شود.

---

## مشکل

- بدون `handle` خطا → UI با `server` ناهماهنگ می‌ماند.
- برای عملیات غیرقابل برگشت بدون `confirm` خطرناک است.
- جایگزین `validation` سمت `server` نیست.

---

## نحوه کار

1. `optimisticState` از `actualState` مشتق می‌شود.
2. `addOptimistic(input)` فوری `updateFn(currentOptimistic, input)` را اجرا می‌کند.
3. UI با `optimisticState` `render` می‌شود.
4. وقتی `async` تمام و `actualState` عوض شد → `optimistic` `reset`/`sync`.

---

## Syntax

```jsx
const [optimisticState, addOptimistic] = useOptimistic(
  actualState,
  (currentState, optimisticValue) => {
    // return new optimistic state
  }
);
```

---

## پارامترها

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `state` | `T` | `state` واقعی (معمولاً از `props`/`server`) |
| `updateFn` | `(currentState: T, optimisticValue: A) => T` | `reducer` خوش‌بینانه |

---

## مقدار بازگشتی

| مقدار | نوع | توضیح |
|-------|-----|-------|
| `optimisticState` | `T` | `state` نمایشی (شامل تغییرات موقت) |
| `addOptimistic` | `(value: A) => void` | اعمال فوری تغییر خوش‌بینانه |

---

## مثال ساده

```jsx
import { useOptimistic } from 'react';

function TodoList({ todos }) {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (current, newTodo) => [...current, { ...newTodo, pending: true }]
  );

  async function addTodo(text) {
    addOptimistic({ id: crypto.randomUUID(), text });
    await saveTodo(text);
  }

  return (
    <ul>
      {optimisticTodos.map((t) => (
        <li key={t.id} className={t.pending ? 'opacity-50' : ''}>
          {t.text}
        </li>
      ))}
    </ul>
  );
}
```

---

## مثال واقعی

### E-commerce / Booking — حذف فوری رزرو

```jsx
'use client';

import { useOptimistic } from 'react';
import { deleteBooking } from '../_lib/actions';

function ReservationList({ bookings }) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (current, bookingId) => current.filter((b) => b.id !== bookingId)
  );

  async function handleDelete(bookingId) {
    optimisticDelete(bookingId);
    await deleteBooking(bookingId);
  }

  return (
    <ul>
      {optimisticBookings.map((booking) => (
        <ReservationCard
          key={booking.id}
          booking={booking}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}
```

### Dashboard — لایک پست

```jsx
function LikeButton({ post, onLike }) {
  const [optimisticLikes, addLike] = useOptimistic(
    post.likes,
    (current, _) => current + 1
  );

  async function handleLike() {
    addLike(null);
    try {
      await onLike(post.id);
    } catch {
      // actualState از server rollback می‌کند
    }
  }

  return <button onClick={handleLike}>❤️ {optimisticLikes}</button>;
}
```

---

## اشتباهات

```jsx
// ❌ بدون await / بدون sync با server state
optimisticDelete(id);
deleteBooking(id); // fire and forget — error ignored

// ❌ optimistic برای پرداخت بدون confirm
addOptimistic({ paid: true });
chargeCard(); // dangerous

// ✅ await + error handling + server revalidation
```

---

## Best Practices

- با Server Actions و `revalidatePath` در Next.js.
- خطا را catch کنید و toast نشان دهید.
- `hint` بصری برای `pending` (`opacity`، `strikethrough`).
- با `useTransition` برای `isPending` روی دکمه.

---

## When to Use / Not

| استفاده کنید | استفاده نکنید |
|-------------|---------------|
| `delete`، `like`، `toggle` | پرداخت، حذف دائمی بدون `confirm` |
| لیست با `sync` `server` | `state` کاملاً محلی |
| UX سریع در SPA/Next.js | وقتی `server` همیشه `source of truth` بدون `revalidate` |

---

## ارتباط با مفاهیم

- [useTransition.md](./useTransition.md) — `pending` `state`
- [useActionState.md](./useActionState.md) — `form actions`
- [Nextjs/Data-Fetching-And-Caching.md](../Nextjs/Data-Fetching-And-Caching.md)

---

## نکات

- React 19+ `built-in hook`.
- قبلاً با کتابخانه‌ها (SWR optimistic، React Query) انجام می‌شد.
- `actualState` باید بعد از موفقیت `server` به‌روز شود (`revalidate`).

---

## Interview

**سوال:** `optimistic UI` چیست؟  
**جواب:** نمایش نتیجه فرضی قبل از تأیید `server`؛ بعد `sync` یا `rollback`.

**سوال:** تفاوت با `useTransition`؟  
**جواب:** در `transition` اولویت `render` تنظیم می‌شود؛ در `optimistic` `state` موقت قبل از پاسخ `server` نمایش داده می‌شود.

---

## خلاصه

با `useOptimistic` UI فوری به‌روز می‌شود و با `state` واقعی `sync` می‌شود. برای `delete`/`like`/`toggle` با `Server Actions` عالی است؛ خطا را `handle` کنید.

---

## منابع

- [useOptimistic — react.dev](https://react.dev/reference/react/useOptimistic)
