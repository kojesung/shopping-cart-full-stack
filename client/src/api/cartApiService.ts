import { cartFetcher } from './cartFetcher';

export interface Product {
    id: number;
    price: number;
    name: string;
    imgUrl: string;
}

export interface CartProduct extends Product {
    quantity: number;
}

export interface Cart {
    id: number;
    products: CartProduct[];
}

export const cartApiService = {
    getProducts: () => cartFetcher<{ data: Product[] }>('/products'),

    createProduct: (product: Omit<Product, 'id'>) =>
        cartFetcher<{ data: Product }>('/products', {
            method: 'POST',
            body: JSON.stringify(product),
        }),

    deleteProduct: (productId: number) => cartFetcher<null>(`/products/${productId}`, { method: 'DELETE' }),

    getCart: (cartId: number) => cartFetcher<{ data: Cart }>(`/carts/${cartId}`),

    updateCartProductQuantity: (cartId: number, productId: number, quantity: number) =>
        cartFetcher<{ data: CartProduct }>(`/carts/${cartId}/products/${productId}`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity }),
        }),

    deleteCartProduct: (cartId: number, productId: number) =>
        cartFetcher<null>(`/carts/${cartId}/products/${productId}`, { method: 'DELETE' }),
};
