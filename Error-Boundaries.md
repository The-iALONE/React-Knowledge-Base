# Error Boundaries — مرزهای خطا

> 🧭 پیش‌نیاز: [Lifecycle](./Lifecycle.md) · بعدی: [Portals](./Portals.md)

> کامپوننت‌هایی که خطای JavaScript در `subtree` خود را می‌گیرند و UI `fallback` نمایش می‌دهند.

## 📖 مفهوم

یک کامپوننت React است که `Error Boundary` نام دارد و خطاهای `render`، `lifecycle` و `constructor` در فرزندان خود را `catch` می‌کند. خطا را `log` می‌کند و به‌جای `crash` کل اپ، رابط کاربری جایگزین (`fallback`) نشان می‌دهد.

## چرا این ویژگی وجود دارد؟

یک خطا در یک بخش نباید کل اپ را از کار بیندازد.

## چه مشکلی را حل می‌کند؟

- تخریب تدریجی (`graceful degradation`)
- UX بهتر هنگام خطا
- جداسازی بخش‌های مستقل اپ

## ⚙️ نحوه کار

> ⚠️ مرز خطا (`Error Boundary`) هنوز فقط با `class component` پیاده می‌شود (یا از کتابخانه مثل `react-error-boundary` استفاده کنید).

```jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error:", error, info.componentStack);
    // log to Sentry, etc.
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong. Please refresh.</h2>;
    }
    return this.props.children;
  }
}

// استفاده:
<ErrorBoundary>
  <ProductList />
</ErrorBoundary>
```

**با `react-error-boundary` (توصیه) — شامل `resetKeys` برای بازیابی:**

```jsx
import { ErrorBoundary } from "react-error-boundary";

<ErrorBoundary
  fallback={<ErrorFallback />}
  onError={logError}
  resetKeys={[userId]}
  onReset={() => refetch()}
>
  <Dashboard />
</ErrorBoundary>
```

`resetKeys` وقتی عوض شوند، boundary را `reset` می‌کند — مثلاً بعد از تغییر کاربر.

## چه چیزهایی `catch` **نمی‌شود**؟

- خطا در `event handler` (از `try`/`catch` معمولی استفاده کنید)
- خطا در `async code` (`setTimeout`، `Promise`) — مگر `re-throw` در `render`
- خطا در خود Error Boundary
- SSR (نیاز به `error.js` در Next.js)

## مثال واقعی در پروژه

**داشبورد:** هر بخش (نمودار، جدول رزرو، نقشه) داخل Error Boundary جدا — اگر نمودار `crash` کند، جدول کار می‌کند.

**مسیریابی Next.js (`App Router`):** `error.js` و `global-error.js` نقش Error Boundary را دارند → [Nextjs/Loading-And-Error-States](./Nextjs/Loading-And-Error-States.md)

## ⚠️ اشتباهات رایج

- ❌ انتظار `catch` خطای `onClick`
- ❌ یک Error Boundary برای کل اپ بدون بازیابی دانه‌ای (`granular recovery`)
- ❌ نمایش پیام خطای خام به کاربر

## 🚀 Best Practices

- ✅ Error Boundary در سطح `route` یا `feature`
- ✅ UI `fallback` مفید + دکمه `retry`
- ✅ `log` خطا به `monitoring` (Sentry)
- ✅ در Next.js از `error.js` استفاده کنید

## چه زمانی استفاده کنیم؟

- بخش‌های مستقل که ممکن است `fail` شوند
- `third-party component`های غیرقابل اعتماد

## چه زمانی استفاده نکنیم؟

- جایگزین `try`/`catch` در `event handler`
- `validation` فرم (`state`/`error` محلی)

## ارتباط با مفاهیم دیگر

- [Nextjs/Loading-And-Error-States](./Nextjs/Loading-And-Error-States.md)
- [FAQ](./FAQ.md) · [Interview Questions](./Interview-Questions.md) — مراجع M11

## 💡 نکات مهم

- تیم React در حال کار روی Error Boundary برای `function components` است
- `react-error-boundary` راه‌حل عملی فعلی

## 🎯 سوالات رایج مصاحبه

- چه خطاهایی را Error Boundary `catch` نمی‌کند؟
- تفاوت Error Boundary و `try`/`catch` چیست؟

## خلاصه

مرز خطا (`Error Boundary`) = `safety net` برای `subtree`. بازیابی دانه‌ای (`granular`) + `fallback` + `logging`.

## 📚 منابع

- [react-error-boundary](https://github.com/bvaughn/react-error-boundary)
- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
