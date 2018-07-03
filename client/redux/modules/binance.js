import axios from 'axios'

const DEFAULT_STATE = {
  tickers: [],
  chartData: []
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
      chartData: state.chartData.concat(action.data)
    }
  } else {
    return {
      tickers: [...state.tickers],
      chartData: [
        ...state.chartData.slice(0, index), // everything before current post
        action.data,
        ...state.chartData.slice(index + 1) // everything after current post
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
  default:
    return state
  }
}