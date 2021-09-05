const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (req, res, next) => {
    const { authorization } = req.headers

    if(!authorization) return res.status(401).send('You must be logged in!')
    const token = authorization.replace('Bearer ', '')
    jwt.verify(token, "123456", async (error, payload) => {
        if(error) return res.status(401).send('You must be logged in!')
        const { userId } = payload
        const user = await User.findById(userId)
        if(!user)
            res.status(401).send("User dosen't exists!")
        if(user.status === 2)
            return res.status(401).send('User logged out!')
        else if(!user.status)
            return res.status(401).send('User account has been locked!')
        req.user = user
        next()
    })
}