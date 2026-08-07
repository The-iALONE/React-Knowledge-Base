/**
 * ActivityDemo.jsx — Activity mode hidden/visible
 * مستندات: Escape-Hatches/README.md
 */
import { Activity, useState } from 'react';

function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside style={{ padding: 16, border: '1px solid #ddd', minWidth: 200 }}>
      <h3>سایدبار</h3>
      <button type="button" onClick={() => setExpanded((e) => !e)}>
        {expanded ? 'بستن منو' : 'باز کردن منو'}
      </button>
      {expanded && (
        <ul>
          <li>آیتم ۱</li>
          <li>آیتم ۲</li>
          <li>آیتم ۳</li>
        </ul>
      )}
      <p style={{ fontSize: 12, color: '#666' }}>
        state منو با Activity حفظ می‌شود
      </p>
    </aside>
  );
}

export default function ActivityDemo() {
  const [visible, setVisible] = useState(true);

  return (
    <div>
      <h2>دمو Activity</h2>
      <button type="button" onClick={() => setVisible((v) => !v)}>
        {visible ? 'مخفی کردن سایدبار' : 'نمایش سایدبار'}
      </button>
      <Activity mode={visible ? 'visible' : 'hidden'}>
        <Sidebar />
      </Activity>
    </div>
  );
}
