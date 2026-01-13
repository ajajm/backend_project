import dotenv from 'dotenv';
import connectDB from "./db/database.db.js";
import { app } from "./app.js"

dotenv.config({
    path: "./src/.env" 
});

await connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running at PORT : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("Mongo db connection failed !!", err);
});
    

  







// import express from "express";
// const app = express()
//execute immediately, emmet function
// ;( async () => {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//         app.on("error", () => {
//             console.log("Error: unable to handshake", error);
//             throw err
//         })
//         app.listen(process.env.PORT, () => {
//             console.log(`App is listening on PORT: ${process.env.PORT}`);
            
//         })
//     } catch(error){
//         console.log("ERROR:", error);
//         throw err
        
//     }
// })()