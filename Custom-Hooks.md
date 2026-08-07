# Custom Hooks — هوک‌های سفارشی

> 🧭 پیش‌نیاز: [Portals](./Portals.md) · بعدی: [Hooks — نمای کلی](./Hooks/README.md)

> تابعی که نامش با `use` شروع می‌شود و می‌تواند `hook`های دیگر را فراخوانی کند — برای `reuse` کردن `stateful logic`.

## 📖 مفهوم

تابع JavaScript است که `Custom Hook` نام دارد و:

1. نامش با `use` شروع می‌شود (`useMovies`، `useLocalStorage`)
2. می‌تواند `useState`، `useEffect` و سایر `hook`ها را صدا بزند
3. `state` و `logic` را بین کامپوننت‌ها به‌اشتراک می‌گذارد بدون `HOC` یا `render props`

## چرا این ویژگی وجود دارد؟

با `custom hook` می‌توانید `logic` تکراری (`fetch`، `form`، `localStorage`، `geolocation`) را از UI جدا و `reusable` کنید.

## چه مشکلی را حل می‌کند؟

- منطق تکراری (`duplicate logic`) در چند کامپوننت
- جداسازی `business logic` از `presentation`

## ⚙️ نحوه کار

```jsx
function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(stored) : value;
    setStored(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [stored, setValue];
}

// استفاده در هر کامپوننت:
function Settings() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  return <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme}</button>;
}
```

## Syntax

```jsx
function useMyHook(arg) {
  const [state, setState] = useState(arg);
  useEffect(() => { /* ... */ }, [arg]);
  return { state, setState };
}
```

## مثال واقعی در پروژه

**جستجوی فیلم — چند `custom hook`:**

| Hook | کاربرد |
|------|--------|
| `useMovies(query)` | `fetch` + `abort` + `loading`/`error` |
| `useLocalStorageState(key)` | `persist` `watched list` |
| `useKey(key, callback)` | `keyboard shortcut` (Escape بستن `modal`) |

```jsx
function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    setIsLoading(true);
    fetch(`https://api.example.com/search?q=${query}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => { setMovies(data.Search); setIsLoading(false); })
      .catch((err) => { if (err.name !== "AbortError") setError(err.message); });
    return () => controller.abort();
  }, [query]);

  return { movies, isLoading, error };
}
```

**انتزاع (`abstraction`) React Query:**

```jsx
function useCabins() {
  return useQuery({ queryKey: ["cabins"], queryFn: fetchCabins });
}
```

## ⚠️ اشتباهات رایج

- ❌ نام بدون پیشوند `use`
- ❌ `hook` داخل `if`/`loop` (نقض Rules of Hooks)
- ❌ `return` کردن JSX از `custom hook` (آن کامپوننت است)

## 🚀 Best Practices

- ✅ یک `hook` = یک `concern`
- ✅ نام توصیفی: `useAuth`، `useDebounce`، `usePagination`
- ✅ `return object` برای APIهای پیچیده، `array` برای `state` ساده
- ✅ تست `hook` با `@testing-library/react` (`renderHook`)

## چه زمانی استفاده کنیم؟

- وقتی `logic` تکراری در ۲+ کامپوننت است
- جداسازی `fetch`/`form`/`subscription` از UI

## چه زمانی استفاده نکنیم؟

- وقتی `logic` یک‌بار مصرف ساده است — `inline` در کامپوننت
- وقتی فقط `utility` بدون `state`/`effect` است — تابع معمولی کافی است

## ارتباط با مفاهیم دیگر

- [Hooks/README](./Hooks/README.md)
- [Effects](./Effects.md)
- [State-Management/React-Query](./State-Management/React-Query.md)
- [Patterns/Reusability-Patterns](./Patterns/Reusability-Patterns.md)

## 💡 نکات مهم

- هر فراخوانی `hook` `state` **جداگانه** دارد — دو کامپوننت `state` مشترک ندارند مگر از Context
- `custom hook` فقط **`logic`** را `share` می‌کند — **قوانین Hooks** (`Rules of Hooks`) در خود `custom hook` هم اعمال می‌شود: فقط در سطح بالای تابع، نه داخل `if`/`loop`
- برای `hook`های `shared` پیچیده: `useDebugValue` `label` در DevTools اضافه می‌کند — [Hooks/useDebugValue](./Hooks/useDebugValue.md)
- برای اشتراک با منبع خارجی: [`useSyncExternalStore`](./Hooks/useSyncExternalStore.md)

## 🎯 سوالات رایج مصاحبه

- تفاوت `custom hook` و `utility function`؟
- قوانین Hooks (`Rules of Hooks`) در `custom hook`؟

## خلاصه

هوک سفارشی (`custom hook`) = `reusable stateful logic`. نام `use` + فراخوانی `hook`های دیگر.

## 📚 منابع

- [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Building Your Own Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
