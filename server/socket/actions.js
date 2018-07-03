/* eslint-disable no-inner-declarations */
const binance = require('../routes/lib/binanceConnect.js')
const _ = require('lodash')
const settings = require('./settings.js')
const helpers = require('./helpers.js')
let bots = {}

const getChartData = (io) => {
  io.on('connection', function (socket) {
    console.log('Socket connected: ' + socket.id)
    socket.on('action', (action) => {
      if (action.type === 'server/getChart') {
        console.log('server/getChart', action.data)
        bots[action.data] = bot
        bots[action.data].start(io, socket, action)
        // socket.emit('action', { type: 'CLIENT_GET_TICKER_CHART', data: { name: action.data } })
      } else if (action.type === 'server/engageRequest') {
        bots[action.data] = bot
        console.log('server/engageRequest', action.data, bots)
        bots[action.data].engage = !bots[action.data].engage
        console.log(bots[action.data].engage)
        // socket.emit('action', { type: 'CLIENT_GET_TICKER_CHART', data: { name: action.data } })
      } else if (action.type === 'server/changeSpeed') {
        bots[action.data] = bot
        console.log('server/changeSpeed', action.data, bots)
        bots[action.data].speed = !bots[action.data].speed
        console.log(bots[action.data].speed)
        // socket.emit('action', { type: 'CLIENT_GET_TICKER_CHART', data: { name: action.data } })
      }
    })
  })
}

module.exports = { getChartData }

const bot = {
  engage: false,
  speed: false,
  start: function (io, socket, action) {
    let chartData = null
    let that = this
    binance.websockets.chart(action.data, '1m', (symbol, interval, chart) => {
      let tick = binance.last(chart)
      let last = chart[tick].close
      chartData = chart
      if (chart[tick].hasOwnProperty('isFinal') === false && chartData.length > 999) {
        graphEma(parseFloat(chart[tick].close), Date.now(), io, action.data, last, socket, that)
      }
      // io.emit('botLog', 'Engage: ' + this.engage)
      // io.emit('botLog', 'Speed: ' + settings.tradeSpeed)
    })

    let timeOut = setTimeout(function () {
      Object.keys(chartData).map(function (key) {
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
        closetrace1.y.push(parseFloat(parseFloat(close).toFixed(settings.decimalPlace)))
        closetrace2.x.push(time)
        closetrace2.y.push(helpers.calculateMovingAverage(close,closetrace2.y[closetrace2.y.length - 1], 7))
        closetrace3.x.push(time)
        closetrace3.y.push(helpers.calculateMovingAverage(close,closetrace3.y[closetrace3.y.length - 1], 25))
        closetrace4.x.push(time)
        closetrace4.y.push(helpers.calculateMovingAverage(close,closetrace4.y[closetrace4.y.length - 1], 99))
        mapPercentage(closetrace1.y, closetrace2.y, closetrace3.y, closetrace4.y, closetrace5.y, closetrace6.y, time, close, io, ticker)
        declareTrend(closetrace1.y, closetrace2.y, closetrace3.y, closetrace4.y, closetrace5.y, closetrace6.y, time, close)
      } else {
        closetrace1.x.push(time)
        closetrace1.y.push(parseFloat(parseFloat(close).toFixed(settings.decimalPlace)))
        closetrace2.x.push(time)
        closetrace2.y.push(parseFloat(parseFloat(close).toFixed(settings.decimalPlace)))
        closetrace3.x.push(time)
        closetrace3.y.push(parseFloat(parseFloat(close).toFixed(settings.decimalPlace)))
        closetrace4.x.push(time)
        closetrace4.y.push(parseFloat(parseFloat(close).toFixed(settings.decimalPlace)))
        mapPercentage(closetrace1.y, closetrace2.y, closetrace3.y, closetrace4.y, closetrace5.y, closetrace6.y, time, close, io, ticker)
        declareTrend(closetrace1.y, closetrace2.y, closetrace3.y, closetrace4.y, closetrace5.y, closetrace6.y, time, close)
      }

      handleBuySell(time, close, last, ticker, that)

      console.log('Total Bought:', _.sum(closetrace5.y))
      console.log('Total Sold:', _.sum(closetrace6.y))
      console.log('Total Profit:', parseFloat(_.sum(closetrace6.y)) - parseFloat(_.sum(closetrace5.y)))
      // io.emit('chart', closeData, ticker+'_Ema_Close')
      socket.emit('action', { type: 'CLIENT_GET_TICKER_CHART', data: { name: ticker, emaData: closeData } })
    }

    function declareTrend (trace1, trace2, trace3, trace4, trace5, trace6, time, close) {
      if (trace2[trace2.length - 1] > trace3[trace3.length - 1] && trace3[trace3.length - 1] > trace4[trace4.length - 1]) {
        settings.trend.push('up')
      } else if (trace2[trace2.length - 1] < trace3[trace3.length - 1] && trace3[trace3.length - 1] < trace4[trace4.length - 1]) {
        settings.trend.push('down')
      }

      if (settings.trend.length > 5) {
        settings.trend.shift()
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

    function mapPercentage (trace1, trace2, trace3, trace4, trace5, trace6, time, close, io, ticker) {
      let percentageData = [ percentageTrace2Trace3, percentageTrace2Trace4, percentageTrace3Trace4 ]
      percentageTrace2Trace3.x.push(time)
      percentageTrace2Trace3.y.push(parseFloat(trace2[trace2.length - 1]) / parseFloat(trace3[trace3.length - 1]) * 100)
      percentageTrace2Trace4.x.push(time)
      percentageTrace2Trace4.y.push(parseFloat(trace2[trace2.length - 1]) / parseFloat(trace4[trace4.length - 1]) * 100)
      percentageTrace3Trace4.x.push(time - 0)
      percentageTrace3Trace4.y.push(parseFloat(trace3[trace3.length - 1]) / parseFloat(trace4[trace4.length - 1]) * 100)
      declarePercentageTrend(percentageTrace2Trace3.y, settings.bluePercentageTrend)
      declarePercentageTrend(percentageTrace2Trace4.y, settings.orangePercentageTrend)
      declarePercentageTrend(percentageTrace3Trace4.y, settings.greenPercentageTrend)
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
      if (settings.bluePercentageTrend[settings.bluePercentageTrend.length - 1] === 'up' && (settings.bluePercentageTrend[settings.bluePercentageTrend.length - 1] === 'up' && percentageTrace2Trace3.y[percentageTrace2Trace3.y.length - 1] > 99)) {
        // sell openOrders 99
        settings.orderTrend99.forEach((boughtOrder, i) => {
          if (parseFloat(parseFloat(close).toFixed(settings.decimalPlace)) > parseFloat(boughtOrder) + 0.06) {
            closetrace6.x.push(time)
            closetrace6.y.push(parseFloat(parseFloat(close).toFixed(settings.decimalPlace)))
            settings.orderTrend99[i] = null
            if (that.engage === true) {
              // binance.marketSell(settings.ticker, 1)
              // placeSellOrder(close, 1)
            }
          }
        })
        settings.orderTrend99.forEach(order => {
          if (order !== null) {
            openOrders99.push(order)
          }
        })
        settings.orderTrend99 = openOrders99
        openOrders99 = []

        // sell openOrders 97
        settings.orderTrend97.forEach((boughtOrder, i) => {
          if (parseFloat(parseFloat(close).toFixed(settings.decimalPlace)) > parseFloat(boughtOrder) + 0.07) {
            for (let index = 0; index < 5; index++) {
              closetrace6.x.push(time)
              closetrace6.y.push(parseFloat(parseFloat(close).toFixed(settings.decimalPlace)))
            }
            settings.orderTrend97[i] = null
            if (that.engage === true) {
              // binance.marketSell(settings.ticker, 5)
              // placeSellOrder(close, 5)
            }
          }
        })
        settings.orderTrend97.forEach(order => {
          if (order !== null) {
            openOrders97.push(order)
          }
        })
        settings.orderTrend97 = openOrders97
        openOrders97 = []

        // sell openOrders 95
        settings.orderTrend95.forEach((boughtOrder, i) => {
          if (parseFloat(parseFloat(close).toFixed(settings.decimalPlace)) > parseFloat(boughtOrder) + 0.08) {
            for (let index = 0; index < 10; index++) {
              closetrace6.x.push(time)
              closetrace6.y.push(parseFloat(parseFloat(close).toFixed(settings.decimalPlace)))
            }
            settings.orderTrend95[i] = null
            if (that.engage === true) {
              // binance.marketSell(settings.ticker, 10)
              // placeSellOrder(close, 10)
            }
          }
        })
        settings.orderTrend95.forEach(order => {
          if (order !== null) {
            openOrders95.push(order)
          }
        })
        settings.orderTrend95 = openOrders95
        openOrders95 = []
      }
      // ***            *** \\
      //    Buy Settings    \\
      // ***            *** \\
      if (settings.bluePercentageTrend[settings.bluePercentageTrend.length - 1] === 'down' && (settings.bluePercentageTrend[settings.bluePercentageTrend.length - 2] === 'up' && percentageTrace2Trace3.y[percentageTrace2Trace3.y.length - 1] < speed.one)) {
        // buy 1 qty
        if (settings.orderTrend99.length < 10) {
          settings.orderTrend99.push(parseFloat(parseFloat(close).toFixed(settings.decimalPlace)))
          closetrace5.x.push(time)
          closetrace5.y.push(parseFloat(parseFloat(close).toFixed(settings.decimalPlace)))

          if (that.engage === true) {
            // binance.marketBuy(settings.ticker, 1)
            // placeBuyOrder(close, 1)
          }
        }
      }
      if (settings.bluePercentageTrend[settings.bluePercentageTrend.length - 1] === 'down' && (settings.bluePercentageTrend[settings.bluePercentageTrend.length - 2] === 'up' && percentageTrace2Trace3.y[percentageTrace2Trace3.y.length - 1] < speed.five)) {
        // buy 5 qty
        if (settings.orderTrend97.length < 4) {
          settings.orderTrend97.push(parseFloat(parseFloat(close).toFixed(settings.decimalPlace)))
          for (let index = 0; index < 5; index++) {
            closetrace5.x.push(time)
            closetrace5.y.push(parseFloat(parseFloat(close).toFixed(settings.decimalPlace)))
          }

          if (that.engage === true) {
            // binance.marketBuy(settings.ticker, 5)
            // placeBuyOrder(close, 5)
          }
        }
      }
      if (settings.bluePercentageTrend[settings.bluePercentageTrend.length - 1] === 'down' && (settings.bluePercentageTrend[settings.bluePercentageTrend.length - 2] === 'down' && percentageTrace2Trace3.y[percentageTrace2Trace3.y.length - 1] < speed.ten)) {
        // buy 10 qty
        if (settings.orderTrend95.length < 4) {
          settings.orderTrend95.push(parseFloat(parseFloat(close).toFixed(settings.decimalPlace)))
          for (let index = 0; index < 10; index++) {
            closetrace5.x.push(time)
            closetrace5.y.push(parseFloat(parseFloat(close).toFixed(settings.decimalPlace)))
          }

          if (that.engage === true) {
            // binance.marketBuy(settings.ticker, 10)
            // placeBuyOrder(close, 10)
          }
        }
      }
      console.log('Tier 1', settings.orderTrend99)
      console.log('Tier 2', settings.orderTrend97)
      console.log('Tier 3', settings.orderTrend95)
    }
  }
}
