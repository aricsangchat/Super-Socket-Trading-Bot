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
      if (prop.includes('USDT')) {
        usdtArr.push(prop)
      }
      // console.log(`obj.${prop} = ${tickers[prop]}`)
    }

    res.json(usdtArr)
  })
})

module.exports = router
