// Examples/performance/ChildrenOptimization.jsx
// الگوی children-as-prop — Performance/Memoization.md
import { useState } from "react";

function SlowComponent() {
  console.log("SlowComponent render");
  const items = Array.from({ length: 5000 }, (_, i) => i);
  return (
    <p>
      Slow list length: {items.length}
    </p>
  );
}

function Counter({ children }) {
  const [count, setCount] = useState(0);
  console.log("Counter render");
  return (
    <div>
      <h2>Slow counter</h2>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Increase: {count}
      </button>
      {children}
    </div>
  );
}

export default function ChildrenOptimizationDemo() {
  return (
    <Counter>
      <SlowComponent />
    </Counter>
  );
}
