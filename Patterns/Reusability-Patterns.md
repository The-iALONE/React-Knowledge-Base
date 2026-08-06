# Reusability Patterns

مرور الگوهای اشتراک منطق و UI در React و انتخاب مناسب برای هر سناریو.

---
## 📖 مفهوم

الگوهای `Reusability Patterns` مجموعه تکنیک‌هایی است برای استفاده مجدد از `logic` و ساختار UI بدون `copy-paste`: `Custom Hooks`، `Compound Components`، `Render Props`، `HOC` و ترکیب آن‌ها.

---
## چرا این ویژگی وجود دارد؟

`DRY`، نگهداری آسان‌تر، و API یکنواخت در `scale` بزرگ.

---
## چه مشکلی را حل می‌کند؟

تکرار `stateful logic`، `prop drilling`، و کامپوننت‌های غول‌پیکر با ده‌ها `prop`.

---
## ⚙️ نحوه کار — مقایسه الگوها

| الگو | بهترین برای | مثال |
|------|-------------|------|
| `Custom Hook` | `stateful logic` بدون UI | `useDebounce`, `useFetch` |
| `Compound Component` | UI چندبخشی با `state` مشترک | Modal, Tabs |
| `Render Props` | `logic` + UI کاملاً سفارشی (`legacy`) | `MouseTracker` |
| `HOC` | `wrap` و `inject` (`legacy`/libs) | `withAuth`, `memo` |
| `Context` | داده عمیق در درخت | Theme, Auth |
| `Children as UI slot` | `layout` ساده | `Card` + `children` |

---
## چه زمانی از کدام استفاده کنیم؟

### Custom Hook (پیش‌فرض ۲۰۲۴+)
- `fetch`، `form logic`، `subscription`، `media query`
- وقتی فقط `behavior` `reuse` می‌شود

### Compound Components
- Modal، Accordion، Select سفارشی
- وقتی `consumer` چیدمان را کنترل می‌کند

### Context + Hook
- `theme`، `locale`، `auth session`
- داده‌های `global` یا نیمه‌`global`

### Render Props / HOC
- فقط `legacy` یا API کتابخانه

---
## 💡 مثال ترکیبی — فرم با Compound + Hook

```jsx
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

- `Modal compound` → UI انعطاف‌پذیر سفارش پیتزا
- `useLocalStorage hook` → فیلترها در worldwise
- `React Query hooks` → CRUD کابین‌ها (جایگزین `render props` قدیمی)

---
## 🚀 Best Practices

✅ `logic` → `Hook`؛ `structure` → `Compound`  
✅ یک سطح `abstraction`؛ `over-engineering` نکنید  
✅ TypeScript برای API عمومی  
✅ مستندات کوتاه برای `compound slots`  
❌ `HOC`/`render props` در کد سبز جدید بدون دلیل  
❌ `Context` برای هر `state` محلی

---
## ارتباط با مفاهیم دیگر

- [React.memo](./React-Memo.md)
- [Compound Components](./Compound-Components.md)
- [Render Props](./Render-Props.md)
- [Higher-Order Components](./Higher-Order-Components.md)
- [Custom Hooks](../Custom-Hooks.md)
- [Context API](../State-Management/Context-API.md)
- [State Management Overview](../State-Management/README.md)

---
## خلاصه

۲۰۲۴+: `Hook` برای `logic`، `Compound` برای UI ترکیبی، `Context` برای داده سراسری. `Render Props` و `HOC` عمدتاً `legacy`.

---
## 📚 منابع

- [Reusing Logic with Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
