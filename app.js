const winston = require("winston");
const express = require("express");
const app = express();

// //Code to remove records after certain time, i.e 1.5 hrs
// function removeInactiveSessions(){
//   console.log("I'll remove Inactive Sessions");
//   var ref = admin.database().ref('/cart/');
//   var now = Date.now();
//   var cutoff = now - 2 * 60 * 60 * 1000;
//   var d1 = new Date(cutoff);
//   console.log(d1.toLocaleString());
//   var old = ref.orderByChild('timestamp').endAt(d1.toLocaleString()).limitToLast(1);
//   var listener = old.once('child_added', function(snapshot) {
//     snapshot.ref.remove();
//   });
// }

// setInterval(() => removeInactiveSessions(), 7200000);

require("./startup/logging")();
//require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/validation")();

const port = process.env.PORT || 4500;
app.listen(port, () => winston.info(`Listening on Port ${port}`));
