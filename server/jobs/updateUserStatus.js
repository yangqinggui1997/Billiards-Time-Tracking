const mongoose = require('mongoose')
const User = mongoose.model('User')
const Queue = require('bull')
const opts = require('../config/redis')

const updateUserStatusJob = new Queue('Update-User-Status-Job', opts)

updateUserStatusJob.process(async job => {
    const { userId, status } = job.data
    try
    {
        await User.findOneAndUpdate({_id: userId}, {status})
    }
    catch(error)
    {
        return Promise.reject(error)
    }
    return Promise.resolve(true)
})

module.exports = updateUserStatusJob