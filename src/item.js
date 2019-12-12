import React from 'react'
import { get, find, isEqual, isFunction, isEmpty, map } from 'lodash'
import * as Antd from 'antd'

const DataComponents = {
  Antd,
}

export const itemGenerator = ({ schema, formValues, form }) => props => {
  const { field, children: ChildElement } = props
  const fieldSetting = find(schema.fields, { field })
  const { dep, propsForItem = {}, decorator, children } = fieldSetting
  if (dep) {
    let satisfy = false
    const depValue = get(formValues, dep.field)
    if (isFunction(dep.pattern)) {
      satisfy = dep.pattern(depValue)
    } else if (isEqual(depValue, dep.pattern)) {
      satisfy = true
    }
    if (!satisfy) return null
  }
  let Component
  if (React.isValidElement(ChildElement)) {
    Component = ChildElement
  } else if (children) {
    const { component, props: childProps, optionComponent, options } = children
    Component = get(DataComponents, component || null)
    if (Component) {
      if (!isEmpty(options) && !optionComponent) {
        throw new Error(`"${field}" options specified, but optionComponent NOT`)
      }
      if (!!optionComponent && isEmpty(options)) {
        throw new Error(
          `"${field}" optionComponent specified, but options is empty`
        )
      }
      const Option = get(DataComponents, optionComponent)
      if (!Option) {
        throw new Error(`"${field}" "${optionComponent}" not found`)
      }
      Component = (
        <Component key={field} {...childProps}>
          {map(options, ({ text, value }) => (
            <Option value={value}>{text}</Option>
          ))}
        </Component>
      )
    }
  } else {
    Component = <Antd.Input key={field} />
  }
  return (
    <Antd.Form.Item {...propsForItem}>
      {form.getFieldDecorator(field, decorator)(Component)}
    </Antd.Form.Item>
  )
}
