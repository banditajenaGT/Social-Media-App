const express = require("express")
const { authenticate } = require("../middlewares/middleware")
const { register,
    login,
    followUser,
    logout,
    updatePassword,
    updateProfile,
    deleteProfile,
    myProfile,
    getAllUsers,
    forgotPassword,
    resetPassword, 
    myPosts,
    getUserPosts,
    getUserProfile} = require("../controllers/user")

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/follow/:id").get(authenticate, followUser)
router.route("/update/password").put(authenticate, updatePassword)
router.route("/update/profile").put(authenticate, updateProfile)
router.route("/delete/profile").delete(authenticate, deleteProfile)
router.route("/myprofile").get(authenticate, myProfile)
router.route("/myprofile/posts").get(authenticate,myPosts)
router.route("/userPosts/:id").get(authenticate, getUserPosts)
router.route("/user/:id").get(authenticate, getUserProfile)
router.route("/users").get(authenticate, getAllUsers)
router.route("/forgot/password").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)

module.exports = router