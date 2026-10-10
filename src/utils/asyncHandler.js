const asyncHandler = (requestHandler)=>{
    Promise.resolve(requestHandler(req,res,next)).catch((err)=>{})
}

export default asyncHandler



// const asyncHandler = (fn)=> async (req,res , next)=>{
//     try {
//         await fn(req,res,next )
//     } catch (error) {
//         res.status(500).json({
//             success:false,
//             message:"failed to async" 
//         })
//     }
// }