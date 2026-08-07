# Authentication (NextAuth / Auth.js)

> 🧭 پیش‌نیاز: [Middleware](./Middleware.md) · بعدی: [Metadata & SEO](./Metadata-And-SEO.md)

احراز هویت با Auth.js (NextAuth v5) — session، providers و محافظت route.

---

## 📖 مفهوم

کتابخانهٔ احراز هویت **Auth.js** (قبلاً NextAuth.js) برای Next.js است — OAuth (Google، GitHub)، credentials، session JWT یا database، و integration با App Router و [Middleware](./Middleware.md).

---

## چرا این ویژگی وجود دارد؟

پیاده‌سازی login، session، CSRF و provider OAuth از صفر زمان‌بر و پرخطاست. Auth.js الگوی استاندارد و امن فراهم می‌کند.

---

## چه مشکلی را حل می‌کند؟

- login/logout و session management
- محافظت `/account/*`
- دسترسی به `session` در Server Component و Server Action
- OAuth بدون مدیریت token دستی

---

## ⚙️ نحوه کار

```
User → Provider (Google/Credentials) → Auth.js → Session cookie/JWT
     → auth() در Server / middleware → دسترسی به user
```

---

## Syntax — auth.ts (Auth.js v5)

```ts
// auth.ts — ریشهٔ پروژه
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // validate against DB
        if (!credentials?.email) return null;
        return { id: "1", email: credentials.email as string };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
```

---

## Route Handler

```ts
// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

---

## استفاده در Server Component

```tsx
// app/account/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <p>Welcome, {session.user.email}</p>;
}
```

---

## SessionProvider (Client)

```tsx
// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

```tsx
// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## Login page

```tsx
// app/login/page.tsx
import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/account" });
      }}
    >
      <button type="submit">ورود با Google</button>
    </form>
  );
}
```

---

## 💡 مثال ساده

```tsx
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  return <pre>{JSON.stringify(session, null, 2)}</pre>;
}
```

---

## مثال واقعی در پروژه

در پروژهٔ Wild Oasis (طبق جزوه):

- Google OAuth + credentials (اختیاری)
- `middleware` برای `/account`
- `session.user` در Server Action رزرو — فقط کاربر لاگین‌شده
- `signOut` در header

---

## 🚀 Best Practices

✅ `NEXTAUTH_SECRET` قوی در `.env.local`  
✅ `auth()` در Server Component و Action — نه فقط client  
✅ middleware + layout redirect (دو لایه)  
✅ session strategy (JWT vs database) را صریح انتخاب کنید  
✅ `.env.example` بدون secret برای تیم

---

## ⚠️ اشتباهات رایج

❌ اتکا فقط به client-side session check  
❌ commit کردن `NEXTAUTH_SECRET`  
❌ فراموش کردن `NEXTAUTH_URL` در production  
❌ `SessionProvider` بدون wrap در layout  
❌ authorize بدون hash password برای credentials

---

## ارتباط با مفاهیم دیگر

- [Middleware](./Middleware.md)
- [Layouts](./Layouts.md) — `account/layout`
- [Server-Actions](./Server-Actions.md) — auth در mutation
- [Backend-Integration-Supabase](./Backend-Integration-Supabase.md) — user در DB
- [Route-Handlers](./Route-Handlers.md) — `[...nextauth]`

---

## خلاصه

در Auth.js ترکیب providers، `auth()` و session است — route در `api/auth/[...nextauth]`؛ محافظت با middleware و Server Components.

---

## 📚 منابع

- [Auth.js Documentation](https://authjs.dev)
- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [Getting Started — Auth.js](https://authjs.dev/getting-started/installation?framework=next.js)
