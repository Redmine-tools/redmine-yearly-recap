require('dotenv').config()
const express = require('express')

const cors = require('cors')
const routes = require('./routes');

const port = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use('/', routes);

app.listen(port, () => {})
