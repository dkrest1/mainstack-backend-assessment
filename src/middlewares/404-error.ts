import { Request, Response, NextFunction } from "express";

export default function Handle404Error(req: Request, res: Response, next: NextFunction) {
  return res.status(404).send('page not found');
}
