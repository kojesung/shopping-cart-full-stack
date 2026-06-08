import type { CartItem } from '../hooks/useCart';

export const toggleCheck = (items: CartItem[], productId: number) => {
    items.map((item) => (item.id === productId ? { ...item, checked: !item.checked } : null));
};

export const remove = (items: CartItem[], productId: number) => {
    items.filter((item) => item.id !== productId);
};

export const toggleAllCheck = (items: CartItem[]) => {
    const isAllChecked = items.every((item) => item.checked);
    return items.map((item) => ({ ...item, checked: !isAllChecked }));
};

export const increaseQuantity = (items: CartItem[], productId: number) => {
    items.map((item) => (item.id === productId ? { ...item, quantity: Math.min(item.quantity + 1, 99) } : item));
};

export const decreaseQuantity = (items: CartItem[], productId: number) => {
    items.map((item) => (item.id === productId ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item));
};
