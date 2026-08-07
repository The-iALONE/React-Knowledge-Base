# Optimization Techniques — جدول تکنیک‌های بهینه‌سازی

> مرجع سریع: هر تکنیک چه مشکلی را حل می‌کند، هزینه چیست، و در چه ترتیبی اعمال شود.

> 🧭 پیش‌نیاز: [Profiling](./Profiling.md) · بعدی: [Best Practices](./Best-Practices.md)

---

## 📖 مفهوم

تکنیک‌های بهینه‌سازی React از ساده (colocation) تا پیشرفته (`Compiler`، code splitting) طیف دارند. این فایل جدول تصمیم‌گیری است — نه جایگزین Profiler یا مستندات تخصصی هر موضوع.

---

## چرا این ویژگی وجود دارد؟

بدون نقشه، توسعه‌دهندگان یا همه‌چیز را `memo` می‌کنند یا هیچ‌وقت بهینه نمی‌کنند. جدول هزینه/فایده کمک می‌کند انتخاب آگاهانه باشد.

---

## چه مشکلی را حل می‌کند؟

- سردرگمی بین `memo`، `useMemo`، `useCallback`، `lazy`
- بهینه‌سازی زودهنگام یا دیرهنگام
- نادیده گرفتن راه‌حل‌های ساختاری (colocation، `key`)

---

## ⚙️ نحوه کار — جدول و ترتیب اعمال

| تکنیک | مشکل | هزینه | پیچیدگی | اولویت معمول |
|-------|------|-------|---------|--------------|
| `state colocation` | `re-render` کل subtree | ساختار کد | کم | ۱ — همیشه اول |
| `key` پایدار | `state` اشتباه + `diff` گران | — | خیر | ۱ — همیشه |
| `children` pattern | فرزند سنگین با `state` والد | ساختار JSX | کم | ۲ |
| `React.memo` | `re-render` با `props` برابر | مقایسه shallow | کم | ۳ — بعد از Profiler |
| `useMemo` | محاسبه گران تکراری | حافظه + `deps` | متوسط | ۳ |
| `useCallback` | شکستن `memo` با تابع جدید | حافظه + `deps` | متوسط | ۳ |
| `code splitting` | `bundle` اولیه سنگین | `loading` UX | متوسط | ۲ — route-level |
| `useTransition` | UI block در آپدیت سنگین | UI موقت قدیمی | متوسط | ۴ — Concurrent |
| `useDeferredValue` | ورودی سریع + لیست سنگین | تأخیر نمایش | متوسط | ۴ |
| `React Compiler` | `memo` دستی پراکنده | setup build | کم (بعد از راه‌اندازی) | ۲–۳ |
| virtualization | لیست هزاران ردیف | کتابخانه اضافه | متوسط | ۴ — خارج از React core |
| `Profiler` + fix | نمی‌دانید کجا کند است | زمان اندازه‌گیری | کم | ۰ — قبل از همه |

**مجازی‌سازی لیست (`virtualization`):** برای لیست‌های بسیار بزرگ (هزاران ردیف)، فقط آیتم‌های `visible` رندر می‌شوند — با کتابخانه‌هایی مثل `react-window` یا `@tanstack/react-virtual`. خارج از core React است؛ معمولاً بعد از colocation و `key` در نظر گرفته می‌شود.

---

## ترتیب پیشنهادی اعمال

```
0. Profiler — baseline
1. باگ pure render / Effect زنجیره‌ای را fix کنید
2. State colocation + key درست
3. Code splitting (route)
4. memo / useMemo / useCallback (هدفمند)
5. Concurrent (transition / deferred)
6. Compiler (جایگزین بسیاری از memo دستی)
7. Virtualization / سرور (RSC) برای مقیاس خیلی بزرگ
```

---

## ماتریس «مشکل → راه‌حل»

| علامت | احتمال علت | اقدام |
|-------|------------|--------|
| هر keystroke کل صفحه رندر | `state` در ریشه | [State-Colocation.md](./State-Colocation.md) |
| فرزند سنگین با کلیک والد | بدون مرز رندر | `children` یا `memo` |
| لیست بعد از sort باگ `state` | `key={index}` | [Keys-And-Performance.md](./Keys-And-Performance.md) |
| بار اول اپ کند | `bundle` بزرگ | [Code-Splitting.md](./Code-Splitting.md) |
| `memo` بی‌اثر | `props` جدید هر رندر | `useMemo`/`useCallback` یا Compiler |
| تعامل granular laggy | رندر blocking | [Concurrent-Features.md](../Escape-Hatches/Concurrent-Features.md) |

---

## React Compiler در مقایسه

| بدون Compiler | با Compiler |
|---------------|-------------|
| `memo` + `useMemo` + `useCallback` دستی | بیشتر خودکار |
| ریسک فراموشی `deps` | cache در compile time |
| کد شلوغ | کد تمیزتر |

جزئیات: [React-Compiler.md](../Escape-Hatches/React-Compiler.md)

---

## مثال واقعی در پروژه

**داشبورد Wild Oasis:** ترتیب اعمال واقعی: (۱) جستجوی colocated، (۲) `key={id}` روی ردیف رزرو، (۳) `lazy` برای route ادمین، (۴) `memo` روی `CabinRow` فقط بعد از Profiler.

---

## ⚠️ اشتباهات رایج

- شروع از ردیف ۴ جدول بدون ردیف ۰–۱
- ترکیب همه تکنیک‌ها روی یک کامپوننت
- نادیده گرفتن راه‌حل ساختاری

---

## 🚀 Best Practices

- یک تغییر در هر بار → measure دوباره
- مستندات تخصصی هر تکنیک را بخوانید (لینک در جدول بالا)
- برای اپ ساده (جایگزینی صفحه)، بسیاری از تکنیک‌ها لازم نیست — react.dev

---

## ارتباط با مفاهیم دیگر

- [Profiling.md](./Profiling.md)
- [Memoization.md](./Memoization.md)
- [Best-Practices.md](./Best-Practices.md)
- [Common-Mistakes.md](./Common-Mistakes.md)
- [Performance/README.md](./README.md)

---

## خلاصه

اول Profiler و colocation؛ بعد splitting؛ بعد memoization هدفمند؛ Compiler جایگزین بسیاری از memo دستی. جدول بالا مرجع تصمیم است.

---

## 📚 منابع

- [React — memo principles](https://react.dev/reference/react/memo)
- [React — React Compiler](https://react.dev/learn/react-compiler)
- [React — Render and Commit](https://react.dev/learn/render-and-commit)
