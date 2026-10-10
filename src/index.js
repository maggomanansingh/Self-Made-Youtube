import dotenv from "dotenv/config"
import connectDB from "./db/index.js";
import app from "./app.js";

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`
        ============================
        BACKEND IS LIVE
        ============================
        PORT:${process.env.PORT}
        server : http://localhost:${process.env.PORT}
        ============================`
    )})
})
.catch((err)=>{
    console.log("Mongo db connection failed !!\n",err);
})




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