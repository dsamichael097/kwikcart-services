const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

// Firebase Connection Initialization
/*admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kwikcart-228cd.firebaseio.com"
});*/

exports.getProduct = (req,res,next)=>{
    //Get the object of the firebase admin and instattiate its database
    var db = admin.database();
    //Create a collection by specifying the collection name or leave it as /
    var ref = db.ref("/product/"+req.params.id);
    //console.log(req.params.id);
    ref.once("value", function(data) {
        res.status(200).json(data);
    });
}

exports.getAllProducts = (req,res,next)=>{
    //Get the object of the firebase admin and instattiate its database
    var db = admin.database();
    //Create a collection by specifying the collection name or leave it as /
    var ref = db.ref("/product/");
    //console.log(req.params.id);
    ref.once("value", function(data) {
        res.status(200).json(data);
    });
}

exports.addProduct = (req,res,next)=>{
    var db = admin.database();
    var ref = db.ref("/");
    var usersRef = ref.child("product/");

    /*var date = new Date();
    date = date.toISOString().slice(0,10);*/
    //To insert our own unique key
    usersRef.child(req.body.pid).set({
        pid: req.body.pid,
        pname: req.body.pname,
        qty: req.body.qty,
        price: req.body.price,
        pimg: req.body.pimg
    })
    .then( result =>{
        res.status(201).json({message:"Product saved Successfully"});
    })
    .catch(err =>{
        res.status(500).json({message:"Product could not be saved"});
    });
}


exports.updateProduct = (req,res,next)=>{
    var db = admin.database();
    var ref = db.ref("/");
    var usersRef = ref.child("product/"+req.body.pid);
    //var date = new Date().toISOString().slice(0,10);
    usersRef.child(req.body.pid).update({
        pid: req.body.pid,
        pname: req.body.pname,
        qty: req.body.qty,
        price: req.body.price,
        pimg: req.body.pimg
    })
    .then(result =>{
        res.status(201).json({message:"Product Updated Successfully"});
    })
    .catch(err =>{
        res.status(500).json({message:"Product could not be Updated"});
    });
}

exports.deleteProduct = (req,res,next)=>{
    var db = admin.database();
    var ref = db.ref("/");
    var usersRef = ref.child("product/");
    usersRef.child(req.params.id).remove()
    .then(()=>{
        res.status(201).json({message:"Product Deleted Successfully"});
    })
    .catch(()=>{
        res.status(500).json({message:"Product could not be Deleted"});
    });
}
