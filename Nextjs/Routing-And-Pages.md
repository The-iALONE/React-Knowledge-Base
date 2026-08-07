# Routing and Pages

> 🧭 پیش‌نیاز: [Project Setup](./Project-Setup.md) · بعدی: [Layouts](./Layouts.md)

مسیریابی فایل‌محور در App Router: صفحات، segmentهای داینامیک و `route` groups.

---

## 📖 مفهوم

در App Router هر `route` از ساختار پوشه در `app/` ساخته می‌شود. فایل `page.tsx` UI عمومی آن segment را export می‌کند و URL را تعریف می‌کند.

---

## چرا این ویژگی وجود دارد؟

هم‌راستایی ساختار فایل با URL؛ کاهش config جداگانه (مثل `react-router`).

---

## چه مشکلی را حل می‌کند؟

- تعریف `route`های nested و dynamic
- colocation فایل‌های مرتبط (`page`، `loading`، `error`)
- code splitting خودکار per `route`

---

## ⚙️ نحوه کار

| فایل | نقش |
|------|-----|
| `page.tsx` | UI `route` — **اجباری** برای دسترسی عمومی |
| `layout.tsx` | UI مشترک بین child `route`ها |
| `route.ts` | API endpoint (Route Handler) |
| `loading.tsx` | Suspense fallback |
| `error.tsx` | Error boundary |
| `not-found.tsx` | 404 آن segment |

---

## چه زمانی استفاده کنیم؟

هر صفحه قابل دسترسی از URL (لیست کابین، جزئیات، حساب کاربری).

---

## چه زمانی استفاده نکنیم؟

کامپوننت‌های داخلی بدون URL — در `components/` بگذارید، نه `app/`.

---

## Syntax — Static Routes

```
app/
├── page.tsx              → /
├── about/
│   └── page.tsx          → /about
└── cabins/
    └── page.tsx          → /cabins
```

```tsx
// app/cabins/page.tsx
export default function CabinsPage() {
  return <h1>All Cabins</h1>;
}
```

---

## Dynamic Routes

```
app/cabins/[cabinId]/page.tsx  → /cabins/42
```

```tsx
// app/cabins/[cabinId]/page.tsx
type Props = {
  params: Promise<{ cabinId: string }>;
};

export default async function CabinPage({ params }: Props) {
  const { cabinId } = await params;
  return <h1>Cabin {cabinId}</h1>;
}
```

> در Next.js 15+ `params` و `searchParams` `Promise` هستند و باید `await` شوند.

---

## Catch-all و Optional Catch-all

```
app/docs/[...slug]/page.tsx     → /docs/a/b/c
app/shop/[[...slug]]/page.tsx   → /shop یا /shop/category/item
```

---

## Route Groups (بدون تأثیر روی URL)

```
app/
├── (marketing)/
│   ├── about/page.tsx    → /about
│   └── pricing/page.tsx  → /pricing
└── (shop)/
    └── cabins/page.tsx   → /cabins
```

پرانتز نام گروه را از URL حذف می‌کند؛ برای layoutهای متفاوت مفید است.

---

## searchParams

```tsx
// app/cabins/page.tsx
type Props = {
  searchParams: Promise<{ sort?: string }>;
};

export default async function CabinsPage({ searchParams }: Props) {
  const { sort } = await searchParams;
  return <p>Sort: {sort ?? "default"}</p>;
}
```

---

## 💡 مثال ساده

```tsx
// app/account/reservations/page.tsx
export default function ReservationsPage() {
  return <p>Your reservations</p>;
}
// URL: /account/reservations
```

---

## مثال واقعی در پروژه

در پروژهٔ Wild Oasis:
- `/cabins` — لیست با فیلتر `?sort=price`
- `/cabins/[cabinId]` — جزئیات + فرم رزرو
- `/account` — داشبورد کاربر لاگین‌شده
- `/about` و `/cabins` ممکن است در `route` group `(marketing)` باشند

---

## 🚀 Best Practices

✅ نام پوشه را کوتاه و معنادار نگه دارید  
✅ dynamic segment را با `[id]` یکسان نام‌گذاری کنید  
✅ `generateStaticParams` برای SSG مسیرهای شناخته‌شده  
✅ `not-found.tsx` در segmentهای مهم (مثلاً `[cabinId]`)  

---

## ⚠️ اشتباهات رایج

❌ فراموش کردن `page.tsx` — پوشه بدون `page` عمومی نیست  
❌ استفاده از `useParams` در Server Component — از `params` prop استفاده کنید  
❌ فراموش کردن `await params` در Next.js 15+  
❌ نام‌گذاری ناسازگار dynamic segment (`[id]` در یک جا، `[cabinId]` در جای دیگر)  
❌ قرار دادن کامپوننت‌های بدون URL داخل `app/` — به `components/` منتقل کنید

---

## ارتباط با مفاهیم دیگر

- [Layouts](./Layouts.md)
- [Navigation](./Navigation.md)
- [Loading-And-Error-States](./Loading-And-Error-States.md)
- [Data-Fetching-And-Caching](./Data-Fetching-And-Caching.md)
- [React Router — Dynamic Routes](../React-Router/Dynamic-Routes.md)

---

## خلاصه

پوشه `app/` + `page.tsx` یعنی `route`؛ `[param]` برای dynamic؛ `(group)` برای سازماندهی بدون تغییر URL.

---

## 📚 منابع

- [Defining Routes](https://nextjs.org/docs/app/building-your-application/routing/defining-routes)
- [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
