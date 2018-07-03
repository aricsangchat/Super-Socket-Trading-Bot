import React, { Component } from 'react'
import { string, func, bool } from 'prop-types'
import { connect } from 'react-redux'
import PlotlyChart from './PlotlyChart'

class Switch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      checked: false
    }
  }

  handleChange () {
    this.setState({
      checked: !this.state.checked
    })
    if (!this.state.checked) {
      this.props.handleChange(this.props.ticker)
    }
  }

  renderPlotly () {
    if (this.props.renderPlotly && this.state.checked) {
      return <PlotlyChart id={`${this.props.ticker}-plotly`} ticker={this.props.ticker} />;
    }
  }

  render () {
    return (
      <div>
        <p>{this.props.title}</p>
        <div aria-label='Switch One' className='switch'>
          <label className='switch__label' htmlFor={this.props.id}>
            <input
              role='switch'
              type='checkbox'
              className='switch__input'
              id={this.props.id}
              checked={this.state.checked ? 'true' : false}
              onChange={() => this.handleChange()}
            />
            <span className='switch__text' data-on='ON' data-off='OFF' />
            <span className='switch__handle' />
          </label>
        </div>
        {this.renderPlotly()}
      </div>
    )
  }
}

Switch.propTypes = {
  id: string,
  title: string,
  handleChange: func,
  ticker: string,
  renderPlotly: bool
}

const mapStateToProps = state => {
  return {
    binance: state.binance
  }
}

export default connect(mapStateToProps, null)(Switch)
