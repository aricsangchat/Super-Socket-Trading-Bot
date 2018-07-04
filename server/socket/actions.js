/* eslint-disable no-inner-declarations */
const binance = require('../routes/lib/binanceConnect.js')
const _ = require('lodash')
const helpers = require('./helpers.js')
let bots = {}

const getChartData = (io) => {
  io.on('connection', function (socket) {
    console.log('Socket connected: ' + socket.id)
    socket.on('action', (action) => {
      if (action.type === 'server/getChart') {
        if (!bots.hasOwnProperty(action.data)) {
          bots[action.data] = new bot()
          bots[action.data].start(io, socket, action)
        } else {
          bots[action.data].start(io, socket, action)
        }
        console.log('server/getChart', action.data, bots)
      } else if (action.type === 'server/engageRequest') {
        if (!bots.hasOwnProperty(action.data)) {
          bots[action.data] = new bot()
        }
        bots[action.data].changeEngage(!bots[action.data].engage)
        console.log('server/engageRequest', action.data, bots)
      } else if (action.type === 'server/changeSpeed') {
        if (!bots.hasOwnProperty(action.data)) {
          bots[action.data] = new bot()
        }
        bots[action.data].changeSpeed(!bots[action.data].speed)
        console.log('server/changeSpeed', action.data, bots)
      }
    })
  })
}

module.exports = { getChartData }

let bot = function () {
  this.engage = false
  this.speed = false
  this.decimalPlace = 4
  this.trend = []
  this.bluePercentageTrend = []
  this.orangePercentageTrend = []
  this.greenPercentageTrend = []
  this.orderTrend99 = []
  this.orderTrend97 = []
  this.orderTrend95 = []
  this.changeSpeed = (speed) => {
    this.speed = speed
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
      if (chart[tick].hasOwnProperty('isFinal') === false && i > 999) {
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

      handleBuySell(time, close, last, ticker, that)

      let profit = {}
      profit.bought = _.sum(closetrace5.y)
      profit.sold = _.sum(closetrace6.y)
      profit.total = parseFloat(_.sum(closetrace6.y)) - parseFloat(_.sum(closetrace5.y))
      // console.log('Total Bought:', _.sum(closetrace5.y))
      // console.log('Total Sold:', _.sum(closetrace6.y))
      // console.log('Total Profit:', parseFloat(_.sum(closetrace6.y)) - parseFloat(_.sum(closetrace5.y)))
      socket.emit('action', { type: 'CLIENT_BOT_LOG', data: { name: ticker, data: profit } })
      // io.emit('chart', closeData, ticker+'_Ema_Close')
      socket.emit('action', { type: 'CLIENT_GET_TICKER_CHART', data: { name: ticker, emaData: closeData } })
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
      socket.emit('action', { type: 'CLIENT_GET_INDICATOR_CHART', data: { name: ticker, indicatorData: percentageData } })
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

    function handleBuySell (time, close, last, ticker, that) {
      let speed = helpers.setTradeSpeed(that.speed)
      // ***            *** \\
      //   Sell Settings    \\
      // ***            *** \\\
      if (that.bluePercentageTrend[that.bluePercentageTrend.length - 1] === 'up' && (that.bluePercentageTrend[that.bluePercentageTrend.length - 1] === 'up' && percentageTrace2Trace3.y[percentageTrace2Trace3.y.length - 1] > 99)) {
        // sell openOrders 99
        that.orderTrend99.forEach((boughtOrder, i) => {
          if (parseFloat(parseFloat(close).toFixed(that.decimalPlace)) > parseFloat(boughtOrder) + 0.06) {
            closetrace6.x.push(time)
            closetrace6.y.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
            that.orderTrend99[i] = null
            if (that.engage === true) {
              // binance.marketSell(ticker, 1)
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
          if (parseFloat(parseFloat(close).toFixed(that.decimalPlace)) > parseFloat(boughtOrder) + 0.07) {
            for (let index = 0; index < 5; index++) {
              closetrace6.x.push(time)
              closetrace6.y.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
            }
            that.orderTrend97[i] = null
            if (that.engage === true) {
              // binance.marketSell(ticker, 5)
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
          if (parseFloat(parseFloat(close).toFixed(that.decimalPlace)) > parseFloat(boughtOrder) + 0.08) {
            for (let index = 0; index < 10; index++) {
              closetrace6.x.push(time)
              closetrace6.y.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
            }
            that.orderTrend95[i] = null
            if (that.engage === true) {
              // binance.marketSell(ticker, 10)
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
        if (that.orderTrend99.length < 10) {
          that.orderTrend99.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
          closetrace5.x.push(time)
          closetrace5.y.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))

          if (that.engage === true) {
            // binance.marketBuy(ticker, 1)
            // placeBuyOrder(close, 1)
          }
        }
      }
      if (that.bluePercentageTrend[that.bluePercentageTrend.length - 1] === 'down' && (that.bluePercentageTrend[that.bluePercentageTrend.length - 2] === 'up' && percentageTrace2Trace3.y[percentageTrace2Trace3.y.length - 1] < speed.five)) {
        // buy 5 qty
        if (that.orderTrend97.length < 4) {
          that.orderTrend97.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
          for (let index = 0; index < 5; index++) {
            closetrace5.x.push(time)
            closetrace5.y.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
          }

          if (that.engage === true) {
            // binance.marketBuy(ticker, 5)
            // placeBuyOrder(close, 5)
          }
        }
      }
      if (that.bluePercentageTrend[that.bluePercentageTrend.length - 1] === 'down' && (that.bluePercentageTrend[that.bluePercentageTrend.length - 2] === 'down' && percentageTrace2Trace3.y[percentageTrace2Trace3.y.length - 1] < speed.ten)) {
        // buy 10 qty
        if (that.orderTrend95.length < 4) {
          that.orderTrend95.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
          for (let index = 0; index < 10; index++) {
            closetrace5.x.push(time)
            closetrace5.y.push(parseFloat(parseFloat(close).toFixed(that.decimalPlace)))
          }

          if (that.engage === true) {
            // binance.marketBuy(ticker, 10)
            // placeBuyOrder(close, 10)
          }
        }
      }
      let leftOverLog = {}
      leftOverLog.tier1 = that.orderTrend99
      leftOverLog.tier2 = that.orderTrend97
      leftOverLog.tier3 = that.orderTrend95
      // console.log('Tier 1', that.orderTrend99)
      // console.log('Tier 2', that.orderTrend97)
      // console.log('Tier 3', that.orderTrend95)
      socket.emit('action', { type: 'CLIENT_LEFTOVER_LOG', data: { name: ticker, data: leftOverLog } })
    }
  }
}
