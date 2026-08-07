import { useForm } from "react-hook-form";

export function CabinForm({ cabinToEdit = {}, onSubmit }) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const { errors } = formState;

  function handleFormSubmit(data) {
    const image =
      typeof data.image === "string" ? data.image : data.image?.[0];
    onSubmit({ ...data, image }, { onSuccess: () => reset() });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <label htmlFor="name">Cabin name</label>
      <input
        id="name"
        {...register("name", { required: "Name is required" })}
      />
      {errors.name && <span>{errors.name.message}</span>}

      <label htmlFor="maxCapacity">Maximum capacity</label>
      <input
        type="number"
        id="maxCapacity"
        {...register("maxCapacity", { required: true, min: 1 })}
      />

      <button type="submit">{isEditSession ? "Edit" : "Create"} cabin</button>
    </form>
  );
}
