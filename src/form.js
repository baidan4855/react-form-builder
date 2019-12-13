import { Form } from 'antd'
import set from 'lodash/set'
import get from 'lodash/get'
import forEach from 'lodash/forEach'

export default Form.create({
  mapPropsToFields({ schema, fields }) {
    const result = {}
    forEach(schema.fields, ({ field }) => {
      const value = get(fields, field)
      set(result, field, Form.createFormField(value))
    })
    return result
  },
  onFieldsChange(props, values) {
    props.onChange && props.onChange(values)
  },
})
