const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const tableIdSchema = new mongoose.Schema(
    {
        tableId: {
            type: mongoose.Types.ObjectId,
            ref: 'Table',
            index: true
        }
    },
    {
        timestamps: true
    }
)

const socialAccount = new mongoose.Schema(
    {
        type: {
            type: String,
            required: [true, 'Please enter social type!'],
            index: true
        },
        id: {
            type: String,
            required: [true, 'Please enter social identity!'],
            index: true
        },
        name: String,
        email: {
            type: String,
            index: true,
            maxLength: [255, 'Social email is limited by 255 character!'],
            match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please add a valid social email address!']
        },
        avatar: String
    },
    {
        timestamps: true
    }
)

const userSchema = new mongoose.Schema(
    {
        branchId: {
            type: mongoose.Types.ObjectId,
            ref: 'Branch',
            required: [true, 'Please enter branch identity!'],
            index: true
        },
        identity: {
            type: String,
            required: [true, 'Please enter identity!'],
            index: true
        },
        fullName: {
            index: true,
            type: String,
            required: [true, 'Please enter first name!'],
            maxLength: [255, 'First name is limited by 255 character!']
        },
        email: {
            index: true,
            type: String,
            required: [true, 'Please enter email!'],
            maxLength: [255, 'Email is limited by 255 character!'],
            unique: [true, 'Email already exists!'],
            match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please add a valid email address!']
        },
        password: {
            type: String,
            required: [true, 'Please enter password!'],
            maxLength: [32, 'Password is limited by 32 characters!'],
            minLength: [6, 'Password must be atleast 6 character!']
        },
        avatar: String,
        role: {
            index: true,
            type: Number,
            default: 2, //0 for admin, 1 for manager, 2 for staff
            min: 0,
            max: 2
        },
        status: {
            index: true,
            type: Number,
            default: 2, //0 - is blocked account, 1 for loggin, 2 for logout
            min: 0,
            max: 2
        },
        deviceToken: String,
        tables: [tableIdSchema],
        socialAccounts: [socialAccount]
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', function(next){
    const user = this

    if(!user.isModified('password'))
        next()
    bcrypt.genSalt(10, (err, salt) => {
        if(err) next(err)
        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) next(err)
            user.password = hash
            next()
        })
    })
})

userSchema.methods.comparePassword = function(candidatePassword) 
{
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            if(err) return reject(err)
            if(!isMatch) return reject(false)
            return resolve(true)
        })
    })
}

mongoose.model('User', userSchema)