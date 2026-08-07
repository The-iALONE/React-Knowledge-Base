// Examples/nextjs/OptimisticDelete.jsx
// مستندات: Nextjs/Server-Actions.md — useOptimistic

"use client";

import { useOptimistic, useTransition } from "react";
import { deleteReservation } from "./server-actions";

export function ReservationList({ reservations }) {
  const [optimisticReservations, removeOptimistic] = useOptimistic(
    reservations,
    (state, deletedId) => state.filter((r) => r.id !== deletedId),
  );
  const [isPending, startTransition] = useTransition();

  function handleDelete(id) {
    startTransition(async () => {
      removeOptimistic(id);
      await deleteReservation(id);
    });
  }

  return (
    <ul>
      {optimisticReservations.map((reservation) => (
        <li key={reservation.id}>
          Cabin {reservation.cabinId}
          <button onClick={() => handleDelete(reservation.id)} disabled={isPending}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
