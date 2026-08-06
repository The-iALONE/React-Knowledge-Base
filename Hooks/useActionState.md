# useActionState

> برای مدیریت `state` فرم همراه با Server Action — `state`، `pending` و نتیجه action در یک API.

---

## 📖 مفهوم

برای مدیریت `state` فرم همراه با `Server Action`، از `useActionState` استفاده می‌شود — `state`، `pending` و نتیجه `action` در یک API. جایگزین `useFormState` در React 18 در React 19 است.

---

## چرا

فرم‌های `server-driven` (Next.js Server Actions) نیاز به `state` خطا، پیام موفقیت و `pending` دارند. `useActionState` این را بدون `useState` دستی یکپارچه می‌کند.

---

## مشکل

- فقط با `form action` یا `dispatch` دستی — نه هر `event`.
- `Server Action` باید `(prevState, formData) => newState` باشد.
- فقط در `Client Component` (`'use client'`).

---

## نحوه کار

1. Server Action با signature `(previousState, formData) => state` تعریف می‌شود.
2. `useActionState` action را wrap می‌کند.
3. `submit` فرم → `action` اجرا → `state` به‌روز.
4. `isPending` (از `return` سوم در برخی APIها) یا `useFormStatus` برای `loading`.

---

## Syntax

```jsx
const [state, formAction, isPending] = useActionState(serverAction, initialState);
```

```jsx
<form action={formAction}>
  <input name="email" />
  {state.error && <p>{state.error}</p>}
  <button disabled={isPending}>Submit</button>
</form>
```

---

## پارامترها

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `action` | `(state, payload) => state \| Promise<state>` | `Server Action` یا `async function` |
| `initialState` | `A` | `state` اولیه |
| `permalink` (optional) | `string` | برای progressive enhancement |

---

## مقدار بازگشتی

| مقدار | نوع | توضیح |
|-------|-----|-------|
| `state` | `A` | `state` فعلی (خطا، success، data) |
| `formAction` | `Function` | action برای `<form action={}>` |
| `isPending` | `boolean` | آیا action در حال اجراست |

---

## مثال ساده

```jsx
'use client';

import { useActionState } from 'react';

async function signupAction(prevState, formData) {
  const email = formData.get('email');
  if (!email) return { error: 'Email required' };

  try {
    await createUser(email);
    return { success: true };
  } catch (e) {
    return { error: e.message };
  }
}

function SignupForm() {
  const [state, action, isPending] = useActionState(signupAction, {});

  return (
    <form action={action}>
      <input name="email" type="email" />
      {state.error && <p className="error">{state.error}</p>}
      {state.success && <p>Welcome!</p>}
      <button disabled={isPending}>
        {isPending ? 'Signing up...' : 'Sign up'}
      </button>
    </form>
  );
}
```

---

## مثال واقعی

### Auth — لاگین با Server Action

```jsx
// actions.js (server)
'use server';

export async function loginAction(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const result = await authenticate(email, password);
  if (!result.ok) return { error: 'Invalid credentials' };

  redirect('/dashboard');
}

// LoginForm.jsx (client)
'use client';

function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, null);

  return (
    <form action={action} className="space-y-4">
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      {state?.error && <Alert>{state.error}</Alert>}
      <SubmitButton pending={isPending} />
    </form>
  );
}
```

### E-commerce — افزودن به سبد

```jsx
async function addToCartAction(prev, formData) {
  const productId = formData.get('productId');
  await addToCart(productId);
  return { message: 'Added to cart!', count: prev.count + 1 };
}
```

---

## اشتباهات

```jsx
// ❌ action بدون prevState در signature server
async function badAction(formData) { /* ... */ }

// ✅
async function goodAction(prevState, formData) { /* ... */ }

// ❌ useActionState در Server Component
// Server Actions در فایل 'use server' — hook در 'use client'
```

---

## Best Practices

- `state` را `typed` کنید: `{ error?: string; success?: boolean }`.
- `validation` در `server action`.
- `useFormStatus` برای دکمه `submit` در `child component`.
- بعد از موفقیت: `redirect` یا `revalidatePath`.

---

## When to Use / Not

| استفاده کنید | استفاده نکنید |
|-------------|---------------|
| فرم + `Server Action` | `fetch` دستی در `client` |
| `state` خطا/موفقیت فرم | `state` محلی ساده بدون `server` |
| Next.js App Router | SPA بدون `server actions` |

---

## ارتباط با مفاهیم

- [useFormStatus.md](./useFormStatus.md) — `pending` در child
- [Forms.md](../Forms.md)
- [Nextjs/README.md](../Nextjs/README.md)

---

## نکات

- React 19: `useActionState` جایگزین `useFormState` از `react-dom`.
- `import` از `'react'` نه `'react-dom'`.
- `progressive enhancement`: فرم بدون JS هم کار می‌کند.

---

## Interview

**سوال:** `useActionState` چیست؟  
**جواب:** برای `bind` کردن `Server Action` به فرم با `state` خودکار (خطا، `pending`، نتیجه).

**سوال:** تفاوت با `useState` + `onSubmit`؟  
**جواب:** یکپارچگی با `Server Actions`، `progressive enhancement`، و `state` از هر `submit`.

---

## خلاصه

با `useActionState` فرم به `Server Action` وصل می‌شود و `state` نتیجه مدیریت می‌شود. استاندارد فرم‌ها در React 19 + Next.js است.

---

## منابع

- [useActionState — react.dev](https://react.dev/reference/react/useActionState)
