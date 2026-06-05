import { useEffect, useState } from 'react';
import { optimisticUpdate } from '../optimisticUpdate';
import { useCheckboxStatus } from './useCheckboxStatus';
import { useQuantityStatus } from './useQuantityStatus';
import { cartApiService, type Product } from '../api/cartApiService';

export const useCart = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const {
        checkStatus,
        isAllChecked,
        toggle: handleToggle,
        toggleAll: handleToggleAll,
        remove: removeCheck,
        initCheckStatus,
    } = useCheckboxStatus(0);
    const { quantityStatus, increase, decrease, remove: removeQuantity, initQuantityStatus } = useQuantityStatus([]);

    useEffect(() => {
        const fetchCart = async () => {
            setApiStatus('loading');
            try {
                const data = await cartApiService.getCart(1);
                const savedJson = localStorage.getItem('cart_checked_ids');
                const savedIds = savedJson ? new Set(JSON.parse(savedJson) as number[]) : null;
                const statuses = data.data.products.map((p) => (savedIds ? savedIds.has(p.id) : true));
                setProducts(data.data.products);
                initCheckStatus(statuses);
                initQuantityStatus(data.data.products.map((p) => p.quantity));
                setApiStatus('success');
            } catch {
                setApiStatus('error');
            }
        };

        fetchCart();
    }, []);

    useEffect(() => {
        if (products.length === 0) return;
        const checkedIds = products.filter((_, i) => checkStatus[i]).map((p) => p.id);
        localStorage.setItem('cart_checked_ids', JSON.stringify(checkedIds));
    }, [checkStatus, products]);

    const handleIncrease = (index: number) => {
        optimisticUpdate({
            apiCallFn: () => cartApiService.updateCartProductQuantity(1, products[index].id, quantityStatus[index] + 1),
            onSuccess: () => increase(index),
            onError: () => decrease(index),
        });
    };

    const handleDecrease = (index: number) => {
        optimisticUpdate({
            apiCallFn: () => cartApiService.updateCartProductQuantity(1, products[index].id, quantityStatus[index] - 1),
            onSuccess: () => decrease(index),
            onError: () => increase(index),
        });
    };

    const remove = async (index: number) => {
        try {
            await cartApiService.deleteCartProduct(1, products[index].id);
        } catch {
            return;
        }
        setProducts((prev) => prev.filter((_, i) => i !== index));
        removeCheck(index);
        removeQuantity(index);
    };
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
