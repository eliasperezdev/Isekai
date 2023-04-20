import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../utils/jwt.handle.js";

const login = async (req, res, next) => {
  console.log(req.body);
    try {
        const user = await User.findOne({
            where: { email: req.body.email },
            attributes: ['id', 'name', 'password', 'RoleId'],
        });
        
        console.log(user);
      if (user) {
        const match = bcrypt.compareSync(req.body.password, user.password);
        if (match) {
          const token = generateToken(user.id, user.roleId);
          return res.status(200).json({ message: { token }, status: 200 });
        }
      }
      return res.status(401).json("Credenciales incorrectos");
    } catch (error) {
      console.log(error);
      return res.status(400).json("Login incorrecto");
    }
  };

  const authMe = async (req, res, next) => {
    try {
      const me = await User.findByPk(req.userId);
      return res.status(200).json(me);
    } catch (error) {
      return res.status(500).json("No autenticado");
    }
  };

  export {
    login,
    authMe
  }