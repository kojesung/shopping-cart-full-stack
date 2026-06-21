import styled from '@emotion/styled';
import { useCoupon } from '../hooks/useCoupon';
import CouponItem from './CouponItem';

// TODO 서버에서 그냥 string으로 통일해서 포맷팅된 값으로 반환해주면 타입 정의 필요 없어질듯
export type CouponDescription =
    | { type: 'EXPIRY_DATE'; content: { expiresAt: string } }
    | { type: 'MIN_ORDER_AMOUNT'; content: { minAmount: number } }
    | { type: 'USABLE_TIME'; content: { from: string; to: string } }
    | { type: 'MIN_QUANTITY_PER_PRODUCT'; content: { minQuantity: number } };

export interface Coupon {
    couponId: string;
    couponTitle: string;
    disabled: boolean;
    description: CouponDescription[];
}

interface CouponCheckModalProps {
    close: () => void;
}

const MAX_COUPON_COUNT = 2;

export default function CouponCheckModal({ close }: CouponCheckModalProps) {
    const { coupons, selectedIds, discountAmount, toggle, handleConfirm } = useCoupon(close);

    return (
        <Container>
            <Header>
                <Title>쿠폰을 선택해 주세요</Title>
                <CloseButton onClick={close}>✕</CloseButton>
            </Header>
            <Notice>
                <NoticeIcon>ⓘ</NoticeIcon>
                쿠폰은 최대 {MAX_COUPON_COUNT}개까지 사용할 수 있습니다.
            </Notice>
            <CouponList>
                {coupons.map((coupon) => (
                    <CouponItem
                        key={coupon.couponId}
                        coupon={coupon}
                        checked={selectedIds.includes(coupon.couponId)}
                        disabled={
                            coupon.disabled ||
                            (selectedIds.length >= MAX_COUPON_COUNT && !selectedIds.includes(coupon.couponId))
                        }
                        onClick={() => toggle(coupon.couponId)}
                    />
                ))}
            </CouponList>
            <ConfirmButton onClick={handleConfirm}>
                총 {discountAmount.toLocaleString()}원 할인 쿠폰 사용하기
            </ConfirmButton>
        </Container>
    );
}

const Container = styled.div`
    width: 382px;
    height: 614px;
    border-radius: 8px;
    padding: 24px 32px;
    box-sizing: border-box;
    background-color: white;
    display: flex;
    flex-direction: column;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

const Title = styled.h3`
    margin: 0;
    font-weight: 700;
    font-size: 28px;
    line-height: 100%;
`;

// TODO position absolute로 두는 게 더 낫지 않을까? 고민
const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    color: #0a0d13;
`;

const Notice = styled.p`
    margin: 0 0 17px;
    font-size: 12px;
    font-weight: 500;
    color: #0a0d13;
    display: flex;
    align-items: center;
    gap: 4px;
`;

const NoticeIcon = styled.span`
    font-size: 12px;
`;

const CouponList = styled.ul`
    flex: 1;
    margin: 0;
    padding: 0;
    list-style: none;
    overflow-y: auto;
    border-top: 1px solid #0000001a;
`;

const ConfirmButton = styled.button`
    margin-top: 16px;
    width: 100%;
    height: 56px;
    background-color: #1a1a1a;
    color: white;
    font-weight: 700;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
`;
