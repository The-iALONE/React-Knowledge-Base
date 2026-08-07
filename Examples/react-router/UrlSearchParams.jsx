// Examples/react-router/UrlSearchParams.jsx
// مستندات: React-Router/State-In-URL.md — الگوی Wild Oasis CabinTable
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";

const CABINS = [
  { id: 1, name: "Woodland", price: 250, discount: 0 },
  { id: 2, name: "Silver", price: 500, discount: 50 },
  { id: 3, name: "Golden", price: 750, discount: 100 },
];

function CabinTable() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filterValue = searchParams.get("discount") || "all";
  let filtered = CABINS;
  if (filterValue === "no-discount")
    filtered = CABINS.filter((c) => c.discount === 0);
  if (filterValue === "with-discount")
    filtered = CABINS.filter((c) => c.discount > 0);

  const sortBy = searchParams.get("sortBy") || "price-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  const sorted = [...filtered].sort((a, b) => (a[field] - b[field]) * modifier);

  return (
    <div>
      <select
        value={filterValue}
        onChange={(e) =>
          setSearchParams((prev) => {
            prev.set("discount", e.target.value);
            return prev;
          })
        }
      >
        <option value="all">All</option>
        <option value="no-discount">No discount</option>
        <option value="with-discount">With discount</option>
      </select>

      <select
        value={sortBy}
        onChange={(e) =>
          setSearchParams((prev) => {
            prev.set("sortBy", e.target.value);
            return prev;
          })
        }
      >
        <option value="price-asc">Price ↑</option>
        <option value="price-desc">Price ↓</option>
      </select>

      <ul>
        {sorted.map((c) => (
          <li key={c.id}>
            {c.name} — ${c.price} (discount: {c.discount})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CabinTable />} />
      </Routes>
    </BrowserRouter>
  );
}
