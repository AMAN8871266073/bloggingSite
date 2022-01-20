const { findOne } = require('../models/authorModel')
const authorModel = require('../models/authorModel')
const jwt=require('jsonwebtoken')
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
            return res.status(201).send({ status: true, 'message': 'author registered successfully', 'author': author })
        }
    } catch (err) {
        res.status(500).send({ status: false, 'error': err })
    }
}
const login = async function (req, res) {
    try {
        let requestBody = req.body
        isUser = await authorModel.findOne({ email: requestBody.email, password: requestBody.password })
        if(!isUser){
            return res.status(404).send({status:false,'message':'user not found with credentials'})
        }
        let id=isUser._id
        let token=jwt.sign({userId:id},'AmanTandon')
        if(token){
            return res.status(200).send({'token':token})
        }
    } catch (err) {
        return res.status(500).send({ 'error': err })
    }
}


module.exports.createAuthor = createAuthor
module.exports.login = login