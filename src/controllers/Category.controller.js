import { response } from "express";
import Category from "../models/Category.js"
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import cloudinary from "../services/cloudinary.js";
import User from "../models/User.js";
import { Op } from "sequelize";

const getCategories = async (req, res) => {
    const categories = await Category.findAll();
    if(categories.length > 0) {
        return res.status(200).json({categories})
    }
    return res.status(200).json("No hay categorias")
}

const addCategory = async (req, res) => {
    const result = await cloudinary.uploader.upload(req.file.path);
    const category = req.body
    category.urlImage= result.url
    try {
        const newCategory = await Category.create(req.body)
        console.log(newCategory);
        return res.status(200).json(newCategory)
    } catch (error) {
        return res.status(500).json(error)
    }
    
}

const editCategory = async (req, res) => {
    const {idCategory} =  req.params

    const category = await Category.update(req.body, {where:{id: idCategory}})

    if(category[0]===0) {
        return res.status(403).json("No se pudo actualizar")
    } 
    const categoryEdit = await Category.findAll({where: {id: idCategory}})

    try {
        return res.status(200).json(categoryEdit)
    } catch (error) {
        console.log(error);
    }
}

const deleteCategory = async (req, res) => {
    const {idCategory} =  req.params

    const category = await Category.findOne({where:{id: idCategory}})

    if(category === null) {
        return res.status(404).json("No hay categorias")
    }

    try {
        await Category.destroy({where:{id:idCategory}})
        res.status(200).json("Categoria eliminada")
    } catch (error) {
        console.log(error);
    }
}

const dashboard =async (req,res) => {
    const totalClient = await User.count({where: {isClient: true}})
    const totalNoClient = await User.count({where: {isClient: false}})
    const totalSales = await Order.count({where: {status: "Entregado"}})
    const totalOrders = await Order.count()
    const totalProducts = await Product.count()
    const totalProductsWithoutStock = await Product.count({where: {stock: 0}})

    const orders = await Order.findAll({limit: 5,where: {
        status: {
          [Op.ne]: "Entregado",
        },
      },include: [User], order: [["createdAt","DESC"]]});

    const response = {
        totalClient,
        totalNoClient,
        totalOrders,
        totalProducts,
        totalProductsWithoutStock,
        totalSales,
        orders
    }

    try {
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json("Hubo un error")
    }
    
}

export {
    getCategories,
    addCategory,
    editCategory,
    deleteCategory,
    dashboard
}