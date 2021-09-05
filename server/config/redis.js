const Redis = require('ioredis')

const PORT = process.env.REDIS_PORT
const HOST = process.env.REDIS_HOST
const client = new Redis(PORT, HOST)
const subscriber = new Redis(PORT, HOST)

const opts = {
    createClient(type) {
        switch (type) {
            case "client":
                return client
            case "subscriber":
                return subscriber
            default:
                return new Redis(PORT, HOST)
        }
    },
}

module.exports = opts