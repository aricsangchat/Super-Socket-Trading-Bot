import React from 'react'
import { array } from 'prop-types'

const Log = props => {
  function renderProfitLog () {
    if (props.binance.hasOwnProperty('log')) {
      return props.binance.log.map(log => {
        if (log.name === props.ticker) {
          return (
            <table key={log.name} className="table table-dark">
              <tbody>
                <tr>
                  <th scope="row">Total Bought</th>
                  <td>{log.data.bought}</td>
                </tr>
                <tr>
                  <th scope="row">Total Sold</th>
                  <td>{log.data.sold}</td>
                </tr>
                <tr>
                  <th scope="row">Total</th>
                  <td>{log.data.total}</td>
                </tr>
              </tbody>
            </table>
          )
        }
      })
    } else {return <div />}
  }
  function renderLeftOverLog () {
    if (props.binance.hasOwnProperty('leftOverLog')) {
      return props.binance.leftOverLog.map(log => {
        if (log.name === props.ticker) {
          return (
            <table key={log.name} className="table table-dark">
              <tbody>
                <tr>
                  <th scope="row">Tier 1</th>
                  <td>{log.data.tier1}</td>
                </tr>
                <tr>
                  <th scope="row">Tier 2</th>
                  <td>{log.data.tier2}</td>
                </tr>
                <tr>
                  <th scope="row">Tier 3</th>
                  <td>{log.data.tier3}</td>
                </tr>
              </tbody>
            </table>
          )
        }
      })
    } else {return <div />}
  }
  return (
    <div>
      {renderProfitLog()}
      {renderLeftOverLog()}
    </div>
  )
}

Log.propTypes = {
  data: array
}

export default Log
