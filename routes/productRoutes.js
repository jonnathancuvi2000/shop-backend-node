import express from 'express';
import Product from '../models/productModel.js';
import expressAsyncHandler from 'express-async-handler';

const productRouter = express.Router();
// obtenemos el producto
productRouter.get('/', async (req, res) => {
    const products = await Product.find();
    res.send(products);
});
// add a new product
productRouter.post("/", async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

productRouter.get(
    '/categories',
    expressAsyncHandler(async (req, res) => {
        const categories = await Product.find().distinct('category');
        res.send(categories);
    })
);

productRouter.get("/slug/:slug", async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: "Producto no Encontrado" });
    }
});

productRouter.get("/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: "Producto no Encontrado" });
    }
});
export default productRouter;