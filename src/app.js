import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

// Configrations 
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({
    limit: "20kb"
}))

app.use(express.urlencoded({
    extended: true
}))
app.use(express.static("public"))
app.use(cookieParser())

// basic /api endpoint
app.get("/api",(req,res)=>{
    res.json({
        message:"Backend is live"
    })
})

// routesn import
import userRouter from "./routes/user.routes.js"


// routes declaration
app.use("/api/v1/users",userRouter);

export {app}