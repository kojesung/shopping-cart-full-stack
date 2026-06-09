import styled from '@emotion/styled';
import { useLocation } from 'react-router-dom';
import PageLayout from '../layouts/PageLayout';

interface OrderConfirmState {
    productCount: number;
    totalQuantity: number;
    totalAmount: number;
}

export default function OrderConfirmPage() {
    const { state } = useLocation() as { state: OrderConfirmState };

    return (
        <PageLayout bottomButtonLabel="결제하기" onBottomButtonClick={() => null} showBackButton isBottomButtonDisabled>
            <CenteredContainer>
                <Section>
                    <h3>주문 확인</h3>
                    <p>
                        총 {state.productCount}종류의 상품 {state.totalQuantity}개를 주문합니다.
                    </p>
                    <p>최종 결제 금액을 확인해 주세요.</p>
                </Section>
                <TotalSection>
                    <strong>총 결제 금액</strong>
                    <TotalAmount>{state.totalAmount.toLocaleString()}원</TotalAmount>
                </TotalSection>
            </CenteredContainer>
        </PageLayout>
    );
}

const CenteredContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 36px;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-top: 36px;

    h3 {
        font-weight: 700;
        font-size: 24px;
        margin: 0;
    }

    p {
        font-size: 12px;
        font-weight: 500;
        line-height: 150%;
        margin: 0;
    }
`;

const TotalSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 11px;

    strong {
        font-weight: 700;
        font-size: 20px;
        line-height: 16px;
    }
`;

const TotalAmount = styled.p`
    margin: 0;
    font-weight: 700;
    font-size: 24px;
    line-height: 100%;
`;
