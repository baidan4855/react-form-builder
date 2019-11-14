import React from "react";
import ReactDOM from "react-dom";
import { includes } from "lodash";
import { form } from "./form";
import { Item } from "./item";

import "./styles.css";

function Form(props) {
  return (
    <div>
      <Item key="history.exist" {...props} />
      <Item key="history.disease" {...props} />
      <br />
      <Item key="history.disease1" {...props} />
    </div>
  );
}

const App = form([
  {
    field: "history.exist",
    options: [
      {
        text: "无病史",
        value: "false"
      },
      { text: "有病史", value: "true" }
    ],
    type: "radio",
    defaultValue: "false"
  },
  {
    field: "history.disease",
    options: [
      {
        text: "足溃疡",
        value: "zukuiyang"
      },
      { text: "截肢", value: "jiezhi" }
    ],
    type: "checkbox",
    dep: { field: "history.exist", value: "true" }
  },
  {
    field: "history.disease1",
    options: [
      {
        text: "a",
        value: "zukuiyang"
      },
      { text: "b", value: "jiezhi" }
    ],
    type: "checkbox",
    dep: {
      field: "history.disease",
      value: depValue => includes(depValue, "jiezhi")
    }
  }
])(Form);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
