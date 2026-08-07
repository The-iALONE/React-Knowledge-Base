# use

> برای خواندن مقدار `promise` یا `context` در `render` — با پشتیبانی از شرط و حلقه (برخلاف `useContext`).

> 🧭 پیش‌نیاز: [Lazy Loading](../Escape-Hatches/Lazy-Loading.md) · بعدی: [Server Components](../Escape-Hatches/Server-Components.md)

---

## 📖 مفهوم

برای خواندن مقدار یک `promise` یا `context` در `render`، از `use(resource)` استفاده می‌شود. با وجود پیشوند `use`، این API دقیقاً `Hook` نیست — می‌تواند داخل `if` و `for` فراخوانی شود. هنگام انتظار `promise`، کامپوننت `suspend` می‌کند و نیاز به `<Suspense>` دارد.

---

## چرا

- برای خواندن `context` شرطی، `use(context)` مجاز است — برخلاف `useContext` که فقط در `top-level` است.
- الگوی `useEffect` + `fetch` + `loading state` پراکنده است — با `use(promise)` + `Suspense` اعلانی (`declarative`) می‌شود.
- یک API واحد برای داده ناهمگام در `render` — بخشی از [Escape Hatches](../Escape-Hatches/README.md) در React 19.

> با وجود پیشوند `use`، این API **Hook نیست** — می‌تواند داخل `if`/`for` باشد و قوانین Hooks را نقض نمی‌کند.

---

## چه مشکلی را حل می‌کند؟

- `loading state` پراکنده با الگوی `useEffect` + `fetch` + `isLoading`
- محدودیت `useContext` در `top-level` — خواندن `context` شرطی بدون نقض Rules of Hooks
- عدم یکپارچگی بین خواندن `promise` و `context` در `render`
- نیاز به `declarative loading` با `Suspense` به‌جای `state` دستی

---

## تفاوت با گزینه‌های مشابه

| رویکرد | کی بهتر است | محدودیت |
| ------ | ----------- | ------- |
| `useEffect` + `fetch` | ساده، بدون `Suspense` | `loading`/`error` دستی؛ race condition |
| `use(promise)` + `Suspense` | داده در `render`، `declarative` | نیاز به `cache`؛ `Error Boundary` برای خطا |
| `useContext` | `context` در `top-level` | شرطی مجاز نیست |
| `use(context)` | `context` شرطی در Client | در RSC پشتیبانی نمی‌شود |
| React Query | داده سرور با `cache`/`retry` | کتابخانه خارجی — [React Query](../State-Management/React-Query.md) |

---

## ⚙️ نحوه کار

### `use(promise)`

1. `use(promise)` مقدار `resolve`‌شده را برمی‌گرداند.
2. اگر `pending` → کامپوننت `suspend` → نزدیک‌ترین `<Suspense>` `fallback` را نشان می‌دهد.
3. اگر `reject` → نزدیک‌ترین `Error Boundary` (نه `try/catch` دور `use`).

### `use(context)`

1. مقدار نزدیک‌ترین `Provider` را برمی‌گرداند — مثل `useContext`.
2. می‌تواند داخل `if`/`for` باشد — برای UI شرطی مثل «فقط اگر `show`، تم را بخوان».
3. در `Server Component` پشتیبانی نمی‌شود — آنجا `useContext` یا `props` استفاده کنید.

---

## `use(promise)` — جزئیات

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

## `use(context)` — جزئیات

### تفاوت با `useContext`

| | `useContext` | `use(context)` |
|---|-------------|----------------|
| محل فراخوانی | فقط `top-level` | داخل `if`/`for` |
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

- [Escape-Hatches/Suspense.md](../Escape-Hatches/Suspense.md) — `fallback` برای `use(promise)` (M5)
- [Hooks/useContext.md](./useContext.md) — خواندن `context` در `top-level`
- [Context.md](../Context.md) — Provider بدون `.Provider` (M2)
- [Error-Boundaries.md](../Error-Boundaries.md) — خطای `reject` (M2)
- [State-Management/React-Query.md](../State-Management/React-Query.md) — جایگزین برای داده سرور با `cache` (M7)
- [Examples/escape-hatches/UsePromise.jsx](../Examples/escape-hatches/UsePromise.jsx)

---

## خلاصه

با `use(promise)` داده ناهمگام در `render` خوانده می‌شود و `Suspense` `fallback` را مدیریت می‌کند. با `use(context)` می‌توان `context` را حتی شرطی خواند — هر دو از React 19 به بعد.

---

## 📚 منابع

- [use — react.dev](https://react.dev/reference/react/use)
- [Suspense — react.dev](https://react.dev/reference/react/Suspense)
- [Passing data with context — react.dev](https://react.dev/learn/passing-data-deeply-with-context)
- [React 19 — use API](https://react.dev/blog/2024/12/05/react-19)
