import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,

}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded());
app.use(express.static("Public")); //pulic assets to store here
app.use(cookieParser());




export { app }