# IRIS_181MN016_Express

## Steps to run the project
The project is deployed using heroku so no installation is required.

Here is the link for the project: https://boiling-meadow-26377.herokuapp.com

## Implemented features
1)There is a landing page/first page where user can search for the products or else go to main page to see all the products.

2)If their is a related product that match the user search only those products will be shown on tha main page otherwise if the users search doesn't match any products he/she will get notification that the no product matched your search pls search again with search form available again on the main page.

3)User is able to see all the products(products added by different users) with the product name and the deadline on the main page.

4)If a user want to add a new product he/she needs to first login/signup.

5)The product can be added by adding the suitable information and the image can be uploaded from the system.

6)When user clicks on **More Info** button below each product the user will get the detailed information of the product and the user will be able to add the bid for the product in this page.

7)The product author is also shown on the page showing deatiled information for the product. The author name is a link which will redirect the user to the author profile, the user profile is created as soon as the user signs up and the products are added to the user profile as soon as the creates new product.

8)Only the author of the product will be able to edit and delete the product.

9)Each product has a deadline.When the user clicks on more info button on each product,if the deadline of the product is passed a message will be flashed that **You missed the deadline for this product** otherwise user will be able to see the detailed information of the product.

10)Many bids can be added to a single product and a user can delete his bid and can put multiple bids before the deadline.

11)There is admin signup feature also provided for which the admin need to enter the admin code while signing up and then the admin will be able to edit,delete the products created by any user also the user will be able to delete the bids created by other users. This means the admin can perform all the functions which can be performed only by the author of the product/bid.

12)If a user forgots the password he/she can reset the password by entering the e-mail id, if the e-mail matches with the mail provided during signup then the user will get the mail with the link where the user will be able to reset his/her password.

## Non-implemented features

1)The highest bidder will be able to see the claim button and then then the product will be added to the user profile

## Planned features

1)Author will be able to edit image of the product by uploading the image.

2)Author will be able to add more information on the product which is additional and also the author will be able to add the delivery address of the product which can be viewed on the ** Google Maps** by the other users.

## Applications Used

**Framework**:Express
**Database**:MongoDB
**Cloud storage for image**:Cloudinary
**Deploying App**:Heroku

## References used

1)www.stackoverflow.com
2)Bootstarp Documentation
3)Cloudinary Documentation

