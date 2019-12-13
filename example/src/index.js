import React from 'react'
import ReactDOM from 'react-dom'
import { dyform, Item } from 'react-form-builder'
import { Form } from 'antd'

import './App.css'
class TestForm extends React.Component {
  render() {
    return (
      <Form layout="inline">
        <Item field="single"></Item>
        <Item field="history.illness"></Item>
      </Form>
    )
  }
}

const App = dyform({
  fields: [
    {
      propsForItem: {
        label: '有无病史',
      },
      field: 'single',
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
            text: '无',
            value: false,
          },
          { text: '有', value: true },
        ],
      },
    },
    {
      propsForItem: {
        label: '病史',
      },
      field: 'history.illness',
      decorator: {
        rules: [{ required: true, message: 'fuck u' }],
        initialValue: ['foot'],
      },
      children: {
        component: 'Antd.Checkbox.Group',
        props: null,
        optionComponent: 'Antd.Checkbox',
        options: [
          {
            text: '足溃疡',
            value: 'foot',
          },
          { text: '截肢', value: 'lose' },
        ],
      },
      dep: {
        field: 'single',
        pattern: true,
      },
    },
  ],
})(TestForm)

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
