const {pool} = require('../services/database');

const getProducts = async (req,res) => {
    try {
        const data = await pool.query('select * from cart;');
        console.log("cart fetch success");
        return res.status(200).json({
            status:true,
            data:data.rows,
            message:"data fetch successfully"
        })
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({
            status:false,
            message:"data fetch unsuccessfully"
        })
    }
}
const deleteCart= async (req,res) => {
    try {
        const id=req.params.id;
        if (!id) {
            return res.status(400).json({
                status:false,
                message:"Item not present in database"
            })
        }
        await pool.query('DELETE FROM cart WHERE id =$1',[id]);
        return res.status(200).json({
            status:true,
            message:"cart item deleted successfully"
        })
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({
            status:false,
            message:"cart item deletion unsuccessfully"
        })
    }
}
const addItems=async (req,res) => {
    try {
        const {price,description,img,title}=req.body;
        await pool.query('INSERT INTO cart (title, price, description, img) VALUES ($1,$2,$3,$4);',[title,price,description,img]);
        return res.status(200).json({
            status:true,
            message:"cart item added successfully"
        })
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({
            status:false,
            error,
            message:"cart item add unsuccessfully"
        })
    }
}
module.exports={getProducts,deleteCart,addItems}