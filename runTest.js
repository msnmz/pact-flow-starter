module.exports = {
  runTests: async dirs => {
    const Mocha = require('mocha')
    const fs = require('fs')
    const path = require('path')

    // Instantiate a Mocha instance.
    const mocha = new Mocha()
    // Add spec files
    dirs.forEach(dir => fs.readdirSync(`${__dirname}/${dir}`)
    .filter(file => file.endsWith('spec.js'))
    .forEach(file => mocha.addFile(path.join(`${__dirname}/${dir}`, file))))

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
