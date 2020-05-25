const mongoose = require('mongoose');
const _ = require('lodash');
const Fawn = require('fawn');
const {Session} = require('../models/session');
const {Product} = require('../models/product');


exports.createEntrySession = async (req,res,next)=>{
    const session = new Session();

    await session.save();
    res.status(200).send(_.pick(session,['_id']));
}

exports.addProductToCart = async (req,res)=>{
    const sessionId = req.params.sessionId;
    if(!sessionId) return res.status(404).send("Invalid Session ID");

    //Check req.body with @hapi/joi over here. Code still left to write
    
    //Check if product id is a valid product id
    let product = await Product.findById(req.body.productId);
    if(!product) return res.status(400).send("Invalid Product");

    //product = {_id: req.body.productId, qty: req.body.qty};
    const session = await Session.findById(sessionId);
    if(!session) return res.status(404).send("Invalid Session ID");

    const index = session.cart.findIndex(p => p.productId == req.body.productId);
    //return res.status(200).send("Index is " + index);
    if(index !== -1) return res.status(400).send("Product already in cart");
    session.cart.push(req.body);
    new Fawn.Task()
    .save('sessions',{session})
    .update('products',{_id: req.body.productId}, {$inc: {numberInStock : -1}})
    .run();

    await session.save();
    res.status(200).send(session);
}

// exports.populateCart = (req,res,next)=>{
//     //Get the object of the firebase admin and instattiate its database
//     var db = admin.database();
//     //Create a collection by specifying the collection name or leave it as /
//     var ref = db.ref("/cart/"+req.params.sessionId);
//     ref.once("value", function(data) {
//         res.status(200).json({data:data});
//     });
// }

 exports.updateProductInCart = async (req,res)=>{
    const sessionId = req.params.sessionId;
    if(!sessionId) return res.status(404).send("Invalid Session ID");

    //Check req.body with @hapi/joi over here. Code still left to write
    
    //Check if product id is a valid product id
    let product = await Product.findById(req.body.productId);
    if(!product) return res.status(400).send("Invalid Product");

    //product = {_id: req.body.productId, qty: req.body.qty};
    const session = await Session.findById(sessionId);
    if(!session) return res.status(404).send("Invalid Session ID");

    const index = session.cart.findIndex(p => p.productId == req.body.productId);

    if(index === -1) return res.status(400).send("Invalid Product ID");
    
    const qtyToUpdate = session.cart[index].qty - req.body.qty;
    if(qtyToUpdate < 0){
        if(product.numberInStock < (qtyToUpdate*-1)) return res.status(400).send("More product ordered than available");
    }
    session.cart[index].qty = req.body.qty;
    new Fawn.Task()
    .updateOne("sessions",{_id:sessionId},
    {$set : {'cart.$[product].qty' : req.body.qty}},
    {arrayFilters: [{'product.productId' : req.body.productId}]})
    .updateOne('products',{_id: req.body.productId}, {$inc: {numberInStock : qtyToUpdate}})
    .run();

    res.status(200).send(session);
 }

// exports.deleteProductFromCart = (req,res,next)=>{
//     var db = admin.database();
//     var ref = db.ref("/");
//     var usersRef = ref.child("cart/" + req.body.sessionId);
//     var productRef = ref.child("product/"+req.body.pid);
//     var stk;
//     usersRef.child("qty").once("value",function(data){
//         stk = data.val();
//     })
//     .then(()=>{
//         usersRef.child(req.body.pid).remove();
//         productRef.update({
//             pstock: parseInt(pstock.val()) + parseInt(stk)
//         });
//         res.status(201).json({message:"Data Deleted Successfully"});
//     })
//     .catch(()=>{
//         res.status(500).json({message:"Data could not be Deleted"});
//     });
// }