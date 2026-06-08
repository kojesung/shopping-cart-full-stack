import type { CartItem } from '../hooks/useCart';

export const toggleCheck = (items: CartItem[], productId: number): CartItem[] =>
    items.map((item) => (item.id === productId ? { ...item, checked: !item.checked } : item));

export const toggleAllCheck = (items: CartItem[]): CartItem[] => {
    const allChecked = items.every((item) => item.checked);
    return items.map((item) => ({ ...item, checked: !allChecked }));
};

export const increaseQuantity = (items: CartItem[], productId: number): CartItem[] =>
    items.map((item) => (item.id === productId ? { ...item, quantity: Math.min(item.quantity + 1, 99) } : item));

export const decreaseQuantity = (items: CartItem[], productId: number): CartItem[] =>
    items.map((item) => (item.id === productId ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item));

export const removeItem = (items: CartItem[], productId: number): CartItem[] =>
    items.filter((item) => item.id !== productId);

export const isAllChecked = (items: CartItem[]): boolean => items.length > 0 && items.every((item) => item.checked);
