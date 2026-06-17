import type { OrderCheckProduct } from '../dto/orderCheck.dto.js';

export interface OrderCheckRecord {
  products: OrderCheckProduct[];
  remoteAreaCheckStatus: boolean;
}

// 더미 저장소: 주문 확인은 사용자당 1건만 존재한다고 가정한다 (인증/사용자별 분리는 범위 밖).
// TODO cartItem과 함께 멀티 유저 고려할 수 있는 자료구조로 수정
let orderCheckRecord: OrderCheckRecord | null = null;

export const getOrder = async () => {
  return orderCheckRecord;
};

export const createOrder = async (products: OrderCheckProduct[]) => {
  orderCheckRecord = { products, remoteAreaCheckStatus: false };
  return orderCheckRecord;
};

export const setRemoteAreaCheckStatus = async (record: OrderCheckRecord, checkStatus: boolean) => {
  record.remoteAreaCheckStatus = checkStatus;
  return record;
};
