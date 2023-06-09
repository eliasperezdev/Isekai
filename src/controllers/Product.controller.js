import db from "../database/config.js";
import Category from "../models/Category.js";
import Editorial from "../models/Editorial.js";
import Product from "../models/Product.js"
import cloudinary from "../services/cloudinary.js";
import {Op} from "sequelize"

//TODO - cambiar boolean recommned
const searchProduct = async (req, res) => {
    const query = req.query.text
      const products = await Product.findAll({
        where: {
            [Op.or]: [
              { name: { [Op.like]: '%' + query + '%'} },
              { description: { [Op.like]: '%' + query + '%'} }, 
            ],
            condition: 1
          },
        include: [{model: Category, where:{condition: true}}, Editorial]
      });
      if(products.length > 0) {
        return res.status(200).json({products})
    }
    return res.status(200).json("No se encontro")
}

const getProducts = async (req, res) => {
    const query = req.params

    const filter = {
        where: {}
    }

        filter.where.condition = 1
        filter.include = [{
            model: Category,
            where: {condition: true }
        }]
  
      // Filtrar por rango de precio
      if (query.min && query.max) {
        filter.where.price = {
          [Op.between]: [query.min, query.max]
        };
      }
  
      // Ordenar por fecha de creación
      if (query.order === 'asc' || query.order === 'desc') {
        filter.order = [['createdAt', query.order.toUpperCase()]];
      }
  
      // Filtrar por categoría
      if (query.category !== "undefined") {
        filter.include = [{
          model: Category,
          where: { id: query.category, condition: true }
        }];
      }

      if (query.editorial !== "null" ) {
        filter.include = filter.include || []; // Si no hay 'include' previo, inicializar como array vacío
        filter.include.push({
          model: Editorial,
          where: { id: query.editorial }
        });
      }

      const products = await Product.findAll(filter)

      const response = {
        products
      };
    if(products.length > 0) {
        console.log(response);
        return res.status(200).json({response})
    }
    return res.status(200).json("No hay Productos")
}

const getProductsAdmin = async (req, res) => {

      const products = await Product.findAll();

    if(products.length > 0) {
        return res.status(200).json({products})
    }
    return res.status(400).json("No hay Productos")
}


//TODO - obtener un producto
const getProduct = async (req, res) => {
    const {idProduct} =  req.params

    const product = await Product.findOne({where:{id: idProduct}, 
        include: [Category, Editorial]})

    if(product === null) {
        return res.status(404).json("No existe el producto")
    }

    try {
        return res.status(200).json(product)
    } catch (error) {
        console.log(error);
    }
}

const getLatestProducts = async (req, res) => {
    const {idProduct} =  req.params

    const products = await Product.findAll({where: {condition: 1, stock:{[Op.gt]:0}}, order: [['createdAt',"DESC"]],limit: 8,include: [{model: Category, where:{condition: true}}]})

    try {
        return res.status(200).json(products)
    } catch (error) {
        console.log(error);
    }
}

const getRecommend = async (req, res) => {
    const products = await Product.findAll({where:{recommend: 1, condition: 1, stock:{[Op.gt]:0}},limit: 8, order:[db.random()],include: [{model: Category, where:{condition: true}}]});
    if(products.length > 0) {
        return res.status(200).json({products})
    }
    return res.status(200).json("No hay Productos")
}


const addProduct = async (req, res) => {

    const result = await cloudinary.uploader.upload(req.file.path);

    const product = req.body
    product.urlImage = result.url
    console.log(product);

    try {
        const newProduct = await Product.create(req.body)
        return res.status(200).json(newProduct)
    } catch (error) {
        console.log(error);
    }
    
}

const editProduct = async (req, res) => {
    const {idProduct} =  req.params
    console.log(idProduct);

    const product = await Product.update(req.body, {where:{id: idProduct}})
    console.log(product);

    if(product[0]===0) {
        return res.status(403).json("No se pudo actualizar")
    } 
    const editProducts = await Product.findAll({where: {id: idProduct}})
    console.log(editProducts);
    return

    try {
        return res.status(200).json(editProducts)
    } catch (error) {
        console.log(error);
    }
}

const deleteProduct = async (req, res) => {
    const {idProduct} =  req.params

    const product = await Product.findOne({where:{id: idProduct}})

    if(product === null) {
        return res.status(404).json("No hay productes")
    }

    try {
        await Product.destroy({where:{id:idProduct}})
        res.status(200).json("product eliminada")
    } catch (error) {
        console.log(error);
    }
}

export {
    getProducts,
    getProduct,
    addProduct,
    editProduct,
    deleteProduct,
    getRecommend,
    searchProduct,
    getLatestProducts,
    getProductsAdmin
}