import axios from 'axios'

const DEFAULT_STATE = {
  tickers: [],
  chartData: [],
  indicatorData: [],
  log: [],
  leftOverLog: []
}

// ******* Action Types *******

const GET_TICKERS = 'GET_TICKERS'

// ******* Action Creators & Reducers *******

export function getTickersRequest () {
  return dispatch => {
    return axios.get(`/api/binance/get-all-tickers`).then(tickers => {
      dispatch(getTickers(tickers.data))
    })
  }
}

export function getTickers (tickers) {
  return { type: GET_TICKERS, tickers }
}
function getTickersReducer (state, action) {
  return Object.assign({}, state, { tickers: action.tickers })
}

export function getTickerChartRequest (ticker) {
  return dispatch => {
    dispatch({ type: 'server/getChart', data: ticker })
  }
}

function getTickerChartReducer (state, action) {
  const copy = state.chartData
  const index = copy.findIndex(obj => obj.name === action.data.name)
  if (index === -1) {
    return {
      tickers: [...state.tickers],
      chartData: state.chartData.concat(action.data),
      indicatorData: [...state.indicatorData],
      log: [...state.log],
      leftOverLog: [...state.leftOverLog]
    }
  } else {
    return {
      tickers: [...state.tickers],
      chartData: [
        ...state.chartData.slice(0, index), // everything before current post
        action.data,
        ...state.chartData.slice(index + 1) // everything after current post
      ],
      indicatorData: [...state.indicatorData],
      log: [...state.log],
      leftOverLog: [...state.leftOverLog]
    }
  }
}

function getTickerIndicatorReducer (state, action) {
  const copy = state.chartData
  const index = copy.findIndex(obj => obj.name === action.data.name)
  if (index === -1) {
    return {
      tickers: [...state.tickers],
      chartData: [...state.chartData],
      indicatorData: state.indicatorData.concat(action.data),
      log: [...state.log],
      leftOverLog: [...state.leftOverLog]
    }
  } else {
    return {
      tickers: [...state.tickers],
      chartData: [...state.chartData],
      indicatorData: [
        ...state.indicatorData.slice(0, index), // everything before current post
        action.data,
        ...state.indicatorData.slice(index + 1) // everything after current post
      ],
      log: [...state.log],
      leftOverLog: [...state.leftOverLog]
    }
  }
}

export function closeSocketRequest (ticker) {
  return dispatch => {
    return axios.post(`/api/binance/close-web-socket`, {
      params: {
        ticker: ticker
      }
    }).then(res => {
    })
  }
}

export function engageRequest (ticker) {
  return dispatch => {
    dispatch({ type: 'server/engageRequest', data: ticker })
  }
}

export function changeSpeed (ticker) {
  return dispatch => {
    dispatch({ type: 'server/changeSpeed', data: ticker })
  }
}

export function changeBidAskMode (ticker) {
  return dispatch => {
    dispatch({ type: 'server/changeBidAskMode', data: ticker })
  }
}

export function clearLeftOver (ticker) {
  return dispatch => {
    dispatch({ type: 'server/clearLeftOver', data: ticker })
  }
}

function botLogReducer (state, action) {
  const copy = state.log
  const index = copy.findIndex(obj => obj.name === action.data.name)
  if (index === -1) {
    return {
      tickers: [...state.tickers],
      chartData: [...state.chartData],
      indicatorData: [...state.indicatorData],
      log: state.log.concat(action.data),
      leftOverLog: [...state.leftOverLog]
    }
  } else {
    return {
      tickers: [...state.tickers],
      chartData: [...state.chartData],
      indicatorData: [...state.indicatorData],
      log: [
        ...state.log.slice(0, index), // everything before current post
        action.data,
        ...state.log.slice(index + 1) // everything after current post
      ],
      leftOverLog: [...state.leftOverLog]
    }
  }
}

function leftOverLogReducer (state, action) {
  const copy = state.leftOverLog
  const index = copy.findIndex(obj => obj.name === action.data.name)
  if (index === -1) {
    return {
      tickers: [...state.tickers],
      chartData: [...state.chartData],
      indicatorData: [...state.indicatorData],
      log: [...state.log],
      leftOverLog: state.leftOverLog.concat(action.data)
    }
  } else {
    return {
      tickers: [...state.tickers],
      chartData: [...state.chartData],
      indicatorData: [...state.indicatorData],
      log: [...state.log],
      leftOverLog: [
        ...state.leftOverLog.slice(0, index), // everything before current post
        action.data,
        ...state.leftOverLog.slice(index + 1) // everything after current post
      ]
    }
  }
}

export default function binance (state = DEFAULT_STATE, action) {
  switch (action.type) {
  case GET_TICKERS:
    return getTickersReducer(state, action)
  case 'CLIENT_GET_TICKER_CHART':
    return getTickerChartReducer(state, action)
  case 'CLIENT_GET_INDICATOR_CHART':
    return getTickerIndicatorReducer(state, action)
  case 'CLIENT_BOT_LOG':
    return botLogReducer(state, action)
  case 'CLIENT_LEFTOVER_LOG':
    return leftOverLogReducer(state, action)
  default:
    return state
  }
}
