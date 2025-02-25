const mongoose=require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/miniproject2');


const userSchema=new mongoose.Schema({
    username:{type:String,required:true},
    name:{type:String,required:true},   
    email:{type:String,required:true},
    password:{type:String,required:true},
    age:{type:Number,required:true},
    post:[{type:mongoose.Schema.Types.ObjectId,ref:'post'}]
});

module.exports=mongoose.model('user',userSchema);