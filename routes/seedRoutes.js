import express from 'express';
import data from '../data.js'
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

const seedRouter = express.Router();
// creamos el producto
seedRouter.get('/', async (req, res) => {
    // thsi is for products
    await Product.remove({});
    const createdProducts = await Product.insertMany(data.products);
    // this is for USERS
    await User.remove({});
    const createdUsers = await User.insertMany(data.users);
    // for users and products
    res.send({ createdProducts, createdUsers });
});
export default seedRouter;