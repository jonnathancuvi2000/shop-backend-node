import express from "express";
// import data from "./data.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
// const cors = require('cors')
import cors from 'cors'


dotenv.config(); // whit this we call teh file .env an get de data from it

mongoose.connect(process.env.MONGODB_URI).then(()=>{
  console.log('Conectado a la DB')
}).catch(err =>{
  console.log(err.message)
}); // "process" has te information from de file .env which we just called up 

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

app.use('/api/seed',seedRouter);

app.use('/api/products',productRouter); // mongodb

app.use('/api/users',userRouter); 

app.use('/api/orders',orderRouter); 

app.use("/", (req,res) => {
  res.send('Bienvenido al server para Shop Store')
});



app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});
