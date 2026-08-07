# Project Structure

> 🧭 پیش‌نیاز: [Installation](./Installation.md) · بعدی: [JSX](./JSX.md)

ساختار پیشنهادی پروژه React **و** ساختار اجباری مخزن مستندات `React-Knowledge-Base`.

---

## 📖 مفهوم

این فایل دو سطح ساختار را تعریف می‌کند: (۱) پوشه‌بندی اپ React در `src/` و (۲) پوشه‌بندی و قالب فایل‌های markdown در همین مخزن دانش. **هر فایل جدید در این پروژه باید طبق بخش دوم همین سند ساخته شود.**

---

## چرا این ویژگی وجود دارد؟

سازماندهی فایل‌ها در پروژه بزرگ React و یکنواخت نگه داشتن مستندات هنگام رشد چندین milestone.

---

## چه مشکلی را حل می‌کند؟

پیدا کردن سریع فایل‌ها، جلوگیری از تکرار محتوا در مسیرهای مختلف، و هم‌خوانی با `README.md`، `Learning-Path.md` و `WhatsNew.md`.

---

## ⚙️ نحوه کار — ساختار اپ React (`src/`)

```
src/
├── components/   # UI مشترک
├── features/     # ماژول‌های دامنه (cart, auth)
├── hooks/        # custom hooks
├── contexts/     # React contexts
├── services/     # API calls
├── pages/        # route-level components
├── utils/
└── App.jsx
```

---

## ساختار مخزن مستندات (اجباری)

### درخت پوشه‌ها

```
React-Knowledge-Base/
├── README.md              # فهرست اصلی
├── Learning-Path.md       # مسیر یادگیری
├── ROADMAP.md             # پیشرفت milestone
├── WhatsNew.md            # مفاهیم جدید غیرجزوه
├── Cheatsheet.md · Glossary.md
│
├── Introduction.md …      # مبانی Core (M2) — فایل تکی در ریشه
│
├── Hooks/                   # هر Hook یک فایل + README.md
├── Patterns/                # هر الگو یک فایل + README.md
├── Escape-Hatches/          # هر مبحث M5 یک فایل + README.md
├── Performance/             # M6
├── State-Management/        # M7
├── React-Router/            # M8
├── Styling/                 # M9
├── Nextjs/                  # M10
│
├── React-APIs.md …          # M11 Reference (ریشه — ضمیمه Learning-Path)
│   React-APIs · React-DOM-APIs · Best-Practices · Common-Pitfalls
│   FAQ · Interview-Questions · Migration-Notes
│
└── Examples/
    ├── patterns/
    ├── escape-hatches/
    ├── performance/
    └── …                    # زیرپوشه هم‌نام ماژول
```

### قوانین قرارگیری فایل

| نوع محتوا | محل | نام فایل |
|-----------|-----|----------|
| مبانی Core (M2) | ریشه | `PascalCase-With-Hyphens.md` |
| `Hook` | `Hooks/` | `useX.md` + `Hooks/README.md` |
| الگو (M4) | `Patterns/` | `Topic.md` + `Patterns/README.md` |
| Escape Hatches (M5) | `Escape-Hatches/` | `Topic.md` + `Escape-Hatches/README.md` |
| ماژول تخصصی | پوشهٔ همان ماژول | `README.md` + فایل‌های موضوع |
| Reference (M11) | ریشه | `React-APIs.md`، `FAQ.md`، … — ضمیمه غیرخطی |
| مثال کد | `Examples/{module}/` | `.jsx` / `.js` |
| **ممنوع** | ریشه | تکرار فایلی که در پوشهٔ ماژول هست (مثلاً `./Suspense.md` و `Escape-Hatches/Suspense.md`) |

### لینک‌دهی

- از ریشه به ماژول: `./Escape-Hatches/Suspense.md`
- از داخل پوشه به Core: `../Refs.md`
- هاب ماژول: `Escape-Hatches/README.md` (نه `Escape-Hatches.md` در ریشه)

---

## قالب اجباری فایل markdown

### فایل موضوعی (غیر README)

ترتیب بخش‌ها **حتماً** رعایت شود. بخش‌های میانی موضوع‌محور (مثل `Syntax`، `💡 مثال`) بین «نحوه کار» و «Best Practices» مجازند.

| # | بخش | اجباری |
|---|-----|--------|
| 1 | `# عنوان` + blockquote یک‌خطی (اختیاری) | توصیه |
| 1.۵ | `> 🧭 پیش‌نیاز: [...] · بعدی: [...]` | **بله** (فایل موضوعی) |
| 2 | `## 📖 مفهوم` | **بله** |
| 3 | `## چرا` یا `## چرا این ویژگی وجود دارد؟` | **بله** |
| 4 | `## چه مشکلی را حل می‌کند؟` | **بله** |
| 5 | `## ⚙️ نحوه کار` | بله (اگر مفهوم عملیاتی است) |
| 6 | `Syntax` / مثال‌ها / جداول تخصصی | بر حسب موضوع |
| 7 | `## مثال واقعی در پروژه` | توصیه (یک پاراگراف) |
| 8 | `## 🚀 Best Practices` | توصیه |
| 9 | `## ⚠️ اشتباهات رایج` | توصیه |
| 10 | `## ارتباط با مفاهیم دیگر` | **بله** |
| 11 | `## خلاصه` | **بله** |
| 12 | `## 📚 منابع` | **بله** |

### فایل `README.md` داخل پوشهٔ ماژول

حداقل: `## 📖 مفهوم` → `## چرا` → نقشه/جدول فایل‌ها → `## خلاصه` → `## 📚 منابع`.  
بخش `## چه مشکلی را حل می‌کند؟` برای README هاب اختیاری است.

### نام‌گذاری

- فایل: `PascalCase-With-Hyphens.md` (انگلیسی)
- پوشه ماژول: `PascalCase` یا `kebab-case` مطابق موجود (`Escape-Hatches`، `State-Management`)

### اشاره به نام فایل در بلوک‌های کد

وقتی بلوک کد مربوط به **یک فایل مشخص** در پروژه است (پیکربندی، entry، route و غیره)، نام فایل را صریح بنویسید:

1. **در متن فارسی** قبل از بلوک — مثلاً «در فایل `next.config.js`…»
2. **در کامنت اول بلوک** — مثلاً `// next.config.js`

| نوع | نام فایل معمول |
| --- | -------------- |
| Next.js config | `next.config.js` · `next.config.mjs` · `next.config.ts` |
| Babel | `babel.config.js` |
| Vite | `vite.config.js` · `vite.config.ts` |
| ESLint (flat) | `eslint.config.js` · `eslint.config.mjs` |
| App Router page | `app/page.js` · `app/page.tsx` |

**مثال:**

```js
// next.config.js — ریشهٔ پروژه
const nextConfig = { reactCompiler: true };
module.exports = nextConfig;
```

❌ بلوک پیکربندی بدون نام فایل — خواننده نمی‌داند کجا paste کند.

### استاندارد مخصوص `State-Management/`

- فایل [State-Types.md](./State-Management/State-Types.md) هاب taxonomy انواع `state` است — هر فایل ابزار باید در بخش «ارتباط» به آن لینک بدهد.
- هر فایل ابزار (`Context-API.md`، `Redux.md`، `Zustand.md` و غیره) باید در بخش «ارتباط» به **حداقل یک ابزار مشابه/جایگزین** لینک بدهد (برای تفاوت‌گذاری صریح).
- مثال کد فقط در `Examples/state-management/`.

---

## مثال واقعی در پروژه

**اپ React:** fast-react-pizza — `features/cart/`, `features/menu/`, `ui/`, `services/apiRestaurant.js`

**مخزن مستندات:** الگوی `Patterns/React-Memo.md` برای قالب؛ الگوی `Patterns/` برای پوشه‌بندی ماژول M4 و `Escape-Hatches/` برای M5.

---

## 🚀 Best Practices

✅ قبل از ساخت فایل جدید، محل و نام را در این سند چک کنید  
✅ فایل‌های مرتبط را در یک پوشه `colocate` کنید  
✅ مثال کد فقط در `Examples/{module}/`  
✅ قبل از هر تغییر محتوا، [react.dev](https://react.dev) برای همان مبحث بررسی شود  
✅ بعد از افزودن فایل: `README.md`، `Learning-Path.md`، `WhatsNew.md` (در صورت مفهوم جدید غیرجزوه)، `Glossary.md` (در صورت نیاز)
✅ در بلوک‌های پیکربندی و entry، نام فایل مقصد را در متن و کامنت اول بلوک بنویس (`next.config.js`، `babel.config.js` و مشابه)

---

## ⚠️ اشتباهات رایج

❌ تکرار همان محتوا در ریشه و زیرپوشه  
❌ ساخت فایل در ریشه وقتی ماژول پوشهٔ اختصاصی دارد  
❌ نادیده گرفتن خط ناوبری `> 🧭 پیش‌نیاز` در فایل‌های موضوعی
❌ بلوک `next.config.js` / `babel.config.js` / route بدون اشاره به نام فایل در متن یا کامنت

---

## ارتباط با مفاهیم دیگر

- [README.md](./README.md) — فهرست و قوانین توسعه
- [ROADMAP.md](./ROADMAP.md) — قوانین AI و milestoneها
- [Learning-Path.md](./Learning-Path.md) — ترتیب مطالعه
- [Components](./Components.md) · [Custom Hooks](./Custom-Hooks.md)

---

## خلاصه

ساختار `feature-based` برای اپ React؛ برای مخزن مستندات، هر ماژول در پوشهٔ خود با `README.md` هاب و قالب بخش‌های اجباری طبق جدول بالا.

---

## 📚 منابع

- [React Documentation](https://react.dev)
- [Patterns/README.md](./Patterns/README.md) — نمونه هاب ماژول
- [Escape-Hatches/README.md](./Escape-Hatches/README.md) — نمونه هاب M5
