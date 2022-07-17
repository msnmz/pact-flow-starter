const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const server = express()

server.use(cors())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use((_, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8')
  next()
})

let dataStore = require('./data/orders.js')

server.get('/orders', (_, res) => {
  res.json(dataStore)
})

server.get('/orders/:id', (req, res) => {
  const id = +req.params.id;
  const order = dataStore.find(item => item.id === id)

  if (order) res.json(order)

  res.status(404).json({error:`Order with id (${id}) not found.`})
})

module.exports = {
  server,
  dataStore
}