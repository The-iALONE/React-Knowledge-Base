# Introduction

> 🧭 پیش‌نیاز: [README](./README.md) · بعدی: [Quick Start](./Quick-Start.md)

آشنایی با React و جایگاه آن در اکوسیستم فرانت‌اند.

---

## 📖 مفهوم

کتابخانه JavaScript برای ساخت رابط کاربری (UI) است؛ در اکوسیستم React کار می‌کند. بر پایه کامپوننت، `declarative` و `component-based` است — یعنی شما **چه می‌خواهید ببینید** را توصیف می‌کنید و React مسئول همگام‌سازی DOM با آن توصیف می‌شود.

در نقش معمولی، یک **library** است نه فریم‌ورک کامل: مسیریابی، `fetch` و استایل را خودتان (یا با Next.js و ابزارهای دیگر) انتخاب می‌کنید. برای اپ تعاملی (SPA، داشبورد، فرم پیچیده) انتخاب رایجی است.

---

## چرا این ویژگی وجود دارد؟

قبل از React، DOM به‌صورت `imperative` دستکاری می‌شد — هر تغییر UI یعنی پیدا کردن `element` و `append`/`remove` دستی. با `declarative programming` و Virtual DOM، React ساخت UI پیچیده را ساده‌تر کرد: شما `state` را به‌روز می‌کنید و React تصمیم می‌گیرد DOM چه تغییری بخورد.

---

## چه مشکلی را حل می‌کند؟

- مدیریت `state` و DOM در اپلیکیشن‌های بزرگ
- همگام‌سازی UI با داده بدون باگ‌های دستکاری مستقیم DOM
- ترکیب مجدد قطعات UI (`component composition`)

---

## ⚙️ نحوه کار

شما `state` را تعریف می‌کنید → React UI را بر اساس `state` `render` می‌کند → با تغییر `state`، React فقط بخش‌های لازم را به‌روز می‌کند (الگوریتم `Reconciliation`).

جریان کلی:

```
داده (state/props) → تابع کامپوننت → JSX → Virtual DOM → DOM واقعی
```

---

## چه زمانی استفاده کنیم؟

- SPA، داشبورد، فرم‌های پیچیده، UI تعاملی
- وقتی تیم به مدل کامپوننت‌محور و اکوسیستم npm/React آشناست

## چه زمانی استفاده نکنیم؟

- صفحات استاتیک ساده بدون تعامل (HTML/CSS کافی است)
- وقتی فقط یک ویجت کوچک در سایت قدیمی لازم است (شاید بدون build کامل سبک‌تر باشد)

---

## 🚀 Best Practices

- از [Quick Start](./Quick-Start.md) با Vite شروع کنید — نه قالب‌های منسوخ
- مفاهیم را به ترتیب [Learning-Path](./Learning-Path.md) بخوانید
- برای API و رفتار به‌روز، [react.dev](https://react.dev) مرجع نهایی است

---

## ⚠️ اشتباهات رایج

- ❌ انتظار داشتن React مثل Angular «همه‌چیز در جعبه» باشد — مسیریابی و داده سرور جدا انتخاب می‌شوند
- ❌ یادگیری `class component` قدیمی قبل از `function component` + `hooks`
- ❌ نادیده گرفتن قوانین RTL و ساختار مستندات این مخزن هنگام افزودن یادداشت

---

## ارتباط با مفاهیم دیگر

- [Quick Start](./Quick-Start.md)
- [Components](./Components.md)
- [Thinking in React](./Thinking-in-React.md)
- [Rendering](./Rendering.md) — چرخه رندر

---

## خلاصه

کتابخانه UI مبتنی بر کامپوننت در React = `declarative` + Virtual DOM. برای اپ تعاملی مناسب است؛ library است نه فریم‌ورک کامل.

---

## 📚 منابع

- [React Documentation](https://react.dev)
- [React Overview](https://react.dev/learn)
