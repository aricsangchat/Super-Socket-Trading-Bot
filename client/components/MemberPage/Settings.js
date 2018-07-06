import React from 'react'
import { string, func } from 'prop-types'

const Settings = props => {
  function handleSubmit (e) {
    e.preventDefault()
    const newSettings = {
      tier1Qty: document.getElementById('tier1Qty').value,
      tier2Qty: document.getElementById('tier2Qty').value,
      tier3Qty: document.getElementById('tier3Qty').value,
      tier1MaxQty: document.getElementById('tier1MaxQty').value,
      tier2MaxQty: document.getElementById('tier2MaxQty').value,
      tier3MaxQty: document.getElementById('tier3MaxQty').value,
      conservativeTier1: document.getElementById('conservativeTier1').value,
      conservativeTier2: document.getElementById('conservativeTier2').value,
      conservativeTier3: document.getElementById('conservativeTier3').value,
      aggressiveTier1: document.getElementById('aggressiveTier1').value,
      aggressiveTier2: document.getElementById('aggressiveTier2').value,
      aggressiveTier3: document.getElementById('aggressiveTier3').value,
      tier1MinProfit: document.getElementById('tier1MinProfit').value,
      tier2MinProfit: document.getElementById('tier2MinProfit').value,
      tier3MinProfit: document.getElementById('tier3MinProfit').value
    }
    debugger
    props.dispatchchangeUserTickerSettings(props.ticker, newSettings)
  }
  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className='form-row'>
          <div className='form-group col-md-3'>
            <label htmlFor='tier1Qty'>tier1Qty</label>
            <input type='text' className='form-control' id='tier1Qty' placeholder='tier1Qty' />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='tier2Qty'>tier2Qty</label>
            <input type='text' className='form-control' id='tier2Qty' placeholder='tier2Qty' />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='tier3Qty'>tier3Qty</label>
            <input type='text' className='form-control' id='tier3Qty' placeholder='tier3Qty' />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='tier1MaxQty'>tier1MaxQty</label>
            <input type='text' className='form-control' id='tier1MaxQty' placeholder='tier1MaxQty' />
          </div>
        </div>
        <div className='form-row'>
          <div className='form-group col-md-3'>
            <label htmlFor='tier2MaxQty'>tier2MaxQty</label>
            <input type='text' className='form-control' id='tier2MaxQty' placeholder='tier2MaxQty' />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='tier3MaxQty'>tier3MaxQty</label>
            <input type='text' className='form-control' id='tier3MaxQty' placeholder='tier3MaxQty' />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='conservativeTier1'>conservativeTier1</label>
            <input type='text' className='form-control' id='conservativeTier1' placeholder='conservativeTier1' />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='conservativeTier2'>conservativeTier2</label>
            <input type='text' className='form-control' id='conservativeTier2' placeholder='conservativeTier2' />
          </div>
        </div>
        <div className='form-row'>
          <div className='form-group col-md-3'>
            <label htmlFor='conservativeTier3'>conservativeTier3</label>
            <input type='text' className='form-control' id='conservativeTier3' placeholder='conservativeTier3' />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='aggressiveTier1'>aggressiveTier1</label>
            <input type='text' className='form-control' id='aggressiveTier1' placeholder='aggressiveTier1' />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='aggressiveTier2'>aggressiveTier2</label>
            <input type='text' className='form-control' id='aggressiveTier2' placeholder='aggressiveTier2' />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='aggressiveTier3'>aggressiveTier3</label>
            <input type='text' className='form-control' id='aggressiveTier3' placeholder='aggressiveTier3' />
          </div>
        </div>
        <div className='form-row'>
          <div className='form-group col-md-3'>
            <label htmlFor='tier1MinProfit'>tier1MinProfit</label>
            <input type='text' className='form-control' id='tier1MinProfit' placeholder='tier1MinProfit' />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='tier2MinProfit'>tier2MinProfit</label>
            <input type='text' className='form-control' id='tier2MinProfit' placeholder='tier2MinProfit' />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='tier3MinProfit'>tier3MinProfit</label>
            <input type='text' className='form-control' id='tier3MinProfit' placeholder='tier3MinProfit' />
          </div>
        </div>
        <button type='submit' className='btn btn-primary'>Update</button>
      </form>
    </div>
  )
}

Settings.propTypes = {
  ticker: string,
  dispatchchangeUserTickerSettings: func
}

export default Settings
