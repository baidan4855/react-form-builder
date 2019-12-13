import React from 'react';
import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
import 'lodash/pick';
import set from 'lodash/set';
import * as Antd from 'antd';
import { Form, Input } from 'antd';
import flowRight from 'lodash/flowRight';
import cloneDeep from 'lodash/cloneDeep';
import { get as get$1, find, isEmpty as isEmpty$1, map } from 'lodash';

var Context = React.createContext({
  values: {},
  schema: null
});
Context.displayName = 'DynamicForm';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var compare = function compare(form, dep) {
  var depValue = get(form, dep.field);
  if (isFunction(dep.pattern)) {
    return dep.pattern(depValue, form);
  }
  return isEqual(depValue, dep.pattern);
};

var getInitialValue = function getInitialValue(schema) {
  if (!schema) throw Error('must provide schema');
  if (isEmpty(schema.fields)) throw Error('fields cannot be empty!');
  var values = {};
  forEach(schema.fields, function (_ref) {
    var field = _ref.field,
        decorator = _ref.decorator;

    var initialValue = get(decorator, 'initialValue');
    if (typeof initialValue !== 'undefined') set(values, field, initialValue);
  });
  return values;
};

var digValues = function digValues(changedFields) {
  var result = [];
  forEach(changedFields, function (val) {
    if (val.name) {
      result.push(val);
    } else {
      result = [].concat(toConsumableArray(result), toConsumableArray(digValues(val)));
    }
  });
  return result;
};

var antform = Form.create({
  mapPropsToFields: function mapPropsToFields(_ref) {
    var schema = _ref.schema,
        fields = _ref.fields;

    var result = {};
    forEach(schema.fields, function (_ref2) {
      var field = _ref2.field;

      var value = get(fields, field);
      set(result, field, Form.createFormField(value));
    });
    return result;
  },
  onFieldsChange: function onFieldsChange(props, values) {
    props.onChange && props.onChange(values);
  }
});

var stateHolder = function stateHolder(schema) {
  var initialValue = getInitialValue(schema);
  return function (WrapperdComponent) {
    return function (_React$Component) {
      inherits(StateHolder, _React$Component);

      function StateHolder(props) {
        classCallCheck(this, StateHolder);

        var _this = possibleConstructorReturn(this, (StateHolder.__proto__ || Object.getPrototypeOf(StateHolder)).call(this, props));

        _this.resetFields = function (form, fields, depField, depValue) {
          var schemaFields = schema.fields;
          forEach(schemaFields, function (_ref) {
            var dep = _ref.dep,
                field = _ref.field,
                decorator = _ref.decorator;

            if (dep && dep.field === depField && dep.value !== depValue) {
              var _initialValue = get(decorator, 'initialValue', null);
              set(form, field, _initialValue);
              set(fields, '' + field, _initialValue);
              _this.resetFields(form, fields, field, _initialValue);
            }
          });
        };

        _this.onChange = function (changedFields) {
          var values = digValues(changedFields);

          var formValues = cloneDeep(_this.state.formValues);
          var fields = cloneDeep(_this.state.fields);
          forEach(values, function (field) {
            var name = field.name,
                value = field.value;

            set(formValues, name, value);
            set(fields, name, field);
            _this.resetFields(formValues, fields, name, value);
          });
          console.log('formValues', formValues);
          console.log('fields', fields);
          _this.setState({ formValues: formValues, fields: fields });
        };

        _this.setForm = function (form) {
          return _this.setState({ form: form });
        };

        _this.state = {
          formValues: initialValue,
          fields: initialValue,
          schema: schema,
          setForm: _this.setForm
        };
        return _this;
      }

      createClass(StateHolder, [{
        key: 'render',
        value: function render() {
          return React.createElement(
            Context.Provider,
            { value: this.state },
            React.createElement(WrapperdComponent, _extends({}, this.props, this.state, {
              onChange: this.onChange
            }))
          );
        }
      }]);
      return StateHolder;
    }(React.Component);
  };
};

var formSetter = function formSetter(WrapperdComponent) {
  var FormSetter = function (_React$PureComponent) {
    inherits(FormSetter, _React$PureComponent);

    function FormSetter() {
      classCallCheck(this, FormSetter);
      return possibleConstructorReturn(this, (FormSetter.__proto__ || Object.getPrototypeOf(FormSetter)).apply(this, arguments));
    }

    createClass(FormSetter, [{
      key: 'render',
      value: function render() {
        if (this.props.form && !this.context.form) {
          this.context.setForm(this.props.form);
          return null;
        }
        return React.createElement(WrapperdComponent, this.props);
      }
    }]);
    return FormSetter;
  }(React.PureComponent);

  FormSetter.contextType = Context;
  return FormSetter;
};

var dyform = function dyform(schema) {
  return flowRight(stateHolder(schema), antform, formSetter);
};

var DataComponents = {
  Antd: Antd
};

var Item = function (_React$Component) {
  inherits(Item, _React$Component);

  function Item() {
    classCallCheck(this, Item);
    return possibleConstructorReturn(this, (Item.__proto__ || Object.getPrototypeOf(Item)).apply(this, arguments));
  }

  createClass(Item, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement(
        Context.Consumer,
        null,
        function (_ref) {
          var formValues = _ref.formValues,
              schema = _ref.schema,
              form = _ref.form;
          var _props = _this2.props,
              field = _props.field,
              ChildElement = _props.children;

          var fieldSetting = find(schema.fields, { field: field });
          var dep = fieldSetting.dep,
              _fieldSetting$propsFo = fieldSetting.propsForItem,
              propsForItem = _fieldSetting$propsFo === undefined ? {} : _fieldSetting$propsFo,
              decorator = fieldSetting.decorator,
              children = fieldSetting.children;

          if (dep && !compare(formValues, dep)) {
            return null;
          }
          var Component = void 0;
          if (React.isValidElement(ChildElement)) {
            Component = ChildElement;
          } else if (children) {
            var component = children.component,
                childProps = children.props,
                optionComponent = children.optionComponent,
                options = children.options;

            Component = get$1(DataComponents, component || null);
            if (Component) {
              if (!isEmpty$1(options) && !optionComponent) {
                throw new Error('"' + field + '" options specified, but optionComponent NOT');
              }
              if (!!optionComponent && isEmpty$1(options)) {
                throw new Error('"' + field + '" optionComponent specified, but options is empty');
              }
              var Option = get$1(DataComponents, optionComponent);
              if (!Option) {
                throw new Error('"' + field + '" "' + optionComponent + '" not found');
              }
              Component = React.createElement(
                Component,
                childProps,
                map(options, function (_ref2) {
                  var text = _ref2.text,
                      value = _ref2.value;
                  return React.createElement(
                    Option,
                    { key: '' + value + text, value: value },
                    text
                  );
                })
              );
            }
          } else {
            Component = React.createElement(Input, null);
          }
          return React.createElement(
            Form.Item,
            _extends({ key: field }, propsForItem),
            form.getFieldDecorator(field, decorator)(Component)
          );
        }
      );
    }
  }]);
  return Item;
}(React.Component);
Item.contextType = Context;

export { dyform, Item };
//# sourceMappingURL=index.es.js.map
