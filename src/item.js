import React, { Fragment } from "react";
import { includes, map, get, find, isEqual, isFunction } from "lodash";
import { Context } from "./context.js";
import { CheckBox } from "./checkbox.js";
const multiTypes = ["radio", "checkbox"];

export class Item extends React.Component {
  render() {
    const { field: name } = this.props;
    const { form, settings, onChange } = this.context;

    const setting = find(settings, { field: name });
    const { dep, field, type, options } = setting;
    if (dep) {
      let satisfy = false;
      const depValue = get(form, dep.field);
      if (isFunction(dep.value)) {
        satisfy = dep.value(depValue);
      } else if (isEqual(depValue, dep.value)) {
        satisfy = true;
      }
      if (!satisfy) return null;
    }
    if (includes(multiTypes, type)) {
      const fieldValue = get(form, field);
      if (type === "checkbox") {
        return <CheckBox {...this.props} {...setting} value={fieldValue} />;
      }
      return (
        <Fragment>
          {map(options, ({ text, value }) => {
            return (
              <span key={value}>
                <input
                  type={type}
                  name={field}
                  value={value}
                  checked={fieldValue === value}
                  onChange={e => onChange(field, value)}
                />
                <span>{text}</span>
              </span>
            );
          })}
        </Fragment>
      );
    }
    return (
      <input type={type} onChange={e => form.onChange(field, e.target.value)} />
    );
  }
}

Item.contextType = Context;
