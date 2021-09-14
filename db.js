const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://kumol:kumol254@cluster0.5hz61.mongodb.net/YoFoodie?retryWrites=true&w=majority",{},(err)=>{
    
    err ? console.log("errr") : console.log("Connected");
})