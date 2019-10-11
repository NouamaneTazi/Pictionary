const mongoose = require('mongoose');

//db setup
// mongoose.connect('mongodb://localhost:27017/userdb', { useNewUrlParser: true });

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     console.log("we're connected!");
// });

//define the schema
let MotSchema = new mongoose.Schema({
    content: String,
    created_at: Date,
    created_by: String
});

//Enter data
// Motdb = mongoose.model('mot', MotSchema);
// entry = {content: "pomme", created_at: Date(), created_by: "admin"};
// Motdb.create(entry, function (err,result) {
//     if (err) throw err;
// });

//create the model
module.exports = mongoose.model('mot', MotSchema);
