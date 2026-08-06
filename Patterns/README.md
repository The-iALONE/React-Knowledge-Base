# Patterns — نمای کلی الگوهای پیشرفته

> الگوهای پیشرفته React برای استفاده مجدد از `logic` و ساختار UI بدون `copy-paste` — از `memo` تا `Compound Components`.

---

## 📖 مفهوم

الگوهای پیشرفته React تکنیک‌هایی هستند که API انعطاف‌پذیر و منطق قابل استفاده مجدد می‌سازند. قبل از `Hooks`، `Render Props` و `HOC` راه‌های اصلی بودند؛ امروز `Custom Hook` برای `logic` و `Compound Component` برای UI ترکیبی پیش‌فرض‌اند.

---

## چرا

کامپوننت‌های بزرگ با ده‌ها `prop`، تکرار منطق `stateful`، و `re-render` غیرضروری مشکلات رایج در `scale` هستند. الگوها این مشکلات را با ساختار مشخص حل می‌کنند.

---

## نقشه الگوها

| الگو | بهترین برای | فایل |
|------|-------------|------|
| `React.memo` | جلوگیری از `re-render` وقتی `props` برابرند | [React-Memo.md](./React-Memo.md) |
| `Compound Components` | UI چندبخشی با `state` مشترک | [Compound-Components.md](./Compound-Components.md) |
| `Render Props` | `logic` + UI کاملاً سفارشی (`legacy`) | [Render-Props.md](./Render-Props.md) |
| `HOC` | `wrap` و `inject` (`legacy`/libs) | [Higher-Order-Components.md](./Higher-Order-Components.md) |
| مرور و انتخاب | مقایسه همه الگوها | [Reusability-Patterns.md](./Reusability-Patterns.md) |

---

## ترتیب مطالعه پیشنهادی

1. [Reusability Patterns](./Reusability-Patterns.md) — تصویر کلی (یا بعد از مطالعه فردی)
2. [Compound Components](./Compound-Components.md) — پرکاربرد در `UI kit`
3. [Render Props](./Render-Props.md) — درک `legacy` و معادل `Hook`
4. [Higher-Order Components](./Higher-Order-Components.md) — `wrap` و کتابخانه‌های قدیمی
5. [React.memo](./React-Memo.md) — بهینه‌سازی `re-render` (با `useMemo`/`useCallback`)

---

## پیش‌نیازها

- [Custom Hooks](../Custom-Hooks.md)
- [Context](../Context.md)
- [Portals](../Portals.md)
- [Hooks/useMemo](../Hooks/useMemo.md) · [Hooks/useCallback](../Hooks/useCallback.md)

---

## ارتباط با مفاهیم دیگر

- [Performance/Render-Cycle.md](../Performance/Render-Cycle.md) — چرخه رندر
- [State Management Overview](../State-Management/README.md) — `Context` سراسری (M7)
- [Examples/patterns/](../Examples/patterns/) — مثال‌های کد

---

## خلاصه

۲۰۲۴+: `Hook` برای `logic`، `Compound` برای UI ترکیبی. `Render Props` و `HOC` عمدتاً `legacy` یا API کتابخانه. `memo` برای بهینه‌سازی `re-render` — با کامپایلر React اغلب دستی لازم نیست.

---

## منابع

- [Reusing Logic with Hooks — react.dev](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [memo — react.dev](https://react.dev/reference/react/memo)
- [React Compiler — react.dev](https://react.dev/learn/react-compiler)
