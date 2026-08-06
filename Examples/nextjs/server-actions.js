"use server";

export async function createReservation(formData) {
  const cabinId = formData.get("cabinId");
  const startDate = formData.get("startDate");
  const endDate = formData.get("endDate");

  // Validate and save to database
  const reservation = { cabinId, startDate, endDate, id: crypto.randomUUID() };

  // revalidatePath('/reservations');
  return { success: true, reservation };
}
