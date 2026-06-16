import type { Product } from '../dto/product.dto.js';

export const products = new Map<string, Product>();

const dummyProducts: Product[] = [
  {
    id: '1',
    name: '망고',
    price: 5000,
    imgUrl: 'https://example.com/images/mango.png',
    stock: 20,
  },
  {
    id: '2',
    name: '바나나',
    price: 3000,
    imgUrl: 'https://example.com/images/banana.png',
    stock: 50,
  },
  {
    id: '3',
    name: '딸기',
    price: 8000,
    imgUrl: 'https://example.com/images/strawberry.png',
    stock: 15,
  },
];

dummyProducts.forEach((product) => products.set(product.id, product));

const generateUniqueId = (): string => {
  const id = crypto.randomUUID();
  return products.has(id) ? generateUniqueId() : id;
};

export const getAll = async () => {
  return Array.from(products.values());
};

export const insert = async (product: Omit<Product, 'id'>) => {
  const productObj = {
    id: generateUniqueId(),
    ...product,
  };

  products.set(productObj.id, productObj);
  return productObj;
};

export const getById = async (productId: Product['id']) => {
  return products.get(productId);
};

export const deleteById = async (productId: Product['id']) => {
  const product = products.get(productId);

  if (!product) return null;

  products.delete(productId);
  return product;
};
