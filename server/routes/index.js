require('dotenv').config()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const request = require('request')
const routes = require('express').Router();

routes.get('/api/redmine_url', async function(req, res) {
    res.send(process.env.BASE_URL)
})

routes.post('/api/login', jsonParser, async function(req, res) {
    const baseUrlDomain = process.env.BASE_URL.split('://')[1]

    request(`https://${req.body.username}:${req.body.password}@${baseUrlDomain}users/current.json`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(response.body)
        } else {
            res.status(401).send(error)
        }
    })
})

routes.use('/api', async function(req, res) {
    req.pipe(request(process.env.BASE_URL + req.url)).pipe(res);
})

module.exports = routes;
