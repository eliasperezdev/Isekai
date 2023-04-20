import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

import 'dotenv/config'

const JWT_SECRET = process.env.JWT_SECRET

const generateToken = (id, role)=> sign({ id, role }, JWT_SECRET, {
  expiresIn: '24h',
});

const verifyToken = jwt => {
  const isOk = verify(jwt, JWT_SECRET);
  return isOk;
};

export { generateToken, verifyToken };