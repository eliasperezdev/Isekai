import Address from "../models/Address.js"

const getAddresses = async (req, res) => {

    //TODO - Traer params y filtrar por userId

    const addresses = await Address.findAll({where: {UserId: req.userId}});
    if(addresses.length > 0) {
        return res.status(200).json({addresses})
    }
    return res.status(500).json("No hay Address")
}

const getAddress = async (req, res) => {

    //TODO - Traer params y filtrar por userId

    const address = await Address.findOne({where: {id: req.params.idAddress}});
    if(address) {
        return res.status(200).json({address})
    }
    return res.status(500).json("No hay Address")
}

const addAddress = async (req, res) => {

    //TODO agregar los ids de user
    const addres = {
        name: req.body.name,
        location: req.body.location,
        province: req.body.province,
        postalCode: req.body.postalCode,
        street: req.body.street,
        altitude: req.body.altitude,
        department: req.body.department,
        UserId: req.userId
    }

    try {
        const newAddress = await Address.create(addres)
        return res.status(200).json(newAddress)
    } catch (error) {
        console.log(error);
    }
    
}

const deleteAddress = async (req, res) => {
    console.log(idAddress);
    const {idAddress} =  req.params

    const address = await Address.findOne({where:{id: idAddress}})

    if(address === null) {
        return res.status(404).json("No hay dirección")
    }

    try {
        await Address.destroy({where:{id:idAddress}})
        res.status(200).json("Dirección eliminada")
    } catch (error) {
        console.log(error);
    }
}

export {
    getAddresses,
    addAddress,
    deleteAddress,
    getAddress
}