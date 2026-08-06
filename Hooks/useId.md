# useId

> برای تولید ID یکتا و پایدار بین `server` و `client` — عمدتاً برای دسترسی‌پذیری (`label`/`input`، `aria-*`).

---

## 📖 مفهوم

برای تولید `string` یکتا بین `instance`های کامپوننت، از `useId` استفاده می‌شود که در همه `render`های یک کامپوننت ثابت است و بین `instance`های مختلف متفاوت است. برای `htmlFor`/`id` و `aria-labelledby` بدون `collision` استفاده می‌شود.

---

## چرا

استفاده از `id={Math.random()}` یا `id={Date.now()}` در SSR باعث `hydration mismatch` می‌شود. با `useId` ID پایدار و سازگار با `server`/`client` تولید می‌شود.

---

## مشکل

- ID تولیدشده برای `CSS selector` مناسب نیست (شامل `:` است).
- در لیست نباید به‌عنوان `key` استفاده شود — هر item یک `useId` جدا ندارد مگر کامپوننت جدا باشد.
- فقط یک ID به ازای هر `component instance` — برای چند `id` از `suffix` بسازید.

---

## نحوه کار

1. اولین `render`: React یک `unique id` تولید می‌کند (مثل `:r1:`).
2. همان `id` در `re-render`ها برمی‌گردد.
3. SSR و `client` همان `id` را می‌گیرند → بدون `mismatch`.
4. هر `mount` جدید `id` جدید.

---

## Syntax

```jsx
const id = useId();
```

```jsx
const id = useId();
return (
  <>
    <label htmlFor={id}>Email</label>
    <input id={id} type="email" />
  </>
);
```

---

## پارامترها

بدون پارامتر.

---

## مقدار بازگشتی

| مقدار | نوع | توضیح |
|-------|-----|-------|
| `id` | `string` | شناسه یکتا پایدار |

---

## مثال ساده

```jsx
import { useId } from 'react';

function EmailField() {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>Email address</label>
      <input id={id} name="email" type="email" />
    </div>
  );
}
```

---

## مثال واقعی

### Dashboard — فرم فیلتر با دسترسی‌پذیری

```jsx
function FilterField({ label, children }) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {children({ id, errorId })}
    </div>
  );
}

function StatusFilter() {
  return (
    <FilterField label="Status">
      {({ id }) => (
        <select id={id} name="status">
          <option value="all">All</option>
          <option value="active">Active</option>
        </select>
      )}
    </FilterField>
  );
}
```

### Auth — checkbox terms

```jsx
function TermsCheckbox() {
  const id = useId();

  return (
    <div className="flex gap-2">
      <input id={id} type="checkbox" name="terms" required />
      <label htmlFor={id}>
        I agree to the terms and conditions
      </label>
    </div>
  );
}
```

### E-commerce — aria برای rating

```jsx
function StarRating({ value, onChange }) {
  const groupId = useId();
  const labelId = `${groupId}-label`;

  return (
    <div role="radiogroup" aria-labelledby={labelId}>
      <span id={labelId}>Rate this product</span>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          id={`${groupId}-star-${star}`}
          onClick={() => onChange(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
}
```

---

## اشتباهات

```jsx
// ❌ random id — hydration mismatch
const id = `input-${Math.random()}`;

// ❌ useId as list key
items.map(() => {
  const id = useId(); // violates rules if in loop incorrectly
});

// ❌ useId in loop without component
items.map((item) => <div id={useId()} />); // rules of hooks!

// ✅ separate component per item
items.map((item) => <LabeledItem key={item.id} item={item} />);

// ✅ suffix for multiple ids
const baseId = useId();
const inputId = `${baseId}-input`;
const hintId = `${baseId}-hint`;
```

---

## Best Practices

- برای `htmlFor` + `id` و `aria-*` استفاده کنید.
- چند `id`: `const id = useId(); const hintId = id + '-hint';`
- کامپوننت `reusable` که `label`+`input` دارد → `useId` داخل همان کامپوننت.
- برای `key` از `item.id` استفاده کنید نه `useId`.

---

## When to Use / Not

| استفاده کنید | استفاده نکنید |
|-------------|---------------|
| `label`/`input` pairing | `key` React در لیست |
| `aria-labelledby`/`describedby` | `#selector` CSS |
| ID یکتا سازگار با SSR | `id` ثابت سراسری (`"email"`) |

---

## ارتباط با مفاهیم

- [Forms.md](../Forms.md)
- [Accessibility patterns in Components](../Components.md)
- [useRef.md](./useRef.md) — ref ≠ id

---

## نکات

- React 18+.
- React 19.2: پیش‌وند پیش‌فرض `id` از `:r` به `«r»` تغییر کرد.
- فرمت id ممکن است شامل `:` باشد — در HTML معتبر است.
- در Strict Mode همان id حفظ می‌شود.

---

## Interview

**سوال:** چرا `useId` به‌جای `Math.random()`؟  
**جواب:** برای سازگاری SSR/`hydration` — `server` و `client` باید همان `id` را داشته باشند.

**سوال:** آیا می‌توان در `loop` از `useId` استفاده کرد؟  
**جواب:** نه در همان کامپوننت (`rules of hooks`). هر `item` باید کامپوننت جدا باشد یا یک `useId` با `suffix`.

---

## خلاصه

با `useId` ID یکتا و سازگار با SSR برای دسترسی‌پذیری تولید می‌شود. برای `label`/`input` و `aria` استفاده کنید؛ برای `key` یا `selector` CSS نه.

---

## منابع

- [useId — react.dev](https://react.dev/reference/react/useId)
