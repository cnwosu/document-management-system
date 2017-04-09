exports.config = {  
  framework: 'mocha',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl: 'http://localhost:3000',
  specs: ['./components/**/*.js'],
  onPrepare: () => {
    browser.ignoreSynchronization = true
    var width = 2250
    var height = 1200
    browser.driver.manage().window().setSize(width, height)

    require('babel-register')
    require('./setup')
  },
  mochaOpts: {
    enableTimeouts: false,
  },
  allScriptsTimeout: 15000,
};
