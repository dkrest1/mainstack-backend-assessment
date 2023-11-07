import { logger } from '@/config';
import jwt from 'jsonwebtoken';

export default function generateToken(payload: any, token_secret: string, expires: string) {
  try {
    return jwt.sign(payload, token_secret, { expiresIn: expires });
  }
  catch (error) {
    return logger.error(error);
  }
}
