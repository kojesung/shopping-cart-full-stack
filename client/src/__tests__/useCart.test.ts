import { renderHook, act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { useCart } from '../hooks/useCart';

const BASE_URL = 'http://localhost:3000';

describe('useCart', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('마운트 시 apiStatus가 loading이 된다', () => {
        const { result } = renderHook(() => useCart());

        expect(result.current.apiStatus).toBe('loading');
    });

    it('로드 완료 후 apiStatus가 success이고 products가 채워진다', async () => {
        const { result } = renderHook(() => useCart());

        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        expect(result.current.products).toHaveLength(2);
        expect(result.current.products[0].name).toBe('Shopping Basket');
        expect(result.current.products[1].name).toBe('Reusable Cup');
    });

    it('API 실패 시 apiStatus가 error가 된다', async () => {
        server.use(
            http.get(`${BASE_URL}/carts/1`, () =>
                HttpResponse.json({ status: 500 }, { status: 500 })
            )
        );

        const { result } = renderHook(() => useCart());

        await waitFor(() => expect(result.current.apiStatus).toBe('error'));
    });

    it('localStorage에 저장된 체크 ID가 있으면 해당 상품만 체크 상태로 초기화된다', async () => {
        localStorage.setItem('cart_checked_ids', JSON.stringify([1]));

        const { result } = renderHook(() => useCart());

        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        expect(result.current.checkStatus).toEqual([true, false]);
    });

    it('handleIncrease 호출 시 수량이 낙관적으로 즉시 증가한다', async () => {
        const { result } = renderHook(() => useCart());
        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        await act(async () => {
            result.current.handleIncrease(0);
        });

        expect(result.current.quantityStatus[0]).toBe(3);
    });

    it('remove 호출 시 DELETE 성공 후 해당 상품이 products에서 제거된다', async () => {
        const { result } = renderHook(() => useCart());
        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        await act(async () => {
            await result.current.remove(0);
        });

        expect(result.current.products).toHaveLength(1);
        expect(result.current.products[0].name).toBe('Reusable Cup');
    });

    it('remove 호출 시 DELETE 실패 시 products가 변경되지 않는다', async () => {
        const { result } = renderHook(() => useCart());
        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        server.use(
            http.delete(`${BASE_URL}/carts/:cartId/products/:productId`, () =>
                HttpResponse.json({ status: 500 }, { status: 500 })
            )
        );

        await act(async () => {
            await result.current.remove(0);
        });

        expect(result.current.products).toHaveLength(2);
    });
});
