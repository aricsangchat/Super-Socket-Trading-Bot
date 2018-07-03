import React from 'react'
import { array, func } from 'prop-types'
import Switch from './Switch'
import PlotlyChart from './PlotlyChart'

const TickerList = props => {
  function renderTickers (tickers) {
    return tickers.map(ticker => {
      return (
        <div className='container' key={ticker}>
          <h3>{ticker}</h3>
          <Switch id={`${ticker}-chart`} title='Get Chart' handleChangeOn={props.dispatchGetTickerChartRequest} handleChangeOff={props.handleChangeOff} ticker={ticker} renderPlotly />
          <Switch id={`${ticker}-engage`} title='Engage Trading' handleChangeOn={props.engageRequest} handleChangeOff={props.engageRequest} ticker={ticker} />
          <Switch id={`${ticker}-speed`} title='Aggressive Mode' handleChangeOn={props.changeSpeed} handleChangeOff={props.changeSpeed} ticker={ticker} />
          <PlotlyChart id={`${ticker}-ema-chart`} ticker={ticker} binance={props.binance} type='ema' />
          <PlotlyChart id={`${ticker}-indicator-chart`} ticker={ticker} binance={props.binance} type='indicator' />
          <hr />
        </div>
      )
    })
  }
  return (
    renderTickers(props.tickers)
  )
}

TickerList.propTypes = {
  tickers: array,
  handleChangeOff: func
}

export default TickerList
