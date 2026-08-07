# Client-Server Interleaving

> 🧭 پیش‌نیاز: [Server Components](./Server-Components.md) · بعدی: [Server Actions](./Server-Actions.md)

ترکیب Server و Client Components — composition، محدودیت‌های import و الگوهای رایج.

---

## 📖 مفهوم

در App Router، Server و Client Components **تو در تو** ترکیب می‌شوند — Server Component می‌تواند Client Component را import و render کند؛ اما برعکس محدود است. این «interleaving» مرز بین سرور و کلاینت را شفاف می‌کند.

---

## چرا این ویژگی وجود دارد؟

همهٔ UI را نمی‌توان فقط server یا فقط client ساخت. دکمه، فرم و animation نیاز به کلاینت دارند؛ داده و layout می‌توانند server باشند.

---

## چه مشکلی را حل می‌کند؟

- جداسازی داده (server) از تعامل (client)
- کوچک نگه داشتن `"use client"` boundary
- اشتراک props serializable از server به client
- الگوی Provider در layout

---

## ⚙️ نحوه کار

### قانون طلایی composition

```
Server Component
  └── import ClientComponent ✅
        └── import ServerComponent ❌ (مستقیم)
```

**راه‌حل:** Server Component را به‌عنوان `children` به Client بدهید:

```tsx
// app/layout.tsx — Server
import ClientProvider from "./ClientProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProvider>
      <Header /> {/* Server */}
      {children}
    </ClientProvider>
  );
}
```

```tsx
// app/ClientProvider.tsx
"use client";

import { SessionProvider } from "next-auth/react";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

---

## Client داخل Server

```tsx
// app/cabins/page.tsx — Server
import CabinList from "./CabinList"; // Server
import SortSelect from "./SortSelect"; // Client

export default async function CabinsPage() {
  const cabins = await getCabins();
  return (
    <div>
      <SortSelect />
      <CabinList cabins={cabins} />
    </div>
  );
}
```

```tsx
// app/cabins/SortSelect.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // ...
}
```

---

## Server داخل Client (الگوی children)

```tsx
// Modal.tsx — Client
"use client";

export default function Modal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return open ? <div className="modal">{children}</div> : null;
}
```

```tsx
// page.tsx — Server
import Modal from "./Modal";
import CabinDetails from "./CabinDetails"; // Server

export default async function Page() {
  const cabin = await getCabin("1");
  return (
    <Modal>
      <CabinDetails cabin={cabin} />
    </Modal>
  );
}
```

`CabinDetails` روی سرور render می‌شود و HTML به عنوان `children` به Modal می‌رسد.

---

## Context در App Router

`Context` فقط در Client Component کار می‌کند. الگوی رایج:

```tsx
// ThemeProvider.tsx — "use client"
"use client";
export const ThemeContext = createContext(...);
```

Server Component نمی‌تواند `useContext` بزند — داده را از server به client با props بفرستید.

---

## 💡 مثال ساده

```tsx
// Server page
import Counter from "./Counter"; // Client

export default function Page() {
  return (
    <main>
      <h1>Server rendered title</h1>
      <Counter />
    </main>
  );
}
```

---

## مثال واقعی در پروژه

در پروژهٔ Wild Oasis (طبق جزوه):

- `layout` ریشه: Server + `SessionProvider` (client)
- صفحه کابین: Server list + Client `SortSelect` با `searchParams`
- فرم رزرو: Server Action + Client form با `useOptimistic`
- highlight لینک فعال: Client `NavLink` با `usePathname`

---

## 🚀 Best Practices

✅ `"use client"` را تا جایی که ممکن است پایین در درخت نگه دارید  
✅ props به Client فقط serializable (JSON-safe)  
✅ Server children را به Client modal/dropdown بدهید  
✅ Context Provider را در client layout wrapper قرار دهید  
✅ از [State in URL](../React-Router/State-In-URL.md) برای state مشترک server/client استفاده کنید

---

## ⚠️ اشتباهات رایج

❌ import مستقیم Server Component در Client file  
❌ پاس دادن function، class instance، یا Date به Client child  
❌ `"use client"` روی فایلی که فقط children server دارد  
❌ `useContext` در Server Component  
❌ duplicate fetch در Client وقتی Server قبلاً داده دارد

---

## ارتباط با مفاهیم دیگر

- [Server-Components](./Server-Components.md)
- [Client Components](../Escape-Hatches/Client-Components.md)
- [Context](../Context.md) — محدودیت در RSC
- [Server-Actions](./Server-Actions.md)
- [State in URL](../React-Router/State-In-URL.md)

---

## خلاصه

وارد کردن مستقیم از Server به Client مجاز است؛ برعکس فقط از طریق `children`. boundary `"use client"` را کوچک نگه دارید؛ props باید serializable باشند.

---

## 📚 منابع

- [Server and Client Composition](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
- [Client Components — Next.js](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Passing Server Components as props](https://nextjs.org/docs/app/building-your-application/rendering/server-components#passing-server-components-as-props)
