# Best Practices — چک‌لیست عملکرد

> عادت‌های روزانه برای UI روان — بدون بهینه‌سازی زودهنگام.

> 🧭 پیش‌نیاز: [Optimization Techniques](./Optimization-Techniques.md) · بعدی: [Common Mistakes](./Common-Mistakes.md)

---

## 📖 مفهوم

بهترین روش‌های عملکرد (`Best Practices`) مجموعه عادت‌هایی است که قبل از `memo` و `useMemo` ساختار درست UI را تضمین می‌کند: رندر `pure`، `state` colocated، `key` درست، و اندازه‌گیری با Profiler.

---

## چرا این ویژگی وجود دارد؟

اکثر مشکلات performance از طراحی component tree و `state` ناشی می‌شوند — نه نبود `memo`. چک‌لیست از تکرار اشتباهات رایج جلوگیری می‌کند.

---

## چه مشکلی را حل می‌کند؟

- کد شلوغ با بهینه‌سازی‌های بی‌اثر
- باگ‌های `state` در لیست
- `bundle` و رندر blocking بدون برنامه

---

## ⚙️ نحوه کار — روش سه‌مرحله‌ای

ترتیب رسمی [react.dev](https://react.dev/reference/react/memo) و مسیر دوره:

```
۱. ساختار درست (colocation، key، pure render)
۲. اندازه‌گیری (Profiler baseline)
۳. بهینه‌سازی هدفمند (memo / splitting / Compiler)
```

قبل از مرحله ۳، مطمئن شوید مرحله ۱ و ۲ انجام شده — بیشتر lagها با ساختار درست حل می‌شوند.

---

## 🚀 Best Practices — چک‌لیست توسعه

### ساختار و داده

- [ ] `state` فقط به اندازه نیاز share شده — [State-Colocation.md](./State-Colocation.md)
- [ ] لیست‌ها `key` پایدار دارند — [Keys-And-Performance.md](./Keys-And-Performance.md)
- [ ] کامپوننت‌ها کوچک و با مسئولیت واحد
- [ ] `Context` فقط برای داده واقعاً سراسری (نه هر فرم)

### رندر

- [ ] توابع کامپوننت `pure` هستند — [Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
- [ ] `side effect` در `useEffect`/`event handler`، نه در body رندر
- [ ] از Effectهای زنجیره‌ای `setState` پرهیز — [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [ ] فرزند سنگین: `children` pattern یا colocation

### بهینه‌سازی (بعد از Profiler)

- [ ] baseline با React DevTools Profiler — [Profiling.md](./Profiling.md)
- [ ] `memo` فقط روی گلوگاه‌های تأییدشده
- [ ] `useMemo`/`useCallback` همراه `memo`، نه تنها
- [ ] React Compiler در نظر گرفته شده — [React-Compiler.md](../Escape-Hatches/React-Compiler.md)

### بارگذاری

- [ ] route-based code splitting — [Code-Splitting.md](./Code-Splitting.md)
- [ ] `Suspense` fallback معنادار
- [ ] تصاویر/فونت بهینه (M9/M10)

---

## چک‌لیست قبل از deploy

- [ ] production build تست شده (نه فقط dev)
- [ ] Profiler در سناریوی واقعی (لیست بزرگ، تایپ سریع)
- [ ] هیچ `key={Math.random()}` یا `key={index}` در لیست پویا
- [ ] Lighthouse / Performance tab مرورگر برای LCP/INP (در صورت نیاز)

---

## اصول رسمی react.dev (خلاصه)

1. JSX را به‌صورت `children` به wrapper بدهید
2. `state` محلی؛ lift فقط وقتی لازم است
3. رندر `pure` — باگ را fix کنید
4. Effectهای غیرضروری را حذف کنید
5. اگر lag ماند → Profiler → memo هدفمند
6. در بلندمدت → React Compiler

---

## مثال واقعی در پروژه

قبل از release Wild Oasis: colocation جستجو، `key` رزرو، `lazy` ادمین، سپس `memo` روی `CabinRow` — به این ترتیب، نه برعکس.

---

## ⚠️ اشتباهات رایج

- شروع از `memo` بدون Profiler — جزئیات در [Common-Mistakes.md](./Common-Mistakes.md)
- `Context` سراسری برای `state` محلی پرتکرار
- بهینه‌سازی فقط در dev با داده mock کوچک

---

## ارتباط با مفاهیم دیگر

- [Best-Practices.md](../Best-Practices.md) — عادت‌های عمومی React (لایه قبل از performance)
- [Optimization-Techniques.md](./Optimization-Techniques.md)
- [Common-Mistakes.md](./Common-Mistakes.md)
- [Performance/README.md](./README.md)

---

## خلاصه

ساختار درست اول؛ پروفایل دوم؛ `memo`/splitting سوم. چک‌لیست بالا را در بازبینی کد و قبل از استقرار مرور کنید.

---

## 📚 منابع

- [React — memo (principles)](https://react.dev/reference/react/memo)
- [React — Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
- [React — React Compiler](https://react.dev/learn/react-compiler)
