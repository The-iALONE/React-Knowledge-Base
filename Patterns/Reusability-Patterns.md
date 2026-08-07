# Reusability Patterns

> مرور الگوهای اشتراک منطق و UI در React و انتخاب مناسب برای هر سناریو.

> 🧭 پیش‌نیاز: [Patterns/README.md](./README.md) · [Custom Hooks](../Custom-Hooks.md) · [Context](../Context.md) · بعدی: [Compound Components](./Compound-Components.md)

---

## 📖 مفهوم

الگوهای `Reusability Patterns` مجموعه تکنیک‌هایی است برای استفاده مجدد از `logic` و ساختار UI بدون `copy-paste`: `Custom Hooks`، `Compound Components`، `Render Props`، `HOC`، `cloneElement` و ترکیب آن‌ها.

تصور کنید در سه صفحه مختلف به منطق «باز/بسته کردن مودال» یا «فیلتر کردن لیست» نیاز دارید — این فایل کمک می‌کند بفهمید کدام الگو برای کدام بخش مناسب‌تر است.

---

## چرا

`DRY`، نگهداری آسان‌تر، و API یکنواخت در `scale` بزرگ. وقتی هر توسعه‌دهنده روش متفاوتی انتخاب کند، کدبیس ناهمگن و سخت‌دیباگ می‌شود.

---

## چه مشکلی را حل می‌کند؟

- تکرار `stateful logic` بین کامپوننت‌ها
- `prop drilling` و کامپوننت‌های غول‌پیکر با ده‌ها `prop`
- انتخاب نادرست الگو (`HOC` در پروژه جدید، `Context` برای `state` محلی)
- `over-engineering` — سه لایه `abstraction` برای یک دکمه

---

## ⚙️ نحوه کار — مقایسه الگوها

| الگو | بهترین برای | مثال | توصیه ۲۰۲۶ |
|------|-------------|------|------------|
| `Custom Hook` | `stateful logic` بدون UI | `useDebounce`, `useFetch` | **پیش‌فرض** |
| `Compound Component` | UI چندبخشی با `state` مشترک | Modal, Tabs, Table | **پیش‌فرض UI** |
| `Render Props` | `logic` + UI کاملاً سفارشی | `Table.Body` + `render` | `legacy` / compound |
| `HOC` | `wrap` و `inject` | `withAuth`, `memo` | `legacy` / libs |
| `Context` | داده عمیق در درخت | Theme, Auth | با احتیاط |
| `children` به‌عنوان `slot` | `layout` ساده | `Card` + `children` | همیشه |
| `cloneElement` | inject `prop` به فرزند | `Modal.Open` + دکمه | ترجیح `composition` |

---

## درخت تصمیم — کدام الگو؟

```
آیا فقط `logic` مشترک است؟
  └─ بله → Custom Hook

ساختار UI چندبخشی با `state` مشترک؟
  └─ بله → Compound Component (+ Context داخلی)

آیا `consumer` باید شکل هر ردیف/آیتم را کنترل کند؟
  └─ بله → render prop داخل compound (Table.Body)

کتابخانه `legacy` یا cross-cutting concern؟
  └─ بله → HOC (یا Hook معادل)

داده در کل درخت لازم است؟
  └─ بله → Context (+ Hook اختصاصی)
```

---

## چه زمانی از کدام استفاده کنیم؟

### هوک سفارشی (پیش‌فرض ۲۰۲۶+)

- `fetch`، `form logic`، `subscription`، `media query`
- وقتی فقط `behavior` `reuse` می‌شود

### کامپوننت مرکب (`Compound Components`)

- Modal، Accordion، Select سفارشی، Table
- وقتی `consumer` چیدمان را کنترل می‌کند

### `Context` + هوک

- `theme`، `locale`، `auth session`
- داده‌های `global` یا نیمه‌`global` — جزئیات در [Context-API](../State-Management/Context-API.md)

### الگوی Render Props و HOC

- فقط `legacy` یا API کتابخانه
- `Table.Body` با `render` در compound table

### `cloneElement`

- الگوی دوره برای `Modal.Open` — در کد جدید ترجیح `composition` صریح

---

## 💡 مثال ترکیبی — فرم با Compound + Hook

```jsx
import { createContext, useContext, useState } from 'react';

// useFormField.js — logic
function useFormField(initialValue, validate) {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const error = touched ? validate(value) : null;

  return {
    value,
    error,
    onChange: (e) => setValue(e.target.value),
    onBlur: () => setTouched(true),
  };
}

// FormField compound
const FormFieldContext = createContext(null);

function FormField({ children, label }) {
  return (
    <FormFieldContext.Provider value={{ label }}>
      <div className="form-field">{children}</div>
    </FormFieldContext.Provider>
  );
}

function FormFieldInput({ field }) {
  const { label } = useContext(FormFieldContext);
  return (
    <label>
      {label}
      <input {...field} />
      {field.error && <span className="error">{field.error}</span>}
    </label>
  );
}

FormField.Input = FormFieldInput;
```

---

## مثال واقعی در پروژه

- `Modal compound` → UI انعطاف‌پذیر the-wild-oasis (`openName`, `Portal`)
- `Table compound` + `render prop` → لیست کابین‌ها
- `useLocalStorage hook` → فیلترها در worldwise
- `React Query hooks` → CRUD کابین‌ها (جایگزین `render props` قدیمی)

---

## 🚀 Best Practices

✅ `logic` → `Hook`؛ `structure` → `Compound`  
✅ یک سطح `abstraction`؛ `over-engineering` نکنید  
✅ TypeScript برای API عمومی  
✅ مستندات کوتاه برای `compound slots`  
✅ با [React Compiler](../Escape-Hatches/React-Compiler.md) فعال، قبل از `memo` دستی پروفایل کنید

---

## ⚠️ اشتباهات رایج

❌ `HOC`/`render props` در کد سبز جدید بدون دلیل  
❌ `Context` برای هر `state` محلی — `re-render` غیرضروری  
❌ `cloneElement` بدون بررسی `composition` ساده  
❌ ترکیب چند الگو (`HOC` + `render prop` + `Context`) برای یک feature ساده  
❌ کپی `logic` به‌جای استخراج `Custom Hook`

---

## ارتباط با مفاهیم دیگر

- [Patterns Overview](./README.md)
- [Compound Components](./Compound-Components.md)
- [Render Props](./Render-Props.md)
- [Higher-Order Components](./Higher-Order-Components.md)
- [React.memo](./React-Memo.md)
- [Custom Hooks](../Custom-Hooks.md)
- [Context](../Context.md)
- [State-Management/Context-API.md](../State-Management/Context-API.md)

---

## خلاصه

در پروژه‌های ۲۰۲۶+: `Hook` برای `logic`، `Compound` برای UI ترکیبی، `Context` برای داده سراسری. `Render Props` و `HOC` عمدتاً `legacy`. `cloneElement` در الگوی Modal دوره — در کد جدید `composition` صریح بهتر است.

---

## 📚 منابع

- [Reusing Logic with Hooks — react.dev](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Passing Data Deeply with Context — react.dev](https://react.dev/learn/passing-data-deeply-with-context)
- [You Might Not Need an Effect — react.dev](https://react.dev/learn/you-might-not-need-an-effect)
