require('./models/Bill')
require('./models/Branch')
require('./models/Category')
require('./models/Customer')
require('./models/CustomerLevel')
require('./models/Product')
require('./models/Table')
require('./models/User')
const express = require('express')
const mongoose = require('mongoose')
const UserRoutes = require('./routes/UserRoutes')
const TestRoutes = require('./routes/TestRouter')
const BranchRoutes = require('./routes/BranchRouter')
const CustomerRoutes = require('./routes/CustomerRoutes')
const fileUpload = require('express-fileupload')
const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(__dirname))
app.use('/uploads/user', express.static('uploads/user'))
app.use('/uploads/customer', express.static('uploads/customer'))

app.use(fileUpload({
    createParentPath: true
}))
app.use(UserRoutes)
app.use(BranchRoutes)
app.use(TestRoutes)
app.use(CustomerRoutes)

const mongoUri = process.env.MONGO_URI

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

mongoose.connection.on('connected', () => {
    console.log("Connected to mongo instance!")
})

mongoose.connection.on('error', (err) => {
    console.log('Error to connecting mongo!', err)
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}!`)
})

