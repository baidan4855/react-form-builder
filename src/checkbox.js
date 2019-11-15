import React, { Fragment } from "react";
import includes from "lodash/includes";
import pull from "lodash/pull";
import map from "lodash/map";

export class CheckBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue || []
    };
  }
  onChange = value => {
    const onChange = this.props.form.onChange;
    let stateValue = this.state.value;
    if (includes(stateValue, value)) {
      stateValue = pull(stateValue, value);
    } else {
      stateValue = [...stateValue, value];
    }
    this.setState({ value: stateValue }, () => {
      onChange(this.props.field, this.state.value);
    });
  };
  render() {
    const { options, field, value: fieldValue } = this.props;
    return (
      <Fragment>
        {map(options, ({ text, value }) => {
          return (
            <span key={value}>
              <input
                type="checkbox"
                name={field}
                value={value}
                checked={includes(fieldValue, value)}
                onChange={() => this.onChange(value)}
              />
              <span>{text}</span>
            </span>
          );
        })}
      </Fragment>
    );
  }
}
