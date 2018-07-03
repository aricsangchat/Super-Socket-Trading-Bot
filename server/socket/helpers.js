module.exports = {
  setTradeSpeed: (speed) => {
    if (speed) {
      return {
        one: 99.90,
        five: 99.70,
        ten: 99.50
      }
    } else {
      return {
        one: 99.00,
        five: 98.90,
        ten: 98.80
      }
    }
  },
  calculateMovingAverage: (price, prevEMA, time) => {
    if (prevEMA.length === 0) {
      return price * 2 / (time + 1) + price * (1 - 2 / (time + 1))
    } else {
      return price * 2 / (time + 1) + prevEMA * (1 - 2 / (time + 1))
    }
  }
}
