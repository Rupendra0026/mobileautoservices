const mongoose=require('mongoose');
const validator=require('validator');
const express=require('express');
const jwt=require("jsonwebtoken");
const UserSchema=new mongoose.Schema({
    name:{
        type:"String",
        required:[true,"name has to be filled"]
    },
    gmail:{
        type:"String",
        required:[true,"gmail has to be filled"],
        unique:true,
        validate:[validator.isEmail,"email is not valid"],
    },
    password:{
        type:"string",
        required:[true,"password is compulsory"],
        minlength:[8,"min length has to be 8"],
    },
    contact:{
        type:"String",
        required:[true,"contact num is needed"],
        minLength:[10,"enter valid contact num"],
        maxLength:[10,"enter valid contact num"]
        
    },
    aadhaar:{
        type:"String",
        required:[true,"aadhaar num is needed"],
        minLength:[12,"min 12 aadhaar number"],
        maxLength:[12,"min 12 aadhaar number"]
    },
    cityname:{
        type:"String",
        lowercase:true,
        required:[true,"city is name is needed"],
    },
    service:{
        type:"String",
        required:[true,"service has to be mentioned"]
    },
    category:{
        type:"String",
        default:"user"
    },
    requests:[
        {
            name:{
                type:"string",
            },
            gmail:{
                type:"string",
            },
            contact:{
                type:"string",
            },
            issue:{
                type:"string",
            }
        }
    ],
    tokens:[
        {
            token:{
            type:"String",
            },
            admintoken:{
                type:"String",
            }
        }
    ]
});
UserSchema.methods.generatetoken=async function(){
    try{
        let tokengen=jwt.sign({_id:this._id},process.env.secretkey);
        this.tokens=this.tokens.concat({token:tokengen});
        await this.save();
        return tokengen;
    }
    catch(err){
        console.log(err);
    }
}
UserSchema.methods.generateadmintoken=async function(){
    try{
        let token1=jwt.sign({_id:this._id},process.env.adminkey);
        let token2=jwt.sign({_id:this._id},process.env.secretkey);
        this.tokens=await this.tokens.concat({token:token2,admintoken:token1});
        this.tokens=this.tokens.concat({token:token1,admintoken:token2});
        await this.save();
        return ({token1,token2});
    }catch(err){
        console.log(err);
    }
}
const User=mongoose.model("userdata",UserSchema)
module.exports=User;