const User = require("../models/user")
const Post = require("../models/post")
const { sendEmail } = require("../middlewares/sendEmail")
const crypto = require("crypto")
const cloudinary = require("cloudinary")

exports.register = async (req, res) => {
    try {
        const { avatar, name, email, password } = req.body
        let user = await User.findOne({ email }).populate("posts followers followings")
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        const myCloud = await cloudinary.v2.uploader.upload(avatar, { folder: "avatars" })

        user = await User.create({
            name,
            email,
            password,
            avatar: { public_id: myCloud.public_id, url: myCloud.secure_url }
        })

        const token = await user.generateToken()

        res.status(200).cookie('token', token, {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
            // secure: true,
            // sameSite:None
        }).json({ success: true, user, message: "Registered Successfully" })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        let user = await User.findOne({ email }).populate("posts followers followings")
        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exists" })
        }
        const isMatch = await user.matchPassword(password)
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect password" })
        } 

        const token = await user.generateToken()

        res.status(200).cookie('token', token, {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }).json({ success: true, user, message:"Logged in Successfully" })


    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.logout = async (req, res) => {
    try {

        res.status(200).cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        }).json({ success: true, message: "Logged out" })


    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id)
        const loggedinUser = await User.findById(req.user._id)

        if (!userToFollow) {
            return res.status(404).json({ success: false, message: "User does not exists" })
        }

        if (loggedinUser.followings.includes(userToFollow._id)) {

            const indexOfFollowing = loggedinUser.followings.indexOf(userToFollow._id)
            loggedinUser.followings.splice(indexOfFollowing, 1)

            const indexOfFollower = userToFollow.followers.indexOf(loggedinUser._id)
            userToFollow.followers.splice(indexOfFollower, 1)

            await loggedinUser.save()
            await userToFollow.save()
            res.status(200).json({ success: false, message: "User unfollowed" })

        } else {
            loggedinUser.followings.push(userToFollow._id)
            userToFollow.followers.push(loggedinUser._id)

            await loggedinUser.save()
            await userToFollow.save()

            res.status(200).json({ success: true, message: "User followed" })

        }


    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const { oldPassword, newPassword } = req.body

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: true, message: "Please provide required data" })
        }

        const isMatch = await user.matchPassword(oldPassword)
        if (!isMatch) {
            return res.status(400).json({ success: true, message: "Old password is not matching" })
        }

        user.password = newPassword;
        await user.save()

        res.status(200).json({ success: true, message: "Password updated" })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const { avatar, name, email } = req.body
        if (avatar) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id)
            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                folder: "avatars"
            })
            user.avatar.public_id = myCloud.public_id
            user.avatar.url = myCloud.secure_url;
        }
        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }

        await user.save()

        res.status(200).json({ success: true, message: "Profile updated" })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.deleteProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const userId = req.user._id
        const posts = user.posts

        //Removing data from cloudinary
        await cloudinary.v2.uploader.destroy(user.avatar.public_id)

        await user.deleteOne()


        //deleting all posts of user
        for (let i = 0; i < posts.length; i++) {
            const post = await Post.findById(posts[i]);
            await cloudinary.v2.uploader.destroy(post.image.public_id)
            await post.deleteOne()
        }

        //removing user from following list of follower
        for (let i = 0; i < user.followers.length; i++) {
            const follower = await User.findById(user.followers[i])

            const index = follower.followings.indexOf(userId)
            follower.followings.splice(index, 1)
            await follower.save()
        }

        //removing user from follower list of following
        for (let i = 0; i < user.followings.length; i++) {
            const following = await User.findById(user.followings[i])

            const index = following.followers.indexOf(userId)
            following.followers.splice(index, 1)
            await following.save()
        }

        //removing user from others comment card
        const allPosts = await Post.find()

        for (let i = 0; i < allPosts.length; i++) {
            const post = await Post.findById(allPosts[i]._id)

            for (let i = 0; i < post.comments.length; i++) {
                const comment = post.comments[i]
                if (comment.user._id === userId) {
                    post.comments.splice(i, 1)
                }
            }
            await post.save()
        }

        //removing user from others likes array
        for (let i = 0; i < allPosts.length; i++) {
            const post = await Post.findById(allPosts[i]._id)

            for (let i = 0; i < post.likes.length; i++) {
                const like = post.comments[i]
                if (like._id === userId) {
                    post.likes.splice(i, 1)
                }
            }
            await post.save()
        }

        //logout user after deleting profile
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        }).json({ success: true, message: "Profile deleted" })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.myProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('posts followers followings')
        res.status(200).json({ success: true, user })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('posts followers followings')
        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exists" })
        }

        res.status(200).json({ success: true, user })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ name: { $regex: req.query.name, $options: "i" } })

        res.status(200).json({ success: true, users })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exists" })
        }
        const resetPasswordToken = await user.getResetToken()

        await user.save()

        const resetUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetPasswordToken}`
        const message = `Reset your password by clicking on the link below:\n\n${resetUrl}`

        try {
            await sendEmail({
                email: user.email,
                subject: "Reset Password",
                message
            })

            res.status(200).json({ success: true, message: `Email sent to ${user.email}` })
        } catch (error) {
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined

            user.save()
            res.status(500).json({ success: false, message: error.message })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(401).json({ success: false, message: "Token is invalid or expired" })
        }
        user.password = req.body.password

        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save()

        return res.status(200).json({ success: true, message: "Password updated successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.myPosts = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const posts = []

        for (let i = 0; i < user.posts.length; i++) {
            const post = await Post.findById(user.posts[i]).populate(
                "likes comments.user owner"
            )
            posts.unshift(post)
        }

        res.status(200).json({ success: true, posts })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.getUserPosts = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const posts = []

        for (let i = 0; i < user.posts.length; i++) {
            const post = await Post.findById(user.posts[i]).populate(
                "likes comments.user owner"
            )
            posts.unshift(post)
        }

        res.status(200).json({ success: true, posts })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

