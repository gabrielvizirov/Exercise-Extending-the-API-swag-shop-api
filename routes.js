var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

var Product = require('./model/product');
var WishList = require('./model/wishList');
var Cart = require('./model/cart');
var SaleItems = require('./model/saleItems');



// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

// define the home page route
router.get('/', function (req, res) {
  res.send('Birds home page')
})
// define the about route
router.get('/about', function (req, res) {
  res.send('About birds')
})

/************* PRODUCT *******************/

router.post('/product', function(request, response) {
    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;
    product.save(function(err, savedProduct) {
        if (err) {
            response.status(500).send({error:"Could not save product"});
        } else {
            response.send(savedProduct);
        }
    });
});

router.get('/product', function(request, response) {
    Product.find({}, function(err, products) {
        if (err) {
            response.status(500).send({error:"Could not fetch products"});
        } else {
            response.send(products);
        }
    });
});


/************* WISHLIST *******************/

router.get('/wishlist', function(request, response) {
    WishList.find({}).populate({path:'products', model: 'Product'}).exec(function(err, wishLists) {
        if (err) {
            response.status(500).send({error:"Could not fetch wishlists"});
        } else {
            response.status(200).send(wishLists);
        }
    });
});


router.post('/wishlist', function(request, response) {
    var wishList = new WishList();
    wishList.title = request.body.title;
    
    wishList.save(function(err, newWishList) {
        if (err) {
            response.status(500).send({error:"Could not create wishlist"});
        } else {
            response.send(newWishList);
        }
    });
});

router.put('/wishlist/product/add', function(request, response) {
   Product.findOne({_id: request.body.productId}, function(err, product) {
       if (err) {
           response.status(500).send({error:"Could not add item to wishlist"});
       } else {
           WishList.update({_id:request.body.wishListId}, {$addToSet:{products:product._id}}, function(err, wishList) {
                if (err) {
                    response.status(500).send({error:"Could not add item to wishlist"});
                } else {
                    response.send("Successfully added to wishlist");
                }
           });
       }
   }) 
});



/************* CART *******************/

router.get('/cart', function(request, response) {
    Cart.find({}).populate({path:'products', model: 'Product'}).exec(function(err, cart) {
        if (err) {
            response.status(500).send({error:"Could not fetch the cart"});
        } else {
            response.status(200).send(cart);
        }
    });
});


router.post('/cart', function(request, response) {
    var cart = new Cart();
    
    cart.save(function(err, newCart) {
        if (err) {
            response.status(500).send({error:"Could not create a cart"});
        } else {
            response.send(newCart);
        }
    });
});

router.put('/cart/product/add', function(request, response) {
   Product.findOne({_id: request.body.productId}, function(err, product) {
       if (err) {
           response.status(500).send({error:"Could not add item to the cart"});
       } else {
           Cart.update({_id:request.body.cartId}, {$addToSet:{products:product._id}}, function(err, cart) {
                if (err) {
                    response.status(500).send({error:"Could not add item to the cart"});
                } else {
                    response.send("Successfully added tothe cart");
                }
           });
       }
   }) 
});

router.delete('/cart/product/remove', function(request, response) {
   Product.findOne({_id: request.body.productId}, function(err, product) {
       if (err) {
           response.status(500).send({error:"Could not remove item from the cart"});
       } else {
           Cart.update({_id:request.body.cartId}, {$pull:{products:product._id}}, function(err, cart) {
                if (err) {
                    response.status(500).send({error:"Could not remove item from the cart"});
                } else {
                    response.send("Successfully removed from the cart");
                }
           });
       }
   }) 
});



/************* SaleItems *******************/

router.get('/sale-items', function(request, response) {
    SaleItems.find({}).populate({path:'products', model: 'Product'}).populate({path:'relatedItems', model: 'Product'}).exec(function(err, saleItems) {
        if (err) {
            response.status(500).send({error:"Could not fetch the sale items"});
        } else {
            response.status(200).send(saleItems);
        }
    });
});


router.post('/sale-items', function(request, response) {
    var saleItems = new SaleItems();
    
    saleItems.save(function(err, newSaleItems) {
        if (err) {
            response.status(500).send({error:"Could not create sale items"});
        } else {
            response.send(newSaleItems);
        }
    });
});

router.put('/sale-items/product/add', function(request, response) {
   Product.findOne({_id: request.body.productId}, function(err, product) {
       if (err) {
           response.status(500).send({error:"Could not add product to the sale items"});
       } else {
           SaleItems.update({_id:request.body.saleItemsId}, {$addToSet:{products:product._id}}, function(err, saleItems) {
                if (err) {
                    response.status(500).send({error:"Could not add product to the sale items"});
                } else {
                    response.send("Successfully added product to the sale items");
                }
           });
       }
   }) 
});

router.delete('/sale-items/product/remove', function(request, response) {
   Product.findOne({_id: request.body.productId}, function(err, product) {
       if (err) {
           response.status(500).send({error:"Could not remove product from the sale items"});
       } else {
           SaleItems.update({_id:request.body.saleItemsId}, {$pull:{products:product._id}}, function(err, saleItems) {
                if (err) {
                    response.status(500).send({error:"Could not remove product from the sale items"});
                } else {
                    response.send("Successfully removed product from the sale items");
                }
           });
       }
   }) 
});

router.put('/sale-items/related-items/add', function(request, response) {
   Product.findOne({_id: request.body.productId}, function(err, product) {
       if (err) {
           response.status(500).send({error:"Could not add related item to the sale items"});
       } else {
           SaleItems.update({_id:request.body.saleItemsId}, {$addToSet:{relatedItems:product._id}}, function(err, saleItems) {
                if (err) {
                    response.status(500).send({error:"Could not add related item to the sale items"});
                } else {
                    response.send("Successfully added related to the sale items");
                }
           });
       }
   }) 
});

router.delete('/sale-items/related-items/remove', function(request, response) {
   Product.findOne({_id: request.body.productId}, function(err, product) {
       if (err) {
           response.status(500).send({error:"Could not remove related item from the sale items"});
       } else {
           SaleItems.update({_id:request.body.saleItemsId}, {$pull:{relatedItems:product._id}}, function(err, saleItems) {
                if (err) {
                    response.status(500).send({error:"Could not remove related item from the sale items"});
                } else {
                    response.send("Successfully removed related item from the sale items");
                }
           });
       }
   }) 
});


/********************************/

module.exports = router;