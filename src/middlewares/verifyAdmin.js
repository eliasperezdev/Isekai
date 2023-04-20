import User from '../models/User.js';

export default async function verifyAdmin(req, res, next) {
  const { userId } = req;
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    return res.status(404).json("Usuario no valido");
  }
  //TODO obtener rol
  const role = await user.getRole();
  if ( role.name === 'Administrador' ) {
    return next()
  } else if ( role.name === 'Vendedor' ) {
    return next()
  } else {
    return res.status(403).json({ mensaje: 'No tienes permiso para acceder a esta ruta.' });
  } 
}