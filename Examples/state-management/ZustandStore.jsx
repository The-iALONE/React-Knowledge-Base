import { create } from "zustand";

export const useCartStore = create((set) => ({
  items: [],
  addItem: (pizza) =>
    set((state) => ({ items: [...state.items, pizza] })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clearCart: () => set({ items: [] }),
}));

// Usage in component:
// const items = useCartStore((s) => s.items);
// const addItem = useCartStore((s) => s.addItem);
