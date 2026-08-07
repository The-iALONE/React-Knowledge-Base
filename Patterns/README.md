# Patterns — نمای کلی الگوهای پیشرفته

> الگوهای پیشرفته React برای استفاده مجدد از `logic` و ساختار UI بدون `copy-paste` — از `memo` تا `Compound Components`.

> 🧭 پیش‌نیاز: [Custom Hooks](../Custom-Hooks.md) · [Context](../Context.md) · [Portals](../Portals.md) · [useMemo](../Hooks/useMemo.md) · [useCallback](../Hooks/useCallback.md) · بعدی: [Reusability Patterns](./Reusability-Patterns.md)

---

## 📖 مفهوم

الگوهای پیشرفته React تکنیک‌هایی هستند که API انعطاف‌پذیر و منطق قابل استفاده مجدد می‌سازند. قبل از `Hooks`، `Render Props` و `HOC` راه‌های اصلی بودند؛ امروز `Custom Hook` برای `logic` و `Compound Component` برای UI ترکیبی پیش‌فرض‌اند.

وقتی یک `Modal` ده‌ها `prop` اختیاری دارد یا منطق `fetch` در سه صفحه تکرار شده، الگوها ساختار مشخصی پیشنهاد می‌دهند — نه به‌عنوان قانون، بلکه به‌عنوان ابزار انتخاب.

---

## چرا

کامپوننت‌های بزرگ با ده‌ها `prop`، تکرار منطق `stateful`، و `re-render` غیرضروری مشکلات رایج در `scale` هستند. الگوها این مشکلات را با ساختار مشخص حل می‌کنند — بدون اینکه مجبور شوید همه‌چیز را از صفر طراحی کنید.

---

## چه مشکلی را حل می‌کند؟

- `prop drilling` و APIهای غول‌پیکر (`Modal` با ۲۰ `prop`)
- تکرار `stateful logic` بین کامپوننت‌های با UI متفاوت
- `re-render` غیرضروری در لیست‌ها و درخت‌های عمیق
- انتخاب نادرست ابزار (`HOC` در کد سبز، `Context` برای هر `state` محلی)

---

## نقشه الگوها

| الگو | بهترین برای | فایل |
|------|-------------|------|
| مرور و انتخاب | مقایسه همه الگوها و درخت تصمیم | [Reusability-Patterns.md](./Reusability-Patterns.md) |
| `Compound Components` | UI چندبخشی با `state` مشترک | [Compound-Components.md](./Compound-Components.md) |
| `Render Props` | `logic` + UI کاملاً سفارشی (`legacy`) | [Render-Props.md](./Render-Props.md) |
| `HOC` | `wrap` و `inject` (`legacy`/libs) | [Higher-Order-Components.md](./Higher-Order-Components.md) |
| `React.memo` | جلوگیری از `re-render` وقتی `props` برابرند | [React-Memo.md](./React-Memo.md) |

---

## ترتیب مطالعه پیشنهادی

1. [Reusability Patterns](./Reusability-Patterns.md) — تصویر کلی (یا بعد از مطالعه فردی)
2. [Compound Components](./Compound-Components.md) — پرکاربرد در `UI kit`
3. [Render Props](./Render-Props.md) — درک `legacy` و معادل `Hook`
4. [Higher-Order Components](./Higher-Order-Components.md) — `wrap` و کتابخانه‌های قدیمی
5. [React.memo](./React-Memo.md) — بهینه‌سازی `re-render` (با `useMemo`/`useCallback`)

---

## ارتباط با مفاهیم دیگر

- [Performance/Memoization.md](../Performance/Memoization.md) — `memo`، `useMemo`، `useCallback`
- [Performance/Render-Cycle.md](../Performance/Render-Cycle.md) — چرخه رندر
- [State-Management/Context-API.md](../State-Management/Context-API.md) — `Context` سراسری (M7)
- [Escape-Hatches/React-Compiler.md](../Escape-Hatches/React-Compiler.md) — جایگزین بسیاری از `memo` دستی
- [Examples/patterns/](../Examples/patterns/) — مثال‌های کد

---

## خلاصه

در پروژه‌های ۲۰۲۶+: `Hook` برای `logic`، `Compound` برای UI ترکیبی. `Render Props` و `HOC` عمدتاً `legacy` یا API کتابخانه. `memo` برای بهینه‌سازی `re-render` — با کامپایلر React اغلب دستی لازم نیست.

---

## 📚 منابع

- [Reusing Logic with Hooks — react.dev](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [memo — react.dev](https://react.dev/reference/react/memo)
- [React Compiler — react.dev](https://react.dev/learn/react-compiler)
