const jwt = require("jsonwebtoken");
const { pool } = require("../services/database");

const auth = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token not found",
        });
    }

    try {
        const user = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();  
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Error parsing token",
        });
    }
};
const isValid = async (req, res, next) => {
    const { email, role } = req.user;
    try {
        const userExist = await pool.query(
            'SELECT * FROM "user" WHERE email=$1 AND role=$2',
            [email, role]
        );
        const {id}=userExist.rows[0];
        req.user.id=id;
        if (userExist.rows.length < 1) {
            return res.status(400).json({
                success: false,
                message: "User does not exist in database",
            });
        }
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Database query error",
        });
    }
};
const isAdmin = async (req,res,next) => {
    console.log(req.user.email);
    
    if (req.user.role.toLowerCase() != 'admin') { 
        return res.status(402).json({
            success:false,
            message:"You are not authorized"
        })
    }
    next();
}
module.exports = { auth, isValid ,isAdmin};
