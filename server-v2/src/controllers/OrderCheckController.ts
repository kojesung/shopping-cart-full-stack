import { Request, Response, NextFunction } from 'express';
import * as orderCheckService from '../services/OrderCheckService.js';
import { success } from '../response.js';

export const postOrderCheck = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderCheckService.createOrderCheck();
    success(res, result, 201);
  } catch (error) {
    next(error);
  }
};

export const getOrderCheck = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderCheckService.getOrderCheckProducts();
    success(res, result, 200);
  } catch (error) {
    next(error);
  }
};

export const getOrderCheckPayInfo = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const payInfo = await orderCheckService.getOrderCheckPayInfo();
    success(res, payInfo, 200);
  } catch (error) {
    next(error);
  }
};

export const patchRemoteAreaSelection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderCheckService.selectRemoteArea(req.body.checkStatus);
    success(res, result, 200);
  } catch (error) {
    next(error);
  }
};
