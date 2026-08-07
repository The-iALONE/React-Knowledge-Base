# انواع State — Taxonomy کامل

> 🧭 پیش‌نیاز: [State](../State.md) · [Sharing State](../Sharing-State.md) · بعدی: [State Management — نمای کلی](./README.md)

---

## 📖 مفهوم

قبل از انتخاب ابزار، باید بدانیم **چه نوع داده‌ای** داریم. انواع `state` در React بر اساس **منبع**، **دامنه** (محلی/سراسری) و **کاربرد** دسته‌بندی می‌شوند. این taxonomy پایهٔ تصمیم‌گیری برای `useState`، `Context`، Redux، React Query و بقیه است.

در جزوه اصلی (پروژه Redux Intro) چهار دستهٔ اصلی نام برده شده: `Global`، `Local`، `UI`، `Remote`. این فایل آن‌ها را گسترش می‌دهد تا پوشش کامل‌تری داشته باشیم.

---

## چرا این ویژگی وجود دارد؟

اشتباه رایج: همهٔ داده‌ها را در یک `global store` بریزیم، یا همهٔ `fetch`ها را با `useEffect` + `useState` مدیریت کنیم. وقتی نوع `state` را درست تشخیص دهیم، ابزار مناسب خودش مشخص می‌شود.

---

## چه مشکلی را حل می‌کند؟

- انتخاب اشتباه ابزار (`Redux` برای `toggle` ساده، یا `useState` برای دادهٔ API با `cache`)
- قاطی کردن `client state` و `server state`
- `re-render`های غیرضروری از `Context` پر از داده

---

## ⚙️ نحوه کار — ۱۱ نوع اصلی

### ۱. Local State

| | |
|---|---|
| **تعریف** | داده‌ای که فقط یک کامپوننت به آن نیاز دارد |
| **کجا** | `input`، `open/close` مودال، `hover` |
| **ابزار** | `useState`، `useReducer` |
| **تفاوت** | برخلاف `Global`، به اشتراک گذاشته نمی‌شود |

```jsx
const [isOpen, setIsOpen] = useState(false);
```

---

### ۲. Global State

| | |
|---|---|
| **تعریف** | داده‌ای که چندین بخش نامرتبط از اپ به آن نیاز دارند |
| **کجا** | سبد خرید، کاربر لاگین‌شده، تنظیمات اپ |
| **ابزار** | Redux Toolkit، Zustand، Context (برای دادهٔ کم‌تغییر) |
| **تفاوت** | دامنهٔ کل اپ؛ نه فقط یک `subtree` |

---

### ۳. UI State

| | |
|---|---|
| **تعریف** | داده‌ای که از سرور `fetch` نشده — فقط دربارهٔ خود UI است |
| **کجا** | `theme`، `sidebar collapsed`، `active tab`، `modal open` |
| **ابزار** | `useState`، `Context`، Zustand |
| **تفاوت** | برخلاف `Remote`/`Server`، منبع خارجی (API) ندارد |

> در جزوه: «`UI state` صرفاً داده‌ای در مورد خود UI است و ارتباط با API نیاز ندارد.»

---

### ۴. Remote State

| | |
|---|---|
| **تعریف** | داده‌ای که از منبع خارجی (معمولاً API) می‌آید و روی کلاینت نگه‌داری/همگام می‌شود |
| **کجا** | لیست کابین‌ها، پروفایل کاربر از API |
| **ابزار** | TanStack Query (React Query)، SWR، RTK Query |
| **تفاوت** | منبع حقیقت روی سرور است؛ کلاینت فقط کپی + `cache` دارد |

---

### ۵. Server State

| | |
|---|---|
| **تعریف** | نسخهٔ «رسمی» داده روی سرور — ممکن است با `Remote State` روی کلاینت متفاوت باشد (`stale`) |
| **کجا** | دیتابیس، Supabase، REST/GraphQL backend |
| **ابزار** | React Query (`staleTime`، `invalidate`)، RTK Query، `fetch` در Server Component |
| **تفاوت با Remote** | `Remote` = دید کلاینت؛ `Server` = منبع حقیقت. مثال: کاربر فرم را submit کرده ولی سرور هنوز پردازش نکرده — UI خوش‌بینانه (`optimistic`) vs واقعیت سرور |

---

### ۶. Client State

| | |
|---|---|
| **تعریف** | هر داده‌ای که مالکیت و منبع حقیقتش روی کلاینت است (برعکس `Server State`) |
| **کجا** | سبد خرید قبل از checkout، draft فرم، فیلترهای موقت |
| **ابزار** | `useState`، Redux، Zustand، Jotai |
| **تفاوت** | با `Server State` قاطی نشود — checkout نهایی باید به سرور برود |

---

### ۷. Derived State

| | |
|---|---|
| **تعریف** | مقداری که از `state` دیگر **محاسبه** می‌شود — خودش منبع حقیقت نیست |
| **کجا** | `filteredList` از `items` + `searchTerm`، `totalPrice` از `cart` |
| **ابزار** | محاسبه در `render`، `useMemo`، `selector` در Redux |
| **تفاوت** | ذخیرهٔ جداگانه = منبع حقیقت دوگانه و باگ `sync` |

```jsx
const filteredCabins = cabins.filter((c) =>
  c.name.toLowerCase().includes(search.toLowerCase())
);
// نیازی به useState برای filteredCabins نیست
```

---

### ۸. Form State

| | |
|---|---|
| **تعریف** | مقادیر، خطاها، `touched`، و وضعیت ارسال یک فرم |
| **کجا** | فرم ایجاد/ویرایش کابین، لاگین، رزرو |
| **ابزار** | React Hook Form، `useActionState` (React 19)، `useState` برای فرم ساده |
| **تفاوت** | منطق `validation` و `register` فیلدها — نه فقط یک `object` ساده |

---

### ۹. Navigation State

| | |
|---|---|
| **تعریف** | `state` مرتبط با مسیریابی — مسیر فعلی، history، پارامترها |
| **کجا** | `active route`، `breadcrumb` |
| **ابزار** | React Router (`useParams`، `useNavigate`)، Next.js (`useRouter`، `useSearchParams`) |
| **تفاوت** | با `URL State` هم‌پوشانی دارد؛ در SPA گاهی `location.state` جدا از query است |

---

### ۱۰. URL State

| | |
|---|---|
| **تعریف** | داده‌ای که در آدرس مرورگر ذخیره می‌شود (`path`، `query`، `hash`) |
| **کجا** | فیلتر جستجو، صفحه‌بندی، `sortBy`، `cabinId` در URL |
| **ابزار** | `useSearchParams` (React Router)، `searchParams` (Next.js App Router) |
| **تفاوت** | قابل share/bookmark؛ برخلاف `state` محلی، با refresh از بین نمی‌رود |

```jsx
// React Router
const [searchParams, setSearchParams] = useSearchParams();
const sortBy = searchParams.get("sortBy") ?? "price";
```

---

### ۱۱. Cache State

| | |
|---|---|
| **تعریف** | کپی موقت دادهٔ remote/server برای جلوگیری از `fetch` مکرر |
| **کجا** | پاسخ API کابین‌ها، تنظیمات اپ |
| **ابزار** | TanStack Query (`queryClient`، `staleTime`، `gcTime`)، RTK Query، SWR |
| **تفاوت** | `invalidate` و `refetch` جزو قرارداد است — برخلاف `useState` ساده |

---

## مقایسه سریع

| نوع | منبع حقیقت | ابزار پیشنهادی | مثال |
|-----|------------|----------------|------|
| Local | کامپوننت | `useState` | باز/بسته مودال |
| Global | کلاینت | RTK / Zustand | سبد خرید |
| UI | کلاینت | `useState` / Context | `theme` |
| Remote | API (کپی کلاینت) | React Query | لیست کابین |
| Server | سرور | React Query + API | رکورد در DB |
| Client | کلاینت | Redux / Zustand | draft سبد |
| Derived | محاسبه از دیگران | `useMemo` / selector | لیست فیلترشده |
| Form | فرم | RHF | `CreateCabinForm` |
| Navigation | Router | React Router / Next | مسیر فعلی |
| URL | مرورگر | `searchParams` | `?sort=price` |
| Cache | Query library | TanStack Query | `queryKey: ["cabins"]` |

---

## درخت تصمیم‌گیری

```
داده از API می‌آید؟
  ├─ بله → Remote/Server State → React Query یا RTK Query
  └─ خیر → فقط یک کامپوننت؟
        ├─ بله → Local/UI → useState
        └─ خیر → چند کامپوننت نزدیک؟
              ├─ بله → lift state یا Context سبک
              └─ خیر → Global پیچیده؟
                    ├─ بله → Redux Toolkit یا Zustand
                    └─ فرم؟ → React Hook Form
```

---

## 🚀 Best Practices

✅ `server state` و `client state` را جدا نگه دارید  
✅ `derived state` را در `state` جدا ذخیره نکنید  
✅ فیلتر/صفحه‌بندی را در URL بگذارید اگر share مهم است  
❌ همه چیز در Redux  
❌ `fetch` + `useEffect` برای هر endpoint بدون `cache`

---

## ⚠️ اشتباهات رایج

❌ قاطی کردن `Remote State` با `Global State` در یک reducer  
❌ `useEffect` برای sync کردن دو `state` که یکی `derived` است  
❌ `Context` برای دادهٔ پرتغیر (همه `consumer`ها `re-render` می‌شوند)

---

## ارتباط با مفاهیم دیگر

- [State](../State.md) — مفهوم پایه
- [State Management — نمای کلی](./README.md) — انتخاب ابزار
- [Performance/State-Colocation](../Performance/State-Colocation.md) — نگه‌داشتن `state` پایین
- [React-Router/State-In-URL](../Learning-Path.md#ماژول-۰۹--react-router) — URL state (M8 — در حال تکمیل)

---

## خلاصه

۱۱ نوع `state`: از `Local` تا `Cache`. اول نوع را تشخیص بده، بعد ابزار — نه برعکس.

---

## 📚 منابع

- [Choosing the State Structure — react.dev](https://react.dev/learn/choosing-the-state-structure)
- [Managing State — react.dev](https://react.dev/learn/managing-state)
- جزوه Redux Intro — taxonomy `Global` / `Local` / `UI` / `Remote`
