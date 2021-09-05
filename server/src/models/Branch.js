const mongoose = require('mongoose')

const branchSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter branch name!'],
            maxLength: [255, 'Branch name is limited by 255 character!']
        },
        phone: {
            type: String,
            unique: [true, 'Phone numbers already exists!'],
            required: [true, 'Please enter phone number of branch!'],
            maxLength: [16, 'Phone numbers is limited by 16 digits!']
        },
        email: {
            type: String,
            maxLength: [255, 'Email is limited by 255 character!'],
            unique: [true, 'Email already exists!'],
            required: [true, 'Please enter email address of branch!'],
            match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please add a valid email address!']
        },
        address: {
            type: String,
            required: [true, 'Please enter address of branch!']
        },
        isPrimaryBranch: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

mongoose.model('Branch', branchSchema)