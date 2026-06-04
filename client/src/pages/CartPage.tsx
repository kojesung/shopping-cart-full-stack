import styled from '@emotion/styled';
import CartItems from '../components/CartItems';
import { useCart } from '../hooks/useCart';

export default function CartPage() {
    const { products, quantityStatus, checkStatus, apiStatus, handleIncrease, handleDecrease, handleToggle, remove } =
        useCart();

    const orderAmount = products.reduce(
        (sum, product, index) => sum + (checkStatus[index] ? product.price * quantityStatus[index] : 0),
        0
    );
    const deliveryFee = orderAmount >= 100000 ? 0 : 3000;
    const totalAmount = orderAmount + deliveryFee;

    if (apiStatus === 'loading') return <p>로딩 중...</p>;
    if (apiStatus === 'error') return <p>상품을 불러오지 못했습니다.</p>;

    return (
        <>
            <HeadingContents>
                <Heading>장바구니</Heading>
                <CartDescription>현재 {products.length}종류의 상품이 담겨있습니다.</CartDescription>
            </HeadingContents>
            <CartItems
                products={products}
                quantityStatus={quantityStatus}
                checkStatus={checkStatus}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onToggle={handleToggle}
                onDelete={remove}
            />
            <OrderInfoSection>
                <p>총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.</p>
                <hr />
                <>
                    <OrderTypeAmount>
                        <OrderType>주문 금액</OrderType>
                        <OrderAmount>{orderAmount.toLocaleString()}원</OrderAmount>
                    </OrderTypeAmount>
                    <OrderTypeAmount>
                        <OrderType>배송비</OrderType>
                        <OrderAmount>{deliveryFee.toLocaleString()}원</OrderAmount>
                    </OrderTypeAmount>
                </>
                <hr />
                <OrderTypeAmount>
                    <OrderType>총 결제 금액</OrderType>
                    <OrderAmount>{totalAmount.toLocaleString()}원</OrderAmount>
                </OrderTypeAmount>
            </OrderInfoSection>
            <button>주문 확인</button>
        </>
    );
}

const HeadingContents = styled.div`
    width: 382px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 36px 0 36px 0;
`;

const Heading = styled.h3`
    font-weight: 700;
    font-size: 24px;
    line-height: 100%;
`;

const CartDescription = styled.p`
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    margin: 0;
`;

const OrderInfoSection = styled.section`
    width: 382px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const OrderTypeAmount = styled.div`
    display: flex;
    justify-content: space-between;
`;

const OrderType = styled.p`
    font-weight: 700;
    font-size: 16px;
    line-height: 16px;
    margin: 0;
`;

const OrderAmount = styled.p`
    font-weight: 700;
    font-size: 24px;
    line-height: 100%;
    margin: 0;
`;
