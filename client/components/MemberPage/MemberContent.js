/* eslint-disable react/no-unused-prop-types */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  getTickersRequest,
  getTickerChartRequest,
  closeSocketRequest,
  engageRequest,
  changeSpeed
} from '../../redux/modules/binance'
import {
  getCurrentUserRequest,
  changeUserTickerSettings
} from '../../redux/modules/user'
import { string, func, object, array } from 'prop-types'
import TickerList from './TickerList.js'

class MemberContent extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount () {
    this.props.dispatchGetCurrentUser()
    this.props.dispatchGetTickers()
  }

  render () {
    return (
      <div>
        <h1 className='text-center page-title'>Members Only</h1>
        <h2 className='text-center'>Hi, {this.props.username}!</h2>
        <TickerList
          tickers={this.props.binance.tickers}
          dispatchGetTickerChartRequest={this.props.dispatchGetTickerChartRequest}
          binance={this.props.binance}
          handleChangeOff={this.props.dispatchCloseSocketRequest}
          engageRequest={this.props.dispatchEngageRequest}
          changeSpeed={this.props.dispatchchangeSpeed}
          dispatchchangeUserTickerSettings={this.props.dispatchchangeUserTickerSettings}
          userSettings={this.props.userSettings}
        />
      </div>
    )
  }
}
MemberContent.propTypes = {
  username: string,
  dispatchGetTickers: func,
  binance: object,
  dispatchGetTickerChartRequest: func,
  dispatchCloseSocketRequest: func,
  dispatchEngageRequest: func,
  dispatchchangeSpeed: func,
  dispatchchangeUserTickerSettings: func,
  dispatchGetCurrentUser: func,
  userSettings: array
}

const mapStateToProps = state => {
  return {
    binance: state.binance,
    userSettings: state.user.settings
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatchGetCurrentUser () {
      dispatch(getCurrentUserRequest())
    },
    dispatchGetTickers () {
      dispatch(getTickersRequest())
    },
    dispatchGetTickerChartRequest (ticker) {
      dispatch(getTickerChartRequest(ticker))
    },
    dispatchCloseSocketRequest (ticker) {
      dispatch(closeSocketRequest(ticker))
    },
    dispatchEngageRequest (ticker) {
      dispatch(engageRequest(ticker))
    },
    dispatchchangeSpeed (ticker) {
      dispatch(changeSpeed(ticker))
    },
    dispatchchangeUserTickerSettings (ticker, newSettings) {
      dispatch(changeUserTickerSettings(ticker, newSettings))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberContent)
