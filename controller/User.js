const bcrypt = require('bcryptjs');
const { pool } = require('../services/database');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const register = async (req, res) => {
    try {
        const { name, email, pass } = req.body;

        const userExist = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({
                status: false,
                message: "User already exists"
            });
        }

        const password = await bcrypt.hash(pass, 10);

        const result = await pool.query('INSERT INTO "user" (name, email, pass) VALUES ($1, $2, $3) RETURNING *', [name, email, password]);
        return res.status(201).json({
            status: true,
            user: result.rows[0],
            message: "User created successfully"
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            status: false,
            message: "User creation unsuccessful: " + error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, pass } = req.body;
        const userExist = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);

        if (userExist.rows.length == 0) {
            return res.status(400).json({
                userExist,
                status: false,
                message: "User does not exists"
            });
        }
        const user = userExist.rows[0];

        if (await bcrypt.compare(pass, user.pass)) {
            const token = jwt.sign({ email, role: user.role }, process.env.JWT_SECRET);

            return res.status(200).cookie('token', token, {
                expires: new Date(Date.now()+60*60*1000),
                sameSite: 'None',
                httpOnly: true,
                secure:true
            }
            ).json({
                status: true,
                message: "Welcome to ecom site",
                role:user.role
            })
        } else {
            return res.status(400).json({
                status: false,
                message: "Please enter correct password"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error,
            status: false,
            message: "User login failed"
        });
    }
}

module.exports = { register, login };
