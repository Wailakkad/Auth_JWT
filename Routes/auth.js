const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const connection = require("../DB/DB.js");
require("dotenv").config();




router.post("/Register" , async(req,res)=>{
    try{
        const {fullname , email , password }= req.body;
        const db = await connection();
        const [rows] = await db.query("select * from users where email = ?" , [email])
        if(rows.length > 0){
            res.status(500).json({
                message : "thsi email is already exists , trt another email"
            })
        }
        else{
            const hashpassword = await bcrypt.hash(password,10)
            await db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [fullname, email, hashpassword]);
            res.status(201).json({
            message : "user created seccussfuly"
        })
        }
    }catch(err){
        console.log(err)
    }
})

router.post("/Login" , async(req,res)=>{
    try{
        const { email , password }= req.body;
        const db = await connection();
        const [rows] = await db.query("select * from users where email = ?" , [email])
        if(rows.length === 0){
            return res.status(401).json({
                message : "the email user is not exist"
            })
        }
        
        const checkpassword = await bcrypt.compare(password,rows[0].password)
        if(!checkpassword){
                  return res.status(401).json({
                    message : "password is not correct"
                })
        } 
        const token = await jwt.sign({id : rows[0].id , role : rows[0].role} , process.env.SECRET_KEY , {expiresIn : '3h'})
        res.status(202).json({
            message : "login seccussfuly",
            token : token
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "An error occurred during login"
        });
    }
})

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(' ')[1]; 
    
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY); 
        req.user = decoded;
        console.log(req.user.id)
        console.log(req.user.role) /
        next(); 
    } catch (err) {
        console.error(err); 
        return res.status(400).json({ message: "Invalid token." }); 
    }
};

const verifyRole = (Role)=>{
    return(req , res , next)=>{
        if(req.user.role !== Role){
            return res.status(500).json({
                message : "this role his not acces to this service"
            })
        }
        next()
    }

}

router.get("/User_info", verifyToken , verifyRole("admin"),async(req , res)=>{
    try{
        const userId = req.user.id;
        const db = await connection();
        const [rows] = await db.query("select * from users where id = ?",[userId]);
        if(rows.length === 0){
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({  message : "Welcome User to your dashbord" , user : rows });

    }catch(err){

    }
})


module.exports = router;