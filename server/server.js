const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const http = require('http');
let server = http.createServer(app);
const io = require('socket.io')(server);
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

    const port = process.env.PORT || 3001;

app.use(cors({
    // origin:[`http://localhost:3000`],
    origin: function(origin, callback){
        return callback(null, true);
    },
    credentials:true
}));
// INFO credentials:true because HTTP sessions are a tried and true mechanism to deal with authentication on the web.
// However, HTTP Sessions rely on cookies, which are not sent by default over CORS.
app.use(express.json());
app.use(cookieParser());


const uri=process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex:true, useFindAndModify:false});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

const Userdb = require('./models/user.js');
const Motdb = require('./models/mot.js');
const Salondb = require('./models/salon.js');

app.post('/api/session-checker',function(req,res) {
    Userdb.findOne({ userId:req.body.userId }, function(err, result) {
        if (result==null) {
            console.log("token not found in db");
            res.send({confirmation:"error"})
        }
        else {
            res.send({
                confirmation:"success",
                userId:result.userId,
                username:result.username,
                isAdmin:result.is_admin})
        }
    });
});

app.post('/api/login', (req,res) => {
    const entry={username:req.body.username, password: req.body.password};
    const user = {
        username: req.body.username,
    };
    Userdb.findOne({ username: entry.username }, function(err, result) {
        if (result==null || result.password !== entry.password) {
            console.log("findOne error");
            res.send({confirmation:"error"})
        }
        else {
            jwt.sign({user}, 'secretkey', { expiresIn: '8h' }, (err, token) => {
                res.cookie('userId', 'Bearer ' + token, { maxAge: 28800, httpOnly: false });
                console.log("token created");

                Userdb.updateOne({username:entry.username},{ userId: token} ,(err)=>{
                    if (err) throw err;
                    console.log("token updated and sent")
                    res.send({
                        confirmation:"success",
                        isAdmin:result.is_admin,
                        userId:token})
                })
            });

        }
    });
});
app.post('/api/logout', (req) => {
    Userdb.updateOne({username:req.body.username},{ userId: ""} ,(err)=>{
        if (err) throw err;
    })
})

app.post('/salons/add', (req,res) => {
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
app.post('/salons/delete', (req,res) => {
    Salondb.deleteOne({_id:req.body.room_id}, function (err) {
        if (err) throw err;
    });
    delete _salons[req.body.room_id]
    io.sockets.emit("updateSalons",_salons)
    res.send(true)
});

app.post('/mots/add', (req,res) => {
    let data={
        content:req.body.mot ,
        created_at:Date(),
        created_by:req.body.username
    }
    let new_mot= new Motdb(data)
    new_mot.save((err,mot)=>{
        data._id=mot.id;
        _mots.push(req.body.mot)
        io.sockets.emit("updateMots",_mots)
    })
    res.send(true)
});
app.post('/mots/delete', (req,res) => {
    Motdb.deleteOne({content:req.body.mot}, function (err) {
        if (err) throw err;
    });
    _mots=_mots.filter(mot => mot!==req.body.mot);
    io.sockets.emit("updateMots",_mots)
    res.send(true)
});



let _salons={}         // salons = {id1:salon1 , id2:salon2...}
const initializeSalons=()=>{
    Salondb.find({ },(err, salons) => {
        if (err) throw err;
        salons = salons.reduce((obj, item) => {
            obj[item.id] = item.toObject();//item is a mongoose doc that contains useless properties
            return obj
        }, {}) //transforms array of objs with id to obj of objs with id as key
        // salons = {id1:salon1 , id2:salon2...}
        for (let id in salons) {
            salons[id].users=[]
        }
        _salons=salons
    })
}
let _mots=[]
const initializeMots=()=>{
    Motdb.find({ },(err, mots) => {
        if (err) throw err;
        _mots=mots.map(obj=>obj.content)
    })
}
initializeSalons()
initializeMots()


const maxTime=10, timeToNextRound=3,nombre_manches=5 //in seconds

io.sockets.on('connection', (socket)=>{
    const startTimer=(room_id)=>{
        _salons[room_id].timeleft=null;
        _salons[room_id].trois_mots=[];
        _salons[room_id].manche=0;

        let timer=null;

        function selectDrawer(room_id,prev_drawer) {
            if (_salons[room_id].users.length===1) return _salons[room_id].users[0].username
            let users = _salons[room_id].users.filter(user => user.username !== prev_drawer)
            if (users) return users[Math.floor(Math.random()*users.length)].username; //returns random item from array
        }
        function updateTime() {
            if (_salons[room_id].timeleft === null){
                _salons[room_id].timeleft=0
                let new_drawer=selectDrawer(room_id,_salons[room_id].currentDrawer);
                let filtered=_mots.filter( mot => !_salons[room_id].trois_mots.includes(mot) ) //pick words different from last 3 words
                let trois_mots=filtered.sort(() => .5 - Math.random()).slice(0,3);
                _salons[room_id].trois_mots=trois_mots;
                _salons[room_id].currentDrawer=new_drawer;
                _salons[room_id].manche++
                _salons[room_id].users.map(user=>user.score=0);
                io.to(room_id).emit("updateSalons",_salons)
                io.to(room_id).emit('startGame',new_drawer,trois_mots);
            } else if (_salons[room_id].timeleft === 1) { // Time left = 0
                _salons[room_id].timeleft=0;
                // console.log(room_id,"0 time up");
                let new_drawer=selectDrawer(room_id,_salons[room_id].currentDrawer);
                let filtered=_mots.filter( mot => !_salons[room_id].trois_mots.includes(mot) ) //pick words different from last 3 words
                let trois_mots=filtered.sort(() => .5 - Math.random()).slice(0,3);
                _salons[room_id].trois_mots=trois_mots;
                _salons[room_id].currentDrawer=new_drawer;

                if (_salons[room_id].manche===nombre_manches) {
                    _salons[room_id].manche=1
                    io.to(room_id).emit("updateSalons",_salons)
                    io.to(room_id).emit('endGame')
                    _salons[room_id].clearTimer()
                    setTimeout(()=>{
                        startTimer(room_id)
                    },7000)//7sec
                } else{
                    _salons[room_id].manche++
                    io.to(room_id).emit("updateSalons",_salons)
                    io.to(room_id).emit('timeUp',new_drawer,trois_mots);
                }

            }else if(_salons[room_id].timeleft === -timeToNextRound) { // Time left = -x / Start of a new round
                _salons[room_id].timeleft=maxTime;
                if (!_salons[room_id].wordWasChosen) {
                    _salons[room_id].currentMot=_salons[room_id].trois_mots[Math.floor(Math.random()*_salons[room_id].trois_mots.length)]
                }
                _salons[room_id].wordWasChosen=false;
                io.to(room_id).emit('restartRound',maxTime,_salons[room_id].currentMot) //in time_left_bar.js
                io.to(room_id).emit('resetCanvas')

            }else{
                if(_salons[room_id].users.filter(user=>user.username===_salons[room_id].currentDrawer).length===0) { //if drawer disconnected
                    _salons[room_id].timeleft=1
                }else {
                    _salons[room_id].timeleft-- ;
                }
            }
        }

        timer=setInterval(updateTime, 1000)

        _salons[room_id].clearTimer= ()=>{
            console.log("CLEARTIMER")
            clearInterval(timer);
            delete _salons[room_id].timeleft;
            delete _salons[room_id].currentDrawer;
        } //_salons[room_id].clearTimer() to clear timer
    }

    socket.emit("updateMots",_mots)
    socket.emit("updateSalons",_salons)
    console.log('User connected');
    const leaveRoom=(room_id,username)=>{
        socket.leave(room_id);
        if (room_id in _salons ){
            _salons[room_id].users = _salons[room_id].users.filter(user => user.username !== username);
            if (_salons[room_id].users.length===0 &&_salons[room_id].clearTimer) _salons[room_id].clearTimer()
        }

        io.to(room_id).emit('userDisonnected',username)
        io.emit("updateSalons",_salons)
    }

    socket.on('disconnect', function(){
        const room_id=socket.room;
        const username=socket.username
        leaveRoom(room_id,username)
        console.log('user disconnected');
    });

    socket.on("joinRoom", function (room_id,username) {
        socket.leaveAll()
        socket.join(room_id);
        socket.room = room_id;
        socket.username = username;
        if (room_id in _salons ){
            if (!_salons[room_id].users){
                _salons[room_id].users=[]
            } 
            _salons[room_id].users.push({username:username,score:0})

            if (!_salons[room_id].currentDrawer){ // if there's no timer
                startTimer(room_id)
            }
            // console.log("in",_salons[room_id])
        }
        socket.emit("setTimeLeft" ,_salons[room_id].timeleft,_salons[room_id].currentMot)
        io.to(room_id).emit("userConnected",username)
        io.emit("updateSalons",_salons)
    });
    socket.on('leaveRoom', function(room_id,username){
        leaveRoom(room_id,username)
    });

    socket.on('chatter', (room_id,username,message)=>{
        io.to(room_id).emit('chatter',username,message)
    });
    socket.on('correctGuess', (room_id,username)=>{
        _salons[room_id].users.map(user=>{
            if (user.username===username) user.score++
        });
        io.to(room_id).emit('updateSalons',_salons);
        io.to(room_id).emit('correctGuess',username)
    });

    socket.on('line', data => {
        // console.log(data)
        io.to(data.room_id).emit('line', {
            lineWidth: data.lineWidth,
            lineColor: data.lineColor,
            lineCoordinates: data.lineCoordinates,
        });
    });
    socket.on('resetCanvas', room_id => {
        io.to(room_id).emit('resetCanvas')
    })
    socket.on('updateDrawnWord', (room_id,mot) => {
        if (mot) {
            _salons[room_id].wordWasChosen=true;
            _salons[room_id].currentMot=mot
        }
    })
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static('client/build'));
    app.use('*', express.static('client/build'));

    // app.get('*', (req,res)=>{
    //     res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    // })
}


server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});