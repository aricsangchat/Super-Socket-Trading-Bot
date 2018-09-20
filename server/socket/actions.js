/* eslint-disable no-inner-declarations */
const binance = require('../routes/lib/binanceConnect.js')
const _ = require('lodash')
const helpers = require('./helpers.js')
let bots = {}

const getChartData = (io) => {
  io.on('connection', function (socket) {
    console.log('Socket connected: ' + socket.id)
    socket.on('action', (action) => {
      console.log('Socket connected: ' + socket.id)
      if (action.type === 'server/getChart') {
        if (!bots.hasOwnProperty(action.data)) {
          bots[action.data] = new bot()
          bots[action.data].start(io, socket, action)
        } else {
          bots[action.data].start(io, socket, action)
        }
        // console.log('server/getChart', action.data, bots)
      } else if (action.type === 'server/engageRequest') {
        if (!bots.hasOwnProperty(action.data)) {
          bots[action.data] = new bot()
        }
        bots[action.data].changeEngage(!bots[action.data].engage)
        // console.log('server/engageRequest', action.data, bots)
      } else if (action.type === 'server/changeSpeed') {
        if (!bots.hasOwnProperty(action.data)) {
          bots[action.data] = new bot()
        }
        bots[action.data].changeSpeed(!bots[action.data].speed)
        // console.log('server/changeSpeed', action.data, bots)
      } else if (action.type === 'server/updateSettings') {
        if (!bots.hasOwnProperty(action.data.ticker)) {
          bots[action.data.ticker] = new bot()
        }
        bots[action.data.ticker].updateSettings(action.data.newSettings)
        // console.log('server/changeSpeed', action.data, bots)
      } else if (action.type === 'server/clearLeftOver') {
        bots[action.data].clearLeftOver()
      }
    })
  })
}

module.exports = { getChartData }

let bot = function () {
  this.engage = false
  this.speed = false
  this.bidAskMode = false
  this.decimalPlace = 4
  this.trend = []
  this.bluePercentageTrend = []
  this.orangePercentageTrend = []
  this.greenPercentageTrend = []
  this.orderTrend99 = []
  this.orderTrend97 = []
  this.orderTrend95 = []
  this.profit = {}
  this.settings = {
    tier1Qty: '',
    tier2Qty: '',
    tier3Qty: '',
    tier1MaxQty: '',
    tier2MaxQty: '',
    tier3MaxQty: '',
    conservativeTier1: '',
    conservativeTier2: '',
    conservativeTier3: '',
    aggressiveTier1: '',
    aggressiveTier2: '',
    aggressiveTier3: '',
    tier1MinProfit: '',
    tier2MinProfit: '',
    tier3MinProfit: ''
  }
  this.updateSettings = (newSettings) => {
    this.settings = newSettings
    console.log(this.settings)
  }
  this.clearLeftOver = () => {
    this.orderTrend99 = []
    this.orderTrend97 = []
    this.orderTrend95 = []
  }
  this.changeSpeed = (speed) => {
    this.speed = speed
  }
  this.changeBidAskMode = (bidAskMode) => {
    this.bidAskMode = bidAskMode
  }
  this.changeEngage = (engage) => {
    this.engage = engage
  }
  this.start = (io, socket, action) => {
    let chartData = null
    let that = this
    let i = 0
    binance.websockets.chart(action.data, '1m', (symbol, interval, chart) => {
      let tick = binance.last(chart)
      let last = chart[tick].close
      chartData = chart
      if (chart[tick].hasOwnProperty('isFinal') === false && i > 499) {
        console.log('ran')
        graphEma(parseFloat(chart[tick].close), Date.now(), io, action.data, last, socket, that)
      }
      // io.emit('botLog', 'Engage: ' + this.engage)
      // io.emit('botLog', 'Speed: ' + that.speed)
    })

    let timeOut = setTimeout(function () {
      Object.keys(chartData).map(function (key) {
        i++
        graphEma(parseFloat(chartData[key].close), parseFloat(key), io, action.data, null, socket, that)
      })
    }, 4000)

    let closetrace1 = {
      x: [],
      y: [],
      mode: 'markers',
      name: 'Cost'
    }
    let closetrace2 = {
      x: [],
      y: [],
      mode: 'lines',
      name: 'EMA-7'
    }
    let closetrace3 = {
      x: [],
      y: [],
      mode: 'lines',
      name: 'EMA-25'
    }
    let closetrace4 = {
      x: [],
      y: [],
      mode: 'lines',
      name: 'EMA-99'
    }
    let closetrace5 = {
      x: [],
      y: [],
      mode: 'markers',
      name: 'Buy'
    }
    let closetrace6 = {
      x: [],
      y: [],
      mode: 'markers',
      name: 'Sell'
    }

    function graphEma (close, time, io, ticker, last, socket, that) {
      let closeData = [ closetrace1, closetrace2, closetrace3, closetrace4, closetrace5, closetrace6 ]
      if (closetrace1.x.length > 2) {
        closetrace1.x.push(time)
        closetrace1.y.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
        closetrace2.x.push(time)
        closetrace2.y.push(helpers.calculateMovingAverage(close,closetrace2.y[closetrace2.y.length - 1], 7))
        closetrace3.x.push(time)
        closetrace3.y.push(helpers.calculateMovingAverage(close,closetrace3.y[closetrace3.y.length - 1], 25))
        closetrace4.x.push(time)
        closetrace4.y.push(helpers.calculateMovingAverage(close,closetrace4.y[closetrace4.y.length - 1], 99))
        mapPercentage(closetrace1.y, closetrace2.y, closetrace3.y, closetrace4.y, closetrace5.y, closetrace6.y, time, close, io, ticker, that)
        declareTrend(closetrace1.y, closetrace2.y, closetrace3.y, closetrace4.y, closetrace5.y, closetrace6.y, time, close, that)
      } else {
        closetrace1.x.push(time)
        closetrace1.y.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
        closetrace2.x.push(time)
        closetrace2.y.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
        closetrace3.x.push(time)
        closetrace3.y.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
        closetrace4.x.push(time)
        closetrace4.y.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
        mapPercentage(closetrace1.y, closetrace2.y, closetrace3.y, closetrace4.y, closetrace5.y, closetrace6.y, time, close, io, ticker, that)
        declareTrend(closetrace1.y, closetrace2.y, closetrace3.y, closetrace4.y, closetrace5.y, closetrace6.y, time, close, that)
      }

      handleBuySell(time, close, last, ticker, that, closetrace1.x.length)

      that.profit.bought = _.sum(closetrace5.y).toFixed(2)
      that.profit.sold = _.sum(closetrace6.y).toFixed(2)
      that.profit.total = parseFloat(_.sum(closetrace6.y)) - parseFloat(_.sum(closetrace5.y))
      that.profit.total = that.profit.total.toFixed(2)
      // console.log('Total Bought:', _.sum(closetrace5.y))
      // console.log('Total Sold:', _.sum(closetrace6.y))
      // console.log('Total Profit:', parseFloat(_.sum(closetrace6.y)) - parseFloat(_.sum(closetrace5.y)))
      console.log(closetrace1.x.length)
      if (closetrace1.x.length > 499) {
        socket.emit('action', { type: 'CLIENT_BOT_LOG', data: { name: ticker, data: that.profit } })
        // io.emit('chart', closeData, ticker+'_Ema_Close')
        socket.emit('action', { type: 'CLIENT_GET_TICKER_CHART', data: { name: ticker, emaData: closeData } })
      }
    }

    function declareTrend (trace1, trace2, trace3, trace4, trace5, trace6, time, close, that) {
      if (trace2[trace2.length - 1] > trace3[trace3.length - 1] && trace3[trace3.length - 1] > trace4[trace4.length - 1]) {
        that.trend.push('up')
      } else if (trace2[trace2.length - 1] < trace3[trace3.length - 1] && trace3[trace3.length - 1] < trace4[trace4.length - 1]) {
        that.trend.push('down')
      }

      if (that.trend.length > 5) {
        that.trend.shift()
      }
    }

    let percentageTrace2Trace3 = {
      x: [],
      y: [],
      mode: 'markers',
      name: '7/25'
    }
    let percentageTrace2Trace4 = {
      x: [],
      y: [],
      mode: 'markers',
      name: '7/99'
    }
    let percentageTrace3Trace4 = {
      x: [],
      y: [],
      mode: 'markers',
      name: '25/99'
    }

    function mapPercentage (trace1, trace2, trace3, trace4, trace5, trace6, time, close, io, ticker, that) {
      let percentageData = [ percentageTrace2Trace3, percentageTrace2Trace4, percentageTrace3Trace4 ]
      percentageTrace2Trace3.x.push(time)
      percentageTrace2Trace3.y.push(parseFloat(trace2[trace2.length - 1]) / parseFloat(trace3[trace3.length - 1]) * 100)
      percentageTrace2Trace4.x.push(time)
      percentageTrace2Trace4.y.push(parseFloat(trace2[trace2.length - 1]) / parseFloat(trace4[trace4.length - 1]) * 100)
      percentageTrace3Trace4.x.push(time - 0)
      percentageTrace3Trace4.y.push(parseFloat(trace3[trace3.length - 1]) / parseFloat(trace4[trace4.length - 1]) * 100)
      declarePercentageTrend(percentageTrace2Trace3.y, that.bluePercentageTrend)
      declarePercentageTrend(percentageTrace2Trace4.y, that.orangePercentageTrend)
      declarePercentageTrend(percentageTrace3Trace4.y, that.greenPercentageTrend)
      // io.emit('chart', percentageData, ticker + '_Dip_Indicator')
      if (trace1.length > 499) {
        socket.emit('action', { type: 'CLIENT_GET_INDICATOR_CHART', data: { name: ticker, indicatorData: percentageData } })
      }
    }

    function declarePercentageTrend (trace, trend) {
      if (trace[trace.length - 1] > trace[trace.length - 2]) {
        trend.push('up')
      } else {
        trend.push('down')
      }
      if (trend.length > 60) {
        trend.shift()
      }
    }

    let openOrders99 = []
    let openOrders97 = []
    let openOrders95 = []

    function handleBuySell (time, close, last, ticker, that, dataLength) {
      let speed = helpers.setTradeSpeed(that.speed, that.settings)
      // ***            *** \\
      //   Sell Settings    \\
      // ***            *** \\\
      if (that.bluePercentageTrend[that.bluePercentageTrend.length - 1] === 'up' && (that.bluePercentageTrend[that.bluePercentageTrend.length - 1] === 'up' && percentageTrace2Trace3.y[percentageTrace2Trace3.y.length - 1] > 99)) {
        // sell openOrders 99
        that.orderTrend99.forEach((boughtOrder, i) => {
          if (parseFloat(parseFloat(close).toFixed(that.decimalPlace)) > parseFloat(boughtOrder) + parseFloat(that.settings.tier1MinProfit)) {
            closetrace6.x.push(time)
            closetrace6.y.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
            that.orderTrend99[i] = null
            if (that.engage === true) {
              binance.marketSell(ticker, parseFloat(that.settings.tier1Qty))
              // placeSellOrder(close, 1)
            }
          }
        })
        that.orderTrend99.forEach(order => {
          if (order !== null) {
            openOrders99.push(order)
          }
        })
        that.orderTrend99 = openOrders99
        openOrders99 = []

        // sell openOrders 97
        that.orderTrend97.forEach((boughtOrder, i) => {
          if (parseFloat(parseFloat(close).toFixed(that.decimalPlace)) > parseFloat(boughtOrder) + parseFloat(that.settings.tier2MinProfit)) {
            for (let index = 0; index < parseFloat(that.settings.tier2Qty); index++) {
              closetrace6.x.push(time)
              closetrace6.y.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
            }
            that.orderTrend97[i] = null
            if (that.engage === true) {
              binance.marketSell(ticker, parseFloat(that.settings.tier2Qty))
              // placeSellOrder(close, 5)
            }
          }
        })
        that.orderTrend97.forEach(order => {
          if (order !== null) {
            openOrders97.push(order)
          }
        })
        that.orderTrend97 = openOrders97
        openOrders97 = []

        // sell openOrders 95
        that.orderTrend95.forEach((boughtOrder, i) => {
          if (parseFloat(parseFloat(close).toFixed(that.decimalPlace)) > parseFloat(boughtOrder) + parseFloat(that.settings.tier3MinProfit)) {
            for (let index = 0; index < parseFloat(that.settings.tier3Qty); index++) {
              closetrace6.x.push(time)
              closetrace6.y.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
            }
            that.orderTrend95[i] = null
            if (that.engage === true) {
              binance.marketSell(ticker, parseFloat(that.settings.tier3Qty))
              // placeSellOrder(close, 10)
            }
          }
        })
        that.orderTrend95.forEach(order => {
          if (order !== null) {
            openOrders95.push(order)
          }
        })
        that.orderTrend95 = openOrders95
        openOrders95 = []
      }
      // ***            *** \\
      //    Buy Settings    \\
      // ***            *** \\
      if (that.bluePercentageTrend[that.bluePercentageTrend.length - 1] === 'down' && (that.bluePercentageTrend[that.bluePercentageTrend.length - 2] === 'up' && percentageTrace2Trace3.y[percentageTrace2Trace3.y.length - 1] < speed.one)) {
        // buy 1 qty
        if (that.orderTrend99.length < parseFloat(that.settings.tier1MaxQty)) {
          that.orderTrend99.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
          closetrace5.x.push(time)
          closetrace5.y.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))

          if (that.engage === true) {
            binance.marketBuy(ticker, parseFloat(that.settings.tier1Qty))
            // placeBuyOrder(close, 1)
          }
        }
      }
      if (that.bluePercentageTrend[that.bluePercentageTrend.length - 1] === 'down' && (that.bluePercentageTrend[that.bluePercentageTrend.length - 2] === 'up' && percentageTrace2Trace3.y[percentageTrace2Trace3.y.length - 1] < speed.five)) {
        // buy 5 qty
        if (that.orderTrend97.length < parseFloat(that.settings.tier2MaxQty) - 1) {
          that.orderTrend97.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
          for (let index = 0; index < parseFloat(that.settings.tier2Qty); index++) {
            closetrace5.x.push(time)
            closetrace5.y.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
          }

          if (that.engage === true) {
            binance.marketBuy(ticker, parseFloat(that.settings.tier2Qty))
            // placeBuyOrder(close, 5)
          }
        }
      }
      if (that.bluePercentageTrend[that.bluePercentageTrend.length - 1] === 'down' && (that.bluePercentageTrend[that.bluePercentageTrend.length - 2] === 'down' && percentageTrace2Trace3.y[percentageTrace2Trace3.y.length - 1] < speed.ten)) {
        // buy 10 qty
        if (that.orderTrend95.length < parseFloat(that.settings.tier3MaxQty) - 1) {
          that.orderTrend95.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
          for (let index = 0; index < parseFloat(that.settings.tier3Qty); index++) {
            closetrace5.x.push(time)
            closetrace5.y.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
          }

          if (that.engage === true) {
            binance.marketBuy(ticker, parseFloat(that.settings.tier3Qty))
            // placeBuyOrder(close, 10)
          }
        }
      }
      let leftOverLog = {}
      leftOverLog.tier1Sum = _.sum(that.orderTrend99).toFixed(2)
      leftOverLog.tier1Avg = _.mean(that.orderTrend99).toFixed(2)
      leftOverLog.tier1Count = that.orderTrend99.length 
      leftOverLog.tier2Sum = _.sum(that.orderTrend97).toFixed(2) * that.settings.tier2Qty
      leftOverLog.tier2Avg = _.mean(that.orderTrend97).toFixed(2)
      leftOverLog.tier2Count = that.orderTrend97.length
      leftOverLog.tier3Sum = _.sum(that.orderTrend95).toFixed(2) * that.settings.tier3Qty
      leftOverLog.tier3Avg = _.mean(that.orderTrend95).toFixed(2)
      leftOverLog.tier3Count = that.orderTrend95.length
      // console.log('Tier 1', that.orderTrend99)
      // console.log('Tier 2', that.orderTrend97)
      // console.log('Tier 3', that.orderTrend95)
      if (dataLength > 499) {
        socket.emit('action', { type: 'CLIENT_LEFTOVER_LOG', data: { name: ticker, data: leftOverLog } })
      }
    }
  }
}
