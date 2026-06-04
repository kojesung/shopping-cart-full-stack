import { http, HttpResponse } from 'msw';

interface Product {
    id: number;
    price: number;
    name: string;
    imgUrl: string;
}

interface CartProduct {
    id: number;
    quantity: number;
}

interface Cart {
    id: number;
    products: CartProduct[];
}

const PLACEHOLDER_IMG =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='112' height='112'%3E%3Crect width='112' height='112' fill='%23e5e7eb'/%3E%3C/svg%3E";

const initialProducts: Product[] = [
    { id: 1, price: 18000, name: 'Shopping Basket', imgUrl: PLACEHOLDER_IMG },
    { id: 2, price: 32000, name: 'Tote Bag', imgUrl: PLACEHOLDER_IMG },
    { id: 3, price: 9900, name: 'Reusable Cup', imgUrl: PLACEHOLDER_IMG },
];

const initialCarts: Cart[] = [
    {
        id: 1,
        products: [
            { id: 1, quantity: 2 },
            { id: 3, quantity: 1 },
        ],
    },
    { id: 2, products: [{ id: 2, quantity: 1 }] },
];

let products: Product[] = initialProducts.map((p) => ({ ...p }));
let carts: Cart[] = initialCarts.map((c) => ({ ...c, products: c.products.map((p) => ({ ...p })) }));
let nextProductId = 4;

export const resetStore = () => {
    products = initialProducts.map((p) => ({ ...p }));
    carts = initialCarts.map((c) => ({ ...c, products: c.products.map((p) => ({ ...p })) }));
    nextProductId = 4;
};

const BASE_URL = 'http://localhost:3000';

export const handlers = [
    http.get(`${BASE_URL}/products`, () => {
        return HttpResponse.json({ data: products });
    }),

    http.post(`${BASE_URL}/products`, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        const { price, name, imgUrl } = body;

        if (typeof price !== 'number' || typeof name !== 'string' || typeof imgUrl !== 'string') {
            return HttpResponse.json(
                { status: 400, errorCode: 'TYPE_MISMATCH', errorMessage: '타입이 일치하지 않습니다.' },
                { status: 400 }
            );
        }

        const newProduct: Product = { id: nextProductId++, price, name, imgUrl };
        products.push(newProduct);
        return HttpResponse.json({ data: newProduct });
    }),

    http.delete(`${BASE_URL}/products/:id`, ({ params }) => {
        const id = Number(params.id);
        const index = products.findIndex((p) => p.id === id);

        if (index === -1) {
            return HttpResponse.json(
                {
                    status: 404,
                    errorCode: 'RESOURCE_NOT_FOUND',
                    errorMessage: 'id에 해당하는 상품이 존재하지 않습니다.',
                },
                { status: 404 }
            );
        }

        products.splice(index, 1);
        return new HttpResponse(null, { status: 204 });
    }),

    http.get(`${BASE_URL}/carts/:cartId`, ({ params }) => {
        const cartId = Number(params.cartId);
        const cart = carts.find((c) => c.id === cartId);

        if (!cart) {
            return HttpResponse.json(
                {
                    status: 404,
                    errorCode: 'RESOURCE_NOT_FOUND',
                    errorMessage: 'id에 해당하는 장바구니가 존재하지 않습니다.',
                },
                { status: 404 }
            );
        }

        const cartWithProducts = {
            id: cart.id,
            products: cart.products.map((cp) => {
                const product = products.find((p) => p.id === cp.id)!;
                return { ...product, quantity: cp.quantity };
            }),
        };

        return HttpResponse.json({ data: cartWithProducts });
    }),

    http.patch(`${BASE_URL}/carts/:cartId/products/:productId`, async ({ params, request }) => {
        const cartId = Number(params.cartId);
        const productId = Number(params.productId);
        const body = (await request.json()) as Record<string, unknown>;

        const cart = carts.find((c) => c.id === cartId);
        if (!cart) {
            return HttpResponse.json(
                {
                    status: 404,
                    errorCode: 'RESOURCE_NOT_FOUND',
                    errorMessage: 'id에 해당하는 장바구니 상품이 존재하지 않습니다.',
                },
                { status: 404 }
            );
        }

        const cartProduct = cart.products.find((p) => p.id === productId);
        if (!cartProduct) {
            return HttpResponse.json(
                {
                    status: 404,
                    errorCode: 'RESOURCE_NOT_FOUND',
                    errorMessage: 'id에 해당하는 장바구니 상품이 존재하지 않습니다.',
                },
                { status: 404 }
            );
        }

        cartProduct.quantity = body.quantity as number;
        const product = products.find((p) => p.id === productId)!;
        return HttpResponse.json({ data: { ...product, quantity: cartProduct.quantity } }, { status: 201 });
    }),

    http.delete(`${BASE_URL}/carts/:cartId/products/:productId`, ({ params }) => {
        const cartId = Number(params.cartId);
        const productId = Number(params.productId);

        const cart = carts.find((c) => c.id === cartId);
        if (!cart) {
            return HttpResponse.json(
                {
                    status: 404,
                    errorCode: 'RESOURCE_NOT_FOUND',
                    errorMessage: 'id에 해당하는 장바구니 상품이 존재하지 않습니다.',
                },
                { status: 404 }
            );
        }

        const index = cart.products.findIndex((p) => p.id === productId);
        if (index === -1) {
            return HttpResponse.json(
                {
                    status: 404,
                    errorCode: 'RESOURCE_NOT_FOUND',
                    errorMessage: 'id에 해당하는 장바구니 상품이 존재하지 않습니다.',
                },
                { status: 404 }
            );
        }

        cart.products.splice(index, 1);
        return new HttpResponse(null, { status: 204 });
    }),
];
