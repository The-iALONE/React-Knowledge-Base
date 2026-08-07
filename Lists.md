# Lists — رندر لیست و اهمیت Key

> 🧭 پیش‌نیاز: [Conditional Rendering](./Conditional-Rendering.md) · بعدی: [Events](./Events.md)

> آرایه‌ها را با `map` به JSX تبدیل کنید. `prop` `key` به React می‌گوید هر آیتم کدام است — بدون آن، به‌روزرسانی لیست باگ و کندی ایجاد می‌کند.

## 📖 مفهوم

در React، `Lists` با `array.map()` رندر می‌شوند. هر عنصر لیست باید `prop` یکتا و پایدار `key` داشته باشد تا الگوریتم `Reconciliation` بتواند آیتم‌ها را درست `match` کند.

## چرا این ویژگی وجود دارد؟

وقتی ترتیب، افزودن یا حذف آیتم رخ می‌دهد، React باید بداند کدام `node` DOM مربوط به کدام داده است — نه اینکه همه را از نو بسازد.

## چه مشکلی را حل می‌کند؟

- باگ `state` اشتباه روی آیتم اشتباه (مثلاً `input` در ردیف اشتباه)
- `re-render` و `patch` غیرضروری کل لیست
- از دست رفتن `focus` و `animation`

## ⚙️ نحوه کار

در `Render Phase`، React درخت جدید را با قبلی مقایسه می‌کند. `key` هویت هر `sibling` را مشخص می‌کند:

- `key` یکسان → همان کامپوننت به‌روز می‌شود (`props` عوض)
- `key` جدید → `unmount` قدیم + `mount` جدید
- `key` حذف → `unmount`

## Syntax

```jsx
const cabins = [
  { id: "c1", name: "کلبه جنگلی", price: 120 },
  { id: "c2", name: "کلبه دریاچه", price: 150 },
];

function CabinList({ cabins }) {
  return (
    <ul>
      {cabins.map((cabin) => (
        <CabinItem key={cabin.id} cabin={cabin} />
      ))}
    </ul>
  );
}
```

**قوانین `key`:**

- در **همان سطح `sibling`** یکتا باشد
- **پایدار** باشد (نه `Math.random()` یا `index` در لیست قابل مرتب‌سازی/فیلتر)
- روی **عنصر بیرونی `map`** باشد، نه داخل `child`

## 💡 مثال ساده

```jsx
function NumberList({ numbers }) {
  return (
    <ol>
      {numbers.map((num) => (
        <li key={num}>{num}</li>
      ))}
    </ol>
  );
}
```

## مثال واقعی در پروژه

**صفحه‌بندی محصولات (`e-commerce` / `pizza menu`):**

```jsx
function PizzaMenu({ pizzas, page }) {
  const pageSize = 8;
  const visible = pizzas.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section>
      <ul className="menu-grid">
        {visible.map((pizza) => (
          <PizzaCard
            key={pizza.id} // id از API — نه index
            pizza={pizza}
          />
        ))}
      </ul>
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(pizzas.length / pageSize)}
      />
    </section>
  );
}

function PizzaCard({ pizza }) {
  const [quantity, setQuantity] = useState(1);
  // با key درست، quantity روی pizza اشتباه نمی‌رود
  return (
    <li>
      <h3>{pizza.name}</h3>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <button>افزودن به سبد</button>
    </li>
  );
}
```

**فیلتر + مرتب‌سازی:** همیشه از `id` پایدار استفاده کنید، نه `index` آرایه.

## ⚠️ اشتباهات رایج

- استفاده از `index` به‌عنوان `key` در لیست قابل `reorder`/`filter`/`delete`
- `key` روی کامپوننت داخلی به‌جای `element` مستقیم `map`
- `key` تکراری در `siblings`
- `key={Math.random()}` — هر `render` هویت جدید → `mount` مجدد

## 🚀 Best Practices

- `id` از دیتابیس/API بهترین `key` است
- برای لیست `static` که هرگز `reorder` نمی‌شود، `index` قابل قبول است (نادر)
- `fragment` با `key`: `<React.Fragment key={id}>...</React.Fragment>`
- لیست بزرگ: `virtualization` (`react-window`) + `key` پایدار

## چه زمانی استفاده کنیم؟ / چه زمانی استفاده نکنیم؟

| استفاده کنیم                         | استفاده نکنیم                    |
| ------------------------------------ | -------------------------------- |
| همیشه هنگام `map` روی داده `dynamic` | `key` برای عنصر تکی غیرضروری است |
| `id` پایدار از سرور                  | `index` وقتی ترتیب عوض می‌شود    |

## ارتباط با مفاهیم دیگر

- [Rendering](./Rendering.md)
- [Performance/Reconciliation](./Performance/Reconciliation.md)
- [Performance/Keys-And-Performance](./Performance/Keys-And-Performance.md)
- [Conditional-Rendering](./Conditional-Rendering.md)
- [State](./State.md)

## 💡 نکات مهم

- `key` به `child` پاس داده نمی‌شود — در `props` نیست
- تغییر `key` عمدی راهی برای `reset` کردن `state` فرزند است
- در [Concurrent Features](./Escape-Hatches/Concurrent-Features.md)، `key` پایدار برای `interruptible render` مهم‌تر است

## 🎯 سوالات رایج مصاحبه

1. چرا به `key` نیاز داریم؟
2. چرا `index` به‌عنوان `key` بد است؟
3. اگر `key` عوض شود چه اتفاقی می‌افتد؟
4. تفاوت `key` و `id` `attribute` در HTML چیست؟

## خلاصه

لیست‌ها با `map` رندر می‌شوند؛ `key` یکتا و پایدار برای `Reconciliation` ضروری است. از `id` واقعی استفاده کنید، نه `index` در لیست‌های پویا.

## 📚 منابع (react.dev)

- [Rendering Lists](https://react.dev/learn/rendering-lists)
- [Why React Needs Keys](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)
