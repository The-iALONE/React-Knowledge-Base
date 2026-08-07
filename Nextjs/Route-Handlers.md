# Route Handlers

> 🧭 پیش‌نیاز: [Server Actions](./Server-Actions.md) · بعدی: [Middleware](./Middleware.md)

ساخت API endpoints با `route.ts` در App Router — جایگزین API Routes در Pages Router.

---

## 📖 مفهوم

فایل `route.ts` (یا `route.js`) در پوشهٔ `app/` یک **Route Handler** تعریف می‌کند — تابعی که برای HTTP methods (`GET`، `POST`، ...) export می‌شود و `Request`/`Response` Web API را برمی‌گرداند.

---

## چرا این ویژگی وجود دارد؟

گاهی به REST API، webhook، یا integration با سرویس خارجی نیاز دارید — Server Action برای این موارد مناسب نیست. Route Handler endpoint استاندارد HTTP فراهم می‌کند.

---

## چه مشکلی را حل می‌کند؟

- REST API برای موبایل یا third-party
- webhook (Stripe، GitHub)
- NextAuth route (`[...nextauth]`)
- proxy به سرویس خارجی

---

## ⚙️ نحوه کار

```
app/api/cabins/route.ts → GET /api/cabins
app/api/auth/[...nextauth]/route.ts → /api/auth/*
```

| Method export | HTTP |
|---------------|------|
| `GET` | GET |
| `POST` | POST |
| `PUT` | PUT |
| `PATCH` | PATCH |
| `DELETE` | DELETE |
| `HEAD` | HEAD |
| `OPTIONS` | OPTIONS |

---

## Syntax — GET و POST

```ts
// app/api/cabins/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  // validate + insert
  return NextResponse.json({ ok: true }, { status: 201 });
}
```

---

## Dynamic Route Handler

```ts
// app/api/cabins/[cabinId]/route.ts
type Params = { params: Promise<{ cabinId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { cabinId } = await params;
  // ...
  return NextResponse.json({ cabinId });
}
```

---

## تفاوت با Server Actions

| | Server Action | Route Handler |
|---|---------------|---------------|
| فراخوانی | فرم / `formAction` | HTTP request |
| پروتکل | Next.js internal | REST/HTTP استاندارد |
| use case | mutation از UI | webhook، API عمومی |
| auth | session در action | header/cookie دستی |

---

## 💡 مثال ساده

```ts
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: "ok" });
}
```

---

## مثال واقعی در پروژه

در پروژهٔ Wild Oasis:

- `app/api/auth/[...nextauth]/route.ts` — NextAuth handlers
- (اختیاری) endpoint برای integration خارجی
- webhook پرداخت (در پروژه‌های واقعی)

برای CRUD داخلی اپ، Server Actions ترجیح داده می‌شود.

---

## 🚀 Best Practices

✅ mutation داخلی UI → Server Action؛ API عمومی → Route Handler  
✅ `NextResponse.json` با status code مناسب  
✅ اعتبارسنجی body و auth در handler  
✅ CORS را صریح برای API عمومی تنظیم کنید  
✅ rate limiting برای endpointهای حساس

---

## ⚠️ اشتباهات رایج

❌ Route Handler برای هر فرم ساده — Server Action ساده‌تر است  
❌ فراموش کردن `await params` در Next.js 15+  
❌ برگرداندن secret در JSON response  
❌ `GET` با side effect (حذف/ایجاد)  
❌ عدم handle کردن `OPTIONS` برای CORS preflight

---

## ارتباط با مفاهیم دیگر

- [Server-Actions](./Server-Actions.md)
- [Authentication-NextAuth](./Authentication-NextAuth.md) — `[...nextauth]/route.ts`
- [Backend-Integration-Supabase](./Backend-Integration-Supabase.md)
- [Middleware](./Middleware.md)

---

## خلاصه

فایل `route.ts` یعنی HTTP API در `app/api/` — برای webhook و REST؛ mutation UI را با Server Actions انجام دهید.

---

## 📚 منابع

- [Route Handlers — Next.js](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [NextResponse](https://nextjs.org/docs/app/api-reference/functions/next-response)
