const express=require('express');
const { getProducts, deleteCart, addItems, addToCart, removeFromCart, fetchproduct } = require('../controller/Cart');
const { register, login, logout } = require('../controller/User');
const { auth, isValid, isAdmin } = require('../middleware/Auth');
const router = express.Router();


router.get('/product',getProducts,);
router.delete('/delete/:id',auth,isValid,isAdmin,deleteCart);
router.post('/add',auth,isValid,isAdmin,addItems);
router.post('/register',register);
router.post('/login',login);
router.post('/cart/:id',auth,isValid,addToCart);
router.delete('/cart/:id',auth,isValid,removeFromCart);
router.post('/logout',auth,isValid,logout);
router.get('/cart',auth,isValid,fetchproduct);
router.get('/auth',auth,isValid,(req,res)=>{
    return res.status(200).json({
        success:true,
        data:req.user,
        message:"you are a verified user"
    })
});

module.exports=router;