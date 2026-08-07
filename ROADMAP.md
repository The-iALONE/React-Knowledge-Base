# ROADMAP — React Knowledge Base

> این فایل پیشرفت پروژه را ردیابی می‌کند. بعد از هر فاز تیک می‌خورد و به‌عنوان changelog دائمی باقی می‌ماند.

## قانون کاری AI

قبل از شروع هر تغییر در این پروژه، AI باید:

1. پلن کار را به‌طور خلاصه بنویسد (چه کاری می‌خواهد انجام دهد).
2. مشخص کند چه فایل‌هایی ساخته، ویرایش یا حذف می‌شوند.
3. از کاربر بپرسد که آیا ادامه بدهد یا نه، و منتظر تایید بماند قبل از اعمال تغییرات.
4. **قبل از هر تغییر** (افزودن، ویرایش یا حذف فایل — نه فقط شروع فاز)، آخرین نسخه [مستندات رسمی React](https://react.dev) را برای **همان مبحث** بررسی کند — API، رفتار، و نسخه. مستندات رسمی Source of Truth است؛ جزوه قدیمی به‌تنهایی کافی نیست. در صورت تناقض → react.dev مرجع نهایی.
5. بعد از هر تغییر (افزودن، ویرایش یا حذف فایل)، `README.md`، `Learning-Path.md` و `WhatsNew.md` را بررسی و در صورت نیاز به‌روزرسانی کند — لینک جدید، جای‌گذاری در ماژول درست، افزودن آیتم به `Learning-Path` (بدون تیک milestone — چک‌باکس‌ها فقط پیشرفت مطالعهٔ کاربر است)، ثبت مفاهیم جدید غیرجزوه در `WhatsNew.md`.
6. **ساختار فایل‌ها و پوشه‌ها حتماً طبق [Project-Structure.md](./Project-Structure.md) باشد** — محل قرارگیری در درخت مخزن، نام `PascalCase-With-Hyphens.md`، قالب بخش‌های اجباری markdown، اشاره به نام فایل در بلوک‌های پیکربندی، و ممنوعیت تکرار فایل در ریشه و زیرپوشه. قبل از ساخت فایل جدید این سند را بخواند.
7. **خط ناوبری اجباری:** هر فایل موضوعی بلافاصله بعد از عنوان (و blockquote اختیاری) باید یک خط ناوبری داشته باشد: `> 🧭 پیش‌نیاز: [...] · بعدی: [...]`. این خط مکمل بخش «ارتباط با مفاهیم دیگر» است، نه جایگزین آن.
8. **پوشش کامل:** فقدان یک زیرمبحث در جزوه یا عکس‌ها دلیلی برای حذف آن نیست. هر زیرشاخه مهم برای فهم کامل موضوع باید اضافه شود — حتی اگر منبعش فقط مستندات رسمی یا دانش عمومی باشد.
9. **منبع دوم Next.js:** برای هر فایل داخل `Nextjs/`، علاوه بر [react.dev](https://react.dev) (برای مفاهیم React مثل RSC)، باید [nextjs.org/docs](https://nextjs.org/docs) به‌طور مستقل به‌عنوان Source of Truth مخصوص Next.js بررسی شود (`routing`، `caching`، `rendering strategies`، `Server Actions`، `middleware` و غیره). React و Next.js را قاطی نکن.
10. **لحن آموزشی:** متن باید شبیه یادداشت زندهٔ یک مدرس خوب باشد — با مثال ذهنی، لحن مکالمه‌ای در حد لازم، و توضیح «چرا» و «کی» — نه فقط فهرست خشک.  
    **مثال بد:** «`useReducer` برای `state` پیچیده استفاده می‌شود.»  
    **مثال خوب:** «وقتی فرم رزرو کابین چند فیلد و چند `action` دارد، `useState` سریع شلوغ می‌شود؛ اینجا `useReducer` منطق به‌روزرسانی را در یک جا جمع می‌کند.»
11. وقتی کاربر گفت **تغییرات را کامیت کن** یا **پوش کن**:
   - **بازبینی (Review)** روی فایل‌های تغییر یافته انجام دهد (قبل از `git add`):
     - چک‌لیست react.dev: محتوا با مستندات رسمی همان مبحث هم‌خوان باشد (قانون ۴)
     - چک‌لیست RTL: جملهٔ اول فارسی در `## 📖 مفهوم`، بدون شروع جمله با انگلیسی، اصطلاحات فنی backtick‌شده
     - چک‌لیست ناوبری: خط `> 🧭 پیش‌نیاز` در فایل‌های موضوعی (قانون ۷)
     - چک‌لیست ساختار: [Project-Structure.md](./Project-Structure.md) — محل پوشه، قالب بخش‌ها، بدون تکرار ریشه/زیرپوشه، نام فایل در بلوک‌های پیکربندی
     - لینک‌های داخلی شکسته نباشند
     - `README.md`، `Learning-Path.md` و `WhatsNew.md` با فایل‌های جدید/ویرایش‌شده هم‌خوان باشند
   - `git status` و `git diff` را بررسی کند
   - فقط فایل‌های مرتبط با پروژه را `git add` کند (نه `.obsidian/workspace.json`)
   - پیام کامیت شفاف بنویسد (شامل نام Milestone فعلی، مثلاً `M3`) — **همیشه به انگلیسی** (مثال: `Retrofit M4: align Patterns with M7 standard`)
   - `git push origin main` (یا شاخهٔ فعال) به ریپازیتوری GitHub انجام دهد
   - در `ROADMAP.md` changelog ثبت کند

**Milestone فعلی:** `M12` (تکمیل)  
**شاخهٔ اصلی:** `main`  
**ریپازیتوری:** [github.com](https://github.com) — `React-Knowledge-Base` (خصوصی)

**آخرین به‌روزرسانی:** 2026-08-07 (M12 QA)

---

## منابع و اصول ترکیب محتوا

### منابع پروژه

1. **جزوه‌های Word من** (`آرشیو جزوه قدیمی/`, `_extracted-notes/`) — منبع اصلی
2. **React Official Documentation** ([react.dev](https://react.dev)) — Source of Truth برای React
3. **Next.js Documentation** ([nextjs.org/docs](https://nextjs.org/docs)) — Source of Truth دوم برای Next.js (جدا از React)

### قوانین ترکیب

- هیچ نکته مهمی از جزوه حذف نشود.
- نکته ناقص → با مستندات رسمی تکمیل شود.
- توضیح اشتباه/قدیمی → طبق مستندات رسمی اصلاح شود.
- مفهوم مهم غایب در جزوه ولی ضروری برای فهم مبحث → از مستندات رسمی اضافه شود.
- مفهوم/API/الگوی جدیدی که React در نسخه‌های رسمی جدیدتر افزوده → باید در این پروژه لحاظ شود، حتی اگر در جزوه نباشد.
- در صورت تناقض بین جزوه و مستندات رسمی → **مستندات رسمی React مرجع نهایی است**.

### قوانین نگارش فارسی و RTL

متن‌های جزوه باید برای نمایش در محیط‌های RTL مثل Obsidian آماده باشند:

- هیچ جمله یا خطی با کلمهٔ انگلیسی (حتی با backtick یا نام `Hook`) شروع نشود؛ ترتیب جمله را عوض کنید تا با فارسی آغاز شود.
- اصطلاحات و کلیدواژه‌های کد/API (نام `Hook`ها، `state`، `props`، `mutate`، `render`، `cache`، `trigger`، `batch` و مشابه) همیشه داخل backtick قرار گیرند.
- اسم‌های خاص فناوری در سطح رایج جزوه (React، Next.js، JSX، DOM، UI، API، CSS، HTML) بدون backtick باقی می‌مانند، مگر داخل بلوک کد — ولی **هرگز در ابتدای جمله** نیاورید.
- از قرار گرفتن اصطلاح انگلیسیِ بدون backtick بلافاصله بعد از پرانتز یا علائم نگارشی فارسی پرهیز شود (مثال: «(برخلاف `props`)» به‌جای «(برخلاف props)»).
- از **bold** برای اصطلاحات انگلیسی کد استفاده نکنید؛ فقط backtick.
- کد JSX/JS فقط داخل بلوک ` ``` ` باشد، نه در متن فارسی.
- این قوانین هنگام افزودن یا ویرایش هر فایل رعایت و بازبینی شوند.

**مثال بد:** `React یک library برای ساخت UI است.`  
**مثال خوب:** `در React از یک library برای ساخت UI استفاده می‌کنیم.`

#### قالب استاندارد بخش `## 📖 مفهوم`

هر فایل محتوایی باید این بخش را داشته باشد (عنوان دقیقاً `## 📖 مفهوم`):

1. **جملهٔ اول فارسی** — تعریف مفهوم بدون شروع با انگلیسی.
2. **نام انگلیسی** در ادامهٔ جمله با backtick یا داخل پرانتز.
3. **۱–۳ جملهٔ توضیح** با اصطلاحات فنی backtick‌شده.

**الگوهای مجاز:**

```markdown
## 📖 مفهوم

دادهٔ داخلی کامپوننت را `state` می‌نامند (برخلاف `props`). با `useState` یا `useReducer` مدیریت می‌شود.
```

```markdown
## 📖 مفهوم

در کامپوننت‌های تابعی، از `useState` برای نگه‌داری `state` محلی استفاده می‌شود. یک متغیر `state` و تابع به‌روزرسانی برمی‌گرداند.
```

```markdown
## 📖 مفهوم

یکی از APIهای `react-dom` است که `Portal` نام دارد. JSX را در جای دیگری از DOM قرار می‌دهد.
```

**الگوهای ممنوع در مفهوم:**

- `React یک کتابخانه...` (شروع با React)
- `` `useState` به کامپوننت...`` یا `با `useState` می‌توان...` (شروع با نام Hook)
- `**Lifecycle** مراحل...` (bold انگلیسی)
- `Props ورودی...` (شروع با انگلیسی)

#### چک‌لیست قبل از اتمام هر فایل

- [ ] محتوا با [react.dev](https://react.dev) برای همان مبحث بررسی و هم‌خوان است (قانون ۴)
- [ ] بخش `## 📖 مفهوم` وجود دارد و جملهٔ اول فارسی است
- [ ] هیچ جمله‌ای در کل فایل با انگلیسی شروع نشده (به‌جز عناوین `#` فایل)
- [ ] اصطلاحات فنی backtick دارند
- [ ] محل فایل و قالب بخش‌ها مطابق [Project-Structure.md](./Project-Structure.md) است
- [ ] بلوک‌های پیکربندی/entry نام فایل مقصد دارند (`next.config.js` در متن + کامنت بلوک)
- [ ] خط ناوبری `> 🧭 پیش‌نیاز: ... · بعدی: ...` وجود دارد (قانون ۷)
- [ ] `README.md`، `Learning-Path.md` و `WhatsNew.md` در صورت افزودن/حذف/تغییر مفهوم به‌روز شده‌اند

#### قالب ساختار — مرجع اجباری

**همه فایل‌های محتوایی باید طبق [Project-Structure.md](./Project-Structure.md) ساخته شوند:**

- ماژول‌های موضوعی (`Hooks/`، `Patterns/`، `Escape-Hatches/`، …) → فایل داخل پوشه + `README.md` هاب
- فایل موضوعی → بخش‌های اجباری: `مفهوم`، `چرا`، `چه مشکلی را حل می‌کند؟`، `ارتباط`، `خلاصه`، `منابع`
- مثال کد → فقط `Examples/{module}/`
- **ممنوع:** همان فایل هم در ریشه و هم در زیرپوشه

---

## Git و ریپازیتوری

| مورد | مقدار |
|------|--------|
| ریپازیتوری | `React-Knowledge-Base` (خصوصی، GitHub) |
| شاخهٔ اصلی | `main` |
| مسیر محلی | ریشهٔ همین پوشه (`React-Knowledge-Base/`) |
| Milestone فعلی | **M12** — QA (تکمیل) |

### قانون کامیت و پوش

وقتی کاربر گفت «کامیت کن» / «پوش کن» / «تغییرات را ذخیره کن در گیت»:

1. **بازبینی (Review)** — قبل از استیج کردن:
   - react.dev: هم‌خوانی با مستندات رسمی مبحث (قانون ۴)
   - RTL: `## 📖 مفهوم`، شروع جمله با فارسی، backtick اصطلاحات فنی (بخش «قوانین نگارش فارسی و RTL»)
   - خط ناوبری `> 🧭 پیش‌نیاز` در فایل‌های موضوعی (قانون ۷)
   - ساختار: [Project-Structure.md](./Project-Structure.md) — پوشه، قالب بخش‌ها، عدم تکرار، نام فایل در بلوک‌های پیکربندی
   - لینک‌های داخلی و هم‌خوانی `README.md` / `Learning-Path.md` / `WhatsNew.md`
2. `git status` + `git diff` — بررسی تغییرات
3. `git add` فایل‌های مرتبط (رعایت `.gitignore`)
4. `git commit` با پیام **انگلیسی** شامل Milestone (مثال: `Retrofit M4: align Patterns with M7 standard (nav, structure, RTL)`) — متن کامیت فارسی نباشد
5. `git push origin main`
6. ثبت خلاصه در changelog پایین همین فایل

### نام‌گذاری Milestoneها (M)

| Milestone | فاز | موضوع |
|-----------|-----|--------|
| **M1** | Setup | تغییر نام پوشه‌ها، استخراج Word، اسکلت |
| **M2** | Core React | فایل‌های ریشه (۲۴ فایل) |
| **M3** | Hooks | README + ۱۹ Hook |
| **M4** | Patterns | README + ۵ الگو |
| **M5** | Escape Hatches | Concurrent، Suspense، RSC — **بعدی** |
| **M6** | Performance | بهینه‌سازی و چرخه رندر |
| **M7** | State Management | Context API، Redux، React Query، Zustand، Jotai |
| **M8** | React Router | مسیریابی |
| **M9** | Styling | CSS Modules و استایل |
| **M10** | Next.js | فریم‌ورک Next.js |
| **M11** | Reference | FAQ، Interview، APIها |
| **M12** | QA | بازبینی نهایی + retrofit M1–M6 با استاندارد ناوبری/لحن جدید |

---

## Milestoneها (فازها)

| Milestone | فاز | وضعیت | تاریخ تکمیل | یادداشت |
| --------- | --- | ----- | ----------- | ------- |
| **M1** | Setup (تغییر نام پوشه‌ها، استخراج Word، اسکلت) | [x] | 2026-08-06 | 141 فایل Word استخراج شد |
| **M2** | Core React (فایل‌های ریشه) | [x] | 2026-08-07 | 24 فایل — retrofit: ناوبری، لحن آموزشی، react.dev، RTL |
| **M3** | Hooks | [x] | 2026-08-07 | ۲۱ فایل — retrofit: ناوبری، ساختار M7، لحن آموزشی، react.dev، لینک M2/M7 |
| **M4** | Patterns | [x] | 2026-08-06 | README + ۵ الگو + Examples — جزوه الگوهای پیشرفته |
| **M5** | Escape Hatches / Concurrent | [x] | 2026-08-06 | ۷ فایل + `Hooks/use.md` + `WhatsNew.md` + Examples — `use()`, `<Activity>`, RSC |
| **M6** | Performance | [x] | 2026-08-06 | retrofit 2026-08-07: ناوبری، ترتیب react.dev، ساختار M7 — Virtual DOM تا Common Mistakes |
| **M7** | State Management | [x] | 2026-08-07 | State-Types + ۱۰ ابزار + Examples — Zustand/Jotai/MobX/Recoil/RTK Query |
| **M8** | React Router | [x] | 2026-08-07 | README + ۵ موضوع + Protected Routes + Examples |
| **M9** | Styling | [x] | 2026-08-07 | README + Global/CSS Modules/Tailwind/CSS-in-JS + Examples |
| **M10** | Next.js | [x] | 2026-08-07 | README + ۱۷ موضوع + Examples — nav M7، Wild Oasis، nextjs.org |
| **M11** | Reference / FAQ / Interview | [x] | 2026-08-07 | ۷ فایل ریشه — API، FAQ، Interview، Migration — nav M7 |
| **M12** | QA نهایی | [x] | 2026-08-07 | Learning-Path: چک‌باکس‌ها فقط پیشرفت شخصی |

---

## Coverage — منبع Word → فایل مقصد

| منبع (آرشیو)                               | فایل(های) مقصد                                             | وضعیت                    |
| ------------------------------------------ | ---------------------------------------------------------- | ------------------------ |
| `ری اکت در پشت صحنه چطور کار می کند؟/*`    | Rendering, Performance/\*, Components                      | [x] M6                 |
| `useEffect-sideEffect-...`                 | Hooks/\*, Performance/Memoization                          | [x] Hooks                |
| `الگو های پیشرفته ری اکت/*`                | Patterns/\*, Portals                                       | [x] Patterns (Portals در M2) |
| `ماژول های CSS`, `روش های استایل دهی`      | Styling/\*                                                 | [x] M9                 |
| `مدیریت state/Context api and Redux/*`     | State-Management/\*, Context.md                            | [x] M7                 |
| `مدیریت state/React Query - remote data/*` | State-Management/React-Query.md                            | [x] M7                 |
| `مدیریت state/جزوه React Router/*`         | React-Router/\*                                            | [x] M8                 |
| `Next.js/*`                                | Nextjs/\*, Server-Components, Client-Components            | [x] M10                |
| `Supabase/*`                               | Nextjs/Backend-Integration-Supabase.md                     | [x] M10                |
| `herlpers for react + rfc +`               | Components.md, Quick-Start.md                              | [x]                      |
| _(react.dev — React 19.2)_                 | Hooks/useEffectEvent, Escape-Hatches, Activity, Nextjs/RSC | [x] M3 Hooks / [x] M5 / [x] M6 Performance / [x] M7 State / [x] M10 |
| _(غیرجزوه — M7)_                           | Zustand, Jotai, MobX, Recoil, State-Types, RTK Query       | [x] M7                 |
| _(retrofit — M12)_                         | M2: [x] · M3: [x] · M4: [x] · M5: [x] · M6: [x]           | [x] M12 (M1 بدون تغییر) |

### 2026-08-07 (M12 — QA)

- تیک M12 در جدول milestone
- Learning-Path: intro dual (پیشرفت شخصی vs ROADMAP)؛ همه چک‌باکس‌ها `[ ]` (ماژول ۰۵–۱۱ از `[x]` برگشت)؛ قانون ۵ AI هم‌خوان با مدل dual
- M1–M11 محتوا بدون تغییر

### 2026-08-07 (M11 — Reference)

- ایجاد ۷ فایل ریشه: `React-APIs`، `React-DOM-APIs`، `Best-Practices`، `Common-Pitfalls`، `FAQ`، `Interview-Questions`، `Migration-Notes`
- خط ناوبری `> 🧭 پیش‌نیاز` در هر ۷ فایل (زنجیره Supabase → … → Cheatsheet)
- ساختار M7: مفهوم، چرا، چه مشکلی، نحوه کار، Best Practices، اشتباهات، ارتباط، خلاصه، منابع
- تفکیک `Best-Practices`/`Common-Pitfalls` عمومی از `Performance/*` + لینک متقابل
- `Interview-Questions` هاب curated + لینک به `## Interview` در Hooks
- Learning-Path ضمیمه M11 با ترتیب پیشنهادی؛ Project-Structure درخت Reference
- ناوبری `Backend-Integration-Supabase` → `React-APIs`
- M1، M2–M10 (به‌جز nav Supabase) بدون تغییر محتوایی

### 2026-08-07 (M10 — Next.js)

- تکمیل `Nextjs/`: README + ۱۷ فایل موضوعی (۷ retrofit + ۱۱ جدید)
- خط ناوبری `> 🧭 پیش‌نیاز` در هر ۱۸ فایل (زنجیره CSS-in-JS → … → FAQ)
- ساختار M7: `## ⚠️ اشتباهات رایج`، غنی‌سازی از جزوه Wild Oasis (۶۷ نوت Next.js + ۷ Supabase)
- فایل‌های جدید: Rendering-Strategies، Streaming-And-Suspense، Server-Components (زاویه App Router)، Client-Server-Interleaving، Server-Actions، Route-Handlers، Middleware، Authentication-NextAuth، Metadata-And-SEO، Image-And-Font-Optimization، Backend-Integration-Supabase
- react.dev: `cacheSignal`، `prerender`/`resume` در Server-Components و Streaming
- `Examples/nextjs/`: OptimisticDelete، server-actions، RouteHandler، MiddlewareAuth، GenerateMetadata
- Learning-Path ماژول ۱۱ (`94`–`111`)؛ Glossary، Cheatsheet، WhatsNew M10
- M1، M7، M8، M9، M11–M12+ بدون تغییر محتوایی

### 2026-08-07 (M9 — Styling)

- ایجاد `Styling/`: README، Global-CSS، CSS-Modules، Tailwind-CSS، CSS-in-JS
- خط ناوبری `> 🧭 پیش‌نیاز` در هر ۵ فایل (زنجیره State-In-URL → … → Next.js)
- ساختار M7: `## چه مشکلی`، `## ⚙️ نحوه کار`، Best Practices، اشتباهات، ارتباط، خلاصه، منابع
- غنی‌سازی از جزوه: Worldwise (`index.css`، variables، Button/City module، `:global`، `NavLink` active، react-icons)
- Wild Oasis: `styled-components` (Filter، `styled(NavLink)`، LoginLayout)
- `Examples/styling/`: ButtonModule، NavLinkActive، StyledFilter
- Learning-Path ماژول ۱۰ (`89`–`93`)؛ شیفت Next.js به `94`–`111`
- README، Glossary (`CSS Modules`، `:global`، utility-first)، Cheatsheet Styling
- M1، M7، M8، M10–M12+ بدون تغییر محتوایی

### 2026-08-07 (M8 — React Router)

- ایجاد `React-Router/`: README، Routing-Basics، Nested-Routes، Dynamic-Routes، Navigation (+ Protected Routes)، State-In-URL
- خط ناوبری `> 🧭 پیش‌نیاز` در هر ۶ فایل (زنجیره README → … → Styling)
- ساختار M7: `## چه مشکلی`، `## ⚙️ نحوه کار`، Best Practices، اشتباهات، ارتباط، خلاصه، منابع
- غنی‌سازی از جزوه: Worldwise (nested، `useParams` نسبی)، Wild Oasis (`ProtectedRoute`، `useSearchParams` فیلتر/مرتب‌سازی)
- `createBrowserRouter` vs `BrowserRouter` در README؛ تفکیک محافظت مسیر SPA از Next.js middleware (M10)
- `Examples/react-router/`: NestedRoutes، DynamicRoutes، UrlSearchParams، ProtectedRoute
- Learning-Path ماژول ۰۹ (`83`–`88`)؛ لینک `State-Types`، `React-Hook-Form` → React-Router
- M1، M7، M9–M12+ بدون تغییر محتوایی

### 2026-08-07 (retrofit M6 — Performance)

- خط ناوبری `> 🧭 پیش‌نیاز` در هر ۱۴ فایل M6 (زنجیره README → Virtual DOM → … → Common Mistakes → State Management)
- ترتیب یادگیری: react.dev + مسیر دوره — Virtual DOM → Render Cycle → Re-render → Reconciliation → Diffing → Keys → **State Colocation** → Memoization → Code Splitting → Profiling → Optimization → Best/Common
- یکدست‌سازی ساختار M7: `## چه مشکلی` در README؛ `## ⚙️ نحوه کار` در Best-Practices و Common-Mistakes؛ بازچینی Render-Cycle
- غنی‌سازی HIGH: README، Render-Cycle، Memoization (`تفاوت با گزینه‌های مشابه`)، Best-Practices، Common-Mistakes
- غنی‌سازی MEDIUM: Code-Splitting (تفکیک M5)، Optimization-Techniques (virtualization)
- لینک‌های M4/M5/M7: React-Memo، Lazy-Loading، State-Types، Context-API
- اصلاح scaffold `Syntax (if applicable)` در Virtual-DOM
- Learning-Path ماژول ۰۷: ترتیب ۵۷–۷۰ هم‌تراز README
- کامنت Examples/performance/*.jsx → فایل markdown مربوط
- محتوای جزوه (Wild Oasis، Archive، CabinTable) حفظ شد
- M1، M7–M12+ بدون تغییر محتوایی

### 2026-08-07 (retrofit M5 — Escape Hatches)

- خط ناوبری `> 🧭 پیش‌نیاز` در هر ۸ فایل M5 (زنجیره README → Concurrent → Suspense → Lazy → use → RSC → Client → Compiler → Patterns)
- یکدست‌سازی ساختار M7: `## چه مشکلی` در README؛ `تفاوت با گزینه‌های مشابه` در Concurrent، use، Client، Compiler
- غنی‌سازی HIGH: README (`Activity` + Examples)، Concurrent (`flushSync`، `useDeferredValue` در مثال)، Suspense (`streaming`، `pre-warming`)، `use.md` (اصلاح بخش «چه مشکلی»)
- غنی‌سازی MEDIUM: Server (`cache()`، `'use server'`، Flight)، Client (جدول تفاوت)، Compiler (Next.js 15+ config)
- لینک‌های M6/M7: Code-Splitting، React-Query، Memoization، React-Memo
- بازبینی RTL: نمودار Server-Components، خلاصه `use.md`
- Learning-Path ماژول ۰۵: ترتیب مطالعه هم‌تراز README؛ شماره‌گذاری ۴۴–۵۱ + به‌روزرسانی ۵۲–۱۰۸
- اصلاح کامنت `ActivityDemo.jsx` (Escape-Hatches/README.md)
- قانون اشاره به نام فایل در بلوک‌های پیکربندی (`Project-Structure.md`، `ROADMAP.md`)؛ `next.config.js` در React-Compiler
- محتوای جزوه (`Activity`، fast-react-pizza، مثال‌های RSC) حفظ شد
- M1، M6–M8+ بدون تغییر

### 2026-08-07 (retrofit M4 — Patterns)

- خط ناوبری `> 🧭 پیش‌نیاز` در هر ۶ فایل Patterns (زنجیره README: Reusability → Compound → Render Props → HOC → React.memo → Performance)
- یکدست‌سازی ساختار M7: `## چه مشکلی`، `## ⚙️ نحوه کار`، `## 🚀 Best Practices`، `## ⚠️ اشتباهات رایج`، `## 📚 منابع`
- غنی‌سازی HIGH: README، Reusability-Patterns، Compound-Components، React-Memo
- غنی‌سازی MEDIUM: Render-Props، Higher-Order-Components
- لینک‌های M6/M7: Memoization، Profiler، Context-API، Redux، React-Query
- درخت تصمیم و جدول «تفاوت با گزینه‌های مشابه» در Reusability و React-Memo
- React 19 Context syntax در Compound-Components
- بازبینی RTL: خلاصه‌ها، جمله‌های شروع با انگلیسی
- Learning-Path ماژول ۰۶: ترتیب مطالعه هم‌تراز README
- محتوای جزوه (Modal named، Table، useOutsideClick، CabinTable) حفظ شد
- M1، M5–M8+ بدون تغییر

### 2026-08-07 (retrofit M3 — Hooks)

- خط ناوبری `> 🧭 پیش‌نیاز` در هر ۲۱ فایل Hooks (زنجیره Learning-Path ماژول ۰۴ + `use.md` در ۰۵)
- یکدست‌سازی ساختار M7: `## چه مشکلی`، `## ⚙️ نحوه کار`، `## 🚀 Best Practices`، `## ⚠️ اشتباهات رایج`، `## 📚 منابع`
- غنی‌سازی HIGH: README، useState، useEffect، useReducer، useMemo، useCallback، useRef
- غنی‌سازی MEDIUM: Effect family، useContext، Concurrent trio، Forms duo، useSyncExternalStore
- غنی‌سازی LOW: useImperativeHandle، useId، useDebugValue، use.md
- لینک‌های M2/M7/M5/M6: State-Types، React Query، Concurrent-Features، Profiler، Context-API، Zustand
- منابع react.dev: State as Snapshot، You Might Not Need an Effect، useEffectEvent، React 19 Forms
- بازبینی RTL: نمودارهای Effect، جمله‌های شروع با انگلیسی، `ID`/`DevTools`/`Hook`
- محتوای جزوه (مثال‌ها، Interview، When to Use) حفظ شد
- M1، M4–M8+ بدون تغییر (M4 بعداً retrofit شد)

### 2026-08-07 (retrofit M2 — Core React)

- خط ناوبری `> 🧭 پیش‌نیاز` در هر ۲۴ فایل M2 (زنجیره Learning-Path ماژول ۰۰–۰۳)
- غنی‌سازی HIGH: Introduction، Installation، Quick-Start، Thinking-in-React، Components، Props، State، JSX
- پولیش MEDIUM/LOW: Effects + `useEffectEvent`، Context split، `flushSync`، Error Boundary `resetKeys`، Portal bubbling
- اصلاح لینک‌های شکسته: `Common-Pitfalls`/`React-DOM-APIs` → Learning-Path / react.dev
- RTL: Rendering diagram، Forms/Lifting گام‌های شماره‌دار، Refs مقدار بازگشتی
- حذف scaffold `(if applicable)` از ۵ فایل؛ `Project-Structure` بخش اشتباهات جدا
- M1 بدون تغییر (Setup)

### 2026-08-07 (بازبینی RTL M7)

- اصلاح شروع جمله با انگلیسی در `## 📖 مفهوم` و `## خلاصه` فایل‌های State-Management
- اصلاح لینک شکسته به `React-Router/` (هنوز M8) → `Learning-Path` ماژول ۰۹
- افزودن `State-Types` به خط ناوبری `useReducer-Pattern` و `Redux-Toolkit`
- به‌روزرسانی چک‌لیست Review کامیت: قانون ۷ (ناوبری)

### 2026-08-07 (استاندارد جدید + M7 — State Management)

- قوانین AI ۷–۱۰: خط ناوبری، پوشش کامل، منبع دوم Next.js، لحن آموزشی
- منبع سوم: [nextjs.org/docs](https://nextjs.org/docs) برای فایل‌های `Nextjs/`
- [Project-Structure.md](./Project-Structure.md): ردیف خط ناوبری + استاندارد State-Management
- M7 تکمیل: `State-Types.md` (۱۱ نوع state) + ۱۰ فایل ابزار (Context تا RHF)
- ابزارهای غیرجزوه: Zustand، Jotai، MobX، Recoil، RTK Query
- `Examples/state-management/`: ۵ فایل نمونه
- به‌روزرسانی README، Learning-Path (ماژول ۰۸، شماره ۷۰–۸۱)، WhatsNew M7، Glossary، Cheatsheet
- بدهی M12: retrofit M2–M6 [x] (M1 بدون تغییر)؛ بازبینی RTL M3 در changelog
- Milestone فعلی: **M7** → بعدی **M8**

### 2026-08-06 (بازبینی RTL M6 + WhatsNew)

- اصلاح شروع جمله با انگلیسی در خلاصه‌ها و متن فارسی فایل‌های Performance
- افزودن بخش M6 به `WhatsNew.md`؛ لینک `Lists.md` در Keys-And-Performance
- اصلاح جدول Optimization-Techniques (حذف bold انگلیسی)

### 2026-08-06 (قوانین AI — react.dev اجباری + WhatsNew)

- قانون ۴: بررسی [react.dev](https://react.dev) **قبل از هر تغییر** (نه فقط شروع فاز)
- قانون ۵: افزودن `WhatsNew.md` به فهرست به‌روزرسانی بعد از هر تغییر (همراه `README.md` و `Learning-Path.md`)
- چک‌لیست فایل و بازبینی کامیت: react.dev + `WhatsNew.md`

### 2026-08-06 (M6 — Performance)

- تکمیل ۱۱ فایل جدید: `Re-render`، `Reconciliation`، `Diffing-Algorithm`، `Keys-And-Performance`، `Memoization`، `State-Colocation`، `Code-Splitting`، `Profiling`، `Optimization-Techniques`، `Best-Practices`، `Common-Mistakes`
- پولیش `Performance/README.md` — `## 📖 مفهوم`، `## چرا`، خلاصه
- `Examples/performance/`: `ChildrenOptimization.jsx`، `StateColocation.jsx` (+ `MemoizedList.jsx`)
- تیک Learning-Path ماژول ۰۷؛ Glossary (`Diffing`، `Fiber`، `Profiling`)؛ Cheatsheet Performance؛ لینک `Rendering.md` → Performance
- Coverage `ری اکت در پشت صحنه` → [x]؛ Milestone فعلی: **M6** → بعدی **M7**

### 2026-08-06 (ساختار Project-Structure + یکپارچه‌سازی Escape-Hatches/)

- گسترش [Project-Structure.md](./Project-Structure.md) — درخت مخزن مستندات + قالب اجباری بخش‌های markdown
- قانون ۶ AI و چک‌لیست Review: ساختار حتماً طبق Project-Structure
- حذف تکرار M5 در ریشه؛ انتقال به `Escape-Hatches/` (مثل `Patterns/`)
- اصلاح لینک‌های داخلی؛ `Hooks/use.md` → بخش `چه مشکلی را حل می‌کند؟`

### 2026-08-06 (M5 — Escape Hatches)

- ایجاد ۷ فایل: `Escape-Hatches`, `Suspense`, `Lazy-Loading`, `Concurrent-Features`, `Server-Components`, `Client-Components`, `React-Compiler`
- افزودن `Hooks/use.md` — `use(promise)` و `use(context)` (React 19)
- پوشش `<Activity>` (React 19.2) در `Escape-Hatches.md`
- ایجاد `WhatsNew.md` — فهرست مفاهیم غیرجزوه با لینک مستقیم
- `Examples/escape-hatches/`: `SuspenseLazy.jsx`, `UsePromise.jsx`, `ActivityDemo.jsx`
- تیک Learning-Path ماژول ۰۵؛ به‌روزرسانی README، Hooks/README، Glossary، Cheatsheet
- Milestone فعلی: **M5** → بعدی **M6**

### 2026-08-06 (بازبینی RTL M4 + قانون Review قبل از کامیت)

- بازبینی RTL فایل‌های Patterns: شروع جمله با فارسی، backtick اصطلاحات (`Hooks`، `primitive`، `Compiler`، `UI kit` و غیره)
- افزودن گام **بازبینی (Review)** به قانون کامیت/پوش در `ROADMAP.md` (قانون ۶ AI + بخش Git)

### 2026-08-06 (M4 — Patterns)

- ایجاد `Patterns/README.md` — نمای کلی، نقشه الگوها، ترتیب مطالعه
- غنی‌سازی ۵ فایل: `React.memo` (Compiler + `Object.is`), `Compound` (named modal, `cloneElement`, `useOutsideClick`, Table), `Render Props` (`Table.Body`/`CabinTable`), `HOC` (`forwardRef`), `Reusability` (ماتریس به‌روز)
- اصلاح RTL (`—even` → «حتی اگر») و لینک‌های شکسته به فایل‌های موجود
- به‌روزرسانی `Examples/patterns/`: `CompoundModal.jsx` + `CompoundModalNamed.jsx`
- تیک Learning-Path ماژول ۰۶؛ Milestone فعلی: **M4**

### 2026-08-06 (Git + Milestoneها)

- راه‌اندازی Git در `React-Knowledge-Base/` — شاخه `main`، `.gitignore` (شامل `workspace.json` Obsidian)
- افزودن بخش «Git و ریپازیتوری» و قانون ۶ (کامیت + پوش هنگام درخواست کاربر)
- تغییر نام فازها به **M1**–**M12**؛ Milestone فعلی: **M3**
- کامیت اولیه: M1–M3 + Learning-Path + قوانین RTL + اصلاحات مفهوم

### 2026-08-06 (استانداردسازی مفهوم + RTL همه فازهای موجود)

- یکسان‌سازی `## 📖 مفهوم` در ۵۹+ فایل (Core، Hooks، Patterns، Performance، State-Management، Next.js)
- بازنویسی مفهوم Hookها: الگوی «در …، از `useX` استفاده می‌شود» به‌جای شروع جمله با نام Hook
- اصلاح RTL کامل فازهای ۲، ۳، ۴، ۶، ۷، ۱۰ در فایل‌های موجود
- افزودن «قالب استاندارد مفهوم»، «چک‌لیست قبل از اتمام فایل» و قوانین سخت‌گیرانه‌تر در ROADMAP

### 2026-08-06 (اصلاح RTL فاز ۲ و ۳)

- اعمال کامل قوانین RTL (R1 شروع جمله، R2 backtick، R4 بعد از پرانتز) در ۲۴ فایل Core و ۲۰ فایل Hooks
- اصلاح نمودارهای متنی در `Rendering.md` و `Hooks/README.md`
- بازنویسی خطوط خلاصه انگلیسی‌اول (`Props`، `Context`، `Ref`، `Portal` و مشابه)

### 2026-08-06 (مسیر یادگیری + قوانین RTL)

- ساخت `Learning-Path.md` — مسیر پداگوژیک شماره‌گذاری‌شده (`00` تا `102`) با چک‌باکس پیشرفت
- افزودن قانون ۵ به «قانون کاری AI»: بررسی هم‌زمان `README.md` و `Learning-Path.md` بعد از هر تغییر
- افزودن بخش «قوانین نگارش فارسی و RTL»
- اصلاح نمونه RTL در `State.md`، `README.md`، `Cheatsheet.md`، `Glossary.md`

### 2026-08-06 (هم‌ترازی react.dev — فاز ۲/۳)

- افزودن ۳ hook از react.dev: `useEffectEvent`, `useInsertionEffect`, `useDebugValue`
- به‌روزرسانی React 19 در Core: Context بدون `.Provider`, ref as prop, ref callback cleanup, Form Actions
- به‌روزرسانی: `useDeferredValue(initialValue)`, `useId` prefix در 19.2

### 2026-08-06 (سیاست منابع)

- افزودن بخش «منابع و اصول ترکیب محتوا» (جزوه = منبع اصلی، react.dev = Source of Truth)
- افزودن قانون ۴ به «قانون کاری AI»: بررسی react.dev قبل از شروع هر فاز
- ثبت بدهی‌های react.dev (React 19.2) در فازهای ۳، ۵ و ۱۰

### 2026-08-06 (فاز ۳)

- تکمیل ۱۳ فایل Hook باقی‌مانده: useMemo, useCallback, useRef, useContext, useReducer, useTransition, useDeferredValue, useOptimistic, useActionState, useFormStatus, useSyncExternalStore, useImperativeHandle, useId
- فاز ۳ (Hooks) کامل شد — مجموع ۲۰ فایل در پوشه Hooks

### 2026-08-06 (فاز ۲)

- تکمیل 10 فایل باقی‌مانده Core React: Lifting-State-Up, Sharing-State, Context, Refs, DOM-Manipulation, Effects, Lifecycle, Error-Boundaries, Portals, Custom-Hooks
- فاز ۲ (Core React) کامل شد — مجموع 24 فایل ریشه
- پوشه `New folder` → `React-Knowledge-Base`
- پوشه `جزوه React` → `آرشیو جزوه قدیمی`
- استخراج 141 فایل Word به `_extracted-notes/`
- ساخت اسکلت پوشه‌ها و فایل‌های پایه
