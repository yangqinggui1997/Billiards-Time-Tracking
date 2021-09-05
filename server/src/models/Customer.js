const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema(
    {
        branchId: {
            type: mongoose.Types.ObjectId,
            ref: 'Branch',
            required: [true, 'Please enter branch identity!'],
            index: true
        },
        identity: {
            type: String, //combine branch id + '-' + identity
            required: [true, 'Please enter identity!'],
            unique: [true, 'Identity already exists!'],
            index: true
        },
        firstName: {
            type: String,
            required: [true, 'Please enter first name!'],
            maxLength: [255, 'First name is limited by 255 character!']
        },
        lastName: {
            type: String,
            maxLength: [255, 'First name is limited by 255 character!']
        },
        phone: {
            type: String,
            unique: [true, 'Phone numbers already exists!'],
            maxLength: [16, 'Phone numbers is limited by 16 digits!']
        },
        email: {
            type: String,
            maxLength: [255, 'Email is limited by 255 character!'],
            unique: [true, 'Email already exists!'],
            match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please add a valid email address!']
        },
        avatar: String,
        address: {
            type: String,
            maxLength: [255, 'address is limited by 255 character!']
        },
        point: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true
    }
)

mongoose.model('Customer', customerSchema)