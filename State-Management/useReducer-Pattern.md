# useReducer Pattern

> 🧭 پیش‌نیاز: [Hooks/useReducer](../Hooks/useReducer.md) · [Context-API](./Context-API.md) · [State-Types](./State-Types.md) · بعدی: [Redux](./Redux.md)

---

## 📖 مفهوم

وقتی `state` چند فیلد دارد و به‌روزرسانی‌ها با چند `action` مشخص انجام می‌شود، به‌جای چند `useState` از `useReducer` استفاده می‌کنیم. ترکیب `useReducer` + `Context` الگوی «mini-Redux» محلی است — همان ایدهٔ Redux، ولی داخل React.

---

## چرا این ویژگی وجود دارد؟

وقتی `setState`های پشت‌سرهم برای `wizard` چندمرحله‌ای یا فرم پیچیده می‌نویسید، کد خوانا نیست. `reducer` همهٔ transitionها را در یک تابع متمرکز می‌کند.

---

## چه مشکلی را حل می‌کند؟

- منطق به‌روزرسانی پراکنده در کامپوننت
- باگ‌های `state` ناسازگار (مثلاً `step` عوض شد ولی `errors` پاک نشد)
- نیاز به اشتراک `state` + `dispatch` در `subtree`

---

## ⚙️ نحوه کار

### reducer ساده

```jsx
const initialState = { step: 1, name: "", email: "" };

function bookingReducer(state, action) {
  switch (action.type) {
    case "next":
      return { ...state, step: state.step + 1 };
    case "update":
      return { ...state, [action.field]: action.value };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

function BookingWizard() {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <>
      <input
        value={state.name}
        onChange={(e) =>
          dispatch({ type: "update", field: "name", value: e.target.value })
        }
      />
      <button onClick={() => dispatch({ type: "next" })}>Next</button>
    </>
  );
}
```

### ترکیب با Context (الگوی جزوه)

```jsx
const BookingContext = createContext(null);

function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext value={{ state, dispatch }}>
      {children}
    </BookingContext>
  );
}

function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking outside provider");
  return ctx;
}
```

---

## تفاوت با گزینه‌های مشابه

| | useState | useReducer | Redux |
|---|----------|------------|-------|
| پیچیدگی | ساده | متوسط | بیشتر |
| دامنه | یک کامپوننت | + Context برای subtree | کل اپ |
| DevTools | ندارد | ندارد | Redux DevTools |
| Async | useEffect | useEffect | thunk / RTK Query |

---

## مثال واقعی در پروژه

**atomic-blog / Context + useReducer**: مدیریت لیست پست‌ها با `dispatch({ type: "add", payload })` — همان الگوی Redux، بدون نصب Redux.

---

## 🚀 Best Practices

✅ `action.type` ثابت و قابل پیش‌بینی (`"account/deposit"` در Redux هم همین است)  
✅ `initialState` را خارج از کامپوننت تعریف کنید  
✅ برای اشتراک: `Provider` + custom hook  
❌ `useReducer` برای یک `boolean` ساده

---

## ⚠️ اشتباهات رایج

❌ `mutate` مستقیم `state` در reducer (باید `immutable` برگردانید — مگر Redux Toolkit با Immer)  
❌ منطق `side effect` داخل reducer — فقط pure update  
❌ Context + reducer برای `state` سراسری بزرگ — برو سراغ RTK

---

## ارتباط با مفاهیم دیگر

- [State-Types](./State-Types.md) — `Form` / `Client state`
- [Context-API](./Context-API.md)
- [Redux](./Redux.md) — نسخهٔ سراسری همین الگو
- [Hooks/useReducer](../Hooks/useReducer.md)

---

## خلاصه

برای `state` چندفیلدی با `action`های مشخص از `useReducer` استفاده کنید؛ با `Context` = mini-Redux برای یک `feature`.

---

## 📚 منابع

- [Extracting State Logic into a Reducer — react.dev](https://react.dev/learn/extracting-state-logic-into-a-reducer)
- جزوه: Context and useReducer — atomic-blog
