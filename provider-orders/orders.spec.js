const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const getPort = require('get-port')
const { server, dataStore } = require('./provider.js')
const { Order } = require('./order')
const { fetchOrders, fetchOrderById } = require('./orderClient')
const expect = chai.expect
chai.use(chaiAsPromised)

describe('Orders API', () => {
  before(async () => {
    const port = await getPort()
    process.env.API_PORT = port

    server.listen(port, () => {
      console.log(`Provider service listening on http://localhost:${port}`)
    })
  })

  it('should return all orders', () => {
    return expect(fetchOrders()).to.eventually.have.deep.members(dataStore.reduce((acc, o) => {
      acc.push(new Order(o.id, o.items))
      return acc
    }, []))
  })

  it('should return order with id 1', () => {
    return expect(fetchOrderById(1)).to.eventually.deep.equal(dataStore.find(item => item.id === 1))
  })
})
