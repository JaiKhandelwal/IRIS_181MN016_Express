var express=require("express");
var router=express.Router();
var Product=require("../models/products");
var Bid=require("../models/bid");
var middleware=require("../middleware");

//===============================
//routes
//===============================

//route for adding the new bid to the product, this route will render the new bid page
router.get("/products/:id/bids/new",middleware.isLoggedIn,function(req,res){
	Product.findById(req.params.id,function(err,product){
		if(err){
			console.log(err)
		}
		else{
			res.render("bids/new",{product:product});
		}
	})
})
//this route will post the bid to the product
router.post("/products/:id/bids",middleware.isLoggedIn,function(req,res){
	Product.findById(req.params.id,function(err,product){
		if(err){
			console.log(err);
			res.redirect("/products")
		}
		else{
			Bid.create(req.body.bid,function(err,bid){
				if(err){
					console.log(err)
				}
				else{
					bid.author.id=req.user._id;
					bid.author.username=req.user.username;
					bid.save();
					product.bid.push(bid);
					product.save();
					res.redirect("/products/"+product._id);
				}
			})
		}
	})
})
//route for deleting the bid on clicking the delete button
router.delete("/products/:id/bids/:bidid",middleware.isBidOwner,function(req,res){
	Bid.findByIdAndRemove(req.params.bidid,function(err,foundBid){
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/products/"+req.params.id);
		}
	})
})

module.exports=router;