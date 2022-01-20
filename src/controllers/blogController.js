const authorModel = require('../models/authorModel')
const blogModel = require('../models/blogModel')

//***************************createBlog********************************************
const createBlog = async function (req, res) {
    try {
        let requestBody = req.body
        let tagStr = requestBody.tags.trim()
        let tagArr = tagStr.split(',').map(x => x.trim())

        let catStr = requestBody.category.trim()
        let catArr = catStr.split(',').map(x => x.trim())

        let subCatStr = requestBody.subcategory.trim()
        let subCatArr = subCatStr.split(',').map(x => x.trim())

        isAuthorExist = await authorModel.findById({ _id: requestBody.authorId })
        if (!isAuthorExist) {
            return res.status(404).send({ status: false, 'message': 'Author doesnot exist with given id' })
        }
        let blogObj = {
            title: requestBody.title,
            body: requestBody.body,
            authorId: requestBody.authorId,
            tags: tagArr,
            category: catArr,
            subcategory: subCatArr,
        }

        let blog = await blogModel.create(blogObj)
        if (blog) {
            return res.status(201).send({ status: true, 'blog': blog })
        }
    } catch (err) {
        return res.status(500).send({ status: false, 'error': err })
    }
}
//********************************* Blog List*********************************
const blogList = async function (req, res) {
    try {
        let filter = { isDeleted: false, isPublished: true }
        let query = req.query
        const { authorId, tag, category, subcategory } = query
        if (authorId) {
            filter['authorId'] = authorId
        }
        if (tag) {
            filter['tags'] = tag
        }
        if (category) {
            filter['category'] = category
        }
        if (subcategory) {
            filter['subcategory'] = subcategory
        }
        let list = await blogModel.find(filter)
        if (!(list.length > 0)) {
            return res.status(404).send({ status: false, 'message': 'document not found' })
        }
        return res.status(200).send({ status: true, 'list': list })
    } catch (err) {
        return res.status(500).send({ status: false, 'error': err })
    }
}
//********************************update blog**************************************

const updateBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        let isBlogExist = await blogModel.findOne({ _id: blogId })
        if (!isBlogExist) {
            return res.status(404).send({ status: false, 'message': 'blog doesnot exist with given id' })
        }
        let authorId=isBlogExist.authorId
        let userId=req.userId
        if(!(authorId==userId)){
            return res.status(403).send("authentication failed")
        }
        let requestBody = req.body
        const { title, body, tags, subcategory } = requestBody
        if (title) {
            isBlogExist.title = title
        }
        if (body) {
            isBlogExist.body = body
        }
        if (tags) {
            isBlogExist.tags.push(tags)
        }
        if (subcategory) {
            isBlogExist.subcategory.push(subcategory)
        }
        let updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, isBlogExist, { new: true })
        if (updatedBlog) {
            return res.status(200).send({ status: true, 'blog': updatedBlog })
        }
    } catch (err) {
        return res.status(500).send({ 'error': err })
    }
}
//***************************** Delete blog************************************
const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        let isBlogExist = await blogModel.findOne({ _id: blogId, isDeleted: false })
        if (!isBlogExist) {
            return res.status(404).send({ status: false, 'message': 'document not found' })
        }
        let authorId=isBlogExist.authorId
        let userId=req.userId
        if(!(authorId==userId)){
            return res.status(403).send("authentication failed")
        }
        let date = new Date()
        let doc = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { isDeleted: true, deletedAt: date })
        if (doc) {
            return res.status(200).send({ status: true, 'message': 'document deleted successfully' })
        }
    } catch (err) {
        return res.status(500).send({ status: false, 'error': err })
    }
}


//****************************** Delete Blog by query*******************
const deleteBlogByQuery = async function (req, res) {
    try {
        let query = req.query
        let userId=req.userId
        let { authorId, category, tag, subcategory, published } = query
        let filter = { isDeleted: false }
        if (authorId) {
            filter['authorId'] = authorId
        }
        if(!(authorId==userId)){
            return res.status(403).send("authentication failed")
        }
        if (category) {
            filter['category'] = category
        }
        if (tag) {
            filter['tags'] = tag
        }
        if (subcategory) {
            filter['subcategory'] = subcategory
        }
        if (published) {
            filter['isPublished'] = false
        }
        date = new Date()
        let deleteDoc = await blogModel.find(filter).updateMany({ isDeleted: true, deletedAt: date })
        if (deleteDoc) {
            return res.status(200).send({ status: true, 'message': 'doc deleted successfully' })
        }
        return res.status(404).send({ status: false, 'message': 'document not found' })
    } catch (err) {
        return res.status(500).send({ status: false, 'error': err })
    }
}
//******************************************************************************************



module.exports.createBlog = createBlog
module.exports.blogList = blogList
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogByQuery = deleteBlogByQuery