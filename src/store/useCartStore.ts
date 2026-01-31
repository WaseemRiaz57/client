import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  brand?: string;
  modelName: string;
  price: number;
  discountPrice?: number;
  image: string;
  quantity: number;
  stock?: number;
}

interface CartState {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'> | CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      totalItems: 0,
      totalPrice: 0,
      
      addItem: (newItem) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((item) => item.id === newItem.id);
        const quantity = 'quantity' in newItem ? newItem.quantity : 1;

        if (existingItem) {
          set({
            cart: currentCart.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ cart: [...currentCart, { ...newItem, quantity }] });
        }
        
        // Update totals
        const updatedCart = get().cart;
        const totalItems = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        set({ totalItems, totalPrice });
      },

      removeItem: (id) => {
        const updatedCart = get().cart.filter((item) => item.id !== id);
        const totalItems = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        set({ cart: updatedCart, totalItems, totalPrice });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        
        const updatedCart = get().cart.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
        const totalItems = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        set({ cart: updatedCart, totalItems, totalPrice });
      },

      clearCart: () => set({ cart: [], totalItems: 0, totalPrice: 0 }),
    }),
    {
      name: 'chronos-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
