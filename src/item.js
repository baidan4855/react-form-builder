import React from "react";
import { includes, map, get, find, isEqual, isFunction } from "lodash";
import { CheckBox } from "./checkbox.js";
const multiTypes = ["radio", "checkbox"];

export const Item = props => {
  const { form, key: name, settings } = props;
  const setting = find(settings, { field: name });
  const { dep, field, type, options } = setting;

  if (dep) {
    let satisfy = false;
    const depValue = get(form, `values.${dep.field}`);
    if (isFunction(dep.value)) {
      satisfy = dep.value(depValue);
    } else if (isEqual(depValue, dep.value)) {
      satisfy = true;
    }
    if (!satisfy) return null;
  }
  if (includes(multiTypes, type)) {
    const fieldValue = get(form, `values.${field}`);
    if (type === "checkbox") {
      return <CheckBox {...props} {...setting} value={fieldValue} />;
    }
    return (
      <>
        {map(options, ({ text, value }) => {
          return (
            <span key={value}>
              <input
                type={type}
                name={field}
                value={value}
                checked={fieldValue === value}
                onChange={e => form.onChange(field, value)}
              />
              <span>{text}</span>
            </span>
          );
        })}
      </>
    );
  }
  return (
    <input type={type} onChange={e => form.onChange(field, e.target.value)} />
  );
};
