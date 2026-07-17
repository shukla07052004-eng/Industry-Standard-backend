// another syntax fpr same functonality
const asyncHandler = (requestHandler) =>
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err));
    }; // yaha pe sir ne return karwake server run kiya lekin ap ne apne se he bina return likhe db connect karwa deya aur server cahane laga esko find kariye aisa kyo


export {asyncHandler}

// we create a wrapper function that we are going to use further
// const asyncHandler = (fn) => async (req, res, next) => {
//     try{
//         await fn(req, res, next)
//     } catch(error){
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message || "Internal Server Error"
//         })
//     }
// }