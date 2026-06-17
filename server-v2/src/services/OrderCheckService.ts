import { NotFoundError, BadRequestError } from '../errors.js';
import * as orderCheckRepository from '../repositories/OrderCheckRepository.js';
import { buildCartItems, calculateDeliveryFee } from './CartItemsService.js';
import type { OrderCheckProduct, OrderCheckPayInfo } from '../dto/orderCheck.dto.js';

const REMOTE_AREA_EXTRA_FEE = 3000;

const buildSelectedOrderCheckProducts = async (): Promise<OrderCheckProduct[]> => {
  const items = await buildCartItems();

  return items
    .filter((item) => item.checkStatus)
    .map((item) => ({ ...item.product, quantity: item.quantity }));
};

const findOrderOrThrow = async () => {
  const order = await orderCheckRepository.getOrder();

  if (!order) {
    throw new NotFoundError({
      errorCode: 'RESOURCE_NOT_FOUND',
      errorMessage: '해당 유저의 장바구니로 만들어진 주문이 없습니다.',
    });
  }

  return order;
};

const validateCheckStatusShape = (checkStatus: unknown) => {
  if (checkStatus === undefined) {
    throw new BadRequestError({
      errorCode: 'MISSING_FIELD',
      errorMessage: 'checkStatus는 필수입니다.',
      data: [{ type: 'checkStatus', errorCode: 'REQUIRED' }],
    });
  }
};

// 장바구니에서 선택된 상품을 그대로 스냅샷으로 떠서 주문 확인을 생성한다.
export const createOrderCheck = async (): Promise<{ products: OrderCheckProduct[] }> => {
  const products = await buildSelectedOrderCheckProducts();
  const order = await orderCheckRepository.createOrder(products);

  return { products: order.products };
};

export const getOrderCheckProducts = async (): Promise<{ products: OrderCheckProduct[] }> => {
  const order = await orderCheckRepository.getOrder();

  return { products: order?.products ?? [] };
};

export const getOrderCheckPayInfo = async (): Promise<OrderCheckPayInfo> => {
  const order = await findOrderOrThrow();
  const orderPrice = order.products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );
  const { remoteAreaCheckStatus } = order;
  const deliveryFee =
    calculateDeliveryFee(orderPrice) + (orderPrice > 0 && remoteAreaCheckStatus ? REMOTE_AREA_EXTRA_FEE : 0);
  // TODO: 쿠폰 적용 기능 구현 전까지 0으로 고정.
  const couponDiscountAmount = 0;

  return {
    orderPrice,
    deliveryFee,
    couponDiscountAmount,
    totalOrderAmount: orderPrice + deliveryFee - couponDiscountAmount,
  };
};

export const selectRemoteArea = async (checkStatus: unknown): Promise<{ checkStatus: boolean }> => {
  validateCheckStatusShape(checkStatus);

  const order = await findOrderOrThrow();
  const updated = await orderCheckRepository.setRemoteAreaCheckStatus(order, checkStatus as boolean);
  return { checkStatus: updated.remoteAreaCheckStatus };
};
