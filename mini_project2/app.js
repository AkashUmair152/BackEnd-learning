const express =require('express');
const app = express();
const path = require('path');
const jwt=require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt=require('bcrypt');
const userModel=require('./models/user');
const postModel=require('./models/post');

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());


app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/register',(req,res)=>{
    res.render('register');
});

app.post('/register',async(req,res)=>{  
    const {username,name,email,password,age}=req.body;
    const user= await userModel.findOne({email});
    if(user) return res.status(400).send('User already exists');
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,(err,hash)=>{
            const newUser=new userModel({
                username,
                name,
                email,
                password:hash,
                age
            });
          let token =  jwt.sign({id:newUser._id, email:newUser.email},"secretkey");
          res.cookie('token',token,{httpOnly:true});
            newUser.save();
            res.render('welcome');
        })
    })
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    const user=await userModel.findOne({email});
    if(!user) return res.status(400).send('User not found');
    const validPassword=await bcrypt.compare(password,user.password);
    if(!validPassword) return res.status(400).send('Invalid Password');
    let token =  jwt.sign({id:user._id, email:user.email},"secretkey");
    res.cookie('token',token,{httpOnly:true});
    res.render('welcome');
});

app.get('/logout',(req,res)=>{
    res.clearCookie('token');
    res.redirect('/');
});

app.get("/profile",verifyToken, (req,res)=>{
   console.log(req.user);
   res.send(`welcome Mr ${req.user.name}`);

    
});


function verifyToken(req,res,next){
    const token=req.cookies.token;
    if(!token) return res.status(401).send('you need to login');
    jwt.verify(token,'secretkey',function(err,decoded){
        if(err) return res.status(401).send('Unauthorized');
        req.user=decoded;
        next();
    })
}


app.listen(3000,()=>{
    console.log('server is running on port 3000');
});