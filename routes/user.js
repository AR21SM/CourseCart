const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const jwt=require("jsonwebtoken");
const {JWT_SECRET} =require("../config")

router.post('/signup', (req, res) => {

    const username=req.body.username
    const password=req.body.password

    User.create({
        username,
        password
    })

    res.json({
        message: 'User created successfully' 
    })
});

router.post('/signin', async(req, res) => {

    const {username,password}=req.headers;
    const userhai =await User.findOne({
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

router.get('/courses', async(req, res) => {
    
    const allcourses=await Course.find({})
    res.json({
        "courses":allcourses
    })

});

router.post('/courses/:courseId', userMiddleware,async (req, res) => {
    
    const courseId=req.params.courseId
    const username=req.username;
       
    await User.updateOne({
        username
    },{
       "$push":{
        purchasedCourses:courseId, 
       }
    })

    res.json({
        message:"Purchase completed :) "
    })


});

router.get('/purchasedCourses', userMiddleware,async (req, res) => {

    const username=req.username;
    const user=await User.findOne({
        username
    })

    const allusercourses=await Course.find({
        _id:{
            "$in":user.purchasedCourses
        }
    })

    res.json({
        courses:allusercourses
    })

});

module.exports = router