# Dynamic Routes

> 🧭 پیش‌نیاز: [Nested Routes](./Nested-Routes.md) · بعدی: [Navigation](./Navigation.md)

---

## 📖 مفهوم

مسیرهای پویا با **segment پارامتری** در URL — مثل `/cities/:cityId` — تا یک کامپوننت برای همه شناسه‌ها استفاده شود. مقدار segment با `useParams` خوانده می‌شود.

سه مرحله جزوه: (۱) تعریف `Route` با `:name`، (۲) `Link` به آن مسیر، (۳) خواندن پارامتر در کامپوننت مقصد.

---

## چرا این ویژگی وجود دارد؟

برای هزار شهر نمی‌توان هزار `Route` نوشت. یک الگو (`:id`) و داده از URL یا API می‌آید.

---

## چه مشکلی را حل می‌کند؟

- جزئیات entity از روی ID در URL (`/products/42`)
- لینک shareable به یک آیتم خاص
- RESTful URL در SPA

---

## ⚙️ نحوه کار

### ۱. تعریف Route

```jsx
<Route path="cities">
  <Route path=":cityId" element={<City />} />
</Route>
```

نام بعد از `:` همان کلیدی است که در `useParams` می‌گیرید — `:cityId` → `{ cityId: "73930358" }`. اگر `:id` بنویسید، کلید `id` است.

### ۲. لینک به مسیر — نسبی vs مطلق

**نسبی (درست در nested):** فقط شناسه را بدهید تا به انتهای URL فعلی اضافه شود.

```jsx
// در لیست شهرها — URL فعلی مثلاً /app/countries/ir/cities
<Link to={`${id}`}>  {/* → /app/countries/ir/cities/73930358 */}
  {cityName}
</Link>
```

**مطلق (اشتباه رایج):** اسلش اول → از root شروع می‌کند.

```jsx
<Link to={`/${id}`}>  {/* → /73930358 — نه آنچه می‌خواهید! */}
```

این تفاوت در جزوه Worldwise تأکید شده: در قالب nested، `to={id}` کافی است.

برای مسیر از root:

```jsx
<Link to={`/products/${productId}`}>Product</Link>
```

### ۳. خواندن با useParams

```jsx
// pages/City.jsx
import { useParams } from "react-router-dom";

export default function City() {
  const { cityId } = useParams();

  // cityId رشته است — برای عدد: Number(cityId)
  return <h1>City #{cityId}</h1>;
}
```

```jsx
const params = useParams(); // { cityId: "73930358" }
```

### چند پارامتر

```jsx
<Route path="countries/:countryCode/cities/:cityId" element={<City />} />

const { countryCode, cityId } = useParams();
```

### Optional و splat

```jsx
<Route path="files/*" element={<Files />} />
// useParams().["*"] — بقیه مسیر
```

---

## تفاوت با گزینه‌های مشابه

| روش | کی |
|-----|-----|
| `:param` در path | شناسه entity در URL |
| `?query` | فیلتر/مرتب‌سازی — [State-In-URL](./State-In-URL.md) |
| `location.state` | داده موقت غیر-shareable — [Navigation](./Navigation.md) |

---

## مثال واقعی در پروژه

**Worldwise:** `CityList` → `Link to={id}` → `City` با `useParams` برای fetch جزئیات.

**Wild Oasis:** `/bookings/:bookingId`، `/checkin/:bookingId`.

مثال کد: [Examples/react-router/DynamicRoutes.jsx](../Examples/react-router/DynamicRoutes.jsx)

---

## 🚀 Best Practices

✅ نام پارامتر معنادار (`cityId` نه `x`)  
✅ validate وجود پارامتر قبل از fetch  
✅ در nested از `to` نسبی استفاده کنید مگر عمداً به root بروید  
❌ فرض عدد بودن بدون `Number()` یا parse

---

## ⚠️ اشتباهات رایج

❌ `to={/${id}}` در nested — می‌رود root  
❌ نام `:id` در Route و destructuring `{ cityId }` — undefined  
❌ ذخیره object بزرگ فقط در `state` وقتی URL share مهم است

---

## ارتباط با مفاهیم دیگر

- [Nested Routes](./Nested-Routes.md)
- [Navigation](./Navigation.md) — `Link`
- [State-In-URL](./State-In-URL.md) — query vs path param
- [State-Management/React-Query](../State-Management/React-Query.md) — fetch با `cityId`
- [Nextjs/Routing-And-Pages](../Nextjs/Routing-And-Pages.md) — `[id]` در App Router

---

## خلاصه

`:param` در `path` → `Link` (نسبی در nested) → `useParams()`؛ نام segment = کلید object.

---

## 📚 منابع

- [URL Params](https://reactrouter.com/en/main/route/route#dynamic-segments)
- [useParams](https://reactrouter.com/en/main/hooks/use-params)
