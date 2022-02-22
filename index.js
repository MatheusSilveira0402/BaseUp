const express = require('express');
const app = express();
const consign = require('consign')
const db = require('./config/db')
const bodyParser = require('body-parser')



app.use(bodyParser.json());
app.db = db

app.use(express.urlencoded({ extended: true }))

consign()
    .then('./api/validation.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)


app.listen(8002, ()=>{
    console.log('backend executado...'.green)
})