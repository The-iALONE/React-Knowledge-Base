# Profiling — پروفایل عملکرد

> اندازه‌گیری قبل از بهینه‌سازی — با React DevTools Profiler و API `<Profiler>`.

---

## 📖 مفهوم

پروفایل (`Profiling`) یعنی ثبت زمان و تعداد `render`/`commit` کامپوننت‌ها تا بفهمیم کجا UI کند است. اصل طلایی Performance: **اول اندازه بگیر، بعد بهینه کن** — بدون داده، `memo` و `useMemo` اغلب پیچیدگی اضافه می‌کنند بدون سود.

---

## چرا این ویژگی وجود دارد؟

حدس زدن گلوگاه اشتباه است. Profiler نشان می‌دهد کدام کامپوننت در کدام `commit` چقدر طول کشیده و آیا `memoization` کار می‌کند.

---

## چه مشکلی را حل می‌کند؟

- بهینه‌سازی زودهنگام (premature optimization)
- هدر رفتن زمان روی کامپوننت‌های ارزان
- نادیده گرفتن `commit`های پرتکرار در تعاملات granular

---

## ⚙️ نحوه کار — React DevTools Profiler

1. نصب [React Developer Tools](https://react.dev/learn/react-developer-tools)
2. تب `Profiler` در DevTools → Record
3. تعامل کاربر (کلیک، تایپ، navigation)
4. Stop → flamegraph / ranked chart

| متریک | معنی |
|-------|------|
| `Render duration` | زمان `Render Phase` |
| `Commit duration` | زمان اعمال DOM + layout |
| تعداد رندرها | چند بار کامپوننت اجرا شد |

به دنبال: کامپوننت‌های با bar بلند + رندرهای مکرر با همان `props`.

---

## API `<Profiler>` (برنامه‌نویسی)

```jsx
import { Profiler } from "react";

function onRender(id, phase, actualDuration, baseDuration) {
  console.log({ id, phase, actualDuration, baseDuration });
}

function App() {
  return (
    <Profiler id="Sidebar" onRender={onRender}>
      <Sidebar />
    </Profiler>
  );
}
```

| پارامتر | توضیح |
|---------|--------|
| `actualDuration` | زمان واقعی این subtree در این آپدیت |
| `baseDuration` | تخمین زمان بدون بهینه‌سازی (`memo`) |
| `phase` | `mount` \| `update` \| `nested-update` |

اگر `actualDuration` ≪ `baseDuration` → `memoization` مؤثر است.

**توجه:** در production build پیش‌فرض غیرفعال است؛ برای prod profiling به build مخصوص نیاز است.

---

## `Strict Mode` در development

در dev، `Strict Mode` بعضی توابع را **دوبار** صدا می‌زند تا رندر ناپاک کشف شود:

- `render` دوبار → Virtual tree دوبار
- `commit` یکبار

هنگام profiling در dev این را در نظر بگیرید؛ برای اندازه‌گیری نهایی production build بهتر است.

---

## گردش کار پیشنهادی

```
1. تکرار تعامل کند در اپ
2. Record در Profiler
3. شناسایی top 3 کامپوننت پرهزینه
4. بررسی: colocation؟ props ناپایدار؟ لیست بدون key؟
5. یک بهینه‌سازی → Record دوباره → مقایسه
```

---

## مثال واقعی در پروژه

**فیلتر کابین‌ها (Wild Oasis):** Profiler نشان می‌دهد هر keystroke در جستجو کل `CabinTable` را رندر می‌کند → راه‌حل: `state` جستجو در `SearchBar` (colocation) یا `memo` روی `CabinRow` — نه هر دو بدون نیاز.

---

## ⚠️ اشتباهات رایج

- بهینه‌سازی بدون baseline
- profiling فقط در dev با داده mock خیلی کوچک
- نادیده گرفتن `baseDuration` vs `actualDuration`
- اضافه کردن `memo` به همه چیز بعد از یک Record

---

## 🚀 Best Practices

- سناریوی واقعی کاربر را شبیه‌سازی کنید (لیست بزرگ، تایپ سریع)
- بعد از هر تغییر، دوباره measure کنید
- با React Compiler، قبل/بعد را مقایسه کنید
- Performance panel مرورگر را برای layout/paint هم ببینید

---

## ارتباط با مفاهیم دیگر

- [Memoization.md](./Memoization.md)
- [State-Colocation.md](./State-Colocation.md)
- [Re-render.md](./Re-render.md)
- [Optimization-Techniques.md](./Optimization-Techniques.md)
- [Performance/README.md](./README.md) — اصل طلایی

---

## خلاصه

ابزار اصلی تصمیم‌گیری برای بهینه‌سازی، پروفایلر (`Profiler`) است. DevTools برای تعامل؛ کامپوننت `<Profiler>` برای logging. مقایسه `actualDuration` و `baseDuration` سود `memo` را نشان می‌دهد. بدون اندازه‌گیری، بهینه نکنید.

---

## 📚 منابع

- [React — Profiler](https://react.dev/reference/react/Profiler)
- [React — React Developer Tools](https://react.dev/learn/react-developer-tools)
- [React — Render and Commit — optimizing performance](https://react.dev/learn/render-and-commit)
