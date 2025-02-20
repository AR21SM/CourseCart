const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course, User } = require("../db");
const router = Router();
const jwt=require("jsonwebtoken");
const {JWT_SECRET} =require("../config")

router.post('/signup', (req, res) => {
   
    const username=req.body.username;
    const password=req.body.password;
    Admin.create({
        username,
        password,
    })

    .then(function(){
        res.json({
            message: 'Admin created successfully' 
    })   
    }) 
});

router.post('/signin', async(req, res) => {
    
    
    const { username, password } = req.headers
    const userhai =await Admin.findOne({
        username,
        password
    })

    if(userhai){
        const token=jwt.sign({
            username
        },JWT_SECRET)

        res.json({
            token
        })
    }
    else{
        res.status(411).json({
            msg:"Invalid username and password"
        })
    }   
});

router.post('/courses', adminMiddleware, async(req, res) => {
  
    try{

        const title=req.body.title
        const description=req.body.description
        const imageLink=req.body.imageLink
        const price=req.body.price
    
        if (!title || !description || !imageLink || !price) {
            return res.status(400).json({ msg: "All fields are required" });
        }
    
        const newcourse=await Course.create({
            title,
            description,
            imageLink,
            price
        })
    
        res.json({
            msg:'Course created successfully', courseId:newcourse._id
        })
    }
    catch(err){
        console.error("Error creating course:", err);
        res.status(500).json({ msg: "Internal Server Error", error: err.message });
    }
});

router.get('/courses', adminMiddleware,async (req, res) => {
   
    const allcourse=await Course.find({})

    res.json({
        courses:allcourse
    }) 
});

module.exports = router;