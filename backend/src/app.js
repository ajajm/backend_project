import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config({
    path: "./src/.env" 
});

console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);
const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,

}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded());
app.use(express.static("Public")); //pulic assets to store here
app.use(cookieParser());

// Roures import
import userRouter from "./routes/user.routes.js";

// Router declaration
app.use("/api/v1/user", userRouter)    //https://xyz/api/v1/user/




export { app }