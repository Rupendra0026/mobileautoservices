// dot env
const dotenv=require('dotenv');
dotenv.config();
const express=require('express');
const cors=require('cors');
const app=express();
// mongoose connection
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
mongoose.connect(process.env.databasecnt,({ useNewUrlParser: true, useUnifiedTopology: true })).then(()=>console.log("connected to database")).catch((err)=>console.log(err));


app.use(cors());
app.use(cookieParser());
// calling routes from other file
const routes = require('./Routes/MyRoutes');
app.use(routes);
// using json bcz the data will be recieved as json
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("hello bro");
})

app.listen(4000,()=>console.log("server running"));