import React from 'react'
import { array, func } from 'prop-types'
import Switch from './Switch'
import PlotlyChart from './PlotlyChart'
import Log from './Log'
import Settings from './Settings'

const TickerList = props => {
  function renderTickers (tickers) {
    return tickers.map(ticker => {
      return (
        <div className='container' key={ticker}>
          <div className='row'>
            <div className='col-sm-12 col-md-2'>
              <h3>{ticker}</h3>
              <Switch id={`${ticker}-chart`} title='Get Chart' handleChangeOn={props.dispatchGetTickerChartRequest} handleChangeOff={props.handleChangeOff} ticker={ticker} renderPlotly />
              <Switch id={`${ticker}-engage`} title='Engage Trading' handleChangeOn={props.engageRequest} handleChangeOff={props.engageRequest} ticker={ticker} />
              <Switch id={`${ticker}-speed`} title='Aggressive Mode' handleChangeOn={props.changeSpeed} handleChangeOff={props.changeSpeed} ticker={ticker} />
            </div>
            <div className='col-sm-12 col-md-6'>
              <Settings dispatchchangeUserTickerSettings={props.dispatchchangeUserTickerSettings} ticker={ticker} />
            </div>
            <div className='col-sm-12 col-md-4'>
              <Log binance={props.binance} ticker={ticker} />
            </div>
          </div>
          <div>
            <PlotlyChart id={`${ticker}-ema-chart`} ticker={ticker} binance={props.binance} type='ema' />
            <PlotlyChart id={`${ticker}-indicator-chart`} ticker={ticker} binance={props.binance} type='indicator' />
          </div>
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
