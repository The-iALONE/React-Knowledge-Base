# useReducer

> برای مدیریت `state` پیچیده با الگوی `reducer` — `dispatch(action)` به‌جای setter مستقیم.

---

## 📖 مفهوم

برای مدیریت `state` پیچیده با الگوی `reducer`، از `useReducer` استفاده می‌شود. به‌جای `setState` مستقیم، `action` ارسال می‌شود و `reducer` `state` جدید را محاسبه می‌کند — شبیه Redux در مقیاس کامپوننت.

---

## چرا

وقتی `state` چند فیلد دارد، `update`ها به هم وابسته‌اند، یا منطق `update` پیچیده است، `useState` پراکنده و خطاپذیر می‌شود. `reducer` همه `transition`ها را در یک تابع متمرکز می‌کند.

---

## مشکل

- برای `counter` ساده `overkill` است.
- `reducer` باید `pure` باشد — بدون `side effect`.
- `dispatch` `async` نیست؛ برای `async` از `effect` یا الگوی `thunk` استفاده کنید.

---

## نحوه کار

1. `reducer(state, action) => newState` — `pure function`.
2. `dispatch({ type: 'inc' })` `action` را می‌فرستد.
3. React `reducer` را اجرا و `state` را به‌روز می‌کند.
4. مثل `useState`، `re-render` `trigger` می‌شود.

---

## Syntax

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
const [state, dispatch] = useReducer(reducer, initialArg, initFunction);
```

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'inc':
      return { ...state, count: state.count + state.step };
    case 'setStep':
      return { ...state, step: action.payload };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });
dispatch({ type: 'inc' });
```

---

## پارامترها

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `reducer` | `(state, action) => state` | تابع `pure` |
| `initialState` | `S` | `state` اولیه |
| `init` (optional) | `(arg) => S` | `lazy initializer` |

---

## مقدار بازگشتی

| مقدار | نوع | توضیح |
|-------|-----|-------|
| `state` | `S` | `state` فعلی |
| `dispatch` | `(action) => void` | ارسال `action` |

---

## مثال ساده

```jsx
import { useReducer } from 'react';

function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'decrement':
      return { ...state, count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}
```

---

## مثال واقعی

### Dashboard — فیلتر چندگانه

```jsx
const initialFilters = { status: 'all', search: '', page: 1 };

function filtersReducer(state, action) {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.payload, page: 1 };
    case 'SET_SEARCH':
      return { ...state, search: action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'RESET':
      return initialFilters;
    default:
      return state;
  }
}

function OrdersDashboard() {
  const [filters, dispatch] = useReducer(filtersReducer, initialFilters);
  // ...
}
```

### Auth — فرم چندمرحله‌ای

```jsx
function signupReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'NEXT_STEP':
      return { ...state, step: state.step + 1 };
    case 'SUBMIT_SUCCESS':
      return { ...state, submitted: true };
    default:
      return state;
  }
}
```

### E-commerce — سبد با reducer + Context

```jsx
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return addItemToCart(state, action.product);
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id);
    case 'UPDATE_QTY':
      return state.map((i) =>
        i.id === action.id ? { ...i, qty: action.qty } : i
      );
    default:
      return state;
  }
}

function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const value = useMemo(() => ({ cart, dispatch }), [cart]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
```

---

## اشتباهات

```jsx
// ❌ side effect in reducer
function badReducer(state, action) {
  fetch('/api/log', { body: action }); // wrong!
  return state;
}

// ❌ mutate state
case 'ADD':
  state.items.push(action.item);
  return state;

// ✅ immutable
case 'ADD':
  return { ...state, items: [...state.items, action.item] };
```

---

## Best Practices

- `action` `type`ها را `constant` کنید (`const ADD = 'ADD'`).
- `reducer` را در فایل جدا export کنید (قابل تست).
- با Context برای `state` سراسری ترکیب کنید.
- برای `async`: `dispatch` در `event handler` + `await` API.

---

## When to Use / Not

| استفاده کنید | استفاده نکنید |
|-------------|---------------|
| `state` چند فیلد وابسته | `boolean` ساده |
| منطق `update` قابل تست | `state` مستقل ساده |
| الگوی Redux در مقیاس کوچک | جایگزین React Query |

---

## ارتباط با مفاهیم

- [useState.md](./useState.md) — `state` ساده
- [Context.md](../Context.md) — Provider + `useReducer`
- [State-Management/README.md](../State-Management/README.md)

---

## نکات

- `dispatch` در React 18+ `stable` است — نیازی به `useCallback` برای `pass` به `child` نیست.
- `useReducer` می‌تواند جایگزین `useState` باشد حتی برای یک مقدار.
- `lazy init`: `useReducer(reducer, props.initial, (i) => expensiveInit(i))`.

---

## Interview

**سوال:** `useState` vs `useReducer`؟  
**جواب:** برای `state` ساده از `useState` استفاده کنید؛ در `useReducer` وقتی `update`ها پیچیده، وابسته، یا قابل پیش‌بینی با `action`/`type` هستند.

**سوال:** `reducer` باید چه ویژگی‌هایی داشته باشد؟  
**جواب:** باید `pure` باشد — بدون `side effect`، بدون `mutate`، همان `input` → همان `output`.

---

## خلاصه

با `useReducer` می‌توان `state` را با `dispatch(action)` مدیریت کرد. برای `state` پیچیده و قابل تست عالی است؛ `reducer` حتماً `pure` و `immutable` باشد.

---

## منابع

- [useReducer — react.dev](https://react.dev/reference/react/useReducer)
- [Extracting State Logic into a Reducer — react.dev](https://react.dev/learn/extracting-state-logic-into-a-reducer)
