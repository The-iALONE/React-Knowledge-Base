# Forms — فرم‌ها و ورودی `controlled`

> فرم‌ها در React با `controlled components` مدیریت می‌شوند: مقدار `input` از `state` می‌آید و با `onChange` به‌روز می‌شود.

## 📖 مفهوم

در React، `Forms` مجموعه `input`، `select`، `checkbox` و دکمه `submit` هستند. معمولاً `controlled` هستند — React «منبع حقیقت» (`single source of truth`) برای مقدار فیلدهاست.

## چرا این ویژگی وجود دارد؟

اعتبارسنجی، پیش‌نمایش زنده، `reset` و `submit` قابل پیش‌بینی نیاز به `state` متمرکز دارد. `controlled components` این را ممکن می‌کنند.

## چه مشکلی را حل می‌کند؟

- ناهماهنگی بین DOM و `state` برنامه
- اعتبارسنجی قبل از `submit`
- فرم‌های چندمرحله‌ای و وابسته به هم

## ⚙️ نحوه کار

1. `value={state}` روی `input`
2. `onChange` → `setState`
3. `onSubmit` → `preventDefault` → ارسال داده
4. هر تغییر → `re-render` → مقدار `input` از `state`

## Syntax (if applicable)

```jsx
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    login({ email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">ورود</button>
    </form>
  );
}
```

**در React 19 — `Form Actions`:**

```jsx
async function updateName(formData) {
  const name = formData.get("name");
  await saveName(name);
}

function ProfileForm() {
  return (
    <form action={updateName}>
      <input name="name" />
      <button type="submit">Save</button>
    </form>
  );
}
```

با `useActionState` و `useFormStatus` برای `pending`/`error` `state` — [Hooks/useActionState](./Hooks/useActionState.md).

**چند فیلد با یک `handler`:**

```jsx
function handleChange(e) {
  const { name, value, type, checked } = e.target;
  setForm((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
}
```

## 💡 مثال ساده (if needed)

```jsx
<textarea value={text} onChange={(e) => setText(e.target.value)} />
<select value={city} onChange={(e) => setCity(e.target.value)}>
  <option value="tehran">تهران</option>
</select>
```

## مثال واقعی در پروژه

**ثبت‌نام کاربر + سفارش پیتزا:**

```jsx
function SignupForm({ onSuccess }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "نام الزامی است";
    if (!form.email.includes("@")) next.email = "ایمیل نامعتبر";
    if (!form.acceptTerms) next.acceptTerms = "قوانین را بپذیرید";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSuccess(form);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input name="fullName" value={form.fullName} onChange={handleChange} />
      {errors.fullName && <span>{errors.fullName}</span>}
      {/* ... */}
    </form>
  );
}
```

**فرم سفارش با محاسبه قیمت:**

```jsx
function OrderForm({ pizza, onOrder }) {
  const [size, setSize] = useState("medium");
  const [quantity, setQuantity] = useState(1);
  const total = pizza.prices[size] * quantity;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onOrder({ size, quantity, total });
      }}
    >
      <select value={size} onChange={(e) => setSize(e.target.value)}>
        <option value="small">کوچک</option>
        <option value="medium">متوسط</option>
        <option value="large">بزرگ</option>
      </select>
      <p>مبلغ: {total.toLocaleString("fa-IR")} تومان</p>
      <button type="submit">ثبت سفارش</button>
    </form>
  );
}
```

## ⚠️ اشتباهات رایج

- فراموش `e.preventDefault()` → `refresh` صفحه
- `controlled` `input` بدون `onChange` → `warning` و `input` قفل
- مقدار `undefined` برای `value` — همیشه `string` (حتی `""`)
- `state` جدا برای هر فیلد در فرم بزرگ بدون ساختار

## 🚀 Best Practices

- `object` `state` برای فرم‌های چندفیلدی
- اعتبارسنجی `on submit` + نمایش خطا کنار فیلد
- برای فرم‌های پیچیده: [React Hook Form](./State-Management/React-Hook-Form.md) یا `native` `FormData` با `Server Actions`
- در React 19: `action` prop روی `<form>` — `async function` به‌صورت `Action` اجرا می‌شود
- `type="submit"` و `type="button"` را درست تفکیک کنید

## چه زمانی استفاده کنیم؟ / چه زمانی استفاده نکنیم؟

| استفاده کنیم                          | استفاده نکنیم                                         |
| ------------------------------------- | ----------------------------------------------------- |
| فرم‌های `interactive` با `validation` | فرم ساده یک‌بار `submit` بدون JS (HTML خالص کافی است) |
| `wizard` چندمرحله‌ای                  | هر فیلد `uncontrolled` مگر دلیل خاص (`ref`)           |

## ارتباط با مفاهیم دیگر

- [Events](./Events.md)
- [State](./State.md)
- [Lifting-State-Up](./Lifting-State-Up.md)
- [Hooks/useActionState](./Hooks/useActionState.md) — `state` فرم با `Actions`
- [Hooks/useFormStatus](./Hooks/useFormStatus.md) — وضعیت `submit`
- [Server-Components](./Escape-Hatches/Server-Components.md) — `Server Actions`

## 💡 نکات مهم

- `uncontrolled`: `defaultValue` + `ref` — React منبع حقیقت نیست
- `checkbox`: `checked` نه `value`
- `file input` معمولاً `uncontrolled` است

## 🎯 سوالات رایج مصاحبه

1. `controlled` در برابر `uncontrolled`؟
2. چرا `value` نباید `undefined` باشد؟
3. چگونه چند `checkbox` را مدیریت می‌کنید؟
4. کتابخانه React Hook Form چه مشکلی حل می‌کند؟

## خلاصه

فرم‌های React با `state` و `onChange` `controlled` می‌شوند. `preventDefault`، ساختار `state` منظم و اعتبارسنجی قبل از `submit` از الگوهای استاندارد هستند.

## 📚 منابع (react.dev)

- [Reacting to Input with State](https://react.dev/learn/reacting-to-input-with-state)
- [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [Form Actions — React 19](https://react.dev/reference/react-dom/components/form)
