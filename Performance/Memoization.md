# Memoization — به‌خاطرسپاری در React

> تکنیک‌هایی برای جلوگیری از کار تکراری در رندر: `React.memo`، `useMemo`، `useCallback` و الگوی `children-as-prop` — با تمرکز بر **چه زمانی** لازم است، نه فقط نحوه استفاده.

> 🧭 پیش‌نیاز: [State Colocation](./State-Colocation.md) · [React.memo](../Patterns/React-Memo.md) · بعدی: [Code Splitting](./Code-Splitting.md)

---

## 📖 مفهوم

به‌خاطرسپاری (`Memoization`) در React یعنی نتیجه رندر، محاسبه یا تابع را بین رندرها نگه داریم تا وقتی ورودی‌ها (`props`، `deps`) عوض نشده‌اند، دوباره ساخته یا اجرا نشوند. ابزارها: `memo` (کامپوننت)، `useMemo` (مقدار)، `useCallback` (تابع)، و الگوی پاس دادن JSX از قبل ساخته‌شده به‌عنوان `children`.

---

## چرا این ویژگی وجود دارد؟

والد با هر `re-render`، فرزندان بدون `memo` هم رندر می‌شوند — حتی اگر `props` یکسان باشند. در UIهای سنگین (لیست بزرگ، نمودار، ویرایشگر) این هزینه محسوس می‌شود.

---

## چه مشکلی را حل می‌کند؟

- `re-render` غیرضروری کامپوننت‌های `pure`
- ساخت مجدد `object`/`function` در هر رندر که `memo` را می‌شکند
- محاسبات گران تکراری در body کامپوننت

---

## ⚙️ نحوه کار — ماتریس ابزارها

| ابزار | چه چیزی را cache می‌کند | کی استفاده کنیم |
|-------|-------------------------|-----------------|
| `React.memo` | نتیجه رندر کامپوننت | فرزند `pure` با `props` کم‌تغییر |
| `useMemo` | مقدار محاسبه‌شده | فیلتر/sort گران، `object` پایدار برای `memo` |
| `useCallback` | تابع | `callback` پاس‌داده به فرزند `memo`شده |
| `children` pattern | JSX از قبل ساخته | جدا کردن `state` متغیر از subtree سنگین |

مستندات API: [Patterns/React-Memo.md](../Patterns/React-Memo.md)، [Hooks/useMemo.md](../Hooks/useMemo.md)، [Hooks/useCallback.md](../Hooks/useCallback.md)

---

## Children-as-prop Optimization (از جزوه)

وقتی JSX فرزند **قبل از** `re-render` والد ساخته شود، آن subtree تحت تأثیر `state` داخل والد قرار نمی‌گیرد:

```jsx
// App رندر → SlowComponent اینجا ساخته می‌شود
function App() {
  return (
    <Counter>
      <SlowComponent />
    </Counter>
  );
}

function Counter({ children }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>
      {children}
    </div>
  );
}
```

کلیک روی دکمه → `Counter` رندر می‌شود → `children` همان reference قبلی است → `SlowComponent` دوباره رندر **نمی‌شود**.

همین الگو با prop معمولی هم کار می‌کند اگر JSX در والد بالاتر ساخته شده باشد.

مثال کد: [Examples/performance/ChildrenOptimization.jsx](../Examples/performance/ChildrenOptimization.jsx)

---

## `memo` و شکستن cache

`memo` با `Object.is` هر `prop` را مقایسه می‌کند:

```jsx
// هر رندر object جدید → memo بی‌فایده
<Archive archiveOptions={{ title: "Posts", show: true }} />

// useMemo برای props پایدار
const options = useMemo(() => ({ title: "Posts", show }), [show]);
<Archive archiveOptions={options} />
```

از جزوه: `Archive` با `memo` فقط وقتی `archiveOptions` و `onAddPost` پایدار باشند از رندر اضافه جلوگیری می‌کند.

---

## `useMemo` برای مقدار اولیه یک‌بار (ترفند جزوه)

```jsx
const [posts] = useState(() =>
  Array.from({ length: 10000 }, () => createRandomPost())
);
```

`useState` با initializer فقط یک‌بار اجرا می‌شود — جایگزین ساخت آرایه در هر رندر. برای داده ثابت، انتقال به بیرون کامپوننت هم ممکن است.

---

## React Compiler

با [React Compiler](../Escape-Hatches/React-Compiler.md) معمولاً `memo`/`useMemo`/`useCallback` دستی لازم نیست — کامپایلر به‌صورت خودکار cache می‌گذارد. بدون Compiler: اول Profiler، بعد بهینه‌سازی هدفمند.

---

## تفاوت با گزینه‌های مشابه

| گزینه | کی اولویت دارد؟ |
|-------|-----------------|
| `state colocation` vs `memo` | اول colocation — اغلب `memo` لازم نمی‌شود |
| `children` pattern vs `memo` | وقتی `state` والد و subtree سنگین جدا هستند، `children` ساده‌تر است |
| `useMemo` vs محاسبه در `render` | فقط برای محاسبه واقعاً گران یا `object` پایدار برای `memo` |
| `React Compiler` vs `memo` دستی | با Compiler، بهینه‌سازی دستی را کم کنید |
| `Context` vs `memo` | `memo` جلوی `context` تغییرکرده را نمی‌گیرد — split یا colocation |

---

## 💡 مثال ترکیبی

```jsx
const ProductRow = memo(function ProductRow({ product, onSelect }) {
  return <tr onClick={() => onSelect(product.id)}>{product.name}</tr>;
});

function ProductList({ products }) {
  const [filter, setFilter] = useState("");
  const filtered = useMemo(
    () => products.filter((p) => p.name.includes(filter)),
    [products, filter]
  );
  const handleSelect = useCallback((id) => console.log(id), []);
  return (
    <table>
      <tbody>
        {filtered.map((p) => (
          <ProductRow key={p.id} product={p} onSelect={handleSelect} />
        ))}
      </tbody>
    </table>
  );
}
```

مثال کامل: [Examples/performance/MemoizedList.jsx](../Examples/performance/MemoizedList.jsx)

---

## مثال واقعی در پروژه

**آرشیو پست‌ها (جزوه):** `Archive` با `memo` + `useMemo` برای `archiveOptions` + `useCallback` برای `onAddPost` — بدون این سه‌تایی، هر تایپ در جستجوی والد کل آرشیو را دوباره رندر می‌کند.

---

## ⚠️ اشتباهات رایج

- `memo` روی همه کامپوننت‌ها بدون اندازه‌گیری
- `useMemo` برای محاسبه ارزان (هزینه cache > سود)
- `useCallback` بدون فرزند `memo`شده
- فراموش کردن `key` پایدار در لیست `memo`شده

---

## 🚀 Best Practices

1. `children` به‌صورت JSX برای wrapperها
2. `state` محلی و colocation → [State-Colocation.md](./State-Colocation.md)
3. رندر `pure` — باگ را fix کنید، نه با `memo` بپوشانید
4. اول Profiler → [Profiling.md](./Profiling.md)
5. با Compiler، بهینه‌سازی دستی را کم کنید

---

## ارتباط با مفاهیم دیگر

- [Re-render.md](./Re-render.md) — چرا `memo` لازم می‌شود
- [Patterns/React-Memo.md](../Patterns/React-Memo.md)
- [Hooks/useMemo.md](../Hooks/useMemo.md) · [Hooks/useCallback.md](../Hooks/useCallback.md)
- [Rendering.md](../Rendering.md) — بهینه‌سازی `children` در M2

---

## خلاصه

ابزارهای `memo`، `useMemo`، `useCallback` و الگوی `children` برای کاهش کار تکراری در رندر. فقط وقتی پروفایلر مشکل نشان دهد. `props` ناپایدار cache را می‌شکند. Compiler جایگزین بسیاری از بهینه‌سازی‌های دستی است.

---

## 📚 منابع

- [React — memo](https://react.dev/reference/react/memo)
- [React — useMemo](https://react.dev/reference/react/useMemo)
- [React — useCallback](https://react.dev/reference/react/useCallback)
- [React — React Compiler](https://react.dev/learn/react-compiler)
