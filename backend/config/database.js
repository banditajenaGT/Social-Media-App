const mongoose=require("mongoose")

exports.connectDatabase=()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then((con)=>{
        console.log("MongoDB connected successfully : "+con.connection.host)
    }).catch((err)=>{
        console.log(err)
    })
}