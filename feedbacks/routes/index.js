require('dotenv').config()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const routes = require('express').Router()
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './feedbacks.db',
    define: {
        timestamps: false
    }
})

const Feedback = sequelize.define('Feedback', {
    feedback: {
        type: DataTypes.STRING,
        allowNull: true
    },
    like: {
        type: DataTypes.STRING
    },
    user: {
        type: DataTypes.STRING
    }
  }, {
})

routes.get('/feedback/:id', jsonParser, async function(req, res) {
    return await Feedback.findAll({
        where: {
            user: req.params.id
        }}).then((data) => {
            console.log(data);
            res.send(data?.length < 1)
        })
})

routes.post('/feedback', jsonParser, async function(req, res) {
    return await Feedback.create({
        feedback: req.body.feedback || '',
        like: req.body.like,
        user: req.body.user
    }, { fields: ['feedback', 'like', 'user'] }).then(function (feedback) {
        if (feedback) {
            res.send(feedback);
        } else {
            res.status(500).send('Error in insert new record');
        }
    })  
})

routes.get('/feedback', jsonParser, async function(req, res) {
    Feedback.findAll({ attributes: ['feedback', 'like']}).then(data => {
        res.status(200).send(data)
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving feedback records."
        })
    })
})

module.exports = routes;
