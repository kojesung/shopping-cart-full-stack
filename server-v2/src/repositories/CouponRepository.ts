import type { CouponDescription } from '../dto/coupon.dto.js';
import * as orderCheckRepository from './OrderCheckRepository.js';

// API로 노출하는 Coupon DTO보다 더 많은 정보(할인 계산에 필요한 값)를 들고 있는 저장소 전용 레코드.
// FIXED/PERCENTAGE는 discountValue로 계산하고, BOGO/FREE_SHIPPING은 금액·비율로 표현되지 않는
// 혜택이라 discountValue를 쓰지 않는다(0으로 둠).
export interface CouponRecord {
  couponId: string;
  couponTitle: string;
  discountType: 'FIXED' | 'PERCENTAGE' | 'BOGO' | 'FREE_SHIPPING';
  discountValue: number; // FIXED면 원 단위 금액, PERCENTAGE면 0~1 사이 비율
  minOrderAmount: number;
  minQuantityPerProduct?: number; // BOGO 전용: 동일 상품 최소 구매 수량
  usableTime?: { from: string; to: string }; // 시간제 할인 전용
  expiresAt: string;
  description: CouponDescription[];
}

const couponRecords = new Map<string, CouponRecord>();

const dummyCouponRecords: CouponRecord[] = [
  {
    couponId: 'FIXED5000',
    couponTitle: '5,000원 할인 쿠폰',
    discountType: 'FIXED',
    discountValue: 5000,
    minOrderAmount: 100000,
    expiresAt: '2026-11-30',
    description: [
      { type: 'MIN_ORDER_AMOUNT', content: { minAmount: 100000 } },
      { type: 'EXPIRY_DATE', content: { expiresAt: '2026-11-30' } },
    ],
  },
  {
    couponId: 'BOGO',
    couponTitle: '2+1 쿠폰',
    discountType: 'BOGO',
    discountValue: 0,
    minOrderAmount: 0,
    minQuantityPerProduct: 2,
    expiresAt: '2026-06-30',
    description: [
      { type: 'MIN_QUANTITY_PER_PRODUCT', content: { minQuantity: 2 } },
      { type: 'EXPIRY_DATE', content: { expiresAt: '2026-06-30' } },
    ],
  },
  {
    couponId: 'FREESHIPPING',
    couponTitle: '무료 배송 쿠폰',
    discountType: 'FREE_SHIPPING',
    discountValue: 0,
    minOrderAmount: 50000,
    expiresAt: '2026-08-31',
    description: [
      { type: 'MIN_ORDER_AMOUNT', content: { minAmount: 50000 } },
      { type: 'EXPIRY_DATE', content: { expiresAt: '2026-08-31' } },
    ],
  },
  {
    couponId: 'MIRACLESALE',
    couponTitle: '30% 시간제 할인 쿠폰',
    discountType: 'PERCENTAGE',
    discountValue: 0.3,
    minOrderAmount: 0,
    usableTime: { from: '04:00', to: '07:00' },
    expiresAt: '2026-07-31',
    description: [
      { type: 'USABLE_TIME', content: { from: '04:00', to: '07:00' } },
      { type: 'EXPIRY_DATE', content: { expiresAt: '2026-07-31' } },
    ],
  },
];

dummyCouponRecords.forEach((record) => couponRecords.set(record.couponId, record));

export const getAll = async () => {
  return Array.from(couponRecords.values());
};

export const getById = async (couponId: string) => {
  return couponRecords.get(couponId);
};

// 선택된 쿠폰 목록은 더 이상 이 레포지토리가 들고 있지 않고, orderCheckRepository의
// OrderCheckRecord.selectedCouponIds에서 가져온다 (주문 확인 하나에 귀속되는 상태이기 때문).
export const getSelectedCouponIds = async (userId: string) => {
  const order = await orderCheckRepository.getOrder(userId);
  return order?.selectedCouponIds ?? [];
};

export const setSelectedCouponIds = async (userId: string, couponIds: string[]) => {
  const order = await orderCheckRepository.getOrder(userId);

  if (!order) {
    return [];
  }

  const updated = await orderCheckRepository.setSelectedCouponIds(order, couponIds);
  return updated.selectedCouponIds;
};
