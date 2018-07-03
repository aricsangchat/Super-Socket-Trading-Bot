/* eslint-disable react/no-unused-prop-types */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  getTickersRequest,
  getTickerChartRequest
} from '../../redux/modules/binance'
import { string, func, object } from 'prop-types'
import TickerList from './TickerList.js'

class MemberContent extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount () {
    this.props.dispatchGetTickers()
  }

  render () {
    return (
      <div>
        <h1 className='text-center page-title'>Members Only</h1>
        <h2 className='text-center'>Hi, {this.props.username}!</h2>
        <TickerList tickers={this.props.binance.tickers} dispatchGetTickerChartRequest={this.props.dispatchGetTickerChartRequest} binance={this.props.binance} />
      </div>
    )
  }
}
MemberContent.propTypes = {
  username: string,
  dispatchGetTickers: func,
  binance: object,
  dispatchGetTickerChartRequest: func
}

const mapStateToProps = state => {
  return {
    binance: state.binance
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatchGetTickers () {
      dispatch(getTickersRequest())
    },
    dispatchGetTickerChartRequest (ticker) {
      dispatch(getTickerChartRequest(ticker))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberContent)
