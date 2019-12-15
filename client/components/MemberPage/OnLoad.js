import React from 'react'
import { string, func } from 'prop-types'
const OnLoad = props => {
  function handleSubmit () {
    const newSettings = {
      tier1Qty: document.getElementById(props.ticker + 'tier1Qty').value,
      tier2Qty: document.getElementById(props.ticker + 'tier2Qty').value,
      tier3Qty: document.getElementById(props.ticker + 'tier3Qty').value,
      tier1MaxQty: document.getElementById(props.ticker + 'tier1MaxQty').value,
      tier2MaxQty: document.getElementById(props.ticker + 'tier2MaxQty').value,
      tier3MaxQty: document.getElementById(props.ticker + 'tier3MaxQty').value,
      conservativeTier1: document.getElementById(props.ticker + 'conservativeTier1').value,
      conservativeTier2: document.getElementById(props.ticker + 'conservativeTier2').value,
      conservativeTier3: document.getElementById(props.ticker + 'conservativeTier3').value,
      aggressiveTier1: document.getElementById(props.ticker + 'aggressiveTier1').value,
      aggressiveTier2: document.getElementById(props.ticker + 'aggressiveTier2').value,
      aggressiveTier3: document.getElementById(props.ticker + 'aggressiveTier3').value,
      tier1MinProfit: document.getElementById(props.ticker + 'tier1MinProfit').value,
      tier2MinProfit: document.getElementById(props.ticker + 'tier2MinProfit').value,
      tier3MinProfit: document.getElementById(props.ticker + 'tier3MinProfit').value
    }
    props.dispatchchangeUserTickerSettings(props.ticker, newSettings)
  }
  return (
    <div>
      {handleSubmit()}
    </div>
  )
}
OnLoad.propTypes = {
  ticker: string,
  dispatchchangeUserTickerSettings: func
}

export default OnLoad
