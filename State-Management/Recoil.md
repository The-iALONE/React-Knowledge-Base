# Recoil

> 🧭 پیش‌نیاز: [Jotai](./Jotai.md) · [State-Types](./State-Types.md) · بعدی: [React Query](./React-Query.md)

---

## 📖 مفهوم

برای مدل atom/selector از Recoil استفاده می‌شود — کتابخانهٔ `state management` از Meta که شبیه Jotai کار می‌کند. هر `atom` واحد مستقل `state` است؛ `selector` مقدار مشتق‌شده از چند atom برمی‌گرداند.

> **وضعیت نگهداری:** توسعهٔ Recoil توسط Meta کند شده و برای پروژه‌های جدید معمولاً **Jotai** یا **Zustand** توصیه می‌شود. Recoil برای درک ایدهٔ atomic و خواندن کد قدیمی مفید است.

---

## چرا این ویژگی وجود دارد؟

قبل از Jotai/Zustand محبوب شدن، Recoil راهی برای `global state` با granularity بهتر از Context ارائه کرد.

---

## چه مشکلی را حل می‌کند؟

- `prop drilling` و Context سنگین
- `derived state` declarative با selector
- async selector برای دادهٔ وابسته

---

## ⚙️ نحوه کار

### نصب

```bash
npm i recoil
```

### atom + selector

```jsx
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { RecoilRoot } from "recoil";

const searchState = atom({
  key: "searchState",
  default: "",
});

const cabinsState = atom({
  key: "cabinsState",
  default: [],
});

const filteredCabinsState = selector({
  key: "filteredCabins",
  get: ({ get }) => {
    const cabins = get(cabinsState);
    const search = get(searchState);
    return cabins.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  },
});

function App() {
  return (
    <RecoilRoot>
      <SearchBar />
      <CabinList />
    </RecoilRoot>
  );
}

function SearchBar() {
  const [search, setSearch] = useRecoilState(searchState);
  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}

function CabinList() {
  const cabins = useRecoilValue(filteredCabinsState);
  return cabins.map((c) => <div key={c.id}>{c.name}</div>);
}
```

---

## تفاوت با گزینه‌های مشابه

| | Recoil | Jotai | Context |
|---|--------|-------|---------|
| مدل | atom/selector | atom | Provider/value |
| Provider | `RecoilRoot` لازم | اختیاری | لازم |
| نگهداری | Meta — کند | فعال | built-in React |
| پروژه جدید | توصیه نمی‌شود | بله | برای موارد ساده |

---

## مثال واقعی در پروژه

فیلتر کابین با `searchState` + `filteredCabinsState` — همان الگوی Jotai با API متفاوت.

---

## 🚀 Best Practices

✅ `key` یکتا برای هر atom/selector  
✅ `useRecoilValue` وقتی فقط می‌خوانید (کمتر `re-render`)  
✅ پروژه جدید → Jotai را در نظر بگیرید  
❌ Recoil برای `server state` سنگین — React Query

---

## ⚠️ اشتباهات رایج

❌ شروع پروژه جدید با Recoil بدون بررسی Jotai  
❌ duplicate داده بین atom و React Query  
❌ selector با side effect

---

## ارتباط با مفاهیم دیگر

- [State-Types](./State-Types.md) — `Derived` / `Global`
- [Jotai](./Jotai.md) — جایگزین مدرن‌تر
- [React Query](./React-Query.md) — `server state`
- [Zustand](./Zustand.md) — store ساده‌تر

---

## خلاصه

در Recoil، `atoms` + `selectors` — برای یادگیری مفید؛ برای production جدید معمولاً Jotai/Zustand + React Query.

---

## 📚 منابع

- [Recoil Documentation](https://recoiljs.org)
