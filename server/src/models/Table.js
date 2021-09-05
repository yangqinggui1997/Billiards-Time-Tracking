const mongoose = require('mongoose')

const pricingSchema = new mongoose.Schema(
    {
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
        price: {
            type: Number,
            required: [true, 'Please enter price!']
        }
    },
    {
        timestamps: true
    }
)

const tableSchema = new mongoose.Schema(
    {
        branchId: {
            type: mongoose.Types.ObjectId,
            ref: 'Branch',
            required: [true, 'Please enter branch identity of table!']
        },
        number: {
            type: Number,
            required: [true, 'Please enter number of table!'],
            min: 1,
        },
        floor: {
            type: Number,
            required: [true, 'Please enter floor of table!'],
            min: 0
        },
        prices: [pricingSchema],
        adjustPrices: [[pricingSchema]],
        status: {
            type: Boolean,
            default: true
        },
        description: String
    },
    {
        timestamps: true
    }
)

tableSchema.index({branchId: 1, number: 1, floor: 1}, {unique: true})

mongoose.model('Table', tableSchema)