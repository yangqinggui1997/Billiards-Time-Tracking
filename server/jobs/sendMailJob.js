const { sendMail } = require('../src/helpers')
const Queue = require('bull')
const opts = require('../config/redis')

const sendMailJob = new Queue('Send-Mail-Job', opts)

sendMailJob.process(async job => {
    const { receiver, subject, options } = job.data
    try {
        await sendMail(receiver, subject, options)
    } catch (error) {
        return Promise.reject(error)
    }
    return Promise.resolve(true)
})

module.exports = sendMailJob