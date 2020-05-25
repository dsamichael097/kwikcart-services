const admin = require("firebase-admin");
const Request = require('request');
var QRCode = require('qrcode')
 
exports.generateOTP = (req,res,next)=>{
    var db = admin.database();
    var ref = db.ref("/");
    var usersRef = ref.child("cart/"+req.body.sessionId);
    var otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);

    var user = "YG3V1tHlxUGXSqKwwvT0uA";
    var number = req.body.mobno;


    // Call API to send otp to mobile
    Request.get("https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey="+user+"&senderid=TESTIN&channel=2&DCS=0&flashsms=0&number="+number+"&text="+otp+"&route=1", (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    console.dir(JSON.parse(body));
    });

    //To insert our own unique key
    usersRef.update({
        otp: otp
    })
    .then( result =>{
        res.status(201).json({message:"Data saved Successfully"});
    })
    .catch(err =>{
        res.status(500).json({message:"Data could not be saved"});
    });
}

exports.verifyOTP = (req,res,next)=>{
    var db = admin.database();
    var ref = db.ref("/");
    var usersRef = ref.child("cart/"+req.body.sessionId);
    //console.log(usersRef);
    var otp = req.params.otp;

    usersRef.child("otp").once("value", function(data) {
        console.log(data.val()+" "+otp);
        if(data.val() == otp){
            res.status(200).json({success:true});
        }
        else{
            res.status(500).json({failure:true});
        }
    });
}


exports.placeOrder = (req,res,next)=>{
    var db = admin.database();
    var ref = db.ref("/");
    var usersRef = ref.child("cart/"+req.params.sessionId);
    var date = new Date().toISOString().slice(0,10);
    var time = new Date().toTimeString().slice(0,5);
    var orderRef = ref.child("order/"+req.body.mobno+"/"+date+"/"+time);
    var prod=null;

    usersRef.once("value", function(data) {
        data.forEach(function(childData){
            prod = childData.key;
            //orderRef.set(childData);
           // console.log(childData)
            if(prod!="otp" && prod!="sessionCreated"){
                orderRef.child(prod).set({
                    pid:childData.child("pid").val(),
                    pname:childData.child("pname").val(),
                    qty:childData.child("qty").val(),
                    price:childData.child("price").val()
                })
                .then(result=>{
                    console.log("Product Added Successfully");
                })
                .catch(err=>{
                    res.status(500).json({failure:"Failed to Complete Order"});
                });
            }
        });
        usersRef.remove();
        res.status(201).json({success:"Order Completed Successfully"});
    });
}

exports.checkOrder = (req,res,next)=>{
	var db = admin.database();
    var ref = db.ref("/");
    var usersRef = ref.child("order/"+req.params.mobno);
	usersRef.once("value", function(data) {
		res.status(200).json({success:true,data:data});
	});
}

exports.generateQR = (req,res,next)=>{
    var id = req.params.sessionId;
    QRCode.toDataURL(id, function (err, url) {
        res.status(201).json({success:true,data:url});
    });
}