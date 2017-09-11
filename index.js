const express = require('express')
const app = express()
require('dotenv').config()
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  res.render('index', {
    secretKey: process.env.SECRET_KEY
  })
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})
