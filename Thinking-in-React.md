# Thinking in React

> 🧭 پیش‌نیاز: [Quick Start](./Quick-Start.md) · بعدی: [Installation](./Installation.md)

روش طراحی UI با تفکر `component-based`.

---

## 📖 مفهوم

با شکستن UI به کامپوننت‌های سلسله‌مراتبی در React، `state` را تعریف کنید و جریان داده را مشخص کنید. این روش پنج گام دارد که در [react.dev — Thinking in React](https://react.dev/learn/thinking-in-react) با مثال فیلتر محصول توضیح داده شده است.

هدف: قبل از کدنویسی، **درخت کامپوننت** و **کمینهٔ `state`** را روی کاغذ (یا mockup) مشخص کنید.

---

## چرا این ویژگی وجود دارد؟

طراحی بدون ساختار منجر به `spaghetti code` می‌شود — `state` پراکنده، `prop`های غیرضروری، و باگ همگام‌سازی بین `sibling`ها.

---

## چه مشکلی را حل می‌کند؟

سازماندهی UI پیچیده به قطعات قابل تست و استفاده مجدد.

---

## ⚙️ نحوه کار — پنج گام

### ۱. UI را به کامپوننت بشکنید

از mockup شروع کنید — مثلاً جدول محصول با جستجو. هر بخش مستقل (`SearchBar`، `ProductTable`، `ProductRow`) یک کامپوننت.

### ۲. نسخه استاتیک با `props` بسازید

بدون `state` — فقط ساختار و دادهٔ ساختگی. اگر کامپوننت زیادی `props` می‌گیرد، شاید باید کوچک‌تر شود.

### ۳. `state` کمینه را شناسایی کنید

بپرسید: چه چیزی **با زمان عوض می‌شود**؟ آن‌ها کاندید `state` هستند. اگر از `props` قابل محاسبه است → `state` نیست.

### ۴. `state` را `colocate` کنید

`state` را در **نزدیک‌ترین والد مشترک** بگذارید که به آن نیاز دارد — پایهٔ [Lifting State Up](./Lifting-State-Up.md).

### ۵. `inverse data flow`

رویدادها از فرزند به والد با `callback` (`onChange`) — والد مالک `state` می‌ماند.

**مثال ذهنی — فیلتر محصول:**

```
ریشه App — state: filterText, inStockOnly
├── SearchBar — props: filterText, onFilterChange
└── ProductTable — props: products, filterText, inStockOnly
    └── ProductRow — props: product
```

---

## مثال واقعی در پروژه

**داشبورد رزرو کابین (Wild Oasis):** `CabinList` → `CabinItem` → `ReservationForm`. `state` رزرو در URL یا Context؛ لیست کابین از React Query — هر نوع داده ابزار مناسب خودش را دارد ([State-Types](./State-Management/State-Types.md)).

---

## 🚀 Best Practices

- کامپوننت‌های کوچک و تک‌مسئولیتی
- `state` را پایین‌ترین سطح ممکن نگه دارید
- از تکرار `state` در `sibling`ها پرهیز کنید

---

## ⚠️ اشتباهات رایج

- ❌ شروع از جزئیات CSS قبل از درخت کامپوننت
- ❌ قرار دادن همه‌چیز در `state` سراسری از روز اول
- ❌ نادیده گرفتن دادهٔ «قابل محاسبه» و ذخیرهٔ تکراری آن در `state`

---

## ارتباط با مفاهیم دیگر

- [Components](./Components.md)
- [State](./State.md)
- [Lifting State Up](./Lifting-State-Up.md)
- [Sharing State](./Sharing-State.md)

---

## خلاصه

درخت کامپوننت + `state` کمینه + یک‌طرفه `data flow` = UI قابل نگهداری. پنج گام react.dev را برای هر صفحه جدید تکرار کنید.

---

## 📚 منابع

- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [React Documentation](https://react.dev)
