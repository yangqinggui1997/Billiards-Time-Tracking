const jwt = require('jsonwebtoken')
const fs = require('fs')
const mongoose = require('mongoose')
const express = require('express')
const { isNumber, getIdNumber, checkRequiredInput, getRoleText, getStatusText, getUserFile, getUserDataUploadDir} = require('../helpers')
const sendMailJob = require('../../jobs/sendMailJob')
const { SIGNUP_ROUTE, SIGNIN_ROUTE, UPDATE_USER_ROUTE, DELETE_USER_ROUTE, GET_ONE_USER_ROUTE, GET_LIST_USER_ROUTE, ADD_TABLE_USER_ROUTE, UPDATE_TABLE_USER_ROUTE, DELETE_TABLE_USER_ROUTE, GET_PROFILE_ROUTE, SIGNOUT_ROUTE, LOCK_USER_ROUTE, UNLOCK_USER_ROUTE, SIGNIN_FACEBOOK_ROUTE, SIGNIN_GOOGLE_ROUTE, LINK_FACEBOOK_ACOUNT_ROUTE, LINK_GOOGLE_ACCOUNT_ROUTE } = require('../constants/user')
const router = express.Router()
const AdminMiddleware = require('../middlewares/AdminMiddleware')
const AuthMiddleware = require('../middlewares/AuthMiddleware')
const updateUserStatusJob = require('../../jobs/updateUserStatus')
const User = mongoose.model('User')
const Table = mongoose.model('Table')
const Bill = mongoose.model('Bill')

// router.use(AdminMiddleware)

const generateIdentity = async branchId => {
    const identity = getIdNumber(6)
    const user = await User.findOne({branchId, identity})
    if(!user)
        return identity
    generateIdentity(branchId)
} 

const getTables = async userTables => {
    if(!userTables) return []
    let tables = []
    await Promise.all(userTables.map(async table => {
        const item = await Table.findById(table.tableId, {number: 1, floor: 1, status: 1, description: 1})
        if(item)
            tables.push({
                _id: table.tableId,
                number: item.number,
                floor: item.floor,
                status: item.status,
                description: item.description
            })
    }))
    return tables
}

const getExcludeFields = (fields = []) => {
    const excludeFields = ["branchId", "_id", "fullName", "email", "roleCode", "roleText", "statusCode", "statusText", "avatar", "tables", "createdAt", "updatedAt", "socialAccounts"].filter(item => !fields.includes(item))

    return excludeFields
}

const getUserSchema = async (user, excludeFields = []) => {
    if(!excludeFields.length) 
        return {
            branchId: user.branchId,
            _id,
            fullName: user.fullName,
            email: user.email,
            roleCode: user.role,
            roleText: getRoleText(user.role),
            statusCode: user.status,
            statusText: getStatusText(user.status),
            avatar: getUserFile(_id, avatar),
            tables: await getTables(tables),
            socialAccounts: user.socialAccounts,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    const _id = excludeFields.includes("_id") ? undefined : user._id
    const avatar = excludeFields.includes("avatar") ? undefined : user.avatar
    const tables = excludeFields.includes("tables") ? undefined : user.tables
    return {
        branchId: excludeFields.includes("branchId") ? undefined : user.branchId,
        _id,
        fullName: excludeFields.includes("fullName") ? undefined : user.fullName,
        email: excludeFields.includes("email") ? undefined : user.email,
        roleCode: excludeFields.includes("roleCode") ? undefined : user.role,
        roleText: excludeFields.includes("roleText") ? undefined : getRoleText(user.role),
        statusCode: excludeFields.includes("statusCode") ? undefined : user.status,
        statusText: excludeFields.includes("statusText") ? undefined : getStatusText(user.status),
        avatar: getUserFile(_id, avatar),
        tables: await getTables(tables),
        socialAccounts: excludeFields.includes("socialAccounts") ? undefined : user.socialAccounts,
        createdAt: excludeFields.includes("createdAt") ? undefined : user.createdAt,
        updatedAt: excludeFields.includes("updatedAt") ? undefined : user.updatedAt
    }
}

router.get(GET_PROFILE_ROUTE, AuthMiddleware, async (req, res) => {
    try
    {
        const user = await User.findById(req.user._id)
        if(!user)
            return res.status(422).send("User dosen't exists!")
        const userSchema = await getUserSchema(user)
        res.send(userSchema)
    }
    catch(error)
    {
        return res.status(422).send(error.message)
    }
})

router.get(GET_ONE_USER_ROUTE, AdminMiddleware, async (req, res) => {
    const { id, fields } = {...req.body, ...req.query}
    if(!checkRequiredInput(id))
        return res.status(422).send("Id user is required!")
        
    try
    {
        const user = await User.findById(id)
        if(!user)
            return res.status(422).send("User dosen't exists!")
        const includeFields = checkRequiredInput(fields) ? (typeof fields === 'string' ? fields.split(",").map(item => item.trim()) : fields) : []
        const userSchema = await getUserSchema(user, getExcludeFields(includeFields))
        res.send(userSchema)
    }
    catch(error)
    {
        return res.status(422).send(error.message)
    }
})

router.get(GET_LIST_USER_ROUTE, AdminMiddleware, async (req, res) => {
    const params = {...req.body, ...req.query}
    let users = {}
    try
    {
        users = await User.find(params)
    }
    catch(err)
    {
        return res.status(422).send(err.message)
    }
    const list = await Promise.all(users.map(async user => {
        return await getUserSchema(user)
    }))
    res.send(list)
})

router.post(SIGNUP_ROUTE, AdminMiddleware, async (req, res) => {
    const {branchId, email, fullName, tables, role} = req.body
    
    if(!checkRequiredInput(branchId) || !checkRequiredInput(email) || !checkRequiredInput(fullName))
        return res.status(422).send("Branch identity, email and full name is required!")

    let tableIds = []
    const password = getIdNumber(6)
    const user = await User.findOne({email})
    if(user)
        return res.status(422).send("Email already exists!")
    if(checkRequiredInput(tables))
    {
        const tablesNew = JSON.parse(tables)
        if(Array.isArray(tablesNew))
            await Promise.all(
                [...new Set(tablesNew)].map(async v => {
                    let _user = null
                    try
                    {
                        _user = await User.findOne({branchId: branchId, "tables.tableId": v}, {_id: 1})
                    }
                    catch(err){}
                    if(!_user)
                        tableIds.push({
                            tableId: mongoose.Types.ObjectId(v)
                        })
                })
            )
        else
        {
            const { _id } = await User.findOne({branchId: branchId, "tables.tableId": tables}, {_id: 1})
            if(!_id) 
                tableIds.push({
                    tableId: mongoose.Types.ObjectId(tables)
                })
        }
    }
    
    let userInsert = null
    try
    {
        const objectInsert = {
            branchId: mongoose.Types.ObjectId(branchId),
            identity: (await generateIdentity(branchId)).toString(),
            fullName,
            email,
            password,
            tables: tableIds
        }
        const checkRole = isNumber(role) && role >= 0 && role <= 2
        userInsert = new User( checkRole ? {...objectInsert, role} : objectInsert)
        await userInsert.save()
        if(req.files && req.files.avatar)
        {
            const avatar = req.files.avatar
            const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            const fileName = uniquePreffix + '-' + avatar.name
            await avatar.mv(getUserDataUploadDir(userInsert._id) + fileName, (err) => {
                if(err) console.log("Upload avatar failed!")
            })
            await User.findOneAndUpdate({identity, branchId}, {avatar: fileName})
        }
    }
    catch(err)
    {
        return res.status(422).send(err.message)
    }
    sendMailJob.add(
        {
            receiver: email,
            subject: "Your Billiards-POS Account Created Success!", 
            options: { type: 1, data: { email, password } }
        }
    )
    const userInfors = await User.findById(userInsert._id)
    const infors = await getUserSchema(userInfors, ["statusCode", "statusText"])
    res.send({status: 'ok', infors})
})

router.post(SIGNIN_ROUTE, async (req, res) => {
    const {email, password} = req.body

    if(!checkRequiredInput(email) || !checkRequiredInput(password))
        return res.status(422).send('You must provide email and password!')
    const user = await User.findOne({email})
    if(!user)
        return res.status(402).send('Email not exists!')
    if(!user.status)
        return res.status(401).send('User account has been locked! Please contact admin to unlock account.')
    try
    {
        await user.comparePassword(password)
    }
    catch(error)
    {
        return res.status(422).send('Invalid email or password! ' + error)
    }
    const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        userId: user._id
    }, "123456")
    const infors = await getUserSchema(user, ["statusCode", "statusText"])
    updateUserStatusJob.add({userId: user._id, status: 1})
    res.send({
        token, 
        infors: {
            ...infors, login: {
                typeLogin: 'normal',  
                idSocialAccount: '', 
                name: infors.fullName, 
                email: infors.email,
                avatar: infors.avatar
            }
        }
    })
})

router.post(SIGNIN_FACEBOOK_ROUTE, async (req, res) => {
    const {email, facebookId, name, avatar} = req.body

    if(!checkRequiredInput(facebookId))
        return res.status(422).send('You must provide facebook identity!')
    await User.findOne({'socialAccounts.id': facebookId, 'socialAccounts.type': 'facebook'}, {password: 0}).exec().then(async doc => {
        if(!doc) return res.status(422).send("This social account not exists. Please link this social account before signing in!")
        if(!doc.status) return res.status(401).send('User account has been locked! Please contact admin to unlock account.')
        let login = {
            typeLogin: 'facebook',  
            idSocialAccount: facebookId, 
            name: doc.fullName, 
            email: doc.email,
            avatar: getUserFile(doc._id, doc.avatar)
        }
        doc.socialAccounts = doc.socialAccounts.map(item => {
            if(item.type === 'facebook' && item.id === facebookId)
            {
                item.name = checkRequiredInput(name) ? name : item.name
                item.email = checkRequiredInput(email) ? email : item.email
                item.avatar = checkRequiredInput(avatar) ? avatar : item.avatar

                login.name = item.name ? item.name : login.name
                login.email = item.email ? item.email : login.email
                login.avatar = item.avatar ? item.avatar : login.avatar
            }
            return item
        })
        await doc.save()
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            userId: doc._id
        }, "123456")
        const infors = await getUserSchema(doc, ["statusCode", "statusText"])
        updateUserStatusJob.add({userId: doc._id, status: 1})
        res.send({
            token, 
            infors: {...infors, login}
        })
    }).catch(err => {
        return res.status(422).send(err.message)
    })
})

router.post(SIGNIN_GOOGLE_ROUTE, async (req, res) => {
    const {email, googleId, name, avatar} = req.body

    if(!checkRequiredInput(googleId))
        return res.status(422).send('You must provide google identity!')
    await User.findOne({'socialAccounts.id': googleId, 'socialAccounts.type': 'google'}, {password: 0}).exec().then(async doc => {
        if(!doc) return res.status(422).send("This social account not exists. Please link this social account before signing in!")
        if(!doc.status) return res.status(401).send('User account has been locked! Please contact admin to unlock account.')
        let login = {
            typeLogin: 'google',  
            idSocialAccount: googleId, 
            name: doc.fullName, 
            email: doc.email,
            avatar: getUserFile(doc._id, doc.avatar)
        }
        doc.socialAccounts = doc.socialAccounts.map(item => {
            if(item.type === 'google' && item.id === googleId)
            {
                item.name = checkRequiredInput(name) ? name : item.name
                item.email = checkRequiredInput(email) ? email : item.email
                item.avatar = checkRequiredInput(avatar) ? avatar : item.avatar

                login.name = item.name ? item.name : login.name
                login.email = item.email ? item.email : login.email
                login.avatar = item.avatar ? item.avatar : login.avatar
            }
            return item
        })
        await doc.save()

        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            userId: doc._id
        }, "123456")
        const infors = await getUserSchema(doc, ["statusCode", "statusText"])
        updateUserStatusJob.add({userId: doc._id, status: 1})
        res.send({
            token, 
            infors: {...infors, login}
        })
    }).catch(err => {
        return res.status(422).send(err.message)
    })
})

router.put(LINK_FACEBOOK_ACOUNT_ROUTE, AuthMiddleware, async (req, res) => {
    const {facebookEmail, facebookId, name, avatar } = {...req.body, ...req.query}

    if(!checkRequiredInput(facebookId))
        return res.status(422).send("Facebook identity is required!")
    await User.findById(req.user._id, {socialAccounts: 1}).exec().then(async doc => {
        if(!doc) return res.status(422).send("User not exists!")
        await User.findOne({'socialAccounts.type': 'facebook', 'socialAccounts.id': facebookId}).exec().then(async user => {
            if(!user)
            {
                doc.socialAccounts.push({
                    type: 'facebook',
                    id: facebookId,
                    name: name,
                    email: facebookEmail,
                    avatar: avatar
                })
                await doc.save()
                res.send({status: "ok"})
            }
            else
                return res.status(422).send("This facebook account is linked by yourself or another user!")
        }).catch(err => Promise.reject(new Error(err.message)))
    }).catch(error => {
        return res.status(422).send(error.message)
    })
})

router.put(LINK_GOOGLE_ACCOUNT_ROUTE, AuthMiddleware, async (req, res) => {
    const {googleEmail, googleId, name, avatar } = {...req.body, ...req.query}

    if(!checkRequiredInput(googleId))
        return res.status(422).send("Google identity is required!")
    await User.findById(req.user._id, {socialAccounts: 1}).exec().then(async doc => {
        if(!doc) return res.status(422).send("User not exists!")
        await User.findOne({'socialAccounts.type': 'google', 'socialAccounts.id': googleId}).exec().then(async user => {
            if(!user)
            {
                doc.socialAccounts.push({
                    type: 'google',
                    id: googleId,
                    name: name,
                    email: googleEmail,
                    avatar: avatar
                })
                await doc.save()
                res.send({status: "ok"})
            }
            else
                return res.status(422).send("This google account is linked by yourself or another user!")
        }).catch(err => Promise.reject(new Error(err.message)))
    }).catch(error => {
        return res.status(422).send(error.message)
    })
})

router.put(SIGNOUT_ROUTE, async (req, res) => {
    const { userId } = {...req.body, ...req.query}

    if(!checkRequiredInput(userId))
        return res.status(422).send("User identity is required!")
    updateUserStatusJob.add({userId, status: 2})
    res.send({status: 'ok'})
})

router.put(UPDATE_USER_ROUTE, AuthMiddleware, async (req, res) => {
    const {userId, branchId, fullName, role} = {...req.body, ...req.query}

    const _id = (req.user.role < 2 && checkRequiredInput(userId) && req.user._id !== userId) // admin update other user account
    ? userId : req.user._id

    new Promise(async (resolve, reject) => {
        await User.findById(_id, {_id: 1, branchId: 1, fullName: 1, role: 1, avatar: 1}).exec().then(async doc => {
            if(!doc) return reject(new Error("User dosen't exist!"))
            if(checkRequiredInput(branchId) && req.user.role < 2)
                doc.branchId = branchId
            if(checkRequiredInput(fullName) && req.user.role < 2)
                doc.fullName = fullName
            if(checkRequiredInput(role) && req.user.role < 2)
                doc.role = role
            if(req.files && req.files.avatar)
            {
                const avatar = req.files.avatar
                const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                const fileName = uniquePreffix + '-' + avatar.name
                await avatar.mv(getUserDataUploadDir(doc._id) + fileName, (err) => {
                    if(err) console.log("Upload avatar failed!")
                })
                if(doc.avatar)
                {
                    const filePath = getUserDataUploadDir(doc._id) + doc.avatar
                    fs.access(filePath, (error) => {
                        if(error) console.log(error)
                        else
                            fs.unlink(filePath, err => {
                                if(err) console.log("Error: ENOENT: no such file or directory in unlink: " + "\"" + filePath + "\"")
                            })
                    })
                }
                doc.avatar = fileName
            }
            await doc.save()
            return resolve(true)
        }).catch(err => {
            return reject(err)
        })
    }).then(async val => {
        const userInfors = await User.findById(_id)
        const infors = await getUserSchema(userInfors, ["statusCode", "statusText"])
        res.send({status: 'ok', infors})
    }).catch(err => {
        return res.status(422).send(err.message)
    })
})

router.delete(DELETE_USER_ROUTE, AdminMiddleware, async (req, res) => {
    const { userId } = { ...req.body, ...req.query }

    if(!checkRequiredInput(userId))
        return res.status(422).send("User identity is required!")

    new Promise(async (resolve, reject) => {
        await User.findById(userId, {_id: 1 }).exec().then(async doc => {
            if(!doc) return res.status(422).send("User dosen't exists!")
            const session = await User.startSession()
            await session.withTransaction(async () => {
                await User.findByIdAndDelete(doc._id, {session})
                await Bill.deleteMany(doc._id, {session})
                const filePath = getUserDataUploadDir(_id)
                fs.rmdir(filePath, { recursive: true }, (error) => {
                    if(error) console.log(error)
                    else
                        console.log("Deleted user folder success!")
                })
            }).then(val => {
                return resolve(true)
            }).catch(error => {
                return reject(error)
            })
            session.endSession()
        }).catch(error => 
        {
            return reject(error)
        })
    }).then(val => {
        res.send({status: "ok"})
    }).catch(error => {
        return res.status(422).send(error.message)
    })
})

router.put(LOCK_USER_ROUTE, AdminMiddleware, async (req, res) => {
    const { userId } = req.body

    if(!checkRequiredInput(userId))
        return res.status(422).send("Id user is required!")

    updateUserStatusJob.add({userId, status: 0})
    res.send({status: 'ok'})
})

router.put(UNLOCK_USER_ROUTE, AdminMiddleware, async (req, res) => {
    const { userId } = req.body

    if(!checkRequiredInput(userId))
        return res.status(422).send("Id user is required!")

    updateUserStatusJob.add({userId, status: 2})
    res.send({status: 'ok'})
})

//add or delete via drag and drop
router.post(ADD_TABLE_USER_ROUTE, AdminMiddleware, async (req, res) => {
    const { userId, tables } = req.body
    
    if(!checkRequiredInput(userId) || !checkRequiredInput(tables))
        return res.status(422).send("User id and tables is required!")

    let tablesNew = ''
    try
    {
        tablesNew = JSON.parse(tables)
    }
    catch(err)
    {
        res.status(422).send("Table ids are incorect!")
    }
    new Promise(async (resolve, reject) => {
        await User.findById(userId, {tables: 1, branchId: 1}).exec().then(async doc => {
            if(!doc) return reject(new Error("User dosen't exist!"))
            if(Array.isArray(tablesNew))
                await Promise.all(
                    [...new Set(tablesNew)].map(async v => {
                        let _user = null
                        try
                        {
                            _user = await User.findOne({branchId: branchId, "tables.tableId": v}, {_id: 1})
                        }
                        catch(err){}
                        if(!_user)
                            doc.tables.push({
                                tableId: mongoose.Types.ObjectId(v)
                            })
                    })
                )
            else
            {
                const { _id } = await User.findOne({branchId: doc.branchId, "tables.tableId": tables}, {_id: 1})
                if(!_id) 
                    doc.tables.push({
                        tableId: mongoose.Types.ObjectId(tables)
                    })
            }
            await doc.save()
            return resolve(true)
        }).catch(err => {
            return reject(err)
        })
    }).then(val => {
        res.send({status: "ok"})
    }).catch(err => {
        return res.status(422).send(err.message)
    })
})

router.put(UPDATE_TABLE_USER_ROUTE, AdminMiddleware, async (req, res) => {
    const { userId, tableIdOld, tableIdNew } = req.body
    
    if(!checkRequiredInput(userId) || !checkRequiredInput(tableIdOld) || !checkRequiredInput(tableIdNew))
        return res.status(422).send("User id and tables is required!")
    
    new Promise(async (resolve, reject) => {
        await User.findById(userId, {branchId: 1, tables: 1}).exec().then(async doc => {
            if(!doc) return reject(new Error("User dosen't exist!"))
            const _table = await User.findOne({"tables.tableId": tableIdNew, branchId: doc.branchId}, {_id: 1})
            if(_table) return reject(new Error("Table is unavailable!"))

            doc.tables = doc.tables.map(table => {
                if(table.tableId.toHexString() === tableIdOld)
                table.tableId = tableIdNew
                return table
            })
            
            await doc.save()
            return resolve(true)
        }).catch(err => {
            return reject(err)
        })
    }).then(val => {
        res.send({status: "ok"})
    }).catch(err => {
        return res.status(422).send(err.message)
    })
})

router.delete(DELETE_TABLE_USER_ROUTE, AdminMiddleware, async (req, res) => {
    const { userId, tables } = req.body
    
    if(!checkRequiredInput(userId) || !checkRequiredInput(tables))
        return res.status(422).send("User id and tables is required!")

    let tableIds = ''
    try
    {
        tableIds = JSON.parse(tables)
    }
    catch(err)
    {
        res.status(422).send("Table ids are incorect!")
    }
    new Promise(async (resolve, reject) => {
        if(Array.isArray(tableIds))
            await User.findById(userId, {tables: 1}).exec().then(async doc => {
                if(!doc) return reject(new Error("User dosen't exist!"))
                doc.tables = doc.tables.filter(table => {
                    console.log(table.tableId)
                    return !tableIds.includes(table.tableId.toHexString())
                })
                try
                {
                    console.log(tableIds)
                    await doc.save()
                    return resolve(true)
                }
                catch(err)
                {
                    return reject(err)
                }
            }).catch(err => {
                return reject(err)
            })
        else
            await User.findById(userId, {tables: 1}).exec().then(async doc => {
                if(!doc) return reject(new Error("User dosen't exist!"))
                doc.tables = doc.tables.filter(table => {
                    return table.tableId !== tableIds
                })
                try
                {
                    await doc.save()
                    return resolve(true)
                }
                catch(err)
                {
                    return reject(err)
                }
            }).catch(err => {
                return reject(err)
            })
    }).then(val => {
        res.send({status: "ok"})
    }).catch(err => {
        return res.status(422).send(err.message)
    })
})

module.exports = router
