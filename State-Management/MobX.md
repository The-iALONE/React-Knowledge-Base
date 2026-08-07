# MobX

> 🧭 پیش‌نیاز: [State-Types](./State-Types.md) · [Redux](./Redux.md) · بعدی: [Recoil](./Recoil.md)

---

## 📖 مفهوم

برای مدل واکنش‌گرا (`reactive`) از MobX استفاده می‌شود: `state` را `observable` می‌کنید و کامپوننت‌ها با `observer` فقط وقتی فیلد استفاده‌شده عوض شود `re-render` می‌شوند. برخلاف Redux، نیازی به dispatch صریح `action` برای هر تغییر کوچک نیست — «هر چیزی که استفاده کردی، track می‌شود».

---

## چرا این ویژگی وجود دارد؟

برای توسعه‌دهندگانی که مدل imperative/OOP را ترجیح می‌دهند، MobX حس «شیء معمولی که خودش UI را به‌روز می‌کند» می‌دهد.

---

## چه مشکلی را حل می‌کند؟

- boilerplate `action`/`reducer` برای به‌روزرسانی‌های زیاد
- `re-render` دقیق بدون `selector` دستی (در حد استفادهٔ درست)
- store کلاس‌محور برای دامنهٔ پیچیده

---

## ⚙️ نحوه کار

### نصب

```bash
npm i mobx mobx-react-lite
```

### store observable

```jsx
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

class CartStore {
  items = [];

  constructor() {
    makeAutoObservable(this);
  }

  addItem(pizza) {
    this.items.push(pizza);
  }

  get totalPrice() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
}

const cartStore = new CartStore();

const CartSummary = observer(function CartSummary() {
  return <p>Total: {cartStore.totalPrice}</p>;
});

const AddButton = observer(function AddButton({ pizza }) {
  return <button onClick={() => cartStore.addItem(pizza)}>Add</button>;
});
```

فیلد `totalPrice` همان **derived state** است — بدون `useMemo` جدا.

---

## تفاوت با گزینه‌های مشابه

| | MobX | Redux | Zustand |
|---|------|-------|---------|
| پارادایم | reactive/OOP | functional/flux | hook store |
| تغییر state | مستقیم روی observable | فقط dispatch | set در store |
| یادگیری | متفاوت (magic) | قابل پیش‌بینی | ساده |
| DevTools | MobX DevTools | عالی | محدود |

---

## مثال واقعی در پروژه

مدیریت سبد با `items` و `totalPrice` محاسباتی — تغییر `items` خودکار `CartSummary` را به‌روز می‌کند.

---

## 🚀 Best Practices

✅ همیشه کامپوننت مصرف‌کننده را `observer` کنید  
✅ `makeAutoObservable` برای storeهای جدید  
✅ `action` برای batch تغییرات پیچیده (`runInAction`)  
❌ mutate خارج از MobX بدون observable

---

## ⚠️ اشتباهات رایج

❌ فراموش کردن `observer` — UI به‌روز نمی‌شود  
❌ قاطی کردن MobX و Redux در یک feature بدون مرز  
❌ اتکا به MobX برای `server cache` — React Query بهتر است

---

## ارتباط با مفاهیم دیگر

- [State-Types](./State-Types.md) — `Derived` / `Global`
- [Redux Toolkit](./Redux-Toolkit.md) — flux صریح
- [Jotai](./Jotai.md) — atomic سبک‌تر
- [React Query](./React-Query.md) — `remote state`

---

## خلاصه

در MobX، `observable` + `observer` — مدل واکنش‌گرا برای تیم‌هایی که Flux سنگین می‌بینند.

---

## 📚 منابع

- [MobX Documentation](https://mobx.js.org)
- [mobx-react-lite](https://mobx.js.org/react-integration.html)
