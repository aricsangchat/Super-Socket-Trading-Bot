const express = require('express')
const router = express.Router()
const binance = require('./lib/binanceConnect.js')

/**
 * GET '/api/binance/get-all-tickers'
 *
 * Gets a logged in user's username, email, password
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
    res.json(tickers)
  })
})

module.exports = router
