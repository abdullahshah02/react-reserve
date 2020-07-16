import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import Cart from '../../models/Cart'
import Product from '../../models/Product'
import connectDB from '../../utils/connectDb'

connectDB();

const { ObjectId } = mongoose.Types

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await handleGetRequest(req, res);
            break;
        case "PUT":
            await handlePutRequest(req, res);
            break;
        case "DELETE":
            await handleDeleteRequest(req, res);
            break;
        default:
            res.status(405).send(`Method ${req.method} NOT ALLOWED`)
            break;
    }
}

async function handleGetRequest(req, res) {
    if (!req.headers.authorization) {
        return res.status(401).send("No authorization token");
    }
    try {
        const { userID } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
        const cart = await Cart.findOne({ user: userID }).populate({
            path: "products.product",
            model: "Product"
        })
        res.status(200).json(cart.products)
    }
    catch (error) {
        console.error(error);
        res.status(403).send("Please login again")
    }
}

async function handlePutRequest(req, res) {
    const { quantity, productID } = req.body;
    if (!req.headers.authorization) {
        return res.status(401).send("No authorization token");
    }
    try {
        const { userID } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        const cart = await Cart.findOne({ user: userID });
        const productExists = cart.products.some(doc => ObjectId(productID).equals(doc.product));
        if (productExists) {
            await Cart.findOneAndUpdate(
                { _id: cart._id, "products.product": productID },
                { $inc: { "products.$.quantity": quantity } }
            )
        }
        else {
            const newProduct = { quantity, product: productID }
            await Cart.findOneAndUpdate(
                { _id: cart._id },
                { $addToSet: { products: newProduct } }
            )
        }
        res.status(200).send("Cart Updated");
    }
    catch (error) {
        console.error(error);
        res.status(403).send("Please login again")
    }
}

async function handleDeleteRequest(req, res) {

    const { productID } = req.query
    if (!req.headers.authorization) {
        return res.status(401).send("No authorization token");
    }
    try {
        const { userID } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        const cart = await Cart.findOneAndUpdate(
            { user: userID },
            { $pull: { products: { product: productID } } },
            { new: true }
        ).populate({
            path: "products.product",
            model: "Product"
        })
        res.status(200).json(cart.products);
    }
    catch (error) {
        console.error(error);
        res.status(403).send("Please login again")
    }
}