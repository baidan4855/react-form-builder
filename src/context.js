import React from 'react'

const Context = React.createContext({
  values: {},
  schema: null,
})
Context.displayName = 'DynamicForm'
export default Context
