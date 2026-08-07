# Zustand

> 🧭 پیش‌نیاز: [State-Types](./State-Types.md) · [Redux Toolkit](./Redux-Toolkit.md) · بعدی: [Jotai](./Jotai.md)

---

## 📖 مفهوم

برای `global state` سبک از Zustand استفاده می‌شود — کتابخانه‌ای که بدون `Provider`، `action type`، یا `reducer` رسمی کار می‌کند. یک `store` می‌سازید و در هر کامپوننت با hook به آن وصل می‌شوید — حس `useState` سراسری.

---

## چرا این ویژگی وجود دارد؟

برای سبد خرید یا `UI state` سراسری، Redux گاهی سنگین است. Zustand همان نیاز را با چند خط حل می‌کند.

---

## چه مشکلی را حل می‌کند؟

- boilerplate Redux برای `state` ساده
- `re-render` غیرضروری — فقط وقتی slice انتخاب‌شده عوض شود
- نیاز به wrap کردن کل اپ با Provider (اختیاری)

---

## ⚙️ نحوه کار

### نصب

```bash
npm i zustand
```

### store ساده

```jsx
import { create } from "zustand";

const useCartStore = create((set) => ({
  items: [],
  addItem: (pizza) =>
    set((state) => ({ items: [...state.items, pizza] })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clearCart: () => set({ items: [] }),
}));

function CartButton() {
  const itemCount = useCartStore((state) => state.items.length);
  return <span>Cart ({itemCount})</span>;
}

function AddToCart({ pizza }) {
  const addItem = useCartStore((state) => state.addItem);
  return <button onClick={() => addItem(pizza)}>Add</button>;
}
```

### selector — فقط تغییرات مورد نظر

```jsx
const balance = useCartStore((s) => s.items.length);
// فقط وقتی length عوض شود re-render
```

---

## تفاوت با گزینه‌های مشابه

| | Zustand | Redux Toolkit | Context |
|---|---------|---------------|---------|
| Setup | خیلی کم | متوسط | کم |
| DevTools | اختیاری | عالی | ندارد |
| قرارداد action | ندارد | دارد | ندارد |
| Async | در set / middleware | thunk / RTK Query | useEffect |
| بهترین برای | global سبک–متوسط | global پیچیده + تاریخچه | theme/auth کم‌تغییر |

---

## مثال واقعی در پروژه

**fast-react-pizza** (نسخه‌های مدرن): سبد خرید با Zustand به‌جای Redux — همان دامنه، کد کمتر.

---

## 🚀 Best Practices

✅ selector برای جلوگیری از `re-render`  
✅ `server state` را در React Query نگه دارید، نه Zustand  
✅ slice جدا: `useCartStore`، `useUIStore`  
❌ همهٔ API responses در یک store

---

## ⚠️ اشتباهات رایج

❌ انتخاب کل `state` بدون selector — هر تغییر همه را `re-render` می‌کند  
❌ جایگزین Redux وقتی تیم به DevTools/time-travel نیاز دارد  
❌ قاطی کردن fetch و cache دستی — از React Query استفاده کنید

---

## ارتباط با مفاهیم دیگر

- [State-Types](./State-Types.md) — `Global` / `Client state`
- [Redux Toolkit](./Redux-Toolkit.md) — جایگزین سنگین‌تر
- [Jotai](./Jotai.md) — مدل atomic
- [React Query](./React-Query.md) — `server state`

---

## خلاصه

در Zustand، `global state` مینیمال و بدون ceremony — عالی برای cart و UI سراسری؛ برای API از React Query استفاده کنید.

---

## 📚 منابع

- [Zustand Documentation](https://zustand.docs.pmnd.rs)
- [Examples/state-management/ZustandStore.jsx](../Examples/state-management/ZustandStore.jsx)
