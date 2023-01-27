const mongoose=require('mongoose');
const validator=require('validator');

const Feedback=new mongoose.Schema({
    name:{
        type:"String",
        require:[true,"name is required"]
    },
    gmail:{
        type:"String",
        require:[true,"gmail is required"],
        validate:[validator.isEmail,"gmail is not valid"]
    },
    contact:{
        type:"String",
        required:[true,"contact num is required"],
        minLength:[10,"enter valid contact num"],
        maxLength:[10,"enter valid contact num"]
        
    },
    message:{
        type:"String",
        required:[true,"please add the message to submit feedback"]
    }
}) 

module.exports=mongoose.model("feedback",Feedback);