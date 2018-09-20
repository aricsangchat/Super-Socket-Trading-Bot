const Binance = require('node-binance-api')
const config = require('../../../config.json')

const binance = new Binance().options({
  APIKEY: config.BINANCE_KEY,
  APISECRET: config.BINANCE_SECRET,
  useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
  test: false // If you want to use sandbox mode where orders are simulated
})

module.exports = binance
