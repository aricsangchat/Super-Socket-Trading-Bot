const settings = require('./settings.js');

module.exports = {
  setTradeSpeed: (speed) => {
    if (speed === 'aggressive') {
      return {
        one: 99.90,
        five: 99.70,
        ten: 99.50,
      }
    } else if (speed === 'conservative') {
      return {
        one: 99.00,
        five: 98.90,
        ten: 98.80,
      }
    }
  },
  stopSockets: (io) => {
    let endpoints = binance.websockets.subscriptions();
    for ( let endpoint in endpoints ) {
      io.emit('botLog', 'Socket Endpoints: '+endpoint);
      console.log(endpoint);
      binance.websockets.terminate(endpoint);
    }
  },
  calculateMovingAverage: (price,prevEMA,time) => {
    if (prevEMA.length === 0) {
      return price * 2/(time+1) + price * (1-2/(time+1));
    } else {
      return price * 2/(time+1) + prevEMA * (1-2/(time+1));
    }
  }
}