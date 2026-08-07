# Reconciliation — همگام‌سازی درخت React

> فرآیندی که React با آن درخت JSX جدید را با درخت قبلی مقایسه می‌کند و حداقل تغییرات لازم برای DOM را تعیین می‌کند.

> 🧭 پیش‌نیاز: [Re-render](./Re-render.md) · بعدی: [Diffing Algorithm](./Diffing-Algorithm.md)

---

## 📖 مفهوم

همگام‌سازی (`Reconciliation`) هسته `Render Phase` است: React خروجی تازه کامپوننت‌ها را با نسخه قبلی مقایسه می‌کند و تصمیم می‌گیرد کدام nodeها به‌روز، جابه‌جا، unmount یا mount شوند. در پیاده‌سازی مدرن، این کار روی ساختار `Fiber` انجام می‌شود — واحدهای کاری قابل قطع و اولویت‌بندی.

---

## چرا این ویژگی وجود دارد؟

دستکاری DOM برای هر تغییر گران است. به‌جای بازسازی کل UI، موتور رندر فقط تفاوت‌ها را اعمال می‌کند — بر اساس مقایسه دو درخت `React Element`.

---

## چه مشکلی را حل می‌کند؟

- UI `declarative`: شما کل درخت را توصیف می‌کنید؛ React تفاوت را محاسبه می‌کند
- `Batching`: چند آپدیت → یک reconciliation
- حفظ یا ریست `state` بر اساس موقعیت و `type`/`key` در درخت

---

## ⚙️ نحوه کار

```
کامپوننت‌ها اجرا می‌شوند → React Elements (درخت جدید)
    ↓
مقایسه با درخت قبلی (Fiber)
    ↓
علامت‌گذاری: update | placement | deletion
    ↓
Commit Phase: اعمال به DOM
```

### قوانین سطح بالا

| شرط | نتیجه |
|-----|--------|
| `type` یکسان (مثلاً هر دو `div`) | همان instance؛ فقط `props` به‌روز |
| `type` متفاوت (مثلاً `div` → `span`) | unmount قدیم + mount جدید → **ریست `state`** |
| موقعیت در درخت عوض شد | ممکن است `state` حفظ یا ریست شود — به `key` بستگی دارد |
| لیست فرزندان | `key` برای تطبیق صحیح آیتم‌ها |

جزئیات الگوریتم: [Diffing-Algorithm.md](./Diffing-Algorithm.md)

---

## 💡 مثال — همان `type`، `props` جدید

```jsx
// رندر اول
<UserCard name="Ali" active={false} />

// رندر دوم — type همان UserCard است
<UserCard name="Sara" active={true} />
```

در این حالت همان instanceی `UserCard` حفظ می‌شود؛ فقط `props` عوض می‌شود. `state` داخلی (مثلاً `hover`) حفظ می‌شود.

---

## 💡 مثال — `type` عوض شد

```jsx
{isEditing ? <input value={text} /> : <p>{text}</p>}
```

سوئیچ بین `input` و `p` → دو `type` متفاوت → unmount یکی، mount دیگری. `state` داخلی هر کدام جدا است.

---

## مثال واقعی در پروژه

**تب‌های پروفایل (Wild Oasis / react.dev):** وقتی محتوای تب عوض می‌شود ولی کامپوننت در **همان موقعیت** با **همان `type`** بماند، `state` داخلی (مثلاً تعداد لایک، باز/بسته بودن متن) حفظ می‌شود. اگر `type` یا `key` عوض شود، `state` ریست می‌شود — [Diffing-Algorithm.md](./Diffing-Algorithm.md).

---

## `Fiber` و Concurrent

در React 18+، هر واحد کار (`Fiber`) می‌تواند:

- `interrupt` شود (کار با اولویت بالاتر)
- دوباره از سر گرفته شود
- چند نسخه درخت موقت نگه داشته شود (`useTransition`)

جزئیات: [Concurrent-Features.md](../Escape-Hatches/Concurrent-Features.md)

---

## ⚠️ اشتباهات رایج

- فکر کردن reconciliation همیشه DOM را عوض می‌کند
- جابه‌جایی شرطی کامپوننت‌ها بدون فهم ریست `state`
- نادیده گرفتن `key` در لیست‌ها → reconciliation اشتباه

---

## 🚀 Best Practices

- ساختار درخت را پایدار نگه دارید؛ `type` را بی‌دلیل عوض نکنید
- برای لیست‌ها `key` پایدار → [Keys-And-Performance.md](./Keys-And-Performance.md)
- برای حفظ/ریست عمدی `state` از `key` استفاده کنید → [Preserving State](https://react.dev/learn/preserving-and-resetting-state)

---

## ارتباط با مفاهیم دیگر

- [Virtual-DOM.md](./Virtual-DOM.md) — درخت مجازی
- [Render-Cycle.md](./Render-Cycle.md) — reconciliation در Render Phase
- [Re-render.md](./Re-render.md) — چه زمانی درخت جدید ساخته می‌شود
- [Diffing-Algorithm.md](./Diffing-Algorithm.md) — قوانین diff
- [State.md](../State.md) — `state` به موقعیت درخت وابسته است

---

## خلاصه

همگام‌سازی (`reconciliation`) مقایسه درخت JSX جدید با قبلی است. `type` یکسان → به‌روز `props`؛ `type` متفاوت → mount/unmount و ریست `state`. ساختار `Fiber` امکان رندر concurrent را می‌دهد.

---

## 📚 منابع

- [React — Render and Commit](https://react.dev/learn/render-and-commit)
- [React — Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
- [React — Understanding UI as a Tree](https://react.dev/learn/understanding-your-ui-as-a-tree)
