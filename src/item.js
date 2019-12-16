import React from 'react'
import { get, find, isEmpty, map } from 'lodash'
import * as Antd from 'antd'
import Context from './context'
import { compare } from './utils'

const DataComponents = {
  Antd,
}

export class Item extends React.Component {
  static contextType = Context
  render() {
    return (
      <Context.Consumer>
        {({ formValues, schema, form }) => {
          const { field, children: ChildElement } = this.props
          const fieldSetting = find(schema.fields, { field })
          const { dep, propsForItem = {}, decorator, children } = fieldSetting
          if (dep && !compare(formValues, dep)) {
            return null
          }
          let Component
          if (React.isValidElement(ChildElement)) {
            Component = ChildElement
          } else if (children) {
            const {
              component,
              props: childProps,
              optionComponent,
              options,
            } = children
            Component = get(DataComponents, component || null)
            if (Component) {
              if (!isEmpty(options) && !optionComponent) {
                throw new Error(
                  `"${field}" options specified, but optionComponent NOT`
                )
              }
              if (!!optionComponent && isEmpty(options)) {
                throw new Error(
                  `"${field}" optionComponent specified, but options is empty`
                )
              }
              if (!!optionComponent && !isEmpty(options)) {
                const Option = get(DataComponents, optionComponent)
                if (!Option) {
                  throw new Error(`"${field}" "${optionComponent}" not found`)
                }
                Component = (
                  <Component {...childProps}>
                    {map(options, ({ text, value }) => (
                      <Option key={`${value}${text}`} value={value}>
                        {text}
                      </Option>
                    ))}
                  </Component>
                )
              } else {
                Component = <Component {...childProps} />
              }
            }
          } else {
            Component = <Antd.Input />
          }
          return (
            <Antd.Form.Item key={field} {...propsForItem}>
              {form.getFieldDecorator(field, decorator)(Component)}
            </Antd.Form.Item>
          )
        }}
      </Context.Consumer>
    )
  }
}
