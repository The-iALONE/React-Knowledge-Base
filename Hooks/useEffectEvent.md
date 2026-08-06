# useEffectEvent

> برای جدا کردن رویدادهای `Effect` از خود `Effect` — منطق `non-reactive` که آخرین `props`/`state` را می‌بیند بدون `re-run` کردن `Effect`.

---

## 📖 مفهوم

برای ساخت `Effect Event` — تابعی که فقط داخل `useEffect`، `useLayoutEffect` یا `useInsertionEffect` (یا `Effect Event` دیگر) فراخوانی می‌شود — از `useEffectEvent` استفاده می‌شود. همیشه آخرین مقادیر `render` را می‌بیند، اما در `dependency array` `Effect` قرار نمی‌گیرد.

React 19.2 این `Hook` را `stable` کرد.

---

## چرا

گاهی `Effect` باید به یک «رویداد» واکنش نشان دهد (مثل `on('connected')`) ولی `callback` به `props`/`state` وابسته است که نباید باعث `reconnect` شود — مثلاً `muted` در `chat room`. قبلاً از `useRef` برای نگه‌داری `latest callback` استفاده می‌شد؛ `useEffectEvent` راه رسمی و `type-safe` است.

---

## مشکل

- **نباید** برای پنهان کردن `dependency`های واقعی Effect استفاده شود.
- فقط داخل Effect یا Effect Event دیگر قابل فراخوانی است — نه در `render`، `event handler`، یا child.
- `identity` تابع در هر `render` عوض می‌شود (عمدی) — در `deps` قرار ندهید.

---

## نحوه کار

1. `const onEvent = useEffectEvent(() => { ... })` در `top-level` کامپوننت.
2. داخل Effect، `onEvent` را صدا بزنید.
3. Effect فقط به `deps` واقعی (مثل `roomId`) وابسته می‌ماند.
4. `onEvent` همیشه آخرین `muted`، `theme` و غیره را می‌بیند.

---

## Syntax

```jsx
const onConnected = useEffectEvent(() => {
  showNotification('Connected!', theme);
});

useEffect(() => {
  const connection = createConnection(roomId);
  connection.on('connected', onConnected);
  connection.connect();
  return () => connection.disconnect();
}, [roomId]); // theme/muted در deps نیستند
```

---

## پارامترها

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `callback` | `(...args) => any` | منطق Effect Event؛ آخرین مقادیر `render` را می‌بیند |

---

## مقدار بازگشتی

تابعی با همان signature که `callback` — فقط برای فراخوانی داخل Effect.

---

## مثال واقعی

### Chat — notification بدون reconnect

```jsx
function ChatRoom({ roomId, muted }) {
  const onConnected = useEffectEvent(() => {
    if (!muted) showNotification(`Connected to ${roomId}`);
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.on('connected', onConnected);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
}
```

### Custom Hook — useInterval

```jsx
function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

---

## اشتباهات

```jsx
// ❌ پنهان کردن dependency واقعی
const logVisit = useEffectEvent(() => log(pageUrl));
useEffect(() => { logVisit(); }, []); // pageUrl عوض شود log نمی‌شود

// ❌ فراخوانی در render
onConnected(); // خطا

// ❌ گذاشتن در dependency array
useEffect(() => { onConnected(); }, [onConnected]); // هر render re-run
```

---

## Best Practices

- فقط برای منطقی که واقعاً رویداد `Effect` است، نه هر `dependency`.
- `eslint-plugin-react-hooks@latest` را نصب کنید — `linter` `Effect Event` را از `deps` حذف می‌کند.
- در `Custom Hook` برای `encapsulate` کردن `Effect` مفید است.

---

## When to Use / Not

| استفاده کنید | استفاده نکنید |
|-------------|---------------|
| `callback` در `subscription`/`timer` با آخرین `state` | جایگزین `dependency` واقعی `Effect` |
| جلوگیری از `reconnect` به سیستم خارجی | `event handler` معمولی → تابع عادی یا `useCallback` |
| الگوهای `useInterval` / `useEventListener` | `pass` دادن به `child component` |

---

## ارتباط با مفاهیم

- [useEffect.md](./useEffect.md) — `Effect` پایه
- [Effects.md](../Effects.md) — فلسفه effect
- [Custom-Hooks.md](../Custom-Hooks.md) — الگوی `useInterval`

---

## نکات

- React 19.2+.
- `identity` عمداً `unstable` است — اگر `Effect` هر `render` اجرا شود، باگ `dependency` پنهان دارید.
- جایگزین رسمی workaround `ref.current = fn` در `render` است.

---

## Interview

**سوال:** تفاوت `useEffectEvent` و `useCallback`؟  
**جواب:** در `useCallback` برای `event handler` و پاس به `child` استفاده می‌شود؛ در `useEffectEvent` فقط داخل `Effect` و برای منطق `non-reactive` در `Effect`.

**سوال:** چرا در `deps` نیست؟  
**جواب:** چون نباید `reconnect`/`re-subscribe` شود؛ همیشه آخرین مقدار را بدون `re-sync` می‌بیند.

---

## خلاصه

با `useEffectEvent` رویداد `Effect` از `reactive dependencies` جدا می‌شود. برای `subscription`، `timer` و `notification` با آخرین `state` — نه برای دور زدن `deps`.

---

## منابع

- [useEffectEvent — react.dev](https://react.dev/reference/react/useEffectEvent)
- [Separating Events from Effects — react.dev](https://react.dev/learn/separating-events-from-effects)
