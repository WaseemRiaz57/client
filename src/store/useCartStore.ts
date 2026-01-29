import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  brand: string;
  modelName: string;
  price: number;
  discountPrice?: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
}

// Calculate totals helper
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.discountPrice || item.price;
    return sum + price * item.quantity;
  }, 0);
  
  return { totalItems, totalPrice };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex((item) => item.id === newItem.id);

          let updatedItems: CartItem[];

          if (existingItemIndex > -1) {
            // Item exists, increment quantity
            updatedItems = state.items.map((item, index) => {
              if (index === existingItemIndex) {
                const newQuantity = Math.min(item.quantity + 1, item.stock);
                return { ...item, quantity: newQuantity };
              }
              return item;
            });
          } else {
            // New item, add to cart
            updatedItems = [...state.items, { ...newItem, quantity: 1 }];
          }

          const { totalItems, totalPrice } = calculateTotals(updatedItems);

          return {
            items: updatedItems,
            totalItems,
            totalPrice,
          };
        });
      },

      removeItem: (id) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== id);
          const { totalItems, totalPrice } = calculateTotals(updatedItems);

          return {
            items: updatedItems,
            totalItems,
            totalPrice,
          };
        });
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            const updatedItems = state.items.filter((item) => item.id !== id);
            const { totalItems, totalPrice } = calculateTotals(updatedItems);

            return {
              items: updatedItems,
              totalItems,
              totalPrice,
            };
          }

          const updatedItems = state.items.map((item) => {
            if (item.id === id) {
              // Ensure quantity doesn't exceed stock
              const newQuantity = Math.min(quantity, item.stock);
              return { ...item, quantity: newQuantity };
            }
            return item;
          });

          const { totalItems, totalPrice } = calculateTotals(updatedItems);

          return {
            items: updatedItems,
            totalItems,
            totalPrice,
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },

      getItemQuantity: (id) => {
        const item = get().items.find((item) => item.id === id);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'luxury-watch-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
