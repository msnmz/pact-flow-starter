const Verifier = require('@pact-foundation/pact').Verifier
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const getPort = require('get-port')
const { server, dataStore } = require('./provider.js')
const { User } = require('./user')
const { fetchUsers, fetchUserById } = require('./userClient')
const expect = chai.expect
chai.use(chaiAsPromised)
const { getPactFileName } = require('../pact.js')

const consumerName = 'UserWeb'
const providerName = 'UserAPI'

describe('Users API', () => {
  before(async () => {
    const port = await getPort()
    process.env.API_PORT = port

    opts = {
      provider: providerName,
      providerBaseUrl: `http://localhost:${port}`,
      pactUrls: [getPactFileName(consumerName, providerName)], // if you don't use a broker
      tags: ['prod'],
      providerVersion: '1.0.' + process.env.HOSTNAME,
    }

    server.listen(port, () => {
      console.log(`Provider service listening on http://localhost:${port}`)
    })
  })

  it('should validate the expectations of User Web', () => {
    return new Verifier()
      .verifyProvider(opts)
      .then(output => {
        console.log('Pact Verification Complete!')
        console.log(output)
      })
      .catch(e => {
        console.error('Pact verification failed :(', e)
      })
  })

  it('should return all users', () => {
    return expect(fetchUsers()).to.eventually.have.deep.members(dataStore.reduce((acc, o) => {
      acc.push(new User(o.id, o.name, o.surname, o.age))
      return acc
    }, []))
  })

  it('should return user with id 1', () => {
    return expect(fetchUserById(1)).to.eventually.deep.equal(dataStore.find(item => item.id === 1))
  })
})
