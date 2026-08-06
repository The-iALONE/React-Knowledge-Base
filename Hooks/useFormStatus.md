# useFormStatus

> با `useFormStatus` می‌توان وضعیت `submit` فرم والد را خواند — معمولاً برای `disable` کردن دکمه و نمایش `loading`.

---

## 📖 مفهوم

برای خواندن وضعیت آخرین `submit` فرم والد، از `useFormStatus` استفاده می‌شود: `pending` (در حال ارسال)، `data` (`FormData`)، `method`، `action`. برای جدا کردن دکمه `submit` به `child component` طراحی شده.

---

## چرا

دکمه `submit` اغلب در کامپوننت جدا از `<form>` است (طراحی UI). `useFormStatus` بدون `prop drilling` به `pending` دسترسی می‌دهد — فقط باید **داخل** `<form>` و در `Client Component` باشد.

---

## مشکل

- نباید در همان کامپوننتی که `<form>` را `render` می‌کند استفاده شود — فقط در `descendant`.
- فقط برای form با `action` (Server Action یا function).
- بدون `'use client'` کار نمی‌کند.

---

## نحوه کار

1. فرم با `action={serverAction}` `submit` می‌شود.
2. React وضعیت `pending` را track می‌کند.
3. child با `useFormStatus()` → `{ pending: true }`.
4. بعد از اتمام action → `pending: false`.

---

## Syntax

```jsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

---

## پارامترها

بدون پارامتر.

---

## مقدار بازگشتی

| فیلد | نوع | توضیح |
|------|-----|-------|
| `pending` | `boolean` | آیا `form` در حال `submit` است |
| `data` | `FormData \| null` | داده ارسالی |
| `method` | `string \| null` | GET/POST |
| `action` | `string \| function \| null` | `action` فرم |

---

## مثال ساده

```jsx
'use client';

import { useFormStatus } from 'react-dom';

function Button() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}

function ProfileForm({ action }) {
  return (
    <form action={action}>
      <input name="name" />
      <Button />
    </form>
  );
}
```

---

## مثال واقعی

### Auth — به‌روزرسانی پروفایل

```jsx
'use client';

import { useFormStatus } from 'react-dom';
import { updateGuest } from '../_lib/actions';

function UpdateButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent-500 disabled:opacity-50"
    >
      {pending ? 'Updating...' : 'Update profile'}
    </button>
  );
}

function UpdateProfileForm({ guest }) {
  return (
    <form action={updateGuest} className="flex flex-col gap-6">
      <input name="fullName" defaultValue={guest.fullName} />
      <input name="email" defaultValue={guest.email} />
      <input name="nationalID" defaultValue={guest.nationalID} />
      <div className="flex justify-end">
        <UpdateButton />
      </div>
    </form>
  );
}
```

### E-commerce — checkout

```jsx
function PlaceOrderButton() {
  const { pending, data } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Processing payment...' : `Pay $${data?.get('total') ?? '—'}`}
    </button>
  );
}
```

---

## اشتباهات

```jsx
// ❌ useFormStatus در همان component که form دارد
function BadForm() {
  const { pending } = useFormStatus(); // always false / wrong
  return <form>...</form>;
}

// ❌ outside form tree
function Page() {
  const { pending } = useFormStatus();
  return <form action={action}>...</form>;
}

// ✅ child inside form
function Form() {
  return (
    <form action={action}>
      <SubmitButton />
    </form>
  );
}
```

---

## Best Practices

- کامپوننت جدا برای دکمه `submit` (`SubmitButton`).
- ترکیب با `useActionState` برای `state` خطا در parent.
- `type="submit"` روی دکمه.
- `import` از `'react-dom'`.

---

## When to Use / Not

| استفاده کنید | استفاده نکنید |
|-------------|---------------|
| دکمه `submit` در `child` | `onClick` + `fetch` بدون `form action` |
| `Server Action` forms | همان `component` فرم |
| `loading` روی `submit` | `state` محلی `onSubmit` |

---

## ارتباط با مفاهیم

- [useActionState.md](./useActionState.md) — `state` نتیجه فرم
- [Forms.md](../Forms.md)
- [Nextjs/Loading-And-Error-States.md](../Nextjs/Loading-And-Error-States.md)

---

## نکات

- React 19 — بخشی از فرم‌های مدرن.
- فقط نزدیک‌ترین `form ancestor` را می‌بیند.
- `pending` برای هر `submit` — حتی اگر چند دکمه `submit` داشته باشید.

---

## Interview

**سوال:** چرا `useFormStatus` باید در child باشد؟  
**جواب:** برای جداسازی UI دکمه طراحی شده؛ `Hook` فقط وضعیت `form ancestor` را به `descendant` می‌دهد.

**سوال:** تفاوت با `isPending` از `useActionState`؟  
**جواب:** در `useActionState` در `parent` `state` کامل وجود دارد؛ در `useFormStatus` فقط `pending`/status در `child` بدون `props`.

---

## خلاصه

با `useFormStatus` وضعیت `submit` فرم والد در `child` در دسترس است. برای دکمه‌های `loading` در فرم‌های `Server Action` استفاده کنید — حتماً داخل `<form>`.

---

## منابع

- [useFormStatus — react.dev](https://react.dev/reference/react-dom/hooks/useFormStatus)
