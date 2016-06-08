'use strict';

var router = require('express').Router()
var db = require('../../../db')
var User = db.model('user')

module.exports = router

router.param('userId', function(req, res, next, userId) {
    User.findById(userId)
        .then(function(userId) {
            if (userId) {
                req.userId = userId;
                next();
                return null;
            } else {
                var error = new Error('some message');
                error.status = 404;
                throw error;
            }
        })
        .catch(next);
});

//Get all users
router.get('/', function(req, res, next) {
    User.findAll({ where: req.query })
        .then(function(users) {
            res.send(users)
        })
        .catch(next)
})

//Get one user by id
router.get('/:userId', function(req, res, next) {
    res.send(req.userId)
})

//Create new user
router.post('/', function(req, res, next) {
    //password requirement still needed	
    if (req.body.password) {
        User.create(req.body)
            .then(function(user) {
                res.send(user)
            })
            .catch(next)
    } else {
        next(new Error('invalid password'))
    }
})

router.put('/:userId', function(req, res, next) {
    if (req.user.isAdmin) {
        req.userId.update(req.body)
            .then(function(user) {
                res.send(user)
            })
            .catch(next)
    } else {
        next(new Error('not an admin'))
    }
})

router.delete('/:userId', function(req, res, next) {
    if (req.user.isAdmin) {
        req.userId.destroy()
            .then(function() {
                res.sendStatus(204)
            })
            .catch(next)
    } else {
        next(new Error('not an admin'))
    }
})