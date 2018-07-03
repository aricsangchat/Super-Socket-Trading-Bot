module.exports = {
  settingName: 'Socket Trader',
  ticker: 'BNBUSDT',
  mainCurrency: 'USDT',
  secCurrency: 'BNB',
  cancelBuyCron: '0,5,10,15,20,25,30,35,40,45,50,55 * * * *',
  minSpread: 0.0200,
  spreadProfit: 0.0200,
  minProfit: 0.0300,
  decimalPlace: 4,
  avlToStart: 20,
  avlMax: 21,
  buyPad: 0.000000,
  sellPad: 0.000000,
  quantity: 40,
  globalTrendQuantity: 40,
  buyPrice: null,
  buyOrderNum: null,
  sellOrderNum: null,
  sellPrice: null,
  state: null,
  bst: null,
  sst: null,
  bstLimit: 0.0000,
  sstLimit: -0.0200,
  sstLimitEnable: false,
  buySellPad: 0,
  buySellPadPercent: 0,
  time: 2,
  startingAverage: null,
  close: null,
  trend: [],
  ema25Trend: [],
  reset: false,
  queue: [],
  amountOfBuys: null,
  amountOfSells: null,
  bluePercentageTrend: [],
  orangePercentageTrend: [],
  greenPercentageTrend: [],
  orderTrend995: ['sold'],
  orderTrend99: [],
  orderTrend97: [],
  orderTrend95: [],
  orderTrend985: ['sold'],
  orderTrend98: ['sold'],
  orderTrend975: ['sold'],
  orderTrendUpNDown: [],
  tradeSpeed: 'conservative',
  tradeSpeedObj: {
    one: 99.00,
    five: 98.90,
    ten: 98.80,
  },
  engage: false,
  outputCommand: (io, command) => {
    const helpers = require('./helpers/helpers.js');

    if (command === 'manual sell') {
      module.exports.orderTrend99 = [];
      module.exports.orderTrend97 = [];
      module.exports.orderTrend95 = [];
    } else if (command.includes('engage')) {
      let output = command.split(' ');
      module.exports.engage = output[1];
    } else if (command.includes('speed')) {
      let speed = command.split(' ');
      module.exports.tradeSpeedObj = helpers.setTradeSpeed(speed[1])
      module.exports.tradeSpeed = speed[1]
    }
    console.log(command);
  },
}