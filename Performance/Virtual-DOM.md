# Virtual DOM — درخت مجازی React

> در React از یک Virtual DOM — **نمایش در حافظه** از UI — برای محاسبه تغییرات لازم قبل از دستکاری DOM واقعی استفاده می‌شود.

> 🧭 پیش‌نیاز: [Performance — نمای کلی](./README.md) · بعدی: [Render Cycle](./Render-Cycle.md)

---

## 📖 مفهوم

خروجی هر کامپوننت یک `React Element` سبک و توصیفی است (مثل `{ type: 'div', props: { children: 'Hello' } }`). ساختن میلیون‌ها `element` در حافظه ارزان‌تر از دستکاری مستقیم DOM است. مجموعه این `element`ها Virtual DOM (یا `Fiber tree` در پیاده‌سازی داخلی) را می‌سازند.

---

## چرا این ویژگی وجود دارد؟

دستکاری DOM مرورگر برای خواندن/نوشتن **گران** است. با نگه‌داشتن یک مدل در حافظه و فقط اعمال **حداقل تغییرات** به DOM واقعی، هزینه کنترل می‌شود.

---

## چه مشکلی را حل می‌کند؟

- مدل `declarative` برای UI: شما `state` را توصیف می‌کنید؛ موتور رندر تصمیم می‌گیرد DOM چه تغییری کند
- `batching` آپدیت‌ها: چند تغییر `state` → یک بار `commit` به DOM
- لایه `abstraction`: نیازی به `document.getElementById` و دستکاری دستی نیست

---

## ⚙️ نحوه کار

```
Component Function اجرا می‌شود
    ↓
React Elements (Virtual Tree) ساخته می‌شود
    ↓
Reconciliation: مقایسه با درخت قبلی
    ↓
فقط nodeهای تغییرکرده به DOM واقعی اعمال می‌شوند
```

**مهم:** Virtual DOM خودش «سریع» نیست — **الگوریتم `diff` + `commit` انتخابی** است که سود می‌دهد.

---

## Syntax — از JSX به `React Element`

```jsx
// این JSX:
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

// معادل تقریبی این element است:
React.createElement('h1', null, 'Hello, ', name);
```

---

## 💡 مثال ساده

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
}
```

با هر کلیک:
1. تابع `Counter` دوباره اجرا می‌شود → درخت JSX جدید
2. React با درخت قبلی `diff` می‌زند
3. فقط متن `<p>` و احتمالاً `attribute`های تغییرکرده در DOM به‌روز می‌شوند

---

## مثال واقعی در پروژه

**لیست رزروها (Wild Oasis):** ۵۰۰ ردیف جدول. بدون Virtual DOM باید کل جدول را دستی `sync` کنید. با React فقط ردیف‌هایی که `reservation` آن‌ها عوض شده `re-render` و `commit` می‌شوند (با `key` درست).

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

---

## ⚠️ اشتباهات رایج

- فکر کردن Virtual DOM **همیشه** از DOM مستقیم سریع‌تر است (برای آپدیت‌های بسیار ساده و محدود، گاهی DOM مستقیم سریع‌تر است)
- اشتباه گرفتن `React Element` با `DOM Node` — `element` در حافظه است، `node` در مرورگر
- فکر کردن هر `render` حتماً DOM را تغییر می‌دهد — اگر `diff` تغییری نیابد، `commit` خالی است

---

## 🚀 Best Practices

- کامپوننت‌ها را کوچک نگه دارید تا `subtree`های `diff` کوچک‌تر شوند
- از `key` پایدار در لیست‌ها استفاده کنید → [Keys-And-Performance.md](./Keys-And-Performance.md)
- برای DOM دستی (`canvas`، `third-party lib`) از `ref` استفاده کنید، نه `state` غیرضروری

---

## چه زمانی استفاده کنیم؟ / چه زمانی استفاده نکنیم؟

| استفاده کنیم | استفاده نکنیم |
|--------------|---------------|
| UI `declarative` و `state-driven` | آپدیت‌های پرتکرار روی یک `node` (مثلاً انیمیشن ۶۰fps با `ref`/`CSS`) |
| اپلیکیشن‌های با ساختار درختی | وقتی کتابخانه‌ای خودش DOM را مدیریت می‌کند (مثلاً D3 در یک `container`) |

---

## ارتباط با مفاهیم دیگر

- [Render-Cycle.md](./Render-Cycle.md) — Virtual tree در `Render Phase` ساخته می‌شود
- [Reconciliation.md](./Reconciliation.md) — مقایسه دو درخت
- [Diffing-Algorithm.md](./Diffing-Algorithm.md) — قوانین `diff`
- [Re-render.md](./Re-render.md) — چه زمانی درخت جدید ساخته می‌شود
- [Keys-And-Performance.md](./Keys-And-Performance.md) — `key` و عملکرد
- [Rendering](../Rendering.md)

---

## 💡 نکات مهم

- React 18+ از `Fiber` استفاده می‌کند: هر `unit` کار قابل قطع و اولویت‌بندی است
- `Strict Mode` در `development` بعضی `render`ها را دوبار اجرا می‌کند — Virtual DOM دوبار ساخته می‌شود ولی `commit` یکسان است
- Server Components درخت را روی سرور می‌سازند؛ بخشی از کار از کلاینت حذف می‌شود

---

## 🎯 سوالات رایج مصاحبه

1. Virtual DOM چیست و با DOM واقعی چه تفاوتی دارد؟
2. آیا Virtual DOM همیشه سریع‌تر است؟
3. `React Element` چیست؟
4. `Fiber` چه مشکلی را حل کرد؟

---

## خلاصه

نمایش درختی UI در حافظه همان Virtual DOM است. با `diff` و `commit` انتخابی، هزینه DOM کم می‌شود. خود Virtual DOM جادو نیست — الگوریتم `reconciliation` و طراحی کامپوننت مهم‌ترند.

---

## 📚 منابع

- [React — Render Tree](https://react.dev/learn/understanding-your-ui-as-a-tree)
- [React — Render and Commit](https://react.dev/learn/render-and-commit)
