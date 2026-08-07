# State in URL

> 🧭 پیش‌نیاز: [Navigation](./Navigation.md) · [State-Types — URL State](../State-Management/State-Types.md) · بعدی: [Styling — نمای کلی](../Styling/README.md)

---

## 📖 مفهوم

مدیریت `state` در URL — path، query string (`?key=value`)، یا گاهی `location.state` — تا داده بین بخش‌های اپ قابل اشتراک، bookmark، و refresh باشد. در React Router اصلی‌ترین ابزار `useSearchParams` است.

فیلتر «فقط کابین‌های تخفیف‌دار» اگر فقط در `useState` باشد، با refresh از بین می‌رود؛ در `?discount=with-discount` می‌ماند و لینک را می‌توان فرستاد.

---

## چرا این ویژگی وجود دارد؟

آدرس مرورگر (`URL`) منبع حقیقت قابل اشتراک است. برای فیلتر، مرتب‌سازی، صفحه‌بندی، و مختصات نقشه (Worldwise) مناسب‌تر از `state` محلی یا Context است.

---

## چه مشکلی را حل می‌کند؟

- share لینک با همان فیلتر/مرتب‌سازی
- حفظ state بعد از refresh
- همگام‌سازی UI با آدرس مرورگر
- back/forward مرورگر فیلتر را عوض می‌کند

---

## ⚙️ نحوه کار

### Query string در Link

```jsx
<Link to={`${cityId}?lat=${position.lat}&lng=${position.lng}`}>
  {cityName}
</Link>
```

چند پارامتر با `&`:

```jsx
to={`/cabins?discount=all&sortBy=price-asc`}
```

### خواندن — useSearchParams

```jsx
import { useSearchParams } from "react-router-dom";

function MapView() {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  // ...
}
```

### نوشتن / به‌روزرسانی

```jsx
const [searchParams, setSearchParams] = useSearchParams();

<button onClick={() => setSearchParams({ lat: 23, lng: 50 })}>
  Set position
</button>
```

`setSearchParams` کل query را با object جدید جایگزین می‌کند — `state` در همه جا (و URL) به‌روز می‌شود.

برای حفظ پارامترهای دیگر:

```jsx
setSearchParams((prev) => {
  prev.set("sortBy", "price-desc");
  return prev;
});
```

### Custom Hook — useUrlPosition (جزوه Worldwise)

```jsx
// hooks/useUrlPosition.js
import { useSearchParams } from "react-router-dom";

export function useUrlPosition() {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  return lat && lng ? [+lat, +lng] : null;
}
```

```jsx
const position = useUrlPosition(); // [lat, lng] یا null
```

### فیلتر و مرتب‌سازی — Wild Oasis

```jsx
// features/cabins/CabinTable.jsx
import { useSearchParams } from "react-router-dom";
import { useCabins } from "./useCabins";

function CabinTable() {
  const { isLoading, cabins } = useCabins();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  const filterValue = searchParams.get("discount") || "all";
  let filteredCabins = cabins;
  if (filterValue === "no-discount")
    filteredCabins = cabins.filter((c) => c.discount === 0);
  if (filterValue === "with-discount")
    filteredCabins = cabins.filter((c) => c.discount > 0);

  const sortBy = searchParams.get("sortBy") || "startDate-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  const sortedCabins = [...filteredCabins].sort(
    (a, b) => (a[field] - b[field]) * modifier
  );

  return <Table data={sortedCabins} />;
}
```

منوی فیلتر `setSearchParams` می‌زند — URL و جدول همگام می‌مانند.

### location.state (غیر-shareable)

```jsx
import { useLocation, useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate("/checkout", { state: { cartId: 5 } });

const location = useLocation();
location.state?.cartId;
```

با refresh یا paste URL خالی می‌شود — فقط برای داده موقت transit.

---

## تفاوت با گزینه‌های مشابه

| محل state | share | refresh | مثال |
|-----------|-------|---------|------|
| `useState` | ❌ | ❌ | باز بودن مودال |
| `useSearchParams` | ✅ | ✅ | `?sortBy=price` |
| `:pathParam` | ✅ | ✅ | `/cities/42` |
| `location.state` | ❌ | ❌ | داده transit بعد از form |
| Context / Redux | ❌ | بستگی | theme، cart |

جزئیات taxonomy: [State-Types](../State-Management/State-Types.md)

---

## مثال واقعی در پروژه

**Worldwise:** `lat`/`lng` در query برای همگام‌سازی نقشه با URL.

**Wild Oasis:** `discount` و `sortBy` در `CabinTable`.

مثال کد: [Examples/react-router/UrlSearchParams.jsx](../Examples/react-router/UrlSearchParams.jsx)

---

## 🚀 Best Practices

✅ فیلتر/صفحه‌بندی shareable → query string  
✅ شناسه entity → path param (`:id`)  
✅ hook مشترک (`useUrlPosition`) برای تکرار  
✅ default وقتی param نیست: `searchParams.get("x") || "default"`  
❌ object بزرگ در query — URL طولانی و ناامن

---

## ⚠️ اشتباهات رایج

❌ فقط `useState` برای فیلتری که کاربر انتظار لینک دارد  
❌ فراموش کردن parse عدد (`+lat`)  
❌ `setSearchParams` بدون حفظ paramهای دیگر — فیلتر یکی بقیه را پاک می‌کند  
❌ قاطی کردن `sortBy` string parsing با فرمت ثابت document نکرده

---

## ارتباط با مفاهیم دیگر

- [State-Types — URL State](../State-Management/State-Types.md)
- [Sharing State](../Sharing-State.md)
- [Dynamic Routes](./Dynamic-Routes.md) — path vs query
- [Navigation](./Navigation.md) — `navigate` با query
- [Performance/State-Colocation](../Performance/State-Colocation.md) — چه چیزی در URL نرود
- [Nextjs/Routing-And-Pages](../Nextjs/Routing-And-Pages.md) — `searchParams` در Server Component (M10)

---

## خلاصه

برای state shareable از URL استفاده کن: `useSearchParams` برای query؛ `:param` برای ID؛ `location.state` فقط موقت؛ Wild Oasis و Worldwise الگوی عملی دوره.

---

## 📚 منابع

- [useSearchParams](https://reactrouter.com/en/main/hooks/use-search-params)
- [Search Params](https://reactrouter.com/en/main/start/tutorial#client-side-routing)
- [Managing State — react.dev](https://react.dev/learn/sharing-state-between-components)
