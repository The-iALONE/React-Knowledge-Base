# Jotai

> 🧭 پیش‌نیاز: [State-Types](./State-Types.md) · [Zustand](./Zustand.md) · بعدی: [MobX](./MobX.md)

---

## 📖 مفهوم

برای مدل **atomic state** از Jotai استفاده می‌شود: به‌جای یک `store` بزرگ، هر تکهٔ `state` یک `atom` است. کامپوننت‌ها فقط به `atom`هایی که می‌خوانند subscribe می‌شوند — `re-render` دقیق‌تر از Context معمولی.

---

## چرا این ویژگی وجود دارد؟

در Context، تغییر یک فیلد ممکن است همهٔ `consumer`ها را بیدار کند. Jotai وابستگی را در سطح atom مدیریت می‌کند.

---

## چه مشکلی را حل می‌کند؟

- `re-render` اضافی از Context پر
- ترکیب `state`های مستقل بدون reducer یکپارچه
- `derived state` با `atom` محاسباتی

---

## ⚙️ نحوه کار

### نصب

```bash
npm i jotai
```

### atom پایه

```jsx
import { atom, useAtom } from "jotai";

const searchAtom = atom("");
const cabinsAtom = atom([]);

function SearchBar() {
  const [search, setSearch] = useAtom(searchAtom);
  return (
    <input value={search} onChange={(e) => setSearch(e.target.value)} />
  );
}
```

### derived atom

```jsx
const filteredCabinsAtom = atom((get) => {
  const cabins = get(cabinsAtom);
  const search = get(searchAtom);
  return cabins.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
});

function CabinList() {
  const [filtered] = useAtom(filteredCabinsAtom);
  return filtered.map((c) => <div key={c.id}>{c.name}</div>);
}
```

اتم `filteredCabinsAtom` خودش `state` جدا نیست — از `cabins` و `search` مشتق می‌شود (همان ایدهٔ [Derived State](./State-Types.md)).

---

## تفاوت با گزینه‌های مشابه

| | Jotai | Zustand | Recoil |
|---|-------|---------|--------|
| مدل | atom | store یکپارچه | atom (Meta) |
| Provider | اختیاری | ندارد | لازم |
| وضعیت نگهداری | فعال | فعال | Meta — نگهداری محدود |
| derived | atom(get) | selector دستی | selector |

---

## مثال واقعی در پروژه

فیلتر جستجوی کابین: `searchAtom` + `cabinsAtom` + `filteredCabinsAtom` — بدون prop drilling و بدون Redux.

---

## 🚀 Best Practices

✅ atom کوچک و متمرکز  
✅ derived را با `atom(get => ...)` بسازید، نه `useState` جدا  
✅ async atom برای دادهٔ ساده (یا React Query برای CRUD کامل)  
❌ یک atom غول‌پیکر با همهٔ اپ

---

## ⚠️ اشتباهات رایج

❌ duplicate کردن داده در atom و React Query  
❌ انتخاب Jotai وقتی تیم به Redux DevTools عادت دارد  
❌ derived را در `useState` + `useEffect` sync کردن

---

## ارتباط با مفاهیم دیگر

- [State-Types](./State-Types.md) — `Derived` / `Global`
- [Zustand](./Zustand.md) — store متمرکز
- [Recoil](./Recoil.md) — ایدهٔ مشابه از Meta
- [React Query](./React-Query.md) — `server state`

---

## خلاصه

در Jotai، `state` اتمی + `derived` declarative — مناسب وابستگی‌های ریز؛ برای API سنگین از React Query استفاده کنید.

---

## 📚 منابع

- [Jotai Documentation](https://jotai.org)
