# Code Splitting — تقسیم کد

> بارگذاری بخشی از JavaScript فقط وقتی لازم است — کاهش حجم `bundle` اولیه و بهبود زمان بارگذاری اول.

---

## 📖 مفهوم

تقسیم کد (`Code Splitting`) یعنی به‌جای یک فایل JS بزرگ در بار اول، کد را به chunkهای جدا تقسیم کنیم و هر chunk را با `dynamic import()` هنگام نیاز (مثلاً ورود به route یا باز کردن مودال) بارگذاری کنیم. در React معمولاً با `React.lazy` و `<Suspense>` انجام می‌شود.

---

## چرا این ویژگی وجود دارد؟

کاربر در اولین بازدید به همه featureها نیاز ندارد — پنل ادمین، تنظیمات، ویرایشگر پیشرفته می‌توانند بعداً بیایند. `bundle` کوچک‌تر = Time to Interactive بهتر.

---

## چه مشکلی را حل می‌کند؟

- `bundle` اولیه چند مگابایتی
- parse/compile JS غیرضروری در مسیرهایی که کاربر نمی‌رود
- عدم جداسازی منطقی feature در build

---

## ⚙️ نحوه کار — دو استراتژی

### Route-based splitting

هر صفحه/route یک chunk جدا — رایج‌ترین و ساده‌ترین:

```
/           → main.js + home.chunk.js
/settings   → main.js + settings.chunk.js (on navigate)
```

در React Router: `lazy(() => import('./Settings'))` برای route component.

### Component-based splitting

کامپوننت سنگین داخل یک صفحه:

```jsx
const HeavyChart = lazy(() => import("./HeavyChart"));

function Dashboard() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button onClick={() => setShow(true)}>Show chart</button>
      {show && (
        <Suspense fallback={<Spinner />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}
```

پیاده‌سازی کامل: [Lazy-Loading.md](../Escape-Hatches/Lazy-Loading.md)، [Suspense.md](../Escape-Hatches/Suspense.md)

---

## معیار انتخاب — چه چیزی را split کنیم؟

| split کنیم | split نکنیم |
|------------|-------------|
| routeهای کم‌بازدید | shell/layout اصلی |
| کتابخانه سنگین (نمودار، ویرایشگر) | کامپوننت‌های بالای fold |
| مودال/پنل نادر | `state` و routing core |
| feature ادمین | hookهای مشترک کوچک |

**قانون:** chunk زیاد هم بد است (درخواست HTTP زیاد). تعادل بین تعداد و اندازه chunk.

---

## Next.js (پیش‌نمایش M10)

در App Router، `import` در سطح فایل `page`/`layout` به‌صورت خودکار split می‌شود. `next/dynamic` برای کنترل `ssr` و `loading`. جزئیات در M10 — [Nextjs/README.md](../Nextjs/README.md).

---

## مثال واقعی در پروژه

**Wild Oasis — پنل ادمین:** مسیر `/account` جدا از صفحه اصلی رزرو. کاربر مهمان هرگز chunk ادمین را دانلود نمی‌کند.

---

## ⚠️ اشتباهات رایج

- `lazy` بدون `<Suspense>` بالاسری
- split کردن هر فایل کوچک → waterfall درخواست
- فراموش کردن `loading`/`fallback` UX
- `lazy` روی کامپوننتی که همیشه نمایش داده می‌شود

---

## 🚀 Best Practices

- از route splitting شروع کنید
- `fallback` معنادار (اسکلتون، نه فقط «Loading...»)
- با DevTools Network اندازه chunkها را ببینید
- prefetch برای routeهای محتمل (React Router / Next.js)

---

## ارتباط با مفاهیم دیگر

- [Escape-Hatches/Lazy-Loading.md](../Escape-Hatches/Lazy-Loading.md)
- [Escape-Hatches/Suspense.md](../Escape-Hatches/Suspense.md)
- [Profiling.md](./Profiling.md) — اندازه bundle vs زمان رندر
- [Optimization-Techniques.md](./Optimization-Techniques.md)

---

## خلاصه

تقسیم کد (`code splitting`) bundle را به chunkهای on-demand می‌برد. اولویت با route-based است. پیاده‌سازی با `lazy`+`Suspense` در Escape Hatches؛ در M6 فقط استراتژی و معیار انتخاب پوشش داده می‌شود.

---

## 📚 منابع

- [React — lazy](https://react.dev/reference/react/lazy)
- [React — Suspense](https://react.dev/reference/react/Suspense)
- [React — Code Splitting (legacy guide concepts)](https://react.dev/learn/render-and-commit)
