// Examples/performance/StateColocation.jsx
// نزدیک‌سازی state — Performance/State-Colocation.md
import { useState } from "react";

function SearchBar() {
  const [query, setQuery] = useState("");
  console.log("SearchBar render");
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search reservations..."
    />
  );
}

function ReservationTable({ reservations }) {
  console.log("ReservationTable render");
  return (
    <ul>
      {reservations.map((r) => (
        <li key={r.id}>{r.guestName}</li>
      ))}
    </ul>
  );
}

const SAMPLE = [
  { id: 1, guestName: "Ali" },
  { id: 2, guestName: "Sara" },
  { id: 3, guestName: "Reza" },
];

export default function StateColocationDemo() {
  return (
    <div>
      <SearchBar />
      <ReservationTable reservations={SAMPLE} />
    </div>
  );
}
