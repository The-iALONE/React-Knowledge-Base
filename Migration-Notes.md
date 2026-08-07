# Migration Notes — یادداشت‌های مهاجرت React

> 🧭 پیش‌نیاز: [Interview Questions](./Interview-Questions.md) · بعدی: [Cheatsheet](./Cheatsheet.md)

راهنمای مهاجرت بین نسخه‌ها و الگوها — Class به Hooks، React 17→18→19.

---

## 📖 مفهوم

مهاجرت در React معمولاً **تدریجی** است: ابتدا runtime (`createRoot`)، بعد الگوها (Hooks، Server Components)، و در نهایت حذف API منسوخ. این فایل نقشهٔ تصمیم و نکات شکست‌خوردهٔ رایج را جمع می‌کند — نه جایگزین [راهنمای رسمی upgrade](https://react.dev/blog).

---

## چرا این ویژگی وجود دارد؟

کدبیس‌های قدیمی با class component، lifecycle نام‌های قدیمی، `ReactDOM.render` و Context با `.Provider` هنوز زیادند. بدون نقشه، تیم یا نصف مهاجرت می‌ماند یا همه‌چیز یک‌باره می‌شکند.

---

## چه مشکلی را حل می‌کند؟

- انتخاب ترتیب upgrade (ابتدا چه چیزی؟)
- نگاشت lifecycle class → Hook
- تفاوت breaking changes واقعی vs هشدار dev
- هم‌راستایی با [WhatsNew](./WhatsNew.md) برای API جدید

---

## ⚙️ نحوه کار

### ۱. Class Components → Function + Hooks

| Class | معادل Hook |
|-------|------------|
| `state` | `useState` / `useReducer` |
| `componentDidMount` | `useEffect(..., [])` |
| `componentDidUpdate` | `useEffect(..., [deps])` |
| `componentWillUnmount` | cleanup در `useEffect` |
| `shouldComponentUpdate` | `memo` + `useMemo` |
| `getDerivedStateFromProps` | derived در render (اجتناب) |
| `this.ref` | `useRef` / ref prop (19) |

**استراتژی:** leaf componentها اول؛ containerها بعد؛ classهای مشترک را custom hook استخراج کنید — [Custom-Hooks](./Custom-Hooks.md).

```jsx
// قبل — class
class Counter extends React.Component {
  state = { count: 0 };
  render() {
    return <button onClick={() => this.setState({ count: this.state.count + 1 })}>
      {this.state.count}
    </button>;
  }
}

// بعد — function
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

---

### ۲. React 17 → React 18

| تغییر | اقدام |
|-------|--------|
| Root API | `ReactDOM.render` → `createRoot` — [React-DOM-APIs](./React-DOM-APIs.md) |
| Hydration | `hydrate` → `hydrateRoot` |
| Automatic batching | همه `setState` در event/async batch می‌شوند — کمتر نیاز به `flushSync` |
| Strict Mode (dev) | Effect دوبار mount — cleanup را درست بنویسید — [Lifecycle](./Lifecycle.md) |
| `useId` | برای a11y یکتا بین server/client |
| Suspense | گسترش برای data (با framework) |

```jsx
// main.jsx — React 18+
import { createRoot } from "react-dom/client";
createRoot(document.getElementById("root")).render(<App />);
```

---

### ۳. React 18 → React 19

| تغییر | اقدام |
|-------|--------|
| Context | `<ThemeContext value={v}>` بدون `.Provider` — [Context](./Context.md) |
| `ref` as prop | حذف `forwardRef` در بسیاری موارد — [Refs](./Refs.md) |
| `use` API | `use(promise)`، `use(context)` — [Hooks/use](./Hooks/use.md) |
| Form Actions | `useActionState`، `useFormStatus` — [Forms](./Forms.md) |
| `useOptimistic` | UI خوشبینانه — [useOptimistic](./Hooks/useOptimistic.md) |
| `ref` callback cleanup | تابع cleanup از ref callback |
| Document metadata | `<title>` در component tree |
| منسوخ‌ها | `propTypes`، `defaultProps` در function component؛ string ref |

جزئیات غیرجزوه: [WhatsNew](./WhatsNew.md).

---

### ۴. Create React App و bundler

CRA دیگر توصیه رسمی نیست — [Installation](./Installation.md). مسیرهای پیشنهادی:
- Vite + React
- Next.js App Router برای full-stack

---

### ۵. Pages Router → App Router (Next.js)

| Pages | App Router |
|-------|------------|
| `pages/index.js` | `app/page.tsx` |
| `getServerSideProps` | async Server Component / `fetch` |
| `getStaticProps` | static + `revalidate` |
| API routes `pages/api` | `app/api/.../route.ts` |

مرجع: [Nextjs/README](./Nextjs/README.md)، [Rendering-Strategies](./Nextjs/Rendering-Strategies.md).

**تدریجی:** route جدید در `app/`؛ قدیمی در `pages/` تا حذف.

---

### ۶. Redux قدیمی → RTK / React Query

- UI state محلی → Hook یا Zustand
- server state → React Query — [React-Query](./State-Management/React-Query.md)
- global client پیچیده → Redux Toolkit — [Redux-Toolkit](./State-Management/Redux-Toolkit.md)

---

### ۷. چک‌لیست قبل از deploy upgrade

- [ ] تست‌ها با React 18+ `act` و `createRoot`
- [ ] جستجوی `ReactDOM.render`، `UNSAFE_` lifecycles
- [ ] ESLint `react-hooks` فعال
- [ ] بررسی کتابخانه‌های third-party با React 19
- [ ] Next.js: نسخهٔ هم‌خوان با React

---

## جدول نسخه — خلاصه

| نسخه | نکتهٔ کلیدی migration |
|------|------------------------|
| 17 | پایه قبل از `createRoot` |
| 18 | Concurrent، root جدید، Strict Mode |
| 19 | Actions، `use`، Context ساده، ref prop |

---

## مثال واقعی در پروژه

مهاجرت Wild Oasis از Pages به App Router: ابتدا `createRoot` و React 18؛ سپس routeهای `app/` با Server Component برای لیست کابین؛ فرم رزرو با Server Actions — بدون rewrite یک‌شبه کل `pages/`.

---

## 🚀 Best Practices

✅ مهاجرت incremental — یک feature در هر PR  
✅ codemod رسمی React/Next.js را بررسی کنید  
✅ بعد از upgrade root API، بعد سراغ RSC  
✅ [react.dev/blog](https://react.dev/blog) برای release notes  
✅ تست e2e روی critical path

---

## ⚠️ اشتباهات رایج

❌ upgrade React بدون upgrade React DOM  
❌ نادیده گرفتن double Effect در Strict Mode  
❌ تبدیل یک‌شبه همه classها بدون تست  
❌ فرض کردن Next.js 13 = App Router کامل بدون `"use client"` planning  
❌ نگه‌داشتن `defaultProps` در function component (19)

---

## ارتباط با مفاهیم دیگر

- [WhatsNew](./WhatsNew.md) — APIهای جدید غیرجزوه
- [React-DOM-APIs](./React-DOM-APIs.md) — createRoot / hydrateRoot
- [React-APIs](./React-APIs.md) — APIهای منسوخ و جدید
- [Escape-Hatches/Server-Components](./Escape-Hatches/Server-Components.md) — RSC
- [Nextjs/README](./Nextjs/README.md) — مهاجرت Next

---

## خلاصه

مهاجرت: ابتدا root API و Strict Mode؛ سپس Hooks به‌جای class؛ React 19 با Context/ref/Actions/`use`؛ Next.js تدریجی به App Router. همیشه incremental و با تست.

---

## 📚 منابع

- [How to Upgrade to React 18 — react.dev](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [React 19 Upgrade Guide — react.dev](https://react.dev/blog/2024/12/05/react-19)
- [Next.js App Router — nextjs.org](https://nextjs.org/docs/app)
- [Codemods — react.dev](https://react.dev/learn/upgrading)
