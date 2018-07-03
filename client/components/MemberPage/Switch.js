import React, { Component } from 'react'
import { string, func } from 'prop-types'
import { connect } from 'react-redux'

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
      this.props.handleChangeOn(this.props.ticker)
    } else {
      this.props.handleChangeOff(this.props.ticker)
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
      </div>
    )
  }
}

Switch.propTypes = {
  id: string,
  title: string,
  handleChangeOn: func,
  handleChangeOff: func,
  ticker: string
}

const mapStateToProps = state => {
  return {
    binance: state.binance
  }
}

export default connect(mapStateToProps, null)(Switch)
