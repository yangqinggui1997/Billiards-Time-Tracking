const mongoose = require('mongoose')
const express = require('express')
const { getUserDataUploadDir } = require('../helpers')
const router = express.Router()
const User = mongoose.model('User')
const Branch = mongoose.model('Branch')
const Table = mongoose.model('Table')

const test = async () => {
    let val = ""
    const branch = await User.findOne().or([{'tables.tableId': "611f54db286a046xzxzf5676e8f0"}, {'tables.tableId': "611f54db286a046f5676e8f3"}]).and({email:  "anthonyyang@mail.yang"}).exec().then(doc => {
        if(doc) val ="has"
        else
        val ="not has"
    }).catch(err => Promise.reject(new Error("new error")))
    return Promise.resolve(val)
}
router.get('/test', async (req, res) => {
    await User.findOne({email:  "anthonyyang@mail.yang"}).exec().then(async doc => {
        await User.findOne().or([{'tables.tableId': "611f54db286a046xzxzf5676e8f0"}, {'tables.tableId': "611f54db286a046f5676e8f3"}]).and({email:  "anthonyyang@mail.yang"}).exec().then(doc => {
            if(doc) val ="has"
            else
            val ="not has"
        }).catch(err => Promise.reject(new Error(err.message)))
    }).catch(error => {
        res.status(422).send(error.message)
    })
})

router.post('/test', (req, res) => {
    res.send({status: "ok"})
})

router.post('/test/videoEditor', (req, res) => {
    res.send({status: "ok"})
})

router.post('/test/imageEditor', async (req, res) => {
    try
    {
        if(req.files && req.files.image)
        {
            const avatar = req.files.image
            const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            const fileName = uniquePreffix + '-' + avatar.name
            await avatar.mv(getUserDataUploadDir("611f57acc0979835c073b530") + fileName, (err) => {
                if(err) console.log("Upload avatar failed!")
            })
            res.send({status: "ok has file"})
        }
        else
        res.send({status: 'not file'})
    }
    catch(err)
    {
        res.status(422).send(err.message)
    }
})

router.put('/test', (req, res) => {
    res.send({status: "ok"})
})

router.delete('/test', (req, res) => {
    res.send({status: "ok"})
})

module.exports = router
