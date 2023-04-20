import User from '../models/User.js';

export default async function verifyAdmistrador(req, res, next) {
  const { userId } = req;
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    return res.status(404).json("Usuario no valido");
  }
  //TODO obtener rol
  const role = await user.getRole();
  if (!role || role.name !== 'Administrador') {
    return res.status(403).json("Permiso incorrectos");
  }
  return next();
}