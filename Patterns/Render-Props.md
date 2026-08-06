# Render Props

الگوی اشتراک‌گذاری منطق بین کامپوننت‌ها با `prop` تابعی که JSX برمی‌گرداند.

---
## 📖 مفهوم

الگوی `Render Props` یعنی یک کامپوننت `prop` می‌گیرد که تابع است (معمولاً `render` یا `children`) و `state`/`logic` را به آن می‌دهد تا UI را خود `consumer` بسازد.

---
## چرا این ویژگی وجود دارد؟

قبل از `Hooks`، راه اصلی `reuse` کردن `stateful logic` بین کامپوننت‌های با UI متفاوت بود.

---
## چه مشکلی را حل می‌کند؟

اشتراک رفتار (`fetch`، `toggle`، `form state`) بدون کپی منطق یا `inheritance`.

---
## تفاوت با `children` JSX مستقیم

وقتی می‌توانید JSX مستقیم به `children` بدهید، `render prop` لازم نیست. وقتی باید به کامپوننت **بگویید چه چیزی و چگونه** رندر کند (مثلاً هر ردیف جدول)، `prop` تابعی `render` مناسب است:

> پراپ `render` تابعی است که کامپوننت از آن استفاده می‌کند تا بفهمد چه چیزی را رندر کند — نه فقط محتوای ثابت.

---
## ⚙️ نحوه کار

1. کامپوننت والد `state` و `handlers` را مدیریت می‌کند.
2. تابع `render` را با آن `values` صدا می‌زند.
3. `consumer` UI دلخواه را برمی‌گرداند.

---
## چه زمانی استفاده کنیم؟

- کتابخانه‌های قدیمی (react-router v5، react-motion)
- وقتی UI باید کاملاً قابل سفارشی‌سازی باشد
- `Table.Body` با `data` + `render` در compound table
- در کد `legacy`

---
## چه زمانی استفاده نکنیم؟

- پروژه جدید → ترجیحاً `Custom Hook` (همان `logic`، `syntax` ساده‌تر)
- `nesting` عمیق `render props` (`callback hell`)

---
## Syntax

```jsx
import { useState, useEffect } from 'react';

// children as function (رایج‌ترین شکل render props)
function MouseTracker({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function handleMouseMove(event) {
    setPosition({ x: event.clientX, y: event.clientY });
  }

  return (
    <div style={{ height: '100vh' }} onMouseMove={handleMouseMove}>
      {children(position)}
    </div>
  );
}

// prop صریح render
function DataFetcher({ url, render }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return render({ data, loading, error });
}
```

---
## 💡 مثال ساده

```jsx
function App() {
  return (
    <MouseTracker>
      {({ x, y }) => (
        <p>
          Mouse position: {x}, {y}
        </p>
      )}
    </MouseTracker>
  );
}

function UserList() {
  return (
    <DataFetcher url="/api/users" render={({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error.message}</p>;
      return (
        <ul>
          {data.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      );
    }} />
  );
}
```

---
## مثال دوره — `Table.Body` + `CabinTable`

ترکیب `Compound Components` با `render prop` در `Table.Body`:

```jsx
// Table.jsx — Body با render prop
function Body({ data, render }) {
  if (!data.length) return <p>داده‌ای برای نمایش نیست</p>;
  return <tbody>{data.map((item) => render(item))}</tbody>;
}

// CabinTable.jsx
function CabinTable() {
  const { isLoading, cabins } = useCabins();

  if (isLoading) return <Spinner />;

  return (
    <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
      <Table.Header>
        <div></div>
        <div>Cabin</div>
        <div>Capacity</div>
        <div>Price</div>
        <div>Discount</div>
        <div></div>
      </Table.Header>

      <Table.Body
        data={cabins}
        render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
      />
    </Table>
  );
}
```

قبل از `render prop`، `map` در `consumer` بود:

```jsx
<Table columns="...">
  <Table.Header>...</Table.Header>
  {cabins.map((cabin) => (
    <CabinRow cabin={cabin} key={cabin.id} />
  ))}
</Table>
```

با `Table.Body`، منطق «اگر داده خالی» و `map` داخل compound قرار می‌گیرد — `consumer` فقط نحوه رندر هر ردیف را تعریف می‌کند.

---
## معادل مدرن با هوک سفارشی

```jsx
import { useState, useEffect } from 'react';

function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(event) {
      setPosition({ x: event.clientX, y: event.clientY });
    }
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}

function App() {
  const { x, y } = useMousePosition();
  return <p>Mouse: {x}, {y}</p>;
}
```

---
## مثال واقعی در پروژه

- the-wild-oasis: `Table.Body` با `render` برای ردیف کابین
- پروژه‌های قدیمی دوره: `render props` برای `layout`
- کد جدید: همان منطق به `useMediaQuery`، `useLocalStorage` و مشابه منتقل شده

---
## 🚀 Best Practices

✅ در کد جدید: `logic` → `Custom Hook`  
✅ نام `prop` واضح (`render`, `children`)  
✅ TypeScript برای `signature` تابع  
✅ `render prop` در compound وقتی `consumer` شکل ردیف را کنترل می‌کند  
❌ تو در تو کردن بیش از حد  
❌ `render props` وقتی `Hook` کافی است

---
## ارتباط با مفاهیم دیگر

- [Custom Hooks](../Custom-Hooks.md)
- [Compound Components](./Compound-Components.md)
- [Higher-Order Components](./Higher-Order-Components.md)
- [Reusability Patterns](./Reusability-Patterns.md)

---
## خلاصه

`Render Props` = `logic` در والد، UI در تابع `consumer`. در `Table.Body` هنوز مفید است. منطق عمومی امروز بیشتر با `Custom Hooks` جایگزین می‌شود.

---
## 📚 منابع

- [Reusing Logic with Hooks — react.dev](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Compound Components](./Compound-Components.md)
