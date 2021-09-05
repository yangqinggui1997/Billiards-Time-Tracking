const mongoose = require('mongoose')

const timeTracking = new mongoose.Schema({
    startTime: {
        type: Number,
        required: [true, 'Please enter start time!'],
        min: 0,
        max: 24,
        validate: {
            validator: v => {
                return v > this.endTime
            },
            message: props => `Start time '${props.value}' is less than end time!`
        }
    },
    endTime: {
        type: Number,
        required: [true, 'Please enter end time!'],
        min: 0,
        max: 24,
        validate: {
            validator: v => {
                return v < this.startTime
            },
            message: props => `End time '${props.value}' is greater than start time!`
        }
    },
    price: Number
})

const billDetailTableSchema = new mongoose.Schema(
    {
        tableId: {
            type: mongoose.Types.ObjectId,
            ref: 'Table',
            index: true,
            required: [true, 'Please enter table identity!']
        },
        timeTracks: timeTracking
    },
    {
        timestamps: true
    }
)

const billDetailProductSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Please enter product identity!'],
            index: true
        },
        quantities: Number,
        price: Number,
        amount: Number
    },
    {
        timestamps: true
    }
)

const detailTablesSchema = new mongoose.Schema({
    billDetailTables: [billDetailTableSchema],
    totalAmount: Number 
})

const billSchema = new mongoose.Schema(
    {
        branchId: {
            type: mongoose.Types.ObjectId,
            ref: 'Branch',
            required: [true, 'Please enter branch identity!'],
            index: true
        },
        staffId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please enter staff identity!'],
            index: true,
        },
        customerId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please enter customer identity!'],
            index: true
        },
        tables: [detailTablesSchema],
        products: [billDetailProductSchema]
    },
    {
        timestamps: true
    }
)

mongoose.model('Bill', billSchema)