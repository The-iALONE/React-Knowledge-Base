# Diffing Algorithm — الگوریتم مقایسه درخت

> قوانین O(n) که React برای مقایسه دو درخت `React Element` در یک سطح استفاده می‌کند — پایه رفتار `key`، حفظ `state` و عملکرد لیست‌ها.

> 🧭 پیش‌نیاز: [Reconciliation](./Reconciliation.md) · بعدی: [Keys & Performance](./Keys-And-Performance.md)

---

## 📖 مفهوم

الگوریتم `diff` (`Diffing Algorithm`) مجموعه قوانینی است که React هنگام `reconciliation` رعایت می‌کند: فقط درخت‌هایی با عمق یکسان در هر مرحله مقایسه می‌شوند، `type` تعیین می‌کند instance حفظ شود یا نه، و در لیست‌ها `key` آیتم‌ها را به هم وصل می‌کند.

پیچیدگی خطی O(n) است — فرض: جابه‌جایی گسترده بین سطوح درخت نادر است.

---

## چرا این ویژگی وجود دارد؟

مقایسه کامل دو درخت UI می‌تواند نمایی باشد. React با فرض‌های معقول (ساختار پایدار، `key` در لیست) الگوریتمی سریع و قابل پیش‌بینی ارائه می‌دهد.

---

## چه مشکلی را حل می‌کند؟

- حداقل‌سازی دستکاری DOM
- پیش‌بینی رفتار `state` هنگام تغییر JSX
- عملکرد قابل قبول در لیست‌های بزرگ با `key` درست

---

## ⚙️ نحوه کار — سه قانون اصلی

### ۱. فقط هم‌سطح (same level)

در این الگوریتم، درخت سطح‌به‌سطح مقایسه می‌شود — نه بین والد و نوه در یک گام.

```
<div>           <div>
  <p>A</p>   vs    <span>B</span>
</div>          </div>
```

ابتدا `div` با `div`؛ سپس فرزندان: `p` با `span` → `type` متفاوت → unmount `p`، mount `span`.

### ۲. `type` یکسان → به‌روز `props`

اگر `type` همان باشد (مثلاً هر دو `Counter`)، همان instance و `state` داخلی حفظ می‌شود؛ فقط `props` و فرزندان diff می‌شوند.

### ۳. `type` متفاوت → unmount + mount

```jsx
{tab === "profile" ? <ProfileTab /> : <SettingsTab />}
```

سوئیچ بین دو کامپوننت مختلف → `state` هر تب جدا؛ برگشت به تب قبلی اگر `type`/`key` عوض شده باشد ممکن است `state` ریست شود.

---

## سناریوی جزوه — تب Wild Oasis

در پروژه react.dev / Wild Oasis:

- تب «پروفایل» و «منو» در **همان موقعیت** رندر می‌شوند
- اگر **همان کامپوننت** با **همان `type`** بماند → `state` (لایک، باز/بسته بودن متن) **حفظ** می‌شود
- اگر محتوا با `type` دیگر جایگزین شود → `state` **ریست** می‌شود

```
قبل:  <TabContent type="posts" />   → state لایک = ۵
بعد:  <TabContent type="posts" />   → state لایک = ۵  ✅ حفظ

قبل:  <PostsPanel />                → state داخلی
بعد:  <ProfilePanel />              → mount جدید، state ریست  ❌
```

---

## لیست‌ها و `key`

بدون `key` پایدار، React فرزندان را بر اساس **ترتیب** تطبیق می‌دهد — جابه‌جایی یا حذف/درج می‌تواند `state` اشتباه به node دیگر بدهد.

```jsx
// بد — index به‌عنوان key هنگام reorder
items.map((item, index) => <Row key={index} item={item} />)

// خوب — id پایدار
items.map((item) => <Row key={item.id} item={item} />)
```

جزئیات: [Keys-And-Performance.md](./Keys-And-Performance.md)

---

## دیاگرام — before / after

```
درخت قبلی          درخت جدید           اقدام React
──────────          ──────────           ───────────
div                 div                  update props
  p "Hi"              p "Hello"            update text
  Counter             Counter              update (state حفظ)
                      Button (جدید)        insert
  OldList             —                    delete subtree
```

---

## 💡 مثال ساده

```jsx
function App() {
  const [show, setShow] = useState(true);
  return (
    <div>
      <button onClick={() => setShow((s) => !s)}>Toggle</button>
      {show ? <ExpensiveList /> : <Placeholder />}
    </div>
  );
}
```

هر toggle بین `ExpensiveList` و `Placeholder` → `type` متفاوت → unmount یکی، mount دیگری → `state` داخلی هر کدام از بین می‌رود.

---

## مثال واقعی در پروژه

**جستجو در هدر:** وقتی `SearchBar` همیشه در همان جای درخت با همان `type` رندر شود، `state` فوکوس و متن جستجو حفظ می‌شود — حتی اگر `props` از والد عوض شود. اگر شرطی `SearchBar` را با `div` جایگزین کنید، `state` از بین می‌رود.

---

## ⚠️ اشتباهات رایج

- جابه‌جایی `type` کامپوننت در JSX بدون قصد ریست `state`
- `key={index}` در لیست قابل مرتب‌سازی
- ساخت درخت عمیقاً متفاوت در هر رندر بدون `key` برای حفظ هویت

---

## 🚀 Best Practices

- ساختار JSX را تا حد ممکن پایدار نگه دارید
- برای ریست عمدی `state`، `key` عوض کنید: `<Form key={userId} />`
- لیست‌ها: `key` پایدار و یکتا

---

## ارتباط با مفاهیم دیگر

- [Reconciliation.md](./Reconciliation.md) — چارچوب کلی
- [Keys-And-Performance.md](./Keys-And-Performance.md) — `key` و عملکرد
- [Virtual-DOM.md](./Virtual-DOM.md) — درخت مقایسه‌شده
- [State.md](../State.md) — `state` و موقعیت در درخت

---

## خلاصه

الگوریتم `diff` سه اصل دارد: هم‌سطح، `type` یکسان = حفظ instance، `type` متفاوت = mount/unmount. در لیست‌ها `key` ضروری است. رفتار تب Wild Oasis نمونه حفظ/ریست `state` است.

---

## 📚 منابع

- [React — Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
- [React — Render and Commit](https://react.dev/learn/render-and-commit)
