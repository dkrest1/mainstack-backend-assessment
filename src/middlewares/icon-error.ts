import { Request, Response, NextFunction } from "express";
export default function iconError(req: Request, res: Response, next: NextFunction) {
  if (req.url === '/favicon.ico') return res.end();
  return next();
}
