# Best Practices — عادت‌های خوب React

> 🧭 پیش‌نیاز: [React DOM APIs](./React-DOM-APIs.md) · بعدی: [Common Pitfalls](./Common-Pitfalls.md)

اصول طراحی و کدنویسی React برای اپ قابل نگه‌داری — **عمومی**، نه فقط performance.

---

## 📖 مفهوم

بهترین روش‌های React مجموعه عادت‌هایی است که قبل از بهینه‌سازی، ساختار درست UI را تضمین می‌کند: کامپوننت‌های کوچک، `state` مینیمال، `effect` فقط برای sync با سیستم خارجی، و ترکیب اعلانی.

این فایل **لایهٔ عمومی** است. برای چک‌لیست سرعت و `memo` به [Performance/Best-Practices](./Performance/Best-Practices.md) بروید.

---

## چرا این ویژگی وجود دارد؟

کد React که فقط «کار می‌کند» بعد از چند ماه با `effect`های زنجیره‌ای، `prop drilling` و `state` پراکنده غیرقابل نگه‌داری می‌شود. عادت‌های درست از همان ابتدا هزینهٔ refactor را کم می‌کنند.

---

## چه مشکلی را حل می‌کند؟

- over-engineering زودهنگام (`Redux` برای هر `toggle`)
- `useEffect` به‌جای event handler یا derived state
- کامپوننت‌های غول‌پیکر با مسئولیت‌های مخلوط
- نادیده گرفتن accessibility و فرم‌های کنترل‌شده

---

## ⚙️ نحوه کار — اصول کلیدی

### ۱. Thinking in React

| گام | عمل |
|-----|-----|
| ۱ | UI را به سلسله‌مراتب کامپوننت بشکنید |
| ۲ | نسخهٔ استاتیک با `props` بسازید |
| ۳ | حداقل `state` لازم را پیدا کنید |
| ۴ | جریان داده را مشخص کنید (یک جهت) |
| ۵ | `state` مشترک را بالا ببرید — [Lifting-State-Up](./Lifting-State-Up.md) |

مرجع: [Thinking-in-React](./Thinking-in-React.md).

### ۲. ترکیب و مسئولیت واحد

- هر کامپوننت **یک کار** — نمایش، یا منطق، یا layout
- `children` و slot برای انعطاف — [Patterns/Reusability](./Patterns/Reusability-Patterns.md)
- فایل‌های feature-based — [Project-Structure](./Project-Structure.md)

### ۳. `state` — کم و در جای درست

| نوع | ابزار پیشنهادی |
|-----|----------------|
| محلی UI | `useState` |
| پیچیده محلی | `useReducer` |
| سراسری | Context / Zustand / Redux — [State-Types](./State-Management/State-Types.md) |
| سرور | React Query / fetch در RSC — [React-Query](./State-Management/React-Query.md) |
| URL | `searchParams` / React Router — [State-In-URL](./React-Router/State-In-URL.md) |

قانون: اگر می‌توانید محاسبه کنید، `state` نکنید — [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).

### ۴. `Effect` فقط برای sync خارجی

`useEffect` برای: subscribe، timer، sync با DOM/third-party — نه برای:
- تبدیل `props` به `state` (derived در render)
- رویداد کلیک (handler)
- fetch ساده با React Query یا RSC

جزئیات: [Effects](./Effects.md)، [Hooks/useEffect](./Hooks/useEffect.md).

### ۵. کلیدها و لیست‌ها

- `key` پایدار و یکتا — نه `index` در لیست متغیر — [Lists](./Lists.md)، [Keys-And-Performance](./Performance/Keys-And-Performance.md)
- هر آیتم لیست در کامپوننت جدا اگر `state` محلی دارد

### ۶. فرم‌ها

- کنترل‌شده برای validation سریع — [Forms](./Forms.md)
- React 19: `action` + `useActionState` / Server Actions — [useActionState](./Hooks/useActionState.md)، [Nextjs/Server-Actions](./Nextjs/Server-Actions.md)
- کتابخانه برای فرم پیچیده — [React-Hook-Form](./State-Management/React-Hook-Form.md)

### ۷. دسترسی‌پذیری (a11y) پایه

- دکمه برای action؛ لینک برای navigation
- `label` + `htmlFor` برای input
- focus trap در مودال — [Portals](./Portals.md)
- `useId` برای `id` یکتا — [useId](./Hooks/useId.md)

### ۸. خطا و بارگذاری

- Error Boundary برای crash subtree — [Error-Boundaries](./Error-Boundaries.md)
- Suspense برای lazy و async — [Suspense](./Escape-Hatches/Suspense.md)

### ۹. TypeScript و نام‌گذاری

- `props` و `state` typed
- نام رویداد `onX`، handler `handleX`
- custom hook با پیشوند `use` — [Custom-Hooks](./Custom-Hooks.md)

---

## تفکیک با Performance

| این فایل (عمومی) | [Performance/Best-Practices](./Performance/Best-Practices.md) |
|------------------|------------------------------------------------------------------|
| ساختار، `state`، Effects | `memo`، Profiler، colocation، Compiler |
| قبل از کدنویسی | بعد از baseline اندازه‌گیری |
| همهٔ پروژه‌ها | وقتی lag محسوس است |

---

## مثال واقعی در پروژه

در Worldwise، `city` در URL (`searchParams`) نگه‌داری می‌شود نه `global store` — [State-In-URL](./React-Router/State-In-URL.md). در fast-react-pizza، منوی پیتزا `state` محلی دارد و سبد خرید با Context — هر کدام در سطح مناسب.

---

## 🚀 Best Practices

✅ کمترین `state` ممکن؛ بقیه derived یا از URL/سرور  
✅ قبل از Context سراسری، colocation و lifting را امتحان کنید  
✅ [react.dev/learn](https://react.dev/learn) را برای الگوهای رسمی دنبال کنید  
✅ React Compiler را در پروژهٔ جدید در نظر بگیرید — [React-Compiler](./Escape-Hatches/React-Compiler.md)  
✅ تست رفتار کاربر، نه implementation detail داخلی

---

## ⚠️ اشتباهات رایج

❌ `useEffect` برای هر منطق — [Common-Pitfalls](./Common-Pitfalls.md)  
❌ premature optimization با `memo` قبل از ساختار درست  
❌ همهٔ داده در Redux/Context  
❌ کامپوننت ۵۰۰ خطی  
❌ نادیده گرفتن [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)

---

## ارتباط با مفاهیم دیگر

- [Common-Pitfalls](./Common-Pitfalls.md) — اشتباهات رایج
- [Performance/Best-Practices](./Performance/Best-Practices.md) — لایه performance
- [Thinking-in-React](./Thinking-in-React.md) — روش طراحی
- [State-Types](./State-Management/State-Types.md) — انتخاب ابزار state
- [FAQ](./FAQ.md) — سؤالات پرتکرار

---

## خلاصه

عادت‌های خوب React: UI سلسله‌مراتبی، `state` مینیمال، Effect فقط برای خارج از React، کلید درست، فرم و a11y درست. بهینه‌سازی performance مرحلهٔ بعد از ساختار درست است.

---

## 📚 منابع

- [Thinking in React — react.dev](https://react.dev/learn/thinking-in-react)
- [You Might Not Need an Effect — react.dev](https://react.dev/learn/you-might-not-need-an-effect)
- [Rules of Hooks — react.dev](https://react.dev/reference/rules/rules-of-hooks)
- [Managing State — react.dev](https://react.dev/learn/managing-state)
