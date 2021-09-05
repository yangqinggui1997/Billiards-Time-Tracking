const mongoose  = require('mongoose')

const adjustPrice = new mongoose.Schema(
    {
        price: {
            type: Number,
            unique: [true, 'This price already exists!']
        }
    },
    {
        timestamps: true
    }
)

const productSchema = new mongoose.Schema(
    {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Please enter category identity!'],
            index: true
        },
        name: {
            type: String,
            unique: [true, 'Product name already exists!'],
            required: [true, 'Please enter product name!']
        },
        price: {
            type: Number,
            default: 0.000000
        },
        avatar: String,
        display: {
            type: Boolean,
            default: true
        },
        adjustPrices: [adjustPrice]
    },
    {
        timestamps: true
    }
)

mongoose.model('Product', productSchema)