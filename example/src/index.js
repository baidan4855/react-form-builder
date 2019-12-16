import React from 'react'
import ReactDOM from 'react-dom'
import { dyform, Item } from 'react-form-builder'
import { Form } from 'antd'

import './App.css'
class TestForm extends React.Component {
  render() {
    return (
      <Form layout="inline">
        <div>
          <div>患者病史</div>
          <div>
            <Item field="single"></Item>
            <Item field="history.illness"></Item>
          </div>
        </div>
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
      children: {
        component: 'Antd.Checkbox',
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
