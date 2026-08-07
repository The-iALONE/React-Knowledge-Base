# Hooks — نمای کلی و قوانین

> 🧭 پیش‌نیاز: [Custom Hooks](../Custom-Hooks.md) · بعدی: [`useState`](./useState.md)

> در React، `Hook`ها توابعی هستند که به کامپوننت‌های تابعی اجازه می‌دهند `state`، `lifecycle` و سایر قابلیت‌های React را بدون کلاس استفاده کنند.

---

## 📖 مفهوم

در React، `Hook` تابعی است که با پیشوند `use` شروع می‌شود (مثل `useState`، `useEffect`) و فقط داخل کامپوننت‌های React یا `Custom Hook`ها فراخوانی می‌شود. `Hook`ها `state` و منطق `side effect` را به‌صورت قابل ترکیب و قابل استفاده مجدد در اختیار می‌گذارند.

از نسخه ۱۶.۸، `Hook`ها روش استاندارد نوشتن کامپوننت‌های React شدند.

---

## چرا

قبل از `Hook`ها، `state` و `lifecycle` فقط در کلاس‌ها بودند. منطق مشترک (مثل `fetch`، `subscription`، فرم) بین کامپوننت‌ها تکرار می‌شد یا با `HOC`/`Render Props` پیچیده می‌گردید.

تصور کنید هر کامپوننت فقط UI می‌سازد، ولی منطق «چطور داده بگیرد» یا «چطور فرم را مدیریت کند» را نمی‌تواند جدا کپی کند — `Hook`ها این شکاف را پر کردند:

- **ترکیب‌پذیری:** منطق را در `Custom Hook` جدا کنید (`useMovies`، `useLocalStorage`).
- **خوانایی:** هر `concern` در یک `useEffect` یا `useState` مجزا — نه همه چیز در `componentDidMount`.
- **بدون کلاس:** کد ساده‌تر و بدون `this`.

---

## چه مشکلی را حل می‌کند؟

بدون رعایت قوانین `Hook`ها، React نمی‌تواند `state` هر فراخوانی را به‌درستی نگه دارد — مثلاً `count` یک کامپوننت به `useState` کامپوننت دیگر وصل می‌شود و باگ‌های عجیب، `state` اشتباه، یا `crash` می‌گیرید.

---

## ⚙️ نحوه کار — انتخاب Hook مناسب

وقتی نمی‌دانید کدام `Hook` را بردارید، از این درخت تصمیم شروع کنید (جزئیات هر مورد در فایل مربوط):

```
نیاز به `state` ساده؟                    → useState
برای `state` پیچیده / چند `action`؟     → useReducer
`side effect` بعد از `render`؟            → useEffect
نیاز به اندازه/موقعیت DOM قبل از paint؟  → useLayoutEffect
کش محاسبه سنگین؟                          → useMemo
کش `callback` برای `child`؟             → useCallback
دسترسی DOM بدون `re-render`؟            → useRef
`state` سراسری سبک؟                       → useContext (+ شاید useReducer)
وقتی UI کند است و `update` سنگین دارد؟  → useTransition / useDeferredValue
فرم با Server Action؟                    → useActionState + useFormStatus
داده از API با `cache`؟                  → React Query (خارج از built-in)
```

> برای تشخیص **نوع** `state` قبل از انتخاب ابزار، [State-Types](../State-Management/State-Types.md) را ببینید.

---

## قوانین Hookها (`Rules of Hooks`)

### قانون ۱: فقط در بالاترین سطح فراخوانی کنید

❌ داخل `if`، `for`، `while`، یا تابع تو در تو `Hook` صدا نزنید.

```jsx
// ❌ Wrong
function Bad({ isLoggedIn }) {
  if (isLoggedIn) {
    const [user, setUser] = useState(null); // breaks rules!
  }
}

// ✅ Correct
function Good({ isLoggedIn }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUser().then(setUser);
    }
  }, [isLoggedIn]);
}
```

**چرا؟** در React ترتیب فراخوانی `Hook`ها در هر `render` به‌عنوان شناسه `state` استفاده می‌شود. اگر ترتیب عوض شود، `state` به `Hook` اشتباه وصل می‌شود.

### قانون ۲: فقط از توابع React فراخوانی کنید

فراخوانی `Hook`ها فقط در:
- کامپوننت‌های تابعی React
- `Custom Hook`ها (`function useSomething()`)

❌ در `event handler`، `class`، یا تابع معمولی JavaScript.

```jsx
// ❌ Wrong
function handleClick() {
  const [count, setCount] = useState(0);
}

// ✅ Correct — logic in custom hook
function useCounter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount((c) => c + 1);
  return { count, increment };
}
```

### ESLint

از `eslint-plugin-react-hooks` با قوانین `rules-of-hooks` و `exhaustive-deps` استفاده کنید.

---

## دسته‌بندی Hookها

| دسته | `Hook`ها | کاربرد |
|------|--------|--------|
| `State` | `useState`, `useReducer` | نگه‌داری و به‌روزرسانی `state` محلی |
| `Effect` | `useEffect`, `useLayoutEffect`, `useInsertionEffect`, `useEffectEvent` | `side effect`، `sync` با سیستم خارجی |
| `Performance` | `useMemo`, `useCallback` | `cache` کردن محاسبه/تابع |
| `Ref` | `useRef`, `useImperativeHandle` | DOM، مقادیر `mutable` بدون `re-render` |
| `Context` | `useContext` | خواندن `context` بدون `Consumer` |
| `Concurrent` | `useTransition`, `useDeferredValue`, `useOptimistic` | UI واکنش‌گرا، به‌روزرسانی غیرمسدودکننده |
| `Escape Hatch` | `use` | خواندن `promise`/`context` در `render` (React 19) |
| `Forms` (React 19) | `useActionState`, `useFormStatus` | `Server Actions` و وضعیت فرم |
| `External Store` | `useSyncExternalStore` | `subscribe` به `store` خارجی |
| `Other` | `useId`, `useImperativeHandle`, `useDebugValue` | شناسهٔ یکتا، API `imperative`، برچسب DevTools |

---

## فهرست Hookها

| Hook | توضیح کوتاه | فایل |
|------|-------------|------|
| `useState` | `state` محلی | [useState.md](./useState.md) |
| `useEffect` | `side effect` بعد از `render` | [useEffect.md](./useEffect.md) |
| `useLayoutEffect` | `effect` قبل از `paint` مرورگر | [useLayoutEffect.md](./useLayoutEffect.md) |
| `useInsertionEffect` | `inject` استایل قبل از `layout effect`ها | [useInsertionEffect.md](./useInsertionEffect.md) |
| `useEffectEvent` | رویداد `non-reactive` داخل `Effect` (React 19.2) | [useEffectEvent.md](./useEffectEvent.md) |
| `useMemo` | `cache` مقدار محاسبه‌شده | [useMemo.md](./useMemo.md) |
| `useCallback` | `cache` تابع | [useCallback.md](./useCallback.md) |
| `useRef` | ref به DOM یا مقدار `mutable` | [useRef.md](./useRef.md) |
| `useContext` | خواندن `context` | [useContext.md](./useContext.md) |
| `useReducer` | `state` پیچیده با `reducer` | [useReducer.md](./useReducer.md) |
| `useTransition` | `transition` غیرفوری | [useTransition.md](./useTransition.md) |
| `useDeferredValue` | `defer` مقدار | [useDeferredValue.md](./useDeferredValue.md) |
| `useOptimistic` | UI خوش‌بینانه | [useOptimistic.md](./useOptimistic.md) |
| `useActionState` | `state` اکشن فرم | [useActionState.md](./useActionState.md) |
| `useFormStatus` | وضعیت ارسال فرم | [useFormStatus.md](./useFormStatus.md) |
| `useSyncExternalStore` | `subscribe` به store | [useSyncExternalStore.md](./useSyncExternalStore.md) |
| `useImperativeHandle` | سفارشی‌سازی نمونه `ref` | [useImperativeHandle.md](./useImperativeHandle.md) |
| `useId` | شناسهٔ یکتا برای دسترسی‌پذیری | [useId.md](./useId.md) |
| `useDebugValue` | `label` در DevTools برای `custom hook` | [useDebugValue.md](./useDebugValue.md) |
| `use` | خواندن `promise` یا `context` (React 19) | [use.md](./use.md) |

---

## نحوه انتخاب Hook مناسب — جدول سریع

| نیاز | Hook پیشنهادی |
|------|----------------|
| `toggle`، `input`، `counter` | `useState` |
| فرم چند فیلد با `action`های مشخص | `useReducer` |
| `fetch`، `timer`، `subscription` | `useEffect` |
| جلوگیری از `flicker` DOM | `useLayoutEffect` |
| لیست بزرگ فیلتر/`sort` | `useMemo` |
| `handler` پایدار برای `memo` child | `useCallback` |
| `focus`، مقدار بدون `re-render` | `useRef` |

---

## ارتباط با مفاهیم دیگر

- [State.md](../State.md) — مفاهیم `state` در React (پیش از ورود به `Hook`ها)
- [Effects.md](../Effects.md) — فلسفه `effect` و جداسازی `concern`
- [Custom-Hooks.md](../Custom-Hooks.md) — ساخت `Hook` سفارشی
- [State-Management/State-Types.md](../State-Management/State-Types.md) — taxonomy انواع `state` برای انتخاب ابزار
- [Performance/Memoization.md](../Performance/Memoization.md) — `useMemo` و `useCallback` در عمق
- [Escape-Hatches/README.md](../Escape-Hatches/README.md) — `use` و `Suspense` (React 19)
- [Learning-Path.md](../Learning-Path.md) — ماژول ۰۴ (آیتم ۲۴–۴۳)

---

## نکات

- `Custom Hook` نامش باید با `use` شروع شود.
- `Hook`های built-in را مستقیم `export` نکنید؛ در `Custom Hook` `wrap` کنید.
- React 19: `useActionState` جایگزین `useFormState` شد.

---

## Interview

**سوال:** قوانین Hookها چیست و چرا مهم‌اند؟  
**جواب:** (۱) فقط در `top-level` (۲) فقط در `React function`. در React با ترتیب فراخوانی `state` را `map` می‌کند؛ نقض قانون باعث `state` اشتباه می‌شود.

**سوال:** تفاوت `useState` و `useReducer`؟  
**جواب:** برای `state` ساده از `useState` استفاده کنید؛ در `useReducer` وقتی `state` چند فیلد دارد، `transition`ها قابل پیش‌بینی‌اند، یا منطق `update` پیچیده است.

---

## خلاصه

در React مدرن، `Hook`ها API اصلی کامپوننت‌های تابعی هستند. دو قانون طلایی: فقط `top-level`، فقط در توابع React. انتخاب `Hook` بر اساس نوع `state`، `effect` و نیاز `performance` است — از [`useState`](./useState.md) شروع کنید و طبق [Learning-Path](../Learning-Path.md) پیش بروید.

---

## 📚 منابع

- [Rules of Hooks — react.dev](https://react.dev/reference/rules/rules-of-hooks)
- [Built-in Hooks — react.dev](https://react.dev/reference/react/hooks)
