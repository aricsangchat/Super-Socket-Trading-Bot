import React, { Component } from 'react'
import { string, object } from 'prop-types'
import { connect } from 'react-redux'

class PlotlyChart extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
  }

  renderPlot () {
    const copy = this.props.binance.chartData
    const element = document.getElementById(this.props.id)
    const chartLayout = { 
      title: this.props.ticker + ' EMA',
      aspectmode: 'cube'
    }

    copy.map(chart => {
      if (chart.name === this.props.ticker && chart.data[0].x.length > 999) {
        return Plotly.react(element, chart.data, chartLayout)
      }
    })
  }

  render () {
    return (
      <div>
        {this.renderPlot()}
      </div>
    )
  }
}

PlotlyChart.propTypes = {
  id: string,
  ticker: string,
  binance: object
}

const mapStateToProps = state => {
  return {
    binance: state.binance
  }
}

export default connect(mapStateToProps, null)(PlotlyChart)
