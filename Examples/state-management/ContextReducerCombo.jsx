import { createContext, useContext, useReducer } from "react";

const CartContext = createContext(null);

const initialState = { items: [] };

function cartReducer(state, action) {
  switch (action.type) {
    case "add":
      return { items: [...state.items, action.payload] };
    case "remove":
      return {
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "clear":
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext value={{ state, dispatch }}>
      {children}
    </CartContext>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

// Usage:
// dispatch({ type: "add", payload: pizza })
