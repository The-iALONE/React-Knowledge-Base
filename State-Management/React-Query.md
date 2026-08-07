# React Query (TanStack Query)

> 🧭 پیش‌نیاز: [State-Types](./State-Types.md) · [Effects](../Effects.md) · بعدی: [React Hook Form](./React-Hook-Form.md)

---

## 📖 مفهوم

برای مدیریت **server state** / **remote state** از TanStack Query (معروف به React Query) استفاده می‌شود: `fetch`، `cache`، `stale`، `refetch`، `mutation`، و `optimistic update`. برخلاف Redux، مالک داده سرور است — کلاینت فقط کپی همگام‌شده نگه می‌دارد.

---

## چرا این ویژگی وجود دارد؟

الگوی `useEffect` + `useState` + `useState(loading)` + `useState(error)` برای هر endpoint تکراری، پرخطا و بدون `cache` است. React Query این را استاندارد می‌کند.

---

## چه مشکلی را حل می‌کند؟

- `cache` و جلوگیری از `fetch` تکراری
- `stale-while-revalidate` — نمایش دادهٔ قدیمی تا رسیدن تازه
- `mutation` + `invalidateQueries` بعد از create/update/delete
- `optimistic update` برای UX بهتر

---

## ⚙️ نحوه کار

### نصب و setup (جزوه)

```bash
npm i @tanstack/react-query
npm i @tanstack/react-query-devtools  # اختیاری
```

```jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // ۱ دقیقه تا stale شدن
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <AppRoutes />
    </QueryClientProvider>
  );
}
```

برای `staleTime`: چند وقت داده در `cache` معتبر بماند قبل از `refetch` پس‌زمینه.

### useQuery — خواندن

```jsx
import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../services/apiCabins";

export function useCabins() {
  const { isLoading, data: cabins, error } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });

  return { isLoading, error, cabins };
}

function CabinTable() {
  const { isLoading, error, cabins } = useCabins();
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return cabins.map((c) => <CabinRow key={c.id} cabin={c} />);
}
```

### useMutation — نوشتن

```jsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCabin as deleteCabinApi } from "../services/apiCabins";

export function useDeleteCabin() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteCabin } = useMutation({
    mutationFn: deleteCabinApi,
    onSuccess: () => {
      toast.success("Cabin successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteCabin };
}
```

با `invalidateQueries` لیست کابین دوباره `fetch` می‌شود.

### custom hooks per operation (جزوه)

| Hook | عملیات |
|------|--------|
| `useCabins` | لیست |
| `useCreateCabin` | ایجاد |
| `useEditCabin` | ویرایش |
| `useDeleteCabin` | حذف |
| `useDuplicateCabin` | کپی |

هر mutation در hook جدا — کامپوننت UI تمیز می‌ماند.

---

## تفاوت با گزینه‌های مشابه

| | React Query | useEffect+useState | Redux | RTK Query |
|---|-------------|-------------------|-------|-----------|
| Cache | بله | خیر | دستی | بله |
| DevTools | React Query | ندارد | Redux | Redux |
| Server state | تخصصی | ضعیف | anti-pattern | بله |
| Client state | خیر | بله | بله | محدود |

**SWR**: مشابه React Query — API ساده‌تر، اکوسیستم کوچک‌تر. هر دو برای `remote state` مناسب‌اند.

---

## مثال واقعی در پروژه

**use-cabins / Wild Oasis**: CRUD کامل کابین، toast، آپلود تصویر Supabase، تنظیمات اپ — همه با React Query + custom hooks.

---

## 🚀 Best Practices

✅ `queryKey` معنادار: `["cabins"]`، `["cabin", id]`  
✅ logic در `services/api*.js`، hook در `features/*/use*.js`  
✅ `invalidateQueries` بعد از mutation  
✅ toast در `onSuccess` / `onError`  
❌ قرار دادن پاسخ API در Redux  
❌ `fetch` خام در هر کامپوننت

---

## ⚠️ اشتباهات رایج

❌ `queryKey` بدون ساختار — invalidate اشتباه  
❌ فراموش کردن `invalidate` بعد از create/update  
❌ React Query برای `UI state` محلی (`modal open`)

---

## ارتباط با مفاهیم دیگر

- [State-Types](./State-Types.md) — `Remote` / `Server` / `Cache state`
- [Redux Toolkit](./Redux-Toolkit.md) — RTK Query جایگزین
- [React Hook Form](./React-Hook-Form.md) — فرم + mutation
- [Hooks/useOptimistic](../Hooks/useOptimistic.md) — UI خوش‌بینانه

---

## خلاصه

در React Query، `server state` با `cache`، `mutation`، و DevTools — جایگزین `useEffect`+`fetch` برای API.

---

## 📚 منابع

- [TanStack Query](https://tanstack.com/query)
- جزوه: راه‌اندازی React Query، custom hooks، toast، CRUD کابین
- [Examples/state-management/useCabinsQuery.jsx](../Examples/state-management/useCabinsQuery.jsx)
