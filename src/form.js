import React from "react";
import set from "lodash/set";
import forEach from "lodash/forEach";
import { Context } from "./context";

export const form = settings => {
  const initForm = {};
  forEach(settings, ({ field, defaultValue = null }) => {
    set(initForm, field, defaultValue);
  });
  return WrapperdComponent =>
    class extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          form: initForm || {}
        };
      }
      resetFields = (form, depField, depValue) => {
        forEach(settings, ({ dep, field, defaultValue = null }) => {
          if (dep && dep.field === depField && dep.value !== depValue) {
            set(form, field, defaultValue);
            this.resetFields(form, field, defaultValue);
          }
        });
      };
      onChange = (field, value) => {
        const form = this.state.form;
        set(form, field, value);
        this.resetFields(form, field, value);
        this.setState({ form });
      };
      render() {
        const context = {
          settings,
          form: this.state.form,
          onChange: this.onChange
        };
        return (
          <Context.Provider value={context}>
            <WrapperdComponent {...this.props} />
          </Context.Provider>
        );
      }
    };
};
