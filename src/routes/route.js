const express=require('express')
const router=express.Router()
const authorController=require('../controllers/authorController')
const blogController=require('../controllers/blogController')
const authorAuth=require('../middlewares/authorAuth')

router.post('/authors',authorController.createAuthor)
router.post('/login',authorController.login)
//****************************************************************//
router.post('/blogs',authorAuth.authorAuth,blogController.createBlog)
router.get('/blogs',authorAuth.authorAuth,blogController.blogList)
router.put('/blogs/:blogId',authorAuth.authorAuth,blogController.updateBlog)
router.delete('/blogs/:blogId',authorAuth.authorAuth,blogController.deleteBlog)
router.delete('/blogs',authorAuth.authorAuth,blogController.deleteBlogByQuery)
 






module.exports=router