# use

> API برای خواندن مقدار `promise` یا `context` در `render` — با پشتیبانی از شرط و حلقه (برخلاف `useContext`).

---

## 📖 مفهوم

برای خواندن مقدار یک `promise` یا `context` در `render`، از `use(resource)` استفاده می‌شود. با وجود پیشوند `use`، این API دقیقاً `Hook` نیست — می‌تواند داخل `if` و `for` فراخوانی شود. هنگام انتظار `promise`، کامپوننت `suspend` می‌کند و نیاز به `<Suspense>` دارد.

---

## چرا

- برای خواندن `context` شرطی، `use(context)` مجاز است — برخلاف `useContext` که فقط در top level است
- الگوی `useEffect` + `fetch` + `loading state` پراکنده — با `use(promise)` + `Suspense` `declarative` می‌شود
- الگوی یکپارچه برای داده ناهمگام در `render`

---

## چه مشکلی را حل می‌کند؟

- فراخوانی `use` داخل `try/catch` — پشتیبانی نمی‌شود؛ از `Error Boundary` استفاده کنید
- `promise` جدید در هر `render` — باید `cache` شود
- `use(context)` در `Server Component` — پشتیبانی نمی‌شود

---

## `use(promise)`

### نحوه کار

1. `use(promise)` مقدار resolve‌شده را برمی‌گرداند
2. اگر `pending` → کامپوننت `suspend` → نزدیک‌ترین `<Suspense>` `fallback` را نشان می‌دهد
3. اگر `reject` → نزدیک‌ترین `Error Boundary`

### Syntax

```jsx
import { use, Suspense } from 'react';

function Message({ messagePromise }) {
  const message = use(messagePromise);
  return <p>{message}</p>;
}

function App() {
  const promise = fetchMessage(); // باید cache شود
  return (
    <Suspense fallback={<p>بارگذاری...</p>}>
      <Message messagePromise={promise} />
    </Suspense>
  );
}
```

### Cache کردن `promise`

```jsx
import { use, Suspense, cache } from 'react';

const getUser = cache(async (id) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
});

function UserProfile({ userId }) {
  const user = use(getUser(userId));
  return <h1>{user.name}</h1>;
}
```

در Client Component، `promise` باید همان instance در `re-render`ها باشد — از `cache` یا نگه‌داری در والد استفاده کنید.

---

## `use(context)`

### تفاوت با `useContext`

| | `useContext` | `use(context)` |
|---|-------------|----------------|
| محل فراخوانی | فقط top level | داخل `if`/`for` |
| `Server Component` | بله | خیر |
| مقدار بازگشتی | همان `context` | همان `context` |

### Syntax شرطی

```jsx
import { use } from 'react';

function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return null;
}
```

برخلاف `useContext`، الگوی بالا با `use` مجاز است — نقض Rules of Hooks نمی‌کند.

### Provider در React 19

```jsx
<ThemeContext value="dark">
  <Form />
</ThemeContext>
```

بدون `.Provider` — [Context.md](../Context.md).

---

## پارامترها و بازگشت

| فراخوانی | پارامتر | بازگشت |
|----------|---------|--------|
| `use(promise)` | `Promise` | مقدار resolve‌شده |
| `use(context)` | `Context` از `createContext` | مقدار نزدیک‌ترین Provider |

---

## 💡 مثال — چند `promise`

```jsx
import { use, Suspense } from 'react';

function Profile({ userPromise }) {
  const user = use(userPromise);
  return <h2>{user.name}</h2>;
}

function Posts({ postsPromise }) {
  const posts = use(postsPromise);
  return (
    <ul>
      {posts.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}

function Page({ userPromise, postsPromise }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Profile userPromise={userPromise} />
      <Posts postsPromise={postsPromise} />
    </Suspense>
  );
}
```

---

## 🚀 Best Practices

- همیشه `<Suspense>` برای `use(promise)`
- Error Boundary بیرون برای `reject`
- `cache` برای `promise`/`fetch` در Client
- برای `context` ساده در top level، `useContext` هم کافی است

---

## ⚠️ اشتباهات رایج

- `try { use(promise) } catch` — کار نمی‌کند
- `promise` تازه در هر `render`
- `use(context)` در Server Component
- فراموش کردن `Suspense` — خطای «component suspended»

---

## ارتباط با مفاهیم دیگر

- [Suspense.md](../Escape-Hatches/Suspense.md)
- [Hooks/useContext.md](./useContext.md)
- [Context.md](../Context.md)
- [Server-Components.md](../Escape-Hatches/Server-Components.md)
- [Error-Boundaries.md](../Error-Boundaries.md)
- [Examples/escape-hatches/UsePromise.jsx](../Examples/escape-hatches/UsePromise.jsx)

---

## خلاصه

با `use(promise)` داده ناهمگام در `render` خوانده می‌شود و `Suspense` `fallback` را مدیریت می‌کند. با `use(context)` می‌توان `context` را حتی شرطی خواند. هر دو React 19+.

---

## 📚 منابع

- [use — react.dev](https://react.dev/reference/react/use)
- [Suspense — react.dev](https://react.dev/reference/react/Suspense)
- [Passing data with context — react.dev](https://react.dev/learn/passing-data-deeply-with-context)
