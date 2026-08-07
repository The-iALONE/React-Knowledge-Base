# Components

> 🧭 پیش‌نیاز: [JSX](./JSX.md) · بعدی: [Props](./Props.md)

ساختن و استفاده از کامپوننت‌های React.

---

## 📖 مفهوم

کامپوننت تابعی (`function component`) واحد سازماندهی UI است. هر کامپوننت تابعی با نام `CapitalCase` JSX برمی‌گرداند. کامپوننت‌ها را می‌توان در هم توده کرد (`composition`) — مثل تگ‌های HTML که داخل هم قرار می‌گیرند.

---

## چرا این ویژگی وجود دارد؟

تقسیم UI به قطعات قابل استفاده مجدد — هر قطعه یک مسئولیت مشخص (`single responsibility`).

---

## چه مشکلی را حل می‌کند؟

کد تکراری و غیرقابل نگهداری در اپ‌های بزرگ.

---

## ⚙️ نحوه کار

کامپوننت = تابع با نام `CapitalCase` که JSX `return` می‌کند.

- **تعریف:** `function Button() { return <button />; }`
- **استفاده:** `<Button />` — React تابع را صدا می‌زند
- **`children`:** محتوای بین تگ باز و بسته — `<Card><p>متن</p></Card>`
- **خروجی:** فقط JSX (یا `null`) — نه `mutate` DOM در `render`
- **خلوص:** کامپوننت `pure` با همان `props`/`state` همان خروجی را می‌دهد ([Keeping Components Pure](https://react.dev/learn/keeping-components-pure))

```jsx
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}

function Card({ title, children }) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
```

---

## Syntax

```jsx
// export برای استفاده در فایل دیگر
export default function Sidebar() {
  return <aside>...</aside>;
}

// import
import Sidebar from "./Sidebar";
```

---

## مثال واقعی در پروژه

در پروژه worldwise، کامپوننت‌هایی مثل `CityItem`، `Sidebar` و `Map` هر کدام یک مسئولیت دارند — لیست شهر، ناوبری، نقشه.

---

## ⚠️ اشتباهات رایج

- ❌ نام با حرف کوچک (`function button`) — React آن را تگ HTML می‌بیند
- ❌ `mutate` کردن `props` یا متغیر بیرونی در `render`
- ❌ کامپوننت غول‌پیکر با ده‌ها مسئولیت

---

## 🚀 Best Practices

- یک فایل = یک کامپوننت اصلی (با زیرکامپوننت‌های کوچک در همان فایل اگر فقط محلی‌اند)
- `destructuring` `props` در signature
- وقتی منطق سنگین شد، `custom hook` استخراج کنید

---

## ارتباط با مفاهیم دیگر

- [Props](./Props.md)
- [State](./State.md)
- [Custom Hooks](./Custom-Hooks.md)

---

## خلاصه

کامپوننت = تابع UI قابل ترکیب با نام `CapitalCase`. `children` و `composition` پایهٔ طراحی React هستند.

---

## 📚 منابع

- [Your First Component](https://react.dev/learn/your-first-component)
- [Importing and Exporting Components](https://react.dev/learn/importing-and-exporting-components)
