# FAQ — سؤالات پرتکرار React

> 🧭 پیش‌نیاز: [Common Pitfalls](./Common-Pitfalls.md) · بعدی: [Interview Questions](./Interview-Questions.md)

پاسخ کوتاه به سؤالاتی که در یادگیری و کار روزانه بارها تکرار می‌شوند — با لینک به فایل عمیق‌تر.

---

## 📖 مفهوم

این سند **پرسش‌وپاسخ سریع** است، نه آموزش گام‌به‌گام. هر پاسخ خلاصه است؛ برای جزئیات به فایل موضوعی یا react.dev بروید.

---

## چرا این ویژگی وجود دارد؟

همان سؤال‌ها («چرا re-render؟»، «تفاوت `useMemo` و `useCallback`؟») در Discord، تیم و مصاحبه تکرار می‌شوند. یک نقطهٔ مرجع زمان جستجو را کم می‌کند.

---

## چه مشکلی را حل می‌کند؟

- گشتن در ده‌ها فایل برای یک جواب کوتاه
- پاسخ‌های قدیمی/نادرست در حافظه (مثلاً `ReactDOM.render`)
- سردرگمی بین مفاهیم نزدیک (Context vs Redux، RSC vs SSR)

---

## ⚙️ نحوه کار — سؤالات

### مبانی

**۱. تفاوت `props` و `state` چیست؟**  
`props` از والد می‌آید و read-only است؛ `state` داخلی کامپوننت و با setter به‌روز می‌شود. → [Props](./Props.md)، [State](./State.md)

**۲. Virtual DOM چیست و چرا مهم است؟**  
نمایش در حافظه از UI که React با diff به‌روزرسانی DOM واقعی را کم‌هزینه می‌کند. → [Virtual-DOM](./Performance/Virtual-DOM.md)

**۳. چرا باید `key` در لیست بگذارم؟**  
تا React هر آیتم را در re-render و جابجایی درست شناسایی کند. → [Lists](./Lists.md)، [Keys-And-Performance](./Performance/Keys-And-Performance.md)

**۴. Controlled vs Uncontrolled input؟**  
کنترل‌شده: مقدار از `state` React؛ غیرکنترل‌شده: DOM مقدار را نگه می‌دارد (`ref`). → [Forms](./Forms.md)

---

### رندر و performance

**۵. چرا کامپوننت من دوباره render می‌شود؟**  
والد render شد، `state`/`context` عوض شد، یا `props` جدید (reference). → [Re-render](./Performance/Re-render.md)

**۶. تفاوت `useMemo` و `useCallback`؟**  
`useMemo` مقدار محاسبه‌شده را cache می‌کند؛ `useCallback` تابع را cache می‌کند. → [useMemo](./Hooks/useMemo.md)، [useCallback](./Hooks/useCallback.md)

**۷. کی `memo` لازم است؟**  
وقتی کامپوننت سنگین است و با همان `props` بارها re-render می‌شود — بعد از Profiler. → [React-Memo](./Patterns/React-Memo.md)

**۸. React Compiler چه می‌کند؟**  
به‌صورت خودکار بهینه‌سازی مشابه `memo`/`useMemo` — در پروژهٔ جدید جایگزین بسیاری بهینه‌سازی دستی. → [React-Compiler](./Escape-Hatches/React-Compiler.md)

---

### Hookها و Effect

**۹. قوانین Hook چیست؟**  
فقط در سطح بالای تابع/کامپوننت؛ هر render همان ترتیب. → [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)

**۱۰. چه زمانی `useEffect` لازم نیست؟**  
برای derived state، رویداد کاربر، و بسیاری fetchها — [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect). → [Effects](./Effects.md)

**۱۱. تفاوت `useEffect` و `useLayoutEffect`؟**  
`useLayoutEffect` قبل از paint مرورگر اجرا می‌شود — برای اندازه‌گیری DOM. → [useLayoutEffect](./Hooks/useLayoutEffect.md)

**۱۲. `useRef` vs `state`؟**  
`ref` تغییرش re-render نمی‌زند؛ برای DOM و مقادیر بین render. → [Refs](./Refs.md)

---

### State و داده

**۱۳. Context کافی است یا Redux؟**  
برای دادهٔ کم‌تغییر و نزدیک `Context` کافی است؛ برای `state` پیچیده سراسری Redux/Zustand — [State-Types](./State-Management/State-Types.md)

**۱۴. React Query چه مشکلی حل می‌کند؟**  
`server state`: cache، refetch، loading/error — جدا از `client state`. → [React-Query](./State-Management/React-Query.md)

**۱۵. `state` در URL چه زمانی؟**  
فیلتر، صفحه‌بندی، shareable link — [State-In-URL](./React-Router/State-In-URL.md)

---

### React مدرن و Next.js

**۱۶. Server Component چیست؟**  
کامپوننتی که روی سرور render می‌شود، به bundle کلاینت اضافه نمی‌شود، بدون `useState`/`useEffect`. → [Server-Components](./Escape-Hatches/Server-Components.md)

**۱۷. تفاوت RSC و SSR کلاسیک؟**  
در SSR کلاسیک HTML ساخته می‌شود؛ در RSC مدل کامپوننت + Flight protocol — ترکیب با Client Components. → [Nextjs/Server-Components](./Nextjs/Server-Components.md)

**۱۸. `"use client"` کی لازم است؟**  
وقتی Hook، event listener یا browser API نیاز دارید. → [Client-Components](./Escape-Hatches/Client-Components.md)

**۱۹. Server Action چیست؟**  
تابع سرور قابل فراخوانی از فرم/کلاینت — mutation بدون API جدا. → [Nextjs/Server-Actions](./Nextjs/Server-Actions.md)

---

### ابزار و نسخه

**۲۰. React 18 vs 19 مهم‌ترین تفاوت‌ها؟**  
شامل Actions، `use`، Context بدون Provider، ref as prop — → [Migration-Notes](./Migration-Notes.md)، [WhatsNew](./WhatsNew.md)

**۲۱. `createRoot` vs `ReactDOM.render`؟**  
`createRoot` API رسمی React 18+؛ `render` منسوخ. → [React-DOM-APIs](./React-DOM-APIs.md)

---

## مثال واقعی در پروژه

سؤال «چرا بعد از حذف ردیف، input اشتباه است؟» در CabinTable با `key={id}` حل شد — نه با `useEffect`. سؤال «کجا session نگه داریم؟» در Next.js با `auth()` سرور — نه فقط `localStorage` کلاینت.

---

## 🚀 Best Practices

✅ پاسخ کوتاه اینجا؛ عمیق در فایل موضوعی  
✅ react.dev را برای API دقیق چک کنید  
✅ سؤال مصاحبه‌ای → [Interview-Questions](./Interview-Questions.md)

---

## ⚠️ اشتباهات رایج

❌ تکیه به FAQ بدون خواندن فایل لینک‌شده  
❌ پاسخ‌های Stack Overflow قدیمی (قبل از React 18)  
❌ قاطی کردن Next.js و React خالص بدون تفکیک لایه

---

## ارتباط با مفاهیم دیگر

- [Interview-Questions](./Interview-Questions.md) — سوالات مصاحبه
- [Common-Pitfalls](./Common-Pitfalls.md) — اشتباهات
- [Glossary](./Glossary.md) — تعریف اصطلاحات
- [Cheatsheet](./Cheatsheet.md) — مرور فشرده
- [Learning-Path](./Learning-Path.md) — مسیر خطی یادگیری

---

## خلاصه

این سند پاسخ سریع به سؤالات پرتکرار مبانی، رندر، `Hook`، `state` و RSC/Next.js است — همیشه لینک عمیق‌تر را دنبال کنید.

---

## 📚 منابع

- [React Learn — react.dev](https://react.dev/learn)
- [React Reference — react.dev](https://react.dev/reference/react)
- [Next.js Docs](https://nextjs.org/docs)
