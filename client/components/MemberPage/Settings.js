import React from 'react'
import { string, func, array } from 'prop-types'
import OnLoad from './OnLoad'
const Settings = props => {
  function handleSubmit (e) {
    e.preventDefault()
    const newSettings = {
      tier1Qty: document.getElementById(props.ticker + 'tier1Qty').value,
      tier2Qty: document.getElementById(props.ticker + 'tier2Qty').value,
      tier3Qty: document.getElementById(props.ticker + 'tier3Qty').value,
      tier1MaxQty: document.getElementById(props.ticker + 'tier1MaxQty').value,
      tier2MaxQty: document.getElementById(props.ticker + 'tier2MaxQty').value,
      tier3MaxQty: document.getElementById(props.ticker + 'tier3MaxQty').value,
      conservativeTier1: document.getElementById(props.ticker + 'conservativeTier1').value,
      conservativeTier2: document.getElementById(props.ticker + 'conservativeTier2').value,
      conservativeTier3: document.getElementById(props.ticker + 'conservativeTier3').value,
      aggressiveTier1: document.getElementById(props.ticker + 'aggressiveTier1').value,
      aggressiveTier2: document.getElementById(props.ticker + 'aggressiveTier2').value,
      aggressiveTier3: document.getElementById(props.ticker + 'aggressiveTier3').value,
      tier1MinProfit: document.getElementById(props.ticker + 'tier1MinProfit').value,
      tier2MinProfit: document.getElementById(props.ticker + 'tier2MinProfit').value,
      tier3MinProfit: document.getElementById(props.ticker + 'tier3MinProfit').value
    }
    props.dispatchchangeUserTickerSettings(props.ticker, newSettings)
  }
  function returnTickerSetting (field) {
    let exists = false
    let tickerSetting = {}
    props.userSettings.forEach(setting => {
      if (setting.ticker === props.ticker) {
        exists = true
        tickerSetting = setting.newSettings
      }
    })
    if (exists) {
      return tickerSetting[field]
    } else {
      return ''
    }
  }
  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className='form-row'>
          <div className='form-group col-md-3'>
            <label htmlFor={`${props.ticker}tier1Qty`}>tier1Qty</label>
            <input type='text' className='form-control' id={`${props.ticker}tier1Qty`} placeholder='tier1Qty' defaultValue={returnTickerSetting('tier1Qty')} />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor={`${props.ticker}tier2Qty`}>tier2Qty</label>
            <input type='text' className='form-control' id={`${props.ticker}tier2Qty`} placeholder='tier2Qty' defaultValue={returnTickerSetting('tier2Qty')} />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor={`${props.ticker}tier3Qty`}>tier3Qty</label>
            <input type='text' className='form-control' id={`${props.ticker}tier3Qty`} placeholder='tier3Qty' defaultValue={returnTickerSetting('tier3Qty')} />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor={`${props.ticker}tier1MaxQty`}>tier1MaxQty</label>
            <input type='text' className='form-control' id={`${props.ticker}tier1MaxQty`} placeholder='tier1MaxQty' defaultValue={returnTickerSetting('tier1MaxQty')} />
          </div>
        </div>
        <div className='form-row'>
          <div className='form-group col-md-3'>
            <label htmlFor={`${props.ticker}tier2MaxQty`}>tier2MaxQty</label>
            <input type='text' className='form-control' id={`${props.ticker}tier2MaxQty`} placeholder='tier2MaxQty' defaultValue={returnTickerSetting('tier2MaxQty')} />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor={`${props.ticker}tier3MaxQty`}>tier3MaxQty</label>
            <input type='text' className='form-control' id={`${props.ticker}tier3MaxQty`} placeholder='tier3MaxQty' defaultValue={returnTickerSetting('tier3MaxQty')} />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor={`${props.ticker}conservativeTier1`}>conservativeTier1</label>
            <input type='text' className='form-control' id={`${props.ticker}conservativeTier1`} placeholder='conservativeTier1' defaultValue={returnTickerSetting('conservativeTier1')} />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor={`${props.ticker}conservativeTier2`}>conservativeTier2</label>
            <input type='text' className='form-control' id={`${props.ticker}conservativeTier2`} placeholder='conservativeTier2' defaultValue={returnTickerSetting('conservativeTier2')} />
          </div>
        </div>
        <div className='form-row'>
          <div className='form-group col-md-3'>
            <label htmlFor={`${props.ticker}conservativeTier3`}>conservativeTier3</label>
            <input type='text' className='form-control' id={`${props.ticker}conservativeTier3`} placeholder='conservativeTier3' defaultValue={returnTickerSetting('conservativeTier3')} />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor={`${props.ticker}aggressiveTier1`}>aggressiveTier1</label>
            <input type='text' className='form-control' id={`${props.ticker}aggressiveTier1`} placeholder='aggressiveTier1' defaultValue={returnTickerSetting('aggressiveTier1')} />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor={`${props.ticker}aggressiveTier2`}>aggressiveTier2</label>
            <input type='text' className='form-control' id={`${props.ticker}aggressiveTier2`} placeholder='aggressiveTier2' defaultValue={returnTickerSetting('aggressiveTier2')} />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor={`${props.ticker}aggressiveTier3`}>aggressiveTier3</label>
            <input type='text' className='form-control' id={`${props.ticker}aggressiveTier3`} placeholder='aggressiveTier3' defaultValue={returnTickerSetting('aggressiveTier3')} />
          </div>
        </div>
        <div className='form-row'>
          <div className='form-group col-md-3'>
            <label htmlFor={`${props.ticker}tier1MinProfit`}>tier1MinProfit</label>
            <input type='text' className='form-control' id={`${props.ticker}tier1MinProfit`} placeholder='tier1MinProfit' defaultValue={returnTickerSetting('tier1MinProfit')} />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor={`${props.ticker}tier2MinProfit`}>tier2MinProfit</label>
            <input type='text' className='form-control' id={`${props.ticker}tier2MinProfit`} placeholder='tier2MinProfit' defaultValue={returnTickerSetting('tier2MinProfit')} />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor={`${props.ticker}tier3MinProfit`}>tier3MinProfit</label>
            <input type='text' className='form-control' id={`${props.ticker}tier3MinProfit`} placeholder='tier3MinProfit' defaultValue={returnTickerSetting('tier3MinProfit')} />
          </div>
        </div>
        <button type='submit' className='btn btn-primary'>Update</button>
      </form>
    </div>
  )
}
Settings.propTypes = {
  ticker: string,
  dispatchchangeUserTickerSettings: func,
  userSettings: array
}

export default Settings
