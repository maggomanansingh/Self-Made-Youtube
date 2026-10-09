
import express from "express"
import dotenv from "dotenv/config"
import connectDB from "./db/index.js";


connectDB();





// iffy approach
/* OLD METHOD
const app = express()
;(async ()=>{
    try{
       await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
       app.on("error",(err)=>{
           console.log("ERROR in talking to db",err)
       })

       app.listen(process.env.PORT,()=>{
        console.log(`
        ============================
        BACKEND IS LIVE
        ============================
        PORT:${process.env.PORT}
        server : http://localhost:${process.env.PORT}
        ============================
        `);
        
       })

    }catch(err){
        console.log("ERROR",err)
    }
})

*/