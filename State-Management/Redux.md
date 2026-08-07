# Redux (کلاسیک)

> 🧭 پیش‌نیاز: [useReducer Pattern](./useReducer-Pattern.md) · [State-Types](./State-Types.md) · بعدی: [Redux Toolkit](./Redux-Toolkit.md)

---

## 📖 مفهوم

برای نگه‌داری `global state` در یک `store` مرکزی از Redux استفاده می‌شود — کتابخانه‌ای **مستقل از React**. همهٔ تغییرات فقط با `action` dispatch می‌شوند و `reducer`های pure `state` جدید برمی‌گردانند — همان الگوی `useReducer`، ولی در مقیاس اپ.

اتصال به React با `react-redux` (`Provider`، `useSelector`، `useDispatch`).

---

## چرا این ویژگی وجود دارد؟

در اپ بزرگ، `state` پراکنده در ده‌ها Context غیرقابل `debug` می‌شود. Redux یک جریان یک‌طرفه می‌دهد: `UI → dispatch(action) → reducer → store → UI`.

---

## چه مشکلی را حل می‌کند؟

- `global state` قابل پیش‌بینی
- تاریخچهٔ `action`ها در Redux DevTools
- ترکیب چند `feature` با `combineReducers`

---

## ⚙️ نحوه کار

### سه اصل

1. **یک store** — `global state` در یک جا  
2. **فقط خواندن** — `state` را مستقیم عوض نکنید  
3. **تغییر با action** — `dispatch({ type, payload })`

### reducer + store (کلاسیک)

```jsx
import { combineReducers, createStore } from "redux";

const initialStateAccount = { balance: 0, loan: 0, loanPurpose: "" };

function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit":
      return { ...state, balance: state.balance + action.payload };
    case "account/withdraw":
      return { ...state, balance: state.balance - action.payload };
    default:
      return state;
  }
}

const rootReducer = combineReducers({ account: accountReducer });
const store = createStore(rootReducer);
```

### action creator

```jsx
function deposit(amount) {
  return { type: "account/deposit", payload: amount };
}

store.dispatch(deposit(250));
```

### اتصال به React

```jsx
import { Provider } from "react-redux";
import store from "./store";

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

### خواندن و dispatch در کامپوننت

```jsx
import { useSelector, useDispatch } from "react-redux";
import { deposit } from "./accountSlice";

function Balance() {
  const balance = useSelector((store) => store.account.balance);
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(deposit(100))}>
      Balance: {balance}
    </button>
  );
}
```

### Middleware و Thunk (async)

برای API call **قبل از** رسیدن `action` به reducer، **middleware** (معمولاً `redux-thunk`) بین `dispatch` و `store` می‌نشیند:

```jsx
export function deposit(amount, currency) {
  if (currency === "USD") return { type: "account/deposit", payload: amount };

  return async function (dispatch, getState) {
    dispatch({ type: "account/convertingCurrency" });
    const res = await fetch(`https://api.example/rates?amount=${amount}&from=${currency}`);
    const data = await res.json();
    dispatch({ type: "account/deposit", payload: data.usd });
  };
}
```

وقتی `dispatch` یک **تابع** بگیرد (نه `object`)، thunk آن را اجرا می‌کند — این همان جایی است که `fetch` انجام می‌شود.

---

## تفاوت با گزینه‌های مشابه

| | Redux کلاسیک | Redux Toolkit | Context+useReducer |
|---|-------------|---------------|-------------------|
| Boilerplate | زیاد | کم | کم |
| Immer | دستی spread | داخلی | دستی |
| Thunk | نصب جدا | داخلی | useEffect |
| توصیه امروز | فقط یادگیری | production | subtree کوچک |

> **امروز در پروژه جدید از Redux Toolkit استفاده کنید** — [Redux-Toolkit.md](./Redux-Toolkit.md). Redux کلاسیک برای فهم مفاهیم و خواندن کد قدیمی است.

---

## مثال واقعی در پروژه

**redux-intro**: `accountReducer` + `customerReducer`، `combineReducers`، thunk برای تبدیل ارز قبل از `deposit`.

---

## 🚀 Best Practices

✅ یک reducer per feature (`account`، `customer`)  
✅ نام `action` با prefix: `"account/deposit"`  
✅ `action creator` برای همه dispatchها  
❌ `mutate` مستقیم `store.getState()`  
❌ Redux برای دادهٔ API — از React Query استفاده کنید

---

## ⚠️ اشتباهات رایج

❌ فراموش کردن spread در reducer (`return state` به‌جای `{ ...state, ... }`)  
❌ منطق async داخل reducer (باید در thunk باشد)  
❌ نصب Redux خام برای پروژه جدید

---

## ارتباط با مفاهیم دیگر

- [State-Types](./State-Types.md) — `Global` / `Client state`
- [Redux Toolkit](./Redux-Toolkit.md) — روش مدرن
- [React Query](./React-Query.md) — `server state` جدا
- [useReducer Pattern](./useReducer-Pattern.md)

---

## خلاصه

در Redux، `store` مرکزی + `action` + `reducer` + (اختیاری) `middleware`/`thunk` — برای production از Redux Toolkit استفاده کنید.

---

## 📚 منابع

- [Redux Essentials](https://redux.js.org/tutorials/essentials/part-1-overview-concepts)
- جزوه: Redux.md — account/customer reducer، thunk، middleware
