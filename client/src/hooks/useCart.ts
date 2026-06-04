import { useEffect, useState } from 'react';
import { optimisticUpdate } from '../optimisticUpdate';
import { useCheckboxStatus } from './useCheckboxStatus';
import { useQuantityStatus } from './useQuantityStatus';
import { cartApiService, type Product } from '../api/cartApiService';

export const useCart = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const { checkStatus, toggle: handleToggle, remove: removeCheck, initCheckStatus } = useCheckboxStatus(3);
    const {
        quantityStatus,
        increase,
        decrease,
        remove: removeQuantity,
        initQuantityStatus,
    } = useQuantityStatus([1, 2, 3]);

    useEffect(() => {
        const fetchCart = async () => {
            setApiStatus('loading');
            try {
                const data = await cartApiService.getCart(1);
                setProducts(data.data.products);
                initCheckStatus(data.data.products.length);
                initQuantityStatus(data.data.products.map((p) => p.quantity));
                setApiStatus('success');
            } catch {
                setApiStatus('error');
            }
        };

        fetchCart();
    }, []);

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
    return { products, quantityStatus, checkStatus, apiStatus, handleIncrease, handleDecrease, handleToggle, remove };
};
