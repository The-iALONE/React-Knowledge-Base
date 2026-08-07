# Redux Toolkit (RTK)

> 🧭 پیش‌نیاز: [Redux](./Redux.md) · [State-Types](./State-Types.md) · بعدی: [React Query](./React-Query.md) · [Zustand](./Zustand.md)

---

## 📖 مفهوم

برای نوشتن Redux مدرن از Redux Toolkit (`@reduxjs/toolkit`) استفاده می‌شود — روش **رسمی و توصیه‌شده** تیم Redux. با `createSlice` و `configureStore` بیشتر boilerplate کلاسیک حذف می‌شود؛ Immer برای «نوشتن mutable» در reducer، و thunk به‌صورت پیش‌فرض فعال است.

---

## چرا این ویژگی وجود دارد؟

نسخهٔ کلاسیک Redux برای یک `deposit` ساده ده‌ها خط می‌خواست. RTK همان قدرت را با کد کمتر و باگ کمتر می‌دهد.

---

## چه مشکلی را حل می‌کند؟

- boilerplate `action type` + `action creator` + `reducer` جدا
- `immutable update` دستی با spread
- setup دستی DevTools و thunk

---

## ⚙️ نحوه کار

### نصب

```bash
npm i @reduxjs/toolkit react-redux
```

### configureStore

```jsx
import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./features/accounts/accountSlice";
import customerReducer from "./features/customers/customerSlice";

const store = configureStore({
  reducer: {
    account: accountReducer,
    customer: customerReducer,
  },
});

export default store;
```

تابع `configureStore` خودکار ترکیب reducerها، thunk، و DevTools را انجام می‌دهد.

### createSlice (از جزوه — accountSlice)

```jsx
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance += action.payload; // Immer — mutate امن
      state.isLoading = false;
    },
    withdraw(state, action) {
      state.balance -= action.payload;
    },
    requestLoan: {
      prepare(amount, purpose) {
        return { payload: { amount, purpose } };
      },
      reducer(state, action) {
        if (state.loan > 0) return;
        state.loan = action.payload.amount;
        state.loanPurpose = action.payload.purpose;
        state.balance += action.payload.amount;
      },
    },
    payLoan(state) {
      state.balance -= state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
    convertingCurrency(state) {
      state.isLoading = true;
    },
  },
});

export const { withdraw, requestLoan, payLoan } = accountSlice.actions;
export default accountSlice.reducer;
```

از `prepare` وقتی استفاده کنید که `action creator` بیش از یک آرگومان می‌خواهد (مثلاً `requestLoan(1000, "Buy a car")`).

### thunk دستی (deposit با تبدیل ارز)

```jsx
export function deposit(amount, currency) {
  if (currency === "USD")
    return { type: "account/deposit", payload: amount };

  return async (dispatch) => {
    dispatch({ type: "account/convertingCurrency" });
    const res = await fetch(
      `https://api.frankfurter.dev/v1/latest?amount=${amount}&base=${currency}&symbols=USD`
    );
    const data = await res.json();
    dispatch({ type: "account/deposit", payload: data.rates.USD });
  };
}
```

در RTK نیازی به نصب `redux-thunk` جدا نیست.

### استفاده در React

```jsx
const balance = useSelector((state) => state.account.balance);
const dispatch = useDispatch();
dispatch(deposit(100, "EUR"));
```

---

## RTK Query — `server state` داخل اکوسیستم Redux

برای دادهٔ API (جایگزین بخشی از React Query اگر کل تیم Redux دارد):

```jsx
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const cabinsApi = createApi({
  reducerPath: "cabinsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getCabins: builder.query({
      query: () => "/cabins",
    }),
    createCabin: builder.mutation({
      query: (body) => ({ url: "/cabins", method: "POST", body }),
    }),
  }),
});

export const { useGetCabinsQuery, useCreateCabinMutation } = cabinsApi;
```

| | React Query | RTK Query |
|---|-------------|-----------|
| اکوسیستم | مستقل | Redux store |
| DevTools | React Query DevTools | Redux DevTools |
| توصیه | پیش‌فرض برای API | وقتی Redux از قبل دارید |

---

## ساختار فایل حرفه‌ای (جزوه)

```
src/
├── app/store.js
└── features/
    ├── accounts/
    │   ├── accountSlice.js
    │   └── AccountOperations.jsx
    └── customers/
        └── customerSlice.js
```

هر `feature` reducer و UI خودش را دارد.

---

## تفاوت با گزینه‌های مشابه

- **Redux کلاسیک**: بیشتر کد، همان ایده
- **Zustand**: سبک‌تر، بدون `action`/`reducer` رسمی
- **React Query**: فقط `server state` — RTK برای `client` + RTK Query برای API

---

## مثال واقعی در پروژه

**redux-intro / fast-react-pizza**: `accountSlice`، `customerSlice`، `AccountOperations` با `useDispatch`/`useSelector`.

---

## 🚀 Best Practices

✅ `createSlice` per feature  
✅ `server state` → React Query یا RTK Query (نه همه در slice)  
✅ `selector` با `createSelector` برای performance  
❌ Redux برای هر `toggle` محلی

---

## ⚠️ اشتباهات رایج

❌ export کردن `deposit` thunk و همزمان auto-generated از slice — نام‌گذاری شفاف  
❌ قرار دادن پاسخ API خام در slice بدون normalize  
❌ نادیده گرفتن `prepare` برای چند آرگومان

---

## ارتباط با مفاهیم دیگر

- [State-Types](./State-Types.md) — `Global` / `Client state`
- [Redux](./Redux.md) — مفاهیم پایه
- [React Query](./React-Query.md) — جایگزین/مکمل برای API
- [Zustand](./Zustand.md) — سبک‌تر برای global ساده

---

## خلاصه

در RTK: `createSlice`، `configureStore`، Immer، thunk — و RTK Query برای API وقتی در اکوسیستم Redux هستید.

---

## 📚 منابع

- [Redux Toolkit](https://redux-toolkit.js.org)
- [RTK Query Overview](https://redux-toolkit.js.org/rtk-query/overview)
- جزوه: accountSlice، configureStore، prepare
