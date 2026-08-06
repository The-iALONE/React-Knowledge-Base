# Layouts

چیدمان‌های تودرتو (nested layouts) در App Router — UI مشترک بین `route`های فرزند.

---

## 📖 مفهوم

کامپوننت `Layout`، `children` را `wrap` می‌کند و بین navigationهای فرزند `state` خود را حفظ می‌کند (برخلاف `remount` شدن `page`).

---

## چرا این ویژگی وجود دارد؟

جلوگیری از re-render کل صفحه هنگام جابه‌جایی بین `route`های هم‌سطح؛ اشتراک header، sidebar، context.

---

## چه مشکلی را حل می‌کند؟

- تکرار navbar/footer در هر `page`
- `layout` متفاوت برای بخش account در مقابل marketing
- حفظ scroll یا `state` sidebar

---

## ⚙️ نحوه کار

Layoutها به‌صورت تو در تو رندر می‌شوند:

```
RootLayout
  └── AccountLayout
        └── ProfilePage
```

---

## چه زمانی استفاده کنیم؟

هر بخشی که shell مشترک دارد (header، nav حساب کاربری، فونت سراسری).

---

## چه زمانی استفاده نکنیم؟

رابط کاربری یک‌بار مصرف فقط برای یک `page` — مستقیم در `page.tsx`.

---

## Syntax

```tsx
// app/layout.tsx — Root Layout (اجباری)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

```tsx
// app/account/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="grid grid-cols-[240px_1fr]">
      <AccountSidebar />
      <main>{children}</main>
    </div>
  );
}
```

---

## Template vs Layout

| | Layout | Template |
|---|--------|----------|
| فایل | `layout.tsx` | `template.tsx` |
| `state` | حفظ می‌شود | هر navigation `remount` |
| use case | nav، sidebar | animation ورود |

```tsx
// app/template.tsx — اختیاری
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in">{children}</div>;
}
```

---

## 💡 مثال ساده

```tsx
// app/(marketing)/layout.tsx
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-5xl mx-auto">
      {children}
    </section>
  );
}
```

---

## مثال واقعی در پروژه

Wild Oasis:
- `layout` ریشه: فونت، theme، `SessionProvider` (client wrapper)
- `layout` حساب کاربری: sidebar «پروفایل / رزروها / تنظیمات»
- `layout` کابین‌ها (اختیاری): breadcrumb مشترک

---

## Parallel Routes (مقدمه)

```
app/
├── @modal/
│   └── (.)photo/[id]/page.tsx
└── layout.tsx
```

برای modal روی همان URL — پیشرفته‌تر؛ در پروژه‌های بزرگ.

---

## 🚀 Best Practices

✅ فقط یک root `layout.tsx` با `<html>` و `<body>`  
✅ `fetch` داده سنگین را در `layout` فقط اگر واقعاً مشترک است  
✅ Client Providerها را در `layout` client جدا `wrap` کنید  
✅ از nested `layout` برای `/account/*` استفاده کنید  

---

## ارتباط با مفاهیم دیگر

- [Routing-And-Pages](./Routing-And-Pages.md)
- [Navigation](./Navigation.md)
- [Authentication-NextAuth](./Authentication-NextAuth.md)
- [Client-Server-Interleaving](./Client-Server-Interleaving.md)

---

## خلاصه

`layout.tsx` = shell پایدار + `{children}`؛ nested برای بخش‌های مختلف اپ.

---

## 📚 منابع

- [Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts)
- [Templates](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#templates)
