import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { generateToken, isAuth } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';

const userRouter = express.Router();

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email }); // we get the user by the email
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {// if the USER exist we chake the passworld with the library 'bcrypt'
        res.send({ // if teh passworld is correct, we send the information, that is, we show the user information 
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Correo o Contraseña Incorrectos' }); // if th user does no exist or the paswwoord is wrong 
  })
);
// we created a nw user, that is, we saved in the data base
userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
      isAdmin: req.body.isAdmin,
    });
    const user = await newUser.save(); // we save the new USER in data base 
    res.send({ // after having saved the user we show the new user saved it, that is, we send the new user information the the frontend 
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);


userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);


export default userRouter;