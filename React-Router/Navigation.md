# Navigation

> 🧭 پیش‌نیاز: [Dynamic Routes](./Dynamic-Routes.md) · بعدی: [State in URL](./State-In-URL.md)

---

## 📖 مفهوم

ناوبری در React Router به دو شکل **اعلامی** (`Link`، `NavLink`) و **دستوری** (`useNavigate`، `Navigate`) انجام می‌شود. همچنین الگوی **محافظت مسیر** (`ProtectedRoute`) دسترسی به صفحات خصوصی را بدون تکرار `logic` در هر page کنترل می‌کند.

وقتی فرم login موفق شد، کاربر نباید مجبور باشد دستی روی لینک کلیک کند — `useNavigate` بعد از mutation او را به داشبورد می‌برد.

---

## چرا این ویژگی وجود دارد؟

`<a href>` باعث `reload` کامل می‌شود و SPA از بین می‌رود. `Link` history را با History API به‌روز می‌کند. `NavLink` برای منو state فعال می‌دهد. محافظت مسیر جلوی دسترسی مستقیم به URL خصوصی را می‌گیرد.

---

## چه مشکلی را حل می‌کند؟

- ناوبری بدون reload
- highlight آیتم منوی فعال
- redirect بعد از action (login، submit)
- برگشت history (`navigate(-1)`)
- محدود کردن داشبورد به کاربر احراز هویت‌شده

---

## ⚙️ نحوه کار

### Link

```jsx
import { Link } from "react-router-dom";

<Link to="/login" className="cta">Start tracking now</Link>
```

`to` با `/` از root شروع می‌شود — همیشه URL مطلق از ریشه سایت.

### NavLink

تفاوت با `Link`: وقتی مسیر فعلی منطبق است، کلاس `active` (یا callback) می‌گیرد.

```jsx
// ui/PageNav.jsx
import { NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";

export default function PageNav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive ? styles.activeLink : undefined
          }
        >
          Log in
        </NavLink>
      </ul>
    </nav>
  );
}
```

### useNavigate

```jsx
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();

  function onSuccess() {
    navigate("/dashboard");
  }

  return <button onClick={() => navigate("/form")}>Move to form</button>;
}
```

**بعد از submit فرم** — الگوی رایج Wild Oasis با React Query:

```jsx
// features/authentication/useLogin.js
const navigate = useNavigate();

const { mutate: login } = useMutation({
  mutationFn: loginApi,
  onSuccess: (user) => {
    queryClient.setQueryData(["user"], user);
    navigate("/dashboard");
  },
});
```

**با query در URL** (مثلاً نقشه):

```jsx
function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) =>
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
  return null;
}
```

**برگشت:**

```jsx
function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
    >
      ← Back
    </button>
  );
}
```

`navigate(-1)` یک قدم عقب؛ `navigate(1)` جلو؛ `navigate(-2)` دو قدم.

### Navigate (declarative redirect)

```jsx
<Route index element={<Navigate replace to="dashboard" />} />
```

`replace` — entry قبلی history حذف می‌شود (Back به redirect نمی‌رود).

---

## محافظت مسیرها (Protected Routes)

### چرا جدا از M10؟

| | React Router (اینجا) | Next.js (M10) |
|---|---------------------|---------------|
| مکانیزم | کامپوننت wrapper | `middleware.ts` + layout |
| محل | `ProtectedRoute.jsx` | `middleware` + `auth()` |
| مناسب | SPA + Vite | SSR/App Router |

هر دو «اجازه دسترسی» را چک می‌کنند؛ API و محل کد فرق دارد — **تداخل محتوایی ندارد**.

### الگوی Wild Oasis

مسیرهای خصوصی زیر یک wrapper؛ `login` و `*` بیرون:

```jsx
// App.jsx
<Routes>
  <Route
    element={
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Navigate replace to="dashboard" />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="cabins" element={<Cabins />} />
    <Route path="bookings" element={<Bookings />} />
    <Route path="bookings/:bookingId" element={<Booking />} />
    <Route path="settings" element={<Settings />} />
  </Route>

  <Route path="login" element={<Login />} />
  <Route path="*" element={<PageNotFound />} />
</Routes>
```

### کامپوننت ProtectedRoute

```jsx
// ui/ProtectedRoute.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useUser();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate("/login");
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return <Spinner />;
  if (isAuthenticated) return children;
  return null;
}
```

### useUser با React Query

```jsx
// features/authentication/useUser.js
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

export function useUser() {
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });
  return {
    isLoading,
    user,
    isAuthenticated: user?.role === "authenticated",
  };
}
```

**جریان:** بار اول → `isLoading` → Spinner؛ بدون session → redirect `/login`؛ با session → `children` (`AppLayout` + `Outlet`).

### جایگزین: layout route بدون useEffect

```jsx
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useUser();
  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
```

`Navigate` در `render` — ساده‌تر از `useEffect` + `navigate`.

### نکات محافظت

- فقط مخفی کردن لینک sidebar **کافی نیست** — کاربر `/dashboard` را مستقیم می‌زند
- `login` باید **خارج** از `ProtectedRoute` باشد
- session را از React Query / Context بخوانید — نه `localStorage` پراکنده در هر page
- در M10 همان منطق با [Middleware](../Nextjs/Middleware.md) و [Authentication](../Nextjs/Authentication-NextAuth.md)

مثال کد: [Examples/react-router/ProtectedRoute.jsx](../Examples/react-router/ProtectedRoute.jsx)

---

## تفاوت با گزینه‌های مشابه

| API | کاربرد |
|-----|--------|
| `Link` | کلیک کاربر — منو، کارت |
| `NavLink` | منو + استایل active |
| `useNavigate` | بعد از mutation، timer، map click |
| `Navigate` | redirect در تعریف route |
| `ProtectedRoute` | guard چند صفحه خصوصی |

---

## مثال واقعی در پروژه

**Worldwise:** `PageNav` با `NavLink` — Pricing، Product، Login.

**Wild Oasis:** `ProtectedRoute` + `useLogin` → `navigate("/dashboard")`.

---

## 🚀 Best Practices

✅ `type="button"` روی دکمه Back تا form submit نشود  
✅ `replace` برای redirect بعد از login (Back به login نرود)  
✅ یک `ProtectedRoute` برای همه صفحات ادمین  
✅ loading state هنگام چک session  
❌ `navigate` در body کامپوننت بدون event — loop

---

## ⚠️ اشتباهات رایج

❌ `<a href="/page">` به‌جای `Link` — reload کامل  
❌ `onClick={navigate("/x")}` بدون arrow — بلافاصله اجرا می‌شود؛ درست: `onClick={() => navigate("/x")}`  
❌ `ProtectedRoute` دور `login` — حلقه redirect  
❌ auth فقط در UI — URL همچنان باز است

---

## ارتباط با مفاهیم دیگر

- [Dynamic Routes](./Dynamic-Routes.md) — `Link` نسبی
- [State-In-URL](./State-In-URL.md) — query در `navigate`
- [State-Management/React-Query](../State-Management/React-Query.md) — session
- [Hooks/useEffect](../Hooks/useEffect.md) — redirect در effect (یا `Navigate`)
- [Nextjs/Navigation](../Nextjs/Navigation.md) — `Link`/`useRouter` در Next

---

## خلاصه

`Link`/`NavLink` برای کلیک؛ `useNavigate` برای programmatic؛ `Navigate` برای redirect در route tree؛ `ProtectedRoute` + `useUser` برای صفحات خصوصی SPA.

---

## 📚 منابع

- [Link](https://reactrouter.com/en/main/components/link)
- [NavLink](https://reactrouter.com/en/main/components/nav-link)
- [useNavigate](https://reactrouter.com/en/main/hooks/use-navigate)
- [Auth patterns — React Router](https://reactrouter.com/en/main/start/overview)
