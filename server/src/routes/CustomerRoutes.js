const mongoose = require('mongoose')
const express = require('express')
const fs = require('fs')
const { GET_ONE_CUSTOMER, UPDATE_CUSTOMER, GET_LIST_CUSTOMER, ADD_CUSTOMER, DELETE_CUSTOMER } = require('../constants/customer')
const { checkRequiredInput, getIdNumber, getCustomerDataUploadDir } = require('../helpers')
const { HOST, UPLOAD_CUSTOMER_DIR } = require('../constants')
const sendMailJob = require('../../jobs/sendMailJob')
const router = express.Router()
const Customer = mongoose.model('Customer')
const Bill = mongoose.model('Bill')
const AdminMiddleware = require('../middlewares/AdminMiddleware')

const generateIdentity = async branchId => {
    const identity = getIdNumber(6)
    const user = await Customer.findOne({branchId, identity})
    if(!user)
        return identity
    generateIdentity(branchId)
} 

const getCustomerSchema = (customer, excludeFields = []) => {
    if(!excludeFields.length) 
        return {
            _id: customer._id,
            branchId: customer.branchId,
            firstName: customer.firstName,
            lastName: customer.lastName,
            identity: customer.identity,
            phone: customer.phone,
            email: customer.email,
            avatar: customer.avatar ? HOST + "/" + UPLOAD_CUSTOMER_DIR + customer._id + "/" + customer.avatar : undefined,
            address: customer.address,
            point: customer.point,
            createAt: customer.createdAt,
            updateAt: customer.updatedAt
        }
    return {
        _id: excludeFields.includes('_id') ? customer._id : undefined,
        branchId: excludeFields.includes('branchId') ? customer.branchId : undefined,
        firstName: excludeFields.includes('firstName') ? customer.firstName : undefined,
        lastName: excludeFields.includes('lastName') ? customer.lastName : undefined,
        identity: excludeFields.includes('identity') ? customer.identity : undefined,
        phone: excludeFields.includes('phone') ? customer.phone : undefined,
        email: excludeFields.includes('email') ? customer.email : undefined,
        avatar: (excludeFields.includes('avatar') && customer.avatar) ? HOST + "/" + UPLOAD_CUSTOMER_DIR + customer._id + "/" + customer.avatar : undefined,
        address: excludeFields.includes('address') ? customer.address : undefined,
        point: excludeFields.includes('point') ? customer.point : undefined,
        createAt: excludeFields.includes('createAt') ? customer.createAt : undefined,
        updateAt: excludeFields.includes('createAt') ? customer.updateAt : undefined
    }
}

router.get(GET_ONE_CUSTOMER, AdminMiddleware, async (req, res) => {
    const {customerId} = {...req.body, ...req.query}

    if(!checkRequiredInput(customerId))
        return res.status(422).send("Customer identity is required!")
    
    try
    {
        const customer = await Customer.findById(customerId)
        if(!customer)
            return res.status(422).send("Customer dosen't exists!")

        res.send(getCustomerSchema(customer))
    }
    catch(error)
    {
        return res.status(422).send(error.message)
    }
})

router.get(GET_LIST_CUSTOMER, AdminMiddleware, async (req, res) => {
    const params = {...req.body, ...req.query}
    try
    {
        const customers = await Customer.find(params)
        const list = customers.map(customer => {
            return getCustomerSchema(customer)
        })
        res.send(list)
    }
    catch(error)
    {
        return res.status(422).send(error.message)
    }
})

router.post(ADD_CUSTOMER, AdminMiddleware, async (req, res) => {
    const {branchId, firstName, lastName, phone, email, address} = req.body

    if(!checkRequiredInput(branchId) || !checkRequiredInput(firstName))
        return res.status(422).send("Branch identity and first name customer is required!")
    
    let customerInsert = null
    try
    {
        const objectInsert = {
            branchId: mongoose.Types.ObjectId(branchId),
            firstName,
            lastName: checkRequiredInput(lastName) ? lastName : undefined,
            identity: (await generateIdentity(branchId)).toString(),
            phone: checkRequiredInput(phone) ? phone : undefined,
            email: checkRequiredInput(email) ? email : undefined,
            address: checkRequiredInput(address) ? address : undefined
        }

        customerInsert = new Customer(objectInsert)
        await customerInsert.save()
        if(req.files && req.files.avatar)
        {
            const avatar = req.files.avatar
            const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            const fileName = uniquePreffix + '-' + avatar.name
            await avatar.mv(getCustomerDataUploadDir(customerInsert._id) + fileName, (err) => {
                if(err) console.log("Upload avatar failed!")
            })
            await Customer.findOneAndUpdate({branchId, identity}, {avatar: fileName})
        }
    }
    catch(error)
    {
        return res.status(422).send(error.message)
    }

    if(checkRequiredInput(email))
    {
        sendMailJob.add(
            {
                receiver: email,
                subject: "Your are welcome you to Royal Billiards City!", 
                options: { type: 2, data: { customerName: checkRequiredInput(lastName) ? firstName + ' ' + lastName : firstName } }
            }
        )
    }
    const customerInfors = await Customer.findById(customerInsert._id)
    res.send({status: 'ok', infors: getCustomerSchema(customerInfors)})
})

router.put(UPDATE_CUSTOMER, AdminMiddleware, async (req, res) => {
    const {customerId, branchId, firstName, lastName, phone, email, address} = {...req.body, ...req.query}

    if(!checkRequiredInput(customerId))
        res.status(422).send("Customer identity is required!")

    new Promise(async (resolve, reject) => {
        await Customer.findById(customerId).exec().then(async doc => {
            if(!doc) return res.status(422).send("Customer dosen't exists!")

            if(checkRequiredInput(branchId))
                doc.branchId = branchId
            if(checkRequiredInput(firstName))
                doc.firstName = firstName
            if(typeof lastName !== 'undefined')
                doc.lastName = lastName
            if(typeof phone !== 'undefined')
                doc.phone = phone
            if(typeof address !== 'undefined')
                doc.address = address
            if(typeof email !== 'undefined')
                doc.email = email

            if(req.files && req.files.avatar)
            {
                const avatar = req.files.avatar
                const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                const fileName = uniquePreffix + '-' + avatar.name
                await avatar.mv(getCustomerDataUploadDir(doc._id) + fileName, err => {
                    if(err) 
                        console.log("Upload avatar failed!")
                })
                if(doc.avatar)
                {
                    const filePath = getCustomerDataUploadDir(doc._id) + doc.avatar
                    fs.access(filePath, error => {
                        if(error)
                            console.log(error)
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
        }).catch(error => 
        {
            return reject(error)
        })
    }).then(async val => {
        const customerInfors = await Customer.findById(customerId)
        res.send({status: 'ok', infors: getCustomerSchema(customerInfors)})
    }).catch(err => {
        return res.status(422).send(err.message)
    })
})

router.delete(DELETE_CUSTOMER, AdminMiddleware, async (req, res) => {
    const {customerId} = {...req.body, ...req.query}

    if(!checkRequiredInput(customerId))
        return res.status(422).send("Customer identity is required!")
    
    new Promise(async (resolve, reject) => {
        await Customer.findById(customerId, {_id: 1}).exec().then(async doc => {
            if(!doc) return res.status(422).send("Customer dosen't exists!")

            const session = await Customer.startSession()
            await session.withTransaction(async () => {
                await Customer.findByIdAndDelete(doc._id, {session})
                await Bill.deleteMany({customerId: doc._id}, {session})
                const customerDataDir = getCustomerDataUploadDir(doc._id)
                fs.rmdir(customerDataDir, { recursive: true }, error => {
                    if(error)
                        console.log(error)
                    else
                        console.log("Deleted customer dirctory successed!")
                })
            }).then(val => {
                return resolve(true)
            }).catch(err => {
                return reject(err)
            })
            session.endSession()
        }).catch(error => {
            return reject(error)
        })
    }).then(val => {
        res.send({status: "ok"})
    }).catch(error => {
        return res.status(422).send(error.message)
    })
})

module.exports = router