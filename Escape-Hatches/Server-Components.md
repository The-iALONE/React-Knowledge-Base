# Server Components — کامپوننت سرور (RSC)

> کامپوننت‌هایی که فقط روی سرور اجرا می‌شوند — بدون `state`، `effect` و `bundle` JavaScript اضافی در مرورگر.

---

## 📖 مفهوم

در معماری React Server Components (RSC)، بخشی از درخت کامپوننت روی سرور `render` می‌شود و خروجی آن به‌صورت فرمت سریال‌شده (پروتکل `Flight`) به کلاینت فرستاده می‌شود. این کامپوننت‌ها به `bundle` کلاینت اضافه نمی‌شوند و مستقیماً به `state`/`effect`/event handler دسترسی ندارند.

---

## چرا

بسیاری از کامپوننت‌ها فقط داده نمایش می‌دهند — بدون تعامل. اجرای آن‌ها روی سرور:

- حجم `JavaScript` کلاینت را کم می‌کند
- دسترسی مستقیم به دیتابیس/API داخلی
- داده حساس در مرورگر نمی‌رود

---

## چه مشکلی را حل می‌کند؟

- `bundle` بزرگ کلاینت
- `waterfall` درخواست `fetch` از مرورگر
- افشای منطق/کلید API در کلاینت
- `loading state` پیچیده برای داده اولیه

---

## ⚙️ نحوه کار

```
Server: render RSC → serialize (Flight) → stream به کلاینت
Client: hydrate Client Components + نمایش RSC output
```

### محدودیت‌های Server Component

| مجاز                        | غیرمجاز                        |
| --------------------------- | ------------------------------ |
| `async/await` مستقیم        | `useState`، `useReducer`       |
| `fetch` سرور                | `useEffect`، `useLayoutEffect` |
| خواندن فایل/DB              | event handler (`onClick`)      |
| import ماژول سرور           | `window`، `document`           |
| `props` به Client Component | `use()` با `context` (در RSC)  |

### `Serialization`

`props` پاس‌داده‌شده به Client Component باید **قابل سریال** باشند:

- `string`، `number`، `boolean`، `null`
- آرایه و `object` ساده
- `Date`، `Map`، `Set` (با محدودیت)
- **نه:** تابع، `class instance`، DOM node

---

## Syntax (Next.js App Router)

```jsx
// app/page.js — پیش‌فرض Server Component
async function Page() {
  const posts = await fetch("https://api.example.com/posts").then((r) =>
    r.json(),
  );

  return (
    <main>
      <h1>پست‌ها</h1>
      <PostList posts={posts} />
    </main>
  );
}
```

نیاز به `'use server'` یا `'use client'` ندارد — پیش‌فرض سرور است.

---

## تفاوت RSC با SSR کلاسیک

|                       | SSR کلاسیک                                | RSC                                 |
| --------------------- | ----------------------------------------- | ----------------------------------- |
| خروجی                 | HTML کامل                                 | HTML + payload `Flight`             |
| `JavaScript` کامپوننت | در `bundle` کلاینت                        | `Server Component` در `bundle` نیست |
| `hydration`           | کل صفحه                                   | فقط Client Components               |
| `fetch`               | معمولاً در کلاینت یا `getServerSideProps` | مستقیم در کامپوننت                  |

---

## الگوی ترکیب با `Client Component`

```jsx
// Server Component
import LikeButton from "./LikeButton"; // Client Component

async function Post({ id }) {
  const post = await getPost(id);
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <LikeButton postId={id} likes={post.likes} />
    </article>
  );
}
```

```jsx
// LikeButton.js — Client Component
"use client";

import { useState } from "react";

export default function LikeButton({ postId, likes }) {
  const [count, setCount] = useState(likes);
  return <button onClick={() => setCount((c) => c + 1)}>❤️ {count}</button>;
}
```

---

## مثال واقعی در پروژه

در Next.js App Router، صفحه لیست پست‌ها به‌صورت `Server Component` داده را مستقیم از دیتابیس می‌خواند و فقط دکمه لایک به‌عنوان `Client Component` در `bundle` کلاینت می‌ماند.

---

## 🚀 Best Practices

- پیش‌فرض Server؛ فقط وقتی لازم است `'use client'`
- داده و منطق سنگین روی سرور
- `props` سریال‌پذیر به `Client Component`
- `Suspense` برای `streaming` (در Next.js: `loading.js`)

---

## ⚠️ اشتباهات رایج

- `useState`/`useEffect` در `Server Component`
- پاس دادن تابع به `Client Component`
- import کتابخانه سنگین `client-only` در `Server Component`
- فرض اینکه RSC بدون فریم‌ورک کار می‌کند — نیاز به bundler سازگار (Next.js، ...)

---

## ارتباط با مفاهیم دیگر

- [Client-Components.md](./Client-Components.md)
- [Suspense.md](./Suspense.md) — `streaming`
- [Hooks/use.md](../Hooks/use.md) — محدودیت `use(context)` در RSC
- [Nextjs/README.md](../Nextjs/README.md) — پیاده‌سازی (M10)

---

## خلاصه

کامپوننت سرور روی سرور اجرا می‌شود، به `bundle` کلاینت اضافه نمی‌شود، و برای داده/منطق بدون تعامل ایده‌آل است. با `Client Component` و `'use client'` ترکیب می‌شود.

---

## 📚 منابع

- [Server Components — react.dev](https://react.dev/reference/rsc/server-components)
- [Server Components — react.dev learn](https://react.dev/learn/start-a-new-react-project)
- [use client — react.dev](https://react.dev/reference/rsc/use-client)
