const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { eachLike, like } = require('@pact-foundation/pact').Matchers
const { Order } = require('../provider-orders/order')
const expect = chai.expect
const { fetchOrders, fetchOrderById } = require('../provider-orders/orderClient')
const { createProvider } = require('../pact')
chai.use(chaiAsPromised)

const consumerName = 'OrderWeb'
const providerName = 'OrderAPI'
const provider = createProvider(consumerName, providerName)

describe('Pact with Order API', () => {
  // Start the mock service on a randomly available port,
  // and set the API mock service port so clients can dynamically
  // find the endpoint
  before(() =>
    provider.setup().then(opts => {
      process.env.API_PORT = opts.port
    })
  )
  afterEach(() => provider.verify())

  describe('given there are orders', () => {
    const itemProperties = {
      name: 'burger',
      quantity: 2,
      value: 100,
    }

    const orderProperties = {
      id: 1,
      items: eachLike(itemProperties),
    }

    describe('when a call to the /orders API is made', () => {
      before(() => {
        return provider.addInteraction({
          state: 'there are orders', // what is it in the server?
          uponReceiving: 'a request for orders', // what will i send?
          withRequest: {
            path: '/orders',
            method: 'GET',
          },
          willRespondWith: {
            body: eachLike(orderProperties),
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
            },
          },
        })
      })

      it('should return all orders', () => {
        return expect(fetchOrders()).to.eventually.have.deep.members([
          new Order(orderProperties.id, [itemProperties]),
        ])
      })
    })

    describe('when a call to the /orders/1 API is made', () => {
      before(() => {
        return provider.addInteraction({
          state: 'there are orders',
          uponReceiving: 'a request for order with id 1',
          withRequest: {
            path: '/orders/1',
            method: 'GET',
          },
          willRespondWith: {
            body: like(orderProperties),
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
            },
          },
        })
      })

      it('should return order with id 1', () => {
        return expect(fetchOrderById(1)).to.eventually.deep.equal(new Order(orderProperties.id, [itemProperties]))
      })
    })
  })

  // Write pact files to file
  after(() => {
    return provider.finalize()
  })
})
