# Sharing State — اشتراک `state`

> 🧭 پیش‌نیاز: [Lifting State Up](./Lifting-State-Up.md) · بعدی: [Context](./Context.md)

> روش‌های مختلف به‌اشتراک‌گذاری `state` بین کامپوننت‌ها: از بالا بردن `state` تا Context و `state management`.
## 📖 مفهوم

اشتراک `state` (`Sharing State`) شامل تمام الگوهایی است که `state` را بین چند کامپوننت در دسترس قرار می‌دهد. سطح پیچیدگی از ساده به پیشرفته:

1. بالا بردن `state` (`Lifting State Up`) — والد مشترک
2. `Context API` — بدون `prop drilling`
3. کتابخانه مدیریت `state` — `Redux`، `Zustand`، React Query
4. `state` در URL — `state` در `query params` (با React Router)

## چرا این ویژگی وجود دارد؟

اپلیکیشن‌های واقعی نیاز به داده مشترک دارند: کاربر لاگین‌شده، سبد خرید، تم، فیلترها.

## چه مشکلی را حل می‌کند؟

- جلوگیری از `state` تکراری (`duplicate state`)
- همگام‌سازی UI در بخش‌های مختلف اپ

## ⚙️ نحوه کار

| روش | مناسب برای | مثال |
|-----|-----------|------|
| بالا بردن `state` | ۲ `sibling` نزدیک | فیلتر + لیست |
| Context | داده سراسری کم‌تغییر | تم، `auth`، زبان |
| `useReducer` + Context | `state` پیچیده سراسری | سبد خرید |
| Redux Toolkit | `state` بزرگ، `devtools` | فروشگاه |
| React Query | `server`/`remote state` | لیست محصولات |
| `URL state` | `state` قابل `share`/`bookmark` | فیلتر، `pagination` |

```jsx
// Context — ساده (React 19: بدون .Provider)
const ThemeContext = createContext("light");

function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext value={{ theme, setTheme }}>
      <Header />
      <Main />
    </ThemeContext>
  );
}
```
## مثال واقعی در پروژه

**فروشگاه پیتزا:** `cart` در Redux Toolkit (افزودن/حذف آیتم، محاسبه قیمت). **داشبورد کابین:** فیلتر و مرتب‌سازی در URL با React Router. **`Auth`:** `session` در Context.

## ⚠️ اشتباهات رایج

- ❌ استفاده از Context برای هر `state` (`overuse`)
- ❌ استفاده از Redux برای `state` محلی ساده
- ❌ نگه‌داشتن `state` تکراری (`duplicate state`) در چند جا بدون `sync`

## 🚀 Best Practices

- ✅ **`colocation`:** `state` را نزدیک مصرف‌کننده نگه دارید
- ✅ `server state` → React Query؛ `client state` → `useState`/Context/Redux
- ✅ استفاده از URL برای `state` که باید `share`/`bookmark` شود

## چه زمانی از هر روش استفاده کنیم؟

| وضعیت | روش |
|-------|-----|
| ۲ `sibling` نزدیک | بالا بردن `state` |
| `prop drilling` ۳+ سطح | Context |
| `state` پیچیده + `logic` زیاد | `useReducer` یا Redux |
| داده از API | React Query |
| فیلتر/صفحه‌بندی قابل اشتراک | `URL state` ([State in URL](./React-Router/State-In-URL.md)) |
## ارتباط با مفاهیم دیگر

- [Lifting State Up](./Lifting-State-Up.md)
- [Context](./Context.md)
- [State-Management/Context-API](./State-Management/Context-API.md)
- [State-Management/React-Query](./State-Management/React-Query.md)
- [React-Router/State-In-URL](./React-Router/State-In-URL.md) — `URL state`

## 💡 نکات مهم

- همه `state` را `global` نکنید — فقط آنچه واقعاً مشترک است
- React Query و Redux **مکمل** هستند، نه جایگزین یکدیگر

## 🎯 سوالات رایج مصاحبه

- تفاوت `local state`، Context و Redux؟
- `server state` در برابر `client state` چیست؟

## خلاصه

روش اشتراک `state` را بر اساس `scope` و پیچیدگی انتخاب کنید — ساده‌ترین راه کافی است.

## 📚 منابع

- [Managing State](https://react.dev/learn/managing-state)
- [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
