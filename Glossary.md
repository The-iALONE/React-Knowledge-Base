# Glossary — واژه‌نامه React/Next.js

| English | فارسی | توضیح کوتاه |
|---------|-------|-------------|
| `Re-render` | بازرندر | اجرای مجدد تابع کامپوننت برای محاسبه JSX جدید |
| `Reconciliation` | همگام‌سازی | مقایسه Virtual DOM جدید با قبلی و تعیین تغییرات DOM |
| `Virtual DOM` | DOM مجازی | نمایش درختی از JSX در حافظه |
| `Commit Phase` | فاز Commit | اعمال تغییرات Virtual DOM روی DOM واقعی |
| `Render Phase` | فاز Render | محاسبه JSX و ساخت Virtual DOM |
| `State` | `state` | داده‌ای که با تغییر آن، کامپوننت بازرندر می‌شود |
| `Props` | `props` | داده‌ای که از والد به فرزند پاس داده می‌شود |
| `Hook` | `Hook` | تابعی برای استفاده از قابلیت‌های React در کامپوننت تابعی |
| `Side Effect` | `side effect` | عملیات خارج از `render` (`fetch`، `subscription`، DOM) |
| `Memoization` | `memoization` | ذخیره نتیجه محاسبه برای جلوگیری از تکرار |
| `Lifting State Up` | بالا بردن `state` | انتقال `state` به والد مشترک |
| `Colocation` | هم‌مکانی | نگه‌داشتن `state` نزدیک جایی که استفاده می‌شود |
| `Hydration` | هیدراتاسیون | اتصال `event handler`ها به HTML رندرشده سرور |
| `Server Component` | کامپوننت سرور | کامپوننتی که فقط روی سرور اجرا می‌شود |
| `Client Component` | کامپوننت کلاینت | کامپوننتی با `"use client"` که در مرورگر اجرا می‌شود |
| `Suspense` | `Suspense` | نمایش `fallback` تا زمان آماده شدن داده/کامپوننت |
| `Portal` | `Portal` | `render` فرزند در DOM خارج از والد |
| `Error Boundary` | مرز خطا | کامپوننتی که خطای زیردرختی را می‌گیرد |
| `Code Splitting` | تقسیم کد | بارگذاری بخشی از `bundle` فقط هنگام نیاز |
| `SSR` | رندر سمت سرور | `render` HTML روی سرور |
| `SSG` | تولید سایت استاتیک | تولید HTML استاتیک در `build time` |
| `ISR` | بازتولید تدریجی استاتیک | بازتولید تدریجی صفحات استاتیک |
| `RSC` | کامپوننت‌های سرور React | معماری کامپوننت سرور React |
| `Server Action` | `Server Action` | تابع `async` که روی سرور اجرا می‌شود |
| `Dependency Array` | آرایه وابستگی | آرایه‌ای در `useEffect`/`useMemo` که `trigger` بازاجرا را مشخص می‌کند |
| `Batching` | `batching` | گروه‌بندی چند `state update` در یک `re-render` |
| `Pure Component` | کامپوننت خالص | کامپوننتی که با همان `props` همیشه همان خروجی می‌دهد |
| `HOC` | کامپوننت مرتبه‌بالاتر | تابعی که کامپوننت را `wrap` می‌کند |
| `Render Props` | `Render Props` | الگوی پاس دادن تابع `render` به‌عنوان `prop` |
| `Compound Component` | کامپوننت مرکب | چند کامپوننت مرتبط که `state` مشترک دارند |

> این فایل با افزودن مباحث جدید گسترش می‌یابد.
