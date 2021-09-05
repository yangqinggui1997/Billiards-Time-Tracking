const mongoose  = require('mongoose')

const categorySchema = new mongoose.Schema(
    {
        idParent: {
            type: mongoose.Types.ObjectId,
            default: null,
            index: true
        },
        name: {
            type: String,
            unique: [true, 'Category name is already exists!'],
            required: [true, 'Please enter category name!']
        },
        avatar: String,
        display: {
            type: Boolean,
            default: true
        },

    },
    {
        timestamps: true
    }
)

mongoose.model('Category', categorySchema)