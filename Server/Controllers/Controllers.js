const express=require('express');
const app=express();
const bodyparser=require('body-parser');
const User=require('../models/UserSchema.js');
const Feedback=require('../models/FeedbackSchema.js');
const Request=require('../models/RequestsSchema');
const bcrypt=require("bcrypt");
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());
// register api
const register=async (req,res)=>{
    const{name,gmail,password,contact,aadhaar,cityname,service,category}=req.body;
    if(!name || !gmail || !password || !contact || !aadhaar || !cityname || !service){
        res.status(400).json("all fields has to be filled");
    }
    else{
        const check=await User.findOne({gmail:gmail});
        if(check){
            res.status(400).json("user already exits");
        }
        else{
            const hashpass=await bcrypt.hash(password,10);
            const newUser= await new User({
                name:name,
                gmail:gmail,
                password:hashpass,
                contact:contact,
                aadhaar:aadhaar,
                cityname:cityname,
                service:service,
                category:category
            });
             newUser.save((err)=>{
                if(err){
                    console.log(err);
                    res.status(400).json(err.message);
                }
                else{
                    res.status(200).json("registered successfully");
                }
            })
        }
    }
}


// login api
const login=async (req,res)=>{
    const{gmail,password,category}=req.body;
    // console.log(category);
    if(!gmail || !password || !category){
        res.status(400).json("all fields has to be filled");
    }
    else if(category==="user"){
        const checkuser= await User.findOne({gmail:gmail,category:category});
        if(!checkuser){
            res.status(400).json("user not registered");
        }
        else{
            verifyuser=await bcrypt.compare(password,checkuser.password);
            if(verifyuser){
                let base=checkuser._id;
                // this generatetoken has been called from userschema
                const token=await checkuser.generatetoken();
                res.cookie("jwttoken",token,{httpOnly:true,expire: 360000 + Date.now()});
                // res.status(200).json(token);
                res.status(200).json("user logged in");
            }else{
                res.status(400).json("invalid creadentials");
            }
        }
    }
    else{
        const findadmin=await User.findOne({gmail:gmail, category:category});
        if(findadmin){
            const verifyadmin= await bcrypt.compare(password,findadmin.password);
            if(verifyadmin){
                const tokens=await findadmin.generateadmintoken();
                // sAVINg cookies
                const token1=await tokens.token1;
                const token2=await tokens.token2;
                res.cookie("jwttoken",token2,{httpOnly:true,expire:360000+Date.now()});
                res.cookie("admin",token1,{httpOnly:true,expire:360000+Date.now()});
                res.json("admin loggedin")
            }
            else{
                console.log("invalid credentials");
                res.status(202).json("invalid credentials");
            }
        }
        else{
            res.status(202).json("admin not found");
        }
    }
}



// feedback api

const feedback=(req,res)=>{
    const{name,gmail,contact,message}=req.body;
    if(!name || !gmail || !contact || !message){
        res.status(400).json("all field are required to send feedback");
    }
    else{
        const newFeedback=new Feedback({
            name:name,
            gmail:gmail,
            contact:contact,
            message:message
        });
        newFeedback.save((err)=>{
            if(err){
                res.status(400).json(err.message);
            }
            else{
                res.status(200).json("feedback sent");
            }
        })
    }
}

// get feedbackdata
const feedbackdata=async (req,res)=>{
    const fdata= await Feedback.find();
    const countx=await Feedback.count();
    if(countx==0){
        res.status(202);
    }
    else{
        res.status(200).json({fdata:fdata,data:false});
    }   
}
// del feed option for admin
const feeddel=async(req,res)=>{
    const feed_id=await req.body._iddel;
    const findfeed=await Feedback.findOneAndDelete({_id:feed_id});
    if(findfeed){
        res.status(200).json("deleted sucessfully");
    }
    else{
        res.status(400).json("unable to del feed");
    }
}


// clearing cookie
const  clearcookie=async (req,res)=>{
    const getadmin= req.cookies.admin;
    const normal= req.cookies.jwttoken;
    if(getadmin){
        res.clearCookie('jwttoken');
        res.clearCookie('admin');
        res.status(200).json("logged out successfully");
    }
    else if(normal){
        res.clearCookie('jwttoken');
    res.status(200).json("logged out successfully");
    }
    else{
        res.status(400).json("no cookie to clear");
    }
     
}

// this check is like authentication for everypage whether they can acces that or not
const check=(req,res)=>{
    const admin=req.adminme;
    const feeds=req.feedbacklist;
    const userslist=req.getuserlist;
    const captain=req.rootuser;
    if(admin&&feeds&&userslist){
        res.status(200).json({admin:true,feeds:feeds,userslist:userslist});
    }
    else{
        res.status(400).json({user:true,admin:false});
    }
}

// senddata for update just get req
const Updateprofile=(req,res)=>{
    res.status(200);
    res.json(req.rootuser);
}

// updating data post request

const updatedata=async(req,res)=>{
    const{name,gmail,contact,cityname,service}=req.body;
    if(!name || !gmail || !contact || !cityname || !service){
        res.json("all fields are required");
    }
    else{
       const usercheck=await User.find({gmail:gmail}).count();
       if(usercheck>1){
        res.json("user already exists with the given mail");
       }
       else{
        // this req.gmail was declared in the middleware here we can access it
        const oldid=req.id;
        const updatevalues= await User.updateOne({_id:oldid},{
            $set:{
                name:name,
                gmail:gmail,
                contact:contact,
                cityname:cityname,
                service:service
            }
        }).then((e)=>{
            if(e){
                res.status(200).json("data updated")
            }else{
                res.status(400).json("unable to update");
            }
        })

       }
    }
}



// citywise mechanic details send
const mechanicofcity=async(req,res)=>{
    const cityname=await req.params.cityname;
    // console.log(cityname);
    const countmechs=await User.find({cityname:cityname,category:"user"}).count();
    if(countmechs===0){
        res.json({message:"no service is availble at your require location",data:false});
        const find=await Request.find({cityname:cityname});
        if(find){
            console.log(cityname +"is already present in the database");
        }
        else{
            const savereq=await new Request({cityname:cityname});
        savereq.save().then((e)=>console.log("saved"));
        }
    }
    else{
        citymechs=await User.find({cityname:cityname,category:"user"})
        res.json({mechs:citymechs,data:true});
        // console.log(citymechs);
    }
    
}


module.exports={register,login,feedback,feedbackdata,check,clearcookie,Updateprofile,mechanicofcity,updatedata,feeddel};