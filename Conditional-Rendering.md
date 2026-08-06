# Conditional Rendering — نمایش شرطی UI

> با تغییر `state` یا `props`، بخش‌های مختلف UI را نشان دهید یا مخفی کنید — بدون دستکاری مستقیم DOM.

## 📖 مفهوم

نمایش شرطی (`Conditional Rendering`) یعنی رندر کردن عناصر JSX بر اساس شرط: `if`، `ternary` (`? :`)، `&&`، یا `early return`. در درخت Virtual DOM فقط شاخه‌ای را که در JSX برمی‌گردد قرار می‌دهد.

## چرا این ویژگی وجود دارد؟

رابط کاربری برنامه همیشه ثابت نیست: `loading`، خطا، `empty state`، نقش کاربر و... نیاز به نمایش متفاوت دارند. React این را با همان مدل `declarative` `state` حل می‌کند.

## چه مشکلی را حل می‌کند؟

- جایگزینی `element.style.display = 'none'` با منطق خوانا
- همگام‌سازی UI با وضعیت `async` (`fetch`، `auth`)
- جلوگیری از نمایش داده ناقص یا غیرمجاز

## ⚙️ نحوه کار

در `Render Phase`، React JSX را می‌سازد. شرط در JavaScript ارزیابی می‌شود؛ شاخه انتخاب‌شده وارد Virtual DOM می‌شود و در `Commit Phase` به DOM اعمال می‌شود.

## Syntax (if applicable)

```jsx
// Early return
if (!user) return <LoginPage />;

// Ternary
return isLoading ? <Spinner /> : <Content data={data} />;

// Logical AND — مراقب مقدار 0 باشید!
{
  items.length > 0 && <ItemList items={items} />;
}

// متغیر JSX
let content;
if (error) content = <Error message={error} />;
else if (isLoading) content = <Spinner />;
else content = <DataView data={data} />;
return <div>{content}</div>;
```

## 💡 مثال ساده (if needed)

```jsx
function Greeting({ isLoggedIn }) {
  return (
    <div>{isLoggedIn ? <h1>خوش آمدید</h1> : <h1>لطفاً وارد شوید</h1>}</div>
  );
}
```

## مثال واقعی در پروژه

**احراز هویت (الهام از اپ‌های `dashboard`):**

```jsx
function ProtectedRoute({ children }) {
  const { user, isLoading, error } = useAuth();

  if (isLoading) return <FullPageSpinner />;
  if (error) return <ErrorPage message="خطا در بارگذاری نشست" />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

function OrderPage() {
  const { order, status } = useOrder();

  return (
    <div>
      <OrderHeader order={order} />
      {status === "pending" && <PendingBanner />}
      {status === "delivered" && <ReviewPrompt orderId={order.id} />}
      {order.items.length === 0 ? (
        <EmptyCart />
      ) : (
        <OrderItems items={order.items} />
      )}
    </div>
  );
}
```

## ⚠️ اشتباهات رایج

- `{count && <Badge count={count} />}` — اگر `count === 0` باشد، عدد `0` روی صفحه نمایش داده می‌شود
- شرط‌های تو در تو بیش از حد → خوانایی پایین (استخراج به کامپوننت یا متغیر)
- رندر همزمان `loading` و `data` بدون `state machine` روشن
- `if` داخل JSX (باید بیرون `return` یا با `ternary`/`&&`)

## 🚀 Best Practices

- برای چند حالت از `state machine` ساده (`status: 'idle' | 'loading' | 'error' | 'success'`) استفاده کنید
- هر حالت UI را در کامپوننت جدا (`LoadingState`، `ErrorState`) نگه دارید
- برای `&&` شرط را `boolean` صریح کنید: `{items.length > 0 && ...}`
- `early return` برای `guard clause` در بالای کامپوننت

## چه زمانی استفاده کنیم؟ / چه زمانی استفاده نکنیم؟

| استفاده کنیم                           | استفاده نکنیم                                                                          |
| -------------------------------------- | -------------------------------------------------------------------------------------- |
| `loading` / `error` / `empty` / `auth` | برای `toggle` ساده `visibility` که `layout` را حفظ کند (`hidden` CSS یا `aria-hidden`) |
| نمایش کاملاً متفاوت بر اساس نقش        | وقتی هر دو شاخه باید `mount` بمانند (مثلاً برای حفظ `scroll`)                          |

## ارتباط با مفاهیم دیگر

- [State](./State.md)
- [Rendering](./Rendering.md)
- [Lists](./Lists.md)
- [Suspense](./Escape-Hatches/Suspense.md) — `loading` `declarative`
- [Error-Boundaries](./Error-Boundaries.md)
- [Sharing-State](./Sharing-State.md)

## 💡 نکات مهم

- `unmount` شدن کامپوننت `state` داخلی آن را از بین می‌برد
- [Suspense](./Escape-Hatches/Suspense.md) یک شکل پیشرفته‌تر از `conditional loading` است
- در React 19 می‌توان از `use()` برای `await` کردن `promise` در `render` استفاده کرد

## 🎯 سوالات رایج مصاحبه

1. تفاوت `&&` و `ternary` چیست؟
2. مشکل `{count && <X />}` وقتی `count` صفر است چیست؟
3. `early return` چه مزیتی دارد؟
4. `conditional rendering` چه تأثیری روی `performance` دارد؟

## خلاصه

با `if`، `ternary` و `&&`، `Conditional Rendering` UI را با `state` همگام می‌کند. شرط‌های `boolean` صریح، جداسازی حالت‌ها و `early return` کد را خوانا و قابل نگهداری نگه می‌دارد.

## 📚 منابع (react.dev)

- [Conditional Rendering](https://react.dev/learn/conditional-rendering)
- [Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
