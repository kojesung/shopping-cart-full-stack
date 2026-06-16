import { Request, Response, NextFunction } from 'express';
import * as cartItemsService from '../services/CartItemsService.js';
import { success } from '../response.js';

export const getCart = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartItemsService.getCart();
    success(res, cart, 200);
  } catch (error) {
    next(error);
  }
};

export const getCartPayInfo = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const payInfo = await cartItemsService.getCartPayInfo();
    success(res, payInfo, 200);
  } catch (error) {
    next(error);
  }
};

export const patchCartItemSelection = async (
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const result = await cartItemsService.selectCartItem(productId, req.body.checkStatus);
    success(res, result, 200);
  } catch (error) {
    next(error);
  }
};

export const patchAllCartItemsSelection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartItemsService.selectAllCartItems(req.body.checkStatus);
    success(res, cart, 200);
  } catch (error) {
    next(error);
  }
};

export const patchCartItemQuantity = async (
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const cartItem = await cartItemsService.updateCartItemQuantity(productId, req.body.quantity);
    success(res, cartItem, 200);
  } catch (error) {
    next(error);
  }
};

export const deleteCartItem = async (
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const result = await cartItemsService.deleteCartItem(productId);
    success(res, result, 200);
  } catch (error) {
    next(error);
  }
};
