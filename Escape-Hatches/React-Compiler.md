# React Compiler — کامپایلر React

> `memoization` خودکار در زمان build — کاهش نیاز به `memo`، `useMemo` و `useCallback` دستی.

> 🧭 پیش‌نیاز: [Client Components](./Client-Components.md) · بعدی: [Patterns — نمای کلی](../Patterns/README.md)

---

## 📖 مفهوم

در زمان `build`، کامپایلر React (React Compiler) کد کامپوننت را تحلیل می‌کند و به‌صورت خودکار `memoization` اعمال می‌کند — مشابه کاری که دستی با `React.memo`، `useMemo` و `useCallback` انجام می‌دهید، اما جامع‌تر و بدون خطای انسانی.

---

## چرا

بهینه‌سازی دستی (`memo`/`useMemo`/`useCallback`) پرخطا و زمان‌بر است — فراموش کردن `dependency`، `memo` بی‌فایده، یا `props` ناپایدار. کامپایلر این را خودکار و ایمن‌تر انجام می‌دهد.

---

## چه مشکلی را حل می‌کند؟

- `re-render` غیرضروری بدون بهینه‌سازی دستی
- پیچیدگی `dependency array` در `useMemo`/`useCallback`
- `premature optimization` یا فراموشی بهینه‌سازی

---

## ⚙️ نحوه کار

1. کامپایلر درخت کامپوننت و جریان داده را تحلیل می‌کند
2. تشخیص می‌دهد کدام مقادیر «خالص» (`pure`) و پایدارند
3. `memoization` معادل `memo`/`useMemo`/`useCallback` را inject می‌کند
4. خروجی: کد بهینه‌شده بدون تغییر رفتار

### مقایسه با بهینه‌سازی دستی

| دستی                            | کامپایلر                   |
| ------------------------------- | -------------------------- |
| `memo` روی یک کامپوننت          | کل درخت را تحلیل می‌کند    |
| `useMemo`/`useCallback` پراکنده | خودکار و یکپارچه           |
| نیاز به دانش دقیق               | کمتر وابسته به توسعه‌دهنده |
| ممکن است جا بیفتد               | جامع‌تر                    |

### تفاوت با بهینه‌سازی دستی (خلاصه)

| رویکرد | مزیت | محدودیت |
| ------ | ---- | ------- |
| `React.memo` دستی | کنترل نقطه‌ای | فراموشی، `props` ناپایدار |
| `useMemo`/`useCallback` | بهینه‌سازی مقدار/تابع | `dependency` اشتباه |
| React Compiler | خودکار روی کل درخت | نیاز به کد خالص؛ skip روی ناخالص |

---

## فعال‌سازی

### Babel plugin

```bash
npm install babel-plugin-react-compiler
```

```js
// babel.config.js
module.exports = {
  plugins: [
    [
      "babel-plugin-react-compiler",
      {
        // گزینه‌ها
      },
    ],
  ],
};
```

### Next.js

در ریشهٔ پروژه Next.js، تنظیم کامپایلر داخل فایل `next.config.js` است — در پروژه‌های جدید ممکن است `next.config.mjs` یا `next.config.ts` باشد:

```js
// next.config.js — یا next.config.mjs / next.config.ts در ریشهٔ پروژه
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
};

module.exports = nextConfig;
```

در نسخه‌های قدیمی‌تر ممکن است تحت `experimental.reactCompiler` باشد — [مستندات Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler) را چک کنید.

### ESLint

در فایل `eslint.config.js` (یا `eslint.config.mjs`) پلاگین `eslint-plugin-react-compiler` را فعال کنید — هشدار می‌دهد اگر کدی با قوانین کامپایلر سازگار نباشد.

---

## قوانین کامپایلر (خلاصه)

کامپایلر فرض می‌کند کامپوننت‌ها و `Hook`ها **خالص** هستند:

- بدون `mutation` مستقیم `props`/`state`
- بدون `side effect` در `render`
- رعایت Rules of Hooks

اگر کد «ناخالص» باشد، کامپایلر skip می‌کند یا ESLint هشدار می‌دهد.

---

## چه زمانی هنوز دستی بهینه کنیم؟

- پروفایل نشان دهد `bottleneck` خاص باقی مانده
- کتابخانه/`third-party` سازگار نیست
- پروژه قدیمی قبل از فعال‌سازی کامپایلر

با کامپایلر فعال، معمولاً `memo`/`useMemo`/`useCallback` دستی **لازم نیست**.

---

## مثال واقعی در پروژه

در پروژه‌های جدید با Next.js 15+ و `reactCompiler: true`، کامپوننت‌های لیست منو بدون `memo` دستی هم از `re-render` غیرضروری جلوگیری می‌کنند — کامپایلر در `build` `memoization` تزریق می‌کند.

---

## 🚀 Best Practices

- پروژه جدید: کامپایلر را از ابتدا فعال کنید
- پروژه موجود: تدریجی با ESLint plugin
- کد را خالص نگه دارید — کامپایلر بهتر کار می‌کند
- بعد از فعال‌سازی، `memo` دستی اضافی را حذف کنید (پروفایل کنید)

---

## ⚠️ اشتباهات رایج

- `memo` دستی + کامپایلر بدون پروفایل — ممکن است `redundant` باشد
- `mutation` در `render` — کامپایلر skip می‌کند
- فرض اینکه کامپایلر جایگزین معماری بد می‌شود

---

## ارتباط با مفاهیم دیگر

- [Patterns/React-Memo.md](../Patterns/React-Memo.md) — قبل از کامپایلر
- [Hooks/useMemo.md](../Hooks/useMemo.md) · [Hooks/useCallback.md](../Hooks/useCallback.md)
- [Performance/Memoization.md](../Performance/Memoization.md) (M6)
- [Concurrent-Features.md](./Concurrent-Features.md)
- [README.md](./README.md)

---

## خلاصه

کامپایلر React `memoization` را خودکار می‌کند — `memo`/`useMemo`/`useCallback` دستی در بسیاری پروژه‌ها دیگر لازم نیست. کد خالص + کامپایلر = بهینه‌سازی ایمن‌تر.

---

## 📚 منابع

- [React Compiler — react.dev](https://react.dev/learn/react-compiler)
- [Installation — react.dev](https://react.dev/learn/react-compiler#installation)
- [Incremental adoption — react.dev](https://react.dev/learn/react-compiler#incremental-adoption)
