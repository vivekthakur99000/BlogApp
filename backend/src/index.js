import dotenv from "dotenv";
import connectDB from "./db/index.js";
import express from "express"
import blogRoutes from "./routes/BlogRoutes.js"

dotenv.config({
    path: './.env'
});

const app = express();

app.use('/blog', blogRoutes);




connectDB().then(()=>{
    app.listen(3000, () => {
        console.log(`Server is running on port : ${process.env.PORT}`);
    })
}).catch((err)=> 
    {console.log("MongoDB connection failed !!!", err);}
)
