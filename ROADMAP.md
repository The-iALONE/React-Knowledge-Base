# ROADMAP — React Knowledge Base

> این فایل پیشرفت پروژه را ردیابی می‌کند. بعد از هر فاز تیک می‌خورد و به‌عنوان changelog دائمی باقی می‌ماند.

## قانون کاری AI

قبل از شروع هر تغییر در این پروژه، AI باید:

1. پلن کار را به‌طور خلاصه بنویسد (چه کاری می‌خواهد انجام دهد).
2. مشخص کند چه فایل‌هایی ساخته، ویرایش یا حذف می‌شوند.
3. از کاربر بپرسد که آیا ادامه بدهد یا نه، و منتظر تایید بماند قبل از اعمال تغییرات.
4. قبل از شروع کار روی هر فاز، آخرین نسخه [مستندات رسمی React](https://react.dev) را برای مباحث آن فاز بررسی کند — چون مستندات رسمی، Source of Truth است و جزوه قدیمی به‌تنهایی منبع کاملاً قابل‌اعتمادی نیست.
5. بعد از هر تغییر (افزودن، ویرایش یا حذف فایل)، `README.md` و `Learning-Path.md` را بررسی و در صورت نیاز به‌روزرسانی کند — لینک جدید، جای‌گذاری در ماژول درست، تیک‌زدن آیتم.
6. وقتی کاربر گفت **تغییرات را کامیت کن** یا **پوش کن**:
   - **بازبینی (Review)** روی فایل‌های تغییر یافته انجام دهد (قبل از `git add`):
     - چک‌لیست RTL: جملهٔ اول فارسی در `## 📖 مفهوم`، بدون شروع جمله با انگلیسی، اصطلاحات فنی backtick‌شده
     - لینک‌های داخلی شکسته نباشند
     - `README.md` و `Learning-Path.md` با فایل‌های جدید/ویرایش‌شده هم‌خوان باشند
   - `git status` و `git diff` را بررسی کند
   - فقط فایل‌های مرتبط با پروژه را `git add` کند (نه `.obsidian/workspace.json`)
   - پیام کامیت شفاف بنویسد (شامل نام Milestone فعلی، مثلاً `M3`)
   - `git push origin main` (یا شاخهٔ فعال) به ریپازیتوری GitHub انجام دهد
   - در `ROADMAP.md` changelog ثبت کند

**Milestone فعلی:** `M4` (Patterns — تکمیل شده)  
**شاخهٔ اصلی:** `main`  
**ریپازیتوری:** [github.com](https://github.com) — `React-Knowledge-Base` (خصوصی)

**آخرین به‌روزرسانی:** 2026-08-06 (M4 Patterns)

---

## منابع و اصول ترکیب محتوا

### منابع پروژه

1. **جزوه‌های Word من** (`آرشیو جزوه قدیمی/`, `_extracted-notes/`) — منبع اصلی
2. **React Official Documentation** ([react.dev](https://react.dev)) — Source of Truth

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

- [ ] بخش `## 📖 مفهوم` وجود دارد و جملهٔ اول فارسی است
- [ ] هیچ جمله‌ای در کل فایل با انگلیسی شروع نشده (به‌جز عناوین `#` فایل)
- [ ] اصطلاحات فنی backtick دارند
- [ ] `README.md` و `Learning-Path.md` در صورت افزودن/حذف فایل به‌روز شده‌اند

---

## Git و ریپازیتوری

| مورد | مقدار |
|------|--------|
| ریپازیتوری | `React-Knowledge-Base` (خصوصی، GitHub) |
| شاخهٔ اصلی | `main` |
| مسیر محلی | ریشهٔ همین پوشه (`React-Knowledge-Base/`) |
| Milestone فعلی | **M4** — Patterns (تکمیل)؛ Milestone بعدی: **M5** — Escape Hatches |

### قانون کامیت و پوش

وقتی کاربر گفت «کامیت کن» / «پوش کن» / «تغییرات را ذخیره کن در گیت»:

1. **بازبینی (Review)** — قبل از استیج کردن:
   - RTL: `## 📖 مفهوم`، شروع جمله با فارسی، backtick اصطلاحات فنی (بخش «قوانین نگارش فارسی و RTL»)
   - لینک‌های داخلی و هم‌خوانی `README.md` / `Learning-Path.md`
2. `git status` + `git diff` — بررسی تغییرات
3. `git add` فایل‌های مرتبط (رعایت `.gitignore`)
4. `git commit` با پیام شامل Milestone (مثال: `M3: اصلاح RTL بخش مفهوم در Hooks`)
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
| **M7** | State Management | Context API، Redux، React Query |
| **M8** | React Router | مسیریابی |
| **M9** | Styling | CSS Modules و استایل |
| **M10** | Next.js | فریم‌ورک Next.js |
| **M11** | Reference | FAQ، Interview، APIها |
| **M12** | QA | بازبینی نهایی |

---

## Milestoneها (فازها)

| Milestone | فاز | وضعیت | تاریخ تکمیل | یادداشت |
| --------- | --- | ----- | ----------- | ------- |
| **M1** | Setup (تغییر نام پوشه‌ها، استخراج Word، اسکلت) | [x] | 2026-08-06 | 141 فایل Word استخراج شد |
| **M2** | Core React (فایل‌های ریشه) | [x] | 2026-08-06 | 24 فایل ریشه تکمیل شد |
| **M3** | Hooks | [x] | 2026-08-06 | ۲۰ فایل Hooks (README + ۱۹ hook) — هم‌تراز با react.dev |
| **M4** | Patterns | [x] | 2026-08-06 | README + ۵ الگو + Examples — جزوه الگوهای پیشرفته |
| **M5** | Escape Hatches / Concurrent | [ ] | | بدهی react.dev: `use()`, `<Activity>` (React 19.2), ref as prop, ref cleanup (React 19), Context بدون `.Provider` (React 19) |
| **M6** | Performance | [ ] | | |
| **M7** | State Management | [ ] | | |
| **M8** | React Router | [ ] | | |
| **M9** | Styling | [ ] | | |
| **M10** | Next.js | [ ] | | بدهی react.dev: `cacheSignal`, APIهای `prerender`/`resume` در `react-dom/static` (RSC) |
| **M11** | Reference / FAQ / Interview | [ ] | | |
| **M12** | QA نهایی | [ ] | | |

---

## Coverage — منبع Word → فایل مقصد

| منبع (آرشیو)                               | فایل(های) مقصد                                             | وضعیت                    |
| ------------------------------------------ | ---------------------------------------------------------- | ------------------------ |
| `ری اکت در پشت صحنه چطور کار می کند؟/*`    | Rendering, Performance/\*, Components                      | [ ]                      |
| `useEffect-sideEffect-...`                 | Hooks/\*, Performance/Memoization                          | [x] Hooks                |
| `الگو های پیشرفته ری اکت/*`                | Patterns/\*, Portals                                       | [x] Patterns (Portals در M2) |
| `ماژول های CSS`, `روش های استایل دهی`      | Styling/\*                                                 | [ ]                      |
| `مدیریت state/Context api and Redux/*`     | State-Management/\*, Context.md                            | [ ]                      |
| `مدیریت state/React Query - remote data/*` | State-Management/React-Query.md                            | [ ]                      |
| `مدیریت state/جزوه React Router/*`         | React-Router/\*                                            | [ ]                      |
| `Next.js/*`                                | Nextjs/\*, Server-Components, Client-Components            | [ ]                      |
| `Supabase/*`                               | Nextjs/Backend-Integration-Supabase.md                     | [ ]                      |
| `herlpers for react + rfc +`               | Components.md, Quick-Start.md                              | [x]                      |
| _(react.dev — React 19.2)_                 | Hooks/useEffectEvent, Escape-Hatches, Activity, Nextjs/RSC | [x] M3 Hooks / [ ] M5/M10 |

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
