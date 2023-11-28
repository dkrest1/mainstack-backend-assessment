import { logger } from '@/config'
import jwt from 'jsonwebtoken'

export default function verifyToken(token: string, secret: string) {
  try {
    return jwt.verify(token, secret)
  } catch (error) {
    return logger.error(error)
  }
}
