import React from 'react'
import Context from './context'
import flowRight from 'lodash/flowRight'
import cloneDeep from 'lodash/cloneDeep'
import forEach from 'lodash/forEach'
import set from 'lodash/set'
import get from 'lodash/get'
import { getInitialValue, digValues } from './utils'
import antform from './form'

const stateHolder = schema => {
  const initialValue = getInitialValue(schema)
  return WrapperdComponent =>
    class StateHolder extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          formValues: initialValue,
          fields: initialValue,
          schema,
          setForm: this.setForm,
        }
      }
      resetFields = (form, fields, depField, depValue) => {
        const schemaFields = schema.fields
        forEach(schemaFields, ({ dep, field, decorator }) => {
          if (dep && dep.field === depField && dep.value !== depValue) {
            const initialValue = get(decorator, 'initialValue', null)
            set(form, field, initialValue)
            set(fields, `${field}`, initialValue)
            this.resetFields(form, fields, field, initialValue)
          }
        })
      }
      onChange = changedFields => {
        const values = digValues(changedFields)

        const formValues = cloneDeep(this.state.formValues)
        const fields = cloneDeep(this.state.fields)
        forEach(values, field => {
          const { name, value } = field
          set(formValues, name, value)
          set(fields, name, field)
          this.resetFields(formValues, fields, name, value)
        })
        console.log('formValues', formValues)
        console.log('fields', fields)
        this.setState({ formValues, fields })
      }
      setForm = form => this.setState({ form })
      render() {
        return (
          <Context.Provider value={this.state}>
            <WrapperdComponent
              {...this.props}
              {...this.state}
              onChange={this.onChange}
            />
          </Context.Provider>
        )
      }
    }
}

const formSetter = WrapperdComponent => {
  class FormSetter extends React.PureComponent {
    render() {
      if (this.props.form && !this.context.form) {
        this.context.setForm(this.props.form)
        return null
      }
      return <WrapperdComponent {...this.props} />
    }
  }
  FormSetter.contextType = Context
  return FormSetter
}

export const dyform = schema =>
  flowRight(stateHolder(schema), antform, formSetter)
