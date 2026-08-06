# Lifecycle — چرخه حیات در Function Components

> در React مدرن (`function components` + `hooks`)، `lifecycle` با `useEffect` و `mount`/`unmount` شبیه‌سازی می‌شود — نه متدهای `class component`.

## 📖 مفهوم

چرخه حیات (`Lifecycle`) مراحل وجود یک کامپوننت است: `mount` (ایجاد) → `update` (`re-render`) → `unmount` (حذف). در `class components` متدهایی مثل `componentDidMount` داشتید؛ در `function components` همان رفتار با `useEffect` پیاده می‌شود.

## چرا این ویژگی وجود دارد؟

بعضی کارها فقط در زمان خاصی باید انجام شوند: دریافت (`fetch`) در `mount`، `cleanup` در `unmount`.

## چه مشکلی را حل می‌کند؟

- `setup`/`teardown` منابع (`subscription`، `timer`)
- همگام‌سازی (`sync`) با `external system` در زمان مناسب

## ⚙️ نحوه کار

| Class (قدیمی) | Function (مدرن) |
|---------------|-----------------|
| `componentDidMount` | `useEffect(() => { ... }, [])` |
| `componentDidUpdate` | `useEffect(() => { ... }, [dep])` |
| `componentWillUnmount` | `return () => { cleanup }` در `useEffect` |
| `componentDidMount` + `update` | `useEffect(() => { ... })` بدون `deps` (کمتر توصیه) |

```jsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    // mount + roomId change
    const connection = createConnection(roomId);
    connection.connect();

    return () => {
      // unmount + قبل از effect بعدی
      connection.disconnect();
    };
  }, [roomId]);
}
```

## مثال واقعی در پروژه

**هوک موقعیت‌یاب (`Geolocation`):** در `mount` موقعیت را می‌گیرد؛ در `unmount` `listener` را حذف می‌کند.

## ⚠️ اشتباهات رایج

- ❌ استفاده از `class components` در پروژه جدید
- ❌ فراموش کردن `cleanup` → `memory leak`
- ❌ `useEffect(fn, [])` برای `logic` وابسته به `props`

## 🚀 Best Practices

- ✅ هر `effect` یک `concern`
- ✅ `cleanup` همیشه برای `subscription`/`timer`
- ✅ `dependency array` دقیق

## چه زمانی به `lifecycle` فکر کنیم؟

- نیاز به `setup` در `mount`
- نیاز به `cleanup` در `unmount`
- واکنش به تغییر `prop` خاص

## ارتباط با مفاهیم دیگر

- [Effects](./Effects.md)
- [Hooks/useEffect](./Hooks/useEffect.md)
- [Rendering](./Rendering.md)

## 💡 نکات مهم

- در React 18+ Strict Mode `effect` را دوبار `mount`/`unmount` می‌کند در `dev` — برای تست `cleanup`
- `lifecycle` مبتنی بر `class` دیگر توصیه نمی‌شود

## 🎯 سوالات رایج مصاحبه

- معادل `componentDidMount` در `hooks`؟
- چرا `cleanup` مهم است؟

## خلاصه

چرخه حیات مدرن = `useEffect` + `dependency array` + تابع `cleanup`.

## 📚 منابع

- [Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects)
- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
