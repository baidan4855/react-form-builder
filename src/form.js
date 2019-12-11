import { Form } from 'antd'
import set from 'lodash/set'
import get from 'lodash/get'
import forEach from 'lodash/forEach'

export default Form.create({
  mapPropsToFields({ formValues, schema }) {
    const fields = {}
    forEach(schema.fields, ({ field }) => {
      const value = get(formValues, field)
      set(fields, field, Form.createFormField({ value }))
    })
    return fields
  },
  onValuesChange(props, values) {
    console.log('props :', props, values)
    props.onChange && props.onChange(values)
  },
})
