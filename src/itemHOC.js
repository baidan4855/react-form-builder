import React from 'react'
import { itemGenerator } from './item'

export const item = WrapperdComponent =>
  class extends React.Component {
    constructor(props) {
      super(props)
      this.Item = itemGenerator(props)
    }
    render() {
      return <WrapperdComponent {...this.Props} Item={this.Item} />
    }
  }
