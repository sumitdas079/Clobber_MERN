const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db.js')
const users = require('./data/users.js')
const products = require('./data/products.js')
const User = require('./models/UserModel.js')
const Product = require('./models/ProductModel.js')
const Order = require('./models/OrderModel.js')

connectDB()

const importData = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        const createdUsers = await User.insertMany(users)
        const adminuser = createdUsers[0]._id
        const sampleproducts = products.map((product) => {
            return{ ...product, user: adminuser }
        })
        await Product.insertMany(sampleproducts)
        console.log('Data imported');
        process.exit()
    } catch (error) {
        console.log(`${error}`);
        process.exit(1)
    }
}
const destroyData = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        console.log('Data destructed');
        process.exit()
    } catch (error) {
        console.log(`${error}`);
        process.exit(1)
    }
}

if(process.argv[2]==='-d')
{
    destroyData()
}else{
    importData()
}