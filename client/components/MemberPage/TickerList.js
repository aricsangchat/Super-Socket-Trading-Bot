import React from 'react'
import { array } from 'prop-types'
import Switch from './Switch'
import PlotlyChart from './PlotlyChart'

const TickerList = props => {
  function renderTickers (tickers) {
    return tickers.map(ticker => {
      return (
        <div className='container' key={ticker}>
          <h3>{ticker}</h3>
          <Switch id={`${ticker}-chart`} title='Get Chart' handleChange={props.dispatchGetTickerChartRequest} ticker={ticker} renderPlotly />
          <Switch id={`${ticker}-engage`} title='Engage Trading' />
          <Switch id={`${ticker}-speed`} title='Aggressive Mode' />
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
  tickers: array
}

export default TickerList
