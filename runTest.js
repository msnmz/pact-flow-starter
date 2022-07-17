module.exports = {
  runTests: async testType => {
    const Mocha = require('mocha')
    const fs = require('fs')
    const path = require('path')

    // Instantiate a Mocha instance.
    const mocha = new Mocha()
    const testDir = `${__dirname}/${testType}`

    // Add spec files
    fs.readdirSync(testDir)
      .filter(file => file.endsWith('spec.js'))
      .forEach(file => mocha.addFile(path.join(testDir, file)))

    mocha.timeout(45000)
    mocha.run(failures => {
      if (failures) {
        console.log(
          `test failed`
        )
        process.exit(1)
      } else {
        console.log(
          `test passed!`
        )
        process.exit(0)
      }
    })
  },
}
