const express=require('express');
const { getProducts, deleteCart, addItems } = require('../controller/Cart');
const router = express.Router();


router.get('/product',getProducts,);
router.delete('/delete/:id',deleteCart);
router.post('/add',addItems);

module.exports=router;