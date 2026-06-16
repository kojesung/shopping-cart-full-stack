import { NotFoundError, BadRequestError } from '../errors.js';
import * as cartItemsRepository from '../repositories/CartItemsRepository.js';
import * as productsRepository from '../repositories/ProductsRepository.js';
import { CartItem } from '../models/CartItem.js';
import type { Product } from '../models/Product.js';
import type { Cart, CartPayInfo } from '../dto/cart.dto.js';

// TODO: 배송비 정책이 명세에 없어 임시로 정한 값. 실제 정책이 정해지면 교체해야 한다.
const DELIVERY_FEE = 3000;
const FREE_DELIVERY_THRESHOLD = 100000;

const findProductOrThrow = async (productId: string) => {
  const product = await productsRepository.getById(productId);

  if (!product) {
    throw new NotFoundError({ errorCode: 'ROUTE_NOT_FOUND', errorMessage: '존재하지 않는 상품입니다.' });
  }

  return product;
};

const findCartItemRecordOrThrow = async (productId: string) => {
  const record = await cartItemsRepository.getByProductId(productId);

  if (!record) {
    throw new NotFoundError({ errorCode: 'ROUTE_NOT_FOUND', errorMessage: '존재하지 않는 상품입니다.' });
  }

  return record;
};

const buildCartItems = async (): Promise<CartItem[]> => {
  const records = await cartItemsRepository.getAll();
  const products = await productsRepository.getAll();
  const productById = new Map(products.map((product) => [product.id, product]));

  return records
    .filter((record) => productById.has(record.productId))
    .map(
      (record) =>
        new CartItem(productById.get(record.productId) as Product, record.quantity, record.checkStatus),
    );
};

const calculateDeliveryFee = (orderPrice: number): number => {
  if (orderPrice === 0) return 0;
  if (orderPrice >= FREE_DELIVERY_THRESHOLD) return 0;
  return DELIVERY_FEE;
};

// quantity의 모양(존재 여부, 타입)만 검증한다. 도메인 유효성(1~99 범위)은 CartItem 생성자가 검증한다.
const validateQuantityShape = (quantity: unknown) => {
  if (quantity === undefined) {
    throw new BadRequestError({
      errorCode: 'MISSING_FIELD',
      errorMessage: '수량은 필수입니다.',
      data: [{ type: 'quantity', errorCode: 'REQUIRED' }],
    });
  }

  if (typeof quantity !== 'number') {
    throw new BadRequestError({ errorCode: 'TYPE_MISSMATCH', errorMessage: '수량은 숫자여야 합니다.' });
  }
};

export const getCart = async (): Promise<Cart> => {
  const items = await buildCartItems();
  const isAllSelected = items.length > 0 && items.every((item) => item.checkStatus);

  return { isAllSelected, cartItems: items };
};

export const getCartPayInfo = async (): Promise<CartPayInfo> => {
  const items = await buildCartItems();
  const orderPrice = items
    .filter((item) => item.checkStatus)
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = calculateDeliveryFee(orderPrice);

  return { orderPrice, deliveryFee, totalOrderAmount: orderPrice + deliveryFee };
};

export const selectCartItem = async (productId: string, checkStatus: boolean) => {
  const record = await findCartItemRecordOrThrow(productId);
  const product = await findProductOrThrow(productId);
  const cartItem = new CartItem(product, record.quantity, checkStatus);

  await cartItemsRepository.upsert({
    productId,
    quantity: cartItem.quantity,
    checkStatus: cartItem.checkStatus,
  });

  const items = await buildCartItems();
  const isAllSelected = items.length > 0 && items.every((item) => item.checkStatus);

  return { isAllSelected, cartItem };
};

export const selectAllCartItems = async (checkStatus: boolean): Promise<Cart> => {
  await cartItemsRepository.setAllCheckStatus(checkStatus);
  return await getCart();
};

export const updateCartItemQuantity = async (productId: string, quantity: unknown): Promise<CartItem> => {
  validateQuantityShape(quantity);

  const record = await findCartItemRecordOrThrow(productId);
  const product = await findProductOrThrow(productId);
  const cartItem = new CartItem(product, quantity as number, record.checkStatus);

  await cartItemsRepository.upsert({
    productId,
    quantity: cartItem.quantity,
    checkStatus: cartItem.checkStatus,
  });

  return cartItem;
};

export const deleteCartItem = async (productId: string) => {
  const deleted = await cartItemsRepository.deleteByProductId(productId);

  if (!deleted) {
    throw new NotFoundError({ errorCode: 'ROUTE_NOT_FOUND', errorMessage: '존재하지 않는 상품입니다.' });
  }

  return { deletedProductId: deleted.productId };
};
