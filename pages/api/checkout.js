import Stripe from 'stripe'
import uuidv4 from 'uuid/v4'
import jwt from 'jsonwebtoken'
import Cart from '../../models/Cart'
import Product from '../../models/Product'
import Order from '../../models/Order'
import calculateCartTotal from '../../utils/calculateCartTotal'

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
    const { paymentData } = req.body

    try {
        const { userID } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        const cart = await Cart.findOne({ user: userID }).populate({
            path: "products.product",
            model: "Product"
        })
        
        const { cartTotal, stripeTotal } = calculateCartTotal(cart.products);

        //STRIPE INTEGRATION
        // const prevCustomer = await stripe.customers.list({
        //     email: paymentData.email,
        //     limit: 1
        // })

        // const isExistingCustomer = prevCustomer.data.length > 0;

        // let newCustomer;
        // if (!isExistingCustomer) {
        //     newCustomer = await stripe.customers.create({
        //         email: paymentData.email,
        //         source: paymentData.id
        //     })
        // }

        //previous customer's ID or new customer's ID
        // const customer = (isExistingCustomer && prevCustomer.data[0].id) || newCustomer.id
        
        // console.log("Creating Stripe User");
        // const charge = await stripe.charges.create({
        //     currency: "USD",
        //     amount: stripeTotal,
        //     receipt_email: paymentData.email,
        //     customer,
        //     description: `Checkout | ${paymentData.email} | ${paymentData.id}`
        // }, {
        //     idempotency_key: uuidv4()
        // })

        console.log("Creating New Order");
        await new Order({
            user: userID,
            email: paymentData.email,
            total: cartTotal,
            products: cart.products
        }).save()

        console.log("Updating Cart");
        await Cart.findOneAndUpdate(
            { _id: cart._id },
            { $set: { products: [] } }
        )

        res.status(200).send("Checkout successful!")
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error processing charge.", error)
    }

}