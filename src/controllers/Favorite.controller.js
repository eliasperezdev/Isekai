import Favorite from "../models/Favorite.js"
import Product from "../models/Product.js";

const getFavorities = async (req, res) => {

    //TODO - Traer params y filtrar por userId

    const favorities = await Favorite.findAll({where: {UserId: req.userId}, include: [Product]});
    if(favorities.length > 0) {
        return res.status(200).json({favorities})
    }
    return res.status(200).json("No hay favoritos")
}

const addFavorite = async (req, res) => {

    //Verificar si ya hay
    const favoriteExist = await Favorite.findOne({where:{ProductId: req.body.ProductId}})

    if(favoriteExist) {
        return res.status(400).json("Ya se habia guardado en favoritos")
    }

    //TODO agregar los ids de user y product
    const favorite = {
        date: new Date(),
        ProductId: req.body.ProductId,
        UserId: req.userId
    }

    try {
        const newFavorite = await Favorite.create(favorite)
        return res.status(200).json(newFavorite)
    } catch (error) {
        console.log(error);
    }
    
}

const deleteFavorite = async (req, res) => {
    const {idFavorite} =  req.params

    const favorite = await Favorite.findOne({where:{id: idFavorite}})

    if(favorite === null) {
        return res.status(404).json("No hay favoritos")
    }

    try {
        await Favorite.destroy({where:{id:idFavorite}})
        res.status(200).json("Favorito eliminada")
    } catch (error) {
        console.log(error);
    }
}

export {
    getFavorities,
    addFavorite,
    deleteFavorite
}