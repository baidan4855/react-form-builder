import React, { Fragment } from 'react';
import set from 'lodash/set';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';
import pull from 'lodash/pull';
import map from 'lodash/map';
import { includes as includes$1, map as map$1, get, find, isEqual, isFunction } from 'lodash';

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

var form = function form(settings) {
  var initForm = {};
  forEach(settings, function (_ref) {
    var field = _ref.field,
        _ref$defaultValue = _ref.defaultValue,
        defaultValue = _ref$defaultValue === undefined ? null : _ref$defaultValue;

    set(initForm, field, defaultValue);
  });
  return function (WrapperdComponent) {
    return function (_React$Component) {
      inherits(_class2, _React$Component);

      function _class2(props) {
        classCallCheck(this, _class2);

        var _this = possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).call(this, props));

        _this.resetFields = function (form, depField, depValue) {
          forEach(settings, function (_ref2) {
            var dep = _ref2.dep,
                field = _ref2.field,
                _ref2$defaultValue = _ref2.defaultValue,
                defaultValue = _ref2$defaultValue === undefined ? null : _ref2$defaultValue;

            if (dep && dep.field === depField && dep.value !== depValue) {
              set(form, field, defaultValue);
              _this.resetFields(form, field, defaultValue);
            }
          });
        };

        _this.onChange = function (field, value) {
          var form = _this.state.form;
          set(form, field, value);
          _this.resetFields(form, field, value);
          _this.setState({ form: form });
        };

        _this.state = {
          form: initForm || {}
        };
        return _this;
      }

      createClass(_class2, [{
        key: "render",
        value: function render() {
          var form = {
            values: this.state.form,
            onChange: this.onChange
          };
          return React.createElement(WrapperdComponent, _extends({}, this.props, { form: form, settings: settings }));
        }
      }]);
      return _class2;
    }(React.Component);
  };
};

var CheckBox = function (_React$Component) {
  inherits(CheckBox, _React$Component);

  function CheckBox(props) {
    classCallCheck(this, CheckBox);

    var _this = possibleConstructorReturn(this, (CheckBox.__proto__ || Object.getPrototypeOf(CheckBox)).call(this, props));

    _this.onChange = function (value) {
      var onChange = _this.props.form.onChange;
      var stateValue = _this.state.value;
      if (includes(stateValue, value)) {
        stateValue = pull(stateValue, value);
      } else {
        stateValue = [].concat(toConsumableArray(stateValue), [value]);
      }
      _this.setState({ value: stateValue }, function () {
        onChange(_this.props.field, _this.state.value);
      });
    };

    _this.state = {
      value: props.value || props.defaultValue || []
    };
    return _this;
  }

  createClass(CheckBox, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          options = _props.options,
          field = _props.field,
          fieldValue = _props.value;

      return React.createElement(
        Fragment,
        null,
        map(options, function (_ref) {
          var text = _ref.text,
              value = _ref.value;

          return React.createElement(
            "span",
            { key: value },
            React.createElement("input", {
              type: "checkbox",
              name: field,
              value: value,
              checked: includes(fieldValue, value),
              onChange: function onChange() {
                return _this2.onChange(value);
              }
            }),
            React.createElement(
              "span",
              null,
              text
            )
          );
        })
      );
    }
  }]);
  return CheckBox;
}(React.Component);

var multiTypes = ["radio", "checkbox"];

var Item = function (_React$Component) {
  inherits(Item, _React$Component);

  function Item() {
    classCallCheck(this, Item);
    return possibleConstructorReturn(this, (Item.__proto__ || Object.getPrototypeOf(Item)).apply(this, arguments));
  }

  createClass(Item, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          form = _props.form,
          name = _props.field,
          settings = _props.settings;

      var setting = find(settings, { field: name });
      var dep = setting.dep,
          field = setting.field,
          type = setting.type,
          options = setting.options;


      if (dep) {
        var satisfy = false;
        var depValue = get(form, "values." + dep.field);
        if (isFunction(dep.value)) {
          satisfy = dep.value(depValue);
        } else if (isEqual(depValue, dep.value)) {
          satisfy = true;
        }
        if (!satisfy) return null;
      }
      if (includes$1(multiTypes, type)) {
        var fieldValue = get(form, "values." + field);
        if (type === "checkbox") {
          return React.createElement(CheckBox, _extends({}, this.props, setting, { value: fieldValue }));
        }
        return React.createElement(
          Fragment,
          null,
          map$1(options, function (_ref) {
            var text = _ref.text,
                value = _ref.value;

            return React.createElement(
              "span",
              { key: value },
              React.createElement("input", {
                type: type,
                name: field,
                value: value,
                checked: fieldValue === value,
                onChange: function onChange(e) {
                  return form.onChange(field, value);
                }
              }),
              React.createElement(
                "span",
                null,
                text
              )
            );
          })
        );
      }
      return React.createElement("input", { type: type, onChange: function onChange(e) {
          return form.onChange(field, e.target.value);
        } });
    }
  }]);
  return Item;
}(React.Component);

export { form, Item };
//# sourceMappingURL=index.es.js.map
