const express=require('express');
const { getProducts, deleteCart, addItems, addToCart, removeFromCart } = require('../controller/Cart');
const { register, login } = require('../controller/User');
const { auth, isValid, isAdmin } = require('../middleware/Auth');
const router = express.Router();


router.get('/product',getProducts,);
router.delete('/delete/:id',auth,isValid,isAdmin,deleteCart);
router.post('/add',auth,isValid,isAdmin,addItems);
router.post('/register',register);
router.post('/login',login);
router.post('/cart/:id',auth,isValid,addToCart);
router.delete('/cart/:id',auth,isValid,removeFromCart);
router.get('/auth',auth,isValid);

module.exports=router;