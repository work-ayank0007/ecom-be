const { log } = require('console');
const express=require('express');
const app =express();
app.use(express.json());
const PORT =3000;


const router = require('./routes/cart');

app.use('/api/v1',router);
const {dbconnect} = require('./services/database.js');
dbconnect();
app.listen(PORT,()=>{
    console.log(`app is running on PORT: ${PORT}`);
})