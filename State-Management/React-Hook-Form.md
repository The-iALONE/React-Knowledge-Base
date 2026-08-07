# React Hook Form

> 🧭 پیش‌نیاز: [Forms](../Forms.md) · [State-Types](./State-Types.md) · بعدی: [Learning-Path — ماژول ۰۹](../Learning-Path.md#ماژول-۰۹--react-router)

---

## 📖 مفهوم

برای مدیریت **form state** از React Hook Form (RHF) استفاده می‌شود: مقادیر فیلدها، `validation`، خطاها، و ارسال — **بدون** ساخت `controlled component` برای هر `input` با `useState`. با `register` فیلدها به فرم وصل می‌شوند و RHF به‌روزرسانی‌ها را بهینه handle می‌کند.

---

## چرا این ویژگی وجود دارد؟

فرم رزرو کابین با ۶ فیلد + validation + حالت edit/create اگر با `useState` per field نوشته شود، ده‌ها خط و re-render اضافی دارد.

---

## چه مشکلی را حل می‌کند؟

- boilerplate `value`/`onChange` برای هر input
- `validation` و نمایش خطا
- ادغام با mutation (React Query) برای submit

---

## ⚙️ نحوه کار

### نصب

```bash
npm i react-hook-form
# اختیاری: npm i zod @hookform/resolvers
```

### استفاده پایه (جزوه — CreateCabinForm)

```jsx
import { useForm } from "react-hook-form";

function CreateCabinForm({ cabinToEdit = {} }) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const { errors } = formState;

  function onSubmit(data) {
    const image =
      typeof data.image === "string" ? data.image : data.image[0];
    console.log({ ...data, image });
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">Cabin name</label>
      <input id="name" {...register("name", { required: "Name is required" })} />
      {errors.name && <span>{errors.name.message}</span>}

      <label htmlFor="maxCapacity">Maximum capacity</label>
      <input
        type="number"
        id="maxCapacity"
        {...register("maxCapacity", { required: true, min: 1 })}
      />

      <button type="submit">Save</button>
    </form>
  );
}
```

### نقش توابع

| تابع | کار |
|------|-----|
| `register` | اتصال input به فرم (uncontrolled پیش‌فرض) |
| `handleSubmit` | اعتبارسنجی + فراخوانی `onSubmit` |
| `formState.errors` | خطاهای validation |
| `reset` | پاک کردن فرم بعد از موفقیت mutation |

### ادغام با React Query (جزوه)

```jsx
const { isCreating, createCabin } = useCreateCabin();

function onSubmit(data) {
  createCabin(
    { ...data, image: processImage(data.image) },
    { onSuccess: () => reset() }
  );
}
```

تابع `reset` را در `onSuccess` callback mutation صدا بزنید — از داخل hook به `reset` دسترسی مستقیم نیست.

---

## تفاوت با گزینه‌های مشابه

| | RHF | useState controlled | Formik |
|---|-----|---------------------|--------|
| re-render | کم (uncontrolled) | زیاد | متوسط |
| API | `register` | دستی | مشابه RHF |
| validation | built-in / Zod | دستی | Yup |
| توصیه | پیش‌فرض مدرن | فرم ۱–۲ فیلد | legacy |

**React 19**: `useActionState` + Server Actions برای فرم سمت سرور — مکمل RHF در Next.js.

---

## مثال واقعی در پروژه

**use-cabins**: `CreateCabinForm` — create/edit، آپلود تصویر، خطاهای فرم، اتصال به `useCreateCabin` / `useEditCabin`.

---

## 🚀 Best Practices

✅ `defaultValues` برای حالت edit  
✅ validation در `register` یا resolver (Zod)  
✅ `reset` بعد از mutation موفق  
✅ `formState.isSubmitting` برای disable دکمه  
❌ `useState` جدا برای هر فیلد در فرم بزرگ

---

## ⚠️ اشتباهات رایج

❌ فراموش کردن `handleSubmit(onSubmit)` — `onSubmit` مستقیم validation نمی‌کند  
❌ فایل input بدون `register`  
❌ قاطی کردن controlled (`value` دستی) و `register` بدون `Controller`

---

## ارتباط با مفاهیم دیگر

- [State-Types](./State-Types.md) — `Form state`
- [React Query](./React-Query.md) — submit + mutation
- [Forms](../Forms.md) — Form Actions در React 19
- [Hooks/useFormStatus](../Hooks/useFormStatus.md)

---

## خلاصه

در RHF، فرم بدون `state` دستی per field — `register` + `handleSubmit` + ادغام با React Query برای CRUD.

---

## 📚 منابع

- [React Hook Form](https://react-hook-form.com)
- جزوه: CreateCabinForm، register، handleSubmit
- [Examples/state-management/CabinForm.jsx](../Examples/state-management/CabinForm.jsx)
