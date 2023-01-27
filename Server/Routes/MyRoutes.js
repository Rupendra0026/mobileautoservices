const express=require('express');
const router=express.Router();
const cookieParser=require('cookie-parser');
const mongoose=require('mongoose');
// const bodyparser=require('body-parser');
const {register,login,feedback,feedbackdata,check,clearcookie,Updateprofile,updatedata,mechanicofcity,feeddel
}=require('../Controllers/Controllers.js');
const {usermiddle}=require('../Middlewares/usermiddleware.js')
router.use(express.json());
router.use(cookieParser());





router.post('/getregister',register);
router.post('/loginuser',login);
router.post('/updateprofile',usermiddle,updatedata);
router.get('/updateprofile',usermiddle,Updateprofile);
router.post('/feedback',feedback);
router.post('/feeddel',feeddel);
router.get('/feedbackdata',feedbackdata);
router.get('/check',usermiddle,check);
router.get('/logoutuser',clearcookie);
router.get('/mechanicofcity/:cityname',mechanicofcity);

module.exports=router;