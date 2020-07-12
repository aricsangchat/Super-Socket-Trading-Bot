import React from 'react'
import { object, string } from 'prop-types'

const Log = props => {
  function renderProfitLog () {
    if (props.binance.hasOwnProperty('log')) {
      return props.binance.log.map(log => {
        if (log.name.includes(props.ticker)) {
          return (
            <table key={log.name} className='table table-dark'>
              <thead>
                <tr>
                  <th scope='col'>Sold</th>
                  <th scope='col'>Bought</th>
                  <th scope='col'>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{log.data.sold}</td>
                  <td>{log.data.bought}</td>
                  <td>{log.data.total}</td>
                </tr>
              </tbody>
            </table>
          )
        }
      })
    } else { return <div /> }
  }
  function renderLeftOverLog () {
    if (props.binance.hasOwnProperty('leftOverLog')) {
      return props.binance.leftOverLog.map(log => {
        if (log.name.includes(props.ticker)) {
          return (
            <table key={log.name} className='table table-dark'>
              <thead>
                <tr>
                  <th scope='col' />
                  <th scope='col'>Count</th>
                  <th scope='col'>Sum</th>
                  <th scope='col'>Avg</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope='row'>Tier 1</th>
                  <td>{log.data.tier1Count}</td>
                  <td>{log.data.tier1Sum}</td>
                  <td>{log.data.tier1Avg}</td>
                </tr>
                <tr>
                  <th scope='row'>Tier 2</th>
                  <td>{log.data.tier2Count}</td>
                  <td>{log.data.tier2Sum}</td>
                  <td>{log.data.tier2Avg}</td>
                </tr>
                <tr>
                  <th scope='row'>Tier 3</th>
                  <td>{log.data.tier3Count}</td>
                  <td>{log.data.tier3Sum}</td>
                  <td>{log.data.tier3Avg}</td>
                </tr>
              </tbody>
            </table>
          )
        }
      })
    } else { return <div /> }
  }
  return (
    <div>
      {renderProfitLog()}
      {renderLeftOverLog()}
    </div>
  )
}

Log.propTypes = {
  binance: object,
  ticker: string
}

export default Log
