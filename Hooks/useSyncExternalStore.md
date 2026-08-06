# useSyncExternalStore

> برای `subscribe` به store خارجی React (Redux، Zustand، browser API) با پشتیبانی از Concurrent Rendering و SSR.

---

## 📖 مفهوم

برای `subscribe` به `store` خارجی React (Redux، Zustand، browser API)، از `useSyncExternalStore` استفاده می‌شود. وقتی `store` عوض شود `re-render` انجام می‌شود. React تضمین می‌کند `snapshot` با `render` هم‌خوان باشد (بدون `tearing` در `concurrent mode`).

---

## چرا

کتابخانه‌های `state management` و browser APIها (مثل `matchMedia`) خارج از React هستند. این `hook` پل رسمی React برای `sync` بدون باگ `concurrent` است. Zustand و Redux از آن داخلی استفاده می‌کنند.

---

## مشکل

- برای `state` محلی کامپوننت `overkill` — `useState` کافی است.
- `getSnapshot` باید `immutable snapshot` برگرداند.
- بدون `getServerSnapshot` در SSR → `hydration mismatch`.

---

## نحوه کار

1. `subscribe(callback)` — وقتی store عوض شد `callback` صدا زده شود.
2. `getSnapshot()` — مقدار فعلی `store` (باید `stable` اگر تغییر نکرده).
3. React `subscribe` می‌کند و با هر تغییر `re-render`.
4. SSR: `getServerSnapshot` مقدار `server` را برمی‌گرداند.

---

## Syntax

```jsx
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
```

```jsx
function useOnlineStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    () => navigator.onLine,
    () => true // server: assume online
  );
}
```

---

## پارامترها

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `subscribe` | `(onStoreChange: () => void) => () => void` | `subscribe` + unsubscribe |
| `getSnapshot` | `() => T` | خواندن مقدار فعلی (client) |
| `getServerSnapshot` | `() => T` (optional) | `snapshot` برای SSR |

---

## مقدار بازگشتی

| مقدار | نوع | توضیح |
|-------|-----|-------|
| `snapshot` | `T` | مقدار فعلی store |

---

## مثال ساده

```jsx
import { useSyncExternalStore } from 'react';

const store = {
  listeners: new Set(),
  state: { count: 0 },
  subscribe(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  },
  getSnapshot() {
    return this.state;
  },
  increment() {
    this.state = { count: this.state.count + 1 };
    this.listeners.forEach((l) => l());
  },
};

function Counter() {
  const { count } = useSyncExternalStore(
    (cb) => store.subscribe(cb),
    () => store.getSnapshot()
  );
  return <button onClick={() => store.increment()}>{count}</button>;
}
```

---

## مثال واقعی

### Dashboard — تم سیستم (prefers-color-scheme)

```jsx
function subscribeToDarkMode(callback) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getDarkModeSnapshot() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function useDarkMode() {
  return useSyncExternalStore(
    subscribeToDarkMode,
    getDarkModeSnapshot,
    () => false
  );
}
```

### Auth — Zustand store (داخلی از useSyncExternalStore)

```jsx
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

function Header() {
  const user = useAuthStore((s) => s.user);
  return user ? <Avatar user={user} /> : <LoginLink />;
}
```

### E-commerce — localStorage cart sync

```jsx
function subscribeToStorage(key, callback) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function useStorageItem(key, defaultValue) {
  return useSyncExternalStore(
    (cb) => subscribeToStorage(key, cb),
    () => localStorage.getItem(key) ?? defaultValue,
    () => defaultValue
  );
}
```

---

## اشتباهات

```jsx
// ❌ getSnapshot object جدید هر بار
getSnapshot: () => ({ count: store.count })

// ✅ primitive یا cached reference
getSnapshot: () => store.count

// ❌ بدون getServerSnapshot در Next.js
useSyncExternalStore(sub, () => window.innerWidth)

// ✅
useSyncExternalStore(sub, () => window.innerWidth, () => 1024)
```

---

## Best Practices

- `getSnapshot` باید `pure` و سریع باشد.
- اگر مقدار تغییر نکرده، همان reference/primitive قبلی را برگردانید.
- برای کتابخانه‌ها: Zustand/Redux خودشان `handle` می‌کنند.
- `custom store`: الگوی `subscribe` + `getSnapshot`.

---

## When to Use / Not

| استفاده کنید | استفاده نکنید |
|-------------|---------------|
| `external store` | `state` محلی کامپوننت |
| `matchMedia`، وضعیت آنلاین | `context` ساده |
| `custom pub/sub` | `useState` کافی است |

---

## ارتباط با مفاهیم

- [State-Management/README.md](../State-Management/README.md)
- [useContext.md](./useContext.md)
- [Escape-Hatches.md](../Escape-Hatches.md)

---

## نکات

- React 18+ — جایگزین `useSubscription` (`unstable`).
- پایه Zustand، Jotai (بخشی)، Redux Toolkit.
- `tearing`: بدون این hook، concurrent `render` ممکن است `snapshot` ناهماهنگ نشان دهد.

---

## Interview

**سوال:** `useSyncExternalStore` برای چیست؟  
**جواب:** برای `subscribe` امن به `store` خارجی با `snapshot` سازگار با `Concurrent Rendering` و SSR.

**سوال:** چرا `getServerSnapshot` لازم است؟  
**جواب:** در SSR `window` نیست؛ مقدار `server` باید با `hydration` `client` هم‌خوان باشد.

---

## خلاصه

با `useSyncExternalStore` پل React به `store`های خارجی ساخته می‌شود. برای browser API و کتابخانه‌های `state` استفاده می‌شود؛ `getSnapshot` و `getServerSnapshot` را درست پیاده کنید.

---

## منابع

- [useSyncExternalStore — react.dev](https://react.dev/reference/react/useSyncExternalStore)
