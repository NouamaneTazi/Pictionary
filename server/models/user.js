const mongoose = require('mongoose');



//define the schema
let UserSchema = new mongoose.Schema({
    userId: String,
    username: String,
    password: String,
    is_admin: Boolean
});

// Enter data
// Userdb = mongoose.model('user', UserSchema);
// entry = {username: "wawa", password: "mama", is_admin:true};
// Userdb.create(entry, function (err,result) {
//     if (err) throw err;
// });

//create the model
module.exports = mongoose.model('user', UserSchema);
