/* eslint-disable no-undef */
import React from 'react'
import { string, object } from 'prop-types'

const PlotlyChart = props => {
  function renderPlot () {
    const chartDataCopy = props.binance.chartData
    const indicatorDataCopy = props.binance.indicatorData
    const element = document.getElementById(props.id)
    const chartLayout = {
      title: props.id,
      aspectmode: 'cube'
    }

    if (props.type === 'ema') {
      chartDataCopy.map(chart => {
        if (chart.name === props.ticker && (chart.emaData[0].x.length > 999 && chart.hasOwnProperty('emaData'))) {
          return Plotly.react(element, chart.emaData, chartLayout)
        }
      })
    } else if (props.type === 'indicator') {
      indicatorDataCopy.map(chart => {
        if (chart.name === props.ticker && (chart.indicatorData[0].x.length > 999 && chart.hasOwnProperty('indicatorData'))) {
          return Plotly.react(element, chart.indicatorData, chartLayout)
        }
      })
    }
  }

  return (
    <div id={props.id}>
      {renderPlot()}
    </div>
  )
}

PlotlyChart.propTypes = {
  id: string,
  ticker: string,
  type: string,
  binance: object
}

export default PlotlyChart
