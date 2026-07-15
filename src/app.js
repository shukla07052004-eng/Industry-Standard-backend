import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();


// read about all the options from doumentation of cors package
app.use(cors({
    origin: process.env.CORS_ORGIN,
    Credential: true
}))

// when data is coming in json have more research on it
app.use(express.json({
    limit: "16kb"
}));

// when data is coming in urlencoded have more research on it
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

// configuration for those assets which in public(like images, videos and others) folder, so that we can access them directly from the browser without any route
app.use(express.static('public')); 
app.use(cookieParser());


// routes import

import userRouter from  "./routes/user.router.js"

// routed declaration
app.use("/api/v1/users", userRouter) // read about v1 and v2 satandard practice for url

export { app }