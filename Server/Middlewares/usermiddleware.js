const jwt=require('jsonwebtoken');
const User=require('../models/UserSchema.js');
const feedbacklist=require('../models/FeedbackSchema.js');
const usermiddle=async(req,res,next)=>{
    const token= req.cookies.jwttoken;
    const admintoken=req.cookies.admin;
    if(token&&admintoken){
        const verifyadmin=await jwt.verify(token,process.env.secretkey);
        const verifyadminkey=await jwt.verify(admintoken,process.env.adminkey);
        if(verifyadmin&&verifyadminkey){
            const adminid=await verifyadmin._id;
            const findadmin=await User.findOne({_id:adminid});
            const feeds=await feedbacklist.find();
            const users=await User.find({category:"user"});
            req.rootuser=findadmin;
            req.adminme=findadmin;
            req.id=findadmin._id;
            req.getuserlist=users;
            req.feedbacklist=feeds;
            next();
        }
        else{
            res.status(400).json("not authorised");
        }
    }
    else if(token){
        const verfiyuser= await jwt.verify(token,process.env.secretkey);
        const id=await verfiyuser._id;
        const finddata= await User.findOne({_id:id,"tokens.tokens":token});
        req.gotname=finddata.name;
        req.rootuser=finddata;
        req.id=finddata._id;
        // res.json(id);
        next();
    }
    else{
        res.status(400).json("not authorised");
    }   
}
module.exports={usermiddle};