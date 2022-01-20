const jwt = require('jsonwebtoken')

const authorAuth = function (req, res, next) {
    try {
        const token = req.headers['x-api-key']
        if (!token) {
            return res.status(400).send('token is required')
        }
        let decoded = jwt.verify(token,'AmanTandon')
        if (decoded) {
            req.userId = decoded.userId
            next()
            return
        }
        return res.status(403).send( "Authorization failed")
    } catch (err) {
        return res.status(500).send({ 'error': err })
    }
}

module.exports.authorAuth =  authorAuth 