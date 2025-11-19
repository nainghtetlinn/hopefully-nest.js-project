import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(
    `[logger] ======> ${req.method} ${req.url} ${req.body ? JSON.stringify(req.body) : ''}`,
  );
  next();
}
