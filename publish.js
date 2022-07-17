const { pactFile, consumerVersion } = require('./pact')

  // STEP 2: Publish to broker
const publishPacts = async () => {
  const publisher = require('@pact-foundation/pact-node')
  const opts = {
    pactFilesOrDirs: [pactFile],
    pactBroker: 'https://asdfasdfasdfasd.au',
    pactBrokerUsername: 'asdfasdfasdf',
    pactBrokerPassword: 'asfdasdfsadf',
    tags: ['repl'],
    consumerVersion,
  }

  publisher
    .publishPacts(opts)
    .then((res) => {
      console.log('Pact contract publishing complete!')
      console.log('')
      console.log('Head over to https://asdfasdfasdfasd.au/pacts/provider/GettingStartedOrderApi/consumer/GettingStartedOrderWeb/latest and login with')
      console.log('=> Username: asdfasdfasdf')
      console.log('=> Password: asfdasdfsadf')
      console.log('to see your published contracts.')
    })
    .catch(e => {
      console.log('Pact contract publishing failed :(. \n:', e)
    })
}

module.exports = {
  publishPacts,
}
