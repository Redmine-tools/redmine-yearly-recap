require('dotenv').config()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const request = require('request')
const routes = require('express').Router()
const sqlite3 = require('sqlite3')
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
  
const apicache = require('apicache')
let cache = apicache.options({
    appendKey: (req, res) => req.get('X-Redmine-API-Key').slice(4, 12)
}).middleware

const onlyStatus200 = (req, res) => res.statusCode === 200

// TODO: nem lenne jó kiemelni a Handler-eket típus szerint külön fájlba?

// FIXME: docs
routes.get('/api/redmine_url', cache('5 minutes', onlyStatus200), async function(req, res) {
    res.send(process.env.BASE_URL)
})

routes.get('/api/feedback/:id', jsonParser, async function(req, res) {
    return await Feedback.findAll({
        where: {
            user: req.params.id
        }}).then((data) => {
            res.send(data[0]?.isNewRecord)
        })
})

routes.post('/api/feedback', jsonParser, async function(req, res) {
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

routes.get('/api/feedback', jsonParser, async function(req, res) {
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

routes.post('/api/login', jsonParser, async function(req, res) {
    const baseUrlDomain = process.env.BASE_URL.split('://')[1]

    request(`https://${req.body.username}:${req.body.password}@${baseUrlDomain}users/current.json`, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.send(response.body)
        } else {
            res.statusCode = 401;
            res.send('None shall pass');
        }
    })
})

routes.use('/api', cache('5 minutes', onlyStatus200), async function(req, res) {
    req.pipe(request(process.env.BASE_URL + req.url)).pipe(res);
})

module.exports = routes;
