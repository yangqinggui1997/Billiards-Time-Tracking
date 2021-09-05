const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const Branch = mongoose.model('Branch')
const Table = mongoose.model('Table')
const User = mongoose.model('User')
const Customer = mongoose.model('Customer')
const Bill = mongoose.model('Bill')
const { GET_ONE_BRANCH_ROUTE, GET_LIST_BRANCH_ROUTE, ADD_BRANCH_ROUTE, UPDATE_BRANCH_ROUTE, DELETE_BRANCH_ROUTE } = require('../constants/branch')
const AdminMiddleware = require('../middlewares/AdminMiddleware')
const { checkRequiredInput } = require('../helpers')

const getBranchSchema = (branch, excludeFields = []) => {
    if(!excludeFields.length)
        return {
            _id: branch._id,
            name: branch.name,
            phone: branch.phone,
            email: branch.email,
            address: branch.address,
            isPrimaryBranch: branch.isPrimaryBranch,
            createdAt: branch.createdAt,
            updatedAt: branch.updatedAt
        }
    return {
        _id: excludeFields.includes("_id") ? undefined : branch._id,
        name: excludeFields.includes("_name") ? undefined : branch.name,
        phone: excludeFields.includes("phone") ? undefined : branch.phone,
        email: excludeFields.includes("email") ? undefined : branch.email,
        address: excludeFields.includes("address") ? undefined : branch.address,
        isPrimaryBranch: excludeFields.includes("isPrimaryBranch") ? undefined : branch.isPrimaryBranch,
        createdAt: excludeFields.includes("createdAt") ? undefined : branch.createdAt,
        updatedAt: excludeFields.includes("updatedAt") ? undefined : branch.updatedAt
    }
}

router.get(GET_ONE_BRANCH_ROUTE, AdminMiddleware, async (req, res) => {
    const { branchId } = {...req.body, ...req.query}
    
    if(!checkRequiredInput(branchId))
        return res.status(422).send("Branch identity is required!")
    try
    {
        const branch = await Branch.findById(branchId)
        if(!branch)
            return res.status(422).send("Branch dosen't exists!")
        res.send(getBranchSchema(branch))
    }
    catch(error)
    {
        return res.status(422).send(error.message)
    }
})

router.get(GET_LIST_BRANCH_ROUTE, AdminMiddleware, async (req, res) => {
    const params = {...req.body, ...req.query}

    try
    {
        const branchs = await Branch.find(params)
        const list = branchs.map(branch => {
            return getBranchSchema(branch)
        })
        res.send(list)
    }
    catch(error)
    {
        return res.status(422).send(error.message)
    }
})

router.post(ADD_BRANCH_ROUTE, AdminMiddleware, async (req, res) => {
    const { name, phone, email, address, isPrimaryBranch } = req.body

    if(!checkRequiredInput(name) || !checkRequiredInput(phone) || !checkRequiredInput(email) || !checkRequiredInput(address))
        return res.status(422).send("Branch name, email, phone, address is required!")
    
    if(typeof isPrimaryBranch !== 'undefined')
    {
        const primaryBranch = await Branch.findOne({isPrimaryBranch: true}, {_id: 1})
        if(primaryBranch)
            return res.status(422).send("Primary branch exist!")
    }
    
    const branch = new Branch({name, phone, email, address, isPrimaryBranch: typeof isPrimaryBranch !== 'undefined' ? true : false})

    try
    {
        const branchNew = await branch.save()
        res.send({status: "ok", infors: getBranchSchema(branchNew)})
    }
    catch(error)
    {
        return res.status(422).send(error.message)
    }
})

router.put(UPDATE_BRANCH_ROUTE, AdminMiddleware, async (req, res) => {
    const {branchId, name, phone, email, address, isPrimaryBranch } = {...req.body, ...req.query}

    if(!checkRequiredInput(branchId)) 
        return res.status(422).send("Branch identity is required!")

    new Promise(async (resolve, reject) => {
        await Branch.findById(branchId).exec().then(async doc => {
            if(!doc) return reject(new Error("Branch dosen't exists!"))
            if(checkRequiredInput(name))
                doc.name = name
            if(checkRequiredInput(phone))
                doc.phone = phone
            if(checkRequiredInput(email))
                doc.email = email
            if(checkRequiredInput(address))
                doc.address = address
            
            if(typeof isPrimaryBranch !== 'undefined')
            {
                const primaryBranch = await Branch.findOne({isPrimaryBranch: true}, {_id: 1})
                if(primaryBranch)
                    return reject(new Error("Primary branch exist!"))
                doc.isPrimaryBranch = true
            }
            await doc.save()
            return resolve(true)
        }).catch(err => {
            return reject(err)
        })
    }).then(async val => {
        const branch = await Branch.findById(branchId)
        res.send({status: "ok", infors: getBranchSchema(branch)})
    }).catch(err => 
    {
        return res.status(422).send(err.message)
    })
})

router.delete(DELETE_BRANCH_ROUTE, AdminMiddleware, async (req, res) => {
    const { branchId } = {...req.body, ...req.query}

    if(!checkRequiredInput(branchId)) 
        return res.status(422).send("Branch identity is required!")

    new Promise(async (resolve, reject) => {
        await Branch.findById(branchId).exec().then(async doc => {
            if(!doc) return reject(new Error("Branch dosen't exists!"))
            
            const session = await Branch.startSession()
            await session.withTransaction(async () => {
                await Branch.findByIdAndDelete(doc._id, {session})
                const customerIds = await Customer.find({branchId: doc._id}, {_id: 1})
                await Table.deleteMany({branchId: doc._id}, {session})
                await User.deleteMany({branchId: doc._id}, {session})
                await Customer.deleteMany({branchId: doc._id}, {session})
                await Promise.all(customerIds.map(async customerId => {
                    await Bill.deleteMany({customerId: customerId._id}, {session})
                }))
                await Bill.deleteMany({branchId: doc._id}, {session})
            }).then(val =>{
                return resolve(true)
            }).catch(err => {
                return reject(err)
            })
            session.endSession()
        }).catch(err => {
            return reject(err)
        })
    }).then(async val => {
        res.send({status: "ok"})
    }).catch(err => 
    {
        return res.status(422).send(err.message)
    })
})

module.exports = router