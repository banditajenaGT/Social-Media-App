const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const crypto=require("crypto")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: [true, "Email Already Exists"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minlength: [5, "Password Must Be Atleast 5 Characters"]
    },
    avatar: {
        public_id: String,
        url: String
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    followings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    resetPasswordToken:String,
    resetPasswordExpire:Date
})

userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

userSchema.methods.matchPassword=async function (password) {
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateToken=async function () {
    return jwt.sign({_id:this._id},process.env.SECRETE_KEY)
}

userSchema.methods.getResetToken=async function () {
   const resetToken=crypto.randomBytes(20).toString("hex")

   this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex")     //toString = digest
   this.resetPasswordExpire=Date.now()+10*60*1000

   return resetToken
}

module.exports = mongoose.model("user", userSchema)