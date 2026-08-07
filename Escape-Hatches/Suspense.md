# Suspense — بارگذاری declarative

> نمایش `fallback` تا زمان آماده شدن کامپوننت یا داده — بدون `loading state` دستی پراکنده.

> 🧭 پیش‌نیاز: [Concurrent Features](./Concurrent-Features.md) · بعدی: [Lazy Loading](./Lazy-Loading.md)

---

## 📖 مفهوم

برای نمایش UI جایگزین (`fallback`) تا زمان آماده شدن فرزندان، از `<Suspense>` استفاده می‌شود. وقتی فرزند «معلق» (`suspend`) می‌شود — مثلاً منتظر `promise` یا بارگذاری `lazy` — React `fallback` را نشان می‌دهد و بعد از آماده شدن، محتوا را جایگزین می‌کند.

---

## چرا

قبل از `Suspense`، برای هر بخش بارگذاری باید `isLoading`/`error` جداگانه مدیریت می‌شد. با `Suspense` این کار `declarative` و قابل ترکیب می‌شود.

---

## چه مشکلی را حل می‌کند؟

- `loading state` تکراری در هر کامپوننت
- UX ناهمگون برای بخش‌های مختلف صفحه
- عدم امکان `streaming` تدریجی UI

---

## ⚙️ نحوه کار

1. کامپوننت فرزند `suspend` می‌شود (مثلاً `use(promise)` یا `lazy`)
2. React به نزدیک‌ترین `<Suspense>` بالاسری می‌رود
3. `fallback` نمایش داده می‌شود
4. وقتی `promise` resolve شد → فرزند `render` و `fallback` جایگزین می‌شود

### Suspense تو در تو

```jsx
<Suspense fallback={<PageSkeleton />}>
  <Header />
  <Suspense fallback={<SidebarSkeleton />}>
    <Sidebar />
  </Suspense>
  <Suspense fallback={<ContentSkeleton />}>
    <MainContent />
  </Suspense>
</Suspense>
```

هر بخش `fallback` مستقل دارد — UX تدریجی بهتر.

### `streaming` و RSC

در معماری RSC و فریم‌ورک‌هایی مثل Next.js، سرور می‌تواند HTML را **تدریجی** (`stream`) بفرستد — هر `<Suspense>` مرز `streaming` است. بخش‌های آماده زودتر نمایش داده می‌شوند و بقیه با `fallback` پر می‌شوند تا داده برسد.

### `pre-warming` (مفهومی)

اگر می‌دانید کاربر به‌زودی به بخشی می‌رود (مثلاً `hover` روی لینک)، می‌توانید `import()` یا `fetch` را زودتر شروع کنید — وقتی کاربر کلیک کند، `promise` قبلاً در حال resolve است و `fallback` کوتاه‌تر می‌ماند.

---

## Syntax

```jsx
import { Suspense } from "react";

<Suspense fallback={<Spinner />}>
  <SlowComponent />
</Suspense>;
```

### با `use()` و `promise`

```jsx
import { Suspense, use } from "react";

function Message({ messagePromise }) {
  const message = use(messagePromise);
  return <p>{message}</p>;
}

function App() {
  const promise = fetchMessage();
  return (
    <Suspense fallback={<p>در حال بارگذاری...</p>}>
      <Message messagePromise={promise} />
    </Suspense>
  );
}
```

---

## چه چیزی باعث `suspend` می‌شود؟

| منبع                    | مثال                              |
| ----------------------- | --------------------------------- |
| `React.lazy`            | `import()` ناهمگام                |
| `use(promise)`          | خواندن `promise` در `render`      |
| فریم‌ورک (Next.js)      | `fetch` در `Server Component`     |
| کتابخانه (`Relay`، ...) | `resource` با پشتیبانی `Suspense` |

---

## `Error Boundary` + `Suspense`

```jsx
<ErrorBoundary fallback={<ErrorPage />}>
  <Suspense fallback={<Loading />}>
    <DataComponent />
  </Suspense>
</ErrorBoundary>
```

- `Suspense` → `promise` در حال انتظار
- `Error Boundary` → `promise` رد شده (`reject`)

برای خطای `use()` از `Error Boundary` استفاده کنید — داخل `try/catch` کار نمی‌کند.

---

## 💡 مثال — چند منبع داده

```jsx
import { Suspense, use } from "react";

function Profile({ userPromise }) {
  const user = use(userPromise);
  return <h1>{user.name}</h1>;
}

function Posts({ postsPromise }) {
  const posts = use(postsPromise);
  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
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

## مثال واقعی در پروژه

در Next.js App Router، `loading.js` کنار هر `route` یک `<Suspense>` ضمنی ایجاد می‌کند — صفحه اصلی زود نمایش داده می‌شود و بخش‌های کند با `skeleton` پر می‌شوند. در کلاینت خالص، همان الگو با `Suspense` تو در تو دور `lazy` و `use(promise)` پیاده می‌شود.

---

## 🚀 Best Practices

- `fallback` سبک و شبیه `layout` نهایی (`skeleton`)
- `Suspense` تو در تو برای UX تدریجی
- `promise` را `cache` کنید — همان instance در `re-render`ها
- `Error Boundary` بیرون `Suspense` برای خطای شبکه

---

## ⚠️ اشتباهات رایج

- فراموش کردن `<Suspense>` دور `lazy` — خطا می‌دهد
- ساخت `promise` جدید در هر `render` بدون `cache`
- `try/catch` دور `use(promise)` — از Error Boundary استفاده کنید
- `fallback` سنگین که خودش `suspend` کند

---

## ارتباط با مفاهیم دیگر

- [Lazy-Loading.md](./Lazy-Loading.md) — `React.lazy` نیازمند `Suspense`
- [Hooks/use.md](../Hooks/use.md) — `use(promise)`
- [Concurrent-Features.md](./Concurrent-Features.md)
- [Performance/Code-Splitting.md](../Performance/Code-Splitting.md) — `lazy` و تقسیم `bundle` (M6)
- [Error-Boundaries.md](../Error-Boundaries.md)
- [Examples/escape-hatches/](../Examples/escape-hatches/)

---

## خلاصه

`<Suspense>` مرز `declarative loading` است — `fallback` تا آماده شدن فرزند. با `lazy`، `use(promise)` و RSC/Next.js ترکیب می‌شود.

---

## 📚 منابع

- [Suspense — react.dev](https://react.dev/reference/react/Suspense)
- [use — react.dev](https://react.dev/reference/react/use)
- [Showing pending UI — react.dev](https://react.dev/learn/suspense)
