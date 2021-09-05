const nodemailer = require('nodemailer');
const { HOST, UPLOAD_USER_DIR, UPLOAD_CUSTOMER_DIR } = require('../constants');
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: "duongthanhqui1997@gmail.com",
        pass: "jfqmjdldtjdneoqp"
    }
})

const mailTemplate = options => {
    switch(options.type)
    {
        case 1: // send mail anounce account created successfull
            return "<p>Email: " + options.data.email + "</p>" +
                   "<p>Password: " + options.data.password + "</p>"
        case 2: //welcom customer
            return "<p>Welcome " + options.data.customerName +" to Royal Billiards City</p>" +
                "<p>We ready to serve you, all detail please contact to this phone number: 0325431908 </p>" + 
                "<p>Happy time with Royal Billiards City!</p>"
        default: return ""
    }
}

const sendMail = (receiver, subject, options) => {
    return new Promise((resolve, reject) => {
         transporter.sendMail({
            from: '"Anthony Yang" <duongthanhqui1997@gmail.com>', // sender address
            to: receiver, // list of receivers ex: "a@mail.com, b@mail.com"
            subject: subject, // Subject line
            // text: "", // plain text body
            html: mailTemplate(options), // html body
        }, (error, infor) => {
            if(error) return reject(error)
            return resolve({infor})
        })
    }) 
}

const isNumber = val => {
    return (typeof val !== 'undefined' 
        && typeof val !== 'function' 
        && typeof val !== 'object' 
        && typeof val !== 'symbol' 
        && val !== null
        && val !== '' 
        && +val !== NaN)
}

const getIdNumber = length => {
    var id = ''
    for(var i = 0; i < length; ++i)
        id += '' + Math.floor(Math.random() * 10)
    return id
}

const checkRequiredInput = val => {
    return (val !== '' && val !== null && typeof val !== 'undefined')
} 

const getRoleText = roleCode => {
    switch(roleCode)
    {
        case 0: return 'admin master'
        case 1: return 'admin'
        case 2: return 'manager'
        case 3: return 'staff'
        default: return roleCode
    }
}

const getStatusText = statusCode => {
    switch(statusCode)
    {
        case 0: return 'blocked'
        case 1: return 'signed in'
        case 2: return 'logged out'
        default: return statusCode
    }
}

const getUserFile = (userId, fileName) => {
    return fileName && userId ? HOST + '/' + UPLOAD_USER_DIR + userId + "/" + fileName : ''
}

const isEmptyObject = obj => {
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false
        }
    }
    return true
}

const checkField = field => {
    switch(typeof field)
    {
        case 'undefined':  return undefined
        case 'bigint':
        case 'boolean':
        case 'function':
        case 'number': 
        case 'object': 
        case 'string':
        case 'symbol':
        default: return field
    }
}

const getUserDataUploadDir = userId => {
    return UPLOAD_USER_DIR + userId + "/"
}

const getCustomerDataUploadDir = customerId => {
    return UPLOAD_CUSTOMER_DIR + customerId + "/"
}

module.exports = {
    isNumber,
    sendMail,
    getIdNumber,
    checkRequiredInput,
    getStatusText,
    getRoleText,
    getUserFile,
    isEmptyObject,
    checkField,
    getUserDataUploadDir,
    getCustomerDataUploadDir
}