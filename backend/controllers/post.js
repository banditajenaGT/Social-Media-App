const Post = require("../models/post")
const User = require("../models/user")
const cloudinary = require("cloudinary")


exports.createPost = async (req, res) => {
    try {

        const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
            folder: "posts"
        })

        const post = await Post.create({
            caption: req.body.caption,
            image: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            },
            owner: req.user._id
        })

        const user = await User.findById(req.user._id)
        user.posts.push(post._id)
        await user.save()

        res.status(201).json({ success: true, post, message: "Post Created" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}


exports.likeAndUnlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" })
        }

        if (post.likes.includes(req.user._id)) {

            const index = post.likes.indexOf(req.user._id)
            post.likes.splice(index, 1)
            await post.save()

            return res.status(200).json({ success: true, message: "Post Unliked" })
        } else {
            post.likes.push(req.user._id)
            await post.save()

            return res.status(200).json({ success: true, message: "Post Liked" })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" })
        }

        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: "Unautherized" })
        }

        await cloudinary.v2.uploader.destroy(post.image.public_id)
        await post.deleteOne();

        const user = await User.findById(req.user._id)
        const index = user.posts.indexOf(req.params.id)

        user.posts.splice(index, 1)
        await user.save()

        res.status(200).json({ success: true, message: "Post deleted" })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.getPostFollowing = async (req, res) => {
    try {
        //    const user = await User.findById(req.user._id).populate('followings','posts')
        const user = await User.findById(req.user._id)

        const posts = await Post.find({
            owner: {
                $in: user.followings
            }
        }).populate("owner likes comments.user")

        res.status(200).json({ success: true, followings: user.followings, posts: posts.reverse() })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.updateCaption = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" })
        }

        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: "Unautherized" })
        }

        post.caption = req.body.caption
        post.save()

        res.status(200).json({ success: true, message: "Post updated" })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.addingComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" })
        }
        // let commentIndex = -1
        // post.comments.forEach((item, index) => {
        //     if (item.user.toString() === req.user._id.toString()) {
        //         commentIndex = index
        //     }
        // })
        // if (commentIndex !== -1) {
        //     post.comments[commentIndex].comment = req.body.comment
        //     await post.save()

        //     res.status(200).json({ success: true, message: "Comment updated" })
        // } else {
        post.comments.push({
            user: req.user._id,
            comment: req.body.comment
        })
        await post.save()

        res.status(200).json({ success: true, message: "Comment added" })
        // }



    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" })
        }
        const commentId = req.body.commentId

        if (!commentId) {
            return res.status(400).json({ success: false, message: "Invalid commentId" });
          }
          
          const commentIndex = post.comments.findIndex((comment) => comment._id.toString() === commentId);
          if (commentIndex === -1) {
            return res.status(404).json({ success: false, message: "Comment not found" });
          }
          
          if (post.owner._id.toString() === req.user._id.toString()) {
            post.comments.splice(commentIndex, 1);
            await post.save();
            return res.status(200).json({ success: true, message: "Selected comment deleted" });
          } else {
            if (post.comments[commentIndex].user.toString() === req.user._id.toString()) {
              post.comments.splice(commentIndex, 1);
              await post.save();
              return res.status(200).json({ success: true, message: "Your comment deleted" });
            } else {
              return res.status(403).json({ success: false, message: "Unauthorized to delete this comment" });
            }
          }


    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

