import User from "../models/User.js"
import bcrypt from 'bcryptjs';
import Role from "../models/Role.js";
import Order from "../models/Order.js";
import OrderDetails from "../models/orderDetails.js";

const getUser = async (req, res) => {
    try {
        const user = await User.findOne({where: {id: req.params.id}});
        console.log(user.id);
        const order = await Order.findAll({where: {UserId: user.id}, include: [OrderDetails]})
        return res.status(200).json({user,order})
    } catch (error) {
        return res.status(500).json("No existe ")
        
    }
}

const getUserDNI = async (req, res) => {
    const dni = req.params.id
    try {
        const user = await User.findOne({where: {dni: dni}})
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json("No existe ")
        
    }
}


const getUsers = async (req, res) => {
    const users = await User.findAll({where: {isClient: 1}});
    if(users.length > 0) {
        return res.status(200).json({users})
    }
    return res.status(500).json("No hay usuarios")
}

const getSeller = async (req, res) => {
    const role = await Role.findOne({where: {name: 'Vendedor'}})
    const users = await User.findAll({where: {RoleId: role.id}});
    console.log(users);
    if(users.length > 0) {
        return res.status(200).json({users})
    }
    return res.status(500).json("No hay usuarios")
}

const updateRole = async (req, res) => {
    const putUser = req.body
    const user = await User.update(putUser,{where: {id: req.params.id}});
    console.log(user);
    if(user) {
        return res.status(200).json("Se actualizo correctamente")
    }
    return res.status(500).json("Hubo un error")
}

const addUser = async (req, res) => {
    console.log(req.body);
    let user = await User.findOne({where:{email:req.body.email}})
    if(user) {
        return res.status(400).json("El usuario ya existe")
    }
    const role = await Role.findOne({where: {name: "Cliente"}});
    req.body.isClient = 1
    req.body.RoleId=role.id
    user = User.build(req.body)
    //Hasear
    user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    try {
        console.log(user);
        const newUser = await user.save()
        return res.status(200).json(newUser)
    } catch (error) {
        return res.status(400).json("Faltan las datos")
    }
}

export {
    getUsers,
    addUser,
    getSeller,
    updateRole,
    getUser,
    getUserDNI
}