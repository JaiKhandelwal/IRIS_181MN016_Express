var express=require("express");
var router=express.Router();
var Product=require("../models/products");
var Bid=require("../models/bid");
var middleware=require("../middleware");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dopwin2og', 
  api_key: 689444895118948 , 
  api_secret: process.env.APISECRET
});

//==========================
//routes
//==========================

router.get("/products",function(req,res){
	var noMatch=null;
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Product.find({name:regex},function(err,allproducts){
		if(err){
			console.log("something went wrong");
		}
		else{
			if(allproducts.length < 1){
                  noMatch = "No products seems to match your search, pls try again";
              }
			res.render("products/main",{product:  allproducts,noMatch:noMatch});
		}
	});
	}
	else{
		Product.find({},function(err,allproducts){
		if(err){
			console.log("something went wrong");
		}
		else{
			res.render("products/main",{product:  allproducts,noMatch:noMatch});
		}
	});
	}
	
});
router.post("/products",middleware.isLoggedIn,upload.single("image"),function(req,res){
	cloudinary.uploader.upload(req.file.path, function(result) {
  // add cloudinary url for the image to the product object under image property
  req.body.product.image = result.secure_url;
  req.body.product.imageId=result.public_id;
  // add author to product
  req.body.product.author = {
    id: req.user._id,
    username: req.user.username
  }
  Product.create(req.body.product, function(err, product) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.redirect('/products/' + product.id);
  });
});
});
router.get("/products/new",middleware.isLoggedIn,function(req,res){
	res.render("products/new");
});
router.get("/products/:id",function(req,res){
	Product.findById(req.params.id).populate("bid").exec(function(err,product){
		if(err){
			console.log("something went wrong");
		}else{
//=================================================
//function for comapring dates
//=================================================
			var dates = {
    		convert:function(d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp) 
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0],d[1],d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year,d.month,d.date) :
            NaN
        );
    },
    compare:function(a,b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a=this.convert(a).valueOf()) &&
            isFinite(b=this.convert(b).valueOf()) ?
            (a>b)-(a<b) :
            NaN
        );
    },
    inRange:function(d,start,end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
       return (
            isFinite(d=this.convert(d).valueOf()) &&
            isFinite(start=this.convert(start).valueOf()) &&
            isFinite(end=this.convert(end).valueOf()) ?
            start <= d && d <= end :
            NaN
        );
    }
}
//=================================================			
			var today=new Date();
			var compare=dates.compare(today.getTime(),product.deadline.getTime());
			if(compare==1||compare==0){
				req.flash("error","You missed the deadline for this product");
				res.redirect("back");
			}
			else{
				res.render("products/show",{product: product});
			}
		}
	})
})
router.get("/products/:id/edit",middleware.isProductOwner,function(req,res){
	Product.findById(req.params.id,function(err,foundProduct){
		if(err){
			res.redirect("/products");
		}
		else{
			res.render("products/edit",{product:foundProduct});
		}
	});
});
router.put("/products/:id",upload.single('image'),middleware.isProductOwner,function(req,res){
	Product.findByIdAndUpdate(req.params.id,req.body.product,async function(err,product){
		if(err){
			req.flash("error", err.message);
			res.redirect("/products");
		}
		else{
			 if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(product.imageId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
				  product.imageId = result.public_id;
                  product.image = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            product.name = req.body.product.name;
            product.description = req.body.product.description;
			product.price=req.body.product.price;
			product.deadline=req.body.product.deadline;
			product.contact=req.body.product.contact;
            product.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/products/" + product._id);
		}
	});
});
router.delete("/products/:id",middleware.isProductOwner,function(req,res){
	Product.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/products");
		}
		else{
			res.redirect("/products");
		}
	})
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports=router;