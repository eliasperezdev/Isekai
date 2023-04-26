import mercadopago from "mercadopago";
import Order from "../models/Order.js"
import OrderDetails from "../models/orderDetails.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import dotenv from 'dotenv'
import Address from "../models/Address.js";
import { Op } from "sequelize";
import Ticket from "../models/Ticket.js";
import generateTicket from "../services/generateTicket.js";
dotenv.config()


// TODO - paginacion y filtros, ademas de traer solos los datos de la tabla
const getOrdens = async (req, res) => {
    const orders = await Order.findAll({where: {
        status: {
            [Op.notIn]: ['No pagado', 'Entregado'],
        },
      },include: [User], order: [['createdAt', 'DESC']]});
    if(orders.length > 0) {
        return res.status(200).json({orders})
    }
    return res.status(200).json("No hay ordenes")
}

const getOrdensFinished = async (req, res) => {
    const orders = await Order.findAll({where: {status: "Entregado"},include: [User]});
    if(orders.length > 0) {
        return res.status(200).json({orders})
    }
    return res.status(200).json("No hay ordenes")
}

const updateStatus = async (req, res) => {
    console.log(req.body.status);
    const order = await Order.findOne({where: {id: req.params.id}});
    order.status = req.body.status
    try {
        await order.save()
        return res.status(200).json(order)
    } catch (error) {
        return res.status(500).json("Error del servidor")
    }
}

const getOrdensClient = async (req, res) => {
    const orders = await Order.findAll({where: {id:req.params.id}});
    if(orders.length > 0) {
        return res.status(200).json({orders})
    }
    return res.status(200).json("No hay ordenes")
}

const getOrdensUser = async (req, res) => {
    console.log(req.userId);
    const orders = await Order.findAll({where: {UserId: req.userId}});
    console.log(orders);
    if(orders.length > 0) {
        return res.status(200).json({orders})
    }
    return res.status(500).json("No hay ordenes")
}

// TODO - traer una orden
const getOrden = async (req, res) => {
    const idOrder = req.params.idOrder
    console.log(req.params);
    try {
        const order = await Order.findOne({where: {id: idOrder}, include: [{model: OrderDetails, include: [Product]}, User, Address ]})
        const newOrder = {
            id:order.id,
            dateTime:order.dateTime,
            totalSale: order.totalSale,
            tax: order.tax,
            status: order.status,
            createdAt: order.createdAt,
            User:order.User,
            products: order.OrderDetails.map(prod => prod),
            Address: order.Address,
            preferenceId: order.preferenceId
        }
        return res.status(200).json(newOrder)
    } catch (error) {
        console.log(error);
    }
}

mercadopago.configure({ access_token: process.env.ACCESS_SECRET_MP})

const addOrder = async (req, res) => {
    //Recibo los productos y la direccion
    const data = req.body;
    const {userData,formData, shoppingCart, additionalData} = data
    console.log(data);

    //Inicializamos una instancia a guardar orden
    const newOrden = Order.build({
        dateTime: new Date(),
        status: "No pagado",
        additionalData: additionalData
    })
    //Verificamos si tiene id address, si lo tiene lo guardamos directamente / si no lo tiene creamos una direccion nueva y asignamos el nuevo id
    if(formData.idAddress) {
        newOrden.AddressId = formData.idAddress
    } else {
        const newAddress = await Address.create({
            name: formData.name,
            location: formData.location,
            province: formData.province,
            street: formData.street,
            postalCode: formData.postalCode,
            altitude: formData.altitude,
            department: formData.department,
        })
        newOrden.AddressId = newAddress.id
    }

    //Si tenemos id usuario lo guardamos
    if(userData.UserId) {
        newOrden.UserId = userData.UserId
    } else {
        const newUser = await User.create({
            name: userData.nameClient,
            lastName: userData.lastName,
            email: userData.email,
            dni: userData.dni,
            isClient: 0
        })
        newOrden.UserId = newUser.id
    }
    const idsProductos = shoppingCart.map(prod=> prod.id)
    //Verificamos el stock de la compra
    const productsStock = await Product.findAll({
        where: {
          id: {
            [Op.in]: idsProductos
          }
        }
      });

      let discount = 0

      for (const product of shoppingCart) {
        const dbProduct = await Product.findByPk(product.id);
        discount += (product.descuento*product.quantify)
        console.log(discount);
        if (dbProduct.stock < product.quantify) {
          return res.status(500).json(`El producto "${dbProduct.name}" no tiene suficiente stock.`);
        }
      }

    //creamos la instancia de mercadopago
    //MercadoPago
    let preference = {
        items: shoppingCart.map(prod => ({
            id: prod.id,
            title: prod.name,
            currency_id: "ARS",
            picture_url: prod.urlImage,
            description: prod.description,
            category_id: "art",
            quantity: prod.quantify,
            unit_price: (prod.price-prod.descuento),
        })),
        back_urls: {
            success: `${process.env.FRONTEND_URL}/success/`,
            failure: "",
            pending: "",
        },
        auto_return: "approved",
        binary_mode: true,
    }

    const resMP = await mercadopago.preferences.create(preference)

    //Guardamos el preferenceId generado por mercadopago

    //Generamos el total a pagar
    const total = shoppingCart.reduce(
        (accumulator, product) => accumulator + (product.price*product.quantify),
        0
      );
    newOrden.totalSale =total
    newOrden.tax = discount
    newOrden.preferenceId = resMP.body.id
    //Finalizamos
    try {
        const order = await newOrden.save()
        shoppingCart.forEach(async product => {
            await OrderDetails.create(
                {
                    quantity: product.quantify,
                    price: product.price,
                    discount: product.descuento,
                    OrderId: order.id,
                    ProductId: product.id,
                    discount: product.descuento
                }
            )
        })
        console.log(order);
        return res.status(200).json({link: resMP.body.init_point})
    } catch (error) {
        console.log(error);
    }
    
}

const getFeedback = async (req, res) => {
    if(Object.entries(req.body).length === 0) {
        return res.status(400).json("Espere..")
    }

    const preferenceMP = req.body.preference_id
    const status = req.body.status
    //Buscar la orden segun el preferenceId
    const order = await Order.findOne({where: {preferenceId: preferenceMP}, include:[OrderDetails, User]})

    if(order.status === "Aprobado") {
        return res.status(200).json(order)
    }

    //Cambiar el stock
    if (status === "approved") {

        try {
            const orderDetails = await order.getOrderDetails()

            order.status = "Aprobado"

            await order.save()

            orderDetails.forEach(async (i) => {
                const idP = i.ProductId
                const product = await Product.findOne({where: {id: idP} });
                product.stock = product.stock - i.quantity
                await product.save()
            })
        } catch (error) {
            return res.status(400).json("No hay stock suficiente")
        }

    } else {
        res.status(400).json({
            ok: false,
            msg: status,
        });
    }
    const numberTicket =await generateTicket()

    //Generar la factura / cargar la fecha, total userid, numero de orden
    const ticket =await Ticket.create({
        dateTime: new Date(),
        tax: order.tax,
        totalSale: order.totalSale,
        status: "Generado",
        numberTicket: numberTicket
    })

    //Generar el numero de comprobante

    return res.status(200).json(order)
};

export {
    getOrdens,
    getOrden,
    getOrdensUser,
    addOrder,
    getFeedback,
    getOrdensClient,
    updateStatus,
    getOrdensFinished
}