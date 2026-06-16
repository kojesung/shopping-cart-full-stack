import type { Product } from '../dto/product.dto.js';

export const products = new Map<string, Product>();

const dummyProducts: Product[] = [
  {
    productId: '1',
    name: '망고',
    price: 5000,
    image: 'https://example.com/images/mango.png',
    stock: 20,
  },
  {
    productId: '2',
    name: '바나나',
    price: 3000,
    image: 'https://example.com/images/banana.png',
    stock: 50,
  },
  {
    productId: '3',
    name: '딸기',
    price: 8000,
    image: 'https://example.com/images/strawberry.png',
    stock: 15,
  },
];

dummyProducts.forEach((product) => products.set(product.productId, product));

const generateUniqueId = (): string => {
  const id = crypto.randomUUID();
  return products.has(id) ? generateUniqueId() : id;
};

export const getAll = async () => {
  return Array.from(products.values());
};

export const insert = async (product: Omit<Product, 'productId'>) => {
  const productObj = {
    productId: generateUniqueId(),
    ...product,
  };

  products.set(productObj.productId, productObj);
  return productObj;
};

export const getById = async (productId: Product['productId']) => {
  return products.get(productId);
};

export const deleteById = async (productId: Product['productId']) => {
  const product = products.get(productId);

  if (!product) return null;

  products.delete(productId);
  return product;
};
