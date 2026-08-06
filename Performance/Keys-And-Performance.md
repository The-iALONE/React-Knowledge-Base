# Keys & Performance — کلید و عملکرد

> در لیست‌های JSX، `key` به React می‌گوید کدام آیتم همان instance قبلی است — روی حفظ `state`، صحت `reconciliation` و هزینه `diff` اثر مستقیم دارد.

---

## 📖 مفهوم

در لیست‌های JSX، `key` یک شناسه پایدار بین رندرهاست. موتور رندر با `key` (همراه `type`) تشخیص می‌دهد آیا باید `node` موجود را به‌روز کند، جابه‌جا کند، یا `unmount`/`mount` کند. انتخاب اشتباه `key` هم باگ `state` می‌سازد هم `reconciliation` گران.

---

## چرا این ویژگی وجود دارد؟

در لیست‌های پویا (افزودن، حذف، مرتب‌سازی)، تطبیق فقط بر اساس **ترتیب** کافی نیست. کلید (`key`) هویت هر ردیف را در طول عمر UI مشخص می‌کند.

---

## چه مشکلی را حل می‌کند؟

- جلوگیری از انتساب `state` به آیتم اشتباه بعد از `reorder`
- کاهش `unmount`/`mount` غیرضروری
- `diff` کارآمدتر در لیست‌های بزرگ

---

## ⚙️ نحوه کار

```jsx
<ul>
  {todos.map((todo) => (
    <li key={todo.id}>
      <TodoItem todo={todo} />
    </li>
  ))}
</ul>
```

| سناریو | `key={id}` | `key={index}` |
|--------|------------|---------------|
| افزودن انتهای لیست | ✅ درست | ✅ معمولاً درست |
| حذف از وسط | ✅ درست | ❌ `state` ممکن است جابه‌جا شود |
| مرتب‌سازی | ✅ درست | ❌ اغلب باگ |
| فیلتر + برگشت | ✅ درست | ⚠️ ممکن است `unmount` غیرضروری |

---

## `key` و ریست `state`

برای ریست عمدی `state` هنگام عوض شدن موجودیت:

```jsx
<ProfileForm key={userId} user={user} />
```

با تغییر `userId`، فرم از نو `mount` می‌شود — الگوی رسمی [react.dev](https://react.dev/learn/preserving-and-resetting-state).

برای **حفظ** `state` در همان موقعیت با `type` یکسان، مقدار `key` را ثابت نگه دارید یا اصلاً عوض نکنید.

---

## 💡 مثال — باگ `key={index}`

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <TodoRow key={index} todo={todo} />
      ))}
    </ul>
  );
}
```

کاربر آیتم اول را حذف می‌کند → شاخص‌ها (`index`) عوض می‌شوند → موتور رندر فکر می‌کند همان ردیف‌ها با `props` جدید هستند → `state` داخلی (مثلاً در حال ویرایش) به آیتم اشتباه می‌چسبد.

---

## تأثیر روی عملکرد

| `key` درست | `key` اشتباه |
|------------|--------------|
| به‌روز `props` روی instance موجود | `unmount` + `mount` کل `subtree` |
| انیمیشن و فوکوس پایدارتر | از دست رفتن `state` و کار DOM اضافه |
| `diff` خطی قابل پیش‌بینی | رفتار غیرمنتظره در لیست بزرگ |

در لیست ۵۰۰+ ردیف (جدول رزرو Wild Oasis)، `key={reservation.id}` تفاوت محسوسی در تعداد `node`های دست‌خورده ایجاد می‌کند.

---

## مثال واقعی در پروژه

```jsx
function ReservationTable({ reservations }) {
  return (
    <tbody>
      {reservations.map((r) => (
        <ReservationRow key={r.id} reservation={r} />
      ))}
    </tbody>
  );
}
```

با فیلتر یا صفحه‌بندی، تا وقتی `id` همان رزرو است، `state` ردیف (مثلاً منوی باز) حفظ می‌شود.

---

## ⚠️ اشتباهات رایج

- استفاده از `key={Math.random()}` — هر رندر `mount` جدید
- استفاده از `key={index}` در لیست قابل `drag`/`sort`/`filter`
- فراموش کردن `key` روی کامپوننت داخل `map`
- استفاده از `key` برای استایل یا منطق نمایشی (فقط برای هویت درخت React است)

---

## 🚀 Best Practices

- مقدار `key` از داده پایدار: `id`، `uuid`، ترکیب ثابت فیلدها
- قرار دادن `key` روی بیرونی‌ترین المنت در `map`
- برای ریست فرم/تب: `key` سطح بالاتر عوض شود
- مقدار `key` را در `props` به دست نزنید — React آن را جدا نگه می‌دارد

---

## ارتباط با مفاهیم دیگر

- [Diffing-Algorithm.md](./Diffing-Algorithm.md) — قوانین `diff` لیست
- [Reconciliation.md](./Reconciliation.md) — تطبیق `node`ها
- [Lists.md](../Lists.md) — `key` در لیست‌ها
- [Rendering Lists — react.dev](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)
- [Memoization.md](./Memoization.md) — `memo` روی ردیف‌های لیست

---

## خلاصه

کلید (`key`) هویت آیتم در لیست است. مقدار پایدار = `state` درست + `diff` ارزان. `index` فقط وقتی لیست ثابت و بدون `reorder` است. برای ریست عمدی، `key` والد را عوض کنید.

---

## 📚 منابع

- [React — Rendering Lists](https://react.dev/learn/rendering-lists)
- [React — Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
