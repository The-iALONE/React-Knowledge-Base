# useInsertionEffect

> برای `inject` کردن استایل **قبل از** `layout effect`ها — عمدتاً برای نویسندگان کتابخانه‌های CSS-in-JS.

> 🧭 پیش‌نیاز: [useLayoutEffect](./useLayoutEffect.md) · بعدی: [useEffectEvent](./useEffectEvent.md)

---

## 📖 مفهوم

برای درج استایل در DOM قبل از `useLayoutEffect` و `useEffect`، از `useInsertionEffect` استفاده می‌شود. هدف اصلی: درج `<style>` یا `CSS runtime` در زمان درست چرخه React.

---

## چرا

کتابخانه‌های CSS-in-JS (مثل styled-components قدیمی) باید `<style>` را **قبل از** اینکه `useLayoutEffect` اندازه DOM را بخواند، در صفحه باشد. اگر استایل در `useEffect` تزریق شود، یک فریم `layout` با استایل قدیمی محاسبه می‌شود — برای نویسندگان کتابخانه، نه برای اپ معمولی با Tailwind/CSS Modules.

---

## چه مشکلی را حل می‌کند؟

- برای اکثر اپلیکیشن‌ها لازم نیست — `useEffect` یا `useLayoutEffect` کافی است.
- نمی‌توان از داخل آن `state` `set` کرد.
- `refs` هنوز `attach` نشده‌اند.
- فقط `client` — در SSR اجرا نمی‌شود.

---

## ⚙️ نحوه کار

1. React DOM را commit می‌کند.
2. `useInsertionEffect` اجرا می‌شود (قبل از `layout effect`ها).
3. `useLayoutEffect` اجرا می‌شود.
4. مرورگر `paint` می‌کند.
5. `useEffect` اجرا می‌شود.

ترتیب `cleanup`/`setup` برخلاف `effect`های دیگر به‌صورت `interleaved per-component` است.

---

## Syntax

```jsx
useInsertionEffect(() => {
  // inject styles
  return () => {
    // optional cleanup
  };
}, [deps]);
```

---

## پارامترها

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `setup` | `() => void \| () => void` | مثل `useEffect` |
| `dependencies` | `unknown[]` (optional) | مثل `useEffect` |

---

## مقدار بازگشتی

`undefined`

---

## مثال (CSS-in-JS library)

```jsx
let isInserted = new Set();

function useCSS(rule) {
  useInsertionEffect(() => {
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('.btn { color: blue; }');
  return <button className={className}>Click</button>;
}
```

`SSR:` جمع‌آوری `rule`ها در `render` (`server`)، `inject` در `client`:

```jsx
let collectedRulesSet = new Set();

function useCSS(rule) {
  if (typeof window === 'undefined') {
    collectedRulesSet.add(rule);
  }
  useInsertionEffect(() => {
    // inject on client
  });
  return rule;
}
```

---

## ⚠️ اشتباهات رایج

```jsx
// ❌ برای fetch یا analytics
useInsertionEffect(() => { fetchData(); }, []);

// ❌ setState داخل insertion effect
useInsertionEffect(() => { setCount(1); }, []);

// ❌ خواندن ref برای layout
useInsertionEffect(() => { measure(inputRef.current); }, []);
// ✅ useLayoutEffect برای measurement
```

---

## 🚀 Best Practices

- فقط برای `injection` زمان‌اجرا CSS-in-JS.
- برای استایل معمولی: CSS Modules، Tailwind، یا static CSS.
- اگر CSS-in-JS دارید: static extraction + inline styles برای dynamic ترجیح داده می‌شود.

---

## When to Use / Not

| استفاده کنید | استفاده نکنید |
|-------------|---------------|
| کتابخانه CSS-in-JS با runtime `<style>` | اپ معمولی |
| `inject` قبل از `layout read` | `measure` DOM → `useLayoutEffect` |
| | `side effect` عمومی → `useEffect` |

---

## ارتباط با مفاهیم دیگر

- [useLayoutEffect.md](./useLayoutEffect.md) — بعد از `insertion effect` (اندازه‌گیری DOM)
- [useEffect.md](./useEffect.md) — بعد از `paint`
- [Styling/README.md](../Styling/README.md) — روش‌های استایل (M9)
- [Escape-Hatches/React-Compiler.md](../Escape-Hatches/React-Compiler.md) — کاهش نیاز به runtime CSS

---

## نکات

- React 18+.
- در `concurrent update`، `inject` حین `render` باعث `recalculate` مکرر `style` می‌شود — `insertion effect` این را کاهش می‌دهد.
- برای app developer معمولاً هرگز لازم نیست.

---

## Interview

**سوال:** تفاوت `useInsertionEffect`، `useLayoutEffect` و `useEffect`؟  
**جواب:** در `insertion` قبل از `layout effect`ها (استایل)؛ در `layout` قبل از `paint` (`measurement`)؛ در `effect` بعد از `paint` (عمومی).

---

## خلاصه

با `useInsertionEffect` می‌توان استایل را قبل از `layout effect`ها `inject` کرد. مخصوص نویسندگان کتابخانه CSS-in-JS — نه کد اپ معمولی.

---

## 📚 منابع

- [useInsertionEffect — react.dev](https://react.dev/reference/react/useInsertionEffect)
