import { NotFoundError, BadRequestError } from '../errors.js';
import * as productsRepository from '../repositories/ProductsRepository.js';
import type { Product } from '../dto/product.dto.js';
import type { FieldError } from '../response.js';

type NewProduct = Omit<Product, 'id'>;

const REQUIRED_FIELDS: Array<keyof NewProduct> = ['name', 'price', 'imgUrl', 'stock'];

const findMissingFields = (product: Partial<NewProduct>): FieldError[] => {
  return REQUIRED_FIELDS.filter((field) => product[field] === undefined).map((field) => ({
    type: field,
    errorCode: 'REQUIRED',
  }));
};

const findTypeMismatchMessage = (product: NewProduct): string | null => {
  if (typeof product.name !== 'string') return '상품명은 문자열이어야 합니다.';
  if (typeof product.price !== 'number') return '가격은 숫자여야 합니다.';
  if (typeof product.imgUrl !== 'string') return '상품 이미지는 문자열이어야 합니다.';
  if (typeof product.stock !== 'number') return '재고는 숫자여야 합니다.';
  return null;
};

const findInvalidFields = (product: NewProduct): FieldError[] => {
  const errors: FieldError[] = [];

  if (product.name.length < 1 || product.name.length > 100) {
    errors.push({ type: 'name', errorCode: 'INVALID_LENGTH' });
  }

  if (product.price <= 0 || !Number.isInteger(product.price)) {
    errors.push({ type: 'price', errorCode: 'INVALID_RANGE' });
  }

  if (product.stock < 0 || product.stock > 99 || !Number.isInteger(product.stock)) {
    errors.push({ type: 'stock', errorCode: 'INVALID_RANGE' });
  }

  return errors;
};

const validateNewProduct = (product: Partial<NewProduct>) => {
  const missingFields = findMissingFields(product);

  if (missingFields.length > 0) {
    throw new BadRequestError({
      errorCode: 'MISSING_FIELD',
      errorMessage: '필수 필드가 누락되었습니다.',
      data: missingFields,
    });
  }

  const typeMismatchMessage = findTypeMismatchMessage(product as NewProduct);

  if (typeMismatchMessage) {
    throw new BadRequestError({ errorCode: 'TYPE_MISSMATCH', errorMessage: typeMismatchMessage });
  }

  const invalidFields = findInvalidFields(product as NewProduct);

  if (invalidFields.length > 0) {
    throw new BadRequestError({
      errorCode: 'INVALID',
      errorMessage: '필드 값이 유효하지 않습니다.',
      data: invalidFields,
    });
  }
};

export const getProducts = async () => {
  return await productsRepository.getAll();
};

export const insertProduct = async (product: Partial<NewProduct>) => {
  validateNewProduct(product);
  return await productsRepository.insert(product as NewProduct);
};

export const deleteProduct = async (productId: Product['id']) => {
  const deleted = await productsRepository.deleteById(productId);

  if (!deleted) {
    throw new NotFoundError({
      errorCode: 'ROUTE_NOT_FOUND',
      errorMessage: '존재하지 않는 상품입니다.',
    });
  }

  return deleted;
};
