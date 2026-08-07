# State

> 🧭 پیش‌نیاز: [Props](./Props.md) · بعدی: [Rendering](./Rendering.md)

داده‌ای که با تغییر آن، کامپوننت بازرندر می‌شود.

---

## 📖 مفهوم

دادهٔ داخلی کامپوننت را `state` می‌نامند (برخلاف `props`). با `useState` یا `useReducer` مدیریت می‌شود. وقتی `setState` صدا زده می‌شود، React کامپوننت را دوباره `render` می‌کند — اما `state` مثل «عکس لحظه‌ای» (`snapshot`) است؛ مقدار در همان `render` عوض نمی‌شود تا `render` بعدی ([State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)).

---

## چرا این ویژگی وجود دارد؟

رابط کاربری باید با داده تعاملی همگام باشد — کلیک، تایپ، انتخاب.

---

## چه مشکلی را حل می‌کند؟

نگهداری و به‌روزرسانی داده تعاملی داخل کامپوننت.

---

## ⚙️ نحوه کار

با `setState` → صف به‌روزرسانی → `re-render` → JSX جدید → DOM.

**به‌روزرسانی `object`/`array`:** کپی جدید بسازید — `mutate` مستقیم ممنوع.

```jsx
const [user, setUser] = useState({ name: "", age: 0 });

// درست
setUser((prev) => ({ ...prev, name: "Ali" }));

// چند setState در یک handler → batch (یک re-render)
setCount((c) => c + 1);
setFlag((f) => !f);
```

**چند متغیر `state`:** برای فیلدهای مستقل `useState` جدا؛ برای دادهٔ مرتبط یک `object` یا `useReducer`.

---

## Syntax

```jsx
const [count, setCount] = useState(0);
setCount((prev) => prev + 1); // functional update
```

---

## مثال واقعی در پروژه

در داشبورد رزرو، `filter`، `sortBy` و `page` هر کدام می‌توانند `state` محلی باشند — تا وقتی `sibling` دیگری به آن‌ها نیاز ندارد ([Lifting State Up](./Lifting-State-Up.md)).

---

## ⚠️ اشتباهات رایج

- ❌ `mutate` مستقیم (`state.push()`، `state.count++`)
- ❌ فراخوانی `setState` در بدنه `render`
- ❌ انتظار دیدن مقدار جدید `state` بلافاصله بعد از `setState` در همان تابع

---

## 🚀 Best Practices

- به‌روزرسانی `functional` وقتی به مقدار قبلی وابسته‌اید
- `colocate` کردن `state` نزدیک مصرف‌کننده
- برای منطق پیچیده → [`useReducer`](./Hooks/useReducer.md)

---

## ارتباط با مفاهیم دیگر

- [Hooks/useState](./Hooks/useState.md)
- [Rendering](./Rendering.md) — `trigger` اصلی `re-render`
- [Lifting State Up](./Lifting-State-Up.md)
- [State-Management/State-Types](./State-Management/State-Types.md)

---

## خلاصه

معنی `state` = دادهٔ `reactive` که `re-render` را `trigger` می‌کند. `snapshot` بودن و `immutability` دو نکتهٔ حیاتی هستند.

---

## 📚 منابع

- [State: A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)
