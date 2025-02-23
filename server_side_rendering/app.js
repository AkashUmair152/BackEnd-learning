const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const userModel = require('./models/user');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/', (req, res) => {    
    res.render('index');
});
// Route to render the form
app.get('/register', (req, res) => {
    res.render('form'); // Renders the `form.ejs` template
  });
  
  // Route to handle form submission
  app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt, async (err,hash)=>{
            const user = await userModel.create({
                username,
                email,
                password:hash
             });

            let token = jwt.sign({email:email}, 'secretkey', (err,token)=>{
            
                res.cookie('token',token);
                res.redirect("/login");
             })
           
          });

        })
    })

app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email }); 
    if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                let token = jwt.sign({email:email}, 'secretkey', (err,token)=>{
                    res.cookie('token',token);
                    res.redirect("/home");
                 })
            } else {
                res.redirect("/login");
            }
        });
    }
})
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
}) 

app.get("/home", (req, res) => {
    res.render("home");
})

    




app.listen(3000, () => {
    console.log('Server started on port 3000');
});