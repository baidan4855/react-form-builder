import isEqual from 'lodash/isEqual'
import isFunction from 'lodash/isFunction'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import forEach from 'lodash/forEach'
import pick from 'lodash/pick'
import set from 'lodash/set'

export const compare = (form, dep) => {
  const depValue = get(form, dep.field)
  if (isFunction(dep.pattern)) {
    return dep.pattern(depValue, form)
  }
  return isEqual(depValue, dep.pattern)
}

export const getInitialValue = schema => {
  if (!schema) throw Error('must provide schema')
  if (isEmpty(schema.fields)) throw Error('fields cannot be empty!')
  const values = {}
  forEach(schema.fields, ({ field, decorator }) => {
    const initialValue = get(decorator, 'initialValue')
    if (typeof initialValue !== 'undefined') set(values, field, initialValue)
  })
  return values
}

export const digValues = changedFields => {
  let result = []
  forEach(changedFields, val => {
    if (val.name) {
      result.push(val)
    } else {
      result = [...result, ...digValues(val)]
    }
  })
  return result
}
