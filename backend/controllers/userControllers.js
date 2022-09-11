const { json } = require('express')
const asyncHandler = require('express-async-handler')
const User = require('../models/UserModel')
const generateToken = require('../utils/generateToken')

// @desc    Auth user and get token
// @route   POST /api/user/login
// @access  Public
const authUser = asyncHandler(async(req, res) =>
{
    const { email, password } = req.body
    const user = await User.findOne({email})
    if(user && (await user.matchPassword(password)))
    {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }
    else{
        res.status(401)
        throw new Error('Invalid email or password')
    }
} )


// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = asyncHandler(async(req, res) =>
{
    const user = await User.findById(req.user._id)
    if(user)
    {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    }
    else{
        res.status(404)
        throw new Error('User not found')
    }
} )


module.exports = {authUser, getUserProfile}