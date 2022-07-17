const request = require('superagent')
const { Order } = require('./order')

const fetchOrders = () => {
  return request.get(`http://localhost:${process.env.API_PORT}/orders`).then(
    res => {
      return res.body.reduce((acc, o) => {
        acc.push(new Order(o.id, o.items))
        return acc
      }, [])
    },
    err => {
      throw new Error(`Error from response: ${err.body}`)
    }
  )
}

const fetchOrderById = (orderId) => {
  return request.get(`http://localhost:${process.env.API_PORT}/orders/${orderId}`).then(
    res => {
      const {id, items, error} = res.body;

      if (error) return {error}

      return new Order(id, items)
    }
  )
}


module.exports = {
  fetchOrders,
  fetchOrderById
}
