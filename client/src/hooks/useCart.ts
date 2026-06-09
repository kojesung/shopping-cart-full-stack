import { useEffect, useRef, useState } from 'react';
import { optimisticUpdate } from '../optimisticUpdate';
import {
    toggleCheck,
    toggleAllCheck,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    isAllChecked as getIsAllChecked,
} from '../utils/cartItemUtils';
import { cartApiService, type CartProduct, type Product } from '../api/cartApiService';

export interface CartItem extends CartProduct {
    checked: boolean;
}

export const useCart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const cartIdRef = useRef<number | null>(null);

    useEffect(() => {
        const fetchCart = async () => {
            setApiStatus('loading');
            try {
                const data = await cartApiService.getCart(1);
                cartIdRef.current = data.data.id;
                const savedJson = localStorage.getItem('cart_checked_ids');
                const savedIds = savedJson ? new Set(JSON.parse(savedJson) as number[]) : null;
                setCartItems(
                    data.data.products.map((product) => ({
                        ...product,
                        checked: savedIds ? savedIds.has(product.id) : true,
                    }))
                );
                setApiStatus('success');
            } catch {
                setApiStatus('error');
            }
        };

        fetchCart();
    }, []);

    useEffect(() => {
        if (cartItems.length === 0) return;
        const checkedIds = cartItems.filter((item) => item.checked).map((item) => item.id);
        localStorage.setItem('cart_checked_ids', JSON.stringify(checkedIds));
    }, [cartItems]);

    const handleIncrease = (productId: number) => {
        const { quantity } = cartItems.find((item) => item.id === productId)!;
        optimisticUpdate({
            apiCallFn: () => cartApiService.updateCartProductQuantity(cartIdRef.current!, productId, quantity + 1),
            onSuccess: () => setCartItems((prev) => increaseQuantity(prev, productId)),
            onError: () => setCartItems((prev) => decreaseQuantity(prev, productId)),
        });
    };

    const handleDecrease = (productId: number) => {
        const { quantity } = cartItems.find((item) => item.id === productId)!;
        optimisticUpdate({
            apiCallFn: () => cartApiService.updateCartProductQuantity(cartIdRef.current!, productId, quantity - 1),
            onSuccess: () => setCartItems((prev) => decreaseQuantity(prev, productId)),
            onError: () => setCartItems((prev) => increaseQuantity(prev, productId)),
        });
    };

    const handleToggle = (productId: number) => {
        setCartItems((prev) => toggleCheck(prev, productId));
    };

    const handleToggleAll = () => {
        setCartItems((prev) => toggleAllCheck(prev));
    };

    const remove = async (productId: number) => {
        try {
            await cartApiService.deleteCartProduct(cartIdRef.current!, productId);
        } catch {
            return;
        }
        setCartItems((prev) => removeItem(prev, productId));
    };

    const products: Product[] = cartItems.map(({ id, price, name, imgUrl, quantity }) => ({
        id,
        price,
        name,
        imgUrl,
        quantity,
    }));
    const quantityStatus = cartItems.map((item) => item.quantity);
    const checkStatus = cartItems.map((item) => item.checked);
    const isAllChecked = getIsAllChecked(cartItems);

    return {
        products,
        quantityStatus,
        checkStatus,
        isAllChecked,
        apiStatus,
        handleIncrease,
        handleDecrease,
        handleToggle,
        handleToggleAll,
        remove,
    };
};
