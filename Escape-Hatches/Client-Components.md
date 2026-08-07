# Client Components — کامپوننت کلاینت

> کامپوننت‌هایی که در مرورگر اجرا می‌شوند — با `'use client'` برای `state`، `effect` و تعامل کاربر.

> 🧭 پیش‌نیاز: [Server Components](./Server-Components.md) · بعدی: [React Compiler](./React-Compiler.md)

---

## 📖 مفهوم

در معماری RSC، هر کامپوننتی که به `state`، `effect`، `event handler` یا API مرورگر نیاز دارد باید `Client Component` باشد. در فریم‌ورک‌هایی مثل Next.js App Router، با directive `'use client'` در بالای فایل مشخص می‌شود.

---

## چرا

کامپوننت سرور نمی‌تواند `onClick`، `useState` یا `window` داشته باشد. هر بخش تعاملی UI باید در مرورگر اجرا شود — `Client Component` این مرز را مشخص می‌کند.

---

## چه مشکلی را حل می‌کند؟

- جداسازی واضح سرور/کلاینت
- کاهش `JavaScript` ارسالی (فقط `Client Component`ها در `bundle`)
- امکان `hydration` فقط جایی که لازم است

---

## ⚙️ نحوه کار

1. فایل با `'use client'` در خط اول — و تمام importهای آن
2. کامپوننت در مرورگر `hydrate` می‌شود
3. می‌تواند `state`، `effect`، event handler داشته باشد
4. می‌تواند `Server Component` را به‌عنوان `children` بپذیرد

### مرز `'use client'`

```
'use client' در بالای فایل
    ↓
این فایل + همه importهای مستقیم/غیرمستقیم = Client
```

اگر `Button.js` با `'use client'` باشد و `Form.js` آن را import کند، `Form.js` هم Client می‌شود — مگر `'use client'` فقط در `Button` باشد و `Form` Server بماند و `Button` را به‌عنوان فرزند بپذیرد.

---

## Syntax

```jsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>شمارش: {count}</button>;
}
```

---

## چه چیزی `Client Component` می‌شود؟

| نیاز                                | Client                |
| ----------------------------------- | --------------------- |
| `useState`، `useReducer`            | بله                   |
| `useEffect`، `useLayoutEffect`      | بله                   |
| event handler (`onClick`، ...)      | بله                   |
| `browser API` (`localStorage`، ...) | بله                   |
| `Custom Hook` با `state`/`effect`   | بله                   |
| فقط نمایش داده از `props`           | خیر — Server کافی است |

---

## تفاوت با Server Component

| جنبه | Server Component | Client Component |
| ---- | ---------------- | ---------------- |
| اجرا | سرور | مرورگر |
| `state`/`effect` | غیرمجاز | مجاز |
| event handler | غیرمجاز | مجاز |
| در `bundle` کلاینت | خیر | بله |
| directive | پیش‌فرض (Next.js) | `'use client'` |
| بهترین برای | `fetch`، DB، نمایش داده | تعامل، فرم، انیمیشن |

قانون عملی: پیش‌فرض کامپوننت سرور — فقط لایه تعاملی را `Client Component` کنید.

---

## الگوی `interleaving`

کامپوننت سرور می‌تواند `Client Component` را import و `render` کند:

```jsx
// app/page.js — Server
import SearchBar from "./SearchBar"; // Client

export default async function Page() {
  const data = await fetchData();
  return (
    <div>
      <SearchBar /> {/* Client — تعامل */}
      <DataTable data={data} /> {/* Server — فقط نمایش */}
    </div>
  );
}
```

کامپوننت کلاینت می‌تواند `children` از سرور بپذیرد:

```jsx
"use client";

export function Modal({ children, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal">{children}</div>
    </div>
  );
}
```

```jsx
// Server
<Modal onClose={...}>
  <ServerContent /> {/* Server Component به‌عنوان children */}
</Modal>
```

---

## 💡 مثال — فرم با Server Action

```jsx
"use client";

import { useActionState } from "react";
import { submitForm } from "./actions";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitForm, null);

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <button disabled={isPending}>
        {isPending ? "در حال ارسال..." : "ارسال"}
      </button>
      {state?.error && <p>{state.error}</p>}
    </form>
  );
}
```

جزئیات Server Actions: [Nextjs/Server-Actions.md](../Nextjs/Server-Actions.md) (M10).

---

## 🚀 Best Practices

- `Client Component` را **کوچک** نگه دارید — فقط لایه تعاملی
- `Server Component` والد برای `fetch` و `layout`
- `props` از Server به Client باید سریال‌پذیر باشند
- از `'use client'` در ریشه اپ پرهیز کنید — درخت را Server نگه دارید

---

## ⚠️ اشتباهات رایج

- `'use client'` در هر فایل — کل اپ Client می‌شود
- `fetch` سنگین در Client وقتی Server می‌تواند
- پاس دادن تابع/کلاس از Server به Client
- import کتابخانه `server-only` در فایل `Client Component`

---

## ارتباط با مفاهیم دیگر

- [Server-Components.md](./Server-Components.md)
- [Hooks/use.md](../Hooks/use.md)
- [Nextjs/Client-Server-Interleaving.md](../Nextjs/Client-Server-Interleaving.md) (M10)
- [README.md](./README.md)

---

## خلاصه

کامپوننت کلاینت با `'use client'` مشخص می‌شود و برای تعامل، `state` و `effect` لازم است. در معماری RSC، کامپوننت سرور داده می‌آورد و کامپوننت کلاینت تعامل را مدیریت می‌کند.

---

## 📚 منابع

- [use client — react.dev](https://react.dev/reference/rsc/use-client)
- [Server Components — react.dev](https://react.dev/reference/rsc/server-components)
- [Passing data — react.dev](https://react.dev/learn/passing-data-deeply-with-context)
