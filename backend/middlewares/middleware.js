const jwt = require("jsonwebtoken")
const User = require('../models/user')

exports.authenticate = async (req, res, next) => {
    try {
        const { token="" } = req.cookies
        
        if (!token) {
            return res.status(401).json({ message: "Please login first" })
        }

        const userId = await jwt.verify(token, process.env.SECRETE_KEY)
        req.user = await User.findById(userId._id)

        next()
    } catch (error) {
        res.status(401).json({ message: error.message, error })
    }
}