const pact = require('@pact-foundation/pact')
const Pact = pact.Pact
const path = require('path')
const process = require('process')

const getPactFileName = (consumerName, providerName) => path.resolve(
  `./pacts/${consumerName}-${providerName}.json`.toLowerCase()
)

const createProvider = (consumerName, providerName) => new Pact({
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'FATAL',
  host: "0.0.0.0",
  consumer: consumerName,
  provider: providerName,
})

// used to kill any left over mock server instances in case of errors
process.on('SIGINT', () => {
  pact.removeAllServers()
})

module.exports = {
  createProvider,
  getPactFileName,
  consumerVersion: '1.0.0',
}
