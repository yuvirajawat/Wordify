//jshint esversion:6
require('dotenv').config();
const express = require("express");
const path=require("path");
const session =require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");
const app = express();
const mongoose=require("mongoose");
app.set('view engine', 'ejs');
// to get values from html form
app.use(bodyParser.urlencoded({extended: true}));
//static css files on server
app.use(express.static(path.join(__dirname,"public")));

app.use(session({
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
// mongodb atlas to mongoose connection
mongoose.connect("mongodb+srv://"+process.env.CLUSTER_USERNAME+":"+process.env.CLUSTER_PASSWORD+"@cluster0.txy1h.mongodb.net/blog-journal",{useNewUrlParser:true},{useCreateIndex: true });

//create schema
const blogSchema=new mongoose.Schema({
  postTitle:String,
  postBody:String,
  writer:String
});

//create model
const Post=mongoose.model("Post",blogSchema);
const userSchema=new mongoose.Schema({
  username:String,
  password:String,
});
userSchema.plugin(passportLocalMongoose);
const User=mongoose.model("User",userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//TODO:set nav bar ul hidden when isLoggedIn false

//landing page
app.get("/",(req,res)=>{
  res.render("signup");
});
// home page
app.get("/home",(req,res)=>{
  if(req.isAuthenticated()){
    Post.find({},(err,posts)=>{
      let user=req.user.username.split("@");
      let userFirst=user[0];
      res.render("home",{posts:posts,user:userFirst});
  });
  }
  else{
    res.redirect("/signup");
  }
});
//on click on login from signup
app.get("/login",(req,res)=>{
  res.render("login");
});
app.get("/signup",(req,res)=>{
  res.render("signup");
});

app.post("/signup",(req,res)=>{
  User.register({username:req.body.username},req.body.password,(err,user)=>{
    if(err){
      console.log(err);
      res.redirect("/signup");
    }
    else{
      passport.authenticate("local")(req,res,()=>{
        console.log("signed up successfully");
        res.redirect("/home");
      });
    }
  });
});
app.post("/login",(req,res)=>{
  const newUser= new User({
    username:req.body.username,
    password:req.body.password
  });
  req.login(newUser,(err)=>{
    if(err){
      console.log(err);
    }
    else{
      passport.authenticate("local")(req,res,()=>{
        console.log("logged in successfully");
        console.log(req.user.username);
        res.redirect("/home");});
    }
  });
});

//about page
app.get("/about",(req,res)=>{
  if(req.isAuthenticated()){
    res.render("about");
  }
  else{
    res.redirect("/signup");
  }
});
app.get("/myposts",(req,res)=>{
  if(req.isAuthenticated()){
    Post.find({writer:req.user.username},(err,posts)=>{
      res.render("myposts",{posts:posts});
  });}
  else{
    res.redirect("/signup");
  }
});
//compose from
app.get("/compose",(req,res)=>{
  if(req.isAuthenticated()){
    res.render("compose");
  }
  else{
    res.redirect("signup");
  }
})
//compose and render on home
app.post("/compose",(req,res)=>{
  const postTitle=req.body.postTitle;
  const postBody=req.body.postBody;
  const writer=req.user.username;
  const post=new Post({postTitle:postTitle,postBody:postBody,writer:writer});
  post.save((err)=>{
    if(!err)
    {
      res.redirect("/myposts");
    }
  });
});


//logout
app.get("/logout",(req,res)=>{
  req.logout();
  res.redirect("/");
});
//specific post using id
app.get("/posts/:id",(req,res)=>{
  const requestedId=req.params.id;
  if(req.isAuthenticated()){
    Post.findOne({_id:requestedId},(err,post)=>{
      if(!err){
        let curUser=req.user.username;
        res.render("post",{post:post,curUser:curUser});
      }
    });
  }
});
//render edit box on edit btn click
app.post("/edit/:id",(req,res)=>{
  const postId=req.params.id;
  Post.findOne({_id:postId},(err,post)=>{
    if(!err){
      res.render("edit",{post:post,postBody:post.postBody});
    }
  });
});
// save updated post on DB
app.post("/update/:id",(req,res)=>{
  const postId=req.params.id;
  const postTitle=req.body.postTitle;
  const postBody=req.body.postBody;
  Post.findOneAndUpdate({_id:postId},{postTitle:postTitle,postBody:postBody},{new:true},(err)=>{
    if(!err){console.log("updated successfuly");}
  });
  res.redirect("/myposts");
});
//delete post
app.post("/delete/:id",(req,res)=>{
  const postId=req.params.id;
  Post.findOneAndDelete({_id:postId},(err)=>{
    if(!err){
      res.redirect("/myposts");
    }
  });
});
//port 
app.listen(process.env.PORT||3000,()=>{
  console.log("server started successfully");
});