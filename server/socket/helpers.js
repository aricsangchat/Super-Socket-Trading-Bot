module.exports = {
  setTradeSpeed: (speed, settings) => {
    if (speed) {
      return {
        one: parseFloat(settings.aggressiveTier1),
        five: parseFloat(settings.aggressiveTier2),
        ten: parseFloat(settings.aggressiveTier3)
      }
    } else {
      return {
        one: parseFloat(settings.conservativeTier1),
        five: parseFloat(settings.conservativeTier2),
        ten: parseFloat(settings.conservativeTier3)
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
