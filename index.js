const express = require('express')
const app = express()
require('dotenv').config()
app.set('view engine', 'hbs')
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.render('index', {
    secretKey: process.env.SECRET_KEY,
    secondKey: process.env.SECOND_KEY
  })
})

app.post('/', (req, res) => {
  res.render('index', {
    secretKey: process.env.SECRET_KEY,
    secondKey: process.env.SECOND_KEY
  })
})

app.listen(process.env.PORT || 3000, () => {
  console.log('listening on port 3000')
})
