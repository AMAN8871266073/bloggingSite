const authorModel = require('../models/authorModel')

isValidEmail = function (email) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
}

const createAuthor = async function (req, res) {
    try {
        requestBody = req.body
        if (!(isValidEmail(requestBody.email))) {
            return res.status(400).send({ status: false, 'message': 'invalid email id' })
        }
        isEmailAlreadyExist = await authorModel.findOne({ email: requestBody.email })
        if (isEmailAlreadyExist) {
            return res.status(400).send({ status: false, 'message': 'email already registered' })
        }
        author = await authorModel.create(requestBody)
        if (author) {
            return res.status(201).send({ status: true, 'message': 'author registered successfully','author':author })
        }
    } catch (err) {
        res.status(500).send({ status: false, 'error': err })
    }
}



module.exports.createAuthor = createAuthor