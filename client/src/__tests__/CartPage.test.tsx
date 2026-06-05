import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import CartPage from '../pages/CartPage';

const renderCartPage = () =>
    render(
        <MemoryRouter>
            <CartPage />
        </MemoryRouter>
    );

describe('CartPage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('로딩 중 "로딩 중..." 텍스트가 보인다', () => {
        renderCartPage();

        expect(screen.getByText('로딩 중...')).toBeInTheDocument();
    });

    it('API 실패 시 에러 문구가 보인다', async () => {
        server.use(
            http.get('http://localhost:3000/carts/1', () =>
                HttpResponse.json({ status: 500 }, { status: 500 })
            )
        );

        renderCartPage();

        await waitFor(() => {
            expect(screen.getByText('상품을 불러오지 못했습니다.')).toBeInTheDocument();
        });
    });

    it('로드 완료 후 상품 목록이 렌더링된다', async () => {
        renderCartPage();

        await waitFor(() => {
            expect(screen.getByText('Shopping Basket')).toBeInTheDocument();
            expect(screen.getByText('Reusable Cup')).toBeInTheDocument();
        });
    });

    it('체크된 상품이 없으면 주문 확인 버튼이 disabled다', async () => {
        localStorage.setItem('cart_checked_ids', JSON.stringify([]));

        renderCartPage();

        await waitFor(() => {
            expect(screen.getByText('Shopping Basket')).toBeInTheDocument();
        });

        expect(screen.getByRole('button', { name: '주문 확인' })).toBeDisabled();
    });

    it('체크된 상품이 있으면 주문 확인 버튼이 활성화된다', async () => {
        renderCartPage();

        await waitFor(() => {
            expect(screen.getByText('Shopping Basket')).toBeInTheDocument();
        });

        expect(screen.getByRole('button', { name: '주문 확인' })).toBeEnabled();
    });

    it('체크된 상품의 주문 금액, 배송비, 총 결제 금액이 올바르게 표시된다', async () => {
        // Shopping Basket 18,000 × 2 + Reusable Cup 9,900 × 1 = 45,900
        // deliveryFee = 3,000 (45,900 < 100,000)
        // total = 48,900
        renderCartPage();

        await waitFor(() => {
            expect(screen.getByText('Shopping Basket')).toBeInTheDocument();
        });

        expect(screen.getByText('주문 금액').nextElementSibling).toHaveTextContent('45,900원');
        expect(screen.getByText('배송비').nextElementSibling).toHaveTextContent('3,000원');
        expect(screen.getByText('총 결제 금액').nextElementSibling).toHaveTextContent('48,900원');
    });
});
