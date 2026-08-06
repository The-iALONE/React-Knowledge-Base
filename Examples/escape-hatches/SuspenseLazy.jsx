/**
 * SuspenseLazy.jsx — React.lazy + Suspense
 * مستندات: Lazy-Loading.md, Suspense.md
 */
import { lazy, Suspense, useState } from 'react';

const HeavyChart = lazy(() => import('./HeavyChartStub'));

function ChartSkeleton() {
  return (
    <div style={{ padding: 24, background: '#f0f0f0', borderRadius: 8 }}>
      در حال بارگذاری نمودار...
    </div>
  );
}

export default function SuspenseLazyDemo() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <h2>دمو Lazy Loading</h2>
      <button type="button" onClick={() => setShowChart(true)}>
        نمایش نمودار
      </button>
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}
