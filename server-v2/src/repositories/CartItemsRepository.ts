export interface CartItemRecord {
  productId: string;
  quantity: number;
  checkStatus: boolean;
}

export const cartItemRecords = new Map<string, CartItemRecord>();

// 더미 데이터: ProductsRepository의 더미 상품(id '1', '2')을 참조한다.
const dummyCartItemRecords: CartItemRecord[] = [
  { productId: '1', quantity: 2, checkStatus: true },
  { productId: '2', quantity: 1, checkStatus: false },
];

dummyCartItemRecords.forEach((record) => cartItemRecords.set(record.productId, record));

export const getAll = async () => {
  return Array.from(cartItemRecords.values());
};

export const getByProductId = async (productId: string) => {
  return cartItemRecords.get(productId);
};

export const upsert = async (record: CartItemRecord) => {
  cartItemRecords.set(record.productId, record);
  return record;
};

export const setAllCheckStatus = async (checkStatus: boolean) => {
  const updated = Array.from(cartItemRecords.values()).map((record) => ({ ...record, checkStatus }));
  updated.forEach((record) => cartItemRecords.set(record.productId, record));
  return updated;
};

export const deleteByProductId = async (productId: string) => {
  const record = cartItemRecords.get(productId);

  if (!record) return null;

  cartItemRecords.delete(productId);
  return record;
};
