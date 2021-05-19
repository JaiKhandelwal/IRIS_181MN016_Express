if(process.env.NODE_ENV!=='production') require("dotenv").config();
var express=require("express");
var app=express();
var mongoose=require("mongoose");
var flash=require("connect-flash");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
var bodyParser=require("body-parser");
var methodOverride=require("method-override");
var Product=require("./models/products");
var Bid=require("./models/bid");
var User=require("./models/user");

var productsRoutes=require("./routes/products");
var bidsRoutes=require("./routes/bid");
var authRoutes=require("./routes/auth");

//mongoose.connect("mongodb://localhost/iristask_app",{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.connect(process.env.DATABASEURL,{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.set('useNewUrlParser',true);
mongoose.set('useUnifiedTopology',true);
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname+"/public"));
app.use(flash());

//======================
//passport-configuration
//======================

app.use(require("express-session")({
    secret: "Iris is one of the best club in NITK!!!!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===========================================================
//For flash messages and managing login and logout on nav bar
//===========================================================

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
   next();
});

app.use(productsRoutes);
app.use(bidsRoutes);
app.use(authRoutes);

//======================
//routes
//======================


app.listen(process.env.PORT || 3000 , function(){
	console.log("Server is running");
});