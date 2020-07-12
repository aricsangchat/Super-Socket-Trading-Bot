const express = require('express')
const router = express.Router()
const binance = require('./lib/binanceConnect.js')

/**
 * GET '/api/binance/get-all-tickers'
 *
 * Gets the latest price of all tickers
 */

router.get('/get-all-tickers', (req, res) => {
  binance.prices((error, tickers) => {
    if (error) {
      return res.status(500).json({
        errors: {
          server: 'Get All Tickers',
          error: error
        }
      })
    }

    let usdtArr = []

    for (const prop in tickers) {
      if (prop.includes('BNBUSDT')) {
        usdtArr.push(prop)
      }
      // console.log(`obj.${prop} = ${tickers[prop]}`)
    }

    res.json(usdtArr)
  })
})

router.post('/close-web-socket', (req, res) => {
  // console.log(req.body.params.ticker)
  let endpoints = binance.websockets.subscriptions()
  for (let endpoint in endpoints) {
    if (endpoint.includes(req.body.params.ticker.toLowerCase())) {
      // console.log(endpoint)
      binance.websockets.terminate(endpoint)
      res.status(200)
    }
  }
})

module.exports = router
