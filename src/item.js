import React from 'react'
import { includes, map, get, find, isEqual, isFunction } from 'lodash'
import { Context } from './context.js'

export class Item extends React.Component {
  componentWillMount() {
    const { field, children } = this.props
    if (!isFunction(children)) {
      throw Error(`the children of Item "${field}" only accept function`)
    }
  }
  render() {
    const { field: name, children } = this.props
    const { form, schema, onChange } = this.context

    const setting = find(schema, { field: name })
    const { dep, field, type, options } = setting
    if (dep) {
      let satisfy = false
      const depValue = get(form, dep.field)
      if (isFunction(dep.pattern)) {
        satisfy = dep.pattern(depValue)
      } else if (isEqual(depValue, dep.pattern)) {
        satisfy = true
      }
      if (!satisfy) return null
      dep.value = depValue
    }
    const value = get(form, name)
    return children({ dep, field, value, type, options, onChange })
  }
}

Item.contextType = Context
