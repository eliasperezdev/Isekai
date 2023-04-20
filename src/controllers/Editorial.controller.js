import Editorial from "../models/Editorial.js"


const getEditorials = async (req, res) => {
    const editorials = await Editorial.findAll();
    if(editorials.length > 0) {
        return res.status(200).json({editorials})
    }
    return res.status(200).json("No hay editoriales")
}

const addEditorial = async (req, res) => {
    const editorial = req.body
    console.log(editorial);

    try {
        const newEditorial = await Editorial.create(req.body)
        return res.status(200).json(newEditorial)
    } catch (error) {
        console.log(error);
    }
    
}

const editEditorial = async (req, res) => {
    const {idEditorial} =  req.params

    const editorial = await Editorial.update(req.body, {where:{id: idEditorial}})

    if(editorial[0]===0) {
        return res.status(403).json("No se pudo actualizar")
    } 
    const editorialEdit = await Editorial.findAll({where: {id: idEditorial}})

    try {
        return res.status(200).json(editorialEdit)
    } catch (error) {
        console.log(error);
    }
}

const deleteEditorial = async (req, res) => {
    const {idEditorial} =  req.params
    console.log(req);

    const editorial = await Editorial.findOne({where:{id: idEditorial}})

    if(editorial === null) {
        return res.status(404).json("No hay editoriales")
    }

    try {
        await Editorial.destroy({where:{id:idEditorial}})
        res.status(200).json("Editorial eliminada")
    } catch (error) {
        console.log(error);
    }
}

export {
    getEditorials,
    addEditorial,
    editEditorial,
    deleteEditorial
}