import React from 'react'
import set from 'lodash/set'
import forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty'
import isFunction from 'lodash/isFunction'
import get from 'lodash/get'
import flat from 'flat'
import formCreator from './form'
import { item } from './itemHOC'

export const Form = schema => {
  if (!schema) throw Error('must provide schema')
  if (isEmpty(schema.fields)) throw Error('fields cannot be empty!')
  const formValues = {}
  forEach(schema.fields, ({ field, decorator }) => {
    const initialValue = get(decorator, 'initialValue')
    if (typeof initialValue !== 'undefined')
      set(formValues, field, initialValue)
  })
  return WrapperdComponent => {
    const FormMocker = formCreator(item(WrapperdComponent))
    class Nimama extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          formValues,
        }
      }
      // resetFields = (form, depField, depValue) => {
      //   forEach(settings, ({ dep, field, defaultValue = null }) => {
      //     if (dep && dep.field === depField && dep.value !== depValue) {
      //       set(form, field, defaultValue)
      //       this.resetFields(form, field, defaultValue)
      //     }
      //   })
      // }
      onChange = changedValues => {
        const flattened = flat(changedValues)
        const formValues = this.state.formValues
        forEach(flattened, (value, key) => {
          set(formValues, key, value)
        })
        console.log('new values', formValues)
        // this.resetFields(form, field, value)
        this.setState({ formValues })
      }
      render() {
        return (
          <FormMocker
            {...this.state}
            schema={schema}
            {...this.props}
            onChange={this.onChange}
          />
        )
      }
    }
    return Nimama
  }
}
