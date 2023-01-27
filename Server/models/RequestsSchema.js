const mongoose=require('mongoose');
const Request=new mongoose.Schema({
    cityname:{
        type:"string",
        lowercase:true
    },
    count:{
        type:"number",
        default:0
    }
});
module.exports= mongoose.model("requests",Request);