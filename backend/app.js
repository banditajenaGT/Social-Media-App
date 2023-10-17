const express=require("express")
const post =require("./routes/post")
const user=require("./routes/user")
const cookieParser=require('cookie-parser') 
const cors=require("cors")
const {connectDatabase}=require('./config/database')
const cloudinary=require('cloudinary')
const path=require('path')

const app=express()

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({path:"backend/config/config.env"})
}

connectDatabase()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use(cookieParser())
app.use(cors({credentials:true,origin:"http://localhost:3000"}))
app.use(express.json())


app.use("/api/v1",post)
app.use("/api/v1",user)

app.use(express.static(path.join(__dirname,"../frontend/build")))
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"))
})

app.listen(process.env.PORT, () => {
    console.log(`backend listening at http://localhost:${process.env.PORT}`)
  })
