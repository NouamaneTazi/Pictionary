const mongoose = require('mongoose');

//db setup
// mongoose.connect('mongodb://localhost:27017/userdb', { useNewUrlParser: true });

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     console.log("we're connected!");
// });

//define the schema
let SalonSchema = new mongoose.Schema({
    name: String,
    created_at: Date,
    created_by: String
});

// // a document instance
// var salon = new mongoose.model('salon', SalonSchema)({
//     name: "test4",
//     created_at: new Date(),
//     players_number: 0,
//     created_by: "a"
// });
//
// salon.save()
//create the model
module.exports = mongoose.model('salon', SalonSchema);
