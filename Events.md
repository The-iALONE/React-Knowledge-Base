# Events — رویدادها و `Event Delegation`

> 🧭 پیش‌نیاز: [Lists](./Lists.md) · بعدی: [Forms](./Forms.md)

> رویدادهای DOM را در React با `Synthetic Events` مدیریت کنید؛ از `Event Delegation` در `root` برای کارایی بهتر استفاده می‌شود.

## 📖 مفهوم

در React، `Events` با `camelCase` نام‌گذاری می‌شوند: `onClick`، `onChange`، `onSubmit`. به جای `addEventListener` مستقیم، `handler` را به JSX پاس می‌دهید. React در نسخه‌های مدرن `listener`ها را معمولاً روی `root container` ثبت می‌کند (`Event Delegation`) و `event` را به کامپوننت هدف `dispatch` می‌کند.

## چرا این ویژگی وجود دارد؟

- یکپارچگی با مدل `declarative`
- رفتار یکسان `cross-browser` با `Synthetic Event`
- کارایی: یک `listener` روی `root` به‌جای هزاران `listener` روی هر `node`

## چه مشکلی را حل می‌کند؟

- مدیریت پراکنده `event listener`
- تفاوت‌های مرورگر در API خام DOM
- همگام‌سازی `handler` با `lifecycle` کامپوننت

## ⚙️ نحوه کار

1. شما `onClick={handleClick}` می‌نویسید
2. در React `listener` را (اغلب `delegated`) ثبت می‌کند
3. هنگام کلیک، `Synthetic Event` ساخته و `handleClick` صدا زده می‌شود
4. `setState` در `handler` → `batching` → یک `re-render`

**تفویض رویداد (`Event Delegation`):** رویداد در فاز `bubbling` به `root` می‌رسد؛ React `target` اصلی را پیدا و `handler` مناسب را اجرا می‌کند.

## Syntax

```jsx
function Button({ onSave }) {
  function handleClick(event) {
    event.preventDefault();       // در form/submit
    event.stopPropagation();      // جلوگیری از bubble — با احتیاط
    onSave();
  }

  return <button onClick={handleClick}>ذخیره</button>;
}

// Pass handler as prop
<Button onSave={() => setCount((c) => c + 1)} />
```

**فرم:**

```jsx
<form onSubmit={(e) => {
  e.preventDefault();
  submitOrder();
}}>
```

## 💡 مثال ساده

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## مثال واقعی در پروژه

**رزرو کلبه — انتخاب تاریخ و ارسال فرم:**

```jsx
function BookingForm({ cabinId, onBooked }) {
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });

  function handleDateChange(event) {
    const { name, value } = event.target;
    setDates((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!dates.checkIn || !dates.checkOut) return;
    onBooked({ cabinId, ...dates });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="checkIn" type="date" onChange={handleDateChange} />
      <input name="checkOut" type="date" onChange={handleDateChange} />
      <button type="submit">رزرو</button>
    </form>
  );
}
```

**لیست با `stopPropagation` برای کلیک روی کارت:**

```jsx
function CityCard({ city, onSelect }) {
  return (
    <article
      onClick={() => onSelect(city.id)}
      onKeyDown={(e) => e.key === "Enter" && onSelect(city.id)}
      role="button"
      tabIndex={0}
    >
      <button
        onClick={(e) => {
          e.stopPropagation(); // فقط favorite — نه navigate
          toggleFavorite(city.id);
        }}
      >
        ★
      </button>
      <h3>{city.name}</h3>
    </article>
  );
}
```

## ⚠️ اشتباهات رایج

- `onClick={handleClick()}` به‌جای `onClick={handleClick}` — فراخوانی فوری
- فراموش کردن `preventDefault` در `submit`
- ساختن `function` جدید در `render` برای هر آیتم لیست بدون نیاز → شکستن `memo`
- تکیه بر `event pooling` (در React 17+ حذف شده — نیازی به `persist` نیست)

## 🚀 Best Practices

- `handler`های پایدار با `useCallback` فقط وقتی لازم است
- برای فرم `controlled` از `name` + یک `handleChange` استفاده کنید
- `accessibility`: `keyboard events` (`onKeyDown`) برای عناصر `clickable`
- از `stopPropagation` فقط با دلیل مشخص

## چه زمانی استفاده کنیم؟ / چه زمانی استفاده نکنیم؟

| استفاده کنیم | استفاده نکنیم |
|--------------|---------------|
| تعامل کاربر (کلیک، `input`، `submit`) | `scroll`/`resize` سنگین بدون `throttle` — شاید `ref` + `passive listener` |
| `event delegation` پیش‌فرض React | وقتی به `listener` `native` با گزینه خاص نیاز دارید (نادر) |

## ارتباط با مفاهیم دیگر

- [Forms](./Forms.md)
- [State](./State.md)
- [Rendering](./Rendering.md) — `batching` بعد از `event`
- [DOM-Manipulation](./DOM-Manipulation.md)
- [Refs](./Refs.md)

## 💡 نکات مهم

- `Synthetic Event` شبیه `native` است ولی `wrapper` است
- در React 17+ `listener`ها روی `root` رندرکننده `mount` می‌شوند، نه `document`
- چند `setState` در یک `handler` → یک `re-render` (`batching`)

## 🎯 سوالات رایج مصاحبه

1. `Event Delegation` در React چگونه کار می‌کند؟
2. تفاوت `onClick={fn}` و `onClick={fn()}`؟
3. `Synthetic Event` چیست؟
4. چرا نباید خیلی از `stopPropagation` استفاده کرد؟

## خلاصه

رویدادها در React `declarative` و `camelCase` هستند. React با `delegation` روی `root` کارایی خوبی دارد. `handler` صحیح، `preventDefault` در فرم‌ها و `batching` `state` از اصول پایه‌اند.

## 📚 منابع (react.dev)

- [Responding to Events](https://react.dev/learn/responding-to-events)
- [Adding Interactivity](https://react.dev/learn/adding-interactivity)
