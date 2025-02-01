const { query } = require('express');
const { pool } = require('../services/database');

const getProducts = async (req, res) => {
    try {
        const data = await pool.query('select * from cart;');
        console.log("cart fetch success");
        return res.status(200).json({
            success: true,
            data: data.rows,
            message: "data fetch successfully"
        })
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({
            success: false,
            message: "data fetch unsuccessfully"
        })
    }
}
const deleteCart = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Item not present in database"
            })
        }
        await pool.query('DELETE FROM cart WHERE id =$1', [id]);
        return res.status(200).json({
            success: true,
            message: "cart item deleted successfully"
        })
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({
            success: false,
            message: "cart item deletion unsuccessfully"
        })
    }
}
const addItems = async (req, res) => {
    try {
        const { price, description, img, title } = req.body;
        await pool.query('INSERT INTO cart (title, price, description, img) VALUES ($1,$2,$3,$4);', [title, price, description, img]);
        return res.status(200).json({
            success: true,
            message: "cart item added successfully"
        })
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({
            success: false,
            error,
            message: "cart item add unsuccessfully"
        })
    }
}
const addToCart = async (req, res) => {
    try {
        const cart_id = req.params.id;
        const user_id = req.user.id;
        await pool.query('INSERT INTO "orders" (user_id,cart_id) VALUES ($1,$2);', [user_id, cart_id]);
        const result = await pool.query(`
            SELECT c.*, COUNT(o.cart_id) as quantity
            FROM "cart" c
            LEFT JOIN "orders" o ON c.id = o.cart_id
            WHERE o.user_id = $1
            GROUP BY c.id
        `, [user_id]);
        return res.status(200).json({
            success: true,
            message: "item added successfully",
            data: result.rows
        })
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({
            success: false,
            error,
            message: "cart item added unsuccessfull"
        })
    }
}
const removeFromCart = async (req, res) => {
    try {
        const cart_id = req.params.id;
        const user_id = req.user.id;
        await pool.query(


            `    DELETE FROM "orders"
    WHERE cart_id = $1 AND user_id = $2
    AND id = (
        SELECT id FROM "orders" WHERE cart_id = $1 AND user_id = $2 LIMIT 1
    )`
            , [cart_id, user_id]);
        const result = await pool.query(`
            SELECT c.*, COUNT(o.cart_id) as quantity
            FROM "cart" c
            LEFT JOIN "orders" o ON c.id = o.cart_id
            WHERE o.user_id = $1
            GROUP BY c.id
        `, [user_id]);
        return res.status(200).json({
            success: true,
            message: "item removed successfully",
            data: result.rows
        })
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({
            success: false,
            error,
            message: "cart item delete unsuccessfull"
        })
    }
}
const fetchproduct = async (req, res) => {
    try {
        const user_id = req.user.id;
        const result = await pool.query(`
            SELECT c.*, COUNT(o.cart_id) as quantity
            FROM "cart" c
            LEFT JOIN "orders" o ON c.id = o.cart_id
            WHERE o.user_id = $1
            GROUP BY c.id
        `, [user_id]);

        return res.status(200).json({
            success: true,
            message: "item fetch success",
            data: result.rows
        });
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({
            success: false,
            error,
            message: "cart fetch failed"
        });
    }
};

module.exports = { getProducts, deleteCart, addItems, addToCart, removeFromCart ,fetchproduct}