'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Antd = require('antd');
var set = _interopDefault(require('lodash/set'));
var get = _interopDefault(require('lodash/get'));
var forEach = _interopDefault(require('lodash/forEach'));
var React = _interopDefault(require('react'));
var lodash = require('lodash');
var isEmpty = _interopDefault(require('lodash/isEmpty'));
require('lodash/isFunction');

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

var isBuffer = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
};

var flat = flatten;
flatten.flatten = flatten;
flatten.unflatten = unflatten;

function keyIdentity (key) {
  return key
}

function flatten (target, opts) {
  opts = opts || {};

  const delimiter = opts.delimiter || '.';
  const maxDepth = opts.maxDepth;
  const transformKey = opts.transformKey || keyIdentity;
  const output = {};

  function step (object, prev, currentDepth) {
    currentDepth = currentDepth || 1;
    Object.keys(object).forEach(function (key) {
      const value = object[key];
      const isarray = opts.safe && Array.isArray(value);
      const type = Object.prototype.toString.call(value);
      const isbuffer = isBuffer(value);
      const isobject = (
        type === '[object Object]' ||
        type === '[object Array]'
      );

      const newKey = prev
        ? prev + delimiter + transformKey(key)
        : transformKey(key);

      if (!isarray && !isbuffer && isobject && Object.keys(value).length &&
        (!opts.maxDepth || currentDepth < maxDepth)) {
        return step(value, newKey, currentDepth + 1)
      }

      output[newKey] = value;
    });
  }

  step(target);

  return output
}

function unflatten (target, opts) {
  opts = opts || {};

  const delimiter = opts.delimiter || '.';
  const overwrite = opts.overwrite || false;
  const transformKey = opts.transformKey || keyIdentity;
  const result = {};

  const isbuffer = isBuffer(target);
  if (isbuffer || Object.prototype.toString.call(target) !== '[object Object]') {
    return target
  }

  // safely ensure that the key is
  // an integer.
  function getkey (key) {
    const parsedKey = Number(key);

    return (
      isNaN(parsedKey) ||
      key.indexOf('.') !== -1 ||
      opts.object
    ) ? key
      : parsedKey
  }

  function addKeys (keyPrefix, recipient, target) {
    return Object.keys(target).reduce(function (result, key) {
      result[keyPrefix + delimiter + key] = target[key];

      return result
    }, recipient)
  }

  function isEmpty$$1 (val) {
    const type = Object.prototype.toString.call(val);
    const isArray = type === '[object Array]';
    const isObject = type === '[object Object]';

    if (!val) {
      return true
    } else if (isArray) {
      return !val.length
    } else if (isObject) {
      return !Object.keys(val).length
    }
  }

  target = Object.keys(target).reduce((result, key) => {
    const type = Object.prototype.toString.call(target[key]);
    const isObject = (type === '[object Object]' || type === '[object Array]');
    if (!isObject || isEmpty$$1(target[key])) {
      result[key] = target[key];
      return result
    } else {
      return addKeys(
        key,
        result,
        flatten(target[key], opts)
      )
    }
  }, {});

  Object.keys(target).forEach(function (key) {
    const split = key.split(delimiter).map(transformKey);
    let key1 = getkey(split.shift());
    let key2 = getkey(split[0]);
    let recipient = result;

    while (key2 !== undefined) {
      const type = Object.prototype.toString.call(recipient[key1]);
      const isobject = (
        type === '[object Object]' ||
        type === '[object Array]'
      );

      // do not write over falsey, non-undefined values if overwrite is false
      if (!overwrite && !isobject && typeof recipient[key1] !== 'undefined') {
        return
      }

      if ((overwrite && !isobject) || (!overwrite && recipient[key1] == null)) {
        recipient[key1] = (
          typeof key2 === 'number' &&
          !opts.object ? [] : {}
        );
      }

      recipient = recipient[key1];
      if (split.length > 0) {
        key1 = getkey(split.shift());
        key2 = getkey(split[0]);
      }
    }

    // unflatten again for 'messy objects'
    recipient[key1] = unflatten(target[key], opts);
  });

  return result
}

var formCreator = Antd.Form.create({
  mapPropsToFields: function mapPropsToFields(_ref) {
    var formValues = _ref.formValues,
        schema = _ref.schema;

    var fields = {};
    forEach(schema.fields, function (_ref2) {
      var field = _ref2.field;

      var value = get(formValues, field);
      set(fields, field, Antd.Form.createFormField({ value: value }));
    });
    return fields;
  },
  onValuesChange: function onValuesChange(props, values) {
    console.log('props :', props, values);
    props.onChange && props.onChange(values);
  }
});

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

var DataComponents = {
  Antd: Antd
};

var itemGenerator = function itemGenerator(_ref) {
  var schema = _ref.schema,
      formValues = _ref.formValues,
      form = _ref.form;
  return function (props) {
    var field = props.field,
        ChildElement = props.children;

    var fieldSetting = lodash.find(schema.fields, { field: field });
    var dep = fieldSetting.dep,
        _fieldSetting$propsFo = fieldSetting.propsForItem,
        propsForItem = _fieldSetting$propsFo === undefined ? {} : _fieldSetting$propsFo,
        decorator = fieldSetting.decorator,
        children = fieldSetting.children;

    if (dep) {
      var satisfy = false;
      var depValue = lodash.get(formValues, dep.field);
      if (lodash.isFunction(dep.pattern)) {
        satisfy = dep.pattern(depValue);
      } else if (lodash.isEqual(depValue, dep.pattern)) {
        satisfy = true;
      }
      if (!satisfy) return null;
    }
    var Component = void 0;
    if (React.isValidElement(ChildElement)) {
      Component = ChildElement;
    } else if (children) {
      var component = children.component,
          childProps = children.props,
          optionComponent = children.optionComponent,
          options = children.options;

      Component = lodash.get(DataComponents, component || null);
      if (Component) {
        if (!lodash.isEmpty(options) && !optionComponent) {
          throw new Error('"' + field + '" options specified, but optionComponent NOT');
        }
        if (!!optionComponent && lodash.isEmpty(options)) {
          throw new Error('"' + field + '" optionComponent specified, but options is empty');
        }
        var Option = lodash.get(DataComponents, optionComponent);
        if (!Option) {
          throw new Error('"' + field + '" "' + optionComponent + '" not found');
        }
        Component = React.createElement(
          Component,
          _extends({ key: field }, childProps),
          lodash.map(options, function (_ref2) {
            var text = _ref2.text,
                value = _ref2.value;
            return React.createElement(
              Option,
              { value: value },
              text
            );
          })
        );
      }
    } else {
      Component = React.createElement(Antd.Input, { key: field });
    }
    return React.createElement(
      Antd.Form.Item,
      propsForItem,
      form.getFieldDecorator(field, decorator)(Component)
    );
  };
};

var item = function item(WrapperdComponent) {
  return function (_React$Component) {
    inherits(_class, _React$Component);

    function _class(props) {
      classCallCheck(this, _class);

      var _this = possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

      _this.Item = itemGenerator(props);
      return _this;
    }

    createClass(_class, [{
      key: 'render',
      value: function render() {
        return React.createElement(WrapperdComponent, _extends({}, this.Props, { Item: this.Item }));
      }
    }]);
    return _class;
  }(React.Component);
};

var Form = function Form(schema) {
  if (!schema) throw Error('must provide schema');
  if (isEmpty(schema.fields)) throw Error('fields cannot be empty!');
  var formValues = {};
  forEach(schema.fields, function (_ref) {
    var field = _ref.field,
        decorator = _ref.decorator;

    var initialValue = get(decorator, 'initialValue');
    if (typeof initialValue !== 'undefined') set(formValues, field, initialValue);
  });
  return function (WrapperdComponent) {
    var FormMocker = formCreator(item(WrapperdComponent));

    var Nimama = function (_React$Component) {
      inherits(Nimama, _React$Component);

      function Nimama(props) {
        classCallCheck(this, Nimama);

        var _this = possibleConstructorReturn(this, (Nimama.__proto__ || Object.getPrototypeOf(Nimama)).call(this, props));

        _this.onChange = function (changedValues) {
          var flattened = flat(changedValues);
          var formValues = _this.state.formValues;
          forEach(flattened, function (value, key) {
            set(formValues, key, value);
          });
          console.log('new values', formValues);
          // this.resetFields(form, field, value)
          _this.setState({ formValues: formValues });
        };

        _this.state = {
          formValues: formValues
        };
        return _this;
      }
      // resetFields = (form, depField, depValue) => {
      //   forEach(settings, ({ dep, field, defaultValue = null }) => {
      //     if (dep && dep.field === depField && dep.value !== depValue) {
      //       set(form, field, defaultValue)
      //       this.resetFields(form, field, defaultValue)
      //     }
      //   })
      // }


      createClass(Nimama, [{
        key: 'render',
        value: function render() {
          return React.createElement(FormMocker, _extends({}, this.state, {
            schema: schema
          }, this.props, {
            onChange: this.onChange
          }));
        }
      }]);
      return Nimama;
    }(React.Component);

    return Nimama;
  };
};

exports.Form = Form;
//# sourceMappingURL=index.js.map
