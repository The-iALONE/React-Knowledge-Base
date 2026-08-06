# Render Props

الگوی اشتراک‌گذاری منطق بین کامپوننت‌ها با `prop` تابعی که JSX برمی‌گرداند.

---
## 📖 مفهوم

الگوی `Render Props` یعنی یک کامپوننت `prop` می‌گیرد که تابع است (معمولاً `render` یا `children`) و `state`/`logic` را به آن می‌دهد تا UI را خود `consumer` بسازد.

---
## چرا این ویژگی وجود دارد؟

قبل از Hooks، راه اصلی `reuse` کردن `stateful logic` بین کامپوننت‌های با UI متفاوت بود.

---
## چه مشکلی را حل می‌کند؟

اشتراک رفتار (`fetch`، `toggle`، `form state`) بدون کپی منطق یا `inheritance`.

---
## ⚙️ نحوه کار

1. کامپوننت والد `state` و `handlers` را مدیریت می‌کند.
2. تابع `render` را با آن `values` صدا می‌زند.
3. `consumer` UI دلخواه را برمی‌گرداند.

---
## چه زمانی استفاده کنیم؟

- کتابخانه‌های قدیمی (react-router v5، react-motion)
- وقتی UI باید کاملاً قابل سفارشی‌سازی باشد
- در کد `legacy`

---
## چه زمانی استفاده نکنیم؟

- پروژه جدید → ترجیحاً `Custom Hook` (همان `logic`، `syntax` ساده‌تر)
- `nesting` عمیق `render props` (`callback hell`)

---
## Syntax

```jsx
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
## معادل مدرن با Custom Hook

```jsx
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

در پروژه‌های قدیمی‌تر دوره، الگوی `render props` برای اشتراک منطق `layout` دیده می‌شود. در کد جدید همان منطق به `useMediaQuery`، `useLocalStorage` و مشابه منتقل شده است.

---
## 🚀 Best Practices

✅ در کد جدید: `logic` → `Custom Hook`  
✅ نام `prop` واضح (`render`, `children`)  
✅ TypeScript برای `signature` تابع  
❌ تو در تو کردن بیش از حد  
❌ `render props` وقتی `Hook` کافی است

---
## ارتباط با مفاهیم دیگر

- [Custom Hooks](../Custom-Hooks.md)
- [Higher-Order Components](./Higher-Order-Components.md)
- [Compound Components](./Compound-Components.md)
- [Reusability Patterns](./Reusability-Patterns.md)

---
## خلاصه

`Render Props` = `logic` در والد، UI در تابع `consumer`. امروز بیشتر با `Custom Hooks` جایگزین می‌شود.

---
## 📚 منابع

- [Render Props — react.dev (legacy patterns)](https://react.dev)
- [Reusing Logic with Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
