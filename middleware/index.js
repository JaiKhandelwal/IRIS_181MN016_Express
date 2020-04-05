var Product=require("../models/products");
var Bid=require("../models/bid");
var middlewareObj={};

middlewareObj.isProductOwner=function(req,res,next){
	if(req.isAuthenticated()){
		Product.findById(req.params.id,function(err,foundProduct){
			if(err){
				req.flash("error","Product not found");
				res.redirect("back");
			}
			else{
				if(foundProduct.author.id.equals(req.user._id)||req.user.isAdmin){
					return next();
				}
				else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
			}
		})
	}
	else{
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.isBidOwner=function(req,res,next){
	if(req.isAuthenticated()){
		Bid.findById(req.params.bidid,function(err,foundBid){
			if(err){
				req.flash("error","Bid not found");
				res.redirect("back");
			}
			else{
				if(foundBid.author.id.equals(req.user._id)||req.user.isAdmin){
					return next();
				}
				else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
			}
		})
	}
	else{
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that");
	res.redirect("/login");
}

module.exports=middlewareObj;