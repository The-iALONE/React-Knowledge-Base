# Interview Questions — سوالات مصاحبه React

> 🧭 پیش‌نیاز: [FAQ](./FAQ.md) · بعدی: [Migration Notes](./Migration-Notes.md)

هاب سوالات مصاحبه با پاسخ خلاصه و لینک به بخش‌های `## Interview` در Hooks و فایل‌های عمیق‌تر.

---

## 📖 مفهوم

این فایل **نقطهٔ شروع مرور مصاحبه** است — نه لیست کامل همهٔ سوالات. پاسخ‌ها کوتاه‌اند؛ برای عمق به فایل موضوعی (به‌ویژه `Hooks/*/## Interview`) بروید.

---

## چرا این ویژگی وجود دارد؟

در مصاحبه frontend، ترکیب Core، Hooks، performance و state پرسیده می‌شود. پراکندگی سوالات در ۲۰+ فایل Hook بدون هاب، مرور قبل مصاحبه را سخت می‌کند.

---

## چه مشکلی را حل می‌کند؟

- پیدا کردن سریع موضوعات پرتکرار مصاحبه
- لینک مستقیم به پاسخ تفصیلی در مخزن
- تفکیک سطح junior / mid / senior

---

## ⚙️ نحوه کار — دسته‌بندی

### Core React

| سؤال | پاسخ خلاصه | عمق |
|------|------------|-----|
| تفاوت `props` و `state`؟ | ورودی vs داخلی | [Props](./Props.md)، [State](./State.md) |
| Virtual DOM چگونه کار می‌کند؟ | درخت مجازی + reconciliation | [Virtual-DOM](./Performance/Virtual-DOM.md) |
| Controlled vs Uncontrolled؟ | React state vs DOM | [Forms](./Forms.md) |
| Lifting state up چیست؟ | state مشترک به والد مشترک | [Lifting-State-Up](./Lifting-State-Up.md) |
| Error Boundary چه می‌گیرد؟ | render؛ نه event/async داخل child | [Error-Boundaries](./Error-Boundaries.md) |

---

### Hooks — با لینک `## Interview`

| موضوع | سؤال نمونه | فایل |
|-------|------------|------|
| `useState` | functional update vs مستقیم؟ mutate چرا کار نمی‌کند؟ | [useState](./Hooks/useState.md#interview) |
| `useEffect` | cleanup چرا؟ deps خالی vs پر؟ | [useEffect](./Hooks/useEffect.md#interview) |
| `useLayoutEffect` | تفاوت با `useEffect`؟ | [useLayoutEffect](./Hooks/useLayoutEffect.md#interview) |
| `useRef` | ref vs state؟ | [useRef](./Hooks/useRef.md#interview) |
| `useMemo` | کی لازم است؟ | [useMemo](./Hooks/useMemo.md#interview) |
| `useCallback` | تفاوت با `useMemo`؟ | [useCallback](./Hooks/useCallback.md#interview) |
| `useContext` | performance مشکل؟ | [useContext](./Hooks/useContext.md#interview) |
| `useReducer` | vs `useState`؟ | [useReducer](./Hooks/useReducer.md#interview) |
| `useTransition` | urgent vs transition؟ | [useTransition](./Hooks/useTransition.md#interview) |
| `useDeferredValue` | vs debounce؟ | [useDeferredValue](./Hooks/useDeferredValue.md#interview) |
| `useOptimistic` | چه مشکلی حل می‌کند؟ | [useOptimistic](./Hooks/useOptimistic.md#interview) |
| `useActionState` | relation به form action؟ | [useActionState](./Hooks/useActionState.md#interview) |
| `useFormStatus` | چرا والد فرم؟ | [useFormStatus](./Hooks/useFormStatus.md#interview) |
| `useSyncExternalStore` | use case؟ | [useSyncExternalStore](./Hooks/useSyncExternalStore.md#interview) |
| `useId` | hydration mismatch؟ | [useId](./Hooks/useId.md#interview) |
| `useImperativeHandle` | کی استفاده؟ | [useImperativeHandle](./Hooks/useImperativeHandle.md#interview) |
| `useEffectEvent` | vs `useCallback` در Effect؟ | [useEffectEvent](./Hooks/useEffectEvent.md#interview) |
| `use` | vs `useContext`؟ | [Hooks/use](./Hooks/use.md) |
| کلی Hookها | ترتیب و قوانین | [Hooks/README](./Hooks/README.md#interview) |

---

### Performance

| سؤال | پاسخ خلاصه | عمق |
|------|------------|-----|
| چرا re-render می‌شود؟ | state/context/props والد | [Re-render](./Performance/Re-render.md) |
| `memo` چه زمانی؟ | props برابر + گران | [React-Memo](./Patterns/React-Memo.md) |
| تفاوت reconciliation و diffing؟ | الگوریتم مقایسه | [Reconciliation](./Performance/Reconciliation.md) |
| Code splitting چگونه؟ | `lazy` + `Suspense` | [Code-Splitting](./Performance/Code-Splitting.md) |
| React Compiler؟ | auto memoization | [React-Compiler](./Escape-Hatches/React-Compiler.md) |

---

### State Management

| سؤال | پاسخ خلاصه | عمق |
|------|------------|-----|
| انواع state؟ | local، global، server، URL… | [State-Types](./State-Management/State-Types.md) |
| Context vs Redux؟ | scale و tooling | [Context-API](./State-Management/Context-API.md)، [Redux](./State-Management/Redux.md) |
| React Query vs Redux؟ | server vs client state | [React-Query](./State-Management/React-Query.md) |
| Zustand مزیت؟ | سبک، بدون boilerplate | [Zustand](./State-Management/Zustand.md) |

---

### Router و Next.js

| سؤال | پاسخ خلاصه | عمق |
|------|------------|-----|
| Protected route در SPA؟ | wrapper + redirect | [Navigation](./React-Router/Navigation.md) |
| `searchParams` vs state؟ | shareable URL | [State-In-URL](./React-Router/State-In-URL.md) |
| RSC محدودیت‌ها؟ | بدون Hook کلاینت | [Server-Components](./Escape-Hatches/Server-Components.md) |
| Server Action vs API route؟ | mutation UI vs REST/webhook | [Server-Actions](./Nextjs/Server-Actions.md)، [Route-Handlers](./Nextjs/Route-Handlers.md) |

---

### الگوها و معماری

| سؤال | پاسخ خلاصه | عمق |
|------|------------|-----|
| Compound Components؟ | API انعطاف‌پذیر | [Compound-Components](./Patterns/Compound-Components.md) |
| HOC vs Render Props vs Hooks؟ | ترکیب منطق | [HOC](./Patterns/Higher-Order-Components.md)، [Render-Props](./Patterns/Render-Props.md) |
| Custom Hook چیست؟ | reuse منطق stateful | [Custom-Hooks](./Custom-Hooks.md) |

---

## سطح‌بندی پیشنهادی

| سطح | تمرکز |
|------|--------|
| Junior | props/state، lists، forms، `useState`/`useEffect` |
| Mid | Context، performance basics، React Query، Router |
| Senior | Concurrent، RSC، معماری state، trade-offها، migration |

---

## مثال واقعی در پروژه

سوال «چطور فیلتر کابین را بدون lag پیاده کنید؟» — `useTransition` + state در URL (Wild Oasis). سوال «کجا fetch؟» — Server Component در Next یا React Query در SPA.

---

## 🚀 Best Practices

✅ پاسخ STAR: موقعیت → اقدام → نتیجه با مثال پروژه  
✅ بگویید trade-off — نه فقط «بهترین راه»  
✅ React 19 و Compiler را در پاسخ‌های ۲۰۲۵+ ذکر کنید  
✅ برای هر Hook، بخش Interview همان فایل را بخوانید

---

## ⚠️ اشتباهات رایج

❌ حفظ جواب بدون فهم `why`  
❌ گفتن «همیشه Redux» یا «هرگز Context»  
❌ نادیده گرفتن RSC در مصاحبه Next.js  
❌ کپی پاسخ بلند — مصاحبه‌گر عمق می‌خواهد

---

## ارتباط با مفاهیم دیگر

- [FAQ](./FAQ.md) — پرسش روزانه
- [Hooks/README](./Hooks/README.md) — همه Hookها + Interview
- [Common-Pitfalls](./Common-Pitfalls.md) — اشتباهات
- [Migration-Notes](./Migration-Notes.md) — نسخه‌ها
- [Cheatsheet](./Cheatsheet.md) — مرور آخر

---

## خلاصه

هاب مصاحبه: Core، Hooks (لینک به `## Interview`)، Performance، State، Router/Next و Patterns. پاسخ کوتاه اینجا؛ عمق در فایل موضوعی.

---

## 📚 منابع

- [React Learn — react.dev](https://react.dev/learn)
- [React Interview preparation — react.dev blog](https://react.dev/blog)
- فایل‌های `Hooks/*.md` — بخش Interview هر Hook
