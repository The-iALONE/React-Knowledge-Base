# Lifting State Up — بالا بردن `state`

> وقتی دو کامپوننت باید همان داده را به‌اشتراک بگذارند، `state` را به **نزدیک‌ترین والد مشترک** منتقل کنید.

## 📖 مفهوم

بالا بردن `state` (`Lifting State Up`) یعنی `state` را از کامپوننت فرزند به والد بالاتر منتقل کنید و از طریق `props` به فرزندان پاس دهید. این الگوی اصلی اشتراک `state` بین `sibling`ها در React است.

## چرا این ویژگی وجود دارد؟

در React جریان داده **یک‌طرفه** دارد (`parent` → `child`). `sibling`ها نمی‌توانند مستقیماً `state` یکدیگر را بخوانند.

## چه مشکلی را حل می‌کند؟

- همگام‌سازی دو کامپوننت (مثلاً `input` و نمایش مقدار)
- منبع واحد حقیقت (`single source of truth`) برای داده مشترک

## ⚙️ نحوه کار

1. `state` را در والد مشترک تعریف کنید
2. مقدار را به‌عنوان `prop` به فرزند پاس دهید
3. `handler` تغییر را هم پاس دهید (`onChange`)
4. فرزند فقط `prop` را نمایش می‌دهد و `event` را به والد برمی‌گرداند

```jsx
function TemperatureInput({ temperature, scale, onTemperatureChange }) {
  return (
    <fieldset>
      <legend>Enter temperature in {scale}:</legend>
      <input
        value={temperature}
        onChange={(e) => onTemperatureChange(e.target.value)}
      />
    </fieldset>
  );
}

function Calculator() {
  const [celsius, setCelsius] = useState("");
  const [fahrenheit, setFahrenheit] = useState("");

  function handleCelsiusChange(value) {
    setCelsius(value);
    setFahrenheit(value ? ((parseFloat(value) * 9) / 5 + 32).toString() : "");
  }

  return (
    <div>
      <TemperatureInput scale="Celsius" temperature={celsius} onTemperatureChange={handleCelsiusChange} />
      <TemperatureInput scale="Fahrenheit" temperature={fahrenheit} onTemperatureChange={() => {}} />
    </div>
  );
}
```

## مثال واقعی در پروژه

**داشبورد رزرو:** فیلتر تاریخ در `DateSelector` و لیست کابین‌ها در `CabinList` هر دو به `selectedDates` نیاز دارند. `state` در `ReservationPage` نگه داشته می‌شود و به هر دو پاس داده می‌شود.

## ⚠️ اشتباهات رایج

- ❌ نگه‌داشتن دو `state` جدا برای همان داده در `sibling`ها
- ❌ بالا بردن بیش از حد (`lift`) — `state` را به `root` بدون دلیل نبرید
- ❌ عبور عمیق `prop drilling` (راه‌حل: [Context](./Context.md))

## 🚀 Best Practices

- ✅ `state` را در **پایین‌ترین سطح ممکن** نگه دارید، نه همیشه بالاترین
- ✅ فقط داده و `handler` لازم را پاس دهید
- ✅ اگر بیش از ۲–۳ سطح `prop drilling` دارید، Context را بررسی کنید

## چه زمانی استفاده کنیم؟

- دو یا چند `sibling` به همان `state` نیاز دارند
- از یک فرزند به `sibling` دیگر باید `state` همگام (`sync`) شود

## چه زمانی استفاده نکنیم؟

- وقتی `state` فقط در یک کامپوننت استفاده می‌شود → همان‌جا نگه دارید
- وقتی `state` سراسری است → [Context](./Context.md) یا `state management library`

## ارتباط با مفاهیم دیگر

- [State](./State.md)
- [Props](./Props.md)
- [Sharing State](./Sharing-State.md)
- [Context](./Context.md)

## 💡 نکات مهم

- والد **مالک `state`** است؛ فرزندان `controlled` هستند
- این الگو پایه **`controlled components`** در فرم‌هاست

## 🎯 سوالات رایج مصاحبه

- تفاوت بالا بردن `state` و Context چیست؟
- چه زمانی `prop drilling` مشکل‌ساز می‌شود؟

## خلاصه

برای `state` مشترک: والد مشترک → `props` به فرزندان. ساده‌ترین راه اشتراک `state` در React.

## 📚 منابع

- [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [React Documentation](https://react.dev)
