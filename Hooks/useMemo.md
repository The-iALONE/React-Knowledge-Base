# useMemo

> برای `cache` کردن نتیجه یک محاسبه بین `render`ها — فقط وقتی وابستگی‌ها تغییر کنند دوباره محاسبه می‌شود.

---

## 📖 مفهوم

برای `cache` کردن نتیجه یک محاسبه بین `render`ها، از `useMemo` استفاده می‌شود. اگر `deps` تغییر نکرده باشند، همان مقدار قبلی بدون اجرای مجدد تابع برمی‌گردد.

---

## چرا

هر `render`، همه کد داخل کامپوننت دوباره اجرا می‌شود. محاسبات سنگین (فیلتر لیست بزرگ، sort، ساخت object) یا ساخت reference جدید برای `props` می‌تواند باعث `re-render`های زنجیره‌ای شود. `useMemo` این هزینه را کنترل می‌کند.

---

## مشکل

- `overuse` → کد پیچیده بدون سود واقعی.
- `object`/`array` جدید در هر `render` → `memo` `child` بی‌فایده می‌شود.
- `deps` ناقص → `stale` value.
- `useMemo` خودش هزینه دارد؛ برای محاسبات سبک لازم نیست.

---

## نحوه کار

1. در اولین `render`، تابع `calculate` اجرا و نتیجه ذخیره می‌شود.
2. در `render` بعدی، React `deps` را با `Object.is` مقایسه می‌کند.
3. اگر `deps` تغییر نکرده → مقدار `cache` برمی‌گردد.
4. اگر تغییر کرده → `calculate` دوباره اجرا می‌شود.

---

## Syntax

```jsx
const cachedValue = useMemo(calculateValue, dependencies);
```

```jsx
const filtered = useMemo(() => {
  return items.filter((i) => i.status === filter);
}, [items, filter]);
```

---

## پارامترها

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `calculateValue` | `() => T` | تابعی که مقدار را محاسبه می‌کند |
| `dependencies` | `unknown[]` | وابستگی‌ها؛ تغییر هر کدام → re-calculate |

---

## مقدار بازگشتی

| مقدار | نوع | توضیح |
|-------|-----|-------|
| `cachedValue` | `T` | نتیجه محاسبه (یا cache شده) |

---

## مثال ساده

```jsx
import { useMemo, useState } from 'react';

function ProductList({ products }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return (/* render filtered */);
}
```

---

## مثال واقعی

### Dashboard — `cache` object برای Context/child

```jsx
function PostsProvider({ posts, children }) {
  const [searchQuery, setSearchQuery] = useState('');

  const searchedPosts = useMemo(() => {
    return posts.filter((p) => p.title.includes(searchQuery));
  }, [posts, searchQuery]);

  const value = useMemo(() => ({
    posts: searchedPosts,
    searchQuery,
    setSearchQuery,
  }), [searchedPosts, searchQuery]);

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
}
```

### E-commerce — archive options پایدار

```jsx
function Archive({ posts, onAddPost }) {
  const archiveOptions = useMemo(() => ({
    show: false,
    title: `Post archive in addition to ${posts.length} main posts`,
  }), [posts.length]);

  return <ArchivePanel options={archiveOptions} onAdd={onAddPost} />;
}
```

### Auth — نقش‌های کاربر

```jsx
function AdminPanel({ user, permissions }) {
  const canManageUsers = useMemo(() => {
    return permissions.includes('users:write') && user.role === 'admin';
  }, [permissions, user.role]);

  return canManageUsers ? <UserManager /> : <AccessDenied />;
}
```

---

## اشتباهات

```jsx
// ❌ useMemo برای محاسبه سبک
const doubled = useMemo(() => count * 2, [count]);

// ✅ مستقیم در render
const doubled = count * 2;

// ❌ deps ناقص
const sorted = useMemo(() => sort(items), [items.length]);

// ❌ mutate نتیجه cache شده
const list = useMemo(() => items, [items]);
list.push(newItem); // wrong!
```

---

## Best Practices

- فقط وقتی **مشکل واقعی** دارید: محاسبه سنگین یا reference stability برای `memo`/`useEffect`.
- `deps` را کامل بنویسید.
- ابتدا بدون `useMemo` بنویسید؛ بعد با profiler بهینه کنید.
- برای تابع از `useCallback` استفاده کنید، نه `useMemo(() => fn)`.

---

## When to Use / Not

| استفاده کنید | استفاده نکنید |
|-------------|---------------|
| فیلتر/`sort` لیست بزرگ | `count + 1` |
| `object`/`array` پایدار برای `child` `memoized` | `premature optimization` |
| جلوگیری از `infinite loop` در `deps` | جایگزین `state management` |

---

## ارتباط با مفاهیم

- [useCallback.md](./useCallback.md) — `cache` تابع (معادل `useMemo` برای `function`)
- [Performance/Memoization.md](../Performance/Memoization.md) — memoization در عمق
- [Patterns/React-Memo.md](../Patterns/React-Memo.md) — `React.memo`

---

## نکات

- `useMemo` و `useCallback` از نظر مکانیزم مشابه‌اند.
- React ممکن است `cache` را در آینده `discard` کند — روی آن برای `correctness` حساب نکنید.
- در React Compiler (`experimental`) بسیاری از `useMemo`ها خودکار می‌شوند.

---

## Interview

**سوال:** تفاوت `useMemo` و `useCallback`؟  
**جواب:** در `useMemo` نتیجه `calculate()` `cache` می‌شود؛ در `useCallback` خود تابع `cache` می‌شود. `useCallback(fn, deps)` ≈ `useMemo(() => fn, deps)`.

**سوال:** چرا `{}` در هر `render` باعث `re-render` `child` می‌شود؟  
**جواب:** به‌خاطر `reference equality` — هر `{}` یک `object` جدید است حتی اگر محتوا یکسان باشد.

---

## خلاصه

با `useMemo` می‌توان مقدار محاسبه‌شده را بین `render`ها `cache` کرد. برای محاسبات سنگین یا `stabilizing reference` استفاده کنید؛ `overuse` نکنید.

---

## منابع

- [useMemo — react.dev](https://react.dev/reference/react/useMemo)
