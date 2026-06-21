import { useEffect, useState } from 'react';
import { optimisticUpdate } from '../optimisticUpdate';
import {
    toggleCheck,
    toggleAllCheck,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    isAllChecked as getIsAllChecked,
} from '../utils/cartItemUtils';
import { cartItemsApiService } from '../api/cartItemsApiService';
import type { CartItem, Product } from '../api/apiTypes';

export const useCart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        const fetchCart = async () => {
            setApiStatus('loading');
            try {
                const data = await cartItemsApiService.getCart();
                setCartItems(
                    data.data.cartItems.map((product) => ({
                        ...product,
                    }))
                );
                setApiStatus('success');
            } catch {
                setApiStatus('error');
            }
        };

        fetchCart();
    }, []);

    const handleIncrease = (productId: string) => {
        const { quantity } = cartItems.find((item) => item.product.id === productId)!;
        optimisticUpdate({
            apiCallFn: () => cartItemsApiService.updateCartItemQuantity(productId, quantity + 1),
            onSuccess: () => setCartItems((prev) => increaseQuantity(prev, productId)),
            onError: () => setCartItems((prev) => decreaseQuantity(prev, productId)),
        });
    };

    const handleDecrease = (productId: string) => {
        const { quantity } = cartItems.find((item) => item.product.id === productId)!;
        optimisticUpdate({
            apiCallFn: () => cartItemsApiService.updateCartItemQuantity(productId, quantity - 1),
            onSuccess: () => setCartItems((prev) => decreaseQuantity(prev, productId)),
            onError: () => setCartItems((prev) => increaseQuantity(prev, productId)),
        });
    };

    const handleToggle = (productId: string) => {
        const newCheckStatus = !cartItems.find((item) => item.product.id === productId)!.checkStatus;

        optimisticUpdate({
            apiCallFn: () => cartItemsApiService.selectCartItem(productId, newCheckStatus),
            onSuccess: () => setCartItems((prev) => toggleCheck(prev, productId)),
            onError: () => setCartItems((prev) => toggleCheck(prev, productId)),
        });
    };

    const handleToggleAll = () => {
        setCartItems((prev) => toggleAllCheck(prev));
    };

    const remove = async (productId: string) => {
        try {
            await cartItemsApiService.deleteCartItem(productId);
        } catch {
            return;
        }
        setCartItems((prev) => removeItem(prev, productId));
    };

    const products: Product[] = cartItems.map(({ product, quantity }) => ({
        id: product.id,
        price: product.price,
        name: product.name,
        imgUrl: product.imgUrl,
        quantity,
    }));
    const quantityStatus = cartItems.map((item) => item.quantity);
    const checkStatus = cartItems.map((item) => item.checkStatus);
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
