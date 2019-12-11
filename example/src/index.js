import React from 'react'
import ReactDOM from 'react-dom'
import { includes } from 'lodash'
import { Form as forme } from 'react-form-builder'
import { Form, Radio } from 'antd'

function TestForm(props) {
  const { form } = props
  if (!form.getFieldDecorator) return <div>fuck</div>
  return (
    <Form>
      <Form.Item>
        {form.getFieldDecorator('history.exist')(
          <Radio.Group>
            <Radio value={true}>有</Radio>
            <Radio value="false">无</Radio>
          </Radio.Group>
        )}
      </Form.Item>
      <Form.Item>
        {form.getFieldDecorator('history.f')(
          <Radio.Group>
            <Radio value="true">有</Radio>
            <Radio value="false">无</Radio>
          </Radio.Group>
        )}
      </Form.Item>
    </Form>
  )
}

const App = forme({
  fields: [
    {
      propsForItem: {
        label: '病史',
      },
      field: 'history.exist',
      decorator: {
        rules: [{ required: true, message: 'fuck u' }],
        initialValue: true,
      },
      children: {
        component: 'Antd.Radio.Group',
        props: null,
        optionComponent: 'Antd.Radio',
        options: [
          {
            text: '无病史',
            value: 'false',
          },
          { text: '有病史', value: 'true' },
        ],
      },
    },
    {
      propsForItem: {
        label: '病史',
      },
      field: 'history.f',
      decorator: {
        rules: [{ required: true, message: 'fuck u' }],
        initialValue: true,
      },
      children: {
        component: 'Antd.Radio.Group',
        props: null,
        optionComponent: 'Antd.Radio',
        options: [
          {
            text: '无病史',
            value: 'false',
          },
          { text: '有病史', value: 'true' },
        ],
      },
    },
  ],
})(TestForm)

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
