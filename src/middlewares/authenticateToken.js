import { verifyToken } from '../utils/jwt.handle.js';

export default function validateToken(req, res, next) {
  try {
    let token = req.headers.authorization || '';
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    const payload = verifyToken(token);
    req.userId = payload.id;
    return next();
  } catch (error) {
    return res.status(500).json("Token invalido")
  }
}