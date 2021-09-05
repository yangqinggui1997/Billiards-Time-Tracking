const mongoose = require('mongoose')

const customerLevelSchema = new mongoose.Schema(
    {
        levelName: {
            type: String,
            required: [true, 'Please enter level name!'],
            unique: [true, 'Level name already exists!']
        },
        point: {
            type: Number,
            default: 0
        },
        description: String
    },
    {
        timestamps: true
    }
)

mongoose.model('CustomerLevel', customerLevelSchema)
