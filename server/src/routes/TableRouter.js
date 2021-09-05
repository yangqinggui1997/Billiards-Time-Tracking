const express = require('express')
const mongoose = require('mongoose')
const router  = express.Router()
const Table = mongoose.model('Table')
const Bill = mongoose.model('Bill')

const getTableSchema = (table, excludeFields = []) => {
    if(!excludeFields.length)
        return {
            _id: table._id,
            branchId: table.branchId,
            number: table.number,
            floor: table.floor,
            prices: table.prices,
            adjustPrices: table.adjustPrices,
            status: table.status,
            description: table.description
        }
    return {
        
    }
}