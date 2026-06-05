import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import CartItems from '../components/CartItems';
import PageLayout from '../layouts/PageLayout';
import { useCart } from '../hooks/useCart';

export default function CartPage() {
    const {
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
    } = useCart();

    const orderAmount = products.reduce(
        (sum, product, index) => sum + (checkStatus[index] ? product.price * quantityStatus[index] : 0),
        0
    );
    const deliveryFee = orderAmount >= 100000 ? 0 : 3000;
    const totalAmount = orderAmount + deliveryFee;

    const totalQuantity = products.reduce((sum, _, i) => sum + (checkStatus[i] ? quantityStatus[i] : 0), 0);
    const isButtonDisabled = apiStatus !== 'success' || !checkStatus.some(Boolean);

    const navigate = useNavigate();
    const handleOrder = () => {
        navigate('/order-confirm', {
            state: {
                productCount: checkStatus.filter(Boolean).length,
                totalQuantity,
                totalAmount,
            },
        });
    };

    return (
        <PageLayout
            bottomButtonLabel="주문 확인"
            onBottomButtonClick={handleOrder}
            isBottomButtonDisabled={isButtonDisabled}
        >
            {apiStatus === 'loading' && <p>로딩 중...</p>}
            {apiStatus === 'error' && <p>상품을 불러오지 못했습니다.</p>}
            {apiStatus === 'success' && (
                <>
                    <HeadingContents>
                        <Heading>장바구니</Heading>
                        <CartDescription>
                            현재 {checkStatus.filter(Boolean).length}종류의 상품이 담겨있습니다.
                        </CartDescription>
                    </HeadingContents>
                    <CartItems
                        products={products}
                        quantityStatus={quantityStatus}
                        checkStatus={checkStatus}
                        isAllChecked={isAllChecked}
                        onIncrease={handleIncrease}
                        onDecrease={handleDecrease}
                        onToggle={handleToggle}
                        onToggleAll={handleToggleAll}
                        onDelete={remove}
                    />
                    <OrderInfoSection>
                        <p>총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.</p>
                        <hr />
                        <OrderTypeAmount>
                            <OrderType>주문 금액</OrderType>
                            <OrderAmount>{orderAmount.toLocaleString()}원</OrderAmount>
                        </OrderTypeAmount>
                        <OrderTypeAmount>
                            <OrderType>배송비</OrderType>
                            <OrderAmount>{deliveryFee.toLocaleString()}원</OrderAmount>
                        </OrderTypeAmount>
                        <hr />
                        <OrderTypeAmount>
                            <OrderType>총 결제 금액</OrderType>
                            <OrderAmount>{totalAmount.toLocaleString()}원</OrderAmount>
                        </OrderTypeAmount>
                    </OrderInfoSection>
                </>
            )}
        </PageLayout>
    );
}

const HeadingContents = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 36px 0;
`;

const Heading = styled.h3`
    font-weight: 700;
    font-size: 24px;
    line-height: 100%;
    margin: 0;
`;

const CartDescription = styled.p`
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    margin: 0;
`;

const OrderInfoSection = styled.section`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 24px;
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
