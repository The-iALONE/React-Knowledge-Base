# Middleware

> 🧭 پیش‌نیاز: [Route Handlers](./Route-Handlers.md) · بعدی: [Authentication (NextAuth)](./Authentication-NextAuth.md)

لایهٔ میان‌افزار Next.js — اجرا قبل از `route` برای auth، redirect و rewrite.

---

## 📖 مفهوم

فایل `middleware.ts` در ریشهٔ پروژه (کنار `app/`) **قبل از** `render` هر `route` اجرا می‌شود. برای بررسی session، redirect کاربران غیرمجاز، rewrite URL و header سفارشی استفاده می‌شود.

> تفاوت با `middleware` در Redux: آنجا تابع بین `dispatch` و reducer است — [Redux](../State-Management/Redux.md). اینجا لایهٔ edge/request در Next.js است.

---

## چرا این ویژگی وجود دارد؟

برخی تصمیم‌ها (مثل «آیا کاربر لاگین است؟») باید **قبل از** رسیدن به `page` اتخاذ شوند — بدون اجرای Server Component یا بارگذاری دادهٔ غیرضروری.

---

## چه مشکلی را حل می‌کند؟

- محافظت `/account/*` بدون تکرار `redirect` در هر page
- locale routing و A/B testing
- rewrite به maintenance page
- افزودن header امنیتی

---

## ⚙️ نحوه کار

جریان درخواست:

```
Request → middleware.ts (matcher) → NextResponse.next() | redirect | rewrite
```

این میان‌افزار روی **Edge Runtime** اجرا می‌شود — محدودیت API (بدون Node.js کامل).

---

## Syntax

```ts
// middleware.ts — ریشهٔ پروژه
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/account") && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/login"],
};
```

---

## matcher

```ts
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
```

فقط `route`های مشخص — از اجرا روی static files جلوگیری کنید.

---

## تفاوت با Protected Route در React Router

| | React Router (M8) | Next.js Middleware |
|---|-------------------|---------------------|
| محل | کلاینت | سرور/edge |
| زمان | پس از load JS | قبل از page |
| API | `<ProtectedRoute>` | `middleware.ts` |

---

## 💡 مثال ساده

```ts
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/old") {
    return NextResponse.redirect(new URL("/new", request.url));
  }
  return NextResponse.next();
}
```

---

## مثال واقعی در پروژه

در پروژهٔ Wild Oasis (طبق جزوه):

- محافظت `/account` و زیرمسیرها — redirect به `/login` اگر session نباشد
- اجازهٔ دسترسی به `/login` فقط برای مهمان
- ترکیب با NextAuth `auth()` در middleware

---

## 🚀 Best Practices

✅ `matcher` را محدود نگه دارید — performance  
✅ logic سنگین DB را در middleware نگذارید — فقط session check  
✅ `NextResponse.next()` برای ادامهٔ عادی  
✅ cookie/session را از NextAuth `auth()` بخوانید  
✅ برای محافظت page-level هم `layout` با `redirect` داشته باشید (defense in depth)

---

## ⚠️ اشتباهات رایج

❌ query سنگین Supabase در هر request  
❌ `matcher` خیلی گسترده — middleware روی همهٔ static files  
❌ اشتباه گرفتن با Redux middleware  
❌ فراموش کردن `export const config`  
❌ استفاده از Node-only API در Edge middleware

---

## ارتباط با مفاهیم دیگر

- [Authentication-NextAuth](./Authentication-NextAuth.md)
- [Navigation](./Navigation.md) — `redirect` در page
- [Layouts](./Layouts.md) — auth در `account/layout`
- [React Router — Navigation](../React-Router/Navigation.md) — Protected Routes SPA

---

## خلاصه

فایل `middleware.ts` قبل از `route` اجرا می‌شود — auth، redirect، rewrite. `matcher` را محدود کنید؛ logic سبک نگه دارید.

---

## 📚 منابع

- [Middleware — Next.js](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Edge Runtime](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)
