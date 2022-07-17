const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { eachLike, like } = require('@pact-foundation/pact').Matchers
const { User } = require('../provider-users/user')
const expect = chai.expect
const { fetchUsers, fetchUserById } = require('../provider-users/userClient')
const { createProvider } = require('../pact')
chai.use(chaiAsPromised)

const consumerName = 'UserWeb'
const providerName = 'UserAPI'
const provider = createProvider(consumerName, providerName)

describe('Pact with User API', () => {
  // Start the mock service on a randomly available port,
  // and set the API mock service port so clients can dynamically
  // find the endpoint
  before(() =>
    provider.setup().then(opts => {
      process.env.API_PORT = opts.port
    })
  )
  afterEach(() => provider.verify())

  describe('given there are users', () => {
    const userProperties = {
      id: 1,
      name: 'john',
      surname: 'doe',
      age: 10
    }

    describe('when a call to the /users API is made', () => {
      before(() => {
        return provider.addInteraction({
          state: 'there are users', // what is it in the server?
          uponReceiving: 'a request for users', // what will i send?
          withRequest: {
            path: '/users',
            method: 'GET',
          },
          willRespondWith: {
            body: eachLike(userProperties),
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
            },
          },
        })
      })

      it('should return all orders', () => {
        return expect(fetchUsers()).to.eventually.have.deep.members([
          new User(userProperties.id, userProperties.name, userProperties.surname, userProperties.age),
        ])
      })
    })

    describe('when a call to the /users/1 API is made', () => {
      before(() => {
        return provider.addInteraction({
          state: 'there are users',
          uponReceiving: 'a request for user with id 1',
          withRequest: {
            path: '/users/1',
            method: 'GET',
          },
          willRespondWith: {
            body: like(userProperties),
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
            },
          },
        })
      })

      it('should return user with id 1', () => {
        return expect(fetchUserById(1)).to.eventually.deep.equal(new User(userProperties.id, userProperties.name, userProperties.surname, userProperties.age))
      })
    })
  })

  // Write pact files to file
  after(() => {
    return provider.finalize()
  })
})
