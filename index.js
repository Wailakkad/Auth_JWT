const express = require("express")
 
const authRouter = require("./Routes/auth.js");
require("dotenv").config();
const app = express();


app.use(express.json())
app.use("/app/api" , authRouter);
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})