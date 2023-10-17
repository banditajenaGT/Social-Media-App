const express = require("express")
const { createPost,
    likeAndUnlikePost,
    deletePost,
    getPostFollowing,
    updateCaption,
    addingComment,
    deleteComment,
    editComment } = require("../controllers/post")
const { authenticate } = require("../middlewares/middleware")

const router = express.Router()

router.route("/post/upload").post(authenticate, createPost)
router.route("/post/:id")
    .get(authenticate, likeAndUnlikePost)
    .put(authenticate, updateCaption)
    .delete(authenticate, deletePost)
router.route("/posts").get(authenticate, getPostFollowing)
router.route("/post/comment/:id").post(authenticate, addingComment)
router.route("/post/comment/delete/:id").post(authenticate, deleteComment)


module.exports = router