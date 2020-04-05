var mongoose=require("mongoose");
var productSchema=new mongoose.Schema({
	name: String,
	description: String,
	image: String,
	startingBid: String,
	deadline: Date,
	contact: String,
	author: {
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username: String
	},
	bid:[
		 {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Bid"
		}
	]
});
module.exports=mongoose.model("Product",productSchema);