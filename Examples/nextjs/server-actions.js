// Examples/nextjs/server-actions.js
// مستندات: Nextjs/Server-Actions.md

"use server";

import { revalidatePath } from "next/cache";

export async function createReservation(formData) {
  const cabinId = formData.get("cabinId");
  const startDate = formData.get("startDate");
  const endDate = formData.get("endDate");

  const reservation = { cabinId, startDate, endDate, id: crypto.randomUUID() };

  // revalidatePath("/account/reservations");
  return { success: true, reservation };
}

export async function deleteReservation(id) {
  // delete from database
  revalidatePath("/account/reservations");
  return { success: true, id };
}
