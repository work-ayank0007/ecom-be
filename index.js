const express=require('express');
const app =express();
const cookieParser=require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
const PORT =3000;


const router = require('./routes/cart');

app.use(router);
const {dbconnect} = require('./services/database.js');
dbconnect();
app.listen(PORT,()=>{
    console.log(`app is running on PORT: ${PORT}`);
})