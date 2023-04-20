import mercadopago from "mercadopago";
import dotenv from 'dotenv'
dotenv.config()

mercadopago.configure({ access_token: process.env.ACCESS_SECRET_MP})

const paymentMP = (req,res,next) => {
    const products = req.body
    console.log(products);
    let preference = {
        items: products.map(prod => ({
            id: prod.id,
            title: prod.name,
            currency_id: "ARS",
            picture_url: prod.urlImage,
            description: prod.description,
            category_id: "art",
            quantity: prod.quantify,
            unit_price: prod.price,
        })),
        back_urls: {
            success: `${process.env.FRONTEND_URL}success`,
            failure: "",
            pending: "",
        },
        auto_return: "approved",
        binary_mode: true,
    }
    console.log(preference);
    mercadopago.preferences.create(preference).then(response => res.status(200).send({response})).catch(error=> res.status(400).send({error:error.message}))
}

export {
    paymentMP
}