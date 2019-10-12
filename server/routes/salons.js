const router = require('express').Router();

const Salondb = require('../models/salon.js');

router.post('/add', (req,res) => {
    let data={
        name:req.body.name ,
        created_at:Date(),
        created_by:req.body.username
    }
    let new_salon= new Salondb(data)
    new_salon.save((err,salon)=>{
        data._id=salon.id;
        data.users=[];
        _salons[salon.id]= data
        io.sockets.emit("updateSalons",_salons)
    })

    res.send(true)
});
router.post('/delete', (req,res) => {
    Salondb.deleteOne({_id:req.body.room_id}, function (err) {
        if (err) throw err;
    });
    delete _salons[req.body.room_id]
    io.sockets.emit("updateSalons",_salons)
    res.send(true)
});


module.exports = router;