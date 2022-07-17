// Let's use async/await
;(async () => {
  const { runTests } = require('./runTest.js')
  await runTests([
    'consumer-orders',
    'consumer-users',
    'provider-orders',
    'provider-users'
    ])
})()
