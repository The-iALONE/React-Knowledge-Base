/**
 * UsePromise.jsx — use(promise) + Suspense
 * مستندات: Hooks/use.md, Suspense.md
 */
import { Suspense, use, cache } from 'react';

const fetchUser = cache(async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { id, name: `کاربر ${id}`, role: 'developer' };
});

function UserProfile({ userId }) {
  const user = use(fetchUser(userId));
  return (
    <div>
      <h3>{user.name}</h3>
      <p>نقش: {user.role}</p>
    </div>
  );
}

function ProfileSkeleton() {
  return <p>در حال بارگذاری پروفایل...</p>;
}

export default function UsePromiseDemo() {
  return (
    <div>
      <h2>دمو use(promise)</h2>
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfile userId={42} />
      </Suspense>
    </div>
  );
}
