const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const productroutes = require('./routes/productroutes')
const userroutes = require('./routes/userroutes')
const orderroutes = require('./routes/orderroutes')
const paymentroutes = require('./routes/paymentroutes')
const { notfound, errorHandler } = require('./middleware/errorMiddleware')

connectDB()
const app = express()

app.get('/', (req,res) => {
    res.send('api is running')
})

app.use(express.json())

app.use('/api/products', productroutes)
app.use('/api/user', userroutes)
app.use('/api/orders', orderroutes)
app.use('/api/payments',paymentroutes)

//not found middleware
app.use(notfound)

//custom error middleware
app.use(errorHandler)

const port = process.env.PORT || 5000

app.listen(port,()=>console.log(`server running in ${process.env.NODE_ENV} mode on port ${port}`))