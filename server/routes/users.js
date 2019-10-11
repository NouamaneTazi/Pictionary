const router = require('express').Router();
let Userdb = require('../models/user');

router.route('/').get((req, res) => {
    Userdb.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const is_admin = Boolean(req.body.is_admin);

    const newUser = new Userdb({
        username,
        password,
        is_admin
    });

    newUser.save()
        .then(() => res.json('User added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;