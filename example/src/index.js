import React from 'react'
import ReactDOM from 'react-dom'
import { includes } from 'lodash'
import { Form as forme } from 'react-form-builder'
import { Form, Radio, Input } from 'antd'

class TestForm extends React.Component {
  componentWillMount() {
    console.log('componentWillMount')
  }
  componentWillUpdate() {
    console.log('componentWillUpdate')
  }
  render() {
    console.log('render')
    const { Item, form } = this.props
    return (
      <Form>
        {/* <Item key={'single'} field="single"></Item> */}
        <Item key={'text'} field="text" form={form}></Item>
      </Form>
    )
  }
}

const App = forme({
  fields: [
    // {
    //   propsForItem: {
    //     label: '单选',
    //   },
    //   field: 'single',
    //   decorator: {
    //     rules: [{ required: true, message: 'fuck u' }],
    //     initialValue: true,
    //   },
    //   children: {
    //     component: 'Antd.Radio.Group',
    //     props: null,
    //     optionComponent: 'Antd.Radio',
    //     options: [
    //       {
    //         text: '无',
    //         value: false,
    //       },
    //       { text: '有', value: true },
    //     ],
    //   },
    // },
    {
      propsForItem: {
        label: '文本',
      },
      field: 'text',
      decorator: {
        rules: [{ required: true, message: 'fuck u' }],
        initialValue: '我好方',
      },
      // dep: {
      //   field: 'single',
      //   pattern: true,
      // },
    },
  ],
})(TestForm)

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
