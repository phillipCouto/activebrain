(function(exported) {
  if (typeof exports === 'object') {
    module.exports = exported;
  } else if (typeof define === 'function' && define.amd) {
    define(function() {
      return exported;
    });
  } else {
    Psy = exported;
  }
})((function(require, undefined) { var global = this;

require.define('19', function(module, exports, __dirname, __filename, undefined){
(function () {
    var divide_list, get_type, __slice = [].slice;
    get_type = function (varable) {
        var as_string;
        as_string = Object.prototype.toString.call(varable);
        return as_string.slice(1, -1).split(' ')[1].toLowerCase();
    };
    divide_list = function (stack, long_list) {
        var keys;
        if (long_list.length > 0) {
            if (get_type(long_list[0]) === 'object') {
                keys = Object.keys(long_list[0]);
                keys.forEach(function (key) {
                    return stack.push({
                        pattern: key,
                        result: long_list[0][key]
                    });
                });
                return divide_list(stack, long_list.slice(1));
            } else {
                stack.push({
                    pattern: long_list[0],
                    result: long_list[1]
                });
                return divide_list(stack, long_list.slice(2));
            }
        } else {
            return stack;
        }
    };
    exports.match = function () {
        var choices, chosen, data, possible, sure;
        data = arguments[0], choices = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        possible = divide_list([], choices).filter(function (solution) {
            var the_type;
            the_type = get_type(solution.pattern);
            if (solution.pattern === void 0) {
                return true;
            } else if (the_type === 'regexp') {
                if (get_type(data) === 'string') {
                    return data.match(solution.pattern);
                } else {
                    return false;
                }
            } else if (the_type === 'function') {
                return solution.pattern(data);
            } else {
                return data === solution.pattern;
            }
        });
        sure = possible.filter(function (solution) {
            return solution.pattern != null;
        });
        chosen = sure.length > 0 ? sure[0] : possible[0];
        if (chosen != null) {
            if (get_type(chosen.result) === 'function') {
                return chosen.result(data);
            } else {
                return chosen.result;
            }
        } else {
            return chosen;
        }
    };
}.call(this));
});
require.define('18', function(module, exports, __dirname, __filename, undefined){
RegExp.escape = function (s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
(function (undefined) {
    'use strict';
    var $;
    if (typeof jQuery !== 'undefined' && jQuery) {
        $ = jQuery;
    } else {
        $ = {};
    }
    $.csv = {
        defaults: {
            separator: ',',
            delimiter: '"',
            headers: true
        },
        hooks: {
            castToScalar: function (value, state) {
                var hasDot = /\./;
                if (isNaN(value)) {
                    return value;
                } else {
                    if (hasDot.test(value)) {
                        return parseFloat(value);
                    } else {
                        var integer = parseInt(value);
                        if (isNaN(integer)) {
                            return null;
                        } else {
                            return integer;
                        }
                    }
                }
            }
        },
        parsers: {
            parse: function (csv, options) {
                var separator = options.separator;
                var delimiter = options.delimiter;
                if (!options.state.rowNum) {
                    options.state.rowNum = 1;
                }
                if (!options.state.colNum) {
                    options.state.colNum = 1;
                }
                var data = [];
                var entry = [];
                var state = 0;
                var value = '';
                var exit = false;
                function endOfEntry() {
                    state = 0;
                    value = '';
                    if (options.start && options.state.rowNum < options.start) {
                        entry = [];
                        options.state.rowNum++;
                        options.state.colNum = 1;
                        return;
                    }
                    if (options.onParseEntry === undefined) {
                        data.push(entry);
                    } else {
                        var hookVal = options.onParseEntry(entry, options.state);
                        if (hookVal !== false) {
                            data.push(hookVal);
                        }
                    }
                    entry = [];
                    if (options.end && options.state.rowNum >= options.end) {
                        exit = true;
                    }
                    options.state.rowNum++;
                    options.state.colNum = 1;
                }
                function endOfValue() {
                    if (options.onParseValue === undefined) {
                        entry.push(value);
                    } else {
                        var hook = options.onParseValue(value, options.state);
                        if (hook !== false) {
                            entry.push(hook);
                        }
                    }
                    value = '';
                    state = 0;
                    options.state.colNum++;
                }
                var escSeparator = RegExp.escape(separator);
                var escDelimiter = RegExp.escape(delimiter);
                var match = /(D|S|\r\n|\n|\r|[^DS\r\n]+)/;
                var matchSrc = match.source;
                matchSrc = matchSrc.replace(/S/g, escSeparator);
                matchSrc = matchSrc.replace(/D/g, escDelimiter);
                match = RegExp(matchSrc, 'gm');
                csv.replace(match, function (m0) {
                    if (exit) {
                        return;
                    }
                    switch (state) {
                    case 0:
                        if (m0 === separator) {
                            value += '';
                            endOfValue();
                            break;
                        }
                        if (m0 === delimiter) {
                            state = 1;
                            break;
                        }
                        if (/^(\r\n|\n|\r)$/.test(m0)) {
                            endOfValue();
                            endOfEntry();
                            break;
                        }
                        value += m0;
                        state = 3;
                        break;
                    case 1:
                        if (m0 === delimiter) {
                            state = 2;
                            break;
                        }
                        value += m0;
                        state = 1;
                        break;
                    case 2:
                        if (m0 === delimiter) {
                            value += m0;
                            state = 1;
                            break;
                        }
                        if (m0 === separator) {
                            endOfValue();
                            break;
                        }
                        if (/^(\r\n|\n|\r)$/.test(m0)) {
                            endOfValue();
                            endOfEntry();
                            break;
                        }
                        throw new Error('CSVDataError: Illegal State [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
                    case 3:
                        if (m0 === separator) {
                            endOfValue();
                            break;
                        }
                        if (/^(\r\n|\n|\r)$/.test(m0)) {
                            endOfValue();
                            endOfEntry();
                            break;
                        }
                        if (m0 === delimiter) {
                            throw new Error('CSVDataError: Illegal Quote [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
                        }
                        throw new Error('CSVDataError: Illegal Data [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
                    default:
                        throw new Error('CSVDataError: Unknown State [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
                    }
                });
                if (entry.length !== 0) {
                    endOfValue();
                    endOfEntry();
                }
                return data;
            },
            splitLines: function (csv, options) {
                var separator = options.separator;
                var delimiter = options.delimiter;
                if (!options.state.rowNum) {
                    options.state.rowNum = 1;
                }
                var entries = [];
                var state = 0;
                var entry = '';
                var exit = false;
                function endOfLine() {
                    state = 0;
                    if (options.start && options.state.rowNum < options.start) {
                        entry = '';
                        options.state.rowNum++;
                        return;
                    }
                    if (options.onParseEntry === undefined) {
                        entries.push(entry);
                    } else {
                        var hookVal = options.onParseEntry(entry, options.state);
                        if (hookVal !== false) {
                            entries.push(hookVal);
                        }
                    }
                    entry = '';
                    if (options.end && options.state.rowNum >= options.end) {
                        exit = true;
                    }
                    options.state.rowNum++;
                }
                var escSeparator = RegExp.escape(separator);
                var escDelimiter = RegExp.escape(delimiter);
                var match = /(D|S|\n|\r|[^DS\r\n]+)/;
                var matchSrc = match.source;
                matchSrc = matchSrc.replace(/S/g, escSeparator);
                matchSrc = matchSrc.replace(/D/g, escDelimiter);
                match = RegExp(matchSrc, 'gm');
                csv.replace(match, function (m0) {
                    if (exit) {
                        return;
                    }
                    switch (state) {
                    case 0:
                        if (m0 === separator) {
                            entry += m0;
                            state = 0;
                            break;
                        }
                        if (m0 === delimiter) {
                            entry += m0;
                            state = 1;
                            break;
                        }
                        if (m0 === '\n') {
                            endOfLine();
                            break;
                        }
                        if (/^\r$/.test(m0)) {
                            break;
                        }
                        entry += m0;
                        state = 3;
                        break;
                    case 1:
                        if (m0 === delimiter) {
                            entry += m0;
                            state = 2;
                            break;
                        }
                        entry += m0;
                        state = 1;
                        break;
                    case 2:
                        var prevChar = entry.substr(entry.length - 1);
                        if (m0 === delimiter && prevChar === delimiter) {
                            entry += m0;
                            state = 1;
                            break;
                        }
                        if (m0 === separator) {
                            entry += m0;
                            state = 0;
                            break;
                        }
                        if (m0 === '\n') {
                            endOfLine();
                            break;
                        }
                        if (m0 === '\r') {
                            break;
                        }
                        throw new Error('CSVDataError: Illegal state [Row:' + options.state.rowNum + ']');
                    case 3:
                        if (m0 === separator) {
                            entry += m0;
                            state = 0;
                            break;
                        }
                        if (m0 === '\n') {
                            endOfLine();
                            break;
                        }
                        if (m0 === '\r') {
                            break;
                        }
                        if (m0 === delimiter) {
                            throw new Error('CSVDataError: Illegal quote [Row:' + options.state.rowNum + ']');
                        }
                        throw new Error('CSVDataError: Illegal state [Row:' + options.state.rowNum + ']');
                    default:
                        throw new Error('CSVDataError: Unknown state [Row:' + options.state.rowNum + ']');
                    }
                });
                if (entry !== '') {
                    endOfLine();
                }
                return entries;
            },
            parseEntry: function (csv, options) {
                var separator = options.separator;
                var delimiter = options.delimiter;
                if (!options.state.rowNum) {
                    options.state.rowNum = 1;
                }
                if (!options.state.colNum) {
                    options.state.colNum = 1;
                }
                var entry = [];
                var state = 0;
                var value = '';
                function endOfValue() {
                    if (options.onParseValue === undefined) {
                        entry.push(value);
                    } else {
                        var hook = options.onParseValue(value, options.state);
                        if (hook !== false) {
                            entry.push(hook);
                        }
                    }
                    value = '';
                    state = 0;
                    options.state.colNum++;
                }
                if (!options.match) {
                    var escSeparator = RegExp.escape(separator);
                    var escDelimiter = RegExp.escape(delimiter);
                    var match = /(D|S|\n|\r|[^DS\r\n]+)/;
                    var matchSrc = match.source;
                    matchSrc = matchSrc.replace(/S/g, escSeparator);
                    matchSrc = matchSrc.replace(/D/g, escDelimiter);
                    options.match = RegExp(matchSrc, 'gm');
                }
                csv.replace(options.match, function (m0) {
                    switch (state) {
                    case 0:
                        if (m0 === separator) {
                            value += '';
                            endOfValue();
                            break;
                        }
                        if (m0 === delimiter) {
                            state = 1;
                            break;
                        }
                        if (m0 === '\n' || m0 === '\r') {
                            break;
                        }
                        value += m0;
                        state = 3;
                        break;
                    case 1:
                        if (m0 === delimiter) {
                            state = 2;
                            break;
                        }
                        value += m0;
                        state = 1;
                        break;
                    case 2:
                        if (m0 === delimiter) {
                            value += m0;
                            state = 1;
                            break;
                        }
                        if (m0 === separator) {
                            endOfValue();
                            break;
                        }
                        if (m0 === '\n' || m0 === '\r') {
                            break;
                        }
                        throw new Error('CSVDataError: Illegal State [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
                    case 3:
                        if (m0 === separator) {
                            endOfValue();
                            break;
                        }
                        if (m0 === '\n' || m0 === '\r') {
                            break;
                        }
                        if (m0 === delimiter) {
                            throw new Error('CSVDataError: Illegal Quote [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
                        }
                        throw new Error('CSVDataError: Illegal Data [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
                    default:
                        throw new Error('CSVDataError: Unknown State [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
                    }
                });
                endOfValue();
                return entry;
            }
        },
        helpers: {
            collectPropertyNames: function (objects) {
                var o, propName, props = [];
                for (o in objects) {
                    for (propName in objects[o]) {
                        if (objects[o].hasOwnProperty(propName) && props.indexOf(propName) < 0 && typeof objects[o][propName] !== 'function') {
                            props.push(propName);
                        }
                    }
                }
                return props;
            }
        },
        toArray: function (csv, options, callback) {
            var options = options !== undefined ? options : {};
            var config = {};
            config.callback = callback !== undefined && typeof callback === 'function' ? callback : false;
            config.separator = 'separator' in options ? options.separator : $.csv.defaults.separator;
            config.delimiter = 'delimiter' in options ? options.delimiter : $.csv.defaults.delimiter;
            var state = options.state !== undefined ? options.state : {};
            var options = {
                    delimiter: config.delimiter,
                    separator: config.separator,
                    onParseEntry: options.onParseEntry,
                    onParseValue: options.onParseValue,
                    state: state
                };
            var entry = $.csv.parsers.parseEntry(csv, options);
            if (!config.callback) {
                return entry;
            } else {
                config.callback('', entry);
            }
        },
        toArrays: function (csv, options, callback) {
            var options = options !== undefined ? options : {};
            var config = {};
            config.callback = callback !== undefined && typeof callback === 'function' ? callback : false;
            config.separator = 'separator' in options ? options.separator : $.csv.defaults.separator;
            config.delimiter = 'delimiter' in options ? options.delimiter : $.csv.defaults.delimiter;
            var data = [];
            var options = {
                    delimiter: config.delimiter,
                    separator: config.separator,
                    onParseEntry: options.onParseEntry,
                    onParseValue: options.onParseValue,
                    start: options.start,
                    end: options.end,
                    state: {
                        rowNum: 1,
                        colNum: 1
                    }
                };
            data = $.csv.parsers.parse(csv, options);
            if (!config.callback) {
                return data;
            } else {
                config.callback('', data);
            }
        },
        toObjects: function (csv, options, callback) {
            var options = options !== undefined ? options : {};
            var config = {};
            config.callback = callback !== undefined && typeof callback === 'function' ? callback : false;
            config.separator = 'separator' in options ? options.separator : $.csv.defaults.separator;
            config.delimiter = 'delimiter' in options ? options.delimiter : $.csv.defaults.delimiter;
            config.headers = 'headers' in options ? options.headers : $.csv.defaults.headers;
            options.start = 'start' in options ? options.start : 1;
            if (config.headers) {
                options.start++;
            }
            if (options.end && config.headers) {
                options.end++;
            }
            var lines = [];
            var data = [];
            var options = {
                    delimiter: config.delimiter,
                    separator: config.separator,
                    onParseEntry: options.onParseEntry,
                    onParseValue: options.onParseValue,
                    start: options.start,
                    end: options.end,
                    state: {
                        rowNum: 1,
                        colNum: 1
                    },
                    match: false,
                    transform: options.transform
                };
            var headerOptions = {
                    delimiter: config.delimiter,
                    separator: config.separator,
                    start: 1,
                    end: 1,
                    state: {
                        rowNum: 1,
                        colNum: 1
                    }
                };
            var headerLine = $.csv.parsers.splitLines(csv, headerOptions);
            var headers = $.csv.toArray(headerLine[0], options);
            var lines = $.csv.parsers.splitLines(csv, options);
            options.state.colNum = 1;
            if (headers) {
                options.state.rowNum = 2;
            } else {
                options.state.rowNum = 1;
            }
            for (var i = 0, len = lines.length; i < len; i++) {
                var entry = $.csv.toArray(lines[i], options);
                var object = {};
                for (var j in headers) {
                    object[headers[j]] = entry[j];
                }
                if (options.transform !== undefined) {
                    data.push(options.transform.call(undefined, object));
                } else {
                    data.push(object);
                }
                options.state.rowNum++;
            }
            if (!config.callback) {
                return data;
            } else {
                config.callback('', data);
            }
        },
        fromArrays: function (arrays, options, callback) {
            var options = options !== undefined ? options : {};
            var config = {};
            config.callback = callback !== undefined && typeof callback === 'function' ? callback : false;
            config.separator = 'separator' in options ? options.separator : $.csv.defaults.separator;
            config.delimiter = 'delimiter' in options ? options.delimiter : $.csv.defaults.delimiter;
            var output = '', line, lineValues, i, j;
            for (i = 0; i < arrays.length; i++) {
                line = arrays[i];
                lineValues = [];
                for (j = 0; j < line.length; j++) {
                    var strValue = line[j] === undefined || line[j] === null ? '' : line[j].toString();
                    if (strValue.indexOf(config.delimiter) > -1) {
                        strValue = strValue.replace(config.delimiter, config.delimiter + config.delimiter);
                    }
                    var escMatcher = '\n|\r|S|D';
                    escMatcher = escMatcher.replace('S', config.separator);
                    escMatcher = escMatcher.replace('D', config.delimiter);
                    if (strValue.search(escMatcher) > -1) {
                        strValue = config.delimiter + strValue + config.delimiter;
                    }
                    lineValues.push(strValue);
                }
                output += lineValues.join(config.separator) + '\r\n';
            }
            if (!config.callback) {
                return output;
            } else {
                config.callback('', output);
            }
        },
        fromObjects: function (objects, options, callback) {
            var options = options !== undefined ? options : {};
            var config = {};
            config.callback = callback !== undefined && typeof callback === 'function' ? callback : false;
            config.separator = 'separator' in options ? options.separator : $.csv.defaults.separator;
            config.delimiter = 'delimiter' in options ? options.delimiter : $.csv.defaults.delimiter;
            config.headers = 'headers' in options ? options.headers : $.csv.defaults.headers;
            config.sortOrder = 'sortOrder' in options ? options.sortOrder : 'declare';
            config.manualOrder = 'manualOrder' in options ? options.manualOrder : [];
            config.transform = options.transform;
            if (typeof config.manualOrder === 'string') {
                config.manualOrder = $.csv.toArray(config.manualOrder, config);
            }
            if (config.transform !== undefined) {
                var origObjects = objects;
                objects = [];
                var i;
                for (i = 0; i < origObjects.length; i++) {
                    objects.push(config.transform.call(undefined, origObjects[i]));
                }
            }
            var props = $.csv.helpers.collectPropertyNames(objects);
            if (config.sortOrder === 'alpha') {
                props.sort();
            }
            if (config.manualOrder.length > 0) {
                var propsManual = [].concat(config.manualOrder);
                var p;
                for (p = 0; p < props.length; p++) {
                    if (propsManual.indexOf(props[p]) < 0) {
                        propsManual.push(props[p]);
                    }
                }
                props = propsManual;
            }
            var o, p, line, output = [], propName;
            if (config.headers) {
                output.push(props);
            }
            for (o = 0; o < objects.length; o++) {
                line = [];
                for (p = 0; p < props.length; p++) {
                    propName = props[p];
                    if (propName in objects[o] && typeof objects[o][propName] !== 'function') {
                        line.push(objects[o][propName]);
                    } else {
                        line.push('');
                    }
                }
                output.push(line);
            }
            return $.csv.fromArrays(output, options, config.callback);
        }
    };
    $.csvEntry2Array = $.csv.toArray;
    $.csv2Array = $.csv.toArrays;
    $.csv2Dictionary = $.csv.toObjects;
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = $.csv;
    }
}.call(this));
});
require.define('17', function(module, exports, __dirname, __filename, undefined){
(function (definition) {
    if (typeof bootstrap === 'function') {
        bootstrap('promise', definition);
    } else if (typeof exports === 'object') {
        module.exports = definition();
    } else if (typeof define === 'function' && define.amd) {
        define(definition);
    } else if (typeof ses !== 'undefined') {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }
    } else {
        Q = definition();
    }
}(function () {
    'use strict';
    var hasStacks = false;
    try {
        throw new Error();
    } catch (e) {
        hasStacks = !!e.stack;
    }
    var qStartingLine = captureLine();
    var qFileName;
    var noop = function () {
    };
    var nextTick = function () {
            var head = {
                    task: void 0,
                    next: null
                };
            var tail = head;
            var flushing = false;
            var requestTick = void 0;
            var isNodeJS = false;
            function flush() {
                while (head.next) {
                    head = head.next;
                    var task = head.task;
                    head.task = void 0;
                    var domain = head.domain;
                    if (domain) {
                        head.domain = void 0;
                        domain.enter();
                    }
                    try {
                        task();
                    } catch (e) {
                        if (isNodeJS) {
                            if (domain) {
                                domain.exit();
                            }
                            setTimeout(flush, 0);
                            if (domain) {
                                domain.enter();
                            }
                            throw e;
                        } else {
                            setTimeout(function () {
                                throw e;
                            }, 0);
                        }
                    }
                    if (domain) {
                        domain.exit();
                    }
                }
                flushing = false;
            }
            nextTick = function (task) {
                tail = tail.next = {
                    task: task,
                    domain: isNodeJS && process.domain,
                    next: null
                };
                if (!flushing) {
                    flushing = true;
                    requestTick();
                }
            };
            if (typeof process !== 'undefined' && process.nextTick) {
                isNodeJS = true;
                requestTick = function () {
                    process.nextTick(flush);
                };
            } else if (typeof setImmediate === 'function') {
                if (typeof window !== 'undefined') {
                    requestTick = setImmediate.bind(window, flush);
                } else {
                    requestTick = function () {
                        setImmediate(flush);
                    };
                }
            } else if (typeof MessageChannel !== 'undefined') {
                var channel = new MessageChannel();
                channel.port1.onmessage = function () {
                    requestTick = requestPortTick;
                    channel.port1.onmessage = flush;
                    flush();
                };
                var requestPortTick = function () {
                    channel.port2.postMessage(0);
                };
                requestTick = function () {
                    setTimeout(flush, 0);
                    requestPortTick();
                };
            } else {
                requestTick = function () {
                    setTimeout(flush, 0);
                };
            }
            return nextTick;
        }();
    var call = Function.call;
    function uncurryThis(f) {
        return function () {
            return call.apply(f, arguments);
        };
    }
    var array_slice = uncurryThis(Array.prototype.slice);
    var array_reduce = uncurryThis(Array.prototype.reduce || function (callback, basis) {
            var index = 0, length = this.length;
            if (arguments.length === 1) {
                do {
                    if (index in this) {
                        basis = this[index++];
                        break;
                    }
                    if (++index >= length) {
                        throw new TypeError();
                    }
                } while (1);
            }
            for (; index < length; index++) {
                if (index in this) {
                    basis = callback(basis, this[index], index);
                }
            }
            return basis;
        });
    var array_indexOf = uncurryThis(Array.prototype.indexOf || function (value) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === value) {
                    return i;
                }
            }
            return -1;
        });
    var array_map = uncurryThis(Array.prototype.map || function (callback, thisp) {
            var self = this;
            var collect = [];
            array_reduce(self, function (undefined, value, index) {
                collect.push(callback.call(thisp, value, index, self));
            }, void 0);
            return collect;
        });
    var object_create = Object.create || function (prototype) {
            function Type() {
            }
            Type.prototype = prototype;
            return new Type();
        };
    var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);
    var object_keys = Object.keys || function (object) {
            var keys = [];
            for (var key in object) {
                if (object_hasOwnProperty(object, key)) {
                    keys.push(key);
                }
            }
            return keys;
        };
    var object_toString = uncurryThis(Object.prototype.toString);
    function isObject(value) {
        return value === Object(value);
    }
    function isStopIteration(exception) {
        return object_toString(exception) === '[object StopIteration]' || exception instanceof QReturnValue;
    }
    var QReturnValue;
    if (typeof ReturnValue !== 'undefined') {
        QReturnValue = ReturnValue;
    } else {
        QReturnValue = function (value) {
            this.value = value;
        };
    }
    var hasES6Generators;
    try {
        new Function('(function* (){ yield 1; })');
        hasES6Generators = true;
    } catch (e) {
        hasES6Generators = false;
    }
    var STACK_JUMP_SEPARATOR = 'From previous event:';
    function makeStackTraceLong(error, promise) {
        if (hasStacks && promise.stack && typeof error === 'object' && error !== null && error.stack && error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1) {
            var stacks = [];
            for (var p = promise; !!p; p = p.source) {
                if (p.stack) {
                    stacks.unshift(p.stack);
                }
            }
            stacks.unshift(error.stack);
            var concatedStacks = stacks.join('\n' + STACK_JUMP_SEPARATOR + '\n');
            error.stack = filterStackString(concatedStacks);
        }
    }
    function filterStackString(stackString) {
        var lines = stackString.split('\n');
        var desiredLines = [];
        for (var i = 0; i < lines.length; ++i) {
            var line = lines[i];
            if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
                desiredLines.push(line);
            }
        }
        return desiredLines.join('\n');
    }
    function isNodeFrame(stackLine) {
        return stackLine.indexOf('(module.js:') !== -1 || stackLine.indexOf('(node.js:') !== -1;
    }
    function getFileNameAndLineNumber(stackLine) {
        var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
        if (attempt1) {
            return [
                attempt1[1],
                Number(attempt1[2])
            ];
        }
        var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
        if (attempt2) {
            return [
                attempt2[1],
                Number(attempt2[2])
            ];
        }
        var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
        if (attempt3) {
            return [
                attempt3[1],
                Number(attempt3[2])
            ];
        }
    }
    function isInternalFrame(stackLine) {
        var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
        if (!fileNameAndLineNumber) {
            return false;
        }
        var fileName = fileNameAndLineNumber[0];
        var lineNumber = fileNameAndLineNumber[1];
        return fileName === qFileName && lineNumber >= qStartingLine && lineNumber <= qEndingLine;
    }
    function captureLine() {
        if (!hasStacks) {
            return;
        }
        try {
            throw new Error();
        } catch (e) {
            var lines = e.stack.split('\n');
            var firstLine = lines[0].indexOf('@') > 0 ? lines[1] : lines[2];
            var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
            if (!fileNameAndLineNumber) {
                return;
            }
            qFileName = fileNameAndLineNumber[0];
            return fileNameAndLineNumber[1];
        }
    }
    function deprecate(callback, name, alternative) {
        return function () {
            if (typeof console !== 'undefined' && typeof console.warn === 'function') {
                console.warn(name + ' is deprecated, use ' + alternative + ' instead.', new Error('').stack);
            }
            return callback.apply(callback, arguments);
        };
    }
    function Q(value) {
        if (isPromise(value)) {
            return value;
        }
        if (isPromiseAlike(value)) {
            return coerce(value);
        } else {
            return fulfill(value);
        }
    }
    Q.resolve = Q;
    Q.nextTick = nextTick;
    Q.longStackSupport = false;
    Q.defer = defer;
    function defer() {
        var messages = [], progressListeners = [], resolvedPromise;
        var deferred = object_create(defer.prototype);
        var promise = object_create(Promise.prototype);
        promise.promiseDispatch = function (resolve, op, operands) {
            var args = array_slice(arguments);
            if (messages) {
                messages.push(args);
                if (op === 'when' && operands[1]) {
                    progressListeners.push(operands[1]);
                }
            } else {
                nextTick(function () {
                    resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
                });
            }
        };
        promise.valueOf = function () {
            if (messages) {
                return promise;
            }
            var nearerValue = nearer(resolvedPromise);
            if (isPromise(nearerValue)) {
                resolvedPromise = nearerValue;
            }
            return nearerValue;
        };
        promise.inspect = function () {
            if (!resolvedPromise) {
                return { state: 'pending' };
            }
            return resolvedPromise.inspect();
        };
        if (Q.longStackSupport && hasStacks) {
            try {
                throw new Error();
            } catch (e) {
                promise.stack = e.stack.substring(e.stack.indexOf('\n') + 1);
            }
        }
        function become(newPromise) {
            resolvedPromise = newPromise;
            promise.source = newPromise;
            array_reduce(messages, function (undefined, message) {
                nextTick(function () {
                    newPromise.promiseDispatch.apply(newPromise, message);
                });
            }, void 0);
            messages = void 0;
            progressListeners = void 0;
        }
        deferred.promise = promise;
        deferred.resolve = function (value) {
            if (resolvedPromise) {
                return;
            }
            become(Q(value));
        };
        deferred.fulfill = function (value) {
            if (resolvedPromise) {
                return;
            }
            become(fulfill(value));
        };
        deferred.reject = function (reason) {
            if (resolvedPromise) {
                return;
            }
            become(reject(reason));
        };
        deferred.notify = function (progress) {
            if (resolvedPromise) {
                return;
            }
            array_reduce(progressListeners, function (undefined, progressListener) {
                nextTick(function () {
                    progressListener(progress);
                });
            }, void 0);
        };
        return deferred;
    }
    defer.prototype.makeNodeResolver = function () {
        var self = this;
        return function (error, value) {
            if (error) {
                self.reject(error);
            } else if (arguments.length > 2) {
                self.resolve(array_slice(arguments, 1));
            } else {
                self.resolve(value);
            }
        };
    };
    Q.promise = promise;
    function promise(resolver) {
        if (typeof resolver !== 'function') {
            throw new TypeError('resolver must be a function.');
        }
        var deferred = defer();
        try {
            resolver(deferred.resolve, deferred.reject, deferred.notify);
        } catch (reason) {
            deferred.reject(reason);
        }
        return deferred.promise;
    }
    Q.passByCopy = function (object) {
        return object;
    };
    Promise.prototype.passByCopy = function () {
        return this;
    };
    Q.join = function (x, y) {
        return Q(x).join(y);
    };
    Promise.prototype.join = function (that) {
        return Q([
            this,
            that
        ]).spread(function (x, y) {
            if (x === y) {
                return x;
            } else {
                throw new Error('Can\'t join: not the same: ' + x + ' ' + y);
            }
        });
    };
    Q.race = race;
    function race(answerPs) {
        return promise(function (resolve, reject) {
            for (var i = 0, len = answerPs.length; i < len; i++) {
                Q(answerPs[i]).then(resolve, reject);
            }
        });
    }
    Promise.prototype.race = function () {
        return this.then(Q.race);
    };
    Q.makePromise = Promise;
    function Promise(descriptor, fallback, inspect) {
        if (fallback === void 0) {
            fallback = function (op) {
                return reject(new Error('Promise does not support operation: ' + op));
            };
        }
        if (inspect === void 0) {
            inspect = function () {
                return { state: 'unknown' };
            };
        }
        var promise = object_create(Promise.prototype);
        promise.promiseDispatch = function (resolve, op, args) {
            var result;
            try {
                if (descriptor[op]) {
                    result = descriptor[op].apply(promise, args);
                } else {
                    result = fallback.call(promise, op, args);
                }
            } catch (exception) {
                result = reject(exception);
            }
            if (resolve) {
                resolve(result);
            }
        };
        promise.inspect = inspect;
        if (inspect) {
            var inspected = inspect();
            if (inspected.state === 'rejected') {
                promise.exception = inspected.reason;
            }
            promise.valueOf = function () {
                var inspected = inspect();
                if (inspected.state === 'pending' || inspected.state === 'rejected') {
                    return promise;
                }
                return inspected.value;
            };
        }
        return promise;
    }
    Promise.prototype.toString = function () {
        return '[object Promise]';
    };
    Promise.prototype.then = function (fulfilled, rejected, progressed) {
        var self = this;
        var deferred = defer();
        var done = false;
        function _fulfilled(value) {
            try {
                return typeof fulfilled === 'function' ? fulfilled(value) : value;
            } catch (exception) {
                return reject(exception);
            }
        }
        function _rejected(exception) {
            if (typeof rejected === 'function') {
                makeStackTraceLong(exception, self);
                try {
                    return rejected(exception);
                } catch (newException) {
                    return reject(newException);
                }
            }
            return reject(exception);
        }
        function _progressed(value) {
            return typeof progressed === 'function' ? progressed(value) : value;
        }
        nextTick(function () {
            self.promiseDispatch(function (value) {
                if (done) {
                    return;
                }
                done = true;
                deferred.resolve(_fulfilled(value));
            }, 'when', [function (exception) {
                    if (done) {
                        return;
                    }
                    done = true;
                    deferred.resolve(_rejected(exception));
                }]);
        });
        self.promiseDispatch(void 0, 'when', [
            void 0,
            function (value) {
                var newValue;
                var threw = false;
                try {
                    newValue = _progressed(value);
                } catch (e) {
                    threw = true;
                    if (Q.onerror) {
                        Q.onerror(e);
                    } else {
                        throw e;
                    }
                }
                if (!threw) {
                    deferred.notify(newValue);
                }
            }
        ]);
        return deferred.promise;
    };
    Q.when = when;
    function when(value, fulfilled, rejected, progressed) {
        return Q(value).then(fulfilled, rejected, progressed);
    }
    Promise.prototype.thenResolve = function (value) {
        return this.then(function () {
            return value;
        });
    };
    Q.thenResolve = function (promise, value) {
        return Q(promise).thenResolve(value);
    };
    Promise.prototype.thenReject = function (reason) {
        return this.then(function () {
            throw reason;
        });
    };
    Q.thenReject = function (promise, reason) {
        return Q(promise).thenReject(reason);
    };
    Q.nearer = nearer;
    function nearer(value) {
        if (isPromise(value)) {
            var inspected = value.inspect();
            if (inspected.state === 'fulfilled') {
                return inspected.value;
            }
        }
        return value;
    }
    Q.isPromise = isPromise;
    function isPromise(object) {
        return isObject(object) && typeof object.promiseDispatch === 'function' && typeof object.inspect === 'function';
    }
    Q.isPromiseAlike = isPromiseAlike;
    function isPromiseAlike(object) {
        return isObject(object) && typeof object.then === 'function';
    }
    Q.isPending = isPending;
    function isPending(object) {
        return isPromise(object) && object.inspect().state === 'pending';
    }
    Promise.prototype.isPending = function () {
        return this.inspect().state === 'pending';
    };
    Q.isFulfilled = isFulfilled;
    function isFulfilled(object) {
        return !isPromise(object) || object.inspect().state === 'fulfilled';
    }
    Promise.prototype.isFulfilled = function () {
        return this.inspect().state === 'fulfilled';
    };
    Q.isRejected = isRejected;
    function isRejected(object) {
        return isPromise(object) && object.inspect().state === 'rejected';
    }
    Promise.prototype.isRejected = function () {
        return this.inspect().state === 'rejected';
    };
    var unhandledReasons = [];
    var unhandledRejections = [];
    var unhandledReasonsDisplayed = false;
    var trackUnhandledRejections = true;
    function displayUnhandledReasons() {
        if (!unhandledReasonsDisplayed && typeof window !== 'undefined' && window.console) {
            console.warn('[Q] Unhandled rejection reasons (should be empty):', unhandledReasons);
        }
        unhandledReasonsDisplayed = true;
    }
    function logUnhandledReasons() {
        for (var i = 0; i < unhandledReasons.length; i++) {
            var reason = unhandledReasons[i];
            console.warn('Unhandled rejection reason:', reason);
        }
    }
    function resetUnhandledRejections() {
        unhandledReasons.length = 0;
        unhandledRejections.length = 0;
        unhandledReasonsDisplayed = false;
        if (!trackUnhandledRejections) {
            trackUnhandledRejections = true;
            if (typeof process !== 'undefined' && process.on) {
                process.on('exit', logUnhandledReasons);
            }
        }
    }
    function trackRejection(promise, reason) {
        if (!trackUnhandledRejections) {
            return;
        }
        unhandledRejections.push(promise);
        if (reason && typeof reason.stack !== 'undefined') {
            unhandledReasons.push(reason.stack);
        } else {
            unhandledReasons.push('(no stack) ' + reason);
        }
        displayUnhandledReasons();
    }
    function untrackRejection(promise) {
        if (!trackUnhandledRejections) {
            return;
        }
        var at = array_indexOf(unhandledRejections, promise);
        if (at !== -1) {
            unhandledRejections.splice(at, 1);
            unhandledReasons.splice(at, 1);
        }
    }
    Q.resetUnhandledRejections = resetUnhandledRejections;
    Q.getUnhandledReasons = function () {
        return unhandledReasons.slice();
    };
    Q.stopUnhandledRejectionTracking = function () {
        resetUnhandledRejections();
        if (typeof process !== 'undefined' && process.on) {
            process.removeListener('exit', logUnhandledReasons);
        }
        trackUnhandledRejections = false;
    };
    resetUnhandledRejections();
    Q.reject = reject;
    function reject(reason) {
        var rejection = Promise({
                'when': function (rejected) {
                    if (rejected) {
                        untrackRejection(this);
                    }
                    return rejected ? rejected(reason) : this;
                }
            }, function fallback() {
                return this;
            }, function inspect() {
                return {
                    state: 'rejected',
                    reason: reason
                };
            });
        trackRejection(rejection, reason);
        return rejection;
    }
    Q.fulfill = fulfill;
    function fulfill(value) {
        return Promise({
            'when': function () {
                return value;
            },
            'get': function (name) {
                return value[name];
            },
            'set': function (name, rhs) {
                value[name] = rhs;
            },
            'delete': function (name) {
                delete value[name];
            },
            'post': function (name, args) {
                if (name === null || name === void 0) {
                    return value.apply(void 0, args);
                } else {
                    return value[name].apply(value, args);
                }
            },
            'apply': function (thisp, args) {
                return value.apply(thisp, args);
            },
            'keys': function () {
                return object_keys(value);
            }
        }, void 0, function inspect() {
            return {
                state: 'fulfilled',
                value: value
            };
        });
    }
    function coerce(promise) {
        var deferred = defer();
        nextTick(function () {
            try {
                promise.then(deferred.resolve, deferred.reject, deferred.notify);
            } catch (exception) {
                deferred.reject(exception);
            }
        });
        return deferred.promise;
    }
    Q.master = master;
    function master(object) {
        return Promise({
            'isDef': function () {
            }
        }, function fallback(op, args) {
            return dispatch(object, op, args);
        }, function () {
            return Q(object).inspect();
        });
    }
    Q.spread = spread;
    function spread(value, fulfilled, rejected) {
        return Q(value).spread(fulfilled, rejected);
    }
    Promise.prototype.spread = function (fulfilled, rejected) {
        return this.all().then(function (array) {
            return fulfilled.apply(void 0, array);
        }, rejected);
    };
    Q.async = async;
    function async(makeGenerator) {
        return function () {
            function continuer(verb, arg) {
                var result;
                if (hasES6Generators) {
                    try {
                        result = generator[verb](arg);
                    } catch (exception) {
                        return reject(exception);
                    }
                    if (result.done) {
                        return result.value;
                    } else {
                        return when(result.value, callback, errback);
                    }
                } else {
                    try {
                        result = generator[verb](arg);
                    } catch (exception) {
                        if (isStopIteration(exception)) {
                            return exception.value;
                        } else {
                            return reject(exception);
                        }
                    }
                    return when(result, callback, errback);
                }
            }
            var generator = makeGenerator.apply(this, arguments);
            var callback = continuer.bind(continuer, 'next');
            var errback = continuer.bind(continuer, 'throw');
            return callback();
        };
    }
    Q.spawn = spawn;
    function spawn(makeGenerator) {
        Q.done(Q.async(makeGenerator)());
    }
    Q['return'] = _return;
    function _return(value) {
        throw new QReturnValue(value);
    }
    Q.promised = promised;
    function promised(callback) {
        return function () {
            return spread([
                this,
                all(arguments)
            ], function (self, args) {
                return callback.apply(self, args);
            });
        };
    }
    Q.dispatch = dispatch;
    function dispatch(object, op, args) {
        return Q(object).dispatch(op, args);
    }
    Promise.prototype.dispatch = function (op, args) {
        var self = this;
        var deferred = defer();
        nextTick(function () {
            self.promiseDispatch(deferred.resolve, op, args);
        });
        return deferred.promise;
    };
    Q.get = function (object, key) {
        return Q(object).dispatch('get', [key]);
    };
    Promise.prototype.get = function (key) {
        return this.dispatch('get', [key]);
    };
    Q.set = function (object, key, value) {
        return Q(object).dispatch('set', [
            key,
            value
        ]);
    };
    Promise.prototype.set = function (key, value) {
        return this.dispatch('set', [
            key,
            value
        ]);
    };
    Q.del = Q['delete'] = function (object, key) {
        return Q(object).dispatch('delete', [key]);
    };
    Promise.prototype.del = Promise.prototype['delete'] = function (key) {
        return this.dispatch('delete', [key]);
    };
    Q.mapply = Q.post = function (object, name, args) {
        return Q(object).dispatch('post', [
            name,
            args
        ]);
    };
    Promise.prototype.mapply = Promise.prototype.post = function (name, args) {
        return this.dispatch('post', [
            name,
            args
        ]);
    };
    Q.send = Q.mcall = Q.invoke = function (object, name) {
        return Q(object).dispatch('post', [
            name,
            array_slice(arguments, 2)
        ]);
    };
    Promise.prototype.send = Promise.prototype.mcall = Promise.prototype.invoke = function (name) {
        return this.dispatch('post', [
            name,
            array_slice(arguments, 1)
        ]);
    };
    Q.fapply = function (object, args) {
        return Q(object).dispatch('apply', [
            void 0,
            args
        ]);
    };
    Promise.prototype.fapply = function (args) {
        return this.dispatch('apply', [
            void 0,
            args
        ]);
    };
    Q['try'] = Q.fcall = function (object) {
        return Q(object).dispatch('apply', [
            void 0,
            array_slice(arguments, 1)
        ]);
    };
    Promise.prototype.fcall = function () {
        return this.dispatch('apply', [
            void 0,
            array_slice(arguments)
        ]);
    };
    Q.fbind = function (object) {
        var promise = Q(object);
        var args = array_slice(arguments, 1);
        return function fbound() {
            return promise.dispatch('apply', [
                this,
                args.concat(array_slice(arguments))
            ]);
        };
    };
    Promise.prototype.fbind = function () {
        var promise = this;
        var args = array_slice(arguments);
        return function fbound() {
            return promise.dispatch('apply', [
                this,
                args.concat(array_slice(arguments))
            ]);
        };
    };
    Q.keys = function (object) {
        return Q(object).dispatch('keys', []);
    };
    Promise.prototype.keys = function () {
        return this.dispatch('keys', []);
    };
    Q.all = all;
    function all(promises) {
        return when(promises, function (promises) {
            var countDown = 0;
            var deferred = defer();
            array_reduce(promises, function (undefined, promise, index) {
                var snapshot;
                if (isPromise(promise) && (snapshot = promise.inspect()).state === 'fulfilled') {
                    promises[index] = snapshot.value;
                } else {
                    ++countDown;
                    when(promise, function (value) {
                        promises[index] = value;
                        if (--countDown === 0) {
                            deferred.resolve(promises);
                        }
                    }, deferred.reject, function (progress) {
                        deferred.notify({
                            index: index,
                            value: progress
                        });
                    });
                }
            }, void 0);
            if (countDown === 0) {
                deferred.resolve(promises);
            }
            return deferred.promise;
        });
    }
    Promise.prototype.all = function () {
        return all(this);
    };
    Q.allResolved = deprecate(allResolved, 'allResolved', 'allSettled');
    function allResolved(promises) {
        return when(promises, function (promises) {
            promises = array_map(promises, Q);
            return when(all(array_map(promises, function (promise) {
                return when(promise, noop, noop);
            })), function () {
                return promises;
            });
        });
    }
    Promise.prototype.allResolved = function () {
        return allResolved(this);
    };
    Q.allSettled = allSettled;
    function allSettled(promises) {
        return Q(promises).allSettled();
    }
    Promise.prototype.allSettled = function () {
        return this.then(function (promises) {
            return all(array_map(promises, function (promise) {
                promise = Q(promise);
                function regardless() {
                    return promise.inspect();
                }
                return promise.then(regardless, regardless);
            }));
        });
    };
    Q.fail = Q['catch'] = function (object, rejected) {
        return Q(object).then(void 0, rejected);
    };
    Promise.prototype.fail = Promise.prototype['catch'] = function (rejected) {
        return this.then(void 0, rejected);
    };
    Q.progress = progress;
    function progress(object, progressed) {
        return Q(object).then(void 0, void 0, progressed);
    }
    Promise.prototype.progress = function (progressed) {
        return this.then(void 0, void 0, progressed);
    };
    Q.fin = Q['finally'] = function (object, callback) {
        return Q(object)['finally'](callback);
    };
    Promise.prototype.fin = Promise.prototype['finally'] = function (callback) {
        callback = Q(callback);
        return this.then(function (value) {
            return callback.fcall().then(function () {
                return value;
            });
        }, function (reason) {
            return callback.fcall().then(function () {
                throw reason;
            });
        });
    };
    Q.done = function (object, fulfilled, rejected, progress) {
        return Q(object).done(fulfilled, rejected, progress);
    };
    Promise.prototype.done = function (fulfilled, rejected, progress) {
        var onUnhandledError = function (error) {
            nextTick(function () {
                makeStackTraceLong(error, promise);
                if (Q.onerror) {
                    Q.onerror(error);
                } else {
                    throw error;
                }
            });
        };
        var promise = fulfilled || rejected || progress ? this.then(fulfilled, rejected, progress) : this;
        if (typeof process === 'object' && process && process.domain) {
            onUnhandledError = process.domain.bind(onUnhandledError);
        }
        promise.then(void 0, onUnhandledError);
    };
    Q.timeout = function (object, ms, message) {
        return Q(object).timeout(ms, message);
    };
    Promise.prototype.timeout = function (ms, message) {
        var deferred = defer();
        var timeoutId = setTimeout(function () {
                deferred.reject(new Error(message || 'Timed out after ' + ms + ' ms'));
            }, ms);
        this.then(function (value) {
            clearTimeout(timeoutId);
            deferred.resolve(value);
        }, function (exception) {
            clearTimeout(timeoutId);
            deferred.reject(exception);
        }, deferred.notify);
        return deferred.promise;
    };
    Q.delay = function (object, timeout) {
        if (timeout === void 0) {
            timeout = object;
            object = void 0;
        }
        return Q(object).delay(timeout);
    };
    Promise.prototype.delay = function (timeout) {
        return this.then(function (value) {
            var deferred = defer();
            setTimeout(function () {
                deferred.resolve(value);
            }, timeout);
            return deferred.promise;
        });
    };
    Q.nfapply = function (callback, args) {
        return Q(callback).nfapply(args);
    };
    Promise.prototype.nfapply = function (args) {
        var deferred = defer();
        var nodeArgs = array_slice(args);
        nodeArgs.push(deferred.makeNodeResolver());
        this.fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
    Q.nfcall = function (callback) {
        var args = array_slice(arguments, 1);
        return Q(callback).nfapply(args);
    };
    Promise.prototype.nfcall = function () {
        var nodeArgs = array_slice(arguments);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        this.fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
    Q.nfbind = Q.denodeify = function (callback) {
        var baseArgs = array_slice(arguments, 1);
        return function () {
            var nodeArgs = baseArgs.concat(array_slice(arguments));
            var deferred = defer();
            nodeArgs.push(deferred.makeNodeResolver());
            Q(callback).fapply(nodeArgs).fail(deferred.reject);
            return deferred.promise;
        };
    };
    Promise.prototype.nfbind = Promise.prototype.denodeify = function () {
        var args = array_slice(arguments);
        args.unshift(this);
        return Q.denodeify.apply(void 0, args);
    };
    Q.nbind = function (callback, thisp) {
        var baseArgs = array_slice(arguments, 2);
        return function () {
            var nodeArgs = baseArgs.concat(array_slice(arguments));
            var deferred = defer();
            nodeArgs.push(deferred.makeNodeResolver());
            function bound() {
                return callback.apply(thisp, arguments);
            }
            Q(bound).fapply(nodeArgs).fail(deferred.reject);
            return deferred.promise;
        };
    };
    Promise.prototype.nbind = function () {
        var args = array_slice(arguments, 0);
        args.unshift(this);
        return Q.nbind.apply(void 0, args);
    };
    Q.nmapply = Q.npost = function (object, name, args) {
        return Q(object).npost(name, args);
    };
    Promise.prototype.nmapply = Promise.prototype.npost = function (name, args) {
        var nodeArgs = array_slice(args || []);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        this.dispatch('post', [
            name,
            nodeArgs
        ]).fail(deferred.reject);
        return deferred.promise;
    };
    Q.nsend = Q.nmcall = Q.ninvoke = function (object, name) {
        var nodeArgs = array_slice(arguments, 2);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(object).dispatch('post', [
            name,
            nodeArgs
        ]).fail(deferred.reject);
        return deferred.promise;
    };
    Promise.prototype.nsend = Promise.prototype.nmcall = Promise.prototype.ninvoke = function (name) {
        var nodeArgs = array_slice(arguments, 1);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        this.dispatch('post', [
            name,
            nodeArgs
        ]).fail(deferred.reject);
        return deferred.promise;
    };
    Q.nodeify = nodeify;
    function nodeify(object, nodeback) {
        return Q(object).nodeify(nodeback);
    }
    Promise.prototype.nodeify = function (nodeback) {
        if (nodeback) {
            this.then(function (value) {
                nextTick(function () {
                    nodeback(null, value);
                });
            }, function (error) {
                nextTick(function () {
                    nodeback(error);
                });
            });
        } else {
            return this;
        }
    };
    var qEndingLine = captureLine();
    return Q;
}));
});
require.define('16', function(module, exports, __dirname, __filename, undefined){
;
(function () {
    var undefined;
    var arrayPool = [], objectPool = [];
    var idCounter = 0;
    var keyPrefix = +new Date() + '';
    var largeArraySize = 75;
    var maxPoolSize = 40;
    var whitespace = ' \t\x0B\f\xa0\ufeff' + '\n\r\u2028\u2029' + '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000';
    var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
    var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
    var reFlags = /\w*$/;
    var reFuncName = /^\s*function[ \n\r\t]+\w/;
    var reInterpolate = /<%=([\s\S]+?)%>/g;
    var reLeadingSpacesAndZeros = RegExp('^[' + whitespace + ']*0+(?=.$)');
    var reNoMatch = /($^)/;
    var reThis = /\bthis\b/;
    var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;
    var contextProps = [
            'Array',
            'Boolean',
            'Date',
            'Function',
            'Math',
            'Number',
            'Object',
            'RegExp',
            'String',
            '_',
            'attachEvent',
            'clearTimeout',
            'isFinite',
            'isNaN',
            'parseInt',
            'setTimeout'
        ];
    var templateCounter = 0;
    var argsClass = '[object Arguments]', arrayClass = '[object Array]', boolClass = '[object Boolean]', dateClass = '[object Date]', funcClass = '[object Function]', numberClass = '[object Number]', objectClass = '[object Object]', regexpClass = '[object RegExp]', stringClass = '[object String]';
    var cloneableClasses = {};
    cloneableClasses[funcClass] = false;
    cloneableClasses[argsClass] = cloneableClasses[arrayClass] = cloneableClasses[boolClass] = cloneableClasses[dateClass] = cloneableClasses[numberClass] = cloneableClasses[objectClass] = cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;
    var debounceOptions = {
            'leading': false,
            'maxWait': 0,
            'trailing': false
        };
    var descriptor = {
            'configurable': false,
            'enumerable': false,
            'value': null,
            'writable': false
        };
    var objectTypes = {
            'boolean': false,
            'function': true,
            'object': true,
            'number': false,
            'string': false,
            'undefined': false
        };
    var stringEscapes = {
            '\\': '\\',
            '\'': '\'',
            '\n': 'n',
            '\r': 'r',
            '\t': 't',
            '\u2028': 'u2028',
            '\u2029': 'u2029'
        };
    var root = objectTypes[typeof window] && window || this;
    var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
    var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;
    var freeGlobal = objectTypes[typeof global] && global;
    if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
        root = freeGlobal;
    }
    function baseIndexOf(array, value, fromIndex) {
        var index = (fromIndex || 0) - 1, length = array ? array.length : 0;
        while (++index < length) {
            if (array[index] === value) {
                return index;
            }
        }
        return -1;
    }
    function cacheIndexOf(cache, value) {
        var type = typeof value;
        cache = cache.cache;
        if (type == 'boolean' || value == null) {
            return cache[value] ? 0 : -1;
        }
        if (type != 'number' && type != 'string') {
            type = 'object';
        }
        var key = type == 'number' ? value : keyPrefix + value;
        cache = (cache = cache[type]) && cache[key];
        return type == 'object' ? cache && baseIndexOf(cache, value) > -1 ? 0 : -1 : cache ? 0 : -1;
    }
    function cachePush(value) {
        var cache = this.cache, type = typeof value;
        if (type == 'boolean' || value == null) {
            cache[value] = true;
        } else {
            if (type != 'number' && type != 'string') {
                type = 'object';
            }
            var key = type == 'number' ? value : keyPrefix + value, typeCache = cache[type] || (cache[type] = {});
            if (type == 'object') {
                (typeCache[key] || (typeCache[key] = [])).push(value);
            } else {
                typeCache[key] = true;
            }
        }
    }
    function charAtCallback(value) {
        return value.charCodeAt(0);
    }
    function compareAscending(a, b) {
        var ac = a.criteria, bc = b.criteria, index = -1, length = ac.length;
        while (++index < length) {
            var value = ac[index], other = bc[index];
            if (value !== other) {
                if (value > other || typeof value == 'undefined') {
                    return 1;
                }
                if (value < other || typeof other == 'undefined') {
                    return -1;
                }
            }
        }
        return a.index - b.index;
    }
    function createCache(array) {
        var index = -1, length = array.length, first = array[0], mid = array[length / 2 | 0], last = array[length - 1];
        if (first && typeof first == 'object' && mid && typeof mid == 'object' && last && typeof last == 'object') {
            return false;
        }
        var cache = getObject();
        cache['false'] = cache['null'] = cache['true'] = cache['undefined'] = false;
        var result = getObject();
        result.array = array;
        result.cache = cache;
        result.push = cachePush;
        while (++index < length) {
            result.push(array[index]);
        }
        return result;
    }
    function escapeStringChar(match) {
        return '\\' + stringEscapes[match];
    }
    function getArray() {
        return arrayPool.pop() || [];
    }
    function getObject() {
        return objectPool.pop() || {
            'array': null,
            'cache': null,
            'criteria': null,
            'false': false,
            'index': 0,
            'null': false,
            'number': null,
            'object': null,
            'push': null,
            'string': null,
            'true': false,
            'undefined': false,
            'value': null
        };
    }
    function releaseArray(array) {
        array.length = 0;
        if (arrayPool.length < maxPoolSize) {
            arrayPool.push(array);
        }
    }
    function releaseObject(object) {
        var cache = object.cache;
        if (cache) {
            releaseObject(cache);
        }
        object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
        if (objectPool.length < maxPoolSize) {
            objectPool.push(object);
        }
    }
    function slice(array, start, end) {
        start || (start = 0);
        if (typeof end == 'undefined') {
            end = array ? array.length : 0;
        }
        var index = -1, length = end - start || 0, result = Array(length < 0 ? 0 : length);
        while (++index < length) {
            result[index] = array[start + index];
        }
        return result;
    }
    function runInContext(context) {
        context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;
        var Array = context.Array, Boolean = context.Boolean, Date = context.Date, Function = context.Function, Math = context.Math, Number = context.Number, Object = context.Object, RegExp = context.RegExp, String = context.String, TypeError = context.TypeError;
        var arrayRef = [];
        var objectProto = Object.prototype;
        var oldDash = context._;
        var toString = objectProto.toString;
        var reNative = RegExp('^' + String(toString).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/toString| for [^\]]+/g, '.*?') + '$');
        var ceil = Math.ceil, clearTimeout = context.clearTimeout, floor = Math.floor, fnToString = Function.prototype.toString, getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf, hasOwnProperty = objectProto.hasOwnProperty, push = arrayRef.push, setTimeout = context.setTimeout, splice = arrayRef.splice, unshift = arrayRef.unshift;
        var defineProperty = function () {
                try {
                    var o = {}, func = isNative(func = Object.defineProperty) && func, result = func(o, o, o) && func;
                } catch (e) {
                }
                return result;
            }();
        var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate, nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray, nativeIsFinite = context.isFinite, nativeIsNaN = context.isNaN, nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys, nativeMax = Math.max, nativeMin = Math.min, nativeParseInt = context.parseInt, nativeRandom = Math.random;
        var ctorByClass = {};
        ctorByClass[arrayClass] = Array;
        ctorByClass[boolClass] = Boolean;
        ctorByClass[dateClass] = Date;
        ctorByClass[funcClass] = Function;
        ctorByClass[objectClass] = Object;
        ctorByClass[numberClass] = Number;
        ctorByClass[regexpClass] = RegExp;
        ctorByClass[stringClass] = String;
        function lodash(value) {
            return value && typeof value == 'object' && !isArray(value) && hasOwnProperty.call(value, '__wrapped__') ? value : new lodashWrapper(value);
        }
        function lodashWrapper(value, chainAll) {
            this.__chain__ = !!chainAll;
            this.__wrapped__ = value;
        }
        lodashWrapper.prototype = lodash.prototype;
        var support = lodash.support = {};
        support.funcDecomp = !isNative(context.WinRTError) && reThis.test(runInContext);
        support.funcNames = typeof Function.name == 'string';
        lodash.templateSettings = {
            'escape': /<%-([\s\S]+?)%>/g,
            'evaluate': /<%([\s\S]+?)%>/g,
            'interpolate': reInterpolate,
            'variable': '',
            'imports': { '_': lodash }
        };
        function baseBind(bindData) {
            var func = bindData[0], partialArgs = bindData[2], thisArg = bindData[4];
            function bound() {
                if (partialArgs) {
                    var args = slice(partialArgs);
                    push.apply(args, arguments);
                }
                if (this instanceof bound) {
                    var thisBinding = baseCreate(func.prototype), result = func.apply(thisBinding, args || arguments);
                    return isObject(result) ? result : thisBinding;
                }
                return func.apply(thisArg, args || arguments);
            }
            setBindData(bound, bindData);
            return bound;
        }
        function baseClone(value, isDeep, callback, stackA, stackB) {
            if (callback) {
                var result = callback(value);
                if (typeof result != 'undefined') {
                    return result;
                }
            }
            var isObj = isObject(value);
            if (isObj) {
                var className = toString.call(value);
                if (!cloneableClasses[className]) {
                    return value;
                }
                var ctor = ctorByClass[className];
                switch (className) {
                case boolClass:
                case dateClass:
                    return new ctor(+value);
                case numberClass:
                case stringClass:
                    return new ctor(value);
                case regexpClass:
                    result = ctor(value.source, reFlags.exec(value));
                    result.lastIndex = value.lastIndex;
                    return result;
                }
            } else {
                return value;
            }
            var isArr = isArray(value);
            if (isDeep) {
                var initedStack = !stackA;
                stackA || (stackA = getArray());
                stackB || (stackB = getArray());
                var length = stackA.length;
                while (length--) {
                    if (stackA[length] == value) {
                        return stackB[length];
                    }
                }
                result = isArr ? ctor(value.length) : {};
            } else {
                result = isArr ? slice(value) : assign({}, value);
            }
            if (isArr) {
                if (hasOwnProperty.call(value, 'index')) {
                    result.index = value.index;
                }
                if (hasOwnProperty.call(value, 'input')) {
                    result.input = value.input;
                }
            }
            if (!isDeep) {
                return result;
            }
            stackA.push(value);
            stackB.push(result);
            (isArr ? forEach : forOwn)(value, function (objValue, key) {
                result[key] = baseClone(objValue, isDeep, callback, stackA, stackB);
            });
            if (initedStack) {
                releaseArray(stackA);
                releaseArray(stackB);
            }
            return result;
        }
        function baseCreate(prototype, properties) {
            return isObject(prototype) ? nativeCreate(prototype) : {};
        }
        if (!nativeCreate) {
            baseCreate = function () {
                function Object() {
                }
                return function (prototype) {
                    if (isObject(prototype)) {
                        Object.prototype = prototype;
                        var result = new Object();
                        Object.prototype = null;
                    }
                    return result || context.Object();
                };
            }();
        }
        function baseCreateCallback(func, thisArg, argCount) {
            if (typeof func != 'function') {
                return identity;
            }
            if (typeof thisArg == 'undefined' || !('prototype' in func)) {
                return func;
            }
            var bindData = func.__bindData__;
            if (typeof bindData == 'undefined') {
                if (support.funcNames) {
                    bindData = !func.name;
                }
                bindData = bindData || !support.funcDecomp;
                if (!bindData) {
                    var source = fnToString.call(func);
                    if (!support.funcNames) {
                        bindData = !reFuncName.test(source);
                    }
                    if (!bindData) {
                        bindData = reThis.test(source);
                        setBindData(func, bindData);
                    }
                }
            }
            if (bindData === false || bindData !== true && bindData[1] & 1) {
                return func;
            }
            switch (argCount) {
            case 1:
                return function (value) {
                    return func.call(thisArg, value);
                };
            case 2:
                return function (a, b) {
                    return func.call(thisArg, a, b);
                };
            case 3:
                return function (value, index, collection) {
                    return func.call(thisArg, value, index, collection);
                };
            case 4:
                return function (accumulator, value, index, collection) {
                    return func.call(thisArg, accumulator, value, index, collection);
                };
            }
            return bind(func, thisArg);
        }
        function baseCreateWrapper(bindData) {
            var func = bindData[0], bitmask = bindData[1], partialArgs = bindData[2], partialRightArgs = bindData[3], thisArg = bindData[4], arity = bindData[5];
            var isBind = bitmask & 1, isBindKey = bitmask & 2, isCurry = bitmask & 4, isCurryBound = bitmask & 8, key = func;
            function bound() {
                var thisBinding = isBind ? thisArg : this;
                if (partialArgs) {
                    var args = slice(partialArgs);
                    push.apply(args, arguments);
                }
                if (partialRightArgs || isCurry) {
                    args || (args = slice(arguments));
                    if (partialRightArgs) {
                        push.apply(args, partialRightArgs);
                    }
                    if (isCurry && args.length < arity) {
                        bitmask |= 16 & ~32;
                        return baseCreateWrapper([
                            func,
                            isCurryBound ? bitmask : bitmask & ~3,
                            args,
                            null,
                            thisArg,
                            arity
                        ]);
                    }
                }
                args || (args = arguments);
                if (isBindKey) {
                    func = thisBinding[key];
                }
                if (this instanceof bound) {
                    thisBinding = baseCreate(func.prototype);
                    var result = func.apply(thisBinding, args);
                    return isObject(result) ? result : thisBinding;
                }
                return func.apply(thisBinding, args);
            }
            setBindData(bound, bindData);
            return bound;
        }
        function baseDifference(array, values) {
            var index = -1, indexOf = getIndexOf(), length = array ? array.length : 0, isLarge = length >= largeArraySize && indexOf === baseIndexOf, result = [];
            if (isLarge) {
                var cache = createCache(values);
                if (cache) {
                    indexOf = cacheIndexOf;
                    values = cache;
                } else {
                    isLarge = false;
                }
            }
            while (++index < length) {
                var value = array[index];
                if (indexOf(values, value) < 0) {
                    result.push(value);
                }
            }
            if (isLarge) {
                releaseObject(values);
            }
            return result;
        }
        function baseFlatten(array, isShallow, isStrict, fromIndex) {
            var index = (fromIndex || 0) - 1, length = array ? array.length : 0, result = [];
            while (++index < length) {
                var value = array[index];
                if (value && typeof value == 'object' && typeof value.length == 'number' && (isArray(value) || isArguments(value))) {
                    if (!isShallow) {
                        value = baseFlatten(value, isShallow, isStrict);
                    }
                    var valIndex = -1, valLength = value.length, resIndex = result.length;
                    result.length += valLength;
                    while (++valIndex < valLength) {
                        result[resIndex++] = value[valIndex];
                    }
                } else if (!isStrict) {
                    result.push(value);
                }
            }
            return result;
        }
        function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
            if (callback) {
                var result = callback(a, b);
                if (typeof result != 'undefined') {
                    return !!result;
                }
            }
            if (a === b) {
                return a !== 0 || 1 / a == 1 / b;
            }
            var type = typeof a, otherType = typeof b;
            if (a === a && !(a && objectTypes[type]) && !(b && objectTypes[otherType])) {
                return false;
            }
            if (a == null || b == null) {
                return a === b;
            }
            var className = toString.call(a), otherClass = toString.call(b);
            if (className == argsClass) {
                className = objectClass;
            }
            if (otherClass == argsClass) {
                otherClass = objectClass;
            }
            if (className != otherClass) {
                return false;
            }
            switch (className) {
            case boolClass:
            case dateClass:
                return +a == +b;
            case numberClass:
                return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;
            case regexpClass:
            case stringClass:
                return a == String(b);
            }
            var isArr = className == arrayClass;
            if (!isArr) {
                var aWrapped = hasOwnProperty.call(a, '__wrapped__'), bWrapped = hasOwnProperty.call(b, '__wrapped__');
                if (aWrapped || bWrapped) {
                    return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
                }
                if (className != objectClass) {
                    return false;
                }
                var ctorA = a.constructor, ctorB = b.constructor;
                if (ctorA != ctorB && !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) && ('constructor' in a && 'constructor' in b)) {
                    return false;
                }
            }
            var initedStack = !stackA;
            stackA || (stackA = getArray());
            stackB || (stackB = getArray());
            var length = stackA.length;
            while (length--) {
                if (stackA[length] == a) {
                    return stackB[length] == b;
                }
            }
            var size = 0;
            result = true;
            stackA.push(a);
            stackB.push(b);
            if (isArr) {
                length = a.length;
                size = b.length;
                result = size == length;
                if (result || isWhere) {
                    while (size--) {
                        var index = length, value = b[size];
                        if (isWhere) {
                            while (index--) {
                                if (result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB)) {
                                    break;
                                }
                            }
                        } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
                            break;
                        }
                    }
                }
            } else {
                forIn(b, function (value, key, b) {
                    if (hasOwnProperty.call(b, key)) {
                        size++;
                        return result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB);
                    }
                });
                if (result && !isWhere) {
                    forIn(a, function (value, key, a) {
                        if (hasOwnProperty.call(a, key)) {
                            return result = --size > -1;
                        }
                    });
                }
            }
            stackA.pop();
            stackB.pop();
            if (initedStack) {
                releaseArray(stackA);
                releaseArray(stackB);
            }
            return result;
        }
        function baseMerge(object, source, callback, stackA, stackB) {
            (isArray(source) ? forEach : forOwn)(source, function (source, key) {
                var found, isArr, result = source, value = object[key];
                if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
                    var stackLength = stackA.length;
                    while (stackLength--) {
                        if (found = stackA[stackLength] == source) {
                            value = stackB[stackLength];
                            break;
                        }
                    }
                    if (!found) {
                        var isShallow;
                        if (callback) {
                            result = callback(value, source);
                            if (isShallow = typeof result != 'undefined') {
                                value = result;
                            }
                        }
                        if (!isShallow) {
                            value = isArr ? isArray(value) ? value : [] : isPlainObject(value) ? value : {};
                        }
                        stackA.push(source);
                        stackB.push(value);
                        if (!isShallow) {
                            baseMerge(value, source, callback, stackA, stackB);
                        }
                    }
                } else {
                    if (callback) {
                        result = callback(value, source);
                        if (typeof result == 'undefined') {
                            result = source;
                        }
                    }
                    if (typeof result != 'undefined') {
                        value = result;
                    }
                }
                object[key] = value;
            });
        }
        function baseRandom(min, max) {
            return min + floor(nativeRandom() * (max - min + 1));
        }
        function baseUniq(array, isSorted, callback) {
            var index = -1, indexOf = getIndexOf(), length = array ? array.length : 0, result = [];
            var isLarge = !isSorted && length >= largeArraySize && indexOf === baseIndexOf, seen = callback || isLarge ? getArray() : result;
            if (isLarge) {
                var cache = createCache(seen);
                indexOf = cacheIndexOf;
                seen = cache;
            }
            while (++index < length) {
                var value = array[index], computed = callback ? callback(value, index, array) : value;
                if (isSorted ? !index || seen[seen.length - 1] !== computed : indexOf(seen, computed) < 0) {
                    if (callback || isLarge) {
                        seen.push(computed);
                    }
                    result.push(value);
                }
            }
            if (isLarge) {
                releaseArray(seen.array);
                releaseObject(seen);
            } else if (callback) {
                releaseArray(seen);
            }
            return result;
        }
        function createAggregator(setter) {
            return function (collection, callback, thisArg) {
                var result = {};
                callback = lodash.createCallback(callback, thisArg, 3);
                var index = -1, length = collection ? collection.length : 0;
                if (typeof length == 'number') {
                    while (++index < length) {
                        var value = collection[index];
                        setter(result, value, callback(value, index, collection), collection);
                    }
                } else {
                    forOwn(collection, function (value, key, collection) {
                        setter(result, value, callback(value, key, collection), collection);
                    });
                }
                return result;
            };
        }
        function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
            var isBind = bitmask & 1, isBindKey = bitmask & 2, isCurry = bitmask & 4, isCurryBound = bitmask & 8, isPartial = bitmask & 16, isPartialRight = bitmask & 32;
            if (!isBindKey && !isFunction(func)) {
                throw new TypeError();
            }
            if (isPartial && !partialArgs.length) {
                bitmask &= ~16;
                isPartial = partialArgs = false;
            }
            if (isPartialRight && !partialRightArgs.length) {
                bitmask &= ~32;
                isPartialRight = partialRightArgs = false;
            }
            var bindData = func && func.__bindData__;
            if (bindData && bindData !== true) {
                bindData = slice(bindData);
                if (bindData[2]) {
                    bindData[2] = slice(bindData[2]);
                }
                if (bindData[3]) {
                    bindData[3] = slice(bindData[3]);
                }
                if (isBind && !(bindData[1] & 1)) {
                    bindData[4] = thisArg;
                }
                if (!isBind && bindData[1] & 1) {
                    bitmask |= 8;
                }
                if (isCurry && !(bindData[1] & 4)) {
                    bindData[5] = arity;
                }
                if (isPartial) {
                    push.apply(bindData[2] || (bindData[2] = []), partialArgs);
                }
                if (isPartialRight) {
                    unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
                }
                bindData[1] |= bitmask;
                return createWrapper.apply(null, bindData);
            }
            var creater = bitmask == 1 || bitmask === 17 ? baseBind : baseCreateWrapper;
            return creater([
                func,
                bitmask,
                partialArgs,
                partialRightArgs,
                thisArg,
                arity
            ]);
        }
        function escapeHtmlChar(match) {
            return htmlEscapes[match];
        }
        function getIndexOf() {
            var result = (result = lodash.indexOf) === indexOf ? baseIndexOf : result;
            return result;
        }
        function isNative(value) {
            return typeof value == 'function' && reNative.test(value);
        }
        var setBindData = !defineProperty ? noop : function (func, value) {
                descriptor.value = value;
                defineProperty(func, '__bindData__', descriptor);
            };
        function shimIsPlainObject(value) {
            var ctor, result;
            if (!(value && toString.call(value) == objectClass) || (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor))) {
                return false;
            }
            forIn(value, function (value, key) {
                result = key;
            });
            return typeof result == 'undefined' || hasOwnProperty.call(value, result);
        }
        function unescapeHtmlChar(match) {
            return htmlUnescapes[match];
        }
        function isArguments(value) {
            return value && typeof value == 'object' && typeof value.length == 'number' && toString.call(value) == argsClass || false;
        }
        var isArray = nativeIsArray || function (value) {
                return value && typeof value == 'object' && typeof value.length == 'number' && toString.call(value) == arrayClass || false;
            };
        var shimKeys = function (object) {
            var index, iterable = object, result = [];
            if (!iterable)
                return result;
            if (!objectTypes[typeof object])
                return result;
            for (index in iterable) {
                if (hasOwnProperty.call(iterable, index)) {
                    result.push(index);
                }
            }
            return result;
        };
        var keys = !nativeKeys ? shimKeys : function (object) {
                if (!isObject(object)) {
                    return [];
                }
                return nativeKeys(object);
            };
        var htmlEscapes = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                '\'': '&#39;'
            };
        var htmlUnescapes = invert(htmlEscapes);
        var reEscapedHtml = RegExp('(' + keys(htmlUnescapes).join('|') + ')', 'g'), reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');
        var assign = function (object, source, guard) {
            var index, iterable = object, result = iterable;
            if (!iterable)
                return result;
            var args = arguments, argsIndex = 0, argsLength = typeof guard == 'number' ? 2 : args.length;
            if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {
                var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);
            } else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {
                callback = args[--argsLength];
            }
            while (++argsIndex < argsLength) {
                iterable = args[argsIndex];
                if (iterable && objectTypes[typeof iterable]) {
                    var ownIndex = -1, ownProps = objectTypes[typeof iterable] && keys(iterable), length = ownProps ? ownProps.length : 0;
                    while (++ownIndex < length) {
                        index = ownProps[ownIndex];
                        result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];
                    }
                }
            }
            return result;
        };
        function clone(value, isDeep, callback, thisArg) {
            if (typeof isDeep != 'boolean' && isDeep != null) {
                thisArg = callback;
                callback = isDeep;
                isDeep = false;
            }
            return baseClone(value, isDeep, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
        }
        function cloneDeep(value, callback, thisArg) {
            return baseClone(value, true, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
        }
        function create(prototype, properties) {
            var result = baseCreate(prototype);
            return properties ? assign(result, properties) : result;
        }
        var defaults = function (object, source, guard) {
            var index, iterable = object, result = iterable;
            if (!iterable)
                return result;
            var args = arguments, argsIndex = 0, argsLength = typeof guard == 'number' ? 2 : args.length;
            while (++argsIndex < argsLength) {
                iterable = args[argsIndex];
                if (iterable && objectTypes[typeof iterable]) {
                    var ownIndex = -1, ownProps = objectTypes[typeof iterable] && keys(iterable), length = ownProps ? ownProps.length : 0;
                    while (++ownIndex < length) {
                        index = ownProps[ownIndex];
                        if (typeof result[index] == 'undefined')
                            result[index] = iterable[index];
                    }
                }
            }
            return result;
        };
        function findKey(object, callback, thisArg) {
            var result;
            callback = lodash.createCallback(callback, thisArg, 3);
            forOwn(object, function (value, key, object) {
                if (callback(value, key, object)) {
                    result = key;
                    return false;
                }
            });
            return result;
        }
        function findLastKey(object, callback, thisArg) {
            var result;
            callback = lodash.createCallback(callback, thisArg, 3);
            forOwnRight(object, function (value, key, object) {
                if (callback(value, key, object)) {
                    result = key;
                    return false;
                }
            });
            return result;
        }
        var forIn = function (collection, callback, thisArg) {
            var index, iterable = collection, result = iterable;
            if (!iterable)
                return result;
            if (!objectTypes[typeof iterable])
                return result;
            callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
            for (index in iterable) {
                if (callback(iterable[index], index, collection) === false)
                    return result;
            }
            return result;
        };
        function forInRight(object, callback, thisArg) {
            var pairs = [];
            forIn(object, function (value, key) {
                pairs.push(key, value);
            });
            var length = pairs.length;
            callback = baseCreateCallback(callback, thisArg, 3);
            while (length--) {
                if (callback(pairs[length--], pairs[length], object) === false) {
                    break;
                }
            }
            return object;
        }
        var forOwn = function (collection, callback, thisArg) {
            var index, iterable = collection, result = iterable;
            if (!iterable)
                return result;
            if (!objectTypes[typeof iterable])
                return result;
            callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
            var ownIndex = -1, ownProps = objectTypes[typeof iterable] && keys(iterable), length = ownProps ? ownProps.length : 0;
            while (++ownIndex < length) {
                index = ownProps[ownIndex];
                if (callback(iterable[index], index, collection) === false)
                    return result;
            }
            return result;
        };
        function forOwnRight(object, callback, thisArg) {
            var props = keys(object), length = props.length;
            callback = baseCreateCallback(callback, thisArg, 3);
            while (length--) {
                var key = props[length];
                if (callback(object[key], key, object) === false) {
                    break;
                }
            }
            return object;
        }
        function functions(object) {
            var result = [];
            forIn(object, function (value, key) {
                if (isFunction(value)) {
                    result.push(key);
                }
            });
            return result.sort();
        }
        function has(object, key) {
            return object ? hasOwnProperty.call(object, key) : false;
        }
        function invert(object) {
            var index = -1, props = keys(object), length = props.length, result = {};
            while (++index < length) {
                var key = props[index];
                result[object[key]] = key;
            }
            return result;
        }
        function isBoolean(value) {
            return value === true || value === false || value && typeof value == 'object' && toString.call(value) == boolClass || false;
        }
        function isDate(value) {
            return value && typeof value == 'object' && toString.call(value) == dateClass || false;
        }
        function isElement(value) {
            return value && value.nodeType === 1 || false;
        }
        function isEmpty(value) {
            var result = true;
            if (!value) {
                return result;
            }
            var className = toString.call(value), length = value.length;
            if (className == arrayClass || className == stringClass || className == argsClass || className == objectClass && typeof length == 'number' && isFunction(value.splice)) {
                return !length;
            }
            forOwn(value, function () {
                return result = false;
            });
            return result;
        }
        function isEqual(a, b, callback, thisArg) {
            return baseIsEqual(a, b, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 2));
        }
        function isFinite(value) {
            return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
        }
        function isFunction(value) {
            return typeof value == 'function';
        }
        function isObject(value) {
            return !!(value && objectTypes[typeof value]);
        }
        function isNaN(value) {
            return isNumber(value) && value != +value;
        }
        function isNull(value) {
            return value === null;
        }
        function isNumber(value) {
            return typeof value == 'number' || value && typeof value == 'object' && toString.call(value) == numberClass || false;
        }
        var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function (value) {
                if (!(value && toString.call(value) == objectClass)) {
                    return false;
                }
                var valueOf = value.valueOf, objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);
                return objProto ? value == objProto || getPrototypeOf(value) == objProto : shimIsPlainObject(value);
            };
        function isRegExp(value) {
            return value && typeof value == 'object' && toString.call(value) == regexpClass || false;
        }
        function isString(value) {
            return typeof value == 'string' || value && typeof value == 'object' && toString.call(value) == stringClass || false;
        }
        function isUndefined(value) {
            return typeof value == 'undefined';
        }
        function mapValues(object, callback, thisArg) {
            var result = {};
            callback = lodash.createCallback(callback, thisArg, 3);
            forOwn(object, function (value, key, object) {
                result[key] = callback(value, key, object);
            });
            return result;
        }
        function merge(object) {
            var args = arguments, length = 2;
            if (!isObject(object)) {
                return object;
            }
            if (typeof args[2] != 'number') {
                length = args.length;
            }
            if (length > 3 && typeof args[length - 2] == 'function') {
                var callback = baseCreateCallback(args[--length - 1], args[length--], 2);
            } else if (length > 2 && typeof args[length - 1] == 'function') {
                callback = args[--length];
            }
            var sources = slice(arguments, 1, length), index = -1, stackA = getArray(), stackB = getArray();
            while (++index < length) {
                baseMerge(object, sources[index], callback, stackA, stackB);
            }
            releaseArray(stackA);
            releaseArray(stackB);
            return object;
        }
        function omit(object, callback, thisArg) {
            var result = {};
            if (typeof callback != 'function') {
                var props = [];
                forIn(object, function (value, key) {
                    props.push(key);
                });
                props = baseDifference(props, baseFlatten(arguments, true, false, 1));
                var index = -1, length = props.length;
                while (++index < length) {
                    var key = props[index];
                    result[key] = object[key];
                }
            } else {
                callback = lodash.createCallback(callback, thisArg, 3);
                forIn(object, function (value, key, object) {
                    if (!callback(value, key, object)) {
                        result[key] = value;
                    }
                });
            }
            return result;
        }
        function pairs(object) {
            var index = -1, props = keys(object), length = props.length, result = Array(length);
            while (++index < length) {
                var key = props[index];
                result[index] = [
                    key,
                    object[key]
                ];
            }
            return result;
        }
        function pick(object, callback, thisArg) {
            var result = {};
            if (typeof callback != 'function') {
                var index = -1, props = baseFlatten(arguments, true, false, 1), length = isObject(object) ? props.length : 0;
                while (++index < length) {
                    var key = props[index];
                    if (key in object) {
                        result[key] = object[key];
                    }
                }
            } else {
                callback = lodash.createCallback(callback, thisArg, 3);
                forIn(object, function (value, key, object) {
                    if (callback(value, key, object)) {
                        result[key] = value;
                    }
                });
            }
            return result;
        }
        function transform(object, callback, accumulator, thisArg) {
            var isArr = isArray(object);
            if (accumulator == null) {
                if (isArr) {
                    accumulator = [];
                } else {
                    var ctor = object && object.constructor, proto = ctor && ctor.prototype;
                    accumulator = baseCreate(proto);
                }
            }
            if (callback) {
                callback = lodash.createCallback(callback, thisArg, 4);
                (isArr ? forEach : forOwn)(object, function (value, index, object) {
                    return callback(accumulator, value, index, object);
                });
            }
            return accumulator;
        }
        function values(object) {
            var index = -1, props = keys(object), length = props.length, result = Array(length);
            while (++index < length) {
                result[index] = object[props[index]];
            }
            return result;
        }
        function at(collection) {
            var args = arguments, index = -1, props = baseFlatten(args, true, false, 1), length = args[2] && args[2][args[1]] === collection ? 1 : props.length, result = Array(length);
            while (++index < length) {
                result[index] = collection[props[index]];
            }
            return result;
        }
        function contains(collection, target, fromIndex) {
            var index = -1, indexOf = getIndexOf(), length = collection ? collection.length : 0, result = false;
            fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
            if (isArray(collection)) {
                result = indexOf(collection, target, fromIndex) > -1;
            } else if (typeof length == 'number') {
                result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1;
            } else {
                forOwn(collection, function (value) {
                    if (++index >= fromIndex) {
                        return !(result = value === target);
                    }
                });
            }
            return result;
        }
        var countBy = createAggregator(function (result, value, key) {
                hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1;
            });
        function every(collection, callback, thisArg) {
            var result = true;
            callback = lodash.createCallback(callback, thisArg, 3);
            var index = -1, length = collection ? collection.length : 0;
            if (typeof length == 'number') {
                while (++index < length) {
                    if (!(result = !!callback(collection[index], index, collection))) {
                        break;
                    }
                }
            } else {
                forOwn(collection, function (value, index, collection) {
                    return result = !!callback(value, index, collection);
                });
            }
            return result;
        }
        function filter(collection, callback, thisArg) {
            var result = [];
            callback = lodash.createCallback(callback, thisArg, 3);
            var index = -1, length = collection ? collection.length : 0;
            if (typeof length == 'number') {
                while (++index < length) {
                    var value = collection[index];
                    if (callback(value, index, collection)) {
                        result.push(value);
                    }
                }
            } else {
                forOwn(collection, function (value, index, collection) {
                    if (callback(value, index, collection)) {
                        result.push(value);
                    }
                });
            }
            return result;
        }
        function find(collection, callback, thisArg) {
            callback = lodash.createCallback(callback, thisArg, 3);
            var index = -1, length = collection ? collection.length : 0;
            if (typeof length == 'number') {
                while (++index < length) {
                    var value = collection[index];
                    if (callback(value, index, collection)) {
                        return value;
                    }
                }
            } else {
                var result;
                forOwn(collection, function (value, index, collection) {
                    if (callback(value, index, collection)) {
                        result = value;
                        return false;
                    }
                });
                return result;
            }
        }
        function findLast(collection, callback, thisArg) {
            var result;
            callback = lodash.createCallback(callback, thisArg, 3);
            forEachRight(collection, function (value, index, collection) {
                if (callback(value, index, collection)) {
                    result = value;
                    return false;
                }
            });
            return result;
        }
        function forEach(collection, callback, thisArg) {
            var index = -1, length = collection ? collection.length : 0;
            callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
            if (typeof length == 'number') {
                while (++index < length) {
                    if (callback(collection[index], index, collection) === false) {
                        break;
                    }
                }
            } else {
                forOwn(collection, callback);
            }
            return collection;
        }
        function forEachRight(collection, callback, thisArg) {
            var length = collection ? collection.length : 0;
            callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
            if (typeof length == 'number') {
                while (length--) {
                    if (callback(collection[length], length, collection) === false) {
                        break;
                    }
                }
            } else {
                var props = keys(collection);
                length = props.length;
                forOwn(collection, function (value, key, collection) {
                    key = props ? props[--length] : --length;
                    return callback(collection[key], key, collection);
                });
            }
            return collection;
        }
        var groupBy = createAggregator(function (result, value, key) {
                (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
            });
        var indexBy = createAggregator(function (result, value, key) {
                result[key] = value;
            });
        function invoke(collection, methodName) {
            var args = slice(arguments, 2), index = -1, isFunc = typeof methodName == 'function', length = collection ? collection.length : 0, result = Array(typeof length == 'number' ? length : 0);
            forEach(collection, function (value) {
                result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
            });
            return result;
        }
        function map(collection, callback, thisArg) {
            var index = -1, length = collection ? collection.length : 0;
            callback = lodash.createCallback(callback, thisArg, 3);
            if (typeof length == 'number') {
                var result = Array(length);
                while (++index < length) {
                    result[index] = callback(collection[index], index, collection);
                }
            } else {
                result = [];
                forOwn(collection, function (value, key, collection) {
                    result[++index] = callback(value, key, collection);
                });
            }
            return result;
        }
        function max(collection, callback, thisArg) {
            var computed = -Infinity, result = computed;
            if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
                callback = null;
            }
            if (callback == null && isArray(collection)) {
                var index = -1, length = collection.length;
                while (++index < length) {
                    var value = collection[index];
                    if (value > result) {
                        result = value;
                    }
                }
            } else {
                callback = callback == null && isString(collection) ? charAtCallback : lodash.createCallback(callback, thisArg, 3);
                forEach(collection, function (value, index, collection) {
                    var current = callback(value, index, collection);
                    if (current > computed) {
                        computed = current;
                        result = value;
                    }
                });
            }
            return result;
        }
        function min(collection, callback, thisArg) {
            var computed = Infinity, result = computed;
            if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
                callback = null;
            }
            if (callback == null && isArray(collection)) {
                var index = -1, length = collection.length;
                while (++index < length) {
                    var value = collection[index];
                    if (value < result) {
                        result = value;
                    }
                }
            } else {
                callback = callback == null && isString(collection) ? charAtCallback : lodash.createCallback(callback, thisArg, 3);
                forEach(collection, function (value, index, collection) {
                    var current = callback(value, index, collection);
                    if (current < computed) {
                        computed = current;
                        result = value;
                    }
                });
            }
            return result;
        }
        var pluck = map;
        function reduce(collection, callback, accumulator, thisArg) {
            if (!collection)
                return accumulator;
            var noaccum = arguments.length < 3;
            callback = lodash.createCallback(callback, thisArg, 4);
            var index = -1, length = collection.length;
            if (typeof length == 'number') {
                if (noaccum) {
                    accumulator = collection[++index];
                }
                while (++index < length) {
                    accumulator = callback(accumulator, collection[index], index, collection);
                }
            } else {
                forOwn(collection, function (value, index, collection) {
                    accumulator = noaccum ? (noaccum = false, value) : callback(accumulator, value, index, collection);
                });
            }
            return accumulator;
        }
        function reduceRight(collection, callback, accumulator, thisArg) {
            var noaccum = arguments.length < 3;
            callback = lodash.createCallback(callback, thisArg, 4);
            forEachRight(collection, function (value, index, collection) {
                accumulator = noaccum ? (noaccum = false, value) : callback(accumulator, value, index, collection);
            });
            return accumulator;
        }
        function reject(collection, callback, thisArg) {
            callback = lodash.createCallback(callback, thisArg, 3);
            return filter(collection, function (value, index, collection) {
                return !callback(value, index, collection);
            });
        }
        function sample(collection, n, guard) {
            if (collection && typeof collection.length != 'number') {
                collection = values(collection);
            }
            if (n == null || guard) {
                return collection ? collection[baseRandom(0, collection.length - 1)] : undefined;
            }
            var result = shuffle(collection);
            result.length = nativeMin(nativeMax(0, n), result.length);
            return result;
        }
        function shuffle(collection) {
            var index = -1, length = collection ? collection.length : 0, result = Array(typeof length == 'number' ? length : 0);
            forEach(collection, function (value) {
                var rand = baseRandom(0, ++index);
                result[index] = result[rand];
                result[rand] = value;
            });
            return result;
        }
        function size(collection) {
            var length = collection ? collection.length : 0;
            return typeof length == 'number' ? length : keys(collection).length;
        }
        function some(collection, callback, thisArg) {
            var result;
            callback = lodash.createCallback(callback, thisArg, 3);
            var index = -1, length = collection ? collection.length : 0;
            if (typeof length == 'number') {
                while (++index < length) {
                    if (result = callback(collection[index], index, collection)) {
                        break;
                    }
                }
            } else {
                forOwn(collection, function (value, index, collection) {
                    return !(result = callback(value, index, collection));
                });
            }
            return !!result;
        }
        function sortBy(collection, callback, thisArg) {
            var index = -1, isArr = isArray(callback), length = collection ? collection.length : 0, result = Array(typeof length == 'number' ? length : 0);
            if (!isArr) {
                callback = lodash.createCallback(callback, thisArg, 3);
            }
            forEach(collection, function (value, key, collection) {
                var object = result[++index] = getObject();
                if (isArr) {
                    object.criteria = map(callback, function (key) {
                        return value[key];
                    });
                } else {
                    (object.criteria = getArray())[0] = callback(value, key, collection);
                }
                object.index = index;
                object.value = value;
            });
            length = result.length;
            result.sort(compareAscending);
            while (length--) {
                var object = result[length];
                result[length] = object.value;
                if (!isArr) {
                    releaseArray(object.criteria);
                }
                releaseObject(object);
            }
            return result;
        }
        function toArray(collection) {
            if (collection && typeof collection.length == 'number') {
                return slice(collection);
            }
            return values(collection);
        }
        var where = filter;
        function compact(array) {
            var index = -1, length = array ? array.length : 0, result = [];
            while (++index < length) {
                var value = array[index];
                if (value) {
                    result.push(value);
                }
            }
            return result;
        }
        function difference(array) {
            return baseDifference(array, baseFlatten(arguments, true, true, 1));
        }
        function findIndex(array, callback, thisArg) {
            var index = -1, length = array ? array.length : 0;
            callback = lodash.createCallback(callback, thisArg, 3);
            while (++index < length) {
                if (callback(array[index], index, array)) {
                    return index;
                }
            }
            return -1;
        }
        function findLastIndex(array, callback, thisArg) {
            var length = array ? array.length : 0;
            callback = lodash.createCallback(callback, thisArg, 3);
            while (length--) {
                if (callback(array[length], length, array)) {
                    return length;
                }
            }
            return -1;
        }
        function first(array, callback, thisArg) {
            var n = 0, length = array ? array.length : 0;
            if (typeof callback != 'number' && callback != null) {
                var index = -1;
                callback = lodash.createCallback(callback, thisArg, 3);
                while (++index < length && callback(array[index], index, array)) {
                    n++;
                }
            } else {
                n = callback;
                if (n == null || thisArg) {
                    return array ? array[0] : undefined;
                }
            }
            return slice(array, 0, nativeMin(nativeMax(0, n), length));
        }
        function flatten(array, isShallow, callback, thisArg) {
            if (typeof isShallow != 'boolean' && isShallow != null) {
                thisArg = callback;
                callback = typeof isShallow != 'function' && thisArg && thisArg[isShallow] === array ? null : isShallow;
                isShallow = false;
            }
            if (callback != null) {
                array = map(array, callback, thisArg);
            }
            return baseFlatten(array, isShallow);
        }
        function indexOf(array, value, fromIndex) {
            if (typeof fromIndex == 'number') {
                var length = array ? array.length : 0;
                fromIndex = fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0;
            } else if (fromIndex) {
                var index = sortedIndex(array, value);
                return array[index] === value ? index : -1;
            }
            return baseIndexOf(array, value, fromIndex);
        }
        function initial(array, callback, thisArg) {
            var n = 0, length = array ? array.length : 0;
            if (typeof callback != 'number' && callback != null) {
                var index = length;
                callback = lodash.createCallback(callback, thisArg, 3);
                while (index-- && callback(array[index], index, array)) {
                    n++;
                }
            } else {
                n = callback == null || thisArg ? 1 : callback || n;
            }
            return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
        }
        function intersection() {
            var args = [], argsIndex = -1, argsLength = arguments.length, caches = getArray(), indexOf = getIndexOf(), trustIndexOf = indexOf === baseIndexOf, seen = getArray();
            while (++argsIndex < argsLength) {
                var value = arguments[argsIndex];
                if (isArray(value) || isArguments(value)) {
                    args.push(value);
                    caches.push(trustIndexOf && value.length >= largeArraySize && createCache(argsIndex ? args[argsIndex] : seen));
                }
            }
            var array = args[0], index = -1, length = array ? array.length : 0, result = [];
            outer:
                while (++index < length) {
                    var cache = caches[0];
                    value = array[index];
                    if ((cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
                        argsIndex = argsLength;
                        (cache || seen).push(value);
                        while (--argsIndex) {
                            cache = caches[argsIndex];
                            if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
                                continue outer;
                            }
                        }
                        result.push(value);
                    }
                }
            while (argsLength--) {
                cache = caches[argsLength];
                if (cache) {
                    releaseObject(cache);
                }
            }
            releaseArray(caches);
            releaseArray(seen);
            return result;
        }
        function last(array, callback, thisArg) {
            var n = 0, length = array ? array.length : 0;
            if (typeof callback != 'number' && callback != null) {
                var index = length;
                callback = lodash.createCallback(callback, thisArg, 3);
                while (index-- && callback(array[index], index, array)) {
                    n++;
                }
            } else {
                n = callback;
                if (n == null || thisArg) {
                    return array ? array[length - 1] : undefined;
                }
            }
            return slice(array, nativeMax(0, length - n));
        }
        function lastIndexOf(array, value, fromIndex) {
            var index = array ? array.length : 0;
            if (typeof fromIndex == 'number') {
                index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
            }
            while (index--) {
                if (array[index] === value) {
                    return index;
                }
            }
            return -1;
        }
        function pull(array) {
            var args = arguments, argsIndex = 0, argsLength = args.length, length = array ? array.length : 0;
            while (++argsIndex < argsLength) {
                var index = -1, value = args[argsIndex];
                while (++index < length) {
                    if (array[index] === value) {
                        splice.call(array, index--, 1);
                        length--;
                    }
                }
            }
            return array;
        }
        function range(start, end, step) {
            start = +start || 0;
            step = typeof step == 'number' ? step : +step || 1;
            if (end == null) {
                end = start;
                start = 0;
            }
            var index = -1, length = nativeMax(0, ceil((end - start) / (step || 1))), result = Array(length);
            while (++index < length) {
                result[index] = start;
                start += step;
            }
            return result;
        }
        function remove(array, callback, thisArg) {
            var index = -1, length = array ? array.length : 0, result = [];
            callback = lodash.createCallback(callback, thisArg, 3);
            while (++index < length) {
                var value = array[index];
                if (callback(value, index, array)) {
                    result.push(value);
                    splice.call(array, index--, 1);
                    length--;
                }
            }
            return result;
        }
        function rest(array, callback, thisArg) {
            if (typeof callback != 'number' && callback != null) {
                var n = 0, index = -1, length = array ? array.length : 0;
                callback = lodash.createCallback(callback, thisArg, 3);
                while (++index < length && callback(array[index], index, array)) {
                    n++;
                }
            } else {
                n = callback == null || thisArg ? 1 : nativeMax(0, callback);
            }
            return slice(array, n);
        }
        function sortedIndex(array, value, callback, thisArg) {
            var low = 0, high = array ? array.length : low;
            callback = callback ? lodash.createCallback(callback, thisArg, 1) : identity;
            value = callback(value);
            while (low < high) {
                var mid = low + high >>> 1;
                callback(array[mid]) < value ? low = mid + 1 : high = mid;
            }
            return low;
        }
        function union() {
            return baseUniq(baseFlatten(arguments, true, true));
        }
        function uniq(array, isSorted, callback, thisArg) {
            if (typeof isSorted != 'boolean' && isSorted != null) {
                thisArg = callback;
                callback = typeof isSorted != 'function' && thisArg && thisArg[isSorted] === array ? null : isSorted;
                isSorted = false;
            }
            if (callback != null) {
                callback = lodash.createCallback(callback, thisArg, 3);
            }
            return baseUniq(array, isSorted, callback);
        }
        function without(array) {
            return baseDifference(array, slice(arguments, 1));
        }
        function xor() {
            var index = -1, length = arguments.length;
            while (++index < length) {
                var array = arguments[index];
                if (isArray(array) || isArguments(array)) {
                    var result = result ? baseUniq(baseDifference(result, array).concat(baseDifference(array, result))) : array;
                }
            }
            return result || [];
        }
        function zip() {
            var array = arguments.length > 1 ? arguments : arguments[0], index = -1, length = array ? max(pluck(array, 'length')) : 0, result = Array(length < 0 ? 0 : length);
            while (++index < length) {
                result[index] = pluck(array, index);
            }
            return result;
        }
        function zipObject(keys, values) {
            var index = -1, length = keys ? keys.length : 0, result = {};
            if (!values && length && !isArray(keys[0])) {
                values = [];
            }
            while (++index < length) {
                var key = keys[index];
                if (values) {
                    result[key] = values[index];
                } else if (key) {
                    result[key[0]] = key[1];
                }
            }
            return result;
        }
        function after(n, func) {
            if (!isFunction(func)) {
                throw new TypeError();
            }
            return function () {
                if (--n < 1) {
                    return func.apply(this, arguments);
                }
            };
        }
        function bind(func, thisArg) {
            return arguments.length > 2 ? createWrapper(func, 17, slice(arguments, 2), null, thisArg) : createWrapper(func, 1, null, null, thisArg);
        }
        function bindAll(object) {
            var funcs = arguments.length > 1 ? baseFlatten(arguments, true, false, 1) : functions(object), index = -1, length = funcs.length;
            while (++index < length) {
                var key = funcs[index];
                object[key] = createWrapper(object[key], 1, null, null, object);
            }
            return object;
        }
        function bindKey(object, key) {
            return arguments.length > 2 ? createWrapper(key, 19, slice(arguments, 2), null, object) : createWrapper(key, 3, null, null, object);
        }
        function compose() {
            var funcs = arguments, length = funcs.length;
            while (length--) {
                if (!isFunction(funcs[length])) {
                    throw new TypeError();
                }
            }
            return function () {
                var args = arguments, length = funcs.length;
                while (length--) {
                    args = [funcs[length].apply(this, args)];
                }
                return args[0];
            };
        }
        function curry(func, arity) {
            arity = typeof arity == 'number' ? arity : +arity || func.length;
            return createWrapper(func, 4, null, null, null, arity);
        }
        function debounce(func, wait, options) {
            var args, maxTimeoutId, result, stamp, thisArg, timeoutId, trailingCall, lastCalled = 0, maxWait = false, trailing = true;
            if (!isFunction(func)) {
                throw new TypeError();
            }
            wait = nativeMax(0, wait) || 0;
            if (options === true) {
                var leading = true;
                trailing = false;
            } else if (isObject(options)) {
                leading = options.leading;
                maxWait = 'maxWait' in options && (nativeMax(wait, options.maxWait) || 0);
                trailing = 'trailing' in options ? options.trailing : trailing;
            }
            var delayed = function () {
                var remaining = wait - (now() - stamp);
                if (remaining <= 0) {
                    if (maxTimeoutId) {
                        clearTimeout(maxTimeoutId);
                    }
                    var isCalled = trailingCall;
                    maxTimeoutId = timeoutId = trailingCall = undefined;
                    if (isCalled) {
                        lastCalled = now();
                        result = func.apply(thisArg, args);
                        if (!timeoutId && !maxTimeoutId) {
                            args = thisArg = null;
                        }
                    }
                } else {
                    timeoutId = setTimeout(delayed, remaining);
                }
            };
            var maxDelayed = function () {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                maxTimeoutId = timeoutId = trailingCall = undefined;
                if (trailing || maxWait !== wait) {
                    lastCalled = now();
                    result = func.apply(thisArg, args);
                    if (!timeoutId && !maxTimeoutId) {
                        args = thisArg = null;
                    }
                }
            };
            return function () {
                args = arguments;
                stamp = now();
                thisArg = this;
                trailingCall = trailing && (timeoutId || !leading);
                if (maxWait === false) {
                    var leadingCall = leading && !timeoutId;
                } else {
                    if (!maxTimeoutId && !leading) {
                        lastCalled = stamp;
                    }
                    var remaining = maxWait - (stamp - lastCalled), isCalled = remaining <= 0;
                    if (isCalled) {
                        if (maxTimeoutId) {
                            maxTimeoutId = clearTimeout(maxTimeoutId);
                        }
                        lastCalled = stamp;
                        result = func.apply(thisArg, args);
                    } else if (!maxTimeoutId) {
                        maxTimeoutId = setTimeout(maxDelayed, remaining);
                    }
                }
                if (isCalled && timeoutId) {
                    timeoutId = clearTimeout(timeoutId);
                } else if (!timeoutId && wait !== maxWait) {
                    timeoutId = setTimeout(delayed, wait);
                }
                if (leadingCall) {
                    isCalled = true;
                    result = func.apply(thisArg, args);
                }
                if (isCalled && !timeoutId && !maxTimeoutId) {
                    args = thisArg = null;
                }
                return result;
            };
        }
        function defer(func) {
            if (!isFunction(func)) {
                throw new TypeError();
            }
            var args = slice(arguments, 1);
            return setTimeout(function () {
                func.apply(undefined, args);
            }, 1);
        }
        function delay(func, wait) {
            if (!isFunction(func)) {
                throw new TypeError();
            }
            var args = slice(arguments, 2);
            return setTimeout(function () {
                func.apply(undefined, args);
            }, wait);
        }
        function memoize(func, resolver) {
            if (!isFunction(func)) {
                throw new TypeError();
            }
            var memoized = function () {
                var cache = memoized.cache, key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];
                return hasOwnProperty.call(cache, key) ? cache[key] : cache[key] = func.apply(this, arguments);
            };
            memoized.cache = {};
            return memoized;
        }
        function once(func) {
            var ran, result;
            if (!isFunction(func)) {
                throw new TypeError();
            }
            return function () {
                if (ran) {
                    return result;
                }
                ran = true;
                result = func.apply(this, arguments);
                func = null;
                return result;
            };
        }
        function partial(func) {
            return createWrapper(func, 16, slice(arguments, 1));
        }
        function partialRight(func) {
            return createWrapper(func, 32, null, slice(arguments, 1));
        }
        function throttle(func, wait, options) {
            var leading = true, trailing = true;
            if (!isFunction(func)) {
                throw new TypeError();
            }
            if (options === false) {
                leading = false;
            } else if (isObject(options)) {
                leading = 'leading' in options ? options.leading : leading;
                trailing = 'trailing' in options ? options.trailing : trailing;
            }
            debounceOptions.leading = leading;
            debounceOptions.maxWait = wait;
            debounceOptions.trailing = trailing;
            return debounce(func, wait, debounceOptions);
        }
        function wrap(value, wrapper) {
            return createWrapper(wrapper, 16, [value]);
        }
        function constant(value) {
            return function () {
                return value;
            };
        }
        function createCallback(func, thisArg, argCount) {
            var type = typeof func;
            if (func == null || type == 'function') {
                return baseCreateCallback(func, thisArg, argCount);
            }
            if (type != 'object') {
                return property(func);
            }
            var props = keys(func), key = props[0], a = func[key];
            if (props.length == 1 && a === a && !isObject(a)) {
                return function (object) {
                    var b = object[key];
                    return a === b && (a !== 0 || 1 / a == 1 / b);
                };
            }
            return function (object) {
                var length = props.length, result = false;
                while (length--) {
                    if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
                        break;
                    }
                }
                return result;
            };
        }
        function escape(string) {
            return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
        }
        function identity(value) {
            return value;
        }
        function mixin(object, source, options) {
            var chain = true, methodNames = source && functions(source);
            if (!source || !options && !methodNames.length) {
                if (options == null) {
                    options = source;
                }
                ctor = lodashWrapper;
                source = object;
                object = lodash;
                methodNames = functions(source);
            }
            if (options === false) {
                chain = false;
            } else if (isObject(options) && 'chain' in options) {
                chain = options.chain;
            }
            var ctor = object, isFunc = isFunction(ctor);
            forEach(methodNames, function (methodName) {
                var func = object[methodName] = source[methodName];
                if (isFunc) {
                    ctor.prototype[methodName] = function () {
                        var chainAll = this.__chain__, value = this.__wrapped__, args = [value];
                        push.apply(args, arguments);
                        var result = func.apply(object, args);
                        if (chain || chainAll) {
                            if (value === result && isObject(result)) {
                                return this;
                            }
                            result = new ctor(result);
                            result.__chain__ = chainAll;
                        }
                        return result;
                    };
                }
            });
        }
        function noConflict() {
            context._ = oldDash;
            return this;
        }
        function noop() {
        }
        var now = isNative(now = Date.now) && now || function () {
                return new Date().getTime();
            };
        var parseInt = nativeParseInt(whitespace + '08') == 8 ? nativeParseInt : function (value, radix) {
                return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, '') : value, radix || 0);
            };
        function property(key) {
            return function (object) {
                return object[key];
            };
        }
        function random(min, max, floating) {
            var noMin = min == null, noMax = max == null;
            if (floating == null) {
                if (typeof min == 'boolean' && noMax) {
                    floating = min;
                    min = 1;
                } else if (!noMax && typeof max == 'boolean') {
                    floating = max;
                    noMax = true;
                }
            }
            if (noMin && noMax) {
                max = 1;
            }
            min = +min || 0;
            if (noMax) {
                max = min;
                min = 0;
            } else {
                max = +max || 0;
            }
            if (floating || min % 1 || max % 1) {
                var rand = nativeRandom();
                return nativeMin(min + rand * (max - min + parseFloat('1e-' + ((rand + '').length - 1))), max);
            }
            return baseRandom(min, max);
        }
        function result(object, key) {
            if (object) {
                var value = object[key];
                return isFunction(value) ? object[key]() : value;
            }
        }
        function template(text, data, options) {
            var settings = lodash.templateSettings;
            text = String(text || '');
            options = defaults({}, options, settings);
            var imports = defaults({}, options.imports, settings.imports), importsKeys = keys(imports), importsValues = values(imports);
            var isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = '__p += \'';
            var reDelimiters = RegExp((options.escape || reNoMatch).source + '|' + interpolate.source + '|' + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' + (options.evaluate || reNoMatch).source + '|$', 'g');
            text.replace(reDelimiters, function (match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
                interpolateValue || (interpolateValue = esTemplateValue);
                source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);
                if (escapeValue) {
                    source += '\' +\n__e(' + escapeValue + ') +\n\'';
                }
                if (evaluateValue) {
                    isEvaluating = true;
                    source += '\';\n' + evaluateValue + ';\n__p += \'';
                }
                if (interpolateValue) {
                    source += '\' +\n((__t = (' + interpolateValue + ')) == null ? \'\' : __t) +\n\'';
                }
                index = offset + match.length;
                return match;
            });
            source += '\';\n';
            var variable = options.variable, hasVariable = variable;
            if (!hasVariable) {
                variable = 'obj';
                source = 'with (' + variable + ') {\n' + source + '\n}\n';
            }
            source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source).replace(reEmptyStringMiddle, '$1').replace(reEmptyStringTrailing, '$1;');
            source = 'function(' + variable + ') {\n' + (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') + 'var __t, __p = \'\', __e = _.escape' + (isEvaluating ? ', __j = Array.prototype.join;\n' + 'function print() { __p += __j.call(arguments, \'\') }\n' : ';\n') + source + 'return __p\n}';
            var sourceURL = '\n/*\n//# sourceURL=' + (options.sourceURL || '/lodash/template/source[' + templateCounter++ + ']') + '\n*/';
            try {
                var result = Function(importsKeys, 'return ' + source + sourceURL).apply(undefined, importsValues);
            } catch (e) {
                e.source = source;
                throw e;
            }
            if (data) {
                return result(data);
            }
            result.source = source;
            return result;
        }
        function times(n, callback, thisArg) {
            n = (n = +n) > -1 ? n : 0;
            var index = -1, result = Array(n);
            callback = baseCreateCallback(callback, thisArg, 1);
            while (++index < n) {
                result[index] = callback(index);
            }
            return result;
        }
        function unescape(string) {
            return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
        }
        function uniqueId(prefix) {
            var id = ++idCounter;
            return String(prefix == null ? '' : prefix) + id;
        }
        function chain(value) {
            value = new lodashWrapper(value);
            value.__chain__ = true;
            return value;
        }
        function tap(value, interceptor) {
            interceptor(value);
            return value;
        }
        function wrapperChain() {
            this.__chain__ = true;
            return this;
        }
        function wrapperToString() {
            return String(this.__wrapped__);
        }
        function wrapperValueOf() {
            return this.__wrapped__;
        }
        lodash.after = after;
        lodash.assign = assign;
        lodash.at = at;
        lodash.bind = bind;
        lodash.bindAll = bindAll;
        lodash.bindKey = bindKey;
        lodash.chain = chain;
        lodash.compact = compact;
        lodash.compose = compose;
        lodash.constant = constant;
        lodash.countBy = countBy;
        lodash.create = create;
        lodash.createCallback = createCallback;
        lodash.curry = curry;
        lodash.debounce = debounce;
        lodash.defaults = defaults;
        lodash.defer = defer;
        lodash.delay = delay;
        lodash.difference = difference;
        lodash.filter = filter;
        lodash.flatten = flatten;
        lodash.forEach = forEach;
        lodash.forEachRight = forEachRight;
        lodash.forIn = forIn;
        lodash.forInRight = forInRight;
        lodash.forOwn = forOwn;
        lodash.forOwnRight = forOwnRight;
        lodash.functions = functions;
        lodash.groupBy = groupBy;
        lodash.indexBy = indexBy;
        lodash.initial = initial;
        lodash.intersection = intersection;
        lodash.invert = invert;
        lodash.invoke = invoke;
        lodash.keys = keys;
        lodash.map = map;
        lodash.mapValues = mapValues;
        lodash.max = max;
        lodash.memoize = memoize;
        lodash.merge = merge;
        lodash.min = min;
        lodash.omit = omit;
        lodash.once = once;
        lodash.pairs = pairs;
        lodash.partial = partial;
        lodash.partialRight = partialRight;
        lodash.pick = pick;
        lodash.pluck = pluck;
        lodash.property = property;
        lodash.pull = pull;
        lodash.range = range;
        lodash.reject = reject;
        lodash.remove = remove;
        lodash.rest = rest;
        lodash.shuffle = shuffle;
        lodash.sortBy = sortBy;
        lodash.tap = tap;
        lodash.throttle = throttle;
        lodash.times = times;
        lodash.toArray = toArray;
        lodash.transform = transform;
        lodash.union = union;
        lodash.uniq = uniq;
        lodash.values = values;
        lodash.where = where;
        lodash.without = without;
        lodash.wrap = wrap;
        lodash.xor = xor;
        lodash.zip = zip;
        lodash.zipObject = zipObject;
        lodash.collect = map;
        lodash.drop = rest;
        lodash.each = forEach;
        lodash.eachRight = forEachRight;
        lodash.extend = assign;
        lodash.methods = functions;
        lodash.object = zipObject;
        lodash.select = filter;
        lodash.tail = rest;
        lodash.unique = uniq;
        lodash.unzip = zip;
        mixin(lodash);
        lodash.clone = clone;
        lodash.cloneDeep = cloneDeep;
        lodash.contains = contains;
        lodash.escape = escape;
        lodash.every = every;
        lodash.find = find;
        lodash.findIndex = findIndex;
        lodash.findKey = findKey;
        lodash.findLast = findLast;
        lodash.findLastIndex = findLastIndex;
        lodash.findLastKey = findLastKey;
        lodash.has = has;
        lodash.identity = identity;
        lodash.indexOf = indexOf;
        lodash.isArguments = isArguments;
        lodash.isArray = isArray;
        lodash.isBoolean = isBoolean;
        lodash.isDate = isDate;
        lodash.isElement = isElement;
        lodash.isEmpty = isEmpty;
        lodash.isEqual = isEqual;
        lodash.isFinite = isFinite;
        lodash.isFunction = isFunction;
        lodash.isNaN = isNaN;
        lodash.isNull = isNull;
        lodash.isNumber = isNumber;
        lodash.isObject = isObject;
        lodash.isPlainObject = isPlainObject;
        lodash.isRegExp = isRegExp;
        lodash.isString = isString;
        lodash.isUndefined = isUndefined;
        lodash.lastIndexOf = lastIndexOf;
        lodash.mixin = mixin;
        lodash.noConflict = noConflict;
        lodash.noop = noop;
        lodash.now = now;
        lodash.parseInt = parseInt;
        lodash.random = random;
        lodash.reduce = reduce;
        lodash.reduceRight = reduceRight;
        lodash.result = result;
        lodash.runInContext = runInContext;
        lodash.size = size;
        lodash.some = some;
        lodash.sortedIndex = sortedIndex;
        lodash.template = template;
        lodash.unescape = unescape;
        lodash.uniqueId = uniqueId;
        lodash.all = every;
        lodash.any = some;
        lodash.detect = find;
        lodash.findWhere = find;
        lodash.foldl = reduce;
        lodash.foldr = reduceRight;
        lodash.include = contains;
        lodash.inject = reduce;
        mixin(function () {
            var source = {};
            forOwn(lodash, function (func, methodName) {
                if (!lodash.prototype[methodName]) {
                    source[methodName] = func;
                }
            });
            return source;
        }(), false);
        lodash.first = first;
        lodash.last = last;
        lodash.sample = sample;
        lodash.take = first;
        lodash.head = first;
        forOwn(lodash, function (func, methodName) {
            var callbackable = methodName !== 'sample';
            if (!lodash.prototype[methodName]) {
                lodash.prototype[methodName] = function (n, guard) {
                    var chainAll = this.__chain__, result = func(this.__wrapped__, n, guard);
                    return !chainAll && (n == null || guard && !(callbackable && typeof n == 'function')) ? result : new lodashWrapper(result, chainAll);
                };
            }
        });
        lodash.VERSION = '2.4.1';
        lodash.prototype.chain = wrapperChain;
        lodash.prototype.toString = wrapperToString;
        lodash.prototype.value = wrapperValueOf;
        lodash.prototype.valueOf = wrapperValueOf;
        forEach([
            'join',
            'pop',
            'shift'
        ], function (methodName) {
            var func = arrayRef[methodName];
            lodash.prototype[methodName] = function () {
                var chainAll = this.__chain__, result = func.apply(this.__wrapped__, arguments);
                return chainAll ? new lodashWrapper(result, chainAll) : result;
            };
        });
        forEach([
            'push',
            'reverse',
            'sort',
            'unshift'
        ], function (methodName) {
            var func = arrayRef[methodName];
            lodash.prototype[methodName] = function () {
                func.apply(this.__wrapped__, arguments);
                return this;
            };
        });
        forEach([
            'concat',
            'slice',
            'splice'
        ], function (methodName) {
            var func = arrayRef[methodName];
            lodash.prototype[methodName] = function () {
                return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__);
            };
        });
        return lodash;
    }
    var _ = runInContext();
    if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
        root._ = _;
        define(function () {
            return _;
        });
    } else if (freeExports && freeModule) {
        if (moduleExports) {
            (freeModule.exports = _)._ = _;
        } else {
            freeExports._ = _;
        }
    } else {
        root._ = _;
    }
}.call(this));
});
require.define('22', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Bacon, BufferingSource, Bus, CompositeUnsubscribe, Desc, Dispatcher, End, Error, Event, EventStream, Initial, Next, None, Observable, Property, PropertyDispatcher, Some, Source, UpdateBarrier, addPropertyInitValueToStream, assert, assertArray, assertEventStream, assertFunction, assertNoArguments, assertString, cloneArray, compositeUnsubscribe, containsDuplicateDeps, convertArgsToFunction, describe, end, eventIdCounter, former, idCounter, initial, isArray, isFieldKey, isFunction, isObservable, latterF, liftCallback, makeFunction, makeFunctionArgs, makeFunction_, makeSpawner, next, nop, partiallyApplied, recursionDepth, registerObs, spys, toCombinator, toEvent, toFieldExtractor, toFieldKey, toOption, toSimpleExtractor, withDescription, withMethodCallSupport, _, _ref, _ref1, _ref2, __slice = [].slice, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        }, __bind = function (fn, me) {
            return function () {
                return fn.apply(me, arguments);
            };
        };
    Bacon = {
        toString: function () {
            return 'Bacon';
        }
    };
    Bacon.version = '0.7.0';
    Bacon.fromBinder = function (binder, eventTransformer) {
        if (eventTransformer == null) {
            eventTransformer = _.id;
        }
        return new EventStream(describe(Bacon, 'fromBinder', binder, eventTransformer), function (sink) {
            var unbinder;
            return unbinder = binder(function () {
                var args, event, reply, value, _i, _len;
                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                value = eventTransformer.apply(null, args);
                if (!(isArray(value) && _.last(value) instanceof Event)) {
                    value = [value];
                }
                reply = Bacon.more;
                for (_i = 0, _len = value.length; _i < _len; _i++) {
                    event = value[_i];
                    reply = sink(event = toEvent(event));
                    if (reply === Bacon.noMore || event.isEnd()) {
                        if (unbinder != null) {
                            unbinder();
                        } else {
                            Bacon.scheduler.setTimeout(function () {
                                return unbinder();
                            }, 0);
                        }
                        return reply;
                    }
                }
                return reply;
            });
        });
    };
    Bacon.$ = {
        asEventStream: function (eventName, selector, eventTransformer) {
            var _ref, _this = this;
            if (isFunction(selector)) {
                _ref = [
                    selector,
                    null
                ], eventTransformer = _ref[0], selector = _ref[1];
            }
            return withDescription(this, 'asEventStream', eventName, Bacon.fromBinder(function (handler) {
                _this.on(eventName, selector, handler);
                return function () {
                    return _this.off(eventName, selector, handler);
                };
            }, eventTransformer));
        }
    };
    if ((_ref = typeof jQuery !== 'undefined' && jQuery !== null ? jQuery : typeof Zepto !== 'undefined' && Zepto !== null ? Zepto : null) != null) {
        _ref.fn.asEventStream = Bacon.$.asEventStream;
    }
    Bacon.fromEventTarget = function (target, eventName, eventTransformer) {
        var sub, unsub, _ref1, _ref2, _ref3, _ref4;
        sub = (_ref1 = target.addEventListener) != null ? _ref1 : (_ref2 = target.addListener) != null ? _ref2 : target.bind;
        unsub = (_ref3 = target.removeEventListener) != null ? _ref3 : (_ref4 = target.removeListener) != null ? _ref4 : target.unbind;
        return withDescription(Bacon, 'fromEventTarget', target, eventName, Bacon.fromBinder(function (handler) {
            sub.call(target, eventName, handler);
            return function () {
                return unsub.call(target, eventName, handler);
            };
        }, eventTransformer));
    };
    Bacon.fromPromise = function (promise, abort) {
        return withDescription(Bacon, 'fromPromise', promise, Bacon.fromBinder(function (handler) {
            promise.then(handler, function (e) {
                return handler(new Error(e));
            });
            return function () {
                if (abort) {
                    return typeof promise.abort === 'function' ? promise.abort() : void 0;
                }
            };
        }, function (value) {
            return [
                value,
                end()
            ];
        }));
    };
    Bacon.noMore = ['<no-more>'];
    Bacon.more = ['<more>'];
    Bacon.later = function (delay, value) {
        return withDescription(Bacon, 'later', delay, value, Bacon.sequentially(delay, [value]));
    };
    Bacon.sequentially = function (delay, values) {
        var index;
        index = 0;
        return withDescription(Bacon, 'sequentially', delay, values, Bacon.fromPoll(delay, function () {
            var value;
            value = values[index++];
            if (index < values.length) {
                return value;
            } else if (index === values.length) {
                return [
                    value,
                    end()
                ];
            } else {
                return end();
            }
        }));
    };
    Bacon.repeatedly = function (delay, values) {
        var index;
        index = 0;
        return withDescription(Bacon, 'repeatedly', delay, values, Bacon.fromPoll(delay, function () {
            return values[index++ % values.length];
        }));
    };
    Bacon.spy = function (spy) {
        return spys.push(spy);
    };
    spys = [];
    registerObs = function (obs) {
        if (spys.length) {
            if (!registerObs.running) {
                try {
                    registerObs.running = true;
                    return _.each(spys, function (_, spy) {
                        return spy(obs);
                    });
                } finally {
                    delete registerObs.running;
                }
            }
        }
    };
    withMethodCallSupport = function (wrapped) {
        return function () {
            var args, context, f, methodName;
            f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            if (typeof f === 'object' && args.length) {
                context = f;
                methodName = args[0];
                f = function () {
                    return context[methodName].apply(context, arguments);
                };
                args = args.slice(1);
            }
            return wrapped.apply(null, [f].concat(__slice.call(args)));
        };
    };
    liftCallback = function (desc, wrapped) {
        return withMethodCallSupport(function () {
            var args, f, stream;
            f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            stream = partiallyApplied(wrapped, [function (values, callback) {
                    return f.apply(null, __slice.call(values).concat([callback]));
                }]);
            return withDescription.apply(null, [
                Bacon,
                desc,
                f
            ].concat(__slice.call(args), [Bacon.combineAsArray(args).flatMap(stream)]));
        });
    };
    Bacon.fromCallback = liftCallback('fromCallback', function () {
        var args, f;
        f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return Bacon.fromBinder(function (handler) {
            makeFunction(f, args)(handler);
            return nop;
        }, function (value) {
            return [
                value,
                end()
            ];
        });
    });
    Bacon.fromNodeCallback = liftCallback('fromNodeCallback', function () {
        var args, f;
        f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return Bacon.fromBinder(function (handler) {
            makeFunction(f, args)(handler);
            return nop;
        }, function (error, value) {
            if (error) {
                return [
                    new Error(error),
                    end()
                ];
            }
            return [
                value,
                end()
            ];
        });
    });
    Bacon.fromPoll = function (delay, poll) {
        return withDescription(Bacon, 'fromPoll', delay, poll, Bacon.fromBinder(function (handler) {
            var id;
            id = Bacon.scheduler.setInterval(handler, delay);
            return function () {
                return Bacon.scheduler.clearInterval(id);
            };
        }, poll));
    };
    Bacon.interval = function (delay, value) {
        if (value == null) {
            value = {};
        }
        return withDescription(Bacon, 'interval', delay, value, Bacon.fromPoll(delay, function () {
            return next(value);
        }));
    };
    Bacon.constant = function (value) {
        return new Property(describe(Bacon, 'constant', value), function (sink) {
            sink(initial(value));
            sink(end());
            return nop;
        });
    };
    Bacon.never = function () {
        return withDescription(Bacon, 'never', Bacon.fromArray([]));
    };
    Bacon.once = function (value) {
        return withDescription(Bacon, 'once', value, Bacon.fromArray([value]));
    };
    Bacon.fromArray = function (values) {
        assertArray(values);
        values = cloneArray(values);
        return new EventStream(describe(Bacon, 'fromArray', values), function (sink) {
            var send, unsubd;
            unsubd = false;
            send = function () {
                var reply, value;
                if (_.empty(values)) {
                    return sink(end());
                } else {
                    value = values.splice(0, 1)[0];
                    reply = sink(toEvent(value));
                    if (reply !== Bacon.noMore && !unsubd) {
                        return send();
                    }
                }
            };
            send();
            return function () {
                return unsubd = true;
            };
        });
    };
    Bacon.mergeAll = function () {
        var streams;
        streams = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (isArray(streams[0])) {
            streams = streams[0];
        }
        return withDescription.apply(null, [
            Bacon,
            'mergeAll'
        ].concat(__slice.call(streams), [_.fold(streams, Bacon.never(), function (a, b) {
                return a.merge(b);
            })]));
    };
    Bacon.zipAsArray = function () {
        var streams;
        streams = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (isArray(streams[0])) {
            streams = streams[0];
        }
        return withDescription.apply(null, [
            Bacon,
            'zipAsArray'
        ].concat(__slice.call(streams), [Bacon.zipWith(streams, function () {
                var xs;
                xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                return xs;
            })]));
    };
    Bacon.zipWith = function () {
        var f, streams, _ref1;
        f = arguments[0], streams = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (!isFunction(f)) {
            _ref1 = [
                f,
                streams[0]
            ], streams = _ref1[0], f = _ref1[1];
        }
        streams = _.map(function (s) {
            return s.toEventStream();
        }, streams);
        return withDescription.apply(null, [
            Bacon,
            'zipWith',
            f
        ].concat(__slice.call(streams), [Bacon.when(streams, f)]));
    };
    Bacon.groupSimultaneous = function () {
        var s, sources, streams;
        streams = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (streams.length === 1 && isArray(streams[0])) {
            streams = streams[0];
        }
        sources = function () {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = streams.length; _i < _len; _i++) {
                s = streams[_i];
                _results.push(new BufferingSource(s));
            }
            return _results;
        }();
        return withDescription.apply(null, [
            Bacon,
            'groupSimultaneous'
        ].concat(__slice.call(streams), [Bacon.when(sources, function () {
                var xs;
                xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                return xs;
            })]));
    };
    Bacon.combineAsArray = function () {
        var index, s, sources, stream, streams, _i, _len;
        streams = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (streams.length === 1 && isArray(streams[0])) {
            streams = streams[0];
        }
        for (index = _i = 0, _len = streams.length; _i < _len; index = ++_i) {
            stream = streams[index];
            if (!isObservable(stream)) {
                streams[index] = Bacon.constant(stream);
            }
        }
        if (streams.length) {
            sources = function () {
                var _j, _len1, _results;
                _results = [];
                for (_j = 0, _len1 = streams.length; _j < _len1; _j++) {
                    s = streams[_j];
                    _results.push(new Source(s, true, false, s.subscribeInternal));
                }
                return _results;
            }();
            return withDescription.apply(null, [
                Bacon,
                'combineAsArray'
            ].concat(__slice.call(streams), [Bacon.when(sources, function () {
                    var xs;
                    xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                    return xs;
                }).toProperty()]));
        } else {
            return Bacon.constant([]);
        }
    };
    Bacon.onValues = function () {
        var f, streams, _i;
        streams = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), f = arguments[_i++];
        return Bacon.combineAsArray(streams).onValues(f);
    };
    Bacon.combineWith = function () {
        var f, streams;
        f = arguments[0], streams = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return withDescription.apply(null, [
            Bacon,
            'combineWith',
            f
        ].concat(__slice.call(streams), [Bacon.combineAsArray(streams).map(function (values) {
                return f.apply(null, values);
            })]));
    };
    Bacon.combineTemplate = function (template) {
        var applyStreamValue, combinator, compile, compileTemplate, constantValue, current, funcs, mkContext, setValue, streams;
        funcs = [];
        streams = [];
        current = function (ctxStack) {
            return ctxStack[ctxStack.length - 1];
        };
        setValue = function (ctxStack, key, value) {
            return current(ctxStack)[key] = value;
        };
        applyStreamValue = function (key, index) {
            return function (ctxStack, values) {
                return setValue(ctxStack, key, values[index]);
            };
        };
        constantValue = function (key, value) {
            return function (ctxStack) {
                return setValue(ctxStack, key, value);
            };
        };
        mkContext = function (template) {
            if (isArray(template)) {
                return [];
            } else {
                return {};
            }
        };
        compile = function (key, value) {
            var popContext, pushContext;
            if (isObservable(value)) {
                streams.push(value);
                return funcs.push(applyStreamValue(key, streams.length - 1));
            } else if (value === Object(value) && typeof value !== 'function') {
                pushContext = function (key) {
                    return function (ctxStack) {
                        var newContext;
                        newContext = mkContext(value);
                        setValue(ctxStack, key, newContext);
                        return ctxStack.push(newContext);
                    };
                };
                popContext = function (ctxStack) {
                    return ctxStack.pop();
                };
                funcs.push(pushContext(key));
                compileTemplate(value);
                return funcs.push(popContext);
            } else {
                return funcs.push(constantValue(key, value));
            }
        };
        compileTemplate = function (template) {
            return _.each(template, compile);
        };
        compileTemplate(template);
        combinator = function (values) {
            var ctxStack, f, rootContext, _i, _len;
            rootContext = mkContext(template);
            ctxStack = [rootContext];
            for (_i = 0, _len = funcs.length; _i < _len; _i++) {
                f = funcs[_i];
                f(ctxStack, values);
            }
            return rootContext;
        };
        return withDescription(Bacon, 'combineTemplate', template, Bacon.combineAsArray(streams).map(combinator));
    };
    eventIdCounter = 0;
    Event = function () {
        function Event() {
            this.id = ++eventIdCounter;
        }
        Event.prototype.isEvent = function () {
            return true;
        };
        Event.prototype.isEnd = function () {
            return false;
        };
        Event.prototype.isInitial = function () {
            return false;
        };
        Event.prototype.isNext = function () {
            return false;
        };
        Event.prototype.isError = function () {
            return false;
        };
        Event.prototype.hasValue = function () {
            return false;
        };
        Event.prototype.filter = function () {
            return true;
        };
        Event.prototype.inspect = function () {
            return this.toString();
        };
        return Event;
    }();
    Next = function (_super) {
        __extends(Next, _super);
        function Next(valueF) {
            Next.__super__.constructor.call(this);
            if (isFunction(valueF)) {
                this.value = _.cached(valueF);
            } else {
                this.value = _.always(valueF);
            }
        }
        Next.prototype.isNext = function () {
            return true;
        };
        Next.prototype.hasValue = function () {
            return true;
        };
        Next.prototype.fmap = function (f) {
            var _this = this;
            return this.apply(function () {
                return f(_this.value());
            });
        };
        Next.prototype.apply = function (value) {
            return new Next(value);
        };
        Next.prototype.filter = function (f) {
            return f(this.value());
        };
        Next.prototype.toString = function () {
            return _.toString(this.value());
        };
        return Next;
    }(Event);
    Initial = function (_super) {
        __extends(Initial, _super);
        function Initial() {
            _ref1 = Initial.__super__.constructor.apply(this, arguments);
            return _ref1;
        }
        Initial.prototype.isInitial = function () {
            return true;
        };
        Initial.prototype.isNext = function () {
            return false;
        };
        Initial.prototype.apply = function (value) {
            return new Initial(value);
        };
        Initial.prototype.toNext = function () {
            return new Next(this.value);
        };
        return Initial;
    }(Next);
    End = function (_super) {
        __extends(End, _super);
        function End() {
            _ref2 = End.__super__.constructor.apply(this, arguments);
            return _ref2;
        }
        End.prototype.isEnd = function () {
            return true;
        };
        End.prototype.fmap = function () {
            return this;
        };
        End.prototype.apply = function () {
            return this;
        };
        End.prototype.toString = function () {
            return '<end>';
        };
        return End;
    }(Event);
    Error = function (_super) {
        __extends(Error, _super);
        function Error(error) {
            this.error = error;
        }
        Error.prototype.isError = function () {
            return true;
        };
        Error.prototype.fmap = function () {
            return this;
        };
        Error.prototype.apply = function () {
            return this;
        };
        Error.prototype.toString = function () {
            return '<error> ' + _.toString(this.error);
        };
        return Error;
    }(Event);
    idCounter = 0;
    Observable = function () {
        function Observable(desc) {
            this.combine = __bind(this.combine, this);
            this.flatMapLatest = __bind(this.flatMapLatest, this);
            this.fold = __bind(this.fold, this);
            this.scan = __bind(this.scan, this);
            this.id = ++idCounter;
            this.assign = this.onValue;
            withDescription(desc, this);
        }
        Observable.prototype.onValue = function () {
            var f;
            f = makeFunctionArgs(arguments);
            return this.subscribe(function (event) {
                if (event.hasValue()) {
                    return f(event.value());
                }
            });
        };
        Observable.prototype.onValues = function (f) {
            return this.onValue(function (args) {
                return f.apply(null, args);
            });
        };
        Observable.prototype.onError = function () {
            var f;
            f = makeFunctionArgs(arguments);
            return this.subscribe(function (event) {
                if (event.isError()) {
                    return f(event.error);
                }
            });
        };
        Observable.prototype.onEnd = function () {
            var f;
            f = makeFunctionArgs(arguments);
            return this.subscribe(function (event) {
                if (event.isEnd()) {
                    return f();
                }
            });
        };
        Observable.prototype.errors = function () {
            return withDescription(this, 'errors', this.filter(function () {
                return false;
            }));
        };
        Observable.prototype.filter = function () {
            var args, f;
            f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            return convertArgsToFunction(this, f, args, function (f) {
                return withDescription(this, 'filter', f, this.withHandler(function (event) {
                    if (event.filter(f)) {
                        return this.push(event);
                    } else {
                        return Bacon.more;
                    }
                }));
            });
        };
        Observable.prototype.takeWhile = function () {
            var args, f;
            f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            return convertArgsToFunction(this, f, args, function (f) {
                return withDescription(this, 'takeWhile', f, this.withHandler(function (event) {
                    if (event.filter(f)) {
                        return this.push(event);
                    } else {
                        this.push(end());
                        return Bacon.noMore;
                    }
                }));
            });
        };
        Observable.prototype.endOnError = function () {
            var args, f;
            f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            if (f == null) {
                f = true;
            }
            return convertArgsToFunction(this, f, args, function (f) {
                return withDescription(this, 'endOnError', this.withHandler(function (event) {
                    if (event.isError() && f(event.error)) {
                        this.push(event);
                        return this.push(end());
                    } else {
                        return this.push(event);
                    }
                }));
            });
        };
        Observable.prototype.take = function (count) {
            if (count <= 0) {
                return Bacon.never();
            }
            return withDescription(this, 'take', count, this.withHandler(function (event) {
                if (!event.hasValue()) {
                    return this.push(event);
                } else {
                    count--;
                    if (count > 0) {
                        return this.push(event);
                    } else {
                        if (count === 0) {
                            this.push(event);
                        }
                        this.push(end());
                        return Bacon.noMore;
                    }
                }
            }));
        };
        Observable.prototype.map = function () {
            var args, p;
            p = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            if (p instanceof Property) {
                return p.sampledBy(this, former);
            } else {
                return convertArgsToFunction(this, p, args, function (f) {
                    return withDescription(this, 'map', f, this.withHandler(function (event) {
                        return this.push(event.fmap(f));
                    }));
                });
            }
        };
        Observable.prototype.mapError = function () {
            var f;
            f = makeFunctionArgs(arguments);
            return withDescription(this, 'mapError', f, this.withHandler(function (event) {
                if (event.isError()) {
                    return this.push(next(f(event.error)));
                } else {
                    return this.push(event);
                }
            }));
        };
        Observable.prototype.mapEnd = function () {
            var f;
            f = makeFunctionArgs(arguments);
            return withDescription(this, 'mapEnd', f, this.withHandler(function (event) {
                if (event.isEnd()) {
                    this.push(next(f(event)));
                    this.push(end());
                    return Bacon.noMore;
                } else {
                    return this.push(event);
                }
            }));
        };
        Observable.prototype.doAction = function () {
            var f;
            f = makeFunctionArgs(arguments);
            return withDescription(this, 'doAction', f, this.withHandler(function (event) {
                if (event.hasValue()) {
                    f(event.value());
                }
                return this.push(event);
            }));
        };
        Observable.prototype.skip = function (count) {
            return withDescription(this, 'skip', count, this.withHandler(function (event) {
                if (!event.hasValue()) {
                    return this.push(event);
                } else if (count > 0) {
                    count--;
                    return Bacon.more;
                } else {
                    return this.push(event);
                }
            }));
        };
        Observable.prototype.skipDuplicates = function (isEqual) {
            if (isEqual == null) {
                isEqual = function (a, b) {
                    return a === b;
                };
            }
            return withDescription(this, 'skipDuplicates', this.withStateMachine(None, function (prev, event) {
                if (!event.hasValue()) {
                    return [
                        prev,
                        [event]
                    ];
                } else if (event.isInitial() || prev === None || !isEqual(prev.get(), event.value())) {
                    return [
                        new Some(event.value()),
                        [event]
                    ];
                } else {
                    return [
                        prev,
                        []
                    ];
                }
            }));
        };
        Observable.prototype.skipErrors = function () {
            return withDescription(this, 'skipErrors', this.withHandler(function (event) {
                if (event.isError()) {
                    return Bacon.more;
                } else {
                    return this.push(event);
                }
            }));
        };
        Observable.prototype.withStateMachine = function (initState, f) {
            var state;
            state = initState;
            return withDescription(this, 'withStateMachine', initState, f, this.withHandler(function (event) {
                var fromF, newState, output, outputs, reply, _i, _len;
                fromF = f(state, event);
                newState = fromF[0], outputs = fromF[1];
                state = newState;
                reply = Bacon.more;
                for (_i = 0, _len = outputs.length; _i < _len; _i++) {
                    output = outputs[_i];
                    reply = this.push(output);
                    if (reply === Bacon.noMore) {
                        return reply;
                    }
                }
                return reply;
            }));
        };
        Observable.prototype.scan = function (seed, f, lazyF) {
            var acc, f_, resultProperty, root, subscribe, _this = this;
            f_ = toCombinator(f);
            f = lazyF ? f_ : function (x, y) {
                return f_(x(), y());
            };
            acc = toOption(seed).map(function (x) {
                return _.always(x);
            });
            root = this;
            subscribe = function (sink) {
                var initSent, reply, sendInit, unsub;
                initSent = false;
                unsub = nop;
                reply = Bacon.more;
                sendInit = function () {
                    if (!initSent) {
                        return acc.forEach(function (valueF) {
                            initSent = true;
                            reply = sink(new Initial(valueF));
                            if (reply === Bacon.noMore) {
                                unsub();
                                return unsub = nop;
                            }
                        });
                    }
                };
                unsub = _this.subscribe(function (event) {
                    var next, prev;
                    if (event.hasValue()) {
                        if (initSent && event.isInitial()) {
                            return Bacon.more;
                        } else {
                            if (!event.isInitial()) {
                                sendInit();
                            }
                            initSent = true;
                            prev = acc.getOrElse(function () {
                                return void 0;
                            });
                            next = _.cached(function () {
                                return f(prev, event.value);
                            });
                            acc = new Some(next);
                            return sink(event.apply(next));
                        }
                    } else {
                        if (event.isEnd()) {
                            reply = sendInit();
                        }
                        if (reply !== Bacon.noMore) {
                            return sink(event);
                        }
                    }
                });
                UpdateBarrier.whenDone(resultProperty, sendInit);
                return unsub;
            };
            return resultProperty = new Property(describe(this, 'scan', seed, f), subscribe);
        };
        Observable.prototype.fold = function (seed, f) {
            return withDescription(this, 'fold', seed, f, this.scan(seed, f).sampledBy(this.filter(false).mapEnd().toProperty()));
        };
        Observable.prototype.zip = function (other, f) {
            if (f == null) {
                f = Array;
            }
            return withDescription(this, 'zip', other, Bacon.zipWith([
                this,
                other
            ], f));
        };
        Observable.prototype.diff = function (start, f) {
            f = toCombinator(f);
            return withDescription(this, 'diff', start, f, this.scan([start], function (prevTuple, next) {
                return [
                    next,
                    f(prevTuple[0], next)
                ];
            }).filter(function (tuple) {
                return tuple.length === 2;
            }).map(function (tuple) {
                return tuple[1];
            }));
        };
        Observable.prototype.flatMap = function (f, firstOnly) {
            var root;
            f = makeSpawner(f);
            root = this;
            return new EventStream(describe(root, 'flatMap' + (firstOnly ? 'First' : ''), f), function (sink) {
                var checkEnd, composite;
                composite = new CompositeUnsubscribe();
                checkEnd = function (unsub) {
                    unsub();
                    if (composite.empty()) {
                        return sink(end());
                    }
                };
                composite.add(function (__, unsubRoot) {
                    return root.subscribe(function (event) {
                        var child;
                        if (event.isEnd()) {
                            return checkEnd(unsubRoot);
                        } else if (event.isError()) {
                            return sink(event);
                        } else if (firstOnly && composite.count() > 1) {
                            return Bacon.more;
                        } else {
                            if (composite.unsubscribed) {
                                return Bacon.noMore;
                            }
                            child = f(event.value());
                            if (!isObservable(child)) {
                                child = Bacon.once(child);
                            }
                            return composite.add(function (unsubAll, unsubMe) {
                                return child.subscribe(function (event) {
                                    var reply;
                                    if (event.isEnd()) {
                                        checkEnd(unsubMe);
                                        return Bacon.noMore;
                                    } else {
                                        if (event instanceof Initial) {
                                            event = event.toNext();
                                        }
                                        reply = sink(event);
                                        if (reply === Bacon.noMore) {
                                            unsubAll();
                                        }
                                        return reply;
                                    }
                                });
                            });
                        }
                    });
                });
                return composite.unsubscribe;
            });
        };
        Observable.prototype.flatMapFirst = function (f) {
            return this.flatMap(f, true);
        };
        Observable.prototype.flatMapLatest = function (f) {
            var stream, _this = this;
            f = makeSpawner(f);
            stream = this.toEventStream();
            return withDescription(this, 'flatMapLatest', f, stream.flatMap(function (value) {
                return f(value).takeUntil(stream);
            }));
        };
        Observable.prototype.not = function () {
            return withDescription(this, 'not', this.map(function (x) {
                return !x;
            }));
        };
        Observable.prototype.log = function () {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            this.subscribe(function (event) {
                return typeof console !== 'undefined' && console !== null ? typeof console.log === 'function' ? console.log.apply(console, __slice.call(args).concat([event.toString()])) : void 0 : void 0;
            });
            return this;
        };
        Observable.prototype.slidingWindow = function (n, minValues) {
            if (minValues == null) {
                minValues = 0;
            }
            return withDescription(this, 'slidingWindow', n, minValues, this.scan([], function (window, value) {
                return window.concat([value]).slice(-n);
            }).filter(function (values) {
                return values.length >= minValues;
            }));
        };
        Observable.prototype.combine = function (other, f) {
            var combinator;
            combinator = toCombinator(f);
            return withDescription(this, 'combine', other, f, Bacon.combineAsArray(this, other).map(function (values) {
                return combinator(values[0], values[1]);
            }));
        };
        Observable.prototype.decode = function (cases) {
            return withDescription(this, 'decode', cases, this.combine(Bacon.combineTemplate(cases), function (key, values) {
                return values[key];
            }));
        };
        Observable.prototype.awaiting = function (other) {
            return withDescription(this, 'awaiting', other, Bacon.groupSimultaneous(this, other).map(function (_arg) {
                var myValues, otherValues;
                myValues = _arg[0], otherValues = _arg[1];
                return otherValues.length === 0;
            }).toProperty(false).skipDuplicates());
        };
        Observable.prototype.name = function (name) {
            this.toString = function () {
                return name;
            };
            return this;
        };
        return Observable;
    }();
    Observable.prototype.reduce = Observable.prototype.fold;
    EventStream = function (_super) {
        __extends(EventStream, _super);
        function EventStream(desc, subscribe) {
            this.takeUntil = __bind(this.takeUntil, this);
            this.sampledBy = __bind(this.sampledBy, this);
            var dispatcher;
            if (isFunction(desc)) {
                subscribe = desc;
                desc = [];
            }
            EventStream.__super__.constructor.call(this, desc);
            assertFunction(subscribe);
            dispatcher = new Dispatcher(subscribe);
            this.subscribe = dispatcher.subscribe;
            this.subscribeInternal = this.subscribe;
            this.hasSubscribers = dispatcher.hasSubscribers;
            registerObs(this);
        }
        EventStream.prototype.delay = function (delay) {
            return withDescription(this, 'delay', delay, this.flatMap(function (value) {
                return Bacon.later(delay, value);
            }));
        };
        EventStream.prototype.debounce = function (delay) {
            return withDescription(this, 'debounce', delay, this.flatMapLatest(function (value) {
                return Bacon.later(delay, value);
            }));
        };
        EventStream.prototype.debounceImmediate = function (delay) {
            return withDescription(this, 'debounceImmediate', delay, this.flatMapFirst(function (value) {
                return Bacon.once(value).concat(Bacon.later(delay).filter(false));
            }));
        };
        EventStream.prototype.throttle = function (delay) {
            return withDescription(this, 'throttle', delay, this.bufferWithTime(delay).map(function (values) {
                return values[values.length - 1];
            }));
        };
        EventStream.prototype.bufferWithTime = function (delay) {
            return withDescription(this, 'bufferWithTime', delay, this.bufferWithTimeOrCount(delay, Number.MAX_VALUE));
        };
        EventStream.prototype.bufferWithCount = function (count) {
            return withDescription(this, 'bufferWithCount', count, this.bufferWithTimeOrCount(void 0, count));
        };
        EventStream.prototype.bufferWithTimeOrCount = function (delay, count) {
            var flushOrSchedule;
            flushOrSchedule = function (buffer) {
                if (buffer.values.length === count) {
                    return buffer.flush();
                } else if (delay !== void 0) {
                    return buffer.schedule();
                }
            };
            return withDescription(this, 'bufferWithTimeOrCount', delay, count, this.buffer(delay, flushOrSchedule, flushOrSchedule));
        };
        EventStream.prototype.buffer = function (delay, onInput, onFlush) {
            var buffer, delayMs, reply;
            if (onInput == null) {
                onInput = function () {
                };
            }
            if (onFlush == null) {
                onFlush = function () {
                };
            }
            buffer = {
                scheduled: false,
                end: null,
                values: [],
                flush: function () {
                    var reply;
                    this.scheduled = false;
                    if (this.values.length > 0) {
                        reply = this.push(next(this.values));
                        this.values = [];
                        if (this.end != null) {
                            return this.push(this.end);
                        } else if (reply !== Bacon.noMore) {
                            return onFlush(this);
                        }
                    } else {
                        if (this.end != null) {
                            return this.push(this.end);
                        }
                    }
                },
                schedule: function () {
                    var _this = this;
                    if (!this.scheduled) {
                        this.scheduled = true;
                        return delay(function () {
                            return _this.flush();
                        });
                    }
                }
            };
            reply = Bacon.more;
            if (!isFunction(delay)) {
                delayMs = delay;
                delay = function (f) {
                    return Bacon.scheduler.setTimeout(f, delayMs);
                };
            }
            return withDescription(this, 'buffer', this.withHandler(function (event) {
                buffer.push = this.push;
                if (event.isError()) {
                    reply = this.push(event);
                } else if (event.isEnd()) {
                    buffer.end = event;
                    if (!buffer.scheduled) {
                        buffer.flush();
                    }
                } else {
                    buffer.values.push(event.value());
                    onInput(buffer);
                }
                return reply;
            }));
        };
        EventStream.prototype.merge = function (right) {
            var left;
            assertEventStream(right);
            left = this;
            return new EventStream(describe(left, 'merge', right), function (sink) {
                var ends, smartSink;
                ends = 0;
                smartSink = function (obs) {
                    return function (unsubBoth) {
                        return obs.subscribe(function (event) {
                            var reply;
                            if (event.isEnd()) {
                                ends++;
                                if (ends === 2) {
                                    return sink(end());
                                } else {
                                    return Bacon.more;
                                }
                            } else {
                                reply = sink(event);
                                if (reply === Bacon.noMore) {
                                    unsubBoth();
                                }
                                return reply;
                            }
                        });
                    };
                };
                return compositeUnsubscribe(smartSink(left), smartSink(right));
            });
        };
        EventStream.prototype.toProperty = function (initValue) {
            if (arguments.length === 0) {
                initValue = None;
            }
            return withDescription(this, 'toProperty', initValue, this.scan(initValue, latterF, true));
        };
        EventStream.prototype.toEventStream = function () {
            return this;
        };
        EventStream.prototype.sampledBy = function (sampler, combinator) {
            return withDescription(this, 'sampledBy', sampler, combinator, this.toProperty().sampledBy(sampler, combinator));
        };
        EventStream.prototype.concat = function (right) {
            var left;
            left = this;
            return new EventStream(describe(left, 'concat', right), function (sink) {
                var unsubLeft, unsubRight;
                unsubRight = nop;
                unsubLeft = left.subscribe(function (e) {
                    if (e.isEnd()) {
                        return unsubRight = right.subscribe(sink);
                    } else {
                        return sink(e);
                    }
                });
                return function () {
                    unsubLeft();
                    return unsubRight();
                };
            });
        };
        EventStream.prototype.takeUntil = function (stopper) {
            var endMarker;
            endMarker = {};
            return withDescription(this, 'takeUntil', stopper, Bacon.groupSimultaneous(this.mapEnd(endMarker), stopper.skipErrors()).withHandler(function (event) {
                var data, reply, value, _i, _len, _ref3;
                if (!event.hasValue()) {
                    return this.push(event);
                } else {
                    _ref3 = event.value(), data = _ref3[0], stopper = _ref3[1];
                    if (stopper.length) {
                        return this.push(end());
                    } else {
                        reply = Bacon.more;
                        for (_i = 0, _len = data.length; _i < _len; _i++) {
                            value = data[_i];
                            if (value === endMarker) {
                                reply = this.push(end());
                            } else {
                                reply = this.push(next(value));
                            }
                        }
                        return reply;
                    }
                }
            }));
        };
        EventStream.prototype.skipUntil = function (starter) {
            var started;
            started = starter.take(1).map(true).toProperty(false);
            return withDescription(this, 'skipUntil', starter, this.filter(started));
        };
        EventStream.prototype.skipWhile = function () {
            var args, f, ok;
            f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            ok = false;
            return convertArgsToFunction(this, f, args, function (f) {
                return withDescription(this, 'skipWhile', f, this.withHandler(function (event) {
                    if (ok || !event.hasValue() || !f(event.value())) {
                        if (event.hasValue()) {
                            ok = true;
                        }
                        return this.push(event);
                    } else {
                        return Bacon.more;
                    }
                }));
            });
        };
        EventStream.prototype.startWith = function (seed) {
            return withDescription(this, 'startWith', seed, Bacon.once(seed).concat(this));
        };
        EventStream.prototype.withHandler = function (handler) {
            var dispatcher;
            dispatcher = new Dispatcher(this.subscribe, handler);
            return new EventStream(describe(this, 'withHandler', handler), dispatcher.subscribe);
        };
        return EventStream;
    }(Observable);
    Property = function (_super) {
        __extends(Property, _super);
        function Property(desc, subscribe, handler) {
            this.toEventStream = __bind(this.toEventStream, this);
            this.toProperty = __bind(this.toProperty, this);
            this.changes = __bind(this.changes, this);
            this.sample = __bind(this.sample, this);
            var _this = this;
            if (isFunction(desc)) {
                handler = subscribe;
                subscribe = desc;
                desc = [];
            }
            Property.__super__.constructor.call(this, desc);
            assertFunction(subscribe);
            if (handler === true) {
                this.subscribeInternal = subscribe;
            } else {
                this.subscribeInternal = new PropertyDispatcher(this, subscribe, handler).subscribe;
            }
            this.sampledBy = function (sampler, combinator) {
                var lazy, result, samplerSource, stream, thisSource;
                if (combinator != null) {
                    combinator = toCombinator(combinator);
                } else {
                    lazy = true;
                    combinator = function (f) {
                        return f();
                    };
                }
                thisSource = new Source(_this, false, false, _this.subscribeInternal, lazy);
                samplerSource = new Source(sampler, true, false, sampler.subscribe, lazy);
                stream = Bacon.when([
                    thisSource,
                    samplerSource
                ], combinator);
                result = sampler instanceof Property ? stream.toProperty() : stream;
                return withDescription(_this, 'sampledBy', sampler, combinator, result);
            };
            this.subscribe = this.subscribeInternal;
            registerObs(this);
        }
        Property.prototype.sample = function (interval) {
            return withDescription(this, 'sample', interval, this.sampledBy(Bacon.interval(interval, {})));
        };
        Property.prototype.changes = function () {
            var _this = this;
            return new EventStream(describe(this, 'changes'), function (sink) {
                return _this.subscribe(function (event) {
                    if (!event.isInitial()) {
                        return sink(event);
                    }
                });
            });
        };
        Property.prototype.withHandler = function (handler) {
            return new Property(describe(this, 'withHandler', handler), this.subscribeInternal, handler);
        };
        Property.prototype.toProperty = function () {
            assertNoArguments(arguments);
            return this;
        };
        Property.prototype.toEventStream = function () {
            var _this = this;
            return new EventStream(describe(this, 'toEventStream'), function (sink) {
                return _this.subscribe(function (event) {
                    if (event.isInitial()) {
                        event = event.toNext();
                    }
                    return sink(event);
                });
            });
        };
        Property.prototype.and = function (other) {
            return withDescription(this, 'and', other, this.combine(other, function (x, y) {
                return x && y;
            }));
        };
        Property.prototype.or = function (other) {
            return withDescription(this, 'or', other, this.combine(other, function (x, y) {
                return x || y;
            }));
        };
        Property.prototype.delay = function (delay) {
            return this.delayChanges('delay', delay, function (changes) {
                return changes.delay(delay);
            });
        };
        Property.prototype.debounce = function (delay) {
            return this.delayChanges('debounce', delay, function (changes) {
                return changes.debounce(delay);
            });
        };
        Property.prototype.throttle = function (delay) {
            return this.delayChanges('throttle', delay, function (changes) {
                return changes.throttle(delay);
            });
        };
        Property.prototype.delayChanges = function () {
            var desc, f, _i;
            desc = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), f = arguments[_i++];
            return withDescription.apply(null, [this].concat(__slice.call(desc), [addPropertyInitValueToStream(this, f(this.changes()))]));
        };
        Property.prototype.takeUntil = function (stopper) {
            var changes;
            changes = this.changes().takeUntil(stopper);
            return withDescription(this, 'takeUntil', stopper, addPropertyInitValueToStream(this, changes));
        };
        Property.prototype.startWith = function (value) {
            return withDescription(this, 'startWith', value, this.scan(value, function (prev, next) {
                return next;
            }));
        };
        return Property;
    }(Observable);
    convertArgsToFunction = function (obs, f, args, method) {
        var sampled;
        if (f instanceof Property) {
            sampled = f.sampledBy(obs, function (p, s) {
                return [
                    p,
                    s
                ];
            });
            return method.apply(sampled, [function (_arg) {
                    var p, s;
                    p = _arg[0], s = _arg[1];
                    return p;
                }]).map(function (_arg) {
                var p, s;
                p = _arg[0], s = _arg[1];
                return s;
            });
        } else {
            f = makeFunction(f, args);
            return method.apply(obs, [f]);
        }
    };
    addPropertyInitValueToStream = function (property, stream) {
        var justInitValue;
        justInitValue = new EventStream(describe(property, 'justInitValue'), function (sink) {
            var unsub, value;
            value = null;
            unsub = property.subscribe(function (event) {
                if (event.hasValue()) {
                    value = event;
                }
                return Bacon.noMore;
            });
            UpdateBarrier.whenDone(justInitValue, function () {
                if (value != null) {
                    sink(value);
                }
                return sink(end());
            });
            return unsub;
        });
        return justInitValue.concat(stream).toProperty();
    };
    Dispatcher = function () {
        function Dispatcher(subscribe, handleEvent) {
            var done, ended, prevError, pushIt, pushing, queue, removeSub, subscriptions, unsubscribeFromSource, waiters, _this = this;
            if (subscribe == null) {
                subscribe = function () {
                    return nop;
                };
            }
            subscriptions = [];
            queue = null;
            pushing = false;
            ended = false;
            this.hasSubscribers = function () {
                return subscriptions.length > 0;
            };
            prevError = null;
            unsubscribeFromSource = nop;
            removeSub = function (subscription) {
                return subscriptions = _.without(subscription, subscriptions);
            };
            waiters = null;
            done = function () {
                var w, ws, _i, _len, _results;
                if (waiters != null) {
                    ws = waiters;
                    waiters = null;
                    _results = [];
                    for (_i = 0, _len = ws.length; _i < _len; _i++) {
                        w = ws[_i];
                        _results.push(w());
                    }
                    return _results;
                }
            };
            pushIt = function (event) {
                var reply, sub, success, tmp, _i, _len;
                if (!pushing) {
                    if (event === prevError) {
                        return;
                    }
                    if (event.isError()) {
                        prevError = event;
                    }
                    success = false;
                    try {
                        pushing = true;
                        tmp = subscriptions;
                        for (_i = 0, _len = tmp.length; _i < _len; _i++) {
                            sub = tmp[_i];
                            reply = sub.sink(event);
                            if (reply === Bacon.noMore || event.isEnd()) {
                                removeSub(sub);
                            }
                        }
                        success = true;
                    } finally {
                        pushing = false;
                        if (!success) {
                            queue = null;
                        }
                    }
                    success = true;
                    while (queue != null ? queue.length : void 0) {
                        event = _.head(queue);
                        queue = _.tail(queue);
                        this.push(event);
                    }
                    done(event);
                    if (this.hasSubscribers()) {
                        return Bacon.more;
                    } else {
                        return Bacon.noMore;
                    }
                } else {
                    queue = (queue || []).concat([event]);
                    return Bacon.more;
                }
            };
            this.push = function (event) {
                return UpdateBarrier.inTransaction(event, _this, pushIt, [event]);
            };
            if (handleEvent == null) {
                handleEvent = function (event) {
                    return this.push(event);
                };
            }
            this.handleEvent = function (event) {
                if (event.isEnd()) {
                    ended = true;
                }
                return handleEvent.apply(_this, [event]);
            };
            this.subscribe = function (sink) {
                var subscription;
                if (ended) {
                    sink(end());
                    return nop;
                } else {
                    assertFunction(sink);
                    subscription = { sink: sink };
                    subscriptions = subscriptions.concat(subscription);
                    if (subscriptions.length === 1) {
                        unsubscribeFromSource = subscribe(_this.handleEvent);
                    }
                    assertFunction(unsubscribeFromSource);
                    return function () {
                        removeSub(subscription);
                        if (!_this.hasSubscribers()) {
                            return unsubscribeFromSource();
                        }
                    };
                }
            };
        }
        return Dispatcher;
    }();
    PropertyDispatcher = function (_super) {
        __extends(PropertyDispatcher, _super);
        function PropertyDispatcher(p, subscribe, handleEvent) {
            var current, currentValueRootId, ended, push, _this = this;
            PropertyDispatcher.__super__.constructor.call(this, subscribe, handleEvent);
            current = None;
            currentValueRootId = void 0;
            push = this.push;
            subscribe = this.subscribe;
            ended = false;
            this.push = function (event) {
                if (event.isEnd()) {
                    ended = true;
                }
                if (event.hasValue()) {
                    current = new Some(event);
                    currentValueRootId = UpdateBarrier.currentEventId();
                }
                return push.apply(_this, [event]);
            };
            this.subscribe = function (sink) {
                var dispatchingId, initSent, maybeSubSource, reply, valId;
                initSent = false;
                reply = Bacon.more;
                maybeSubSource = function () {
                    if (reply === Bacon.noMore) {
                        return nop;
                    } else if (ended) {
                        sink(end());
                        return nop;
                    } else {
                        return subscribe.apply(this, [sink]);
                    }
                };
                if (current.isDefined && (_this.hasSubscribers() || ended)) {
                    dispatchingId = UpdateBarrier.currentEventId();
                    valId = currentValueRootId;
                    if (!ended && valId && dispatchingId && dispatchingId !== valId) {
                        UpdateBarrier.whenDone(p, function () {
                            if (currentValueRootId === valId) {
                                return sink(initial(current.get().value()));
                            }
                        });
                        return maybeSubSource();
                    } else {
                        UpdateBarrier.inTransaction(void 0, _this, function () {
                            return reply = sink(initial(current.get().value()));
                        }, []);
                        return maybeSubSource();
                    }
                } else {
                    return maybeSubSource();
                }
            };
        }
        return PropertyDispatcher;
    }(Dispatcher);
    Bus = function (_super) {
        __extends(Bus, _super);
        function Bus() {
            var ended, guardedSink, sink, subscribeAll, subscribeInput, subscriptions, unsubAll, unsubscribeInput, _this = this;
            sink = void 0;
            subscriptions = [];
            ended = false;
            guardedSink = function (input) {
                return function (event) {
                    if (event.isEnd()) {
                        unsubscribeInput(input);
                        return Bacon.noMore;
                    } else {
                        return sink(event);
                    }
                };
            };
            unsubAll = function () {
                var sub, _i, _len, _results;
                _results = [];
                for (_i = 0, _len = subscriptions.length; _i < _len; _i++) {
                    sub = subscriptions[_i];
                    _results.push(typeof sub.unsub === 'function' ? sub.unsub() : void 0);
                }
                return _results;
            };
            subscribeInput = function (subscription) {
                return subscription.unsub = subscription.input.subscribe(guardedSink(subscription.input));
            };
            unsubscribeInput = function (input) {
                var i, sub, _i, _len;
                for (i = _i = 0, _len = subscriptions.length; _i < _len; i = ++_i) {
                    sub = subscriptions[i];
                    if (sub.input === input) {
                        if (typeof sub.unsub === 'function') {
                            sub.unsub();
                        }
                        subscriptions.splice(i, 1);
                        return;
                    }
                }
            };
            subscribeAll = function (newSink) {
                var subscription, _i, _len, _ref3;
                sink = newSink;
                _ref3 = cloneArray(subscriptions);
                for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
                    subscription = _ref3[_i];
                    subscribeInput(subscription);
                }
                return unsubAll;
            };
            Bus.__super__.constructor.call(this, describe(Bacon, 'Bus'), subscribeAll);
            this.plug = function (input) {
                var sub;
                if (ended) {
                    return;
                }
                sub = { input: input };
                subscriptions.push(sub);
                if (sink != null) {
                    subscribeInput(sub);
                }
                return function () {
                    return unsubscribeInput(input);
                };
            };
            this.push = function (value) {
                return typeof sink === 'function' ? sink(next(value)) : void 0;
            };
            this.error = function (error) {
                return typeof sink === 'function' ? sink(new Error(error)) : void 0;
            };
            this.end = function () {
                ended = true;
                unsubAll();
                return typeof sink === 'function' ? sink(end()) : void 0;
            };
        }
        return Bus;
    }(EventStream);
    Source = function () {
        function Source(obs, sync, consume, subscribe, lazy, queue) {
            var invoke;
            this.obs = obs;
            this.sync = sync;
            this.subscribe = subscribe;
            if (lazy == null) {
                lazy = false;
            }
            if (queue == null) {
                queue = [];
            }
            invoke = lazy ? _.id : function (f) {
                return f();
            };
            if (this.subscribe == null) {
                this.subscribe = obs.subscribe;
            }
            this.markEnded = function () {
                return this.ended = true;
            };
            this.toString = this.obs.toString;
            if (consume) {
                this.consume = function () {
                    return invoke(queue.shift());
                };
                this.push = function (x) {
                    return queue.push(x);
                };
                this.mayHave = function (c) {
                    return !this.ended || queue.length >= c;
                };
                this.hasAtLeast = function (c) {
                    return queue.length >= c;
                };
                this.flatten = false;
            } else {
                this.consume = function () {
                    return invoke(queue[0]);
                };
                this.push = function (x) {
                    return queue = [x];
                };
                this.mayHave = function () {
                    return true;
                };
                this.hasAtLeast = function () {
                    return queue.length;
                };
                this.flatten = true;
            }
        }
        return Source;
    }();
    BufferingSource = function (_super) {
        __extends(BufferingSource, _super);
        function BufferingSource(obs) {
            var queue;
            this.obs = obs;
            queue = [];
            BufferingSource.__super__.constructor.call(this, this.obs, true, false, this.obs.subscribe, false, queue);
            this.consume = function () {
                var values;
                values = queue;
                queue = [];
                return values;
            };
            this.push = function (x) {
                return queue.push(x());
            };
            this.hasAtLeast = function () {
                return true;
            };
        }
        return BufferingSource;
    }(Source);
    Source.fromObservable = function (s) {
        if (s instanceof Source) {
            return s;
        } else if (s instanceof Property) {
            return new Source(s, false, false);
        } else {
            return new Source(s, true, true);
        }
    };
    describe = function () {
        var args, context, method;
        context = arguments[0], method = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        if ((context || method) instanceof Desc) {
            return context || method;
        } else {
            return new Desc(context, method, args);
        }
    };
    Desc = function () {
        function Desc(context, method, args) {
            var collectDeps, dependsOn, findDeps, flatDeps;
            findDeps = function (x) {
                if (isArray(x)) {
                    return _.flatMap(findDeps, x);
                } else if (isObservable(x)) {
                    return [x];
                } else if (x instanceof Source) {
                    return [x.obs];
                } else {
                    return [];
                }
            };
            flatDeps = null;
            collectDeps = function (o) {
                var deps;
                deps = o.internalDeps();
                return _.each(deps, function (i, dep) {
                    flatDeps[dep.id] = true;
                    return collectDeps(dep);
                });
            };
            dependsOn = function (b) {
                if (flatDeps == null) {
                    flatDeps = {};
                    collectDeps(this);
                }
                return flatDeps[b.id];
            };
            this.apply = function (obs) {
                var deps;
                deps = _.cached(function () {
                    return findDeps([context].concat(args));
                });
                obs.internalDeps = obs.internalDeps || deps;
                obs.dependsOn = dependsOn;
                obs.deps = deps;
                obs.toString = function () {
                    return _.toString(context) + '.' + _.toString(method) + '(' + _.map(_.toString, args) + ')';
                };
                obs.inspect = function () {
                    return obs.toString();
                };
                obs.desc = function () {
                    return {
                        context: context,
                        method: method,
                        args: args
                    };
                };
                return obs;
            };
        }
        return Desc;
    }();
    withDescription = function () {
        var desc, obs, _i;
        desc = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), obs = arguments[_i++];
        return describe.apply(null, desc).apply(obs);
    };
    Bacon.when = function () {
        var f, i, index, ix, len, needsBarrier, pat, patSources, pats, patterns, resultStream, s, sources, usage, _i, _j, _len, _len1, _ref3;
        patterns = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (patterns.length === 0) {
            return Bacon.never();
        }
        len = patterns.length;
        usage = 'when: expecting arguments in the form (Observable+,function)+';
        assert(usage, len % 2 === 0);
        sources = [];
        pats = [];
        i = 0;
        while (i < len) {
            patSources = _.toArray(patterns[i]);
            f = patterns[i + 1];
            pat = {
                f: isFunction(f) ? f : function () {
                    return f;
                },
                ixs: []
            };
            for (_i = 0, _len = patSources.length; _i < _len; _i++) {
                s = patSources[_i];
                assert(isObservable(s), usage);
                index = _.indexOf(sources, s);
                if (index < 0) {
                    sources.push(s);
                    index = sources.length - 1;
                }
                _ref3 = pat.ixs;
                for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
                    ix = _ref3[_j];
                    if (ix.index === index) {
                        ix.count++;
                    }
                }
                pat.ixs.push({
                    index: index,
                    count: 1
                });
            }
            if (patSources.length > 0) {
                pats.push(pat);
            }
            i = i + 2;
        }
        if (!sources.length) {
            return Bacon.never();
        }
        sources = _.map(Source.fromObservable, sources);
        needsBarrier = _.any(sources, function (s) {
            return s.flatten;
        }) && containsDuplicateDeps(_.map(function (s) {
            return s.obs;
        }, sources));
        return resultStream = new EventStream(describe.apply(null, [
            Bacon,
            'when'
        ].concat(__slice.call(patterns))), function (sink) {
            var cannotMatch, cannotSync, ends, match, nonFlattened, part, triggers;
            triggers = [];
            ends = false;
            match = function (p) {
                var _k, _len2, _ref4;
                _ref4 = p.ixs;
                for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
                    i = _ref4[_k];
                    if (!sources[i.index].hasAtLeast(i.count)) {
                        return false;
                    }
                }
                return true;
            };
            cannotSync = function (source) {
                return !source.sync || source.ended;
            };
            cannotMatch = function (p) {
                var _k, _len2, _ref4;
                _ref4 = p.ixs;
                for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
                    i = _ref4[_k];
                    if (!sources[i.index].mayHave(i.count)) {
                        return true;
                    }
                }
            };
            nonFlattened = function (trigger) {
                return !trigger.source.flatten;
            };
            part = function (source) {
                return function (unsubAll) {
                    var flush, flushLater, flushWhileTriggers;
                    flushLater = function () {
                        return UpdateBarrier.whenDone(resultStream, flush);
                    };
                    flushWhileTriggers = function () {
                        var p, reply, trigger, val, _k, _len2;
                        if (triggers.length > 0) {
                            reply = Bacon.more;
                            trigger = triggers.pop();
                            for (_k = 0, _len2 = pats.length; _k < _len2; _k++) {
                                p = pats[_k];
                                if (match(p)) {
                                    val = function () {
                                        return p.f.apply(p, function () {
                                            var _l, _len3, _ref4, _results;
                                            _ref4 = p.ixs;
                                            _results = [];
                                            for (_l = 0, _len3 = _ref4.length; _l < _len3; _l++) {
                                                i = _ref4[_l];
                                                _results.push(sources[i.index].consume());
                                            }
                                            return _results;
                                        }());
                                    };
                                    reply = sink(trigger.e.apply(val));
                                    if (triggers.length && needsBarrier) {
                                        triggers = _.filter(nonFlattened, triggers);
                                    }
                                    if (reply === Bacon.noMore) {
                                        return reply;
                                    } else {
                                        return flushWhileTriggers();
                                    }
                                }
                            }
                        } else {
                            return Bacon.more;
                        }
                    };
                    flush = function () {
                        var reply;
                        reply = flushWhileTriggers();
                        if (ends) {
                            ends = false;
                            if (_.all(sources, cannotSync) || _.all(pats, cannotMatch)) {
                                reply = Bacon.noMore;
                                sink(end());
                            }
                        }
                        if (reply === Bacon.noMore) {
                            unsubAll();
                        }
                        return reply;
                    };
                    return source.subscribe(function (e) {
                        var reply;
                        if (e.isEnd()) {
                            ends = true;
                            source.markEnded();
                            flushLater();
                        } else if (e.isError()) {
                            reply = sink(e);
                        } else {
                            source.push(e.value);
                            if (source.sync) {
                                triggers.push({
                                    source: source,
                                    e: e
                                });
                                if (needsBarrier) {
                                    flushLater();
                                } else {
                                    flush();
                                }
                            }
                        }
                        if (reply === Bacon.noMore) {
                            unsubAll();
                        }
                        return reply || Bacon.more;
                    });
                };
            };
            return compositeUnsubscribe.apply(null, function () {
                var _k, _len2, _results;
                _results = [];
                for (_k = 0, _len2 = sources.length; _k < _len2; _k++) {
                    s = sources[_k];
                    _results.push(part(s));
                }
                return _results;
            }());
        });
    };
    containsDuplicateDeps = function (observables, state) {
        var checkObservable;
        if (state == null) {
            state = [];
        }
        checkObservable = function (obs) {
            var deps;
            if (Bacon._.contains(state, obs)) {
                return true;
            } else {
                deps = obs.internalDeps();
                if (deps.length) {
                    state.push(obs);
                    return Bacon._.any(deps, checkObservable);
                } else {
                    state.push(obs);
                    return false;
                }
            }
        };
        return Bacon._.any(observables, checkObservable);
    };
    Bacon.update = function () {
        var i, initial, lateBindFirst, patterns;
        initial = arguments[0], patterns = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        lateBindFirst = function (f) {
            return function () {
                var args;
                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                return function (i) {
                    return f.apply(null, [i].concat(args));
                };
            };
        };
        i = patterns.length - 1;
        while (i > 0) {
            if (!(patterns[i] instanceof Function)) {
                patterns[i] = function (x) {
                    return function () {
                        return x;
                    };
                }(patterns[i]);
            }
            patterns[i] = lateBindFirst(patterns[i]);
            i = i - 2;
        }
        return withDescription.apply(null, [
            Bacon,
            'update',
            initial
        ].concat(__slice.call(patterns), [Bacon.when.apply(Bacon, patterns).scan(initial, function (x, f) {
                return f(x);
            })]));
    };
    compositeUnsubscribe = function () {
        var ss;
        ss = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return new CompositeUnsubscribe(ss).unsubscribe;
    };
    CompositeUnsubscribe = function () {
        function CompositeUnsubscribe(ss) {
            var s, _i, _len;
            if (ss == null) {
                ss = [];
            }
            this.empty = __bind(this.empty, this);
            this.count = __bind(this.count, this);
            this.unsubscribe = __bind(this.unsubscribe, this);
            this.add = __bind(this.add, this);
            this.unsubscribed = false;
            this.subscriptions = [];
            this.starting = [];
            for (_i = 0, _len = ss.length; _i < _len; _i++) {
                s = ss[_i];
                this.add(s);
            }
        }
        CompositeUnsubscribe.prototype.add = function (subscription) {
            var ended, unsub, unsubMe, _this = this;
            if (this.unsubscribed) {
                return;
            }
            ended = false;
            unsub = nop;
            this.starting.push(subscription);
            unsubMe = function () {
                if (_this.unsubscribed) {
                    return;
                }
                ended = true;
                _this.remove(unsub);
                return _.remove(subscription, _this.starting);
            };
            unsub = subscription(this.unsubscribe, unsubMe);
            if (!(this.unsubscribed || ended)) {
                this.subscriptions.push(unsub);
            }
            _.remove(subscription, this.starting);
            return unsub;
        };
        CompositeUnsubscribe.prototype.remove = function (unsub) {
            if (this.unsubscribed) {
                return;
            }
            if (_.remove(unsub, this.subscriptions) !== void 0) {
                return unsub();
            }
        };
        CompositeUnsubscribe.prototype.unsubscribe = function () {
            var s, _i, _len, _ref3;
            if (this.unsubscribed) {
                return;
            }
            this.unsubscribed = true;
            _ref3 = this.subscriptions;
            for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
                s = _ref3[_i];
                s();
            }
            this.subscriptions = [];
            return this.starting = [];
        };
        CompositeUnsubscribe.prototype.count = function () {
            if (this.unsubscribed) {
                return 0;
            }
            return this.subscriptions.length + this.starting.length;
        };
        CompositeUnsubscribe.prototype.empty = function () {
            return this.count() === 0;
        };
        return CompositeUnsubscribe;
    }();
    Bacon.CompositeUnsubscribe = CompositeUnsubscribe;
    Some = function () {
        function Some(value) {
            this.value = value;
        }
        Some.prototype.getOrElse = function () {
            return this.value;
        };
        Some.prototype.get = function () {
            return this.value;
        };
        Some.prototype.filter = function (f) {
            if (f(this.value)) {
                return new Some(this.value);
            } else {
                return None;
            }
        };
        Some.prototype.map = function (f) {
            return new Some(f(this.value));
        };
        Some.prototype.forEach = function (f) {
            return f(this.value);
        };
        Some.prototype.isDefined = true;
        Some.prototype.toArray = function () {
            return [this.value];
        };
        Some.prototype.inspect = function () {
            return 'Some(' + this.value + ')';
        };
        Some.prototype.toString = function () {
            return this.inspect();
        };
        return Some;
    }();
    None = {
        getOrElse: function (value) {
            return value;
        },
        filter: function () {
            return None;
        },
        map: function () {
            return None;
        },
        forEach: function () {
        },
        isDefined: false,
        toArray: function () {
            return [];
        },
        inspect: function () {
            return 'None';
        },
        toString: function () {
            return this.inspect();
        }
    };
    UpdateBarrier = function () {
        var currentEventId, findIndependent, flush, inTransaction, independent, rootEvent, waiters, whenDone;
        rootEvent = void 0;
        waiters = [];
        independent = function (waiter) {
            return !_.any(waiters, function (other) {
                return waiter.obs.dependsOn(other.obs);
            });
        };
        whenDone = function (obs, f) {
            if (rootEvent) {
                return waiters.push({
                    obs: obs,
                    f: f
                });
            } else {
                return f();
            }
        };
        findIndependent = function () {
            while (!independent(waiters[0])) {
                waiters.push(waiters.splice(0, 1)[0]);
            }
            return waiters.splice(0, 1)[0];
        };
        flush = function () {
            if (waiters.length) {
                findIndependent().f();
                return flush();
            }
        };
        inTransaction = function (event, context, f, args) {
            var result;
            if (rootEvent) {
                return f.apply(context, args);
            } else {
                rootEvent = event;
                try {
                    result = f.apply(context, args);
                    flush();
                } finally {
                    rootEvent = void 0;
                }
                return result;
            }
        };
        currentEventId = function () {
            if (rootEvent) {
                return rootEvent.id;
            } else {
                return void 0;
            }
        };
        return {
            whenDone: whenDone,
            inTransaction: inTransaction,
            currentEventId: currentEventId
        };
    }();
    Bacon.EventStream = EventStream;
    Bacon.Property = Property;
    Bacon.Observable = Observable;
    Bacon.Bus = Bus;
    Bacon.Initial = Initial;
    Bacon.Next = Next;
    Bacon.End = End;
    Bacon.Error = Error;
    nop = function () {
    };
    latterF = function (_, x) {
        return x();
    };
    former = function (x, _) {
        return x;
    };
    initial = function (value) {
        return new Initial(_.always(value));
    };
    next = function (value) {
        return new Next(_.always(value));
    };
    end = function () {
        return new End();
    };
    toEvent = function (x) {
        if (x instanceof Event) {
            return x;
        } else {
            return next(x);
        }
    };
    cloneArray = function (xs) {
        return xs.slice(0);
    };
    assert = function (message, condition) {
        if (!condition) {
            throw message;
        }
    };
    assertEventStream = function (event) {
        if (!(event instanceof EventStream)) {
            throw 'not an EventStream : ' + event;
        }
    };
    assertFunction = function (f) {
        return assert('not a function : ' + f, isFunction(f));
    };
    isFunction = function (f) {
        return typeof f === 'function';
    };
    isArray = function (xs) {
        return xs instanceof Array;
    };
    isObservable = function (x) {
        return x instanceof Observable;
    };
    assertArray = function (xs) {
        if (!isArray(xs)) {
            throw 'not an array : ' + xs;
        }
    };
    assertNoArguments = function (args) {
        return assert('no arguments supported', args.length === 0);
    };
    assertString = function (x) {
        if (typeof x !== 'string') {
            throw 'not a string : ' + x;
        }
    };
    partiallyApplied = function (f, applied) {
        return function () {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return f.apply(null, applied.concat(args));
        };
    };
    makeSpawner = function (f) {
        if (isObservable(f)) {
            f = _.always(f);
        }
        assertFunction(f);
        return f;
    };
    makeFunctionArgs = function (args) {
        args = Array.prototype.slice.call(args);
        return makeFunction_.apply(null, args);
    };
    makeFunction_ = withMethodCallSupport(function () {
        var args, f;
        f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (isFunction(f)) {
            if (args.length) {
                return partiallyApplied(f, args);
            } else {
                return f;
            }
        } else if (isFieldKey(f)) {
            return toFieldExtractor(f, args);
        } else {
            return _.always(f);
        }
    });
    makeFunction = function (f, args) {
        return makeFunction_.apply(null, [f].concat(__slice.call(args)));
    };
    isFieldKey = function (f) {
        return typeof f === 'string' && f.length > 1 && f.charAt(0) === '.';
    };
    Bacon.isFieldKey = isFieldKey;
    toFieldExtractor = function (f, args) {
        var partFuncs, parts;
        parts = f.slice(1).split('.');
        partFuncs = _.map(toSimpleExtractor(args), parts);
        return function (value) {
            var _i, _len;
            for (_i = 0, _len = partFuncs.length; _i < _len; _i++) {
                f = partFuncs[_i];
                value = f(value);
            }
            return value;
        };
    };
    toSimpleExtractor = function (args) {
        return function (key) {
            return function (value) {
                var fieldValue;
                if (value == null) {
                    return void 0;
                } else {
                    fieldValue = value[key];
                    if (isFunction(fieldValue)) {
                        return fieldValue.apply(value, args);
                    } else {
                        return fieldValue;
                    }
                }
            };
        };
    };
    toFieldKey = function (f) {
        return f.slice(1);
    };
    toCombinator = function (f) {
        var key;
        if (isFunction(f)) {
            return f;
        } else if (isFieldKey(f)) {
            key = toFieldKey(f);
            return function (left, right) {
                return left[key](right);
            };
        } else {
            return assert('not a function or a field key: ' + f, false);
        }
    };
    toOption = function (v) {
        if (v instanceof Some || v === None) {
            return v;
        } else {
            return new Some(v);
        }
    };
    _ = {
        indexOf: Array.prototype.indexOf ? function (xs, x) {
            return xs.indexOf(x);
        } : function (xs, x) {
            var i, y, _i, _len;
            for (i = _i = 0, _len = xs.length; _i < _len; i = ++_i) {
                y = xs[i];
                if (x === y) {
                    return i;
                }
            }
            return -1;
        },
        indexWhere: function (xs, f) {
            var i, y, _i, _len;
            for (i = _i = 0, _len = xs.length; _i < _len; i = ++_i) {
                y = xs[i];
                if (f(y)) {
                    return i;
                }
            }
            return -1;
        },
        head: function (xs) {
            return xs[0];
        },
        always: function (x) {
            return function () {
                return x;
            };
        },
        negate: function (f) {
            return function (x) {
                return !f(x);
            };
        },
        empty: function (xs) {
            return xs.length === 0;
        },
        tail: function (xs) {
            return xs.slice(1, xs.length);
        },
        filter: function (f, xs) {
            var filtered, x, _i, _len;
            filtered = [];
            for (_i = 0, _len = xs.length; _i < _len; _i++) {
                x = xs[_i];
                if (f(x)) {
                    filtered.push(x);
                }
            }
            return filtered;
        },
        map: function (f, xs) {
            var x, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = xs.length; _i < _len; _i++) {
                x = xs[_i];
                _results.push(f(x));
            }
            return _results;
        },
        each: function (xs, f) {
            var key, value, _results;
            _results = [];
            for (key in xs) {
                value = xs[key];
                _results.push(f(key, value));
            }
            return _results;
        },
        toArray: function (xs) {
            if (isArray(xs)) {
                return xs;
            } else {
                return [xs];
            }
        },
        contains: function (xs, x) {
            return _.indexOf(xs, x) !== -1;
        },
        id: function (x) {
            return x;
        },
        last: function (xs) {
            return xs[xs.length - 1];
        },
        all: function (xs, f) {
            var x, _i, _len;
            if (f == null) {
                f = _.id;
            }
            for (_i = 0, _len = xs.length; _i < _len; _i++) {
                x = xs[_i];
                if (!f(x)) {
                    return false;
                }
            }
            return true;
        },
        any: function (xs, f) {
            var x, _i, _len;
            if (f == null) {
                f = _.id;
            }
            for (_i = 0, _len = xs.length; _i < _len; _i++) {
                x = xs[_i];
                if (f(x)) {
                    return true;
                }
            }
            return false;
        },
        without: function (x, xs) {
            return _.filter(function (y) {
                return y !== x;
            }, xs);
        },
        remove: function (x, xs) {
            var i;
            i = _.indexOf(xs, x);
            if (i >= 0) {
                return xs.splice(i, 1);
            }
        },
        fold: function (xs, seed, f) {
            var x, _i, _len;
            for (_i = 0, _len = xs.length; _i < _len; _i++) {
                x = xs[_i];
                seed = f(seed, x);
            }
            return seed;
        },
        flatMap: function (f, xs) {
            return _.fold(xs, [], function (ys, x) {
                return ys.concat(f(x));
            });
        },
        cached: function (f) {
            var value;
            value = None;
            return function () {
                if (value === None) {
                    value = f();
                    f = null;
                }
                return value;
            };
        },
        toString: function (obj) {
            var key, value;
            try {
                recursionDepth++;
                if (obj == null) {
                    return 'undefined';
                } else if (isFunction(obj)) {
                    return 'function';
                } else if (isArray(obj)) {
                    if (recursionDepth > 5) {
                        return '[..]';
                    }
                    return '[' + _.map(_.toString, obj).toString() + ']';
                } else if ((obj != null ? obj.toString : void 0) != null && obj.toString !== Object.prototype.toString) {
                    return obj.toString();
                } else if (typeof obj === 'object') {
                    if (recursionDepth > 5) {
                        return '{..}';
                    }
                    return '{' + function () {
                        var _results;
                        _results = [];
                        for (key in obj) {
                            value = obj[key];
                            _results.push(_.toString(key) + ':' + _.toString(value));
                        }
                        return _results;
                    }() + '}';
                } else {
                    return obj;
                }
            } finally {
                recursionDepth--;
            }
        }
    };
    recursionDepth = 0;
    Bacon._ = _;
    Bacon.scheduler = {
        setTimeout: function (f, d) {
            return setTimeout(f, d);
        },
        setInterval: function (f, i) {
            return setInterval(f, i);
        },
        clearInterval: function (id) {
            return clearInterval(id);
        },
        now: function () {
            return new Date().getTime();
        }
    };
    if (typeof module !== 'undefined' && module !== null) {
        module.exports = Bacon;
        Bacon.Bacon = Bacon;
    } else {
        if (typeof define !== 'undefined' && define !== null && define.amd != null) {
            define([], function () {
                return Bacon;
            });
        }
        this.Bacon = Bacon;
    }
}.call(this));
});
require.define('21', function(module, exports, __dirname, __filename, undefined){
var TAFFY, exports, T;
(function () {
    'use strict';
    var typeList, makeTest, idx, typeKey, version, TC, idpad, cmax, API, protectJSON, each, eachin, isIndexable, returnFilter, runFilters, numcharsplit, orderByCol, run, intersection, filter, makeCid, safeForJson, isRegexp;
    ;
    if (!TAFFY) {
        version = '2.7';
        TC = 1;
        idpad = '000000';
        cmax = 1000;
        API = {};
        protectJSON = function (t) {
            if (TAFFY.isArray(t) || TAFFY.isObject(t)) {
                return t;
            } else {
                return JSON.parse(t);
            }
        };
        intersection = function (array1, array2) {
            return filter(array1, function (item) {
                return array2.indexOf(item) >= 0;
            });
        };
        filter = function (obj, iterator, context) {
            var results = [];
            if (obj == null)
                return results;
            if (Array.prototype.filter && obj.filter === Array.prototype.filter)
                return obj.filter(iterator, context);
            each(obj, function (value, index, list) {
                if (iterator.call(context, value, index, list))
                    results[results.length] = value;
            });
            return results;
        };
        isRegexp = function (aObj) {
            return Object.prototype.toString.call(aObj) === '[object RegExp]';
        };
        safeForJson = function (aObj) {
            var myResult = T.isArray(aObj) ? [] : T.isObject(aObj) ? {} : null;
            if (aObj === null)
                return aObj;
            for (var i in aObj) {
                myResult[i] = isRegexp(aObj[i]) ? aObj[i].toString() : T.isArray(aObj[i]) || T.isObject(aObj[i]) ? safeForJson(aObj[i]) : aObj[i];
            }
            return myResult;
        };
        makeCid = function (aContext) {
            var myCid = JSON.stringify(aContext);
            if (myCid.match(/regex/) === null)
                return myCid;
            return JSON.stringify(safeForJson(aContext));
        };
        each = function (a, fun, u) {
            var r, i, x, y;
            if (a && (T.isArray(a) && a.length === 1 || !T.isArray(a))) {
                fun(T.isArray(a) ? a[0] : a, 0);
            } else {
                for (r, i, x = 0, a = T.isArray(a) ? a : [a], y = a.length; x < y; x++) {
                    i = a[x];
                    if (!T.isUndefined(i) || (u || false)) {
                        r = fun(i, x);
                        if (r === T.EXIT) {
                            break;
                        }
                    }
                }
            }
        };
        eachin = function (o, fun) {
            var x = 0, r, i;
            for (i in o) {
                if (o.hasOwnProperty(i)) {
                    r = fun(o[i], i, x++);
                    if (r === T.EXIT) {
                        break;
                    }
                }
            }
        };
        API.extend = function (m, f) {
            API[m] = function () {
                return f.apply(this, arguments);
            };
        };
        isIndexable = function (f) {
            var i;
            if (T.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f)) {
                return true;
            }
            if (T.isObject(f) && f.___id && f.___s) {
                return true;
            }
            if (T.isArray(f)) {
                i = true;
                each(f, function (r) {
                    if (!isIndexable(r)) {
                        i = false;
                        return TAFFY.EXIT;
                    }
                });
                return i;
            }
            return false;
        };
        runFilters = function (r, filter) {
            var match = true;
            each(filter, function (mf) {
                switch (T.typeOf(mf)) {
                case 'function':
                    if (!mf.apply(r)) {
                        match = false;
                        return TAFFY.EXIT;
                    }
                    break;
                case 'array':
                    match = mf.length === 1 ? runFilters(r, mf[0]) : mf.length === 2 ? runFilters(r, mf[0]) || runFilters(r, mf[1]) : mf.length === 3 ? runFilters(r, mf[0]) || runFilters(r, mf[1]) || runFilters(r, mf[2]) : mf.length === 4 ? runFilters(r, mf[0]) || runFilters(r, mf[1]) || runFilters(r, mf[2]) || runFilters(r, mf[3]) : false;
                    if (mf.length > 4) {
                        each(mf, function (f) {
                            if (runFilters(r, f)) {
                                match = true;
                            }
                        });
                    }
                    break;
                }
            });
            return match;
        };
        returnFilter = function (f) {
            var nf = [];
            if (T.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f)) {
                f = { ___id: f };
            }
            if (T.isArray(f)) {
                each(f, function (r) {
                    nf.push(returnFilter(r));
                });
                f = function () {
                    var that = this, match = false;
                    each(nf, function (f) {
                        if (runFilters(that, f)) {
                            match = true;
                        }
                    });
                    return match;
                };
                return f;
            }
            if (T.isObject(f)) {
                if (T.isObject(f) && f.___id && f.___s) {
                    f = { ___id: f.___id };
                }
                eachin(f, function (v, i) {
                    if (!T.isObject(v)) {
                        v = { 'is': v };
                    }
                    eachin(v, function (mtest, s) {
                        var c = [], looper;
                        looper = s === 'hasAll' ? function (mtest, func) {
                            func(mtest);
                        } : each;
                        looper(mtest, function (mtest) {
                            var su = true, f = false, matchFunc;
                            matchFunc = function () {
                                var mvalue = this[i], eqeq = '==', bangeq = '!=', eqeqeq = '===', lt = '<', gt = '>', lteq = '<=', gteq = '>=', bangeqeq = '!==', r;
                                ;
                                if (typeof mvalue === 'undefined') {
                                    return false;
                                }
                                if (s.indexOf('!') === 0 && s !== bangeq && s !== bangeqeq) {
                                    su = false;
                                    s = s.substring(1, s.length);
                                }
                                r = s === 'regex' ? mtest.test(mvalue) : s === 'lt' || s === lt ? mvalue < mtest : s === 'gt' || s === gt ? mvalue > mtest : s === 'lte' || s === lteq ? mvalue <= mtest : s === 'gte' || s === gteq ? mvalue >= mtest : s === 'left' ? mvalue.indexOf(mtest) === 0 : s === 'leftnocase' ? mvalue.toLowerCase().indexOf(mtest.toLowerCase()) === 0 : s === 'right' ? mvalue.substring(mvalue.length - mtest.length) === mtest : s === 'rightnocase' ? mvalue.toLowerCase().substring(mvalue.length - mtest.length) === mtest.toLowerCase() : s === 'like' ? mvalue.indexOf(mtest) >= 0 : s === 'likenocase' ? mvalue.toLowerCase().indexOf(mtest.toLowerCase()) >= 0 : s === eqeqeq || s === 'is' ? mvalue === mtest : s === eqeq ? mvalue == mtest : s === bangeqeq ? mvalue !== mtest : s === bangeq ? mvalue != mtest : s === 'isnocase' ? mvalue.toLowerCase ? mvalue.toLowerCase() === mtest.toLowerCase() : mvalue === mtest : s === 'has' ? T.has(mvalue, mtest) : s === 'hasall' ? T.hasAll(mvalue, mtest) : s === 'contains' ? TAFFY.isArray(mvalue) && mvalue.indexOf(mtest) > -1 : s.indexOf('is') === -1 && !TAFFY.isNull(mvalue) && !TAFFY.isUndefined(mvalue) && !TAFFY.isObject(mtest) && !TAFFY.isArray(mtest) ? mtest === mvalue[s] : T[s] && T.isFunction(T[s]) && s.indexOf('is') === 0 ? T[s](mvalue) === mtest : T[s] && T.isFunction(T[s]) ? T[s](mvalue, mtest) : false;
                                r = r && !su ? false : !r && !su ? true : r;
                                return r;
                            };
                            c.push(matchFunc);
                        });
                        if (c.length === 1) {
                            nf.push(c[0]);
                        } else {
                            nf.push(function () {
                                var that = this, match = false;
                                each(c, function (f) {
                                    if (f.apply(that)) {
                                        match = true;
                                    }
                                });
                                return match;
                            });
                        }
                    });
                });
                f = function () {
                    var that = this, match = true;
                    match = nf.length === 1 && !nf[0].apply(that) ? false : nf.length === 2 && (!nf[0].apply(that) || !nf[1].apply(that)) ? false : nf.length === 3 && (!nf[0].apply(that) || !nf[1].apply(that) || !nf[2].apply(that)) ? false : nf.length === 4 && (!nf[0].apply(that) || !nf[1].apply(that) || !nf[2].apply(that) || !nf[3].apply(that)) ? false : true;
                    if (nf.length > 4) {
                        each(nf, function (f) {
                            if (!runFilters(that, f)) {
                                match = false;
                            }
                        });
                    }
                    return match;
                };
                return f;
            }
            if (T.isFunction(f)) {
                return f;
            }
        };
        orderByCol = function (ar, o) {
            var sortFunc = function (a, b) {
                var r = 0;
                T.each(o, function (sd) {
                    var o, col, dir, c, d;
                    o = sd.split(' ');
                    col = o[0];
                    dir = o.length === 1 ? 'logical' : o[1];
                    if (dir === 'logical') {
                        c = numcharsplit(a[col]);
                        d = numcharsplit(b[col]);
                        T.each(c.length <= d.length ? c : d, function (x, i) {
                            if (c[i] < d[i]) {
                                r = -1;
                                return TAFFY.EXIT;
                            } else if (c[i] > d[i]) {
                                r = 1;
                                return TAFFY.EXIT;
                            }
                        });
                    } else if (dir === 'logicaldesc') {
                        c = numcharsplit(a[col]);
                        d = numcharsplit(b[col]);
                        T.each(c.length <= d.length ? c : d, function (x, i) {
                            if (c[i] > d[i]) {
                                r = -1;
                                return TAFFY.EXIT;
                            } else if (c[i] < d[i]) {
                                r = 1;
                                return TAFFY.EXIT;
                            }
                        });
                    } else if (dir === 'asec' && a[col] < b[col]) {
                        r = -1;
                        return T.EXIT;
                    } else if (dir === 'asec' && a[col] > b[col]) {
                        r = 1;
                        return T.EXIT;
                    } else if (dir === 'desc' && a[col] > b[col]) {
                        r = -1;
                        return T.EXIT;
                    } else if (dir === 'desc' && a[col] < b[col]) {
                        r = 1;
                        return T.EXIT;
                    }
                    if (r === 0 && dir === 'logical' && c.length < d.length) {
                        r = -1;
                    } else if (r === 0 && dir === 'logical' && c.length > d.length) {
                        r = 1;
                    } else if (r === 0 && dir === 'logicaldesc' && c.length > d.length) {
                        r = -1;
                    } else if (r === 0 && dir === 'logicaldesc' && c.length < d.length) {
                        r = 1;
                    }
                    if (r !== 0) {
                        return T.EXIT;
                    }
                });
                return r;
            };
            return ar && ar.push ? ar.sort(sortFunc) : ar;
        };
        (function () {
            var cache = {}, cachcounter = 0;
            numcharsplit = function (thing) {
                if (cachcounter > cmax) {
                    cache = {};
                    cachcounter = 0;
                }
                return cache['_' + thing] || function () {
                    var nthing = String(thing), na = [], rv = '_', rt = '', x, xx, c;
                    for (x = 0, xx = nthing.length; x < xx; x++) {
                        c = nthing.charCodeAt(x);
                        if (c >= 48 && c <= 57 || c === 46) {
                            if (rt !== 'n') {
                                rt = 'n';
                                na.push(rv.toLowerCase());
                                rv = '';
                            }
                            rv = rv + nthing.charAt(x);
                        } else {
                            if (rt !== 's') {
                                rt = 's';
                                na.push(parseFloat(rv));
                                rv = '';
                            }
                            rv = rv + nthing.charAt(x);
                        }
                    }
                    na.push(rt === 'n' ? parseFloat(rv) : rv.toLowerCase());
                    na.shift();
                    cache['_' + thing] = na;
                    cachcounter++;
                    return na;
                }();
            };
        }());
        run = function () {
            this.context({ results: this.getDBI().query(this.context()) });
        };
        API.extend('filter', function () {
            var nc = TAFFY.mergeObj(this.context(), { run: null }), nq = [];
            ;
            each(nc.q, function (v) {
                nq.push(v);
            });
            nc.q = nq;
            each(arguments, function (f) {
                nc.q.push(returnFilter(f));
                nc.filterRaw.push(f);
            });
            return this.getroot(nc);
        });
        API.extend('order', function (o) {
            o = o.split(',');
            var x = [], nc;
            each(o, function (r) {
                x.push(r.replace(/^\s*/, '').replace(/\s*$/, ''));
            });
            nc = TAFFY.mergeObj(this.context(), { sort: null });
            nc.order = x;
            return this.getroot(nc);
        });
        API.extend('limit', function (n) {
            var nc = TAFFY.mergeObj(this.context(), {}), limitedresults;
            ;
            nc.limit = n;
            if (nc.run && nc.sort) {
                limitedresults = [];
                each(nc.results, function (i, x) {
                    if (x + 1 > n) {
                        return TAFFY.EXIT;
                    }
                    limitedresults.push(i);
                });
                nc.results = limitedresults;
            }
            return this.getroot(nc);
        });
        API.extend('start', function (n) {
            var nc = TAFFY.mergeObj(this.context(), {}), limitedresults;
            ;
            nc.start = n;
            if (nc.run && nc.sort && !nc.limit) {
                limitedresults = [];
                each(nc.results, function (i, x) {
                    if (x + 1 > n) {
                        limitedresults.push(i);
                    }
                });
                nc.results = limitedresults;
            } else {
                nc = TAFFY.mergeObj(this.context(), {
                    run: null,
                    start: n
                });
            }
            return this.getroot(nc);
        });
        API.extend('update', function (arg0, arg1, arg2) {
            var runEvent = true, o = {}, args = arguments, that;
            if (TAFFY.isString(arg0) && (arguments.length === 2 || arguments.length === 3)) {
                o[arg0] = arg1;
                if (arguments.length === 3) {
                    runEvent = arg2;
                }
            } else {
                o = arg0;
                if (args.length === 2) {
                    runEvent = arg1;
                }
            }
            that = this;
            run.call(this);
            each(this.context().results, function (r) {
                var c = o;
                if (TAFFY.isFunction(c)) {
                    c = c.apply(TAFFY.mergeObj(r, {}));
                } else {
                    if (T.isFunction(c)) {
                        c = c(TAFFY.mergeObj(r, {}));
                    }
                }
                if (TAFFY.isObject(c)) {
                    that.getDBI().update(r.___id, c, runEvent);
                }
            });
            if (this.context().results.length) {
                this.context({ run: null });
            }
            return this;
        });
        API.extend('remove', function (runEvent) {
            var that = this, c = 0;
            run.call(this);
            each(this.context().results, function (r) {
                that.getDBI().remove(r.___id);
                c++;
            });
            if (this.context().results.length) {
                this.context({ run: null });
                that.getDBI().removeCommit(runEvent);
            }
            return c;
        });
        API.extend('count', function () {
            run.call(this);
            return this.context().results.length;
        });
        API.extend('callback', function (f, delay) {
            if (f) {
                var that = this;
                setTimeout(function () {
                    run.call(that);
                    f.call(that.getroot(that.context()));
                }, delay || 0);
            }
            return null;
        });
        API.extend('get', function () {
            run.call(this);
            return this.context().results;
        });
        API.extend('stringify', function () {
            return JSON.stringify(this.get());
        });
        API.extend('first', function () {
            run.call(this);
            return this.context().results[0] || false;
        });
        API.extend('last', function () {
            run.call(this);
            return this.context().results[this.context().results.length - 1] || false;
        });
        API.extend('sum', function () {
            var total = 0, that = this;
            run.call(that);
            each(arguments, function (c) {
                each(that.context().results, function (r) {
                    total = total + (r[c] || 0);
                });
            });
            return total;
        });
        API.extend('min', function (c) {
            var lowest = null;
            run.call(this);
            each(this.context().results, function (r) {
                if (lowest === null || r[c] < lowest) {
                    lowest = r[c];
                }
            });
            return lowest;
        });
        (function () {
            var innerJoinFunction = function () {
                    var fnCompareList, fnCombineRow, fnMain;
                    fnCompareList = function (left_row, right_row, arg_list) {
                        var data_lt, data_rt, op_code, error;
                        if (arg_list.length === 2) {
                            data_lt = left_row[arg_list[0]];
                            op_code = '===';
                            data_rt = right_row[arg_list[1]];
                        } else {
                            data_lt = left_row[arg_list[0]];
                            op_code = arg_list[1];
                            data_rt = right_row[arg_list[2]];
                        }
                        switch (op_code) {
                        case '===':
                            return data_lt === data_rt;
                        case '!==':
                            return data_lt !== data_rt;
                        case '<':
                            return data_lt < data_rt;
                        case '>':
                            return data_lt > data_rt;
                        case '<=':
                            return data_lt <= data_rt;
                        case '>=':
                            return data_lt >= data_rt;
                        case '==':
                            return data_lt == data_rt;
                        case '!=':
                            return data_lt != data_rt;
                        default:
                            throw String(op_code) + ' is not supported';
                        }
                    };
                    fnCombineRow = function (left_row, right_row) {
                        var out_map = {}, i, prefix;
                        for (i in left_row) {
                            if (left_row.hasOwnProperty(i)) {
                                out_map[i] = left_row[i];
                            }
                        }
                        for (i in right_row) {
                            if (right_row.hasOwnProperty(i) && i !== '___id' && i !== '___s') {
                                prefix = !TAFFY.isUndefined(out_map[i]) ? 'right_' : '';
                                out_map[prefix + String(i)] = right_row[i];
                            }
                        }
                        return out_map;
                    };
                    fnMain = function (table) {
                        var right_table, i, arg_list = arguments, arg_length = arg_list.length, result_list = [];
                        ;
                        if (typeof table.filter !== 'function') {
                            if (table.TAFFY) {
                                right_table = table();
                            } else {
                                throw 'TAFFY DB or result not supplied';
                            }
                        } else {
                            right_table = table;
                        }
                        this.context({ results: this.getDBI().query(this.context()) });
                        TAFFY.each(this.context().results, function (left_row) {
                            right_table.each(function (right_row) {
                                var arg_data, is_ok = true;
                                CONDITION:
                                    for (i = 1; i < arg_length; i++) {
                                        arg_data = arg_list[i];
                                        if (typeof arg_data === 'function') {
                                            is_ok = arg_data(left_row, right_row);
                                        } else if (typeof arg_data === 'object' && arg_data.length) {
                                            is_ok = fnCompareList(left_row, right_row, arg_data);
                                        } else {
                                            is_ok = false;
                                        }
                                        if (!is_ok) {
                                            break CONDITION;
                                        }
                                    }
                                if (is_ok) {
                                    result_list.push(fnCombineRow(left_row, right_row));
                                }
                            });
                        });
                        return TAFFY(result_list)();
                    };
                    return fnMain;
                }();
            API.extend('join', innerJoinFunction);
        }());
        API.extend('max', function (c) {
            var highest = null;
            run.call(this);
            each(this.context().results, function (r) {
                if (highest === null || r[c] > highest) {
                    highest = r[c];
                }
            });
            return highest;
        });
        API.extend('select', function () {
            var ra = [], args = arguments;
            run.call(this);
            if (arguments.length === 1) {
                each(this.context().results, function (r) {
                    ra.push(r[args[0]]);
                });
            } else {
                each(this.context().results, function (r) {
                    var row = [];
                    each(args, function (c) {
                        row.push(r[c]);
                    });
                    ra.push(row);
                });
            }
            return ra;
        });
        API.extend('distinct', function () {
            var ra = [], args = arguments;
            run.call(this);
            if (arguments.length === 1) {
                each(this.context().results, function (r) {
                    var v = r[args[0]], dup = false;
                    each(ra, function (d) {
                        if (v === d) {
                            dup = true;
                            return TAFFY.EXIT;
                        }
                    });
                    if (!dup) {
                        ra.push(v);
                    }
                });
            } else {
                each(this.context().results, function (r) {
                    var row = [], dup = false;
                    each(args, function (c) {
                        row.push(r[c]);
                    });
                    each(ra, function (d) {
                        var ldup = true;
                        each(args, function (c, i) {
                            if (row[i] !== d[i]) {
                                ldup = false;
                                return TAFFY.EXIT;
                            }
                        });
                        if (ldup) {
                            dup = true;
                            return TAFFY.EXIT;
                        }
                    });
                    if (!dup) {
                        ra.push(row);
                    }
                });
            }
            return ra;
        });
        API.extend('supplant', function (template, returnarray) {
            var ra = [];
            run.call(this);
            each(this.context().results, function (r) {
                ra.push(template.replace(/\{([^\{\}]*)\}/g, function (a, b) {
                    var v = r[b];
                    return typeof v === 'string' || typeof v === 'number' ? v : a;
                }));
            });
            return !returnarray ? ra.join('') : ra;
        });
        API.extend('each', function (m) {
            run.call(this);
            each(this.context().results, m);
            return this;
        });
        API.extend('map', function (m) {
            var ra = [];
            run.call(this);
            each(this.context().results, function (r) {
                ra.push(m(r));
            });
            return ra;
        });
        T = function (d) {
            var TOb = [], ID = {}, RC = 1, settings = {
                    template: false,
                    onInsert: false,
                    onUpdate: false,
                    onRemove: false,
                    onDBChange: false,
                    storageName: false,
                    forcePropertyCase: null,
                    cacheSize: 100,
                    name: ''
                }, dm = new Date(), CacheCount = 0, CacheClear = 0, Cache = {}, DBI, runIndexes, root;
            ;
            runIndexes = function (indexes) {
                var records = [], UniqueEnforce = false;
                if (indexes.length === 0) {
                    return TOb;
                }
                each(indexes, function (f) {
                    if (T.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f) && TOb[ID[f]]) {
                        records.push(TOb[ID[f]]);
                        UniqueEnforce = true;
                    }
                    if (T.isObject(f) && f.___id && f.___s && TOb[ID[f.___id]]) {
                        records.push(TOb[ID[f.___id]]);
                        UniqueEnforce = true;
                    }
                    if (T.isArray(f)) {
                        each(f, function (r) {
                            each(runIndexes(r), function (rr) {
                                records.push(rr);
                            });
                        });
                    }
                });
                if (UniqueEnforce && records.length > 1) {
                    records = [];
                }
                return records;
            };
            DBI = {
                dm: function (nd) {
                    if (nd) {
                        dm = nd;
                        Cache = {};
                        CacheCount = 0;
                        CacheClear = 0;
                    }
                    if (settings.onDBChange) {
                        setTimeout(function () {
                            settings.onDBChange.call(TOb);
                        }, 0);
                    }
                    if (settings.storageName) {
                        setTimeout(function () {
                            localStorage.setItem('taffy_' + settings.storageName, JSON.stringify(TOb));
                        });
                    }
                    return dm;
                },
                insert: function (i, runEvent) {
                    var columns = [], records = [], input = protectJSON(i);
                    ;
                    each(input, function (v, i) {
                        var nv, o;
                        if (T.isArray(v) && i === 0) {
                            each(v, function (av) {
                                columns.push(settings.forcePropertyCase === 'lower' ? av.toLowerCase() : settings.forcePropertyCase === 'upper' ? av.toUpperCase() : av);
                            });
                            return true;
                        } else if (T.isArray(v)) {
                            nv = {};
                            each(v, function (av, ai) {
                                nv[columns[ai]] = av;
                            });
                            v = nv;
                        } else if (T.isObject(v) && settings.forcePropertyCase) {
                            o = {};
                            eachin(v, function (av, ai) {
                                o[settings.forcePropertyCase === 'lower' ? ai.toLowerCase() : settings.forcePropertyCase === 'upper' ? ai.toUpperCase() : ai] = v[ai];
                            });
                            v = o;
                        }
                        RC++;
                        v.___id = 'T' + String(idpad + TC).slice(-6) + 'R' + String(idpad + RC).slice(-6);
                        v.___s = true;
                        records.push(v.___id);
                        if (settings.template) {
                            v = T.mergeObj(settings.template, v);
                        }
                        TOb.push(v);
                        ID[v.___id] = TOb.length - 1;
                        if (settings.onInsert && (runEvent || TAFFY.isUndefined(runEvent))) {
                            settings.onInsert.call(v);
                        }
                        DBI.dm(new Date());
                    });
                    return root(records);
                },
                sort: function (o) {
                    TOb = orderByCol(TOb, o.split(','));
                    ID = {};
                    each(TOb, function (r, i) {
                        ID[r.___id] = i;
                    });
                    DBI.dm(new Date());
                    return true;
                },
                update: function (id, changes, runEvent) {
                    var nc = {}, or, nr, tc, hasChange;
                    if (settings.forcePropertyCase) {
                        eachin(changes, function (v, p) {
                            nc[settings.forcePropertyCase === 'lower' ? p.toLowerCase() : settings.forcePropertyCase === 'upper' ? p.toUpperCase() : p] = v;
                        });
                        changes = nc;
                    }
                    or = TOb[ID[id]];
                    nr = T.mergeObj(or, changes);
                    tc = {};
                    hasChange = false;
                    eachin(nr, function (v, i) {
                        if (TAFFY.isUndefined(or[i]) || or[i] !== v) {
                            tc[i] = v;
                            hasChange = true;
                        }
                    });
                    if (hasChange) {
                        if (settings.onUpdate && (runEvent || TAFFY.isUndefined(runEvent))) {
                            settings.onUpdate.call(nr, TOb[ID[id]], tc);
                        }
                        TOb[ID[id]] = nr;
                        DBI.dm(new Date());
                    }
                },
                remove: function (id) {
                    TOb[ID[id]].___s = false;
                },
                removeCommit: function (runEvent) {
                    var x;
                    for (x = TOb.length - 1; x > -1; x--) {
                        if (!TOb[x].___s) {
                            if (settings.onRemove && (runEvent || TAFFY.isUndefined(runEvent))) {
                                settings.onRemove.call(TOb[x]);
                            }
                            ID[TOb[x].___id] = undefined;
                            TOb.splice(x, 1);
                        }
                    }
                    ID = {};
                    each(TOb, function (r, i) {
                        ID[r.___id] = i;
                    });
                    DBI.dm(new Date());
                },
                query: function (context) {
                    var returnq, cid, results, indexed, limitq, ni;
                    if (settings.cacheSize) {
                        cid = '';
                        each(context.filterRaw, function (r) {
                            if (T.isFunction(r)) {
                                cid = 'nocache';
                                return TAFFY.EXIT;
                            }
                        });
                        if (cid === '') {
                            cid = makeCid(T.mergeObj(context, {
                                q: false,
                                run: false,
                                sort: false
                            }));
                        }
                    }
                    if (!context.results || !context.run || context.run && DBI.dm() > context.run) {
                        results = [];
                        if (settings.cacheSize && Cache[cid]) {
                            Cache[cid].i = CacheCount++;
                            return Cache[cid].results;
                        } else {
                            if (context.q.length === 0 && context.index.length === 0) {
                                each(TOb, function (r) {
                                    results.push(r);
                                });
                                returnq = results;
                            } else {
                                indexed = runIndexes(context.index);
                                each(indexed, function (r) {
                                    if (context.q.length === 0 || runFilters(r, context.q)) {
                                        results.push(r);
                                    }
                                });
                                returnq = results;
                            }
                        }
                    } else {
                        returnq = context.results;
                    }
                    if (context.order.length > 0 && (!context.run || !context.sort)) {
                        returnq = orderByCol(returnq, context.order);
                    }
                    if (returnq.length && (context.limit && context.limit < returnq.length || context.start)) {
                        limitq = [];
                        each(returnq, function (r, i) {
                            if (!context.start || context.start && i + 1 >= context.start) {
                                if (context.limit) {
                                    ni = context.start ? i + 1 - context.start : i;
                                    if (ni < context.limit) {
                                        limitq.push(r);
                                    } else if (ni > context.limit) {
                                        return TAFFY.EXIT;
                                    }
                                } else {
                                    limitq.push(r);
                                }
                            }
                        });
                        returnq = limitq;
                    }
                    if (settings.cacheSize && cid !== 'nocache') {
                        CacheClear++;
                        setTimeout(function () {
                            var bCounter, nc;
                            if (CacheClear >= settings.cacheSize * 2) {
                                CacheClear = 0;
                                bCounter = CacheCount - settings.cacheSize;
                                nc = {};
                                eachin(function (r, k) {
                                    if (r.i >= bCounter) {
                                        nc[k] = r;
                                    }
                                });
                                Cache = nc;
                            }
                        }, 0);
                        Cache[cid] = {
                            i: CacheCount++,
                            results: returnq
                        };
                    }
                    return returnq;
                }
            };
            root = function () {
                var iAPI, context;
                iAPI = TAFFY.mergeObj(TAFFY.mergeObj(API, { insert: undefined }), {
                    getDBI: function () {
                        return DBI;
                    },
                    getroot: function (c) {
                        return root.call(c);
                    },
                    context: function (n) {
                        if (n) {
                            context = TAFFY.mergeObj(context, n.hasOwnProperty('results') ? TAFFY.mergeObj(n, {
                                run: new Date(),
                                sort: new Date()
                            }) : n);
                        }
                        return context;
                    },
                    extend: undefined
                });
                context = this && this.q ? this : {
                    limit: false,
                    start: false,
                    q: [],
                    filterRaw: [],
                    index: [],
                    order: [],
                    results: false,
                    run: null,
                    sort: null,
                    settings: settings
                };
                each(arguments, function (f) {
                    if (isIndexable(f)) {
                        context.index.push(f);
                    } else {
                        context.q.push(returnFilter(f));
                    }
                    context.filterRaw.push(f);
                });
                return iAPI;
            };
            TC++;
            if (d) {
                DBI.insert(d);
            }
            root.insert = DBI.insert;
            root.merge = function (i, key, runEvent) {
                var search = {}, finalSearch = [], obj = {};
                ;
                runEvent = runEvent || false;
                key = key || 'id';
                each(i, function (o) {
                    var existingObject;
                    search[key] = o[key];
                    finalSearch.push(o[key]);
                    existingObject = root(search).first();
                    if (existingObject) {
                        DBI.update(existingObject.___id, o, runEvent);
                    } else {
                        DBI.insert(o, runEvent);
                    }
                });
                obj[key] = finalSearch;
                return root(obj);
            };
            root.TAFFY = true;
            root.sort = DBI.sort;
            root.settings = function (n) {
                if (n) {
                    settings = TAFFY.mergeObj(settings, n);
                    if (n.template) {
                        root().update(n.template);
                    }
                }
                return settings;
            };
            root.store = function (n) {
                var r = false, i;
                if (localStorage) {
                    if (n) {
                        i = localStorage.getItem('taffy_' + n);
                        if (i && i.length > 0) {
                            root.insert(i);
                            r = true;
                        }
                        if (TOb.length > 0) {
                            setTimeout(function () {
                                localStorage.setItem('taffy_' + settings.storageName, JSON.stringify(TOb));
                            });
                        }
                    }
                    root.settings({ storageName: n });
                }
                return root;
            };
            return root;
        };
        TAFFY = T;
        T.each = each;
        T.eachin = eachin;
        T.extend = API.extend;
        TAFFY.EXIT = 'TAFFYEXIT';
        TAFFY.mergeObj = function (ob1, ob2) {
            var c = {};
            eachin(ob1, function (v, n) {
                c[n] = ob1[n];
            });
            eachin(ob2, function (v, n) {
                c[n] = ob2[n];
            });
            return c;
        };
        TAFFY.has = function (var1, var2) {
            var re = false, n;
            if (var1.TAFFY) {
                re = var1(var2);
                if (re.length > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                switch (T.typeOf(var1)) {
                case 'object':
                    if (T.isObject(var2)) {
                        eachin(var2, function (v, n) {
                            if (re === true && !T.isUndefined(var1[n]) && var1.hasOwnProperty(n)) {
                                re = T.has(var1[n], var2[n]);
                            } else {
                                re = false;
                                return TAFFY.EXIT;
                            }
                        });
                    } else if (T.isArray(var2)) {
                        each(var2, function (v, n) {
                            re = T.has(var1, var2[n]);
                            if (re) {
                                return TAFFY.EXIT;
                            }
                        });
                    } else if (T.isString(var2)) {
                        if (!TAFFY.isUndefined(var1[var2])) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    return re;
                case 'array':
                    if (T.isObject(var2)) {
                        each(var1, function (v, i) {
                            re = T.has(var1[i], var2);
                            if (re === true) {
                                return TAFFY.EXIT;
                            }
                        });
                    } else if (T.isArray(var2)) {
                        each(var2, function (v2, i2) {
                            each(var1, function (v1, i1) {
                                re = T.has(var1[i1], var2[i2]);
                                if (re === true) {
                                    return TAFFY.EXIT;
                                }
                            });
                            if (re === true) {
                                return TAFFY.EXIT;
                            }
                        });
                    } else if (T.isString(var2) || T.isNumber(var2)) {
                        re = false;
                        for (n = 0; n < var1.length; n++) {
                            re = T.has(var1[n], var2);
                            if (re) {
                                return true;
                            }
                        }
                    }
                    return re;
                case 'string':
                    if (T.isString(var2) && var2 === var1) {
                        return true;
                    }
                    break;
                default:
                    if (T.typeOf(var1) === T.typeOf(var2) && var1 === var2) {
                        return true;
                    }
                    break;
                }
            }
            return false;
        };
        TAFFY.hasAll = function (var1, var2) {
            var T = TAFFY, ar;
            if (T.isArray(var2)) {
                ar = true;
                each(var2, function (v) {
                    ar = T.has(var1, v);
                    if (ar === false) {
                        return TAFFY.EXIT;
                    }
                });
                return ar;
            } else {
                return T.has(var1, var2);
            }
        };
        TAFFY.typeOf = function (v) {
            var s = typeof v;
            if (s === 'object') {
                if (v) {
                    if (typeof v.length === 'number' && !v.propertyIsEnumerable('length')) {
                        s = 'array';
                    }
                } else {
                    s = 'null';
                }
            }
            return s;
        };
        TAFFY.getObjectKeys = function (ob) {
            var kA = [];
            eachin(ob, function (n, h) {
                kA.push(h);
            });
            kA.sort();
            return kA;
        };
        TAFFY.isSameArray = function (ar1, ar2) {
            return TAFFY.isArray(ar1) && TAFFY.isArray(ar2) && ar1.join(',') === ar2.join(',') ? true : false;
        };
        TAFFY.isSameObject = function (ob1, ob2) {
            var T = TAFFY, rv = true;
            if (T.isObject(ob1) && T.isObject(ob2)) {
                if (T.isSameArray(T.getObjectKeys(ob1), T.getObjectKeys(ob2))) {
                    eachin(ob1, function (v, n) {
                        if (!(T.isObject(ob1[n]) && T.isObject(ob2[n]) && T.isSameObject(ob1[n], ob2[n]) || T.isArray(ob1[n]) && T.isArray(ob2[n]) && T.isSameArray(ob1[n], ob2[n]) || ob1[n] === ob2[n])) {
                            rv = false;
                            return TAFFY.EXIT;
                        }
                    });
                } else {
                    rv = false;
                }
            } else {
                rv = false;
            }
            return rv;
        };
        typeList = [
            'String',
            'Number',
            'Object',
            'Array',
            'Boolean',
            'Null',
            'Function',
            'Undefined'
        ];
        makeTest = function (thisKey) {
            return function (data) {
                return TAFFY.typeOf(data) === thisKey.toLowerCase() ? true : false;
            };
        };
        for (idx = 0; idx < typeList.length; idx++) {
            typeKey = typeList[idx];
            TAFFY['is' + typeKey] = makeTest(typeKey);
        }
    }
}());
if (typeof exports === 'object') {
    exports.taffy = TAFFY;
}
});
require.define('45', function(module, exports, __dirname, __filename, undefined){
;
(function () {
    var block = {
            newline: /^\n+/,
            code: /^( {4}[^\n]+\n*)+/,
            fences: noop,
            hr: /^( *[-*_]){3,} *(?:\n+|$)/,
            heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
            nptable: noop,
            lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
            blockquote: /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
            list: /^( *)(bull) [\s\S]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
            html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
            def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
            table: noop,
            paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
            text: /^[^\n]+/
        };
    block.bullet = /(?:[*+-]|\d+\.)/;
    block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
    block.item = replace(block.item, 'gm')(/bull/g, block.bullet)();
    block.list = replace(block.list)(/bull/g, block.bullet)('hr', /\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)();
    block._tag = '(?!(?:' + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code' + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo' + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|@)\\b';
    block.html = replace(block.html)('comment', /<!--[\s\S]*?-->/)('closed', /<(tag)[\s\S]+?<\/\1>/)('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, block._tag)();
    block.paragraph = replace(block.paragraph)('hr', block.hr)('heading', block.heading)('lheading', block.lheading)('blockquote', block.blockquote)('tag', '<' + block._tag)('def', block.def)();
    block.normal = merge({}, block);
    block.gfm = merge({}, block.normal, {
        fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
        paragraph: /^/
    });
    block.gfm.paragraph = replace(block.paragraph)('(?!', '(?!' + block.gfm.fences.source.replace('\\1', '\\2') + '|' + block.list.source.replace('\\1', '\\3') + '|')();
    block.tables = merge({}, block.gfm, {
        nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
        table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
    });
    function Lexer(options) {
        this.tokens = [];
        this.tokens.links = {};
        this.options = options || marked.defaults;
        this.rules = block.normal;
        if (this.options.gfm) {
            if (this.options.tables) {
                this.rules = block.tables;
            } else {
                this.rules = block.gfm;
            }
        }
    }
    Lexer.rules = block;
    Lexer.lex = function (src, options) {
        var lexer = new Lexer(options);
        return lexer.lex(src);
    };
    Lexer.prototype.lex = function (src) {
        src = src.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    ').replace(/\u00a0/g, ' ').replace(/\u2424/g, '\n');
        return this.token(src, true);
    };
    Lexer.prototype.token = function (src, top) {
        var src = src.replace(/^ +$/gm, ''), next, loose, cap, bull, b, item, space, i, l;
        while (src) {
            if (cap = this.rules.newline.exec(src)) {
                src = src.substring(cap[0].length);
                if (cap[0].length > 1) {
                    this.tokens.push({ type: 'space' });
                }
            }
            if (cap = this.rules.code.exec(src)) {
                src = src.substring(cap[0].length);
                cap = cap[0].replace(/^ {4}/gm, '');
                this.tokens.push({
                    type: 'code',
                    text: !this.options.pedantic ? cap.replace(/\n+$/, '') : cap
                });
                continue;
            }
            if (cap = this.rules.fences.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'code',
                    lang: cap[2],
                    text: cap[3]
                });
                continue;
            }
            if (cap = this.rules.heading.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'heading',
                    depth: cap[1].length,
                    text: cap[2]
                });
                continue;
            }
            if (top && (cap = this.rules.nptable.exec(src))) {
                src = src.substring(cap[0].length);
                item = {
                    type: 'table',
                    header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                    align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                    cells: cap[3].replace(/\n$/, '').split('\n')
                };
                for (i = 0; i < item.align.length; i++) {
                    if (/^ *-+: *$/.test(item.align[i])) {
                        item.align[i] = 'right';
                    } else if (/^ *:-+: *$/.test(item.align[i])) {
                        item.align[i] = 'center';
                    } else if (/^ *:-+ *$/.test(item.align[i])) {
                        item.align[i] = 'left';
                    } else {
                        item.align[i] = null;
                    }
                }
                for (i = 0; i < item.cells.length; i++) {
                    item.cells[i] = item.cells[i].split(/ *\| */);
                }
                this.tokens.push(item);
                continue;
            }
            if (cap = this.rules.lheading.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'heading',
                    depth: cap[2] === '=' ? 1 : 2,
                    text: cap[1]
                });
                continue;
            }
            if (cap = this.rules.hr.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({ type: 'hr' });
                continue;
            }
            if (cap = this.rules.blockquote.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({ type: 'blockquote_start' });
                cap = cap[0].replace(/^ *> ?/gm, '');
                this.token(cap, top);
                this.tokens.push({ type: 'blockquote_end' });
                continue;
            }
            if (cap = this.rules.list.exec(src)) {
                src = src.substring(cap[0].length);
                bull = cap[2];
                this.tokens.push({
                    type: 'list_start',
                    ordered: bull.length > 1
                });
                cap = cap[0].match(this.rules.item);
                next = false;
                l = cap.length;
                i = 0;
                for (; i < l; i++) {
                    item = cap[i];
                    space = item.length;
                    item = item.replace(/^ *([*+-]|\d+\.) +/, '');
                    if (~item.indexOf('\n ')) {
                        space -= item.length;
                        item = !this.options.pedantic ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '') : item.replace(/^ {1,4}/gm, '');
                    }
                    if (this.options.smartLists && i !== l - 1) {
                        b = block.bullet.exec(cap[i + 1])[0];
                        if (bull !== b && !(bull.length > 1 && b.length > 1)) {
                            src = cap.slice(i + 1).join('\n') + src;
                            i = l - 1;
                        }
                    }
                    loose = next || /\n\n(?!\s*$)/.test(item);
                    if (i !== l - 1) {
                        next = item.charAt(item.length - 1) === '\n';
                        if (!loose)
                            loose = next;
                    }
                    this.tokens.push({ type: loose ? 'loose_item_start' : 'list_item_start' });
                    this.token(item, false);
                    this.tokens.push({ type: 'list_item_end' });
                }
                this.tokens.push({ type: 'list_end' });
                continue;
            }
            if (cap = this.rules.html.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: this.options.sanitize ? 'paragraph' : 'html',
                    pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
                    text: cap[0]
                });
                continue;
            }
            if (top && (cap = this.rules.def.exec(src))) {
                src = src.substring(cap[0].length);
                this.tokens.links[cap[1].toLowerCase()] = {
                    href: cap[2],
                    title: cap[3]
                };
                continue;
            }
            if (top && (cap = this.rules.table.exec(src))) {
                src = src.substring(cap[0].length);
                item = {
                    type: 'table',
                    header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                    align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                    cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
                };
                for (i = 0; i < item.align.length; i++) {
                    if (/^ *-+: *$/.test(item.align[i])) {
                        item.align[i] = 'right';
                    } else if (/^ *:-+: *$/.test(item.align[i])) {
                        item.align[i] = 'center';
                    } else if (/^ *:-+ *$/.test(item.align[i])) {
                        item.align[i] = 'left';
                    } else {
                        item.align[i] = null;
                    }
                }
                for (i = 0; i < item.cells.length; i++) {
                    item.cells[i] = item.cells[i].replace(/^ *\| *| *\| *$/g, '').split(/ *\| */);
                }
                this.tokens.push(item);
                continue;
            }
            if (top && (cap = this.rules.paragraph.exec(src))) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'paragraph',
                    text: cap[1].charAt(cap[1].length - 1) === '\n' ? cap[1].slice(0, -1) : cap[1]
                });
                continue;
            }
            if (cap = this.rules.text.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'text',
                    text: cap[0]
                });
                continue;
            }
            if (src) {
                throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
            }
        }
        return this.tokens;
    };
    var inline = {
            escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
            autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
            url: noop,
            tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
            link: /^!?\[(inside)\]\(href\)/,
            reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
            nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
            strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
            em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
            code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
            br: /^ {2,}\n(?!\s*$)/,
            del: noop,
            text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
        };
    inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
    inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;
    inline.link = replace(inline.link)('inside', inline._inside)('href', inline._href)();
    inline.reflink = replace(inline.reflink)('inside', inline._inside)();
    inline.normal = merge({}, inline);
    inline.pedantic = merge({}, inline.normal, {
        strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
        em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
    });
    inline.gfm = merge({}, inline.normal, {
        escape: replace(inline.escape)('])', '~|])')(),
        url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
        del: /^~~(?=\S)([\s\S]*?\S)~~/,
        text: replace(inline.text)(']|', '~]|')('|', '|https?://|')()
    });
    inline.breaks = merge({}, inline.gfm, {
        br: replace(inline.br)('{2,}', '*')(),
        text: replace(inline.gfm.text)('{2,}', '*')()
    });
    function InlineLexer(links, options) {
        this.options = options || marked.defaults;
        this.links = links;
        this.rules = inline.normal;
        this.renderer = this.options.renderer || new Renderer();
        if (!this.links) {
            throw new Error('Tokens array requires a `links` property.');
        }
        if (this.options.gfm) {
            if (this.options.breaks) {
                this.rules = inline.breaks;
            } else {
                this.rules = inline.gfm;
            }
        } else if (this.options.pedantic) {
            this.rules = inline.pedantic;
        }
    }
    InlineLexer.rules = inline;
    InlineLexer.output = function (src, links, options) {
        var inline = new InlineLexer(links, options);
        return inline.output(src);
    };
    InlineLexer.prototype.output = function (src) {
        var out = '', link, text, href, cap;
        while (src) {
            if (cap = this.rules.escape.exec(src)) {
                src = src.substring(cap[0].length);
                out += cap[1];
                continue;
            }
            if (cap = this.rules.autolink.exec(src)) {
                src = src.substring(cap[0].length);
                if (cap[2] === '@') {
                    text = cap[1].charAt(6) === ':' ? this.mangle(cap[1].substring(7)) : this.mangle(cap[1]);
                    href = this.mangle('mailto:') + text;
                } else {
                    text = escape(cap[1]);
                    href = text;
                }
                out += this.renderer.link(href, null, text);
                continue;
            }
            if (cap = this.rules.url.exec(src)) {
                src = src.substring(cap[0].length);
                text = escape(cap[1]);
                href = text;
                out += this.renderer.link(href, null, text);
                continue;
            }
            if (cap = this.rules.tag.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.options.sanitize ? escape(cap[0]) : cap[0];
                continue;
            }
            if (cap = this.rules.link.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.outputLink(cap, {
                    href: cap[2],
                    title: cap[3]
                });
                continue;
            }
            if ((cap = this.rules.reflink.exec(src)) || (cap = this.rules.nolink.exec(src))) {
                src = src.substring(cap[0].length);
                link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
                link = this.links[link.toLowerCase()];
                if (!link || !link.href) {
                    out += cap[0].charAt(0);
                    src = cap[0].substring(1) + src;
                    continue;
                }
                out += this.outputLink(cap, link);
                continue;
            }
            if (cap = this.rules.strong.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.strong(this.output(cap[2] || cap[1]));
                continue;
            }
            if (cap = this.rules.em.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.em(this.output(cap[2] || cap[1]));
                continue;
            }
            if (cap = this.rules.code.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.codespan(escape(cap[2], true));
                continue;
            }
            if (cap = this.rules.br.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.br();
                continue;
            }
            if (cap = this.rules.del.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.del(this.output(cap[1]));
                continue;
            }
            if (cap = this.rules.text.exec(src)) {
                src = src.substring(cap[0].length);
                out += escape(this.smartypants(cap[0]));
                continue;
            }
            if (src) {
                throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
            }
        }
        return out;
    };
    InlineLexer.prototype.outputLink = function (cap, link) {
        var href = escape(link.href), title = link.title ? escape(link.title) : null;
        return cap[0].charAt(0) !== '!' ? this.renderer.link(href, title, this.output(cap[1])) : this.renderer.image(href, title, escape(cap[1]));
    };
    InlineLexer.prototype.smartypants = function (text) {
        if (!this.options.smartypants)
            return text;
        return text.replace(/--/g, '\u2014').replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018').replace(/'/g, '\u2019').replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c').replace(/"/g, '\u201d').replace(/\.{3}/g, '\u2026');
    };
    InlineLexer.prototype.mangle = function (text) {
        var out = '', l = text.length, i = 0, ch;
        for (; i < l; i++) {
            ch = text.charCodeAt(i);
            if (Math.random() > 0.5) {
                ch = 'x' + ch.toString(16);
            }
            out += '&#' + ch + ';';
        }
        return out;
    };
    function Renderer() {
    }
    Renderer.prototype.code = function (code, lang, escaped, options) {
        options = options || {};
        if (options.highlight) {
            var out = options.highlight(code, lang);
            if (out != null && out !== code) {
                escaped = true;
                code = out;
            }
        }
        if (!lang) {
            return '<pre><code>' + (escaped ? code : escape(code, true)) + '\n</code></pre>';
        }
        return '<pre><code class="' + options.langPrefix + lang + '">' + (escaped ? code : escape(code)) + '\n</code></pre>\n';
    };
    Renderer.prototype.blockquote = function (quote) {
        return '<blockquote>\n' + quote + '</blockquote>\n';
    };
    Renderer.prototype.html = function (html) {
        return html;
    };
    Renderer.prototype.heading = function (text, level, raw, options) {
        return '<h' + level + ' id="' + options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-') + '">' + text + '</h' + level + '>\n';
    };
    Renderer.prototype.hr = function () {
        return '<hr>\n';
    };
    Renderer.prototype.list = function (body, ordered) {
        var type = ordered ? 'ol' : 'ul';
        return '<' + type + '>\n' + body + '</' + type + '>\n';
    };
    Renderer.prototype.listitem = function (text) {
        return '<li>' + text + '</li>\n';
    };
    Renderer.prototype.paragraph = function (text) {
        return '<p>' + text + '</p>\n';
    };
    Renderer.prototype.table = function (header, body) {
        return '<table>\n' + '<thead>\n' + header + '</thead>\n' + '<tbody>\n' + body + '</tbody>\n' + '</table>\n';
    };
    Renderer.prototype.tablerow = function (content) {
        return '<tr>\n' + content + '</tr>\n';
    };
    Renderer.prototype.tablecell = function (content, flags) {
        var type = flags.header ? 'th' : 'td';
        var tag = flags.align ? '<' + type + ' style="text-align:' + flags.align + '">' : '<' + type + '>';
        return tag + content + '</' + type + '>\n';
    };
    Renderer.prototype.strong = function (text) {
        return '<strong>' + text + '</strong>';
    };
    Renderer.prototype.em = function (text) {
        return '<em>' + text + '</em>';
    };
    Renderer.prototype.codespan = function (text) {
        return '<code>' + text + '</code>';
    };
    Renderer.prototype.br = function () {
        return '<br>';
    };
    Renderer.prototype.del = function (text) {
        return '<del>' + text + '</del>';
    };
    Renderer.prototype.link = function (href, title, text) {
        var out = '<a href="' + href + '"';
        if (title) {
            out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
    };
    Renderer.prototype.image = function (href, title, text) {
        var out = '<img src="' + href + '" alt="' + text + '"';
        if (title) {
            out += ' title="' + title + '"';
        }
        out += '>';
        return out;
    };
    function Parser(options) {
        this.tokens = [];
        this.token = null;
        this.options = options || marked.defaults;
        this.options.renderer = this.options.renderer || new Renderer();
        this.renderer = this.options.renderer;
    }
    Parser.parse = function (src, options, renderer) {
        var parser = new Parser(options, renderer);
        return parser.parse(src);
    };
    Parser.prototype.parse = function (src) {
        this.inline = new InlineLexer(src.links, this.options, this.renderer);
        this.tokens = src.reverse();
        var out = '';
        while (this.next()) {
            out += this.tok();
        }
        return out;
    };
    Parser.prototype.next = function () {
        return this.token = this.tokens.pop();
    };
    Parser.prototype.peek = function () {
        return this.tokens[this.tokens.length - 1] || 0;
    };
    Parser.prototype.parseText = function () {
        var body = this.token.text;
        while (this.peek().type === 'text') {
            body += '\n' + this.next().text;
        }
        return this.inline.output(body);
    };
    Parser.prototype.tok = function () {
        switch (this.token.type) {
        case 'space': {
                return '';
            }
        case 'hr': {
                return this.renderer.hr();
            }
        case 'heading': {
                return this.renderer.heading(this.inline.output(this.token.text), this.token.depth, this.token.text, this.options);
            }
        case 'code': {
                return this.renderer.code(this.token.text, this.token.lang, this.token.escaped, this.options);
            }
        case 'table': {
                var header = '', body = '', i, row, cell, flags, j;
                cell = '';
                for (i = 0; i < this.token.header.length; i++) {
                    flags = {
                        header: true,
                        align: this.token.align[i]
                    };
                    cell += this.renderer.tablecell(this.inline.output(this.token.header[i]), {
                        header: true,
                        align: this.token.align[i]
                    });
                }
                header += this.renderer.tablerow(cell);
                for (i = 0; i < this.token.cells.length; i++) {
                    row = this.token.cells[i];
                    cell = '';
                    for (j = 0; j < row.length; j++) {
                        cell += this.renderer.tablecell(this.inline.output(row[j]), {
                            header: false,
                            align: this.token.align[j]
                        });
                    }
                    body += this.renderer.tablerow(cell);
                }
                return this.renderer.table(header, body);
            }
        case 'blockquote_start': {
                var body = '';
                while (this.next().type !== 'blockquote_end') {
                    body += this.tok();
                }
                return this.renderer.blockquote(body);
            }
        case 'list_start': {
                var body = '', ordered = this.token.ordered;
                while (this.next().type !== 'list_end') {
                    body += this.tok();
                }
                return this.renderer.list(body, ordered);
            }
        case 'list_item_start': {
                var body = '';
                while (this.next().type !== 'list_item_end') {
                    body += this.token.type === 'text' ? this.parseText() : this.tok();
                }
                return this.renderer.listitem(body);
            }
        case 'loose_item_start': {
                var body = '';
                while (this.next().type !== 'list_item_end') {
                    body += this.tok();
                }
                return this.renderer.listitem(body);
            }
        case 'html': {
                var html = !this.token.pre && !this.options.pedantic ? this.inline.output(this.token.text) : this.token.text;
                return this.renderer.html(html);
            }
        case 'paragraph': {
                return this.renderer.paragraph(this.inline.output(this.token.text));
            }
        case 'text': {
                return this.renderer.paragraph(this.parseText());
            }
        }
    };
    function escape(html, encode) {
        return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function replace(regex, opt) {
        regex = regex.source;
        opt = opt || '';
        return function self(name, val) {
            if (!name)
                return new RegExp(regex, opt);
            val = val.source || val;
            val = val.replace(/(^|[^\[])\^/g, '$1');
            regex = regex.replace(name, val);
            return self;
        };
    }
    function noop() {
    }
    noop.exec = noop;
    function merge(obj) {
        var i = 1, target, key;
        for (; i < arguments.length; i++) {
            target = arguments[i];
            for (key in target) {
                if (Object.prototype.hasOwnProperty.call(target, key)) {
                    obj[key] = target[key];
                }
            }
        }
        return obj;
    }
    function marked(src, opt, callback) {
        if (callback || typeof opt === 'function') {
            if (!callback) {
                callback = opt;
                opt = null;
            }
            opt = merge({}, marked.defaults, opt || {});
            var highlight = opt.highlight, tokens, pending, i = 0;
            try {
                tokens = Lexer.lex(src, opt);
            } catch (e) {
                return callback(e);
            }
            pending = tokens.length;
            var done = function () {
                var out, err;
                try {
                    out = Parser.parse(tokens, opt);
                } catch (e) {
                    err = e;
                }
                opt.highlight = highlight;
                return err ? callback(err) : callback(null, out);
            };
            if (!highlight || highlight.length < 3) {
                return done();
            }
            delete opt.highlight;
            if (!pending)
                return done();
            for (; i < tokens.length; i++) {
                (function (token) {
                    if (token.type !== 'code') {
                        return --pending || done();
                    }
                    return highlight(token.text, token.lang, function (err, code) {
                        if (code == null || code === token.text) {
                            return --pending || done();
                        }
                        token.text = code;
                        token.escaped = true;
                        --pending || done();
                    });
                }(tokens[i]));
            }
            return;
        }
        try {
            if (opt)
                opt = merge({}, marked.defaults, opt);
            return Parser.parse(Lexer.lex(src, opt), opt);
        } catch (e) {
            e.message += '\nPlease report this to https://github.com/chjj/marked.';
            if ((opt || marked.defaults).silent) {
                return '<p>An error occured:</p><pre>' + escape(e.message + '', true) + '</pre>';
            }
            throw e;
        }
    }
    marked.options = marked.setOptions = function (opt) {
        merge(marked.defaults, opt);
        return marked;
    };
    marked.defaults = {
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: false,
        silent: false,
        highlight: null,
        langPrefix: 'lang-',
        smartypants: false,
        headerPrefix: '',
        renderer: new Renderer()
    };
    marked.Parser = Parser;
    marked.parser = Parser.parse;
    marked.Renderer = Renderer;
    marked.Lexer = Lexer;
    marked.lexer = Lexer.lex;
    marked.InlineLexer = InlineLexer;
    marked.inlineLexer = InlineLexer.output;
    marked.parse = marked;
    if (typeof exports === 'object') {
        module.exports = marked;
    } else if (typeof define === 'function' && define.amd) {
        define(function () {
            return marked;
        });
    } else {
        this.marked = marked;
    }
}.call(function () {
    return this || (typeof window !== 'undefined' ? window : global);
}()));
});
require.define('36', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Mixen, indexOf, moduleSuper, uniqueId, __slice = [].slice, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    indexOf = function (haystack, needle) {
        var i, stalk, _i, _len;
        for (i = _i = 0, _len = haystack.length; _i < _len; i = ++_i) {
            stalk = haystack[i];
            if (stalk === needle) {
                return i;
            }
        }
        return -1;
    };
    uniqueId = function () {
        var id;
        id = 0;
        return function () {
            return id++;
        };
    }();
    Mixen = function () {
        return Mixen.createMixen.apply(Mixen, arguments);
    };
    Mixen.createdMixens = {};
    Mixen.createMixen = function () {
        var Inst, Last, method, mods, module, _base, _i, _len, _ref, _ref1;
        mods = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        Last = mods[mods.length - 1];
        _ref = mods.slice(0).reverse();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            module = _ref[_i];
            Inst = function (_super) {
                __extends(Inst, _super);
                function Inst() {
                    var args, mod, _j, _len1;
                    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                    for (_j = 0, _len1 = mods.length; _j < _len1; _j++) {
                        mod = mods[_j];
                        mod.apply(this, args);
                    }
                }
                return Inst;
            }(Last);
            Last = Inst;
            for (method in module.prototype) {
                Inst.prototype[method] = module.prototype[method];
            }
            _ref1 = module.prototype;
            for (method in _ref1) {
                if (!__hasProp.call(_ref1, method))
                    continue;
                if (method === 'constructor') {
                    continue;
                }
                if (typeof module.prototype[method] !== 'function') {
                    continue;
                }
                if (module.__super__ == null) {
                    module.__super__ = {};
                }
                if ((_base = module.__super__)[method] == null) {
                    _base[method] = moduleSuper(module, method);
                }
            }
        }
        Last.prototype._mixen_id = uniqueId();
        Mixen.createdMixens[Last.prototype._mixen_id] = mods;
        return Last;
    };
    moduleSuper = function (module, method) {
        return function () {
            var args, current, id, modules, nextModule, pos;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            current = this.constructor.prototype;
            id = null;
            while (true) {
                if (current === Object.prototype) {
                    return;
                }
                id = current._mixen_id;
                if (id != null) {
                    break;
                }
                current = current.constructor.__super__.constructor.prototype;
            }
            if (id == null) {
                return;
            }
            modules = Mixen.createdMixens[id];
            pos = indexOf(modules, module);
            nextModule = null;
            while (pos++ < modules.length - 1) {
                nextModule = modules[pos];
                if (nextModule.prototype[method] != null) {
                    break;
                }
            }
            if (nextModule != null && nextModule.prototype != null && nextModule.prototype[method] != null) {
                return nextModule.prototype[method].apply(this, args);
            }
        };
    };
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return Mixen;
        });
    } else if (typeof exports === 'object') {
        module.exports = Mixen;
    } else {
        window.Mixen = Mixen;
    }
}.call(this));
});
require.define('61', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Teacup, doctypes, elements, merge_elements, tagName, _fn, _fn1, _fn2, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, __slice = [].slice, __indexOf = [].indexOf || function (item) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this && this[i] === item)
                    return i;
            }
            return -1;
        };
    doctypes = {
        'default': '<!DOCTYPE html>',
        '5': '<!DOCTYPE html>',
        'xml': '<?xml version="1.0" encoding="utf-8" ?>',
        'transitional': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
        'strict': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
        'frameset': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
        '1.1': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
        'basic': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">',
        'mobile': '<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">',
        'ce': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "ce-html-1.0-transitional.dtd">'
    };
    elements = {
        regular: 'a abbr address article aside audio b bdi bdo blockquote body button canvas caption cite code colgroup datalist dd del details dfn div dl dt em fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup html i iframe ins kbd label legend li map mark menu meter nav noscript object ol optgroup option output p pre progress q rp rt ruby s samp section select small span strong sub summary sup table tbody td textarea tfoot th thead time title tr u ul video',
        raw: 'script style',
        'void': 'area base br col command embed hr img input keygen link meta param source track wbr',
        obsolete: 'applet acronym bgsound dir frameset noframes isindex listing nextid noembed plaintext rb strike xmp big blink center font marquee multicol nobr spacer tt',
        obsolete_void: 'basefont frame'
    };
    merge_elements = function () {
        var a, args, element, result, _i, _j, _len, _len1, _ref;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        result = [];
        for (_i = 0, _len = args.length; _i < _len; _i++) {
            a = args[_i];
            _ref = elements[a].split(' ');
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                element = _ref[_j];
                if (__indexOf.call(result, element) < 0) {
                    result.push(element);
                }
            }
        }
        return result;
    };
    Teacup = function () {
        function Teacup() {
            this.htmlOut = null;
        }
        Teacup.prototype.resetBuffer = function (html) {
            var previous;
            if (html == null) {
                html = null;
            }
            previous = this.htmlOut;
            this.htmlOut = html;
            return previous;
        };
        Teacup.prototype.render = function () {
            var args, previous, result, template;
            template = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            previous = this.resetBuffer('');
            try {
                template.apply(null, args);
            } finally {
                result = this.resetBuffer(previous);
            }
            return result;
        };
        Teacup.prototype.cede = function () {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return this.render.apply(this, args);
        };
        Teacup.prototype.renderable = function (template) {
            var teacup;
            teacup = this;
            return function () {
                var args, result;
                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                if (teacup.htmlOut === null) {
                    teacup.htmlOut = '';
                    try {
                        template.apply(this, args);
                    } finally {
                        result = teacup.resetBuffer();
                    }
                    return result;
                } else {
                    return template.apply(this, args);
                }
            };
        };
        Teacup.prototype.renderAttr = function (name, value) {
            var k, v;
            if (value == null) {
                return ' ' + name;
            }
            if (value === false) {
                return '';
            }
            if (name === 'data' && typeof value === 'object') {
                return function () {
                    var _results;
                    _results = [];
                    for (k in value) {
                        v = value[k];
                        _results.push(this.renderAttr('data-' + k, v));
                    }
                    return _results;
                }.call(this).join('');
            }
            if (value === true) {
                value = name;
            }
            return ' ' + name + '=' + this.quote(this.escape(value.toString()));
        };
        Teacup.prototype.attrOrder = [
            'id',
            'class'
        ];
        Teacup.prototype.renderAttrs = function (obj) {
            var name, result, value, _i, _len, _ref;
            result = '';
            _ref = this.attrOrder;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                name = _ref[_i];
                if (!(name in obj)) {
                    continue;
                }
                result += this.renderAttr(name, obj[name]);
                delete obj[name];
            }
            for (name in obj) {
                value = obj[name];
                result += this.renderAttr(name, value);
            }
            return result;
        };
        Teacup.prototype.renderContents = function (contents) {
            if (contents == null) {
            } else if (typeof contents === 'function') {
                return contents.call(this);
            } else {
                return this.text(contents);
            }
        };
        Teacup.prototype.isSelector = function (string) {
            var _ref;
            return string.length > 1 && ((_ref = string[0]) === '#' || _ref === '.');
        };
        Teacup.prototype.parseSelector = function (selector) {
            var classes, id, klass, token, _i, _len, _ref, _ref1;
            id = null;
            classes = [];
            _ref = selector.split('.');
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                token = _ref[_i];
                if (id) {
                    classes.push(token);
                } else {
                    _ref1 = token.split('#'), klass = _ref1[0], id = _ref1[1];
                    if (klass !== '') {
                        classes.push(token);
                    }
                }
            }
            return {
                id: id,
                classes: classes
            };
        };
        Teacup.prototype.normalizeArgs = function (args) {
            var arg, attrs, classes, contents, id, index, selector, _i, _len;
            attrs = {};
            selector = null;
            contents = null;
            for (index = _i = 0, _len = args.length; _i < _len; index = ++_i) {
                arg = args[index];
                if (arg != null) {
                    switch (typeof arg) {
                    case 'string':
                        if (index === 0 && this.isSelector(arg)) {
                            selector = this.parseSelector(arg);
                        } else {
                            contents = arg;
                        }
                        break;
                    case 'function':
                    case 'number':
                    case 'boolean':
                        contents = arg;
                        break;
                    case 'object':
                        if (arg.constructor === Object) {
                            attrs = arg;
                        } else {
                            contents = arg;
                        }
                        break;
                    default:
                        contents = arg;
                    }
                }
            }
            if (selector != null) {
                id = selector.id, classes = selector.classes;
                if (id != null) {
                    attrs.id = id;
                }
                if (classes != null ? classes.length : void 0) {
                    attrs['class'] = classes.join(' ');
                }
            }
            return {
                attrs: attrs,
                contents: contents
            };
        };
        Teacup.prototype.tag = function () {
            var args, attrs, contents, tagName, _ref;
            tagName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            _ref = this.normalizeArgs(args), attrs = _ref.attrs, contents = _ref.contents;
            this.raw('<' + tagName + this.renderAttrs(attrs) + '>');
            this.renderContents(contents);
            return this.raw('</' + tagName + '>');
        };
        Teacup.prototype.rawTag = function () {
            var args, attrs, contents, tagName, _ref;
            tagName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            _ref = this.normalizeArgs(args), attrs = _ref.attrs, contents = _ref.contents;
            this.raw('<' + tagName + this.renderAttrs(attrs) + '>');
            this.raw(contents);
            return this.raw('</' + tagName + '>');
        };
        Teacup.prototype.selfClosingTag = function () {
            var args, attrs, contents, tag, _ref;
            tag = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            _ref = this.normalizeArgs(args), attrs = _ref.attrs, contents = _ref.contents;
            if (contents) {
                throw new Error('Teacup: <' + tag + '/> must not have content.  Attempted to nest ' + contents);
            }
            return this.raw('<' + tag + this.renderAttrs(attrs) + ' />');
        };
        Teacup.prototype.coffeescript = function (fn) {
            return this.raw('<script type="text/javascript">(function() {\n  var __slice = [].slice,\n      __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },\n      __hasProp = {}.hasOwnProperty,\n      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };\n  (' + fn.toString() + ')();\n})();</script>');
        };
        Teacup.prototype.comment = function (text) {
            return this.raw('<!--' + this.escape(text) + '-->');
        };
        Teacup.prototype.doctype = function (type) {
            if (type == null) {
                type = 5;
            }
            return this.raw(doctypes[type]);
        };
        Teacup.prototype.ie = function (condition, contents) {
            this.raw('<!--[if ' + this.escape(condition) + ']>');
            this.renderContents(contents);
            return this.raw('<![endif]-->');
        };
        Teacup.prototype.text = function (s) {
            if (this.htmlOut == null) {
                throw new Error('Teacup: can\'t call a tag function outside a rendering context');
            }
            return this.htmlOut += s != null && this.escape(s.toString()) || '';
        };
        Teacup.prototype.raw = function (s) {
            if (s == null) {
                return;
            }
            return this.htmlOut += s;
        };
        Teacup.prototype.escape = function (text) {
            return text.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        };
        Teacup.prototype.quote = function (value) {
            return '"' + value + '"';
        };
        Teacup.prototype.tags = function () {
            var bound, boundMethodNames, method, _fn, _i, _len, _this = this;
            bound = {};
            boundMethodNames = [].concat('cede coffeescript comment doctype escape ie raw render renderable script tag text'.split(' '), merge_elements('regular', 'obsolete', 'raw', 'void', 'obsolete_void'));
            _fn = function (method) {
                return bound[method] = function () {
                    var args;
                    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                    return _this[method].apply(_this, args);
                };
            };
            for (_i = 0, _len = boundMethodNames.length; _i < _len; _i++) {
                method = boundMethodNames[_i];
                _fn(method);
            }
            return bound;
        };
        return Teacup;
    }();
    _ref = merge_elements('regular', 'obsolete');
    _fn = function (tagName) {
        return Teacup.prototype[tagName] = function () {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return this.tag.apply(this, [tagName].concat(__slice.call(args)));
        };
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tagName = _ref[_i];
        _fn(tagName);
    }
    _ref1 = merge_elements('raw');
    _fn1 = function (tagName) {
        return Teacup.prototype[tagName] = function () {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return this.rawTag.apply(this, [tagName].concat(__slice.call(args)));
        };
    };
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        tagName = _ref1[_j];
        _fn1(tagName);
    }
    _ref2 = merge_elements('void', 'obsolete_void');
    _fn2 = function (tagName) {
        return Teacup.prototype[tagName] = function () {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return this.selfClosingTag.apply(this, [tagName].concat(__slice.call(args)));
        };
    };
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        tagName = _ref2[_k];
        _fn2(tagName);
    }
    if (typeof module !== 'undefined' && module !== null ? module.exports : void 0) {
        module.exports = new Teacup().tags();
        module.exports.Teacup = Teacup;
    } else if (typeof define === 'function' && define.amd) {
        define('teacup', [], function () {
            return new Teacup().tags();
        });
    } else {
        window.teacup = new Teacup().tags();
        window.teacup.Teacup = Teacup;
    }
}.call(this));
});
require.define('62', function(module, exports, __dirname, __filename, undefined){
try {
    if (!setTimeout.call) {
        var slicer = Array.prototype.slice;
        exports.setTimeout = function (fn) {
            var args = slicer.call(arguments, 1);
            return setTimeout(function () {
                return fn.apply(this, args);
            });
        };
        exports.setInterval = function (fn) {
            var args = slicer.call(arguments, 1);
            return setInterval(function () {
                return fn.apply(this, args);
            });
        };
    } else {
        exports.setTimeout = setTimeout;
        exports.setInterval = setInterval;
    }
    exports.clearTimeout = clearTimeout;
    exports.clearInterval = clearInterval;
    if (window.setImmediate) {
        exports.setImmediate = window.setImmediate;
        exports.clearImmediate = window.clearImmediate;
    }
    exports.setTimeout(function () {
    });
} catch (_) {
    function bind(f, context) {
        return function () {
            return f.apply(context, arguments);
        };
    }
    if (typeof window !== 'undefined') {
        exports.setTimeout = bind(setTimeout, window);
        exports.setInterval = bind(setInterval, window);
        exports.clearTimeout = bind(clearTimeout, window);
        exports.clearInterval = bind(clearInterval, window);
        if (window.setImmediate) {
            exports.setImmediate = bind(window.setImmediate, window);
            exports.clearImmediate = bind(window.clearImmediate, window);
        }
    } else {
        if (typeof setTimeout !== 'undefined') {
            exports.setTimeout = setTimeout;
        }
        if (typeof setInterval !== 'undefined') {
            exports.setInterval = setInterval;
        }
        if (typeof clearTimeout !== 'undefined') {
            exports.clearTimeout = clearTimeout;
        }
        if (typeof clearInterval === 'function') {
            exports.clearInterval = clearInterval;
        }
    }
}
exports.unref = function unref() {
};
exports.ref = function ref() {
};
if (!exports.setImmediate) {
    var currentKey = 0, queue = {}, active = false;
    exports.setImmediate = function () {
        function drain() {
            active = false;
            for (var key in queue) {
                if (queue.hasOwnProperty(currentKey, key)) {
                    var fn = queue[key];
                    delete queue[key];
                    fn();
                }
            }
        }
        if (typeof window !== 'undefined' && window.postMessage && window.addEventListener) {
            window.addEventListener('message', function (ev) {
                if (ev.source === window && ev.data === 'browserify-tick') {
                    ev.stopPropagation();
                    drain();
                }
            }, true);
            return function setImmediate(fn) {
                var id = ++currentKey;
                queue[id] = fn;
                if (!active) {
                    active = true;
                    window.postMessage('browserify-tick', '*');
                }
                return id;
            };
        } else {
            return function setImmediate(fn) {
                var id = ++currentKey;
                queue[id] = fn;
                if (!active) {
                    active = true;
                    setTimeout(drain, 0);
                }
                return id;
            };
        }
    }();
    exports.clearImmediate = function clearImmediate(id) {
        delete queue[id];
    };
}
});
require.define('63', function(module, exports, __dirname, __filename, undefined){
var util = require('util');
var assert = require('assert');
var slice = Array.prototype.slice;
var console;
var times = {};
if (typeof global !== 'undefined' && global.console) {
    console = global.console;
} else if (typeof window !== 'undefined' && window.console) {
    console = window.console;
} else {
    console = {};
}
var functions = [
        [
            log,
            'log'
        ],
        [
            info,
            'info'
        ],
        [
            warn,
            'warn'
        ],
        [
            error,
            'error'
        ],
        [
            time,
            'time'
        ],
        [
            timeEnd,
            'timeEnd'
        ],
        [
            trace,
            'trace'
        ],
        [
            dir,
            'dir'
        ],
        [
            assert,
            'assert'
        ]
    ];
for (var i = 0; i < functions.length; i++) {
    var tuple = functions[i];
    var f = tuple[0];
    var name = tuple[1];
    if (!console[name]) {
        console[name] = f;
    }
}
module.exports = console;
function log() {
}
function info() {
    console.log.apply(console, arguments);
}
function warn() {
    console.log.apply(console, arguments);
}
function error() {
    console.warn.apply(console, arguments);
}
function time(label) {
    times[label] = Date.now();
}
function timeEnd(label) {
    var time = times[label];
    if (!time) {
        throw new Error('No such label: ' + label);
    }
    var duration = Date.now() - time;
    console.log(label + ': ' + duration + 'ms');
}
function trace() {
    var err = new Error();
    err.name = 'Trace';
    err.message = util.format.apply(null, arguments);
    console.error(err.stack);
}
function dir(object) {
    console.log(util.inspect(object) + '\n');
}
function assert(expression) {
    if (!expression) {
        var arr = slice.call(arguments, 1);
        assert.ok(false, util.format.apply(null, arr));
    }
}
});
require.define('65', function(module, exports, __dirname, __filename, undefined){
(function () {
    var key, psylib, value;
    psylib = require('115', module);
    for (key in psylib) {
        value = psylib[key];
        console.log('key', key);
        exports[key] = value;
    }
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }
}.call(this));
});
require.define('78', function(module, exports, __dirname, __filename, undefined){
(function () {
    var AutoResponse, Canvas, ComponentFactory, Components, DefaultComponentFactory, Html, Layout, Psy, didyoumean, name, params, spec, _, _ref, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    _ = require('16', module);
    didyoumean = require('122', module);
    didyoumean.caseSensitive = true;
    Canvas = require('75', module).Canvas;
    Html = require('76', module).Html;
    Components = require('77', module);
    Psy = require('67', module);
    Layout = require('73', module);
    AutoResponse = require('72', module).AutoResponse;
    ComponentFactory = function () {
        ComponentFactory.transformPropertySpec = function (name, params) {
            var id, sname;
            sname = name.split('$');
            if (sname.length === 1) {
                name = sname[0];
            } else if (sname.length === 2) {
                name = sname[0];
                id = sname[1];
                params.id = id;
            } else {
                throw new Error('Illegal property name ' + name + '. Can only have one \'$\' character in name');
            }
            return [
                name,
                params
            ];
        };
        function ComponentFactory(context) {
            this.context = context;
        }
        ComponentFactory.prototype.buildStimulus = function (spec) {
            var params, stimType;
            stimType = _.keys(spec)[0];
            params = _.values(spec)[0];
            return this.makeStimulus(stimType, params);
        };
        ComponentFactory.prototype.buildResponse = function (spec) {
            var params, responseType;
            responseType = _.keys(spec)[0];
            params = _.values(spec)[0];
            return this.makeResponse(responseType, params);
        };
        ComponentFactory.prototype.buildEvent = function (spec) {
            var response, responseSpec, stim, stimSpec;
            stimSpec = _.omit(spec, 'Next');
            if (spec.Next != null) {
                responseSpec = _.pick(spec, 'Next');
                response = this.buildResponse(responseSpec.Next);
            } else {
                response = new AutoResponse();
            }
            stim = this.buildStimulus(stimSpec);
            return this.makeEvent(stim, response);
        };
        ComponentFactory.prototype.make = function (name, params, registry) {
            throw new Error('unimplemented', name, params, registry);
        };
        ComponentFactory.prototype.makeStimulus = function (name, params) {
            throw new Error('unimplemented', name, params);
        };
        ComponentFactory.prototype.makeResponse = function (name, params) {
            throw new Error('unimplemented', name, params);
        };
        ComponentFactory.prototype.makeEvent = function (stim, response) {
            throw new Error('unimplemented', stim, response);
        };
        ComponentFactory.prototype.makeLayout = function (name, params, context) {
            throw new Error('unimplemented', name, params, context);
        };
        return ComponentFactory;
    }();
    spec = { Blank: { file: 'red' } };
    _ref = ComponentFactory.transformPropertySpec(_.keys(spec)[0], _.values(spec)[0]), name = _ref[0], params = _ref[1];
    console.log(name, params);
    exports.ComponentFactory = ComponentFactory;
    DefaultComponentFactory = function (_super) {
        __extends(DefaultComponentFactory, _super);
        function DefaultComponentFactory() {
            this.registry = _.merge(Components, Canvas, Html);
        }
        DefaultComponentFactory.prototype.makeStimSet = function (params, callee, registry) {
            var names, props, stims, _i, _ref1, _results;
            names = _.keys(params);
            props = _.values(params);
            return stims = _.map(function () {
                _results = [];
                for (var _i = 0, _ref1 = names.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; 0 <= _ref1 ? _i++ : _i--) {
                    _results.push(_i);
                }
                return _results;
            }.apply(this), function (_this) {
                return function (i) {
                    return callee(names[i], props[i], registry);
                };
            }(this));
        };
        DefaultComponentFactory.prototype.makeNestedStims = function (params, callee, registry) {
            var names, props, stims, _i, _ref1, _results;
            names = _.map(params, function (stim) {
                return _.keys(stim)[0];
            });
            props = _.map(params, function (stim) {
                return _.values(stim)[0];
            });
            return stims = _.map(function () {
                _results = [];
                for (var _i = 0, _ref1 = names.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; 0 <= _ref1 ? _i++ : _i--) {
                    _results.push(_i);
                }
                return _results;
            }.apply(this), function (_this) {
                return function (i) {
                    return callee(names[i], props[i], registry);
                };
            }(this));
        };
        DefaultComponentFactory.prototype.make = function (name, params, registry) {
            var callee, layoutName, layoutParams, resps, stims, _ref1;
            callee = arguments.callee;
            _ref1 = ComponentFactory.transformPropertySpec(name, params), name = _ref1[0], params = _ref1[1];
            switch (name) {
            case 'Group':
                stims = this.makeNestedStims(params.stims, callee, this.registry);
                if (params.layout != null) {
                    layoutName = _.keys(params.layout)[0];
                    layoutParams = _.values(params.layout)[0];
                    return new Components.Group(stims, this.makeLayout(layoutName, layoutParams, context), params);
                } else {
                    return new Components.Group(stims, null, params);
                }
                break;
            case 'CanvasGroup':
                stims = this.makeNestedStims(params.stims, callee, this.registry);
                if (params.layout != null) {
                    layoutName = _.keys(params.layout)[0];
                    layoutParams = _.values(params.layout)[0];
                    return new Components.CanvasGroup(stims, this.makeLayout(layoutName, layoutParams, context), params);
                } else {
                    return new Components.CanvasGroup(stims, null, params);
                }
                break;
            case 'Grid':
                stims = this.makeNestedStims(params.stims, callee, this.registry);
                return new Components.Grid(stims, params.rows || 3, params.columns || 3, params.bounds || null);
            case 'Background':
                stims = this.makeStimSet(params, callee, this.registry);
                return new Canvas.Background(stims);
            case 'First':
                resps = this.makeNestedStims(params, callee, this.registry);
                return new Components.First(resps);
            default:
                if (registry[name] == null) {
                    throw new Error('DefaultComponentFactory: cannot find component named: ' + name + '-- did you mean? ' + didyoumean(name, _.keys(registry)) + '?');
                }
                return new registry[name](params);
            }
        };
        DefaultComponentFactory.prototype.makeStimulus = function (name, params) {
            console.log('making stimulus', name, 'with params', params);
            return this.make(name, params, this.registry);
        };
        DefaultComponentFactory.prototype.makeResponse = function (name, params) {
            return this.make(name, params, this.registry);
        };
        DefaultComponentFactory.prototype.makeEvent = function (stim, response) {
            return new Psy.Event(stim, response);
        };
        DefaultComponentFactory.prototype.makeLayout = function (name, params, context) {
            switch (name) {
            case 'Grid':
                return new Layout.GridLayout(params[0], params[1], {
                    x: 0,
                    y: 0,
                    width: context.width(),
                    height: context.height()
                });
            default:
                return console.log('unrecognized layout', name);
            }
        };
        return DefaultComponentFactory;
    }(ComponentFactory);
    exports.DefaultComponentFactory = DefaultComponentFactory;
    exports.componentFactory = new DefaultComponentFactory();
}.call(this));
});
require.define('73', function(module, exports, __dirname, __filename, undefined){
(function () {
    var AbsoluteLayout, GridLayout, Layout, computeGridCells, convertPercentageToFraction, convertToCoordinate, isPercentage, isPositionLabel, positionToCoord, toPixels, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    _ = require('16', module);
    isPercentage = function (perc) {
        return _.isString(perc) && perc.slice(-1) === '%';
    };
    isPositionLabel = function (pos) {
        return _.contains([
            'center',
            'center-left',
            'center-right',
            'top-left',
            'top-right',
            'top-center',
            'bottom-left',
            'bottom-right',
            'bottom-center',
            'left-center',
            'right-center',
            'left-top',
            'right-top',
            'center-top',
            'left-bottom',
            'right-bottom',
            'center-bottom'
        ], pos);
    };
    positionToCoord = function (pos, offx, offy, width, height, xy) {
        switch (pos) {
        case 'center':
            return [
                offx + width * 0.5,
                offy + height * 0.5
            ];
        case 'center-left' || 'left-center':
            return [
                offx + width / 6,
                offy + height * 0.5
            ];
        case 'center-right' || 'right-center':
            return [
                offx + width * 5 / 6,
                offy + height * 0.5
            ];
        case 'top-left' || 'left-top':
            return [
                offx + width / 6,
                offy + height / 6
            ];
        case 'top-right' || 'right-top':
            return [
                offx + width * 5 / 6,
                offy + height / 6
            ];
        case 'top-center' || 'center-top':
            return [
                offx + width * 0.5,
                offy + height / 6
            ];
        case 'bottom-left' || 'left-bottom':
            return [
                offx + width / 6,
                offy + height * 5 / 6
            ];
        case 'bottom-right' || 'right-bottom':
            return [
                offx + width * 5 / 6,
                offy + height * 5 / 6
            ];
        case 'bottom-center' || 'center-bottom':
            return [
                offx + width * 0.5,
                offy + height * 5 / 6
            ];
        default:
            return xy;
        }
    };
    toPixels = function (arg, dim) {
        if (_.isNumber(arg)) {
            return arg;
        } else if (isPercentage(arg)) {
            return convertPercentageToFraction(arg, dim);
        } else {
            throw new Error('toPixels: argument must either be a Number or a String-based Percentage value: ', arg);
        }
    };
    convertPercentageToFraction = function (perc, dim) {
        var frac;
        frac = parseFloat(perc) / 100;
        frac = Math.min(1, frac);
        frac = Math.max(0, frac);
        return frac * dim;
    };
    convertToCoordinate = function (val, d) {
        var ret;
        if (isPercentage(val)) {
            return val = convertPercentageToFraction(val, d);
        } else if (isPositionLabel(val)) {
            ret = positionToCoord(val, 0, 0, d[0], d[1], [
                0,
                0
            ]);
            return ret;
        } else {
            return Math.min(val, d);
        }
    };
    computeGridCells = function (rows, cols, bounds) {
        var col, row, _i, _results;
        _results = [];
        for (row = _i = 0; 0 <= rows ? _i < rows : _i > rows; row = 0 <= rows ? ++_i : --_i) {
            _results.push(function () {
                var _j, _results1;
                _results1 = [];
                for (col = _j = 0; 0 <= cols ? _j < cols : _j > cols; col = 0 <= cols ? ++_j : --_j) {
                    _results1.push({
                        x: bounds.x + bounds.width / cols * col,
                        y: bounds.y + bounds.height / rows * row,
                        width: bounds.width / cols,
                        height: bounds.height / rows
                    });
                }
                return _results1;
            }());
        }
        return _results;
    };
    exports.Layout = Layout = function () {
        function Layout() {
        }
        Layout.prototype.computePosition = function (dim, constraints) {
            throw new Error('unimplimented error');
        };
        Layout.prototype.convertToCoordinate = function (val, d) {
            var ret;
            if (isPercentage(val)) {
                return val = convertPercentageToFraction(val, d);
            } else if (isPositionLabel(val)) {
                ret = positionToCoord(val, 0, 0, d[0], d[1], [
                    0,
                    0
                ]);
                return ret;
            } else {
                return Math.min(val, d);
            }
        };
        return Layout;
    }();
    exports.AbsoluteLayout = AbsoluteLayout = function (_super) {
        __extends(AbsoluteLayout, _super);
        function AbsoluteLayout() {
            return AbsoluteLayout.__super__.constructor.apply(this, arguments);
        }
        AbsoluteLayout.prototype.computePosition = function (dim, constraints) {
            var x, y;
            if (_.isArray(constraints)) {
                x = convertToCoordinate(constraints[0], dim[0]);
                y = convertToCoordinate(constraints[1], dim[1]);
                return [
                    x,
                    y
                ];
            } else {
                return convertToCoordinate(constraints, dim);
            }
        };
        return AbsoluteLayout;
    }(exports.Layout);
    exports.GridLayout = GridLayout = function (_super) {
        __extends(GridLayout, _super);
        function GridLayout(rows, cols, bounds) {
            this.rows = rows;
            this.cols = cols;
            this.bounds = bounds;
            this.ncells = this.rows * this.cols;
            this.cells = this.computeCells();
        }
        GridLayout.prototype.computeCells = function () {
            return computeGridCells(this.rows, this.cols, this.bounds);
        };
        GridLayout.prototype.computePosition = function (dim, constraints) {
            var cell;
            if (constraints[0] > this.rows - 1) {
                throw new Error('GridLayout.computePosition: illegal row position ' + constraints[0] + ' for grid with dimensions (' + this.rows + ', ' + this.cols + ')');
            }
            if (constraints[1] > this.cols - 1) {
                throw new Error('GridLayout.computePosition: illegal column position ' + constraints[0] + ' for grid with dimensions (' + this.rows + ', ' + this.cols + ')');
            }
            cell = this.cells[constraints[0]][constraints[1]];
            return [
                cell.x + cell.width / 2,
                cell.y + cell.height / 2
            ];
        };
        return GridLayout;
    }(exports.Layout);
    exports.positionToCoord = positionToCoord;
    exports.toPixels = toPixels;
}.call(this));
});
require.define('67', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Background, Bacon, Block, BlockSeq, Coda, Cont, DataTable, DefaultComponentFactory, Done, DynamicTrialEnumerator, Error, Event, EventData, EventDataLog, ExperimentContext, ExperimentState, FeedbackNode, FunctionNode, Input, Iteratee, KineticContext, MockStimFactory, Prelude, Presenter, Q, Response, ResponseData, RunnableNode, STRIP_COMMENTS, StaticTrialEnumerator, StimFactory, Stimulus, TAFFY, Trial, TrialEnumerator, buildCoda, buildPrelude, buildTrial, createContext, functionNode, getParamNames, makeEventSeq, props, utils, _, __dummySpec, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    _ = require('16', module);
    Q = require('17', module);
    TAFFY = require('21', module).taffy;
    utils = require('69', module);
    DataTable = require('70', module).DataTable;
    Bacon = require('22', module);
    DefaultComponentFactory = require('78', module).DefaultComponentFactory;
    Background = require('79', module).Background;
    Stimulus = require('72', module).Stimulus;
    Response = require('72', module).Response;
    ResponseData = require('72', module).ResponseData;
    props = require('136', module);
    STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/g;
    getParamNames = function (func) {
        var fnStr, result;
        fnStr = func.toString().replace(STRIP_COMMENTS, '');
        result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
        if (result === null) {
            result = [];
        }
        return result;
    };
    Input = function () {
        function Input() {
        }
        Input.EOF = new Input();
        Input.EMPTY = new Input();
        return Input;
    }();
    Iteratee = function () {
        function Iteratee() {
        }
        return Iteratee;
    }();
    Done = function (_super) {
        __extends(Done, _super);
        function Done(a, remaining) {
            this.a = a;
            this.remaining = remaining;
        }
        return Done;
    }(Iteratee);
    Error = function (_super) {
        __extends(Error, _super);
        function Error(msg, input) {
            this.msg = msg;
            this.input = input;
        }
        return Error;
    }(Iteratee);
    Cont = function (_super) {
        __extends(Cont, _super);
        function Cont(cont) {
            this.cont = cont;
        }
        return Cont;
    }(Iteratee);
    exports.EventData = EventData = function () {
        function EventData(name, id, data) {
            this.name = name;
            this.id = id;
            this.data = data;
        }
        return EventData;
    }();
    exports.EventDataLog = EventDataLog = function () {
        function EventDataLog() {
            this.eventStack = [];
        }
        EventDataLog.prototype.push = function (ev) {
            return this.eventStack.push(ev);
        };
        EventDataLog.prototype.last = function () {
            if (this.eventStack.length < 1) {
                throw 'EventLog is Empty, canot access last element';
            }
            return this.eventStack[this.eventStack.length - 1].data;
        };
        EventDataLog.prototype.findAll = function (id) {
            return _.filter(this.eventStack, function (ev) {
                return ev.id === id;
            });
        };
        EventDataLog.prototype.findLast = function (id) {
            var i, len, _i;
            len = this.eventStack.length - 1;
            for (i = _i = len; len <= 0 ? _i <= 0 : _i >= 0; i = len <= 0 ? ++_i : --_i) {
                if (this.eventStack[i].id === id) {
                    return this.eventStack[i];
                }
            }
        };
        return EventDataLog;
    }();
    exports.StimFactory = StimFactory = function () {
        function StimFactory() {
        }
        StimFactory.prototype.buildStimulus = function (spec, context) {
            var params, stimType;
            stimType = _.keys(spec)[0];
            params = _.values(spec)[0];
            return this.makeStimulus(stimType, params, context);
        };
        StimFactory.prototype.buildResponse = function (spec, context) {
            var params, responseType;
            responseType = _.keys(spec)[0];
            params = _.values(spec)[0];
            return this.makeResponse(responseType, params, context);
        };
        StimFactory.prototype.buildEvent = function (spec, context) {
            var response, responseSpec, stim, stimSpec;
            if (spec.Next == null) {
                throw new Error('Event specification does not contain \'Next\' element');
            }
            stimSpec = _.omit(spec, 'Next');
            responseSpec = _.pick(spec, 'Next');
            stim = this.buildStimulus(stimSpec, context);
            response = this.buildResponse(responseSpec.Next, context);
            return this.makeEvent(stim, response, context);
        };
        StimFactory.prototype.makeStimulus = function (name, params, context) {
            throw new Error('unimplemented');
        };
        StimFactory.prototype.makeResponse = function (name, params, context) {
            throw new Error('unimplemented');
        };
        StimFactory.prototype.makeEvent = function (stim, response, context) {
            throw new Error('unimplemented');
        };
        return StimFactory;
    }();
    exports.MockStimFactory = MockStimFactory = function (_super) {
        __extends(MockStimFactory, _super);
        function MockStimFactory() {
            return MockStimFactory.__super__.constructor.apply(this, arguments);
        }
        MockStimFactory.prototype.makeStimulus = function (name, params, context) {
            var ret;
            ret = {};
            ret[name] = params;
            return ret;
        };
        MockStimFactory.prototype.makeResponse = function (name, params, context) {
            var ret;
            ret = {};
            ret[name] = params;
            return ret;
        };
        MockStimFactory.prototype.makeEvent = function (stim, response, context) {
            return [
                stim,
                response
            ];
        };
        return MockStimFactory;
    }(exports.StimFactory);
    TrialEnumerator = function () {
        function TrialEnumerator() {
        }
        TrialEnumerator.prototype.next = function (context) {
        };
        return TrialEnumerator;
    }();
    StaticTrialEnumerator = function (_super) {
        __extends(StaticTrialEnumerator, _super);
        function StaticTrialEnumerator(trialList) {
            this.trialList = trialList;
            this.index = 0;
        }
        StaticTrialEnumerator.prototype.next = function (context) {
            var len;
            len = this.trialList.length;
            if (this.index < this.len) {
                this.trialList[this.index];
                return this.index = this.index + 1;
            } else {
                throw new Error('TrialEnumerator: illegal index: ' + index + ' for list of trial of length ' + len);
            }
        };
        StaticTrialEnumerator.prototype.hasNext = function () {
            return this.index < this.trialList.length;
        };
        return StaticTrialEnumerator;
    }(TrialEnumerator);
    DynamicTrialEnumerator = function (_super) {
        __extends(DynamicTrialEnumerator, _super);
        function DynamicTrialEnumerator(generator, maxTrials) {
            this.generator = generator;
            this.maxTrials = maxTrials != null ? maxTrials : 10000;
            this.index = 0;
        }
        DynamicTrialEnumerator.prototype.next = function (context) {
            this.index = this.index + 1;
            if (this.index < this.maxTrials) {
                return this.generator(context);
            }
        };
        DynamicTrialEnumerator.prototype.hasNext = function () {
            return this.index < this.maxTrials;
        };
        return DynamicTrialEnumerator;
    }(TrialEnumerator);
    RunnableNode = function () {
        RunnableNode.functionList = function (nodes, context, callback) {
            return _.map(nodes, function (node) {
                return function (arg) {
                    context.handleResponse(arg);
                    if (callback != null) {
                        callback(node);
                    }
                    return node.start(context);
                };
            });
        };
        RunnableNode.chainFunctions = function (funArray) {
            var fun, result, _i, _len;
            result = Q.resolve(0);
            for (_i = 0, _len = funArray.length; _i < _len; _i++) {
                fun = funArray[_i];
                result = result.then(fun, function (err) {
                    return console.log('error stack: ', err.stack);
                });
            }
            return result;
        };
        function RunnableNode(children) {
            this.children = children;
        }
        RunnableNode.prototype.before = function (context) {
            return new FunctionNode(function () {
                return 0;
            });
        };
        RunnableNode.prototype.after = function (context) {
            return new FunctionNode(function () {
                return 0;
            });
        };
        RunnableNode.prototype.numChildren = function () {
            return this.children.length;
        };
        RunnableNode.prototype.length = function () {
            return this.children.length;
        };
        RunnableNode.prototype.start = function (context) {
            var farray;
            farray = RunnableNode.functionList(_.flatten([
                this.before(context),
                this.children,
                this.after(context)
            ]), context, function (node) {
                return console.log('node done', node);
            });
            return RunnableNode.chainFunctions(farray);
        };
        RunnableNode.prototype.stop = function (context) {
        };
        return RunnableNode;
    }();
    exports.RunnableNode = RunnableNode;
    exports.FunctionNode = FunctionNode = function (_super) {
        __extends(FunctionNode, _super);
        function FunctionNode(fun) {
            this.fun = fun;
        }
        FunctionNode.prototype.start = function (context) {
            return Q.fcall(this.fun);
        };
        return FunctionNode;
    }(RunnableNode);
    functionNode = function (fun) {
        return new FunctionNode(fun);
    };
    exports.FeedbackNode = FeedbackNode = function (_super) {
        __extends(FeedbackNode, _super);
        function FeedbackNode(feedback) {
            this.feedback = feedback;
        }
        FeedbackNode.prototype.numChildren = function () {
            return 1;
        };
        FeedbackNode.prototype.length = function () {
            return 1;
        };
        FeedbackNode.prototype.start = function (context) {
            var args, event, idSet, obj, spec, _i, _len;
            if (this.feedback != null) {
                args = context.trialData().get();
                idSet = {};
                for (_i = 0, _len = args.length; _i < _len; _i++) {
                    obj = args[_i];
                    if (obj['id'] != null) {
                        idSet[obj['id']] = obj;
                    }
                }
                args = _.extend(args, idSet);
                args.context = context;
                spec = this.feedback.apply(args);
                event = context.stimFactory.buildEvent(spec, context);
                return event.start(context);
            } else {
                return Q(0);
            }
        };
        return FeedbackNode;
    }(RunnableNode);
    exports.Event = Event = function (_super) {
        __extends(Event, _super);
        function Event(stimulus, response) {
            var node;
            this.stimulus = stimulus;
            this.response = response;
            node = {
                start: function (_this) {
                    return function (context) {
                        _this.stimulus.start(context);
                        return _this.response.start(context, stimulus);
                    };
                }(this)
            };
            Event.__super__.constructor.call(this, [node]);
        }
        Event.prototype.stop = function (context) {
            this.stimulus.stop(context);
            return this.response.stop(context);
        };
        Event.prototype.before = function (context) {
            var self;
            self = this;
            return functionNode(function (_this) {
                return function () {
                    if (!context.exState.inPrelude) {
                        context.updateState(function () {
                            return context.exState.nextEvent(self);
                        });
                    }
                    if (!_this.stimulus.overlay) {
                        return context.clearContent();
                    }
                };
            }(this));
        };
        Event.prototype.after = function (context) {
            return functionNode(function (_this) {
                return function () {
                    return _this.stimulus.stop(context);
                };
            }(this));
        };
        return Event;
    }(RunnableNode);
    exports.Trial = Trial = function (_super) {
        __extends(Trial, _super);
        function Trial(events, record, feedback, background) {
            if (events == null) {
                events = [];
            }
            this.record = record != null ? record : {};
            this.feedback = feedback;
            this.background = background;
            Trial.__super__.constructor.call(this, events);
        }
        Trial.prototype.numEvents = function () {
            return this.children.length;
        };
        Trial.prototype.push = function (event) {
            return this.children.push(event);
        };
        Trial.prototype.before = function (context) {
            var child, self, _i, _len, _ref;
            self = this;
            _ref = this.children;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                child = _ref[_i];
                console.log('initializing stimulus', child.stimulus);
                child.stimulus.initialize();
            }
            return functionNode(function (_this) {
                return function () {
                    context.updateState(function () {
                        return context.exState.nextTrial(self);
                    });
                    context.clearBackground();
                    if (_this.background != null) {
                        context.setBackground(_this.background);
                        return context.drawBackground();
                    }
                };
            }(this));
        };
        Trial.prototype.after = function (context) {
            return new FeedbackNode(this.feedback);
        };
        Trial.prototype.start = function (context, callback) {
            var farray;
            farray = RunnableNode.functionList(_.flatten([
                this.before(context),
                this.children,
                this.after(context)
            ]), context, function (event) {
                return console.log('event callback', event);
            });
            return RunnableNode.chainFunctions(farray);
        };
        Trial.prototype.stop = function (context) {
        };
        return Trial;
    }(RunnableNode);
    exports.Block = Block = function (_super) {
        __extends(Block, _super);
        function Block(children, blockSpec) {
            this.blockSpec = blockSpec;
            Block.__super__.constructor.call(this, children);
        }
        Block.prototype.showEvent = function (spec, context) {
            var event;
            event = context.stimFactory.buildEvent(spec, context);
            return event.start(context);
        };
        Block.prototype.before = function (context) {
            var self;
            self = this;
            return functionNode(function (_this) {
                return function () {
                    var args, spec;
                    context.updateState(function () {
                        return context.exState.nextBlock(self);
                    });
                    if (_this.blockSpec != null && _this.blockSpec.Start) {
                        args = _.extend(context.exState.toRecord(), { context: context });
                        spec = _this.blockSpec.Start.apply(args);
                        return _this.showEvent(spec, context);
                    } else {
                        return Q.fcall(0);
                    }
                };
            }(this));
        };
        Block.prototype.after = function (context) {
            return functionNode(function (_this) {
                return function () {
                    var args, blockData, curid, ids, out, spec, _i, _len;
                    if (_this.blockSpec != null && _this.blockSpec.End) {
                        blockData = context.blockData();
                        ids = _.unique(blockData.select('id'));
                        console.log('END ids', ids);
                        out = {};
                        for (_i = 0, _len = ids.length; _i < _len; _i++) {
                            curid = ids[_i];
                            out[curid] = DataTable.fromRecords(blockData.filter({ id: curid }).get());
                        }
                        args = _.extend(context.exState.toRecord(), { context: context }, out);
                        console.log('block end args');
                        spec = _this.blockSpec.End.apply(args);
                        return _this.showEvent(spec, context);
                    } else {
                        return Q.fcall(0);
                    }
                };
            }(this));
        };
        return Block;
    }(RunnableNode);
    exports.BlockSeq = BlockSeq = function (_super) {
        __extends(BlockSeq, _super);
        function BlockSeq(children) {
            BlockSeq.__super__.constructor.call(this, children);
        }
        return BlockSeq;
    }(RunnableNode);
    exports.Prelude = Prelude = function (_super) {
        __extends(Prelude, _super);
        function Prelude(children) {
            Prelude.__super__.constructor.call(this, children);
        }
        Prelude.prototype.before = function (context) {
            return functionNode(function (_this) {
                return function () {
                    return context.updateState(function () {
                        return context.exState.insidePrelude();
                    });
                };
            }(this));
        };
        Prelude.prototype.after = function (context) {
            return functionNode(function (_this) {
                return function () {
                    return context.updateState(function () {
                        return context.exState.outsidePrelude();
                    });
                };
            }(this));
        };
        return Prelude;
    }(RunnableNode);
    exports.Coda = Coda = function (_super) {
        __extends(Coda, _super);
        function Coda(children) {
            Coda.__super__.constructor.call(this, children);
        }
        return Coda;
    }(RunnableNode);
    exports.ExperimentState = ExperimentState = function () {
        function ExperimentState() {
            this.inPrelude = false;
            this.trial = {};
            this.block = {};
            this.event = {};
            this.blockNumber = 0;
            this.trialNumber = 0;
            this.eventNumber = 0;
            this.stimulus = {};
            this.response = {};
        }
        ExperimentState.prototype.insidePrelude = function () {
            var ret;
            ret = $.extend({}, this);
            ret.inPrelude = true;
            return ret;
        };
        ExperimentState.prototype.outsidePrelude = function () {
            var ret;
            ret = $.extend({}, this);
            ret.inPrelude = false;
            return ret;
        };
        ExperimentState.prototype.nextBlock = function (block) {
            var ret;
            ret = $.extend({}, this);
            ret.blockNumber = this.blockNumber + 1;
            ret.block = block;
            return ret;
        };
        ExperimentState.prototype.nextTrial = function (trial) {
            var ret;
            ret = $.extend({}, this);
            ret.trial = trial;
            ret.trialNumber = this.trialNumber + 1;
            return ret;
        };
        ExperimentState.prototype.nextEvent = function (event) {
            var ret;
            ret = $.extend({}, this);
            ret.event = event;
            ret.eventNumber = this.eventNumber + 1;
            return ret;
        };
        ExperimentState.prototype.toRecord = function () {
            var key, ret, value, _ref, _ref1, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
            ret = {
                blockNumber: this.blockNumber,
                trialNumber: this.trialNumber,
                eventNumber: this.eventNumber,
                stimulus: (_ref = this.event) != null ? (_ref1 = _ref.stimulus) != null ? (_ref2 = _ref1.constructor) != null ? _ref2.name : void 0 : void 0 : void 0,
                response: (_ref3 = this.event) != null ? (_ref4 = _ref3.response) != null ? (_ref5 = _ref4.constructor) != null ? _ref5.name : void 0 : void 0 : void 0,
                stimulusID: (_ref6 = this.event) != null ? (_ref7 = _ref6.stimulus) != null ? _ref7.id : void 0 : void 0,
                responseID: (_ref8 = this.event) != null ? (_ref9 = _ref8.response) != null ? _ref9.id : void 0 : void 0
            };
            if (!_.isEmpty(this.trial) && this.trial.record != null) {
                _ref10 = this.trial.record;
                for (key in _ref10) {
                    value = _ref10[key];
                    ret[key] = value;
                }
            }
            return ret;
        };
        return ExperimentState;
    }();
    createContext = function (id) {
        var stage;
        if (id == null) {
            id = 'container';
        }
        stage = new Kinetic.Stage({
            container: id,
            width: $('#' + id).width(),
            height: $('#' + id).height()
        });
        return new KineticContext(stage);
    };
    exports.createContext = createContext;
    exports.ExperimentContext = ExperimentContext = function () {
        function ExperimentContext(stimFactory) {
            this.variables = {};
            this.responseQueue = [];
            this.stimFactory = stimFactory;
            this.userData = TAFFY({});
            this.exState = new ExperimentState();
            this.eventData = new EventDataLog();
            this.log = [];
            this.trialNumber = 0;
            this.currentTrial = new Trial([], {});
            this.numBlocks = 0;
        }
        ExperimentContext.prototype.set = function (name, value) {
            return props.set(this.variables, name, value);
        };
        ExperimentContext.prototype.get = function (name) {
            return props.get(this.variables, name);
        };
        ExperimentContext.prototype.update = function (name, fun) {
            return this.set(name, fun(this.get(name)));
        };
        ExperimentContext.prototype.updateState = function (fun) {
            this.exState = fun(this.exState);
            return this.exState;
        };
        ExperimentContext.prototype.pushData = function (data, withState) {
            var record;
            if (withState == null) {
                withState = true;
            }
            console.log('pushing data', data);
            console.log('state', this.exState.toRecord());
            if (withState) {
                record = _.extend(this.exState.toRecord(), data);
            } else {
                record = data;
            }
            console.log('record', record);
            return this.userData.insert(record);
        };
        ExperimentContext.prototype.handleResponse = function (arg) {
            if (arg != null && arg instanceof ResponseData) {
                this.responseQueue.push(arg);
                console.log('pushing response', arg.data);
                return this.pushData(arg.data);
            }
        };
        ExperimentContext.prototype.width = function () {
            return 0;
        };
        ExperimentContext.prototype.height = function () {
            return 0;
        };
        ExperimentContext.prototype.offsetX = function () {
            return 0;
        };
        ExperimentContext.prototype.offsetY = function () {
            return 0;
        };
        ExperimentContext.prototype.centerX = function () {
            return this.width() / 2 + this.offsetX();
        };
        ExperimentContext.prototype.centerY = function () {
            return this.height() / 2 + this.offsetY();
        };
        ExperimentContext.prototype.screenInfo = function () {
            return {
                width: this.width(),
                height: this.height(),
                offset: {
                    x: this.offsetX(),
                    y: this.offsetY()
                },
                center: {
                    x: this.centerX(),
                    y: this.centerY()
                }
            };
        };
        ExperimentContext.prototype.logEvent = function (key, value) {
            var record;
            record = _.clone(this.currentTrial.record);
            record[key] = value;
            this.log.push(record);
            return console.log(this.log);
        };
        ExperimentContext.prototype.trialData = function () {
            var ret;
            ret = this.userData().filter({ trialNumber: this.exState.trialNumber });
            if (ret.length === 1) {
                return ret[0];
            } else {
                return ret;
            }
        };
        ExperimentContext.prototype.blockData = function (args) {
            if (args == null) {
                args = {
                    blockNum: null,
                    name: null
                };
            }
            if (args.blockNum == null) {
                args.blockNum = this.exState.blockNumber;
            }
            if (!args.name) {
                return this.userData().filter({ blockNumber: args.blockNum });
            } else {
                return this.userData().filter({ blockNumber: args.blockNum }).select(args.name);
            }
        };
        ExperimentContext.prototype.allData = function (args) {
            if (args == null) {
                args = { name: null };
            }
            if (!args.name) {
                return this.userData();
            } else {
                return this.userData().select(args.name);
            }
        };
        ExperimentContext.prototype.showEvent = function (event) {
            return event.start(this);
        };
        ExperimentContext.prototype.findByID = function (id) {
        };
        ExperimentContext.prototype.findByName = function (name) {
        };
        ExperimentContext.prototype.showStimulus = function (stimulus) {
            var p;
            p = stimulus.render(this);
            p.present(this);
            console.log('show Stimulus, drawing');
            return this.draw();
        };
        ExperimentContext.prototype.start = function (blockList) {
            var error, farray;
            this.numBlocks = blockList.length();
            try {
                farray = RunnableNode.functionList(blockList, this, function (block) {
                    return console.log('block callback', block);
                });
                return RunnableNode.chainFunctions(farray);
            } catch (_error) {
                error = _error;
                return console.log('caught error:', error);
            }
        };
        ExperimentContext.prototype.clearContent = function () {
        };
        ExperimentContext.prototype.clearBackground = function () {
        };
        ExperimentContext.prototype.keydownStream = function () {
            return Bacon.fromEventTarget(window, 'keydown');
        };
        ExperimentContext.prototype.keypressStream = function () {
            return Bacon.fromEventTarget(window, 'keypress');
        };
        ExperimentContext.prototype.mousepressStream = function () {
        };
        ExperimentContext.prototype.draw = function () {
        };
        ExperimentContext.prototype.insertHTMLDiv = function () {
            $('canvas').css('position', 'absolute');
            $('#container').append('<div id="htmlcontainer" class="htmllayer"></div>');
            $('#htmlcontainer').css({
                position: 'absolute',
                'z-index': 999,
                outline: 'none',
                padding: '5px'
            });
            $('#container').attr('tabindex', 0);
            return $('#container').css('outline', 'none');
        };
        ExperimentContext.prototype.clearHtml = function () {
            $('#htmlcontainer').empty();
            return $('#htmlcontainer').hide();
        };
        ExperimentContext.prototype.appendHtml = function (input) {
            $('#htmlcontainer').addClass('htmllayer');
            $('#htmlcontainer').append(input);
            return $('#htmlcontainer').show();
        };
        ExperimentContext.prototype.hideHtml = function () {
            return $('#htmlcontainer').hide();
        };
        return ExperimentContext;
    }();
    KineticContext = function (_super) {
        __extends(KineticContext, _super);
        function KineticContext(stage) {
            this.stage = stage;
            KineticContext.__super__.constructor.call(this, new DefaultComponentFactory());
            this.contentLayer = new Kinetic.Layer({ clearBeforeDraw: true });
            this.backgroundLayer = new Kinetic.Layer({ clearBeforeDraw: true });
            this.background = new Background([], { fill: 'white' });
            this.stage.add(this.backgroundLayer);
            this.stage.add(this.contentLayer);
            this.insertHTMLDiv();
        }
        KineticContext.prototype.insertHTMLDiv = function () {
            KineticContext.__super__.insertHTMLDiv.apply(this, arguments);
            return $('.kineticjs-content').css('position', 'absolute');
        };
        KineticContext.prototype.setBackground = function (newBackground) {
            var p;
            this.background = newBackground;
            this.backgroundLayer.removeChildren();
            p = this.background.render(this);
            return p.present(this, this.backgroundLayer);
        };
        KineticContext.prototype.drawBackground = function () {
            return this.backgroundLayer.draw();
        };
        KineticContext.prototype.clearBackground = function () {
            return this.backgroundLayer.removeChildren();
        };
        KineticContext.prototype.clearContent = function (draw) {
            if (draw == null) {
                draw = false;
            }
            this.clearHtml();
            this.backgroundLayer.draw();
            this.contentLayer.removeChildren();
            if (draw) {
                return this.draw();
            }
        };
        KineticContext.prototype.draw = function () {
            $('#container').focus();
            return this.contentLayer.draw();
        };
        KineticContext.prototype.width = function () {
            return this.stage.getWidth();
        };
        KineticContext.prototype.height = function () {
            return this.stage.getHeight();
        };
        KineticContext.prototype.offsetX = function () {
            return this.stage.getOffsetX();
        };
        KineticContext.prototype.offsetY = function () {
            return this.stage.getOffsetY();
        };
        KineticContext.prototype.showStimulus = function (stimulus) {
            var p;
            p = stimulus.render(this);
            p.present(this);
            console.log('show Stimulus, drawing');
            return this.draw();
        };
        KineticContext.prototype.findByID = function (id) {
            var i, _i, _len, _results;
            if (_.isArray(id)) {
                _results = [];
                for (_i = 0, _len = id.length; _i < _len; _i++) {
                    i = id[_i];
                    if (i != null) {
                        _results.push(this.stage.find('#' + i));
                    }
                }
                return _results;
            } else {
                return this.stage.find('#' + id);
            }
        };
        KineticContext.prototype.keydownStream = function () {
            return Bacon.fromEventTarget(window, 'keydown');
        };
        KineticContext.prototype.keypressStream = function () {
            return Bacon.fromEventTarget(window, 'keypress');
        };
        KineticContext.prototype.mousepressStream = function () {
            var MouseBus;
            MouseBus = function () {
                function MouseBus() {
                    this.stream = new Bacon.Bus();
                    this.handler = function (_this) {
                        return function (x) {
                            return _this.stream.push(x);
                        };
                    }(this);
                    this.stage.on('mousedown', this.handler);
                }
                MouseBus.prototype.stop = function () {
                    this.stage.off('mousedown', this.handler);
                    return this.stream.end();
                };
                return MouseBus;
            }();
            return new MouseBus();
        };
        return KineticContext;
    }(exports.ExperimentContext);
    exports.KineticContext = KineticContext;
    buildTrial = function (eventSpec, record, context, feedback, backgroundSpec) {
        var background, events, key, value;
        events = function () {
            var _results;
            _results = [];
            for (key in eventSpec) {
                value = eventSpec[key];
                _results.push(context.stimFactory.buildEvent(value));
            }
            return _results;
        }();
        if (backgroundSpec != null) {
            background = context.stimFactory.makeStimulus('Background', backgroundSpec);
            return new Trial(events, record, feedback, background);
        } else {
            return new Trial(events, record, feedback);
        }
    };
    makeEventSeq = function (spec, context) {
        var key, value, _results;
        _results = [];
        for (key in spec) {
            value = spec[key];
            _results.push(context.stimFactory.buildEvent(value));
        }
        return _results;
    };
    buildPrelude = function (preludeSpec, context) {
        var events;
        events = makeEventSeq(preludeSpec, context);
        return new Prelude(events);
    };
    buildCoda = function (codaSpec, context) {
        var events;
        events = makeEventSeq(codaSpec, context);
        return new Coda(events);
    };
    __dummySpec = {
        Events: {
            1: {
                Nothing: '',
                Next: { Timeout: { duration: 0 } }
            }
        }
    };
    exports.Presenter = Presenter = function () {
        function Presenter(trialList, display, context) {
            this.trialList = trialList;
            this.display = display;
            this.context = context;
            this.trialBuilder = this.display.Trial;
            this.prelude = this.display.Prelude != null ? buildPrelude(this.display.Prelude.Events, this.context) : buildPrelude(__dummySpec.Events, this.context);
            this.coda = this.display.Coda != null ? buildCoda(this.display.Coda.Events, this.context) : buildCoda(__dummySpec.Events, this.context);
            this.variables = this.display.Define != null ? this.context.variables = this.display.Define : void 0;
        }
        Presenter.prototype.start = function () {
            var args, block, record, trialNum, trialSpec, trials;
            this.blockList = new BlockSeq(function () {
                var _i, _len, _ref, _results;
                _ref = this.trialList.blocks;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    block = _ref[_i];
                    console.log('building block', block);
                    trials = function () {
                        var _j, _ref1, _results1;
                        _results1 = [];
                        for (trialNum = _j = 0, _ref1 = block.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; trialNum = 0 <= _ref1 ? ++_j : --_j) {
                            record = _.clone(block[trialNum]);
                            args = {};
                            args.trial = record;
                            args.screen = this.context.screenInfo();
                            trialSpec = this.trialBuilder.apply(args);
                            _results1.push(buildTrial(trialSpec.Events, record, this.context, trialSpec.Feedback, trialSpec.Background));
                        }
                        return _results1;
                    }.call(this);
                    _results.push(new Block(trials, this.display.Block));
                }
                return _results;
            }.call(this));
            return this.prelude.start(this.context).then(function (_this) {
                return function () {
                    return _this.blockList.start(_this.context);
                };
            }(this)).then(function (_this) {
                return function () {
                    console.log('inside coda');
                    return _this.coda.start(_this.context);
                };
            }(this));
        };
        return Presenter;
    }();
    exports.letters = [
        'a',
        'b',
        'c',
        'd',
        'e',
        'd',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z'
    ];
    exports.buildTrial = buildTrial;
    exports.buildPrelude = buildPrelude;
}.call(this));
});
require.define('72', function(module, exports, __dirname, __filename, undefined){
(function () {
    var ActionPresentable, AutoResponse, Component, ContainerDrawable, Drawable, GraphicalStimulus, KineticDrawable, KineticStimulus, Presentable, Q, Reaction, Response, ResponseData, Stimulus, lay, match, signals, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    _ = require('16', module);
    lay = require('73', module);
    signals = require('116', module);
    Q = require('17', module);
    match = require('19', module).match;
    exports.Reaction = Reaction = function () {
        function Reaction(signal, callback, id) {
            this.signal = signal;
            this.callback = callback;
            this.id = id != null ? id : null;
        }
        Reaction.prototype.bind = function (node) {
            if (this.id != null) {
                return '';
            }
        };
        return Reaction;
    }();
    exports.Component = Component = function () {
        Component.prototype.standardDefaults = {};
        Component.prototype.defaults = {};
        Component.prototype.signals = [];
        Component.prototype.hasChildren = function () {
            return false;
        };
        Component.prototype.getChildren = function () {
            return [];
        };
        function Component(spec) {
            if (spec == null) {
                spec = {};
            }
            signals.convert(this);
            this.spec = _.defaults(spec, this.defaults);
            this.spec = _.defaults(spec, this.standardDefaults);
            this.spec = _.omit(this.spec, function (value, key) {
                return value == null;
            });
            this.name = this.constructor.name;
            this.initialize();
        }
        Component.prototype.initialize = function () {
        };
        Component.prototype.start = function (context) {
        };
        Component.prototype.stop = function (context) {
        };
        return Component;
    }();
    exports.Stimulus = Stimulus = function (_super) {
        __extends(Stimulus, _super);
        Stimulus.prototype.standardDefaults = { react: {} };
        function Stimulus(spec) {
            if (spec == null) {
                spec = {};
            }
            Stimulus.__super__.constructor.call(this, spec);
        }
        Stimulus.prototype.initialize = function () {
            var _ref;
            if (((_ref = this.spec) != null ? _ref.id : void 0) != null) {
                this.id = this.spec.id;
            } else {
                this.id = _.uniqueId('stim_');
            }
            this.stopped = false;
            return this.react = this.spec.react || {};
        };
        Stimulus.prototype.initReactions = function (self) {
            var key, value, _ref, _results;
            _ref = this.react;
            _results = [];
            for (key in _ref) {
                value = _ref[key];
                if (_.isFunction(value)) {
                    _results.push(this.addReaction(key, value));
                } else {
                    _results.push(this.addReaction(key, value.callback, value.selector));
                }
            }
            return _results;
        };
        Stimulus.prototype.addReaction = function (name, fun, selector) {
            var child, _i, _len, _ref, _results;
            if (selector == null) {
                return this.on(name, fun);
            } else {
                if (selector.id === this.id) {
                    return this.on(name, fun);
                } else if (this.hasChildren()) {
                    _ref = this.getChildren();
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        child = _ref[_i];
                        _results.push(child.addReaction(name, fun, selector));
                    }
                    return _results;
                }
            }
        };
        Stimulus.prototype.get = function (name) {
            return this.spec[name];
        };
        Stimulus.prototype.set = function (name, value) {
            return this.spec[name] = value;
        };
        Stimulus.prototype.reset = function () {
            return this.stopped = false;
        };
        Stimulus.prototype.render = function (context, layer) {
        };
        Stimulus.prototype.start = function (context) {
            var p;
            p = this.render(context);
            p.present(context);
            return context.draw();
        };
        Stimulus.prototype.stop = function (context) {
            return this.stopped = true;
        };
        return Stimulus;
    }(exports.Component);
    exports.GraphicalStimulus = GraphicalStimulus = function (_super) {
        __extends(GraphicalStimulus, _super);
        GraphicalStimulus.prototype.standardDefaults = {
            x: 0,
            y: 0,
            origin: 'top-left'
        };
        function GraphicalStimulus(spec) {
            if (spec == null) {
                spec = {};
            }
            if (spec.layout != null) {
                this.layout = spec.layout;
            } else {
                this.layout = new lay.AbsoluteLayout();
            }
            this.overlay = false;
            GraphicalStimulus.__super__.constructor.call(this, spec);
        }
        GraphicalStimulus.prototype.drawable = function (knode) {
            return function (context) {
                return console.log('GraphicalStimulus: drawable, no op');
            };
        };
        GraphicalStimulus.prototype.toPixels = function (arg, dim) {
            return lay.toPixels(arg, dim);
        };
        GraphicalStimulus.prototype.defaultOrigin = 'top-left';
        GraphicalStimulus.prototype.xyoffset = function (origin, nodeWidth, nodeHeight) {
            if (this.defaultOrigin === 'top-left') {
                switch (origin) {
                case 'center':
                    return [
                        -nodeWidth / 2,
                        -nodeHeight / 2
                    ];
                case 'center-left' || 'left-center':
                    return [
                        0,
                        -nodeHeight / 2
                    ];
                case 'center-right' || 'right-center':
                    return [
                        -nodeWidth,
                        -nodeHeight / 2
                    ];
                case 'top-left' || 'left-top':
                    return [
                        0,
                        0
                    ];
                case 'top-right' || 'right-top':
                    return [
                        -nodeWidth,
                        0
                    ];
                case 'top-center' || 'center-top':
                    return [
                        -nodeWidth / 2,
                        0
                    ];
                case 'bottom-left' || 'left-bottom':
                    return [
                        0,
                        -nodeHeight
                    ];
                case 'bottom-right' || 'right-bottom':
                    return [
                        -nodeWidth,
                        -nodeHeight
                    ];
                case 'bottom-center' || 'center-bottom':
                    return [
                        -nodeWidth / 2,
                        -nodeHeight
                    ];
                default:
                    throw new Error('failed to match \'origin\' argument:', origin);
                }
            } else if (this.defaultOrigin === 'center') {
                switch (origin) {
                case 'center':
                    return [
                        0,
                        0
                    ];
                case 'center-left' || 'left-center':
                    return [
                        nodeWidth / 2,
                        0
                    ];
                case 'center-right' || 'right-center':
                    return [
                        -nodeWidth / 2,
                        0
                    ];
                case 'top-left' || 'left-top':
                    return [
                        nodeWidth / 2,
                        nodeHeight / 2
                    ];
                case 'top-right' || 'right-top':
                    return [
                        -nodeWidth / 2,
                        nodeHeight / 2
                    ];
                case 'top-center' || 'center-top':
                    return [
                        0,
                        nodeHeight / 2
                    ];
                case 'bottom-left' || 'left-bottom':
                    return [
                        nodeWidth / 2,
                        -nodeHeight / 2
                    ];
                case 'bottom-right' || 'right-bottom':
                    return [
                        -nodeWidth / 2,
                        -nodeHeight / 2
                    ];
                case 'bottom-center' || 'center-bottom':
                    return [
                        0,
                        -nodeHeight / 2
                    ];
                default:
                    throw new Error('failed to match \'origin\' argument:', origin);
                }
            } else {
                throw new Error('failed to match \'origin\' argument:', this.defaultOrigin);
            }
        };
        GraphicalStimulus.prototype.computeCoordinates = function (context, position, nodeWidth, nodeHeight) {
            var xy, xyoff;
            if (nodeWidth == null) {
                nodeWidth = 0;
            }
            if (nodeHeight == null) {
                nodeHeight = 0;
            }
            xy = function () {
                if (position != null) {
                    return this.layout.computePosition([
                        context.width(),
                        context.height()
                    ], position);
                } else if (this.spec.x != null && this.spec.y != null) {
                    return [
                        this.layout.convertToCoordinate(this.spec.x, context.width()),
                        this.layout.convertToCoordinate(this.spec.y, context.height())
                    ];
                } else {
                    throw new Error('computeCoordinates: either \'position\' constraint or \'x\',\'y\' coordinates must be defined');
                }
            }.call(this);
            if (this.spec.origin != null) {
                xyoff = this.xyoffset(this.spec.origin, nodeWidth, nodeHeight);
                xy[0] = xy[0] + xyoff[0];
                xy[1] = xy[1] + xyoff[1];
            }
            return xy;
        };
        GraphicalStimulus.prototype.width = function () {
            return 0;
        };
        GraphicalStimulus.prototype.height = function () {
            return 0;
        };
        GraphicalStimulus.prototype.bounds = function () {
            return {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
        };
        return GraphicalStimulus;
    }(exports.Stimulus);
    KineticStimulus = function (_super) {
        __extends(KineticStimulus, _super);
        function KineticStimulus() {
            return KineticStimulus.__super__.constructor.apply(this, arguments);
        }
        KineticStimulus.prototype.presentable = function (parent, node, onPresent) {
            return new KineticDrawable(parent, node, onPresent);
        };
        KineticStimulus.nodeSize = function (node) {
            if (node.getClassName() === 'Group') {
                return KineticStimulus.groupSize(node);
            } else {
                return {
                    width: node.getWidth(),
                    height: node.getHeight()
                };
            }
        };
        KineticStimulus.nodePosition = function (node) {
            var xb, yb;
            if (node.getClassName() === 'Group') {
                xb = KineticStimulus.groupXBounds(node);
                yb = KineticStimulus.groupYBounds(node);
                return {
                    x: xb[0],
                    y: yb[0]
                };
            } else {
                return {
                    x: node.getX(),
                    y: node.getY()
                };
            }
        };
        KineticStimulus.groupSize = function (group) {
            var xb, yb;
            xb = this.groupXBounds(group);
            yb = this.groupYBounds(group);
            return {
                width: xb[1] - xb[0],
                height: yb[1] - yb[0]
            };
        };
        KineticStimulus.groupXBounds = function (group) {
            var children, i, pos, xmax, xmin, _i, _ref;
            children = group.getChildren();
            xmin = Number.MAX_VALUE;
            xmax = -1;
            for (i = _i = 0, _ref = children.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                pos = children[i].getAbsolutePosition();
                if (pos.x < xmin) {
                    xmin = pos.x;
                }
                if (pos.x + children[i].getWidth() > xmax) {
                    xmax = pos.x + children[i].getWidth();
                }
            }
            return [
                xmin,
                xmax
            ];
        };
        KineticStimulus.groupYBounds = function (group) {
            var children, i, pos, ymax, ymin, _i, _ref;
            children = group.getChildren();
            ymin = Number.MAX_VALUE;
            ymax = -1;
            for (i = _i = 0, _ref = children.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                pos = children[i].getAbsolutePosition();
                if (pos.y < ymin) {
                    ymin = children[i].getY();
                }
                if (pos.y + children[i].getHeight() > ymax) {
                    ymax = pos.y + children[i].getHeight();
                }
            }
            return [
                ymin,
                ymax
            ];
        };
        KineticStimulus.groupPosition = function (group) {
            var children, i, pos, x, y, _i, _ref;
            children = group.getChildren();
            if (children.length === 0) {
                return {
                    x: 0,
                    y: 0
                };
            } else {
                x = Number.MAX_VALUE;
                y = -1;
                pos = children[i].getAbsolutePosition();
                for (i = _i = 0, _ref = children.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    if (pos.x < x) {
                        x = pos.x;
                    }
                    if (pos.y < y) {
                        y = pos.y;
                    }
                }
                return {
                    x: x + group.getX(),
                    y: y + group.getY()
                };
            }
        };
        return KineticStimulus;
    }(exports.GraphicalStimulus);
    exports.Presentable = Presentable = function () {
        function Presentable() {
        }
        Presentable.prototype.present = function (context) {
        };
        return Presentable;
    }();
    exports.ActionPresentable = ActionPresentable = function (_super) {
        __extends(ActionPresentable, _super);
        function ActionPresentable(action) {
            this.action = action;
            console.log('constructiong action presentable, action is', this.action);
        }
        ActionPresentable.prototype.present = function (context) {
            console.log('inside action presentable, context is', context, 'action is', this.action);
            return this.action(context);
        };
        return ActionPresentable;
    }(exports.Presentable);
    exports.Drawable = Drawable = function (_super) {
        __extends(Drawable, _super);
        function Drawable() {
            return Drawable.__super__.constructor.apply(this, arguments);
        }
        Drawable.prototype.present = function (context) {
        };
        Drawable.prototype.x = function () {
            return 0;
        };
        Drawable.prototype.y = function () {
            return 0;
        };
        Drawable.prototype.width = function () {
            return 0;
        };
        Drawable.prototype.height = function () {
            return 0;
        };
        Drawable.prototype.bounds = function () {
            return {
                x: this.x(),
                y: this.y(),
                width: this.width(),
                height: this.height()
            };
        };
        return Drawable;
    }(exports.Presentable);
    exports.KineticDrawable = KineticDrawable = function (_super) {
        __extends(KineticDrawable, _super);
        function KineticDrawable(parent, node, onPresent) {
            this.parent = parent;
            this.node = node;
            this.onPresent = onPresent;
        }
        KineticDrawable.prototype.addListeners = function (context) {
            var callback, e, eventTypes, outer, _i, _len, _results;
            eventTypes = [
                'click',
                'mouseover',
                'mousedown',
                'mouseenter',
                'mouseleave',
                'mousemove',
                'mousedown',
                'mouseup',
                'dblclick',
                'dragstart',
                'dragend'
            ];
            outer = this;
            _results = [];
            for (_i = 0, _len = eventTypes.length; _i < _len; _i++) {
                e = eventTypes[_i];
                if (this.parent.spec[e] != null) {
                    callback = this.parent.spec[e];
                    _results.push(this.node.on(e, function (_this) {
                        return function (evt) {
                            return callback(outer, context, evt);
                        };
                    }(this)));
                } else {
                    _results.push(void 0);
                }
            }
            return _results;
        };
        KineticDrawable.prototype.find = function (selector) {
            return this.node.find(selector);
        };
        KineticDrawable.prototype.present = function (context, layer) {
            this.addListeners(context);
            if (layer == null) {
                context.contentLayer.add(this.node);
            } else {
                layer.add(this.node);
            }
            if (this.onPresent != null) {
                return this.onPresent(context);
            }
        };
        KineticDrawable.prototype.set = function (name, value) {
            return this.node[name](value);
        };
        KineticDrawable.prototype.x = function () {
            return KineticStimulus.nodePosition(this.node).x;
        };
        KineticDrawable.prototype.y = function () {
            return KineticStimulus.nodePosition(this.node).y;
        };
        KineticDrawable.prototype.xmax = function () {
            return KineticStimulus.nodePosition(this.node).x + KineticStimulus.nodeSize(this.node).width;
        };
        KineticDrawable.prototype.ymax = function () {
            return KineticStimulus.nodePosition(this.node).y + KineticStimulus.nodeSize(this.node).height;
        };
        KineticDrawable.prototype.width = function () {
            return this.xmax() - this.x();
        };
        KineticDrawable.prototype.height = function () {
            return this.ymax() - this.y();
        };
        return KineticDrawable;
    }(exports.Drawable);
    exports.ContainerDrawable = ContainerDrawable = function (_super) {
        __extends(ContainerDrawable, _super);
        function ContainerDrawable(nodes) {
            this.nodes = nodes;
            console.log('creating container drawable');
        }
        ContainerDrawable.prototype.present = function (context, layer) {
            var node, _i, _len, _ref, _results;
            _ref = this.nodes;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                node = _ref[_i];
                if (!layer) {
                    _results.push(node.present(context));
                } else {
                    _results.push(node.present(context, layer));
                }
            }
            return _results;
        };
        return ContainerDrawable;
    }(exports.Drawable);
    exports.Response = Response = function (_super) {
        __extends(Response, _super);
        function Response() {
            return Response.__super__.constructor.apply(this, arguments);
        }
        Response.prototype.start = function (context, stimulus) {
            return this.activate(context, stimulus);
        };
        Response.prototype.activate = function (context, stimulus) {
            return console.log('Response.activate', context, stimulus);
        };
        return Response;
    }(exports.Stimulus);
    exports.AutoResponse = AutoResponse = function (_super) {
        __extends(AutoResponse, _super);
        function AutoResponse() {
            return AutoResponse.__super__.constructor.apply(this, arguments);
        }
        AutoResponse.prototype.activate = function (context, stimulus) {
            return Q({});
        };
        return AutoResponse;
    }(exports.Response);
    exports.ResponseData = ResponseData = function () {
        function ResponseData(data) {
            this.data = data;
        }
        return ResponseData;
    }();
    exports.KineticStimulus = KineticStimulus;
}.call(this));
});
require.define('79', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Background, ContainerDrawable, GStimulus, KineticDrawable, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    GStimulus = require('72', module).GraphicalStimulus;
    KineticDrawable = require('72', module).KineticDrawable;
    ContainerDrawable = require('72', module).ContainerDrawable;
    _ = require('16', module);
    Background = function (_super) {
        __extends(Background, _super);
        function Background(stims, fill) {
            this.stims = stims != null ? stims : [];
            this.fill = fill != null ? fill : 'white';
            Background.__super__.constructor.call(this, {}, {});
            if (!_.isArray(this.stims)) {
                this.stims = [this.stims];
            }
        }
        Background.prototype.render = function (context) {
            var background, drawables, stim, _i, _len, _ref;
            background = new Kinetic.Rect({
                x: 0,
                y: 0,
                width: context.width(),
                height: context.height(),
                name: 'background',
                fill: this.fill
            });
            drawables = [];
            drawables.push(new KineticDrawable(this, background));
            _ref = this.stims;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                stim = _ref[_i];
                drawables.push(stim.render(context));
            }
            return new ContainerDrawable(drawables);
        };
        return Background;
    }(GStimulus);
    exports.Background = Background;
}.call(this));
});
require.define('70', function(module, exports, __dirname, __filename, undefined){
(function () {
    var DataTable, csv, loadTable, utils, _, __slice = [].slice, __hasProp = {}.hasOwnProperty;
    _ = require('16', module);
    utils = require('69', module);
    csv = require('18', module);
    loadTable = function (url) {
        var data, records;
        data = $.ajax({
            url: url,
            dataType: 'text',
            async: false
        }).responseText;
        records = csv.toObjects(data);
        return DataTable.fromRecords(records);
    };
    DataTable = function () {
        function DataTable(vars) {
            var key, samelen, value, varlen;
            if (vars == null) {
                vars = {};
            }
            varlen = _.map(vars, function (x) {
                return x.length;
            });
            samelen = _.all(varlen, function (x) {
                return x === varlen[0];
            });
            if (!samelen) {
                throw 'arguments to DataTable must all have same length.';
            }
            for (key in vars) {
                value = vars[key];
                this[key] = value;
            }
        }
        DataTable.prototype.show = function () {
            var i, _i, _ref, _results;
            console.log('DataTable: rows: ' + this.nrow() + ' columns: ' + this.ncol());
            _results = [];
            for (i = _i = 0, _ref = this.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                _results.push(console.log(this.record(i)));
            }
            return _results;
        };
        DataTable.fromRecords = function (records, union) {
            var allkeys, key, rec, vars, _i, _j, _k, _len, _len1, _len2;
            if (union == null) {
                union = true;
            }
            if (!_.isArray(records)) {
                throw new Error('DataTable.fromRecords: \'records\' arguemnt must be an array of records.');
            }
            allkeys = _.uniq(_.flatten(_.map(records, function (rec) {
                return _.keys(rec);
            })));
            vars = {};
            for (_i = 0, _len = allkeys.length; _i < _len; _i++) {
                key = allkeys[_i];
                vars[key] = [];
            }
            for (_j = 0, _len1 = records.length; _j < _len1; _j++) {
                rec = records[_j];
                for (_k = 0, _len2 = allkeys.length; _k < _len2; _k++) {
                    key = allkeys[_k];
                    if (rec[key] != null) {
                        vars[key].push(rec[key]);
                    } else {
                        vars[key].push(null);
                    }
                }
            }
            return new DataTable(vars);
        };
        DataTable.build = function (vars) {
            if (vars == null) {
                vars = {};
            }
            return Object.seal(new DataTable(vars));
        };
        DataTable.rbind = function () {
            var i, otab, others, _i, _ref;
            others = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            console.log('length of others', others.length);
            otab = others[0];
            for (i = _i = 1, _ref = others.length; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
                console.log('rbinding ', i);
                otab = DataTable.rbind2(otab, others[i]);
            }
            return otab;
        };
        DataTable.rbind2 = function (tab1, tab2, union) {
            var col1, col2, keys1, keys2, name, out, sharedKeys, _i, _len;
            if (union == null) {
                union = false;
            }
            keys1 = _.keys(tab1);
            keys2 = _.keys(tab2);
            sharedKeys = union ? _.union(keys1, keys2) : _.intersection(keys1, keys2);
            out = {};
            for (_i = 0, _len = sharedKeys.length; _i < _len; _i++) {
                name = sharedKeys[_i];
                col1 = tab1[name];
                col2 = tab2[name];
                if (!col1) {
                    col1 = utils.repLen([null], tab1.nrow());
                }
                if (!col2) {
                    col2 = utils.repLen([null], tab2.nrow());
                }
                out[name] = col1.concat(col2);
            }
            return new DataTable(out);
        };
        DataTable.cbind = function (tab1, tab2) {
            var diffkeys, key, out, _i, _len;
            if (tab1.nrow() !== tab2.nrow()) {
                throw 'cbind requires arguments to have same number of rows';
            }
            out = _.cloneDeep(tab1);
            diffkeys = _.difference(_.keys(tab2), _.keys(tab1));
            for (_i = 0, _len = diffkeys.length; _i < _len; _i++) {
                key = diffkeys[_i];
                out[key] = tab2[key];
            }
            return out;
        };
        DataTable.expand = function (vars, unique, nreps) {
            var d, i, key, name, nargs, nm, nx, orep, out, r1, r2, r3, repfac, value, _i, _j, _results;
            if (vars == null) {
                vars = {};
            }
            if (unique == null) {
                unique = true;
            }
            if (nreps == null) {
                nreps = 1;
            }
            if (unique) {
                out = {};
                for (name in vars) {
                    value = vars[name];
                    out[name] = _.unique(value);
                }
                vars = out;
            }
            nargs = _.size(vars);
            nm = _.keys(vars);
            repfac = 1;
            d = _.map(vars, function (x) {
                return x.length;
            });
            orep = _.reduce(d, function (x, acc) {
                return x * acc;
            });
            out = {};
            for (key in vars) {
                value = vars[key];
                nx = value.length;
                orep = orep / nx;
                r1 = utils.rep([repfac], nx);
                r2 = utils.rep(function () {
                    _results = [];
                    for (var _i = 0; 0 <= nx ? _i < nx : _i > nx; 0 <= nx ? _i++ : _i--) {
                        _results.push(_i);
                    }
                    return _results;
                }.apply(this), r1);
                r3 = utils.rep(r2, orep);
                out[key] = function () {
                    var _j, _len, _results1;
                    _results1 = [];
                    for (_j = 0, _len = r3.length; _j < _len; _j++) {
                        i = r3[_j];
                        _results1.push(value[i]);
                    }
                    return _results1;
                }();
                repfac = repfac * nx;
            }
            if (nreps > 1) {
                for (i = _j = 1; 1 <= nreps ? _j <= nreps : _j >= nreps; i = 1 <= nreps ? ++_j : --_j) {
                    out = _.merge(out, out);
                }
            }
            return new DataTable(out);
        };
        DataTable.prototype.splitBy = function (fac) {
            var i, index, indexArray, lev, levs, out, rset, _i, _j, _len, _ref;
            if (fac.length !== this.nrow()) {
                throw new Error('splitBy: length \'fac\' array must eqaul number of rows in data table');
            }
            levs = _.uniq(fac).sort();
            indexArray = [];
            for (i = _i = 0, _ref = this.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                lev = fac[i];
                if (indexArray[lev] != null) {
                    indexArray[lev].push(i);
                } else {
                    indexArray[lev] = [i];
                }
            }
            out = [];
            for (index = _j = 0, _len = levs.length; _j < _len; index = ++_j) {
                lev = levs[index];
                rset = function () {
                    var _k, _len1, _ref1, _results;
                    _ref1 = indexArray[lev];
                    _results = [];
                    for (_k = 0, _len1 = _ref1.length; _k < _len1; _k++) {
                        i = _ref1[_k];
                        _results.push(this.record(i));
                    }
                    return _results;
                }.call(this);
                out[lev] = DataTable.fromRecords(rset);
            }
            return out;
        };
        DataTable.prototype.dropColumn = function (colname) {
            var key, out, value;
            out = {};
            for (key in this) {
                if (!__hasProp.call(this, key))
                    continue;
                value = this[key];
                if (key !== colname) {
                    out[key] = _.clone(value);
                }
            }
            return new DataTable(out);
        };
        DataTable.prototype.subset = function (key, filter) {
            var el, i, keep, name, out, val, value;
            keep = function () {
                var _i, _len, _ref, _results;
                _ref = this[key];
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    val = _ref[_i];
                    if (filter(val)) {
                        _results.push(true);
                    } else {
                        _results.push(false);
                    }
                }
                return _results;
            }.call(this);
            out = {};
            for (name in this) {
                if (!__hasProp.call(this, name))
                    continue;
                value = this[name];
                out[name] = function () {
                    var _i, _len, _results;
                    _results = [];
                    for (i = _i = 0, _len = value.length; _i < _len; i = ++_i) {
                        el = value[i];
                        if (keep[i] === true) {
                            _results.push(el);
                        }
                    }
                    return _results;
                }();
            }
            return new DataTable(out);
        };
        DataTable.prototype.whichRow = function (where) {
            var count, i, key, nkeys, out, rec, value, _i, _ref;
            out = [];
            nkeys = _.keys(where).length;
            for (i = _i = 0, _ref = this.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                rec = this.record(i);
                count = utils.asArray(function () {
                    var _results;
                    _results = [];
                    for (key in where) {
                        value = where[key];
                        _results.push(rec[key] === value);
                    }
                    return _results;
                }());
                count = _.map(count, function (x) {
                    if (x) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                count = _.reduce(utils.asArray(count), function (sum, num) {
                    return sum + num;
                });
                if (count === nkeys) {
                    out.push(i);
                }
            }
            return out;
        };
        DataTable.prototype.select = function (where) {
            var count, i, key, nkeys, out, rec, value, _i, _ref;
            out = [];
            nkeys = _.keys(where).length;
            for (i = _i = 0, _ref = this.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                rec = this.record(i);
                count = utils.asArray(function () {
                    var _results;
                    _results = [];
                    for (key in where) {
                        value = where[key];
                        _results.push(rec[key] === value);
                    }
                    return _results;
                }());
                count = _.map(count, function (x) {
                    if (x) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                count = _.reduce(utils.asArray(count), function (sum, num) {
                    return sum + num;
                });
                if (count === nkeys) {
                    out.push(rec);
                }
            }
            return out;
        };
        DataTable.prototype.nrow = function () {
            var lens, name, value;
            lens = function () {
                var _results;
                _results = [];
                for (name in this) {
                    if (!__hasProp.call(this, name))
                        continue;
                    value = this[name];
                    _results.push(value.length);
                }
                return _results;
            }.call(this);
            if (lens.length === 0) {
                return 0;
            } else {
                return _.max(lens);
            }
        };
        DataTable.prototype.ncol = function () {
            return Object.keys(this).length;
        };
        DataTable.prototype.colnames = function () {
            return Object.keys(this);
        };
        DataTable.prototype.rows = function () {
            return this.toRecordArray();
        };
        DataTable.prototype.mapRows = function (fun) {
            var i, _i, _ref, _results;
            _results = [];
            for (i = _i = 0, _ref = this.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                _results.push(fun(this.record(i)));
            }
            return _results;
        };
        DataTable.prototype.toRecordArray = function () {
            var i, rec, _i, _ref;
            rec = [];
            for (i = _i = 0, _ref = this.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                rec.push(this.record(i));
            }
            return rec;
        };
        DataTable.prototype.record = function (index) {
            var name, rec, value;
            rec = {};
            for (name in this) {
                if (!__hasProp.call(this, name))
                    continue;
                value = this[name];
                rec[name] = value[index];
            }
            return rec;
        };
        DataTable.prototype.replicate = function (nreps) {
            var name, out, value;
            if (nreps < 1) {
                throw new Error('DataTable.replicate: nreps must be greater than or equal to 1');
            } else {
                out = {};
                for (name in this) {
                    if (!__hasProp.call(this, name))
                        continue;
                    value = this[name];
                    out[name] = _.flatten(_.times(nreps, function (_this) {
                        return function (n) {
                            return value;
                        };
                    }(this)));
                }
                return new DataTable(out);
            }
        };
        DataTable.prototype.bindcol = function (name, column) {
            if (column.length !== this.nrow()) {
                throw 'new column must be same length as existing DataTable object: column.length is  ' + column.length + ' and this.length is  ' + this.nrow();
            }
            this[name] = column;
            return this;
        };
        DataTable.prototype.bindrow = function (rows) {
            var key, record, value, _i, _j, _len, _len1, _ref;
            console.log('binding row', rows);
            console.log('nrow is', this.nrow());
            if (!_.isArray(rows)) {
                rows = [rows];
            }
            if (this.nrow() === 0) {
                console.log('table has no rows');
                _ref = _.keys(rows[0]);
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    key = _ref[_i];
                    console.log('adding column name', key);
                    this[key] = [];
                }
            }
            for (_j = 0, _len1 = rows.length; _j < _len1; _j++) {
                record = rows[_j];
                console.log(record);
                for (key in record) {
                    if (!__hasProp.call(record, key))
                        continue;
                    value = record[key];
                    if (!_.has(this, key)) {
                        throw new Error('DataTable has no field named ' + key);
                    } else {
                        this[key].push(value);
                    }
                }
            }
            return this;
        };
        DataTable.prototype.shuffle = function () {
            var i, ind, nr, out, sind, _i, _j, _results;
            nr = this.nrow();
            ind = function () {
                _results = [];
                for (var _i = 0; 0 <= nr ? _i < nr : _i > nr; 0 <= nr ? _i++ : _i--) {
                    _results.push(_i);
                }
                return _results;
            }.apply(this);
            sind = _.shuffle(ind);
            out = [];
            for (i = _j = 0; 0 <= nr ? _j < nr : _j > nr; i = 0 <= nr ? ++_j : --_j) {
                out[i] = this.record(sind[i]);
            }
            return DataTable.fromRecords(out);
        };
        return DataTable;
    }();
    exports.DataTable = DataTable;
    exports.loadTable = loadTable;
}.call(this));
});
require.define('69', function(module, exports, __dirname, __filename, undefined){
(function () {
    var factorial, getTimestamp, swap, _, _ref, _ref1, __slice = [].slice;
    _ = require('16', module);
    if (typeof window !== 'undefined' && window !== null ? (_ref = window.performance) != null ? _ref.now : void 0 : void 0) {
        getTimestamp = function () {
            return window.performance.now();
        };
    } else if (typeof window !== 'undefined' && window !== null ? (_ref1 = window.performance) != null ? _ref1.webkitNow : void 0 : void 0) {
        getTimestamp = function () {
            return window.performance.webkitNow();
        };
    } else {
        getTimestamp = function () {
            return new Date().getTime();
        };
    }
    exports.getTimestamp = getTimestamp;
    this.browserBackDisabled = false;
    exports.disableBrowserBack = function () {
        var rx;
        if (!this.browserBackDisabled) {
            rx = /INPUT|SELECT|TEXTAREA/i;
            this.browserBackDisabled = true;
            return $(document).bind('keydown keypress', function (e) {
                if (e.which === 8) {
                    if (!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly) {
                        return e.preventDefault();
                    }
                }
            });
        }
    };
    exports.module = function (name) {
        return global[name] = global[name] || {};
    };
    exports.asArray = function (value) {
        if (_.isArray(value)) {
            return value;
        } else if (_.isNumber(value) || _.isBoolean(value)) {
            return [value];
        } else {
            return _.toArray(value);
        }
    };
    swap = function (arr, a, b) {
        var temp;
        temp = arr[a];
        arr[a] = arr[b];
        return arr[b] = temp;
    };
    factorial = function (n) {
        var i, val;
        val = 1;
        i = 1;
        while (i < n) {
            val *= i;
            i++;
        }
        return val;
    };
    exports.permute = function (perm, maxlen) {
        var i, inc, j, out, total;
        if (maxlen == null) {
            maxlen = 1000;
        }
        console.log('maxlen', maxlen);
        total = factorial(perm.length);
        console.log('total', total);
        j = 0;
        i = 0;
        inc = 1;
        out = [];
        maxlen = maxlen - 1;
        while (j < total && out.length < maxlen) {
            console.log('j', j);
            while (i < perm.length - 1 && i >= 0 && out.length < maxlen) {
                out.push(perm.slice(0));
                swap(perm, i, i + 1);
                i += inc;
            }
            out.push(perm.slice(0));
            if (inc === 1) {
                swap(perm, 0, 1);
            } else {
                swap(perm, perm.length - 1, perm.length - 2);
            }
            j++;
            inc *= -1;
            i += inc;
        }
        return out;
    };
    exports.rep = function (vec, times) {
        var el, i, j, out;
        if (!(times instanceof Array)) {
            times = [times];
        }
        if (!(vec instanceof Array)) {
            vec = [vec];
        }
        if (times.length !== 1 && vec.length !== times.length) {
            throw 'vec.length must equal times.length or times.length must be 1';
        }
        if (vec.length === times.length) {
            out = function () {
                var _i, _len, _results;
                _results = [];
                for (i = _i = 0, _len = vec.length; _i < _len; i = ++_i) {
                    el = vec[i];
                    _results.push(function () {
                        var _j, _ref2, _results1;
                        _results1 = [];
                        for (j = _j = 1, _ref2 = times[i]; 1 <= _ref2 ? _j <= _ref2 : _j >= _ref2; j = 1 <= _ref2 ? ++_j : --_j) {
                            _results1.push(el);
                        }
                        return _results1;
                    }());
                }
                return _results;
            }();
            return _.flatten(out);
        } else {
            out = _.times(times[0], function (_this) {
                return function (n) {
                    return vec;
                };
            }(this));
            return _.flatten(out);
        }
    };
    exports.repLen = function (vec, length) {
        var i, _i, _results;
        if (length < 1) {
            throw 'repLen: length must be greater than or equal to 1';
        }
        _results = [];
        for (i = _i = 0; 0 <= length ? _i < length : _i > length; i = 0 <= length ? ++_i : --_i) {
            _results.push(vec[i % vec.length]);
        }
        return _results;
    };
    exports.sample = function (elements, n, replace) {
        var i, _i, _results;
        if (replace == null) {
            replace = false;
        }
        if (n > elements.length && !replace) {
            throw 'cannot take sample larger than the number of elements when \'replace\' argument is false';
        }
        if (!replace) {
            return _.shuffle(elements).slice(0, n);
        } else {
            _results = [];
            for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
                _results.push(elements[Math.floor(Math.random() * elements.length)]);
            }
            return _results;
        }
    };
    exports.oneOf = function (elements) {
        return elements[Math.floor(Math.random() * elements.length)];
    };
    exports.genPoints = function (n, bbox) {
        var i, out, x, y, _i;
        if (bbox == null) {
            bbox = {
                X: 0,
                y: 0,
                width: 1,
                height: 1
            };
        }
        out = [];
        for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
            x = Math.random() * bbox.width + bbox.x;
            y = Math.random() * bbox.height + bbox.y;
            out.push([
                x,
                y
            ]);
        }
        return out;
    };
    exports.euclidean = function (a, b) {
        var n, sum, _i, _ref2;
        sum = 0;
        for (n = _i = 0, _ref2 = a.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; n = 0 <= _ref2 ? ++_i : --_i) {
            sum = sum + Math.pow(a[n] - b[n], 2);
        }
        return Math.sqrt(sum);
    };
    exports.order = function (els) {
        var i, j, sortIndices, toSort, _i, _j, _ref2, _ref3;
        toSort = els.slice(0);
        for (i = _i = 0, _ref2 = toSort.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
            toSort[i] = [
                toSort[i],
                i
            ];
        }
        toSort.sort(function (left, right) {
            if (left[0] < right[0]) {
                return -1;
            } else {
                return 1;
            }
        });
        sortIndices = [];
        for (j = _j = 0, _ref3 = toSort.length; 0 <= _ref3 ? _j < _ref3 : _j > _ref3; j = 0 <= _ref3 ? ++_j : --_j) {
            sortIndices.push(toSort[j][1]);
        }
        return sortIndices;
    };
    exports.table = function (els) {
        var counts;
        counts = _.reduce(els, function (sum, x) {
            if (sum[x] != null) {
                sum[x] = sum[x] + 1;
            } else {
                sum[x] = 1;
            }
            return sum;
        }, {});
        return counts;
    };
    exports.transitionProbs = function (els) {
        var classCounts, counts, key, trans, value, zipped;
        zipped = _.zip(_.initial(els), _.rest(els));
        zipped = _.map(zipped, function (x) {
            return {
                from: x[0],
                to: x[1]
            };
        });
        counts = _.reduce(zipped, function (sum, x) {
            var key;
            key = JSON.stringify(x);
            if (sum[key] != null) {
                sum[key] = sum[key] + 1;
            } else {
                sum[key] = 1;
            }
            return sum;
        }, {});
        classCounts = exports.table(els);
        counts = function () {
            var _results;
            _results = [];
            for (key in counts) {
                value = counts[key];
                trans = JSON.parse(key);
                _results.push({
                    from: trans.from,
                    to: trans.to,
                    count: value,
                    prob: value / zipped.length,
                    condProb: value / classCounts[trans.from]
                });
            }
            return _results;
        }();
        return counts;
    };
    exports.sd = function (els) {
        var el, mu, ss, sum, _i, _j, _len, _len1;
        sum = 0;
        for (_i = 0, _len = els.length; _i < _len; _i++) {
            el = els[_i];
            sum = sum + el;
        }
        mu = sum / els.length;
        ss = 0;
        for (_j = 0, _len1 = els.length; _j < _len1; _j++) {
            el = els[_j];
            ss = ss + Math.pow(el - mu, 2);
        }
        return Math.sqrt(ss / els.length);
    };
    exports.distanceMatrix = function (pts) {
        var i, j, _i, _ref2, _results;
        _results = [];
        for (i = _i = 0, _ref2 = pts.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
            _results.push(function () {
                var _j, _ref3, _results1;
                _results1 = [];
                for (j = _j = 0, _ref3 = pts.length; 0 <= _ref3 ? _j < _ref3 : _j > _ref3; j = 0 <= _ref3 ? ++_j : --_j) {
                    _results1.push(exports.euclidean(pts[i], pts[j]));
                }
                return _results1;
            }());
        }
        return _results;
    };
    exports.which = function (vals, fun) {
        var out, v, _i, _len;
        out = [];
        for (_i = 0, _len = vals.length; _i < _len; _i++) {
            v = vals[_i];
            if (fun(v)) {
                out.push(v);
            }
        }
        return v;
    };
    exports.whichMin = function (vals) {
        var i, imin, min, _i, _ref2;
        min = vals[0];
        imin = 0;
        for (i = _i = 0, _ref2 = vals.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
            if (vals[i] < min) {
                min = vals[i];
                imin = i;
            }
        }
        return imin;
    };
    exports.nearestTo = function (pt, pointSet, k) {
        var D, Dord, i, _i, _results;
        D = function () {
            var _i, _ref2, _results;
            _results = [];
            for (i = _i = 0, _ref2 = pointSet.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
                _results.push(exports.euclidean(pt, pointSet[i]));
            }
            return _results;
        }();
        Dord = exports.order(D);
        _results = [];
        for (i = _i = 0; 0 <= k ? _i < k : _i > k; i = 0 <= k ? ++_i : --_i) {
            _results.push({
                index: Dord[i],
                distance: D[Dord[i]]
            });
        }
        return _results;
    };
    exports.nearestNeighbors = function (pointSet, k) {
        var D, dlin, dord, i, ind, j, out, _i, _j, _k, _ref2, _ref3;
        D = exports.distanceMatrix(pointSet);
        dlin = [];
        ind = [];
        for (i = _i = 0, _ref2 = D.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
            for (j = _j = 0, _ref3 = D.length; 0 <= _ref3 ? _j < _ref3 : _j > _ref3; j = 0 <= _ref3 ? ++_j : --_j) {
                if (!(i !== j && i < j)) {
                    continue;
                }
                dlin.push(D[i][j]);
                ind.push([
                    i,
                    j
                ]);
            }
        }
        dord = exports.order(dlin);
        out = [];
        for (i = _k = 0; 0 <= k ? _k < k : _k > k; i = 0 <= k ? ++_k : --_k) {
            out.push({
                index: ind[dord[i]],
                distance: dlin[dord[i]]
            });
        }
        return out;
    };
    exports.pathLength = function (pts) {
        var i, len, _i, _ref2;
        if (pts.length <= 1) {
            return 0;
        } else {
            len = 0;
            for (i = _i = 0, _ref2 = pts.length - 1; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
                len += exports.euclidean(pts[i], pts[i + 1]);
            }
            return len;
        }
    };
    exports.nearestFromIndex = function (pts, index) {
        var D, i, imin;
        D = function () {
            var _i, _ref2, _results;
            _results = [];
            for (i = _i = 0, _ref2 = pts.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
                if (i !== index) {
                    _results.push(exports.euclidean(pts[index], pts[i]));
                }
            }
            return _results;
        }();
        imin = exports.whichMin(D);
        if (imin < index) {
            return imin;
        } else {
            return imin + 1;
        }
    };
    console.log(exports.distanceMatrix([
        [
            0,
            1
        ],
        [
            1,
            2
        ],
        [
            2,
            2
        ]
    ]));
    console.log(exports.nearestFromIndex([
        [
            0,
            1
        ],
        [
            1,
            2
        ],
        [
            2,
            2
        ],
        [
            0,
            1.2
        ]
    ], 1));
    console.log(exports.nearestTo([
        0,
        1
    ], [
        [
            0,
            1
        ],
        [
            1,
            2
        ],
        [
            2,
            2
        ],
        [
            0,
            1.2
        ]
    ], 2));
    console.log(exports.nearestNeighbors([
        [
            0,
            1
        ],
        [
            1,
            2
        ],
        [
            2,
            2
        ],
        [
            0,
            1.2
        ],
        [
            0,
            1.001
        ]
    ], 2));
    console.log(exports.pathLength([
        [
            0,
            1
        ],
        [
            0,
            2
        ],
        [
            0,
            3
        ],
        [
            0,
            4
        ],
        [
            0,
            5
        ]
    ]));
    exports.inSet = function () {
        var set;
        set = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        set = _.unique(_.flatten(set));
        return function (a) {
            return _.contains(set, a);
        };
    };
    exports.doTimer = function (length, oncomplete) {
        var instance, start;
        start = getTimestamp();
        instance = function () {
            var diff, half;
            diff = getTimestamp() - start;
            if (diff >= length) {
                return oncomplete(diff);
            } else {
                half = Math.max((length - diff) / 2, 1);
                if (half < 20) {
                    half = 1;
                }
                return setTimeout(instance, half);
            }
        };
        return setTimeout(instance, 1);
    };
}.call(this));
});
require.define('77', function(module, exports, __dirname, __filename, undefined){
(function () {
    var KP;
    exports.Sound = require('80', module).Sound;
    exports.Confirm = require('81', module).Confirm;
    exports.First = require('82', module).First;
    exports.Group = require('83', module).Group;
    exports.CanvasGroup = require('83', module).CanvasGroup;
    exports.Grid = require('83', module).Grid;
    KP = require('84', module);
    exports.KeyPress = KP.KeyPress;
    exports.SpaceKey = KP.SpaceKey;
    exports.AnyKey = KP.AnyKey;
    exports.MousePress = require('85', module).MousePress;
    exports.Prompt = require('86', module).Prompt;
    exports.Sequence = require('87', module).Sequence;
    exports.Timeout = require('88', module).Timeout;
    exports.Click = require('89', module).Click;
    exports.Nothing = require('90', module).Nothing;
    exports.Receiver = require('120', module).Receiver;
    exports.Consent = require('129', module).Consent;
}.call(this));
});
require.define('90', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Nothing, Stimulus, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('72', module).Stimulus;
    Nothing = function (_super) {
        __extends(Nothing, _super);
        function Nothing(spec) {
            if (spec == null) {
                spec = {};
            }
            Nothing.__super__.constructor.call(this, spec);
        }
        Nothing.prototype.render = function (context, layer) {
        };
        return Nothing;
    }(Stimulus);
    exports.Nothing = Nothing;
}.call(this));
});
require.define('89', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Click, Q, Response, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Q = require('17', module);
    Response = require('72', module).Response;
    Click = function (_super) {
        __extends(Click, _super);
        function Click() {
            return Click.__super__.constructor.apply(this, arguments);
        }
        Click.prototype.defaults = {
            id: null,
            name: null
        };
        Click.prototype.activate = function (context) {
            var deferred, element, node;
            if (this.spec.id != null) {
                node = '#' + this.spec.id;
            } else if (this.spec.name != null) {
                node = '.' + this.spec.name;
            }
            element = context.stage.get('.' + node);
            if (!element) {
                throw new Error('cannot find element:' + this.node);
            }
            deferred = Q.defer();
            element.on('click', function (_this) {
                return function (ev) {
                    return deferred.resolve(ev);
                };
            }(this));
            return deferred.promise;
        };
        return Click;
    }(Response);
    exports.Click = Click;
}.call(this));
});
require.define('88', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Q, Response, ResponseData, Timeout, utils, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    utils = require('69', module);
    Q = require('17', module);
    Response = require('72', module).Response;
    ResponseData = require('72', module).ResponseData;
    Timeout = function (_super) {
        __extends(Timeout, _super);
        function Timeout() {
            return Timeout.__super__.constructor.apply(this, arguments);
        }
        Timeout.prototype.defaults = { duration: 1000 };
        Timeout.prototype.activate = function (context) {
            var deferred;
            deferred = Q.defer();
            utils.doTimer(this.spec.duration, function (_this) {
                return function (diff) {
                    var resp;
                    resp = {
                        name: 'Timeout',
                        id: _this.id,
                        timeElapsed: diff,
                        timeRequested: _this.spec.duration
                    };
                    return deferred.resolve(new ResponseData(resp));
                };
            }(this));
            return deferred.promise;
        };
        return Timeout;
    }(Response);
    exports.Timeout = Timeout;
}.call(this));
});
require.define('87', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Presentable, Q, Sequence, Stimulus, Timeout, utils, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('72', module).Stimulus;
    Timeout = require('88', module).Timeout;
    Presentable = require('72', module).Presentable;
    Q = require('17', module);
    utils = require('69', module);
    _ = require('16', module);
    Sequence = function (_super) {
        __extends(Sequence, _super);
        function Sequence(stims, soa, clear, times) {
            var i;
            this.stims = stims;
            this.soa = soa;
            this.clear = clear != null ? clear : true;
            this.times = times != null ? times : 1;
            Sequence.__super__.constructor.call(this, {});
            if (this.soa.length !== this.stims.length) {
                this.soa = utils.repLen(this.soa, this.stims.length);
            }
            this.onsets = function () {
                var _i, _ref, _results;
                _results = [];
                for (i = _i = 0, _ref = this.soa.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    _results.push(_.reduce(this.soa.slice(0, +i + 1 || 9000000000), function (x, acc) {
                        return x + acc;
                    }));
                }
                return _results;
            }.call(this);
        }
        Sequence.prototype.genseq = function (context) {
            var deferred, _i, _ref, _results;
            deferred = Q.defer();
            _.forEach(function () {
                _results = [];
                for (var _i = 0, _ref = this.stims.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
                    _results.push(_i);
                }
                return _results;
            }.apply(this), function (_this) {
                return function (i) {
                    var ev, stim;
                    ev = new Timeout({ duration: _this.onsets[i] });
                    stim = _this.stims[i];
                    return ev.activate(context).then(function () {
                        var p;
                        if (!_this.stopped) {
                            if (_this.clear) {
                                context.clearContent();
                            }
                            p = stim.render(context);
                            p.present(context);
                            context.draw();
                            if (i === _this.stims.length - 1) {
                                return deferred.resolve(1);
                            }
                        }
                    });
                };
            }(this));
            return deferred.promise;
        };
        Sequence.prototype.render = function (context) {
            return {
                present: function (_this) {
                    return function (context) {
                        var i, result, _i, _ref;
                        result = Q.resolve(0);
                        for (i = _i = 0, _ref = _this.times; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                            result = result.then(function () {
                                return _this.genseq(context);
                            });
                        }
                        return result.then(function () {
                            return context.clearContent();
                        });
                    };
                }(this)
            };
        };
        return Sequence;
    }(Stimulus);
    exports.Sequence = Sequence;
}.call(this));
});
require.define('86', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Prompt, Q, Response, utils, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    utils = require('69', module);
    Q = require('17', module);
    Response = require('72', module).Response;
    Prompt = function (_super) {
        __extends(Prompt, _super);
        function Prompt() {
            return Prompt.__super__.constructor.apply(this, arguments);
        }
        Prompt.prototype.defaults = {
            title: 'Prompt',
            delay: 0,
            defaultValue: '',
            theme: 'vex-theme-wireframe'
        };
        Prompt.prototype.activate = function (context) {
            var deferred, promise;
            deferred = Q.defer();
            promise = Q.delay(this.spec.delay);
            promise.then(function (_this) {
                return function (f) {
                    return vex.dialog.prompt({
                        message: _this.spec.title,
                        placeholder: _this.spec.defaultValue,
                        className: 'vex-theme-wireframe',
                        callback: function (value) {
                            return deferred.resolve(value);
                        }
                    });
                };
            }(this));
            return deferred.promise;
        };
        return Prompt;
    }(Response);
    exports.Prompt = Prompt;
}.call(this));
});
require.define('85', function(module, exports, __dirname, __filename, undefined){
(function () {
    var MousePress, Q, Response, ResponseData, utils, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Q = require('17', module);
    Response = require('72', module).Response;
    ResponseData = require('72', module).ResponseData;
    utils = require('69', module);
    MousePress = function (_super) {
        __extends(MousePress, _super);
        function MousePress() {
            return MousePress.__super__.constructor.apply(this, arguments);
        }
        MousePress.prototype.activate = function (context) {
            var deferred, mouse, myname;
            this.startTime = utils.getTimestamp();
            myname = this.name;
            deferred = Q.defer();
            mouse = context.mousepressStream();
            mouse.stream.take(1).onValue(function (_this) {
                return function (event) {
                    var resp, timestamp;
                    timestamp = utils.getTimestamp();
                    mouse.stop();
                    resp = {
                        name: myname,
                        id: _this.id,
                        KeyTime: timestamp,
                        RT: timestamp - _this.startTime,
                        Accuracy: Acc
                    };
                    return deferred.resolve(new ResponseData(resp));
                };
            }(this));
            return deferred.promise;
        };
        return MousePress;
    }(Response);
    exports.MousePress = MousePress;
}.call(this));
});
require.define('84', function(module, exports, __dirname, __filename, undefined){
(function () {
    var AnyKey, KeyPress, KeyResponse, Q, Response, ResponseData, SpaceKey, i, keyTable, utils, _, _i, _j, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Q = require('17', module);
    Response = require('72', module).Response;
    ResponseData = require('72', module).ResponseData;
    utils = require('69', module);
    _ = require('16', module);
    keyTable = {
        8: 'backspace',
        9: 'tab',
        13: 'enter',
        16: 'shift',
        17: 'ctrl',
        18: 'alt',
        20: 'capslock',
        27: 'esc',
        32: 'space',
        33: 'pageup',
        34: 'pagedown',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        45: 'ins',
        46: 'del',
        91: 'meta',
        93: 'meta',
        224: 'meta',
        106: '*',
        107: '+',
        109: '-',
        110: '.',
        111: '/',
        186: ';',
        187: '=',
        188: ',',
        189: '-',
        190: '.',
        191: '/',
        192: '`',
        219: '[',
        220: '\\',
        221: ']'
    };
    for (i = _i = 1; _i < 20; i = ++_i) {
        keyTable[111 + i] = 'f' + i;
    }
    for (i = _j = 1; _j <= 9; i = ++_j) {
        keyTable[i + 96];
    }
    KeyResponse = function (_super) {
        __extends(KeyResponse, _super);
        function KeyResponse() {
            return KeyResponse.__super__.constructor.apply(this, arguments);
        }
        KeyResponse.prototype.defaults = {
            keys: [
                '1',
                '2'
            ],
            correct: ['1'],
            timeout: null
        };
        KeyResponse.prototype.createResponseData = function (timeStamp, startTime, Acc, char, noResponse) {
            var resp;
            if (noResponse == null) {
                noResponse = false;
            }
            resp = {
                name: this.name,
                id: this.id,
                keyTime: timeStamp,
                RT: timeStamp - startTime,
                accuracy: Acc,
                keyChar: char,
                nonResponse: noResponse
            };
            return resp;
        };
        KeyResponse.prototype.resolveOnTimeout = function (deferred, timeout) {
            return utils.doTimer(timeout, function (_this) {
                return function (diff) {
                    var Acc, resp, timeStamp;
                    if (!deferred.isResolved) {
                        timeStamp = utils.getTimestamp();
                        Acc = false;
                        resp = _this.createResponseData(timeStamp, _this.startTime, Acc, '', true);
                        return deferred.resolve(new ResponseData(resp));
                    }
                };
            }(this));
        };
        return KeyResponse;
    }(Response);
    KeyPress = function (_super) {
        __extends(KeyPress, _super);
        function KeyPress() {
            return KeyPress.__super__.constructor.apply(this, arguments);
        }
        KeyPress.prototype.activate = function (context) {
            var deferred, keyStream;
            this.startTime = utils.getTimestamp();
            deferred = Q.defer();
            keyStream = context.keypressStream();
            if (this.spec.timeout != null) {
                this.resolveOnTimeout(deferred, this.spec.timeout);
            }
            keyStream.filter(function (_this) {
                return function (event) {
                    var char;
                    char = String.fromCharCode(event.keyCode);
                    return _.contains(_this.spec.keys, char);
                };
            }(this)).take(1).onValue(function (_this) {
                return function (filtered) {
                    var Acc, resp, timeStamp;
                    timeStamp = utils.getTimestamp();
                    console.log('correct', _this.spec.correct);
                    console.log('key', String.fromCharCode(filtered.keyCode));
                    Acc = _.contains(_this.spec.correct, String.fromCharCode(filtered.keyCode));
                    console.log('acc', Acc);
                    resp = _this.createResponseData(timeStamp, _this.startTime, Acc, String.fromCharCode(filtered.keyCode));
                    return deferred.resolve(new ResponseData(resp));
                };
            }(this));
            return deferred.promise;
        };
        return KeyPress;
    }(KeyResponse);
    exports.KeyPress = KeyPress;
    SpaceKey = function (_super) {
        __extends(SpaceKey, _super);
        function SpaceKey() {
            return SpaceKey.__super__.constructor.apply(this, arguments);
        }
        SpaceKey.prototype.activate = function (context) {
            var deferred, keyStream;
            this.startTime = utils.getTimestamp();
            deferred = Q.defer();
            keyStream = context.keypressStream();
            keyStream.filter(function (_this) {
                return function (event) {
                    return event.keyCode === 32;
                };
            }(this)).take(1).onValue(function (_this) {
                return function (event) {
                    var resp, timeStamp;
                    timeStamp = utils.getTimestamp();
                    resp = {
                        name: 'SpaceKey',
                        id: _this.id,
                        KeyTime: timeStamp,
                        RT: timeStamp - _this.startTime,
                        KeyChar: 'space'
                    };
                    return deferred.resolve(new ResponseData(resp));
                };
            }(this));
            return deferred.promise;
        };
        return SpaceKey;
    }(Response);
    AnyKey = function (_super) {
        __extends(AnyKey, _super);
        function AnyKey() {
            return AnyKey.__super__.constructor.apply(this, arguments);
        }
        AnyKey.prototype.activate = function (context) {
            var deferred, keyStream;
            this.startTime = utils.getTimestamp();
            deferred = Q.defer();
            keyStream = context.keypressStream();
            keyStream.take(1).onValue(function (_this) {
                return function (event) {
                    var resp, timeStamp;
                    timeStamp = utils.getTimestamp();
                    resp = {
                        name: 'AnyKey',
                        id: _this.id,
                        keyTime: timeStamp,
                        RT: timeStamp - _this.startTime,
                        keyChar: String.fromCharCode(event.keyCode)
                    };
                    return deferred.resolve(new ResponseData(resp));
                };
            }(this));
            return deferred.promise;
        };
        return AnyKey;
    }(Response);
    exports.SpaceKey = SpaceKey;
    exports.AnyKey = AnyKey;
}.call(this));
});
require.define('83', function(module, exports, __dirname, __filename, undefined){
(function () {
    var CanvasGroup, Container, ContainerDrawable, Grid, Group, KineticDrawable, Stimulus, layout, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('72', module).Stimulus;
    ContainerDrawable = require('72', module).ContainerDrawable;
    KineticDrawable = require('72', module).KineticDrawable;
    layout = require('73', module);
    Container = function (_super) {
        __extends(Container, _super);
        function Container(children, spec) {
            this.children = children;
            if (spec == null) {
                spec = {};
            }
            Container.__super__.constructor.call(this, spec);
        }
        Container.prototype.hasChildren = function () {
            return true;
        };
        Container.prototype.getChildren = function () {
            return this.children;
        };
        return Container;
    }(Stimulus);
    Group = function (_super) {
        __extends(Group, _super);
        function Group(children, layout, spec) {
            var stim, _i, _len, _ref;
            if (spec == null) {
                spec = {};
            }
            Group.__super__.constructor.call(this, children, spec);
            if (layout != null) {
                this.layout = layout;
                _ref = this.children;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    stim = _ref[_i];
                    stim.layout = layout;
                }
            }
        }
        Group.prototype.render = function (context) {
            var nodes, stim;
            nodes = function () {
                var _i, _len, _ref, _results;
                _ref = this.children;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    stim = _ref[_i];
                    _results.push(stim.render(context));
                }
                return _results;
            }.call(this);
            return new ContainerDrawable(nodes);
        };
        return Group;
    }(Container);
    exports.Group = Group;
    CanvasGroup = function (_super) {
        __extends(CanvasGroup, _super);
        function CanvasGroup(children, layout, spec) {
            var stim, _i, _len, _ref;
            if (spec == null) {
                spec = {};
            }
            CanvasGroup.__super__.constructor.call(this, children, layout, spec);
            this.group = new Kinetic.Group({ id: this.spec.id });
            _ref = this.stims;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                stim = _ref[_i];
                console.log('canvas group stim child', stim);
            }
        }
        CanvasGroup.prototype.render = function (context) {
            var node, stim, _i, _len, _ref;
            console.log('rendering canvas group child nodes', this.children);
            _ref = this.children;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                stim = _ref[_i];
                console.log('rendering node for stim', stim);
                node = stim.render(context).node;
                console.log('rendered node', node);
                this.group.add(node);
            }
            return new KineticDrawable(this, this.group);
        };
        return CanvasGroup;
    }(Group);
    Grid = function (_super) {
        __extends(Grid, _super);
        function Grid(children, rows, columns, bounds) {
            var stim, _i, _len, _ref;
            this.rows = rows;
            this.columns = columns;
            this.bounds = bounds;
            Grid.__super__.constructor.call(this, children);
            this.layout = new layout.GridLayout(this.rows, this.columns, this.bounds);
            _ref = this.children;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                stim = _ref[_i];
                stim.layout = this.layout;
            }
        }
        return Grid;
    }(Group);
    exports.Group = Group;
    exports.CanvasGroup = CanvasGroup;
    exports.Grid = Grid;
}.call(this));
});
require.define('82', function(module, exports, __dirname, __filename, undefined){
(function () {
    var First, Q, Response, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    _ = require('16', module);
    Q = require('17', module);
    Response = require('72', module).Response;
    First = function (_super) {
        __extends(First, _super);
        function First(responses) {
            this.responses = responses;
            First.__super__.constructor.call(this, {});
        }
        First.prototype.activate = function (context, stimulus) {
            var deferred, _done;
            _done = false;
            deferred = Q.defer();
            _.forEach(this.responses, function (_this) {
                return function (resp) {
                    return resp.activate(context).then(function (obj) {
                        if (!_done) {
                            console.log('resolving response', obj);
                            deferred.resolve(obj);
                            return _done = true;
                        } else {
                            return console.log('not resolving, already done');
                        }
                    });
                };
            }(this));
            return deferred.promise;
        };
        return First;
    }(Response);
    exports.First = First;
}.call(this));
});
require.define('81', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Confirm, Q, Response, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Q = require('17', module);
    Response = require('72', module).Response;
    Confirm = function (_super) {
        __extends(Confirm, _super);
        function Confirm() {
            return Confirm.__super__.constructor.apply(this, arguments);
        }
        Confirm.prototype.defaults = {
            message: '',
            delay: 0,
            defaultValue: '',
            theme: 'vex-theme-wireframe'
        };
        Confirm.prototype.activate = function (context) {
            var deferred, promise;
            console.log('activating confirm dialog');
            deferred = Q.defer();
            promise = Q.delay(this.spec.delay);
            promise.then(function (_this) {
                return function (f) {
                    console.log('rendering confirm dialog');
                    return vex.dialog.confirm({
                        message: _this.spec.message,
                        className: _this.spec.theme,
                        callback: function (value) {
                            return deferred.resolve(value);
                        }
                    });
                };
            }(this));
            return deferred.promise;
        };
        return Confirm;
    }(Response);
    exports.Confirm = Confirm;
}.call(this));
});
require.define('80', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Sound, Stimulus, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('72', module).Stimulus;
    Sound = function (_super) {
        __extends(Sound, _super);
        Sound.prototype.defaults = { url: 'http://www.centraloutdoors.com/mp3/sheep/sheep.wav' };
        function Sound(spec) {
            if (spec == null) {
                spec = {};
            }
            Sound.__super__.constructor.call(this, spec);
            this.sound = new buzz.sound(this.spec.url);
        }
        Sound.prototype.render = function (context, layer) {
            return this.sound.play();
        };
        return Sound;
    }(Stimulus);
    exports.Sound = Sound;
}.call(this));
});
require.define('76', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Drawable, GStimulus, HMixResp, HMixStim, Html, HtmlMixin, HtmlResponse, HtmlStimulus, Mixen, Response, signals, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    GStimulus = require('72', module).GraphicalStimulus;
    Drawable = require('72', module).Drawable;
    Response = require('72', module).Response;
    Mixen = require('36', module);
    signals = require('116', module);
    HtmlMixin = function () {
        HtmlMixin.prototype.tag = 'div';
        HtmlMixin.prototype.div = function () {
            return $(document.createElement('div'));
        };
        function HtmlMixin() {
            this.el = document.createElement(this.tag);
            this.el = $(this.el);
        }
        HtmlMixin.prototype.positionElement = function (el, x, y) {
            return el.css({
                position: 'relative',
                left: x,
                top: y
            });
        };
        HtmlMixin.prototype.centerElement = function (el) {
            return el.css({
                margin: '0 auto',
                position: 'relative',
                left: '50%',
                top: '50%'
            });
        };
        return HtmlMixin;
    }();
    HMixStim = Mixen(HtmlMixin, GStimulus);
    HMixResp = Mixen(HtmlMixin, Response);
    HtmlStimulus = function (_super) {
        __extends(HtmlStimulus, _super);
        function HtmlStimulus(spec) {
            HtmlStimulus.__super__.constructor.call(this, spec);
            signals.convert(this);
        }
        HtmlStimulus.prototype.element = function () {
            return this.el;
        };
        HtmlStimulus.prototype.html = function () {
            return $('<div>').append(this.element()).html();
        };
        HtmlStimulus.prototype.presentable = function (element) {
            return new (function (_super1) {
                __extends(_Class, _super1);
                function _Class(element) {
                    this.element = element;
                }
                _Class.prototype.x = function () {
                    return this.element.position().left;
                };
                _Class.prototype.y = function () {
                    return this.element.position().top;
                };
                _Class.prototype.width = function () {
                    return this.element.width();
                };
                _Class.prototype.height = function () {
                    return this.element.height();
                };
                _Class.prototype.present = function (context) {
                    return this.element.show();
                };
                return _Class;
            }(Drawable))(element);
        };
        HtmlStimulus.prototype.render = function (context) {
            var coords;
            HtmlStimulus.__super__.render.call(this, context);
            this.el.hide();
            this.initReactions();
            context.appendHtml(this.el);
            coords = this.computeCoordinates(context, this.spec.position, this.el.width(), this.el.height());
            this.positionElement(this.el, coords[0], coords[1]);
            return this.presentable(this.el);
        };
        return HtmlStimulus;
    }(HMixStim);
    HtmlResponse = function (_super) {
        __extends(HtmlResponse, _super);
        function HtmlResponse() {
            HtmlResponse.__super__.constructor.apply(this, arguments);
        }
        return HtmlResponse;
    }(HMixResp);
    exports.HtmlStimulus = HtmlStimulus;
    exports.HtmlResponse = HtmlResponse;
    Html = {};
    Html.HtmlButton = require('91', module).HtmlButton;
    Html.ButtonGroup = require('137', module).ButtonGroup;
    Html.CheckBox = require('127', module).CheckBox;
    Html.HtmlLink = require('92', module).HtmlLink;
    Html.HtmlLabel = require('93', module).HtmlLabel;
    Html.HtmlIcon = require('94', module).HtmlIcon;
    Html.Instructions = require('95', module).Instructions;
    Html.Markdown = require('96', module).Markdown;
    Html.Message = require('97', module).Message;
    Html.Page = require('98', module).Page;
    Html.HtmlRange = require('125', module).HtmlRange;
    Html.HtmlResponse = HtmlResponse;
    Html.HtmlStimulus = HtmlStimulus;
    Html.Likert = require('123', module).Likert;
    Html.Slider = require('126', module).Slider;
    Html.TextField = require('132', module).TextField;
    Html.DropDown = require('133', module).DropDown;
    Html.MultiChoice = require('134', module).MultiChoice;
    Html.Question = require('135', module).Question;
    exports.Html = Html;
}.call(this));
});
require.define('98', function(module, exports, __dirname, __filename, undefined){
(function () {
    var HtmlStimulus, Page, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    HtmlStimulus = require('76', module).HtmlStimulus;
    Page = function (_super) {
        __extends(Page, _super);
        Page.prototype.defaults = { html: '<p>HTML Page</p>' };
        function Page(spec) {
            if (spec == null) {
                spec = {};
            }
            Page.__super__.constructor.call(this, spec);
            this.el.append(this.spec.html);
        }
        return Page;
    }(HtmlStimulus);
    exports.Page = Page;
}.call(this));
});
require.define('97', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Message, html, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('76', module);
    Message = function (_super) {
        __extends(Message, _super);
        Message.prototype.defaults = {
            title: 'Message!',
            content: 'your content here',
            color: '',
            size: 'large'
        };
        function Message(spec) {
            if (spec == null) {
                spec = {};
            }
            Message.__super__.constructor.call(this, spec);
            this.el.addClass(this.messageClass());
            this.title = $('<div>' + this.spec.title + '</div>').addClass('header');
            this.content = $('<p>' + this.spec.content + '</p>');
            this.el.append(this.title);
            this.el.append(this.content);
        }
        Message.prototype.messageClass = function () {
            return 'ui message ' + this.spec.color + ' ' + this.spec.size;
        };
        return Message;
    }(html.HtmlStimulus);
    exports.Message = Message;
}.call(this));
});
require.define('96', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Markdown, html, marked, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('76', module);
    marked = require('45', module);
    _ = require('16', module);
    Markdown = function (_super) {
        __extends(Markdown, _super);
        function Markdown(spec) {
            if (spec == null) {
                spec = {};
            }
            Markdown.__super__.constructor.call(this, spec);
            if (_.isString(spec)) {
                this.spec = {};
                this.spec.x = 0;
                this.spec.y = 0;
                this.spec.content = spec;
            }
            if (this.spec.url != null) {
                console.log('trying to load url', this.spec.url);
                $.ajax({
                    url: this.spec.url,
                    success: function (_this) {
                        return function (result) {
                            console.log('successfully loaded markdown', result);
                            _this.spec.content = result;
                            return _this.el.append(marked(_this.spec.content));
                        };
                    }(this),
                    error: function (_this) {
                        return function (result) {
                            return console.log('ajax failure', result);
                        };
                    }(this)
                });
            } else {
                this.el.append($(marked(this.spec.content)));
            }
            this.el.addClass('markdown');
        }
        return Markdown;
    }(html.HtmlStimulus);
    exports.Markdown = Markdown;
}.call(this));
});
require.define('95', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Instructions, Markdown, Q, html, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('76', module);
    Q = require('17', module);
    Markdown = require('96', module).Markdown;
    _ = require('16', module);
    Instructions = function (_super) {
        __extends(Instructions, _super);
        function Instructions(spec) {
            var content, div, i, itm, key, md, type, value;
            if (spec == null) {
                spec = {};
            }
            Instructions.__super__.constructor.call(this, spec);
            this.pages = function () {
                var _ref, _results;
                _ref = this.spec.pages;
                _results = [];
                for (key in _ref) {
                    value = _ref[key];
                    type = _.keys(value)[0];
                    content = _.values(value)[0];
                    md = new Markdown(content);
                    div = this.div();
                    div.addClass('ui stacked segment').append(md.element());
                    div.css('overflow-y', 'scroll');
                    div.css('height', 800);
                    _results.push(div);
                }
                return _results;
            }.call(this);
            this.menu = this.div();
            this.menu.addClass('ui borderless pagination menu');
            this.back = $('<a class="item">\n  <i class="icon left arrow"></i>  Previous\n </a>').attr('id', 'instructions_back');
            this.next = $('<a class="item">\nNext <i class="icon right arrow"></i>\n</a>').attr('id', 'instructions_next');
            this.menu.append(this.back).append('\n');
            this.items = function () {
                var _i, _ref, _results;
                _results = [];
                for (i = _i = 1, _ref = this.pages.length; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
                    itm = $('<a class="item">' + i + ' of ' + this.pages.length + '</a>');
                    this.menu.append(itm).append('\n');
                    _results.push(itm);
                }
                return _results;
            }.call(this);
            this.items[0].addClass('active');
            this.menu.append(this.next).css('position', 'absolute').css('right', '15px');
            this.currentPage = 0;
            this.el.append(this.pages[this.currentPage]);
            this.el.append(this.menu);
        }
        Instructions.prototype.activate = function (context) {
            this.deferred = Q.defer();
            return this.deferred.promise;
        };
        Instructions.prototype.updateEl = function (currentPage) {
            this.el.empty();
            this.el.append(this.pages[this.currentPage]);
            return this.el.append(this.menu);
        };
        Instructions.prototype.render = function (context) {
            this.next.click(function (_this) {
                return function (e) {
                    if (_this.currentPage < _this.pages.length - 1) {
                        _this.items[_this.currentPage].removeClass('active');
                        _this.currentPage += 1;
                        _this.items[_this.currentPage].addClass('active');
                        _this.updateEl(_this.currentPage);
                        _this.render(context);
                        return _this.emit('next_page');
                    } else {
                        return _this.emit('done');
                    }
                };
            }(this));
            this.back.click(function (_this) {
                return function (e) {
                    if (_this.currentPage > 0) {
                        _this.items[_this.currentPage].removeClass('active');
                        _this.currentPage -= 1;
                        _this.items[_this.currentPage].addClass('active');
                        _this.updateEl(_this.currentPage);
                        _this.render(context);
                        return _this.emit('previous_page');
                    }
                };
            }(this));
            if (this.currentPage > 0) {
                this.back.removeClass('disabled');
            }
            $(this.pages[this.currentPage]).css({ 'min-height': context.height() - 50 });
            context.appendHtml(this.el);
            return this.presentable(this.el);
        };
        return Instructions;
    }(html.HtmlStimulus);
    exports.Instructions = Instructions;
}.call(this));
});
require.define('94', function(module, exports, __dirname, __filename, undefined){
(function () {
    var HtmlIcon, html, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('76', module);
    HtmlIcon = function (_super) {
        __extends(HtmlIcon, _super);
        HtmlIcon.prototype.defaults = {
            glyph: 'plane',
            size: 'massive'
        };
        function HtmlIcon(spec) {
            if (spec == null) {
                spec = {};
            }
            HtmlIcon.__super__.constructor.call(this, spec);
            this.html = $('<i></i>');
            this.html.addClass(this.spec.glyph + ' ' + this.spec.size + ' icon');
            this.el.append(this.html);
        }
        return HtmlIcon;
    }(html.HtmlStimulus);
    exports.HtmlIcon = HtmlIcon;
}.call(this));
});
require.define('93', function(module, exports, __dirname, __filename, undefined){
(function () {
    var HtmlLabel, html, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('76', module);
    HtmlLabel = function (_super) {
        __extends(HtmlLabel, _super);
        HtmlLabel.prototype.defaults = {
            glyph: null,
            size: 'large',
            text: 'label',
            color: 'orange'
        };
        function HtmlLabel(spec) {
            if (spec == null) {
                spec = {};
            }
            HtmlLabel.__super__.constructor.call(this, spec);
            this.el.addClass('ui ' + this.spec.color + ' ' + this.spec.size + ' label');
            this.el.append(this.spec.text + ' ');
            if (this.spec.glyph != null) {
                this.el.append('<i class="' + this.spec.glyph + ' ' + this.spec.size + '  icon"></i>');
            }
        }
        return HtmlLabel;
    }(html.HtmlStimulus);
    exports.HtmlLabel = HtmlLabel;
}.call(this));
});
require.define('92', function(module, exports, __dirname, __filename, undefined){
(function () {
    var HtmlLink, html, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('76', module);
    HtmlLink = function (_super) {
        __extends(HtmlLink, _super);
        HtmlLink.prototype.defaults = { label: 'link' };
        function HtmlLink(spec) {
            if (spec == null) {
                spec = {};
            }
            HtmlLink.__super__.constructor.call(this, spec);
            this.html = $('<a href=\'#\'>' + this.spec.label + '</a>');
            this.el.append(this.html);
        }
        return HtmlLink;
    }(html.HtmlStimulus);
    exports.HtmlLink = HtmlLink;
}.call(this));
});
require.define('91', function(module, exports, __dirname, __filename, undefined){
(function () {
    var HtmlButton, html, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('76', module);
    HtmlButton = function (_super) {
        __extends(HtmlButton, _super);
        HtmlButton.prototype.description = 'An html button that can be clicked.';
        HtmlButton.prototype.defaults = {
            label: 'Next',
            'class': ''
        };
        HtmlButton.prototype.signals = ['clicked'];
        function HtmlButton(spec) {
            if (spec == null) {
                spec = {};
            }
            HtmlButton.__super__.constructor.call(this, spec);
        }
        HtmlButton.prototype.initialize = function () {
            var outer;
            HtmlButton.__super__.initialize.call(this);
            this.el = this.div();
            this.el.addClass('ui button');
            this.el.addClass(this.spec['class']);
            this.el.append(this.spec.label);
            outer = this;
            return this.el.on('click', function (_this) {
                return function () {
                    console.log('emitting clicked');
                    return outer.emit('clicked', {
                        id: outer.id,
                        source: _this,
                        label: _this.spec.label,
                        name: _this.name
                    });
                };
            }(this));
        };
        return HtmlButton;
    }(html.HtmlStimulus);
    exports.HtmlButton = HtmlButton;
}.call(this));
});
require.define('75', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Canvas;
    Canvas = {};
    Canvas.Arrow = require('99', module).Arrow;
    Canvas.Background = require('79', module).Background;
    Canvas.Blank = require('100', module).Blank;
    Canvas.Circle = require('101', module).Circle;
    Canvas.Clear = require('102', module).Clear;
    Canvas.FixationCross = require('103', module).FixationCross;
    Canvas.CanvasBorder = require('104', module).CanvasBorder;
    Canvas.GridLines = require('105', module).GridLines;
    Canvas.Picture = require('106', module).Picture;
    Canvas.Rectangle = require('107', module).Rectangle;
    Canvas.StartButton = require('108', module).StartButton;
    Canvas.Text = require('109', module).Text;
    Canvas.TextInput = require('110', module).TextInput;
    Canvas.LabeledElement = require('111', module).LabeledElement;
    Canvas.MessageBox = require('119', module).MessageBox;
    Canvas.TrailsA = require('114', module).TrailsA;
    Canvas.Title = require('124', module).Title;
    exports.Canvas = Canvas;
}.call(this));
});
require.define('111', function(module, exports, __dirname, __filename, undefined){
(function () {
    var LabeledElement, StimResp, Text, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Text = require('112', module).Text;
    StimResp = require('72', module);
    LabeledElement = function (_super) {
        __extends(LabeledElement, _super);
        LabeledElement.prototype.defaults = {
            position: 'below',
            content: 'Label',
            align: 'center',
            gap: 10,
            fontSize: 24,
            fill: 'black',
            fontFamily: 'Arial'
        };
        function LabeledElement(element, spec) {
            this.element = element;
            if (spec == null) {
                spec = {};
            }
            LabeledElement.__super__.constructor.call(this, spec);
        }
        LabeledElement.prototype.render = function (context) {
            var target;
            target = this.element.render(context);
            this.text = new Kinetic.Text({
                x: 0,
                y: 0,
                text: this.spec.content,
                fontSize: this.spec.fontSize,
                fill: this.spec.fill,
                align: this.spec.align,
                width: target.width(),
                fontFamily: this.spec.fontFamily,
                padding: 2
            });
            switch (this.spec.position) {
            case 'below':
                this.text.setPosition({
                    x: target.x(),
                    y: target.y() + target.height() + this.spec.gap
                });
                break;
            case 'above':
                this.text.setPosition({
                    x: target.x(),
                    y: target.y() - this.text.getTextHeight()
                });
                break;
            case 'left':
                this.text.setPosition({
                    x: target.x() - this.text.getTextWidth() - this.spec.gap,
                    y: target.y()
                });
                break;
            case 'right':
                this.text.setPosition({
                    x: target.x() + target.width() + this.spec.gap,
                    y: target.y()
                });
                break;
            case 'over':
                this.text.setPosition({
                    x: target.x() + target.width() / 2 - this.text.getWidth() / 2,
                    y: target.y() + target.height() / 2 - this.text.getTextHeight() / 2
                });
                break;
            default:
                throw new Error('illegal option', this.spec.position);
            }
            return new StimResp.ContainerDrawable([
                target,
                new StimResp.KineticDrawable(this, this.text)
            ]);
        };
        return LabeledElement;
    }(StimResp.Stimulus);
    exports.LabeledElement = LabeledElement;
}.call(this));
});
require.define('112', function(module, exports, __dirname, __filename, undefined){
(function () {
    var KStimulus, Text, layout, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    layout = require('73', module);
    _ = require('16', module);
    KStimulus = require('72', module).KineticStimulus;
    Text = function (_super) {
        __extends(Text, _super);
        Text.prototype.defaults = {
            content: 'Text',
            x: 5,
            y: 5,
            width: null,
            fill: 'black',
            fontSize: 40,
            fontFamily: 'Arial',
            align: 'center',
            position: null
        };
        function Text(spec) {
            if (spec == null) {
                spec = {};
            }
            if (spec.content != null && _.isArray(spec.content)) {
                spec.content = spec.content.join(' \n ');
                if (spec.lineHeight == null) {
                    spec.lineHeight = 2;
                }
            }
            Text.__super__.constructor.call(this, spec);
        }
        Text.prototype.initialize = function () {
            return this.text = new Kinetic.Text({
                x: 0,
                y: 0,
                text: this.spec.content,
                fontSize: this.spec.fontSize,
                fontFamily: this.spec.fontFamily,
                fill: this.spec.fill,
                lineHeight: this.spec.lineHeight || 1,
                width: this.spec.width,
                listening: false,
                align: this.spec.align
            });
        };
        Text.prototype.render = function (context, layer) {
            var coords;
            coords = this.computeCoordinates(context, this.spec.position, this.text.getWidth(), this.text.getHeight());
            this.text.setPosition({
                x: coords[0],
                y: coords[1]
            });
            return this.presentable(this, this.text);
        };
        return Text;
    }(KStimulus);
    exports.Text = Text;
}.call(this));
});
require.define('110', function(module, exports, __dirname, __filename, undefined){
(function () {
    var KStimulus, TextInput, utils, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    utils = require('69', module);
    KStimulus = require('72', module).KineticStimulus;
    TextInput = function (_super) {
        __extends(TextInput, _super);
        TextInput.prototype.defaults = {
            x: 100,
            y: 100,
            width: 200,
            height: 40,
            defaultValue: '',
            fill: '#FAF5E6',
            stroke: '#0099FF',
            strokeWidth: 1,
            content: ''
        };
        function TextInput(spec) {
            if (spec == null) {
                spec = {};
            }
            TextInput.__super__.constructor.call(this, spec);
            utils.disableBrowserBack();
        }
        TextInput.prototype.getChar = function (e) {
            if (e.keyCode !== 16) {
                if (e.keyCode >= 65 && e.keyCode <= 90) {
                    if (e.shiftKey) {
                        return String.fromCharCode(e.keyCode);
                    } else {
                        return String.fromCharCode(e.keyCode + 32);
                    }
                } else if (e.keyCode >= 48 && e.keyCode <= 57) {
                    return String.fromCharCode(e.keyCode);
                } else {
                    switch (e.keyCode) {
                    case 186:
                        return ';';
                    case 187:
                        return '=';
                    case 188:
                        return ',';
                    case 189:
                        return '-';
                    default:
                        return '';
                    }
                }
            } else {
                return String.fromCharCode(e.keyCode);
            }
        };
        TextInput.prototype.animateCursor = function (layer, cursor) {
            var flashTime;
            flashTime = 0;
            return new Kinetic.Animation(function (_this) {
                return function (frame) {
                    if (frame.time > flashTime + 500) {
                        flashTime = frame.time;
                        if (cursor.getOpacity() === 1) {
                            cursor.setOpacity(0);
                        } else {
                            cursor.setOpacity(1);
                        }
                        return layer.draw();
                    }
                };
            }(this), layer);
        };
        TextInput.prototype.render = function (context, layer) {
            var cursor, cursorBlink, enterPressed, fsize, group, keyStream, text, textContent, textRect;
            textRect = new Kinetic.Rect({
                x: this.spec.x,
                y: this.spec.y,
                width: this.spec.width,
                height: this.spec.height,
                fill: this.spec.fill,
                cornerRadius: 4,
                lineJoin: 'round',
                stroke: this.spec.stroke,
                strokeWidth: this.spec.strokeWidth
            });
            textContent = this.spec.content;
            fsize = 0.85 * this.spec.height;
            text = new Kinetic.Text({
                text: this.spec.content,
                x: this.spec.x + 2,
                y: this.spec.y - 5,
                height: this.spec.height,
                fontSize: fsize,
                fill: 'black',
                padding: 10,
                align: 'left'
            });
            cursor = new Kinetic.Rect({
                x: text.getX() + text.getWidth() - 7,
                y: this.spec.y + 5,
                width: 1.5,
                height: text.getHeight() - 10,
                fill: 'black'
            });
            enterPressed = false;
            keyStream = context.keydownStream();
            keyStream.takeWhile(function (_this) {
                return function (x) {
                    return enterPressed === false && !_this.stopped;
                };
            }(this)).onValue(function (_this) {
                return function (event) {
                    var char;
                    if (event.keyCode === 13) {
                        return enterPressed = true;
                    } else if (event.keyCode === 8) {
                        textContent = textContent.slice(0, -1);
                        text.setText(textContent);
                        cursor.setX(text.getX() + text.getWidth() - 7);
                        return layer.draw();
                    } else if (text.getWidth() > textRect.getWidth()) {
                    } else {
                        char = _this.getChar(event);
                        textContent += char;
                        text.setText(textContent);
                        cursor.setX(text.getX() + text.getWidth() - 7);
                        return layer.draw();
                    }
                };
            }(this));
            cursorBlink = this.animateCursor(layer, cursor);
            cursorBlink.start();
            group = new Kinetic.Group({});
            group.add(textRect);
            group.add(cursor);
            group.add(text);
            return layer.add(group);
        };
        return TextInput;
    }(KStimulus);
    exports.TextInput = TextInput;
}.call(this));
});
require.define('109', function(module, exports, __dirname, __filename, undefined){
(function () {
    var KStimulus, Text, layout, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    layout = require('73', module);
    _ = require('16', module);
    KStimulus = require('72', module).KineticStimulus;
    Text = function (_super) {
        __extends(Text, _super);
        Text.prototype.defaults = {
            content: 'Text',
            x: 5,
            y: 5,
            width: null,
            fill: 'black',
            fontSize: 40,
            fontFamily: 'Arial',
            align: 'center',
            position: null
        };
        function Text(spec) {
            if (spec == null) {
                spec = {};
            }
            if (spec.content != null && _.isArray(spec.content)) {
                spec.content = spec.content.join(' \n ');
                if (spec.lineHeight == null) {
                    spec.lineHeight = 2;
                }
            }
            Text.__super__.constructor.call(this, spec);
        }
        Text.prototype.initialize = function () {
            return this.text = new Kinetic.Text({
                x: 0,
                y: 0,
                text: this.spec.content,
                fontSize: this.spec.fontSize,
                fontFamily: this.spec.fontFamily,
                fill: this.spec.fill,
                lineHeight: this.spec.lineHeight || 1,
                width: this.spec.width,
                listening: false,
                align: this.spec.align
            });
        };
        Text.prototype.render = function (context, layer) {
            var coords;
            coords = this.computeCoordinates(context, this.spec.position, this.text.getWidth(), this.text.getHeight());
            this.text.setPosition({
                x: coords[0],
                y: coords[1]
            });
            return this.presentable(this, this.text);
        };
        return Text;
    }(KStimulus);
    exports.Text = Text;
}.call(this));
});
require.define('108', function(module, exports, __dirname, __filename, undefined){
(function () {
    var KStimulus, StartButton, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    KStimulus = require('72', module).KineticStimulus;
    StartButton = function (_super) {
        __extends(StartButton, _super);
        function StartButton() {
            return StartButton.__super__.constructor.apply(this, arguments);
        }
        StartButton.prototype.defaults = {
            width: 150,
            height: 75
        };
        StartButton.prototype.render = function (context) {
            var button, group, text, xcenter, ycenter;
            xcenter = context.width() / 2;
            ycenter = context.height() / 2;
            group = new Kinetic.Group({ id: this.spec.id });
            text = new Kinetic.Text({
                text: 'Start',
                x: xcenter - this.spec.width / 2,
                y: ycenter - this.spec.height / 2,
                width: this.spec.width,
                height: this.spec.height,
                fontSize: 30,
                fill: 'white',
                fontFamily: 'Arial',
                align: 'center',
                padding: 20
            });
            button = new Kinetic.Rect({
                x: xcenter - this.spec.width / 2,
                y: ycenter - text.getHeight() / 2,
                width: this.spec.width,
                height: text.getHeight(),
                fill: 'black',
                cornerRadius: 10,
                stroke: 'LightSteelBlue',
                strokeWidth: 5
            });
            group.add(button);
            group.add(text);
            return this.presentable(this, group);
        };
        return StartButton;
    }(KStimulus);
    exports.StartButton = StartButton;
}.call(this));
});
require.define('107', function(module, exports, __dirname, __filename, undefined){
(function () {
    var KStimulus, Rectangle, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    KStimulus = require('72', module).KineticStimulus;
    Rectangle = function (_super) {
        __extends(Rectangle, _super);
        Rectangle.prototype.defaults = {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            opacity: 1,
            fill: 'black'
        };
        function Rectangle(spec) {
            if (spec == null) {
                spec = {};
            }
            Rectangle.__super__.constructor.call(this, spec);
        }
        Rectangle.prototype.render = function (context) {
            var coords, rect;
            coords = this.computeCoordinates(context, this.spec.position, this.spec.width, this.spec.height);
            rect = new Kinetic.Rect({
                x: coords[0],
                y: coords[1],
                width: this.spec.width,
                height: this.spec.height,
                fill: this.spec.fill,
                stroke: this.spec.stroke,
                strokeWidth: this.spec.strokeWidth,
                opacity: this.spec.opacity
            });
            return this.presentable(this, rect);
        };
        return Rectangle;
    }(KStimulus);
    exports.Rectangle = Rectangle;
}.call(this));
});
require.define('106', function(module, exports, __dirname, __filename, undefined){
(function () {
    var KStimulus, Picture, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    KStimulus = require('72', module).KineticStimulus;
    Picture = function (_super) {
        __extends(Picture, _super);
        Picture.prototype.defaults = {
            url: 'http://www.html5canvastutorials.com/demos/assets/yoda.jpg',
            x: 0,
            y: 0,
            stroke: null,
            strokeWidth: 0,
            position: null
        };
        function Picture(spec) {
            if (spec == null) {
                spec = {};
            }
            Picture.__super__.constructor.call(this, spec);
            this.image = null;
        }
        Picture.prototype.initialize = function () {
            this.imageObj = new Image();
            this.imageObj.onload = function (_this) {
                return function () {
                    console.log('image loaded', _this.spec.url);
                    return _this.image = new Kinetic.Image({
                        x: _this.spec.x,
                        y: _this.spec.y,
                        image: _this.imageObj,
                        width: _this.spec.width || _this.imageObj.width,
                        height: _this.spec.height || _this.imageObj.height,
                        stroke: _this.spec.stroke,
                        strokeWidth: _this.spec.strokeWidth,
                        id: _this.spec.id
                    });
                };
            }(this);
            return this.imageObj.src = this.spec.url;
        };
        Picture.prototype.render = function (context) {
            var coords;
            console.log('rendering image', this.image);
            coords = this.computeCoordinates(context, this.spec.position, this.image.getWidth(), this.image.getHeight());
            this.image.setPosition({
                x: coords[0],
                y: coords[1]
            });
            return this.presentable(this, this.image);
        };
        return Picture;
    }(KStimulus);
    exports.Picture = Picture;
}.call(this));
});
require.define('105', function(module, exports, __dirname, __filename, undefined){
(function () {
    var GridLines, KStimulus, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    KStimulus = require('72', module).KineticStimulus;
    GridLines = function (_super) {
        __extends(GridLines, _super);
        GridLines.prototype.defaults = {
            x: 0,
            y: 0,
            width: null,
            height: null,
            rows: 3,
            cols: 3,
            stroke: 'black',
            strokeWidth: 2,
            dashArray: null
        };
        function GridLines(spec) {
            if (spec == null) {
                spec = {};
            }
            GridLines.__super__.constructor.call(this, spec);
        }
        GridLines.prototype.render = function (context) {
            var group, height, i, line, width, x, y, _i, _j, _ref, _ref1;
            if (this.spec.height == null) {
                height = context.height();
            } else {
                height = this.spec.height;
            }
            if (this.spec.width == null) {
                width = context.width();
            } else {
                width = this.spec.width;
            }
            group = new Kinetic.Group();
            for (i = _i = 0, _ref = this.spec.rows; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
                y = this.spec.y + i * height / this.spec.rows;
                line = new Kinetic.Line({
                    points: [
                        this.spec.x,
                        y,
                        this.spec.x + width,
                        y
                    ],
                    stroke: this.spec.stroke,
                    strokeWidth: this.spec.strokeWidth,
                    dashArray: this.spec.dashArray
                });
                group.add(line);
            }
            for (i = _j = 0, _ref1 = this.spec.cols; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
                x = this.spec.x + i * width / this.spec.cols;
                line = new Kinetic.Line({
                    points: [
                        x,
                        this.spec.y,
                        x,
                        this.spec.y + height
                    ],
                    stroke: this.spec.stroke,
                    strokeWidth: this.spec.strokeWidth,
                    dashArray: this.spec.dashArray
                });
                group.add(line);
            }
            return this.presentable(this, group);
        };
        return GridLines;
    }(KStimulus);
    exports.GridLines = GridLines;
}.call(this));
});
require.define('104', function(module, exports, __dirname, __filename, undefined){
(function () {
    var CanvasBorder, KStimulus, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    KStimulus = require('72', module).KineticStimulus;
    CanvasBorder = function (_super) {
        __extends(CanvasBorder, _super);
        CanvasBorder.prototype.defaults = {
            strokeWidth: 5,
            stroke: 'black'
        };
        function CanvasBorder(spec) {
            if (spec == null) {
                spec = {};
            }
            CanvasBorder.__super__.constructor.call(this, spec);
        }
        CanvasBorder.prototype.render = function (context) {
            var border;
            border = new Kinetic.Rect({
                x: 0,
                y: 0,
                width: context.width(),
                height: context.height(),
                strokeWidth: this.spec.strokeWidth,
                stroke: this.spec.stroke
            });
            return this.presentable(this, border);
        };
        return CanvasBorder;
    }(KStimulus);
    exports.CanvasBorder = CanvasBorder;
}.call(this));
});
require.define('103', function(module, exports, __dirname, __filename, undefined){
(function () {
    var FixationCross, KStimulus, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    KStimulus = require('72', module).KineticStimulus;
    FixationCross = function (_super) {
        __extends(FixationCross, _super);
        FixationCross.prototype.defaults = {
            strokeWidth: 8,
            length: 150,
            fill: 'black'
        };
        function FixationCross(spec) {
            if (spec == null) {
                spec = {};
            }
            FixationCross.__super__.constructor.call(this, spec);
        }
        FixationCross.prototype.render = function (context) {
            var group, horz, len, vert, x, y;
            x = context.width() / 2;
            y = context.height() / 2;
            len = this.toPixels(this.spec.length, context.width());
            console.log('FIX len is', len);
            horz = new Kinetic.Rect({
                x: x - len / 2,
                y: y,
                width: len,
                height: this.spec.strokeWidth,
                fill: this.spec.fill
            });
            vert = new Kinetic.Rect({
                x: x - this.spec.strokeWidth / 2,
                y: y - len / 2 + this.spec.strokeWidth / 2,
                width: this.spec.strokeWidth,
                height: len,
                fill: this.spec.fill
            });
            group = new Kinetic.Group();
            group.add(horz);
            group.add(vert);
            return this.presentable(this, group);
        };
        return FixationCross;
    }(KStimulus);
    exports.FixationCross = FixationCross;
}.call(this));
});
require.define('102', function(module, exports, __dirname, __filename, undefined){
(function () {
    var ActionPresentable, Clear, GStimulus, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    GStimulus = require('72', module).GraphicalStimulus;
    ActionPresentable = require('72', module).ActionPresentable;
    Clear = function (_super) {
        __extends(Clear, _super);
        function Clear() {
            return Clear.__super__.constructor.apply(this, arguments);
        }
        Clear.prototype.render = function (context) {
            var action;
            action = function (_this) {
                return function (ctx) {
                    return context.clearContent(true);
                };
            }(this);
            return new ActionPresentable(action);
        };
        return Clear;
    }(GStimulus);
    exports.Clear = Clear;
}.call(this));
});
require.define('101', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Circle, KDrawable, KStimulus, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    KStimulus = require('72', module).KineticStimulus;
    KDrawable = require('72', module).KineticDrawable;
    Circle = function (_super) {
        __extends(Circle, _super);
        Circle.prototype.defaults = {
            x: 50,
            y: 50,
            radius: 50,
            fill: 'red',
            opacity: 1,
            origin: 'center'
        };
        function Circle(spec) {
            if (spec == null) {
                spec = {};
            }
            Circle.__super__.constructor.call(this, spec);
        }
        Circle.prototype.initialize = function () {
            return this.circle = new Kinetic.Circle({
                x: this.spec.x,
                y: this.spec.y,
                radius: this.spec.radius,
                fill: this.spec.fill,
                stroke: this.spec.stroke,
                strokeWidth: this.spec.strokeWidth,
                opacity: this.spec.opacity
            });
        };
        Circle.prototype.defaultOrigin = 'center';
        Circle.prototype.render = function (context) {
            var coords;
            coords = this.computeCoordinates(context, this.spec.position, this.circle.getWidth(), this.circle.getHeight());
            this.circle.setPosition({
                x: coords[0],
                y: coords[1]
            });
            return new (function (_super1) {
                __extends(_Class, _super1);
                function _Class() {
                    return _Class.__super__.constructor.apply(this, arguments);
                }
                _Class.prototype.x = function () {
                    return this.node.getX() - this.node.getWidth() / 2;
                };
                _Class.prototype.y = function () {
                    return this.node.getY() - this.node.getHeight() / 2;
                };
                _Class.prototype.width = function () {
                    return this.node.getWidth();
                };
                _Class.prototype.height = function () {
                    return this.node.getHeight();
                };
                return _Class;
            }(KDrawable))(this, this.circle);
        };
        return Circle;
    }(KStimulus);
    exports.Circle = Circle;
}.call(this));
});
require.define('100', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Blank, KStimulus, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    KStimulus = require('72', module).KineticStimulus;
    Blank = function (_super) {
        __extends(Blank, _super);
        function Blank() {
            return Blank.__super__.constructor.apply(this, arguments);
        }
        Blank.prototype.defaults = {
            fill: 'gray',
            opacity: 1
        };
        Blank.prototype.render = function (context) {
            var blank;
            blank = new Kinetic.Rect({
                x: 0,
                y: 0,
                width: context.width(),
                height: context.height(),
                fill: this.spec.fill,
                opacity: this.spec.opacity
            });
            return this.presentable(this, blank);
        };
        return Blank;
    }(KStimulus);
    exports.Blank = Blank;
}.call(this));
});
require.define('99', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Arrow, KStimulus, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    KStimulus = require('72', module).KineticStimulus;
    Arrow = function (_super) {
        __extends(Arrow, _super);
        Arrow.prototype.defaults = {
            x: 100,
            y: 100,
            length: 100,
            direction: 'right',
            thickness: 40,
            fill: 'black',
            arrowSize: 25,
            angle: null
        };
        function Arrow(spec) {
            if (spec == null) {
                spec = {};
            }
            Arrow.__super__.constructor.call(this, spec);
        }
        Arrow.prototype.initialize = function () {
            var height, len, shaftLength, _this;
            if (this.spec.angle != null) {
                this.angle = this.spec.angle;
            } else {
                this.angle = function () {
                    switch (this.spec.direction) {
                    case 'right':
                        return 0;
                    case 'left':
                        return 180;
                    case 'up':
                        return 90;
                    case 'down':
                        return 270;
                    default:
                        return 0;
                    }
                }.call(this);
            }
            shaftLength = this.spec.length - this.spec.arrowSize;
            this.arrowShaft = new Kinetic.Rect({
                x: 0,
                y: 0,
                width: shaftLength,
                height: this.spec.thickness,
                fill: this.spec.fill,
                stroke: this.spec.stroke,
                strokeWidth: this.spec.strokeWidth,
                opacity: this.spec.opacity
            });
            _this = this;
            this.arrowHead = new Kinetic.Shape({
                drawFunc: function (cx) {
                    cx.beginPath();
                    cx.moveTo(shaftLength, -_this.spec.arrowSize / 2);
                    cx.lineTo(shaftLength + _this.spec.arrowSize, _this.spec.thickness / 2);
                    cx.lineTo(shaftLength, _this.spec.thickness + _this.spec.arrowSize / 2);
                    cx.closePath();
                    return cx.fillStrokeShape(this);
                },
                fill: _this.spec.fill,
                stroke: this.spec.stroke,
                strokeWidth: this.spec.strokeWidth,
                opacity: this.spec.opacity,
                width: _this.spec.arrowSize,
                height: _this.spec.arrowSize + _this.spec.thickness
            });
            len = shaftLength + this.spec.arrowSize;
            height = this.spec.thickness;
            this.node = new Kinetic.Group({
                x: 0,
                y: 0,
                rotationDeg: this.angle
            });
            this.node.add(this.arrowShaft);
            return this.node.add(this.arrowHead);
        };
        Arrow.prototype.render = function (context) {
            var coords;
            coords = this.computeCoordinates(context, this.spec.position, this.arrowShaft.getWidth() + this.spec.arrowSize, this.arrowShaft.getHeight());
            console.log('arrow x', this.spec.x);
            console.log('arrow y', this.spec.y);
            console.log('arrow coords', coords);
            console.log('arrow offset', {
                x: (this.arrowShaft.getWidth() + this.spec.arrowSize) / 2,
                y: this.spec.thickness / 2
            });
            this.node.setPosition({
                x: coords[0] + (this.arrowShaft.getWidth() + this.spec.arrowSize) / 2,
                y: coords[1] + this.spec.thickness / 2
            });
            this.node.setOffset({
                x: (this.arrowShaft.getWidth() + this.spec.arrowSize) / 2,
                y: this.spec.thickness / 2
            });
            return this.presentable(this, this.node);
        };
        return Arrow;
    }(KStimulus);
    exports.Arrow = Arrow;
}.call(this));
});
require.define('74', function(module, exports, __dirname, __filename, undefined){
(function () {
    var ArrayIterator, BlockStructure, CellTable, ConditionSet, DataTable, DependentFactorNode, ExpDesign, Factor, FactorNode, FactorSetNode, FactorSpec, ItemNode, ItemSetNode, Iterator, SamplerNode, TaskNode, TrialList, VarSpec, csv, sampler, trimWhiteSpace, utils, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    _ = require('16', module);
    utils = require('69', module);
    DataTable = require('70', module).DataTable;
    csv = require('18', module);
    sampler = require('71', module);
    exports.Factor = Factor = function (_super) {
        __extends(Factor, _super);
        Factor.asFactor = function (arr) {
            return function (func, args, ctor) {
                ctor.prototype = func.prototype;
                var child = new ctor(), result = func.apply(child, args);
                return Object(result) === result ? result : child;
            }(Factor, arr, function () {
            });
        };
        function Factor(arr) {
            var arg, _i, _len;
            for (_i = 0, _len = arr.length; _i < _len; _i++) {
                arg = arr[_i];
                this.push(arg);
            }
            this.levels = _.uniq(arr).sort();
        }
        return Factor;
    }(Array);
    exports.VarSpec = VarSpec = function () {
        function VarSpec() {
        }
        VarSpec.name = '';
        VarSpec.nblocks = 1;
        VarSpec.reps = 1;
        VarSpec.expanded = {};
        VarSpec.prototype.names = function () {
            return this.name;
        };
        VarSpec.prototype.ntrials = function () {
            return this.nblocks * this.reps;
        };
        VarSpec.prototype.valueAt = function (block, trial) {
        };
        return VarSpec;
    }();
    exports.FactorSpec = FactorSpec = function (_super) {
        __extends(FactorSpec, _super);
        function FactorSpec(name, levels) {
            this.name = name;
            this.levels = levels;
            this.factorSet = {};
            this.factorSet[this.name] = this.levels;
            this.conditionTable = DataTable.expand(this.factorSet);
        }
        FactorSpec.prototype.cross = function (other) {
            return new CrossedFactorSpec(this.nblocks, this.reps, [
                this,
                other
            ]);
        };
        FactorSpec.prototype.expand = function (nblocks, reps) {
            var blocks, concatBlocks, i, prop, vset, _i, _results;
            prop = {};
            prop[this.name] = this.levels;
            vset = new DataTable(prop);
            blocks = function () {
                var _i, _results;
                _results = [];
                for (i = _i = 1; 1 <= nblocks ? _i <= nblocks : _i >= nblocks; i = 1 <= nblocks ? ++_i : --_i) {
                    _results.push(vset.replicate(reps));
                }
                return _results;
            }();
            concatBlocks = _.reduce(blocks, function (sum, nex) {
                return DataTable.rbind(sum, nex);
            });
            concatBlocks.bindcol('$Block', utils.rep(function () {
                _results = [];
                for (var _i = 1; 1 <= nblocks ? _i <= nblocks : _i >= nblocks; 1 <= nblocks ? _i++ : _i--) {
                    _results.push(_i);
                }
                return _results;
            }.apply(this), utils.rep(reps * vset.nrow(), nblocks)));
            return concatBlocks;
        };
        return FactorSpec;
    }(exports.VarSpec);
    exports.CellTable = CellTable = function (_super) {
        __extends(CellTable, _super);
        function CellTable(parents) {
            var fac;
            this.parents = parents;
            this.parentNames = function () {
                var _i, _len, _ref, _results;
                _ref = this.parents;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    fac = _ref[_i];
                    _results.push(fac.name);
                }
                return _results;
            }.call(this);
            this.name = _.reduce(this.parentNames, function (n, n1) {
                return n + ':' + n1;
            });
            this.levels = function () {
                var _i, _len, _ref, _results;
                _ref = this.parents;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    fac = _ref[_i];
                    _results.push(fac.levels);
                }
                return _results;
            }.call(this);
            this.factorSet = _.zipObject(this.parentNames, this.levels);
            this.table = DataTable.expand(this.factorSet);
        }
        CellTable.prototype.names = function () {
            return this.parentNames;
        };
        CellTable.prototype.cells = function () {
            return this.table.toRecordArray();
        };
        CellTable.prototype.conditions = function () {
            var i, rec, _i, _ref, _results;
            _results = [];
            for (i = _i = 0, _ref = this.table.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                rec = this.table.record(i);
                _results.push(_.reduce(rec, function (n, n1) {
                    return n + ':' + n1;
                }));
            }
            return _results;
        };
        CellTable.prototype.expand = function (nblocks, reps) {
            var blocks, i;
            return blocks = function () {
                var _i, _results;
                _results = [];
                for (i = _i = 1; 1 <= nblocks ? _i <= nblocks : _i >= nblocks; i = 1 <= nblocks ? ++_i : --_i) {
                    _results.push(this.table.replicate(reps));
                }
                return _results;
            }.call(this);
        };
        return CellTable;
    }(exports.VarSpec);
    exports.BlockStructure = BlockStructure = function () {
        function BlockStructure(nblocks, trialsPerBlock) {
            this.nblocks = nblocks;
            this.trialsPerBlock = trialsPerBlock;
        }
        return BlockStructure;
    }();
    exports.TaskNode = TaskNode = function () {
        function TaskNode(varNodes, crossedSet) {
            var i, vname, _i, _j, _k, _len, _len1, _ref, _ref1, _ref2;
            this.varNodes = varNodes;
            this.crossedSet = crossedSet != null ? crossedSet : [];
            this.factorNames = _.map(this.varNodes, function (x) {
                return x.name;
            });
            this.varmap = {};
            for (i = _i = 0, _ref = this.factorNames.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                this.varmap[this.factorNames[i]] = this.varSpecs[i];
            }
            if (this.crossedSet.length > 0) {
                _ref1 = this.crossedSet;
                for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
                    vname = _ref1[_j];
                    this.crossedVars = this.varmap[vname];
                }
                this.crossedSpec = new CrossedFactorSpec(this.crossedVars);
            } else {
                this.crossedVars = [];
                this.crossedSpec = {};
            }
            this.uncrossedVars = _.difference(this.factorNames, this.crossedSet);
            _ref2 = this.uncrossedVars;
            for (_k = 0, _len1 = _ref2.length; _k < _len1; _k++) {
                vname = _ref2[_k];
                this.uncrossedSpec = this.varmap[vname];
            }
            ({
                expand: function (nblocks, nreps) {
                    var ctable;
                    if (this.crossedVars.length > 0) {
                        return ctable = this.crossedSpec.expand(nblocks, nreps);
                    }
                }
            });
        }
        return TaskNode;
    }();
    FactorNode = FactorNode = function () {
        FactorNode.build = function (name, spec) {
            if (spec.levels == null && _.isArray(spec)) {
                return new FactorNode(name, spec);
            } else {
                return new FactorNode(name, spec.levels);
            }
        };
        function FactorNode(name, levels) {
            this.name = name;
            this.levels = levels;
            this.cellTable = new CellTable([this]);
        }
        FactorNode.prototype.choose = function () {
            return utils.oneOf(this.levels);
        };
        FactorNode.prototype.chooseK = function (k) {
            return utils.permute(this.levels, k);
        };
        FactorNode.prototype.chooseDependent = function (recArray) {
            return this.chooseK(recArray.length);
        };
        FactorNode.prototype.expand = function (nblocks, nreps) {
            return this.cellTable.expand(nblocks, nreps);
        };
        return FactorNode;
    }();
    exports.FactorNode = FactorNode;
    DependentFactorNode = DependentFactorNode = function () {
        DependentFactorNode.build = function (name, spec) {
            return new DependentFactorNode(name, spec.levels, spec.choose);
        };
        function DependentFactorNode(name, levels, chooseFun) {
            this.name = name;
            this.levels = levels;
            this.chooseFun = chooseFun;
            this.cellTable = new CellTable([this]);
        }
        DependentFactorNode.prototype.choose = function (record) {
            return this.chooseFun(record);
        };
        DependentFactorNode.prototype.chooseDependent = function (recArray) {
            return _.map(recArray, function (_this) {
                return function (rec) {
                    return _this.choose(rec);
                };
            }(this));
        };
        DependentFactorNode.prototype.expand = function (nblocks, nreps) {
            return this.cellTable.expand(nblocks, nreps);
        };
        return DependentFactorNode;
    }();
    exports.DependentFactorNode = DependentFactorNode;
    exports.FactorSetNode = FactorSetNode = function () {
        FactorSetNode.build = function (spec) {
            var fnodes, key, value;
            fnodes = function () {
                var _results;
                _results = [];
                for (key in spec) {
                    value = spec[key];
                    _results.push(exports.FactorNode.build(key, value));
                }
                return _results;
            }();
            return new FactorSetNode(fnodes);
        };
        function FactorSetNode(factors) {
            var i, _i, _ref;
            this.factors = factors;
            this.factorNames = _.map(this.factors, function (x) {
                return x.name;
            });
            this.varmap = {};
            for (i = _i = 0, _ref = this.factorNames.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                this.varmap[this.factorNames[i]] = this.factors[i];
            }
            this.cellTable = new CellTable(this.factors);
            this.name = this.cellTable.name;
        }
        FactorSetNode.prototype.levels = function () {
            return this.cellTable.levels;
        };
        FactorSetNode.prototype.conditions = function () {
            return this.cellTable.conditions();
        };
        FactorSetNode.prototype.cells = function () {
            return this.cellTable.cells();
        };
        FactorSetNode.prototype.expand = function (nblocks, nreps) {
            return this.cellTable.expand(nblocks, nreps);
        };
        FactorSetNode.prototype.trialList = function (nblocks, nreps) {
            var blk, blocks, i, j, tlist, _i, _j, _len, _ref;
            if (nblocks == null) {
                nblocks = 1;
            }
            if (nreps == null) {
                nreps = 1;
            }
            blocks = this.expand(nblocks, nreps);
            tlist = new TrialList(nblocks);
            for (i = _i = 0, _len = blocks.length; _i < _len; i = ++_i) {
                blk = blocks[i];
                for (j = _j = 0, _ref = blk.nrow(); 0 <= _ref ? _j < _ref : _j > _ref; j = 0 <= _ref ? ++_j : --_j) {
                    tlist.add(i, blk.record(j));
                }
            }
            return tlist;
        };
        return FactorSetNode;
    }();
    exports.Iterator = Iterator = function () {
        function Iterator() {
        }
        Iterator.prototype.hasNext = function () {
            return false;
        };
        Iterator.prototype.next = function () {
            throw 'empty iterator';
        };
        Iterator.prototype.map = function (fun) {
            throw 'empty iterator';
        };
        return Iterator;
    }();
    exports.ArrayIterator = ArrayIterator = function (_super) {
        __extends(ArrayIterator, _super);
        function ArrayIterator(arr) {
            this.arr = arr;
            this.cursor = 0;
            ({
                hasNext: function () {
                    return this.cursor < this.arr.length;
                },
                next: function () {
                    var ret;
                    ret = this.arr[this.cursor];
                    this.cursor = this.cursor + 1;
                    return ret;
                },
                map: function (f) {
                    return _.map(this.arr, function (el) {
                        return f(el);
                    });
                }
            });
        }
        return ArrayIterator;
    }(Iterator);
    TrialList = function () {
        TrialList.fromBlockArray = function (blocks) {
            var i, rec, tlist, _i, _j, _len, _ref, _ref1;
            if (!_.isArray(blocks)) {
                throw new Error('TrialList.fromBlockArray: \'blocks\' argument must be an array');
            }
            tlist = new TrialList(blocks.length);
            for (i = _i = 0, _ref = blocks.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                console.log('blocks[i] is', blocks[i]);
                _ref1 = blocks[i].toRecordArray();
                for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
                    rec = _ref1[_j];
                    tlist.add(i, rec);
                }
            }
            return tlist;
        };
        function TrialList(nblocks) {
            var i, _i;
            this.blocks = [];
            for (i = _i = 0; 0 <= nblocks ? _i < nblocks : _i > nblocks; i = 0 <= nblocks ? ++_i : --_i) {
                this.blocks.push([]);
            }
        }
        TrialList.prototype.add = function (block, trial) {
            var blen;
            if (block >= this.blocks.length) {
                blen = this.blocks.length;
                throw new Error('block index ' + block + ' exceeds number of blocks in TrialList ' + blen);
            }
            return this.blocks[block].push(trial);
        };
        TrialList.prototype.get = function (block, trialNum) {
            return this.blocks[block][trialNum];
        };
        TrialList.prototype.getBlock = function (block) {
            return this.blocks[block];
        };
        TrialList.prototype.nblocks = function () {
            return this.blocks.length;
        };
        TrialList.prototype.ntrials = function () {
            var nt;
            nt = _.map(this.blocks, function (b) {
                return b.length;
            });
            return _.reduce(nt, function (x0, x1) {
                return x0 + x1;
            });
        };
        TrialList.prototype.shuffle = function () {
            return this.blocks = _.map(this.blocks, function (blk) {
                return _.shuffle(blk);
            });
        };
        TrialList.prototype.bind = function (fun) {
            var blk, i, out, ret, trial, _i, _j, _len, _len1, _ref;
            out = new TrialList(this.blocks.length);
            _ref = this.blocks;
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
                blk = _ref[i];
                for (_j = 0, _len1 = blk.length; _j < _len1; _j++) {
                    trial = blk[_j];
                    ret = fun(trial);
                    out.add(i, _.assign(trial, ret));
                }
            }
            return out;
        };
        TrialList.prototype.blockIterator = function () {
            return new ArrayIterator(_.map(this.blocks, function (blk) {
                return new ArrayIterator(blk);
            }));
        };
        return TrialList;
    }();
    exports.TrialList = TrialList;
    trimWhiteSpace = function (records) {
        var i, key, out, record, trimmed, value, _i, _ref;
        trimmed = [];
        for (i = _i = 0, _ref = records.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            record = records[i];
            out = {};
            for (key in record) {
                value = record[key];
                out[key.trim()] = value.trim();
            }
            trimmed.push(out);
        }
        return trimmed;
    };
    exports.ItemNode = ItemNode = function () {
        ItemNode.build = function (name, spec) {
            var attrs, dtable, inode, items, snode;
            if (spec.type == null) {
                spec.type = 'text';
            }
            snode = spec.sampler != null ? SamplerNode.build(spec.sampler) : new SamplerNode('default', {});
            if (spec.data != null) {
                dtable = DataTable.fromRecords(spec.data);
                attrs = dtable.dropColumn(name);
                items = dtable[name];
                return new ItemNode(name, items, attrs, spec.type, snode.makeSampler(items));
            } else if (spec.csv != null) {
                inode = null;
                $.ajax({
                    url: spec.csv.url,
                    dataType: 'text',
                    async: false,
                    success: function (_this) {
                        return function (data) {
                            var records;
                            records = trimWhiteSpace(csv.toObjects(data));
                            dtable = DataTable.fromRecords(records);
                            items = dtable[name];
                            attrs = dtable.dropColumn(name);
                            return inode = new ItemNode(name, items, attrs, spec.type, snode.makeSampler(items));
                        };
                    }(this),
                    error: function (x) {
                        return console.log(x);
                    }
                });
                return inode;
            }
        };
        function ItemNode(name, items, attributes, type, sampler) {
            this.name = name;
            this.items = items;
            this.attributes = attributes;
            this.type = type;
            this.sampler = sampler;
            if (this.items.length !== this.attributes.nrow()) {
                throw 'Number of items must equal number of attributes';
            }
        }
        ItemNode.prototype.sample = function (n) {
            return this.sampler.take(n);
        };
        return ItemNode;
    }();
    exports.ItemSetNode = ItemSetNode = function () {
        ItemSetNode.build = function (spec) {
            var key, nodes, value;
            nodes = function () {
                var _results;
                _results = [];
                for (key in spec) {
                    value = spec[key];
                    _results.push(exports.ItemNode.build(key, value));
                }
                return _results;
            }();
            return new ItemSetNode(nodes);
        };
        function ItemSetNode(itemNodes) {
            this.itemNodes = itemNodes;
            this.names = _.map(this.itemNodes, function (n) {
                return n.name;
            });
        }
        ItemSetNode.prototype.sample = function (n) {
            var i, items, j, name, out, record, _i, _j, _len, _ref;
            items = _.map(this.itemNodes, function (node) {
                return node.sample(n);
            });
            out = [];
            for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
                record = {};
                _ref = this.names;
                for (j = _j = 0, _len = _ref.length; _j < _len; j = ++_j) {
                    name = _ref[j];
                    record[name] = items[j][i];
                }
                out.push(record);
            }
            return out;
        };
        return ItemSetNode;
    }();
    SamplerNode = SamplerNode = function () {
        SamplerNode.build = function (spec) {
            if (spec.type == null) {
                spec.type = 'default';
            }
            return new SamplerNode(spec.type, spec);
        };
        function SamplerNode(type, params) {
            this.makeSampler = function () {
                switch (type) {
                case 'default':
                    return function (items) {
                        return new sampler.Sampler(items, params);
                    };
                case 'exhaustive':
                    return function (items) {
                        return new sampler.ExhaustiveSampler(items, params);
                    };
                case 'replacement':
                    return function (items) {
                        return new sampler.ReplacementSampler(items, params);
                    };
                default:
                    throw new Error('unrecognized sampler type', type);
                }
            }();
        }
        return SamplerNode;
    }();
    exports.SamplerNode = SamplerNode;
    exports.ConditionSet = ConditionSet = function () {
        ConditionSet.build = function (spec) {
            var key, value, _crossed, _uncrossed;
            if (spec.Crossed == null && !spec.Uncrossed) {
                _crossed = exports.FactorSetNode.build(spec.Crossed);
                _uncrossed = {};
            } else {
                _crossed = exports.FactorSetNode.build(spec.Crossed);
                _uncrossed = function () {
                    var _ref, _results;
                    _ref = spec.Uncrossed;
                    _results = [];
                    for (key in _ref) {
                        value = _ref[key];
                        _results.push(DependentFactorNode.build(key, value));
                    }
                    return _results;
                }();
            }
            return new ConditionSet(_crossed, _uncrossed);
        };
        function ConditionSet(crossed, uncrossed) {
            this.crossed = crossed;
            this.uncrossed = uncrossed;
            this.factorNames = [].concat(this.crossed.factorNames).concat(_.map(this.uncrossed, function (_this) {
                return function (fac) {
                    return fac.name;
                };
            }(this)));
            this.factorArray = _.clone(this.crossed.factors);
            _.forEach(this.uncrossed, function (_this) {
                return function (fac) {
                    return _this.factorArray.push(fac);
                };
            }(this));
            this.factorSet = _.zipObject(this.factorNames, this.factorArray);
        }
        ConditionSet.prototype.expand = function (nblocks, nreps) {
            var blk, cellTab, i, _i, _j, _len, _ref;
            cellTab = this.crossed.expand(nblocks, nreps);
            for (_i = 0, _len = cellTab.length; _i < _len; _i++) {
                blk = cellTab[_i];
                for (i = _j = 0, _ref = this.uncrossed.length; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
                    blk.bindcol(this.uncrossed[i].name, this.uncrossed[i].chooseDependent(blk.toRecordArray()));
                }
            }
            return TrialList.fromBlockArray(cellTab);
        };
        return ConditionSet;
    }();
    exports.ExpDesign = ExpDesign = function () {
        ExpDesign.blocks = 1;
        ExpDesign.validate = function (spec) {
            var des;
            if (!('Design' in spec)) {
                throw 'Design is undefined';
            }
            des = spec['Design'];
            if (!('Variables' in des)) {
                throw 'Variables is undefined';
            }
            if (!('Structure' in des)) {
                throw 'Structure is undefined';
            }
            if (!('Items' in spec)) {
                throw 'Items is undefined';
            }
        };
        ExpDesign.splitCrossedItems = function (itemSpec, crossedVariables) {
            var attrnames, conditionTable, i, indices, itemSets, j, keySet, levs, record, values;
            attrnames = crossedVariables.colnames();
            keySet = function () {
                var _i, _ref, _results;
                _results = [];
                for (i = _i = 0, _ref = crossedVariables.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    record = crossedVariables.record(i);
                    levs = _.values(record);
                    _results.push(_.reduce(levs, function (a, b) {
                        return a + ':' + b;
                    }));
                }
                return _results;
            }();
            values = itemSpec['values'];
            conditionTable = new DataTable(_.pick(itemSpec, attrnames));
            itemSets = function () {
                var _i, _ref, _results;
                _results = [];
                for (i = _i = 0, _ref = crossedVariables.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    record = crossedVariables.record(i);
                    indices = conditionTable.whichRow(record);
                    _results.push(function () {
                        var _j, _len, _results1;
                        _results1 = [];
                        for (_j = 0, _len = indices.length; _j < _len; _j++) {
                            j = indices[_j];
                            _results1.push(values[j]);
                        }
                        return _results1;
                    }());
                }
                return _results;
            }();
            return _.zipObject(keySet, itemSets);
        };
        ExpDesign.prototype.init = function (spec) {
            this.design = spec['Design'];
            this.variables = this.design['Variables'];
            this.itemSpec = spec['Items'];
            this.structure = this.design['Structure'];
            this.factorNames = _.keys(this.variables);
            this.crossed = this.variables['Crossed'];
            return this.auxiliary = this.variables['Auxiliary'];
        };
        ExpDesign.prototype.initStructure = function () {
            if (this.structure['type'] === 'Block') {
                if (!_.has(this.structure, 'reps_per_block')) {
                    this.structure['reps_per_block'] = 1;
                }
                this.reps_per_block = this.structure['reps_per_block'];
                return this.blocks = this.structure['blocks'];
            } else {
                this.reps_per_block = 1;
                return this.blocks = 1;
            }
        };
        ExpDesign.prototype.makeConditionalSampler = function (crossedSpec, crossedItems) {
            var crossedItemMap, crossedItemName, key;
            crossedItemName = _.keys(crossedItems)[0];
            console.log('names:', crossedSpec.names());
            crossedItemMap = function () {
                var _i, _len, _ref, _results;
                _ref = crossedSpec.names();
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    key = _ref[_i];
                    _results.push(crossedItems[crossedItemName][key]);
                }
                return _results;
            }();
            crossedItemMap = _.zipObject(_.keys(this.crossed), crossedItemMap);
            console.log('item map: ', crossedItemMap);
            return new ConditionalSampler(crossedItems[crossedItemName].values, new DataTable(crossedItemMap), crossedSpec);
        };
        ExpDesign.prototype.makeCrossedSpec = function (crossed, nblocks, nreps) {
            var factors, key, val;
            factors = function () {
                var _results;
                _results = [];
                for (key in crossed) {
                    val = crossed[key];
                    _results.push(new FactorSpec(nblocks, nreps, key, val.levels));
                }
                return _results;
            }();
            return crossed = new CrossedFactorSpec(nblocks, nreps, factors);
        };
        ExpDesign.prototype.makeFactorSpec = function (fac, nblocks, nreps) {
            return new FactorSpec(nblocks, nreps, _.keys(fac)[0], _.values(fac)[0]);
        };
        function ExpDesign(spec) {
            var crossedItems, crossedSampler;
            if (spec == null) {
                spec = {};
            }
            ExpDesign.validate(spec);
            this.init(spec);
            this.initStructure();
            this.crossedSpec = this.makeCrossedSpec(this.crossed, this.blocks, this.reps_per_block);
            crossedItems = this.itemSpec.Crossed;
            crossedSampler = this.makeConditionalSampler(this.crossedSpec, crossedItems);
            this.fullDesign = this.crossedSpec.expanded.bindcol(_.keys(crossedItems)[0], crossedSampler.take(this.crossedSpec.expanded.nrow()));
            console.log(this.crossedDesign);
        }
        return ExpDesign;
    }();
}.call(this));
});
require.define('71', function(module, exports, __dirname, __filename, undefined){
(function () {
    var BucketSampler, CombinatoricSampler, ConditionalSampler, DataTable, ExhaustiveSampler, GridSampler, MatchSampler, ReplacementSampler, Sampler, UniformSampler, utils, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        }, __slice = [].slice;
    utils = require('69', module);
    _ = require('16', module);
    DataTable = require('70', module).DataTable;
    Sampler = function () {
        function Sampler(items) {
            var _i, _ref, _results;
            this.items = items;
            this.indexBuffer = _.shuffle(function () {
                _results = [];
                for (var _i = 0, _ref = this.items.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
                    _results.push(_i);
                }
                return _results;
            }.apply(this));
        }
        Sampler.prototype.next = function () {
            var i, _i, _ref, _results;
            i = this.indexBuffer.length > 0 ? this.indexBuffer.shift() : (this.indexBuffer = _.shuffle(function () {
                _results = [];
                for (var _i = 0, _ref = this.items.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
                    _results.push(_i);
                }
                return _results;
            }.apply(this)), this.indexBuffer.shift());
            return this.items[i];
        };
        Sampler.prototype.takeAmong = function (n, among) {
            var count, ret, sam;
            ret = [];
            count = 0;
            while (count < n) {
                sam = takeOne();
                if (_.contains(among, sam)) {
                    ret.push(sam);
                    count++;
                }
            }
            return ret;
        };
        Sampler.prototype.take = function (n) {
            var i, ret, _i, _ref, _results;
            if (n > this.items.length) {
                throw 'cannot take sample larger than the number of items when using non-replacing sampler';
            }
            this.indexBuffer = _.shuffle(function () {
                _results = [];
                for (var _i = 0, _ref = this.items.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
                    _results.push(_i);
                }
                return _results;
            }.apply(this));
            ret = function () {
                var _j, _results1;
                _results1 = [];
                for (i = _j = 0; 0 <= n ? _j < n : _j > n; i = 0 <= n ? ++_j : --_j) {
                    _results1.push(this.next());
                }
                return _results1;
            }.call(this);
            return ret;
        };
        Sampler.prototype.takeOne = function () {
            return this.take(1)[0];
        };
        return Sampler;
    }();
    exports.Sampler = Sampler;
    exports.ReplacementSampler = ReplacementSampler = function (_super) {
        __extends(ReplacementSampler, _super);
        function ReplacementSampler() {
            return ReplacementSampler.__super__.constructor.apply(this, arguments);
        }
        ReplacementSampler.prototype.sampleFrom = function (items, n) {
            return utils.sample(items, n, true);
        };
        ReplacementSampler.prototype.take = function (n) {
            return this.sampleFrom(this.items, n);
        };
        return ReplacementSampler;
    }(Sampler);
    exports.BucketSampler = BucketSampler = function (_super) {
        __extends(BucketSampler, _super);
        function BucketSampler(items) {
            this.items = items;
            this.remaining = _.shuffle(this.items.slice(0));
        }
        BucketSampler.prototype.take = function (n) {
            if (n > this.remaining.length) {
                throw new Error('cannot remove more items than are left in remaining set');
            }
            return this.remaining.splice(0, n);
        };
        BucketSampler.prototype.size = function () {
            return this.remaining.length;
        };
        BucketSampler.prototype.putBack = function (iset) {
            var item, _i, _len;
            if (_.isArray(iset)) {
                for (_i = 0, _len = iset.length; _i < _len; _i++) {
                    item = iset[_i];
                    this.remaining.push(item);
                }
            } else {
                this.remaining.push(iset);
            }
            return this.remaining = _.shuffle(this.remaining);
        };
        return BucketSampler;
    }(Sampler);
    exports.ExhaustiveSampler = ExhaustiveSampler = function (_super) {
        __extends(ExhaustiveSampler, _super);
        ExhaustiveSampler.fillBuffer = function (items, n) {
            var buf, i;
            buf = function () {
                var _i, _results;
                _results = [];
                for (i = _i = 1; 1 <= n ? _i <= n : _i >= n; i = 1 <= n ? ++_i : --_i) {
                    _results.push(_.shuffle(items));
                }
                return _results;
            }();
            return _.flatten(buf);
        };
        function ExhaustiveSampler(items) {
            this.items = items;
            this.buffer = ExhaustiveSampler.fillBuffer(this.items, 10);
        }
        ExhaustiveSampler.prototype.take = function (n) {
            var buf, buflen, res;
            if (n <= this.buffer.length) {
                res = _.take(this.buffer, n);
                this.buffer = _.drop(this.buffer, n);
                return res;
            } else {
                buflen = Math.max(n, 10 * this.items.length);
                buf = ExhaustiveSampler.fillBuffer(this.items, buflen / this.items.length);
                this.buffer = this.buffer.concat(buf);
                return this.take(n);
            }
        };
        return ExhaustiveSampler;
    }(Sampler);
    exports.MatchSampler = MatchSampler = function () {
        function MatchSampler(sampler) {
            this.sampler = sampler;
        }
        MatchSampler.prototype.take = function (n, match) {
            var probe, probeIndex, sam;
            if (match == null) {
                match = true;
            }
            sam = this.sampler.take(n);
            if (match) {
                probe = utils.sample(sam, 1)[0];
            } else {
                probe = this.sampler.take(1)[0];
            }
            probeIndex = _.indexOf(sam, probe);
            return {
                targetSet: sam,
                probe: probe,
                probeIndex: probeIndex,
                match: match
            };
        };
        return MatchSampler;
    }();
    exports.UniformSampler = UniformSampler = function (_super) {
        __extends(UniformSampler, _super);
        UniformSampler.validate = function (range) {
            if (range.length !== 2) {
                throw 'range must be an array with two values (min, max)';
            }
            if (range[1] <= range[0]) {
                throw 'range[1] must > range[0]';
            }
        };
        function UniformSampler(range) {
            this.range = range;
            this.interval = this.range[1] - this.range[0];
        }
        UniformSampler.prototype.take = function (n) {
            var i, nums;
            nums = function () {
                var _i, _results;
                _results = [];
                for (i = _i = 1; 1 <= n ? _i <= n : _i >= n; i = 1 <= n ? ++_i : --_i) {
                    _results.push(Math.round(Math.random() * this.interval));
                }
                return _results;
            }.call(this);
            return nums;
        };
        return UniformSampler;
    }(Sampler);
    exports.CombinatoricSampler = CombinatoricSampler = function (_super) {
        __extends(CombinatoricSampler, _super);
        function CombinatoricSampler() {
            var samplers;
            samplers = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            this.samplers = samplers;
        }
        CombinatoricSampler.prototype.take = function (n) {
            var i, j, xs, _i, _results;
            _results = [];
            for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
                xs = function () {
                    var _j, _ref, _results1;
                    _results1 = [];
                    for (j = _j = 0, _ref = this.samplers.length; 0 <= _ref ? _j < _ref : _j > _ref; j = 0 <= _ref ? ++_j : --_j) {
                        _results1.push(this.samplers[j].take(1));
                    }
                    return _results1;
                }.call(this);
                _results.push(_.flatten(xs));
            }
            return _results;
        };
        return CombinatoricSampler;
    }(Sampler);
    exports.GridSampler = GridSampler = function (_super) {
        __extends(GridSampler, _super);
        function GridSampler(x, y) {
            var i;
            this.x = x;
            this.y = y;
            this.grid = DataTable.expand({
                x: this.x,
                y: this.y
            });
            console.log('rows:', this.grid.nrow());
            this.tuples = function () {
                var _i, _ref, _results;
                _results = [];
                for (i = _i = 0, _ref = this.grid.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    _results.push(_.values(this.grid.record(i)));
                }
                return _results;
            }.call(this);
        }
        GridSampler.prototype.take = function (n) {
            return utils.sample(this.tuples, n);
        };
        return GridSampler;
    }(Sampler);
    exports.ConditionalSampler = ConditionalSampler = function (_super) {
        __extends(ConditionalSampler, _super);
        ConditionalSampler.prototype.makeItemSubsets = function () {
            var ctable, i, indices, itemSets, j, keySet, levs, record;
            ctable = this.factorSpec.conditionTable;
            keySet = function () {
                var _i, _ref, _results;
                _results = [];
                for (i = _i = 0, _ref = ctable.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    record = ctable.record(i);
                    levs = _.values(record);
                    _results.push(_.reduce(levs, function (a, b) {
                        return a + ':' + b;
                    }));
                }
                return _results;
            }();
            console.log(keySet);
            itemSets = function () {
                var _i, _ref, _results;
                _results = [];
                for (i = _i = 0, _ref = ctable.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    record = ctable.record(i);
                    indices = this.itemMap.whichRow(record);
                    _results.push(function () {
                        var _j, _len, _results1;
                        _results1 = [];
                        for (_j = 0, _len = indices.length; _j < _len; _j++) {
                            j = indices[_j];
                            _results1.push(this.items[j]);
                        }
                        return _results1;
                    }.call(this));
                }
                return _results;
            }.call(this);
            console.log(itemSets);
            return _.zipObject(keySet, itemSets);
        };
        function ConditionalSampler(items, itemMap, factorSpec) {
            var key, value, _ref;
            this.items = items;
            this.itemMap = itemMap;
            this.factorSpec = factorSpec;
            this.keyMap = this.makeItemSubsets();
            this.conditions = _.keys(this.keyMap);
            this.samplerSet = {};
            _ref = this.keyMap;
            for (key in _ref) {
                value = _ref[key];
                this.samplerSet[key] = new ExhaustiveSampler(value);
            }
        }
        ConditionalSampler.prototype.take = function (n) {
            var keys;
            keys = utils.repLen(this.conditions, n);
            return _.flatten(this.takeCondition(keys));
        };
        ConditionalSampler.prototype.takeCondition = function (keys) {
            var key, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = keys.length; _i < _len; _i++) {
                key = keys[_i];
                _results.push(this.samplerSet[key].take(1));
            }
            return _results;
        };
        return ConditionalSampler;
    }(Sampler);
}.call(this));
});
require.define('68', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Base, DotSet, RandomDotMotion, x, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Base = require('72', module);
    _ = require('16', module);
    DotSet = function () {
        DotSet.randomDelta = function (distance) {
            var rads;
            rads = Math.random() * Math.PI * 2;
            return [
                distance * Math.cos(rads),
                distance * Math.sin(rads)
            ];
        };
        DotSet.coherentDelta = function (distance, direction) {
            return [
                distance * Math.cos(Math.PI * direction / 180),
                distance * Math.sin(Math.PI * direction / 180)
            ];
        };
        DotSet.pointInCircle = function () {
            var r, t, u;
            t = 2 * Math.PI * Math.random();
            u = Math.random() + Math.random();
            r = u > 1 ? 2 - u : u;
            return [
                r * Math.cos(t),
                r * Math.sin(t)
            ];
        };
        DotSet.inCircle = function (center_x, center_y, radius, x, y) {
            var squareDist;
            squareDist = Math.pow(center_x - x, 2) + Math.pow(center_y - y, 2);
            return squareDist <= Math.pow(radius, 2);
        };
        function DotSet(ndots, nparts, coherence) {
            this.ndots = ndots;
            this.nparts = nparts != null ? nparts : 3;
            if (coherence == null) {
                coherence = 0.5;
            }
            this.frameNum = 0;
            this.dotsPerSet = Math.round(this.ndots / this.nparts);
            this.dotSets = _.map([
                0,
                1,
                2
            ], function (_this) {
                return function (i) {
                    var _i, _ref, _results;
                    return _.map(function () {
                        _results = [];
                        for (var _i = 0, _ref = _this.dotsPerSet; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
                            _results.push(_i);
                        }
                        return _results;
                    }.apply(this), function (d) {
                        return [
                            Math.random(),
                            Math.random()
                        ];
                    });
                };
            }(this));
        }
        DotSet.prototype.getDotPartition = function (i) {
            return this.dotSets[i];
        };
        DotSet.prototype.nextFrame = function (coherence, distance, direction) {
            var delta, dset, i, partition, res, xy;
            partition = this.frameNum % this.nparts;
            dset = this.dotSets[partition];
            res = function () {
                var _i, _ref, _results;
                _results = [];
                for (i = _i = 0, _ref = dset.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    xy = dset[i];
                    delta = Math.random() < coherence ? DotSet.coherentDelta(distance, direction) : DotSet.randomDelta(distance);
                    xy = [
                        xy[0] + delta[0],
                        xy[1] + delta[1]
                    ];
                    if (xy[0] < 0 || xy[0] > 1 || xy[1] < 0 || xy[1] > 1) {
                        xy = [
                            Math.random(),
                            Math.random()
                        ];
                    }
                    _results.push(dset[i] = xy);
                }
                return _results;
            }();
            this.frameNum = this.frameNum + 1;
            return res;
        };
        return DotSet;
    }();
    exports.RandomDotMotion = RandomDotMotion = function (_super) {
        __extends(RandomDotMotion, _super);
        function RandomDotMotion(spec) {
            if (spec == null) {
                spec = {
                    x: 0,
                    y: 0,
                    numDots: 70,
                    apRadius: 400,
                    dotSpeed: 0.02,
                    dotSize: 2,
                    coherence: 0.55,
                    partitions: 3
                };
            }
            this.numDots = spec.numDots;
            this.apRadius = spec.apRadius;
            this.dotSpeed = spec.dotSpeed;
            this.dotSize = spec.dotSize;
            this.coherence = spec.coherence;
            this.partitions = spec.partitions;
            this.x = spec.x;
            this.y = spec.y;
            this.dotSet = new DotSet(this.numDots, 3, 0.5);
        }
        RandomDotMotion.prototype.createDots = function () {
            var dots, xy, _i, _len, _results;
            dots = this.dotSet.nextFrame(this.coherence, this.dotSpeed, 180);
            _results = [];
            for (_i = 0, _len = dots.length; _i < _len; _i++) {
                xy = dots[_i];
                _results.push(new Kinetic.Rect({
                    x: this.x + this.apRadius * xy[0],
                    y: this.x + this.apRadius * xy[1],
                    width: this.dotSize,
                    height: this.dotSize,
                    fill: 'green'
                }));
            }
            return _results;
        };
        RandomDotMotion.prototype.createInitialDots = function () {
            var dpart, i, xy, _i, _ref, _results;
            _results = [];
            for (i = _i = 0, _ref = this.partitions; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                dpart = this.dotSet.getDotPartition(i);
                _results.push(function () {
                    var _j, _len, _results1;
                    _results1 = [];
                    for (_j = 0, _len = dpart.length; _j < _len; _j++) {
                        xy = dpart[_j];
                        _results1.push(new Kinetic.Rect({
                            x: this.x + this.apRadius * xy[0],
                            y: this.x + this.apRadius * xy[1],
                            width: this.dotSize,
                            height: this.dotSize,
                            fill: 'green'
                        }));
                    }
                    return _results1;
                }.call(this));
            }
            return _results;
        };
        RandomDotMotion.prototype.displayInitialDots = function (nodes, group) {
            var node, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = nodes.length; _i < _len; _i++) {
                node = nodes[_i];
                _results.push(group.add(node));
            }
            return _results;
        };
        RandomDotMotion.prototype.render = function (context, layer) {
            var i, nodeSets, _i, _ref;
            this.groups = function () {
                var _i, _ref, _results;
                _results = [];
                for (i = _i = 0, _ref = this.partitions; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    _results.push(new Kinetic.Group({ listening: false }));
                }
                return _results;
            }.call(this);
            _.map(this.groups, function (g) {
                return layer.add(g);
            });
            nodeSets = this.createInitialDots();
            for (i = _i = 0, _ref = this.partitions; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                this.displayInitialDots(nodeSets[i], this.groups[i]);
            }
            layer.draw();
            this.anim = new Kinetic.Animation(function (_this) {
                return function (frame) {
                    var curset, dx, part, xy, _j, _ref1, _results;
                    dx = _this.dotSet.nextFrame(_this.coherence, _this.dotSpeed, 180);
                    part = _this.dotSet.frameNum % _this.partitions;
                    curset = nodeSets[part];
                    _results = [];
                    for (i = _j = 0, _ref1 = curset.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
                        xy = dx[i];
                        xy = [
                            xy[0] * _this.apRadius,
                            xy[1] * _this.apRadius
                        ];
                        console.log(xy);
                        curset[i].setPosition(xy);
                        if (!DotSet.inCircle(0.5 * _this.apRadius, 0.5 * _this.apRadius, _this.apRadius / 2, xy[0], xy[1])) {
                            _results.push(curset[i].hide());
                        } else {
                            _results.push(curset[i].show());
                        }
                    }
                    return _results;
                };
            }(this), layer);
            layer.draw();
            return this.anim.start();
        };
        RandomDotMotion.prototype.render2 = function (context, layer) {
            var i, nodeSets, _i, _ref;
            this.layers = function () {
                var _i, _ref, _results;
                _results = [];
                for (i = _i = 0, _ref = this.partitions; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    _results.push(new Kinetic.Layer({ listening: false }));
                }
                return _results;
            }.call(this);
            _.map(this.layers, function (l) {
                return context.stage.add(l);
            });
            nodeSets = this.createInitialDots();
            for (i = _i = 0, _ref = this.partitions; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                this.displayInitialDots(nodeSets[i], this.layers[i]);
            }
            this.anim = new Kinetic.Animation(function (_this) {
                return function (frame) {
                    var curset, dx, part, xy, _j, _ref1;
                    dx = _this.dotSet.nextFrame(_this.coherence, _this.dotSpeed, 180);
                    part = _this.dotSet.frameNum % _this.partitions;
                    curset = nodeSets[part];
                    for (i = _j = 0, _ref1 = curset.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
                        xy = dx[i];
                        xy = [
                            xy[0] * _this.apRadius,
                            xy[1] * _this.apRadius
                        ];
                        console.log(xy);
                        curset[i].setPosition(xy);
                    }
                    return _this.layers[part].draw();
                };
            }(this));
            layer.draw();
            return this.anim.start();
        };
        RandomDotMotion.prototype.stop = function (context) {
            return this.anim.stop();
        };
        return RandomDotMotion;
    }(Base.Stimulus);
    x = new DotSet(51, 3);
    console.log(x.dotSets);
    console.log('NEXT', x.nextFrame(0.5, 0.01, 180));
}.call(this));
});
require.define('66', function(module, exports, __dirname, __filename, undefined){
(function () {
    var AbsoluteLayout, Background, Bacon, Base, GridLayout, KineticStimFactory, Layout, Q, Response, Stimulus, disableBrowserBack, doTimer, getTimestamp, input, lay, li, marked, renderable, ul, utils, _, _ref;
    Bacon = require('22', module).Bacon;
    _ = require('16', module);
    Q = require('17', module);
    marked = require('45', module);
    utils = require('69', module);
    lay = require('73', module);
    Base = require('72', module);
    Stimulus = Base.Stimulus;
    Response = Base.Response;
    Background = require('113', module).Background;
    _ref = require('61', module), renderable = _ref.renderable, ul = _ref.ul, li = _ref.li, input = _ref.input;
    Layout = lay.Layout;
    AbsoluteLayout = lay.AbsoluteLayout;
    GridLayout = lay.GridLayout;
    doTimer = utils.doTimer;
    disableBrowserBack = utils.disableBrowserBack;
    getTimestamp = utils.getTimestamp;
    exports.KineticStimFactory = KineticStimFactory = function () {
        function KineticStimFactory() {
            console.log('making stim factory');
        }
        KineticStimFactory.prototype.makeLayout = function (name, params, context) {
        };
        KineticStimFactory.prototype.makeInstructions = function (spec) {
        };
        KineticStimFactory.prototype.makeStimulus = function (name, params, context) {
        };
        KineticStimFactory.prototype.makeResponse = function (name, params, context) {
        };
        KineticStimFactory.prototype.makeEvent = function (stim, response) {
        };
        return KineticStimFactory;
    }();
}.call(this));
});
require.define('113', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Background, ContainerDrawable, GStimulus, KineticDrawable, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    GStimulus = require('72', module).GraphicalStimulus;
    KineticDrawable = require('72', module).KineticDrawable;
    ContainerDrawable = require('72', module).ContainerDrawable;
    _ = require('16', module);
    Background = function (_super) {
        __extends(Background, _super);
        function Background(stims, fill) {
            this.stims = stims != null ? stims : [];
            this.fill = fill != null ? fill : 'white';
            Background.__super__.constructor.call(this, {}, {});
            if (!_.isArray(this.stims)) {
                this.stims = [this.stims];
            }
        }
        Background.prototype.render = function (context) {
            var background, drawables, stim, _i, _len, _ref;
            background = new Kinetic.Rect({
                x: 0,
                y: 0,
                width: context.width(),
                height: context.height(),
                name: 'background',
                fill: this.fill
            });
            drawables = [];
            drawables.push(new KineticDrawable(this, background));
            _ref = this.stims;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                stim = _ref[_i];
                drawables.push(stim.render(context));
            }
            return new ContainerDrawable(drawables);
        };
        return Background;
    }(GStimulus);
    exports.Background = Background;
}.call(this));
});
require.define('114', function(module, exports, __dirname, __filename, undefined){
(function () {
    var KStimulus, TrailsA, utils, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    KStimulus = require('72', module).KineticStimulus;
    utils = require('69', module);
    TrailsA = function (_super) {
        __extends(TrailsA, _super);
        TrailsA.prototype.defaults = {
            npoints: 25,
            circleRadius: 25,
            circleFill: 'blue'
        };
        TrailsA.prototype.signals = [
            'trail_moved',
            'trail_completed'
        ];
        function TrailsA(spec) {
            TrailsA.__super__.constructor.call(this, spec);
            this.minDist = this.spec.circleRadius * 4;
            this.circleRadius = this.spec.circleRadius;
            this.npoints = this.spec.npoints;
            this.maxIter = 100;
        }
        TrailsA.prototype.layoutPoints = function (context) {
            var id, niter, nn, pts;
            pts = utils.genPoints(this.npoints, {
                x: this.circleRadius,
                y: this.circleRadius,
                width: context.width() - this.circleRadius * 2,
                height: context.height() - this.circleRadius * 2
            });
            nn = utils.nearestNeighbors(pts, 1)[0];
            niter = 0;
            while (nn.distance < this.minDist && niter < this.maxIter) {
                id = nn.index[0];
                pts[id] = utils.genPoints(1, {
                    x: this.circleRadius,
                    y: this.circleRadius,
                    width: context.width() - this.circleRadius * 2,
                    height: context.height() - this.circleRadius * 2
                })[0];
                nn = utils.nearestNeighbors(pts, 1)[0];
                niter++;
            }
            return pts;
        };
        TrailsA.prototype.pathLength = function (pts, newpt, i) {
            pts = pts.slice(0);
            pts.splice(i, 0, newpt);
            return utils.pathLength(pts);
        };
        TrailsA.prototype.minPathLength = function (pts, newpt) {
            var i, lens;
            lens = function () {
                var _i, _ref, _results;
                _results = [];
                for (i = _i = 0, _ref = pts.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    _results.push(this.pathLength(pts, newpt, i));
                }
                return _results;
            }.call(this);
            return utils.whichMin(lens);
        };
        TrailsA.prototype.orderPoints = function (pts) {
            var first, index, indices, insAt, path, remaining, _i, _j, _len, _ref, _results;
            remaining = function () {
                _results = [];
                for (var _i = 0, _ref = pts.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
                    _results.push(_i);
                }
                return _results;
            }.apply(this);
            first = remaining[0];
            remaining.splice(first, 1);
            path = [pts[first]];
            indices = [first];
            for (_j = 0, _len = remaining.length; _j < _len; _j++) {
                index = remaining[_j];
                insAt = this.minPathLength(path, pts[index]);
                path.splice(insAt, 0, pts[index]);
            }
            return path;
        };
        TrailsA.prototype.addCircleListener = function (circle) {
            var outer;
            outer = this;
            return circle.on('click', function () {
                var pts;
                if (this.attrs.id === 'circle_'.concat(outer.pathIndex + 1)) {
                    if (outer.pathIndex === outer.npoints - 1) {
                        this.fill('red');
                        setTimeout(function () {
                            return outer.emit('trail_completed');
                        }, 200);
                    } else {
                        this.fill('khaki');
                    }
                    outer.emit('trail_move', {
                        index: outer.pathIndex,
                        node_id: this.attrs.id
                    });
                    if (outer.pathIndex === 0) {
                        outer.path.points([
                            this.getPosition().x,
                            this.getPosition().y
                        ]);
                        outer.group.add(outer.path);
                    } else {
                        pts = outer.path.points();
                        outer.path.points(pts.concat([
                            this.getPosition().x,
                            this.getPosition().y
                        ]));
                    }
                    outer.pathIndex++;
                    return context.draw();
                }
            });
        };
        TrailsA.prototype.render = function (context) {
            var circle, i, label, onPresent, outer, point, _i, _len, _ref;
            this.points = this.orderPoints(this.layoutPoints(context));
            this.path = new Kinetic.Line({
                stroke: 'khaki',
                strokeWidth: 2
            });
            this.pathIndex = 0;
            this.group = new Kinetic.Group();
            _ref = this.points;
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
                point = _ref[i];
                if (i === 0) {
                    circle = new Kinetic.Circle({
                        x: point[0],
                        y: point[1],
                        radius: this.circleRadius,
                        fill: this.spec.circleFill,
                        stroke: 'khaki',
                        strokeWidth: 2,
                        id: 'circle_' + (i + 1)
                    });
                } else {
                    circle = new Kinetic.Circle({
                        x: point[0],
                        y: point[1],
                        radius: this.circleRadius,
                        fill: this.spec.circleFill,
                        id: 'circle_' + (i + 1)
                    });
                }
                this.addCircleListener(circle);
                label = new Kinetic.Text({
                    x: point[0],
                    y: point[1],
                    text: i + 1,
                    fontSize: 24,
                    fontFamily: 'Arial',
                    fill: 'white',
                    listening: false
                });
                label.setPosition({
                    x: circle.getPosition().x - label.getWidth() / 2,
                    y: circle.getPosition().y - label.getHeight() / 2
                });
                this.group.add(circle);
                this.group.add(label);
            }
            outer = this;
            onPresent = function (context) {
                return console.log('onPresent called!');
            };
            return this.presentable(this, this.group);
        };
        return TrailsA;
    }(KStimulus);
    exports.TrailsA = TrailsA;
}.call(this));
});
require.define('115', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Dots, Exp, Psy, Q, canvas, components, csv, datatable, design, factory, html, include, layout, lib, libs, match, samplers, stimresp, sugar, utils, _, _i, _len;
    Exp = require('66', module);
    Psy = require('67', module);
    Dots = require('68', module);
    utils = require('69', module);
    datatable = require('70', module);
    samplers = require('71', module);
    stimresp = require('72', module);
    layout = require('73', module);
    design = require('74', module);
    canvas = require('75', module);
    html = require('76', module);
    components = require('77', module);
    factory = require('78', module);
    sugar = require('128', module);
    _ = require('16', module);
    Q = require('17', module);
    csv = require('18', module);
    match = require('19', module).match;
    include = function (lib) {
        var key, value, _results;
        _results = [];
        for (key in lib) {
            value = lib[key];
            _results.push(exports[key] = value);
        }
        return _results;
    };
    libs = [
        Exp,
        Psy,
        Dots,
        utils,
        datatable,
        samplers,
        stimresp,
        layout,
        design,
        canvas,
        html,
        components,
        factory,
        match
    ];
    for (_i = 0, _len = libs.length; _i < _len; _i++) {
        lib = libs[_i];
        include(lib);
    }
    exports.Q = Q;
    exports._ = _;
    exports.csv = csv;
    exports.match = match;
}.call(this));
});
require.define('116', function(module, exports, __dirname, __filename, undefined){
var existed = false;
var old;
if ('smokesignals' in global) {
    existed = true;
    old = global.smokesignals;
}
require('117', module);
module.exports = smokesignals;
if (existed) {
    global.smokesignals = old;
} else {
    delete global.smokesignals;
}
});
require.define('117', function(module, exports, __dirname, __filename, undefined){
smokesignals = {
    convert: function (obj, handlers) {
        handlers = {};
        obj.on = function (eventName, handler) {
            (handlers[eventName] || (handlers[eventName] = [])).push(handler);
            return obj;
        };
        obj.once = function (eventName, handler) {
            function wrappedHandler() {
                handler.apply(obj.off(eventName, wrappedHandler), arguments);
            }
            wrappedHandler.h = handler;
            return obj.on(eventName, wrappedHandler);
        };
        obj.off = function (eventName, handler) {
            for (var list = handlers[eventName], i = 0; handler && list && list[i]; i++) {
                list[i] != handler && list[i].h != handler || list.splice(i--, 1);
            }
            if (!i) {
                delete handlers[eventName];
            }
            return obj;
        };
        obj.emit = function (eventName) {
            for (var list = handlers[eventName], i = 0; list && list[i];) {
                list[i++].apply(obj, list.slice.call(arguments, 1));
            }
            return obj;
        };
        return obj;
    }
};
});
require.define('119', function(module, exports, __dirname, __filename, undefined){
(function () {
    var KStimulus, MessageBox, layout, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    layout = require('73', module);
    _ = require('16', module);
    KStimulus = require('72', module).KineticStimulus;
    MessageBox = function (_super) {
        __extends(MessageBox, _super);
        MessageBox.prototype.defaults = {
            content: 'Text',
            x: 5,
            y: 5,
            width: 100,
            background: 'green',
            fill: 'black',
            fontSize: 18,
            fontFamily: 'Arial',
            align: 'center',
            position: null
        };
        function MessageBox(spec) {
            if (spec == null) {
                spec = {};
            }
            if (spec.content != null && _.isArray(spec.content)) {
                spec.content = spec.content.join(' \n ');
                if (spec.lineHeight == null) {
                    spec.lineHeight = 2;
                }
            }
            MessageBox.__super__.constructor.call(this, spec);
        }
        MessageBox.prototype.initialize = function () {
            this.text = new Kinetic.Text({
                x: 0,
                y: 0,
                text: this.spec.content,
                fontSize: this.spec.fontSize,
                fontFamily: this.spec.fontFamily,
                fill: this.spec.fill,
                lineHeight: this.spec.lineHeight || 1,
                width: this.spec.width,
                listening: false,
                align: this.spec.align
            });
            this.rect = new Kinetic.Rect({
                x: 0,
                y: 0,
                stroke: 'black',
                strokeWidth: 2,
                fill: this.spec.background,
                width: this.spec.width,
                height: this.text.height() + 10,
                cornerRadius: 2
            });
            this.group = new Kinetic.Group();
            this.group.add(this.rect);
            return this.group.add(this.text);
        };
        MessageBox.prototype.render = function (context, layer) {
            var coords;
            coords = this.computeCoordinates(context, this.spec.position, this.text.getWidth(), this.text.getHeight());
            this.text.setPosition({
                x: coords[0],
                y: coords[1]
            });
            this.rect.setPosition({
                x: coords[0],
                y: coords[1] - 5
            });
            return this.presentable(this, this.group);
        };
        return MessageBox;
    }(KStimulus);
    exports.MessageBox = MessageBox;
}.call(this));
});
require.define('120', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Q, Receiver, Response, ResponseData, utils, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    utils = require('69', module);
    Q = require('17', module);
    Response = require('72', module).Response;
    ResponseData = require('72', module).ResponseData;
    Receiver = function (_super) {
        __extends(Receiver, _super);
        function Receiver() {
            return Receiver.__super__.constructor.apply(this, arguments);
        }
        Receiver.prototype.defaults = {
            id: null,
            signal: ''
        };
        Receiver.prototype.activate = function (context, stimulus) {
            var callback, deferred;
            Receiver.__super__.activate.call(this, context, stimulus);
            deferred = Q.defer();
            callback = function (_this) {
                return function (args) {
                    var resp;
                    console.log('Reciever callback');
                    resp = {
                        name: 'Receiver',
                        signal: _this.spec.signal,
                        id: _this.spec.id
                    };
                    return deferred.resolve(new ResponseData(resp));
                };
            }(this);
            if (this.spec.id != null) {
                stimulus.addReaction(this.spec.signal, callback, { id: this.spec.id });
            } else {
                this.spec.id = stimulus.id;
                console.log('adding reaction for ', this.spec.signal);
                stimulus.addReaction(this.spec.signal, callback);
            }
            return deferred.promise;
        };
        return Receiver;
    }(Response);
    exports.Receiver = Receiver;
}.call(this));
});
require.define('122', function(module, exports, __dirname, __filename, undefined){
(function () {
    'use strict';
    function didYouMean(str, list, key) {
        if (!str)
            return null;
        if (!didYouMean.caseSensitive) {
            str = str.toLowerCase();
        }
        var thresholdRelative = didYouMean.threshold === null ? null : didYouMean.threshold * str.length, thresholdAbsolute = didYouMean.thresholdAbsolute, winningVal;
        if (thresholdRelative !== null && thresholdAbsolute !== null)
            winningVal = Math.min(thresholdRelative, thresholdAbsolute);
        else if (thresholdRelative !== null)
            winningVal = thresholdRelative;
        else if (thresholdAbsolute !== null)
            winningVal = thresholdAbsolute;
        else
            winningVal = null;
        var winner, candidate, val, i, len = list.length;
        for (i = 0; i < len; i++) {
            candidate = list[i];
            if (key)
                candidate = candidate[key];
            if (!candidate)
                continue;
            if (!didYouMean.caseSensitive) {
                candidate = candidate.toLowerCase();
            }
            val = getEditDistance(str, candidate, winningVal);
            if (winningVal === null || val < winningVal) {
                winningVal = val;
                if (key && didYouMean.returnWinningObject)
                    winner = list[i];
                else
                    winner = candidate;
                if (didYouMean.returnFirstMatch)
                    return winner;
            }
        }
        return winner || didYouMean.nullResultValue;
    }
    ;
    didYouMean.threshold = 0.4;
    didYouMean.thresholdAbsolute = 20;
    didYouMean.caseSensitive = false;
    didYouMean.nullResultValue = null;
    didYouMean.returnWinningObject = null;
    didYouMean.returnFirstMatch = false;
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = didYouMean;
    } else {
        window.didYouMean = didYouMean;
    }
    var MAX_INT = Math.pow(2, 32) - 1;
    function getEditDistance(a, b, max) {
        max = max || max === 0 ? max : MAX_INT;
        var lena = a.length;
        var lenb = b.length;
        if (lena === 0)
            return Math.min(max + 1, lenb);
        if (lenb === 0)
            return Math.min(max + 1, lena);
        if (Math.abs(lena - lenb) > max)
            return max + 1;
        var matrix = [], i, j, colMin, minJ, maxJ;
        for (i = 0; i <= lenb; i++) {
            matrix[i] = [i];
        }
        for (j = 0; j <= lena; j++) {
            matrix[0][j] = j;
        }
        for (i = 1; i <= lenb; i++) {
            colMin = MAX_INT;
            minJ = 1;
            if (i > max)
                minJ = i - max;
            maxJ = lenb + 1;
            if (maxJ > max + i)
                maxJ = max + i;
            for (j = 1; j <= lena; j++) {
                if (j < minJ || j > maxJ) {
                    matrix[i][j] = max + 1;
                } else {
                    if (b.charAt(i - 1) === a.charAt(j - 1)) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
                    }
                }
                if (matrix[i][j] < colMin)
                    colMin = matrix[i][j];
            }
            if (colMin > max)
                return max + 1;
        }
        return matrix[lenb][lena];
    }
    ;
}());
});
require.define('123', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Likert, caption, div, html, input, p, render, table, td, tr, _ref, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('76', module);
    _ref = require('61', module), render = _ref.render, div = _ref.div, p = _ref.p, td = _ref.td, tr = _ref.tr, table = _ref.table, input = _ref.input, caption = _ref.caption;
    Likert = function (_super) {
        __extends(Likert, _super);
        Likert.prototype.defaults = {
            choices: [
                '1',
                '2',
                '3'
            ],
            fontSize: 16,
            cellWidth: 200,
            title: '',
            titleFontSize: 24
        };
        function Likert(spec) {
            var out, self, tdel;
            if (spec == null) {
                spec = {};
            }
            Likert.__super__.constructor.call(this, spec);
            this.el.addClass(this.spec['class']);
            out = render(function (_this) {
                return function () {
                    spec = _this.spec;
                    return table('#likert', function () {
                        caption(spec.title);
                        tr(function () {
                            var index, opt, _i, _len, _ref1, _results;
                            _ref1 = spec.choices;
                            _results = [];
                            for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
                                opt = _ref1[index];
                                _results.push(td(function () {
                                    return input('#radio_' + index, {
                                        type: 'radio',
                                        name: 'scale',
                                        value: index + 1
                                    });
                                }));
                            }
                            return _results;
                        });
                        return tr(function () {
                            var opt, _i, _len, _ref1, _results;
                            _ref1 = spec.choices;
                            _results = [];
                            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                                opt = _ref1[_i];
                                _results.push(td(opt));
                            }
                            return _results;
                        });
                    });
                };
            }(this));
            this.html = $(out);
            this.html.css('text-align', 'center');
            this.html.css('font-size', this.spec.fontSize);
            this.html.find('caption').css('font-size', this.spec.titleFontSize);
            this.html.css('border-spacing', 20);
            this.html.css('table-layout', 'fixed');
            this.html.css('width', '300');
            self = this;
            this.html.find('input[name=\'scale\']').on('click', function (_this) {
                return function () {
                    var ind;
                    console.log('radio click');
                    ind = $('#likert input[name=\'scale\']:checked').val();
                    console.log('index is', ind);
                    console.log('this.emit is', self.emit);
                    return self.emit('likert_selection', {
                        value: ind,
                        choice: _this.spec.choices[ind - 1]
                    });
                };
            }(this));
            tdel = this.html.find('td');
            tdel.css('width', this.spec.cellWidth);
            tdel.css('overflow', 'hidden');
            tdel.css('word-wrap', 'break-word');
            this.el.append(this.html);
        }
        return Likert;
    }(html.HtmlStimulus);
    exports.Likert = Likert;
}.call(this));
});
require.define('124', function(module, exports, __dirname, __filename, undefined){
(function () {
    var KStimulus, Title, layout, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    layout = require('73', module);
    _ = require('16', module);
    KStimulus = require('72', module).KineticStimulus;
    Title = function (_super) {
        __extends(Title, _super);
        Title.prototype.defaults = {
            content: 'Title',
            yoffset: 20,
            fill: 'black',
            fontSize: 80,
            fontFamily: 'Arial',
            align: 'center'
        };
        function Title(spec) {
            if (spec == null) {
                spec = {};
            }
            if (spec.content != null && _.isArray(spec.content)) {
                spec.content = spec.content.join(' \n ');
                if (spec.lineHeight == null) {
                    spec.lineHeight = 2;
                }
            }
            Title.__super__.constructor.call(this, spec);
        }
        Title.prototype.initialize = function () {
            return this.text = new Kinetic.Text({
                x: 0,
                y: this.spec.yoffset,
                text: this.spec.content,
                fontSize: this.spec.fontSize,
                fontFamily: this.spec.fontFamily,
                fill: this.spec.fill,
                lineHeight: this.spec.lineHeight || 1,
                listening: false,
                align: this.spec.align
            });
        };
        Title.prototype.render = function (context, layer) {
            this.text.setWidth(context.width());
            return this.presentable(this, this.text);
        };
        return Title;
    }(KStimulus);
    exports.Title = Title;
}.call(this));
});
require.define('125', function(module, exports, __dirname, __filename, undefined){
(function () {
    var HtmlRange, html, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('76', module);
    HtmlRange = function (_super) {
        __extends(HtmlRange, _super);
        HtmlRange.prototype.defaults = {
            min: 0,
            max: 100,
            value: 0,
            step: 1,
            height: 100,
            width: 300
        };
        function HtmlRange(spec) {
            if (spec == null) {
                spec = {};
            }
            HtmlRange.__super__.constructor.call(this, spec);
            this.input = $('<input type=\'range\'>');
            this.input.attr({
                min: this.spec.min,
                max: this.spec.max,
                value: this.spec.value,
                step: this.spec.step
            });
            this.input.css({ width: this.spec.width });
            this.el.append(this.input);
        }
        return HtmlRange;
    }(html.HtmlStimulus);
    exports.HtmlRange = HtmlRange;
}.call(this));
});
require.define('126', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Slider, html, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('76', module);
    Slider = function (_super) {
        __extends(Slider, _super);
        Slider.prototype.defaults = {
            min: 0,
            max: 100,
            value: 0,
            step: 1,
            height: 100,
            width: 300,
            id: 'slider',
            showValue: true,
            fontSize: 20
        };
        function Slider(spec) {
            if (spec == null) {
                spec = {};
            }
            Slider.__super__.constructor.call(this, spec);
            this.slider = $(document.createElement('div')).attr('id', this.spec.id);
            this.slider.jqxSlider({
                min: this.spec.min,
                max: this.spec.max,
                ticksFrequency: 25,
                value: 0,
                step: 25
            });
            this.slider.css('margin-bottom', '10px');
            this.el.append(this.slider);
            if (this.spec.showValue) {
                this.valueLabel = $(document.createElement('div')).attr('id', 'valueLabel');
                this.valueLabel.css('text-align', 'center');
                this.valueLabel.css('font-size', this.spec.fontSize);
                this.el.append(this.valueLabel);
            }
            this.slider.on('change', function (_this) {
                return function (event) {
                    if (_this.spec.showValue) {
                        return _this.valueLabel.text(event.args.value.toFixed(2));
                    }
                };
            }(this));
        }
        return Slider;
    }(html.HtmlStimulus);
    exports.Slider = Slider;
}.call(this));
});
require.define('127', function(module, exports, __dirname, __filename, undefined){
(function () {
    var CheckBox, html, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('76', module);
    CheckBox = function (_super) {
        __extends(CheckBox, _super);
        function CheckBox() {
            return CheckBox.__super__.constructor.apply(this, arguments);
        }
        CheckBox.prototype.defaults = {
            label: 'click here',
            'class': ''
        };
        CheckBox.prototype.initialize = function () {
            var outer;
            this.el.addClass('ui large checkbox');
            this.input = $('<input type="checkbox" id="mycheckbox">');
            this.label = $('<label></label>').text(this.spec.label);
            this.label.attr('for', 'mycheckbox');
            this.el.append(this.input);
            this.el.append(this.label);
            this.el.addClass(this.spec['class']);
            outer = this;
            return this.input.on('change', function () {
                console.log('detected checkbox event');
                if ($(this).is(':checked')) {
                    console.log('emitting checked outer event');
                    outer.emit('checked');
                } else {
                    console.log('emitting unchecked outer event');
                    outer.emit('unchecked');
                }
            });
        };
        return CheckBox;
    }(html.HtmlStimulus);
    exports.CheckBox = CheckBox;
}.call(this));
});
require.define('128', function(module, exports, __dirname, __filename, undefined){
(function () {
    'use strict';
    var object = Object, array = Array, regexp = RegExp, date = Date, string = String, number = Number, math = Math, Undefined;
    var globalContext = typeof global !== 'undefined' ? global : this;
    var internalToString = object.prototype.toString;
    var internalHasOwnProperty = object.prototype.hasOwnProperty;
    var definePropertySupport = object.defineProperty && object.defineProperties;
    var regexIsFunction = typeof regexp() === 'function';
    var noKeysInStringObjects = !('0' in new string('a'));
    var typeChecks = {};
    var matchedByValueReg = /^\[object Date|Array|String|Number|RegExp|Boolean|Arguments\]$/;
    var ClassNames = 'Boolean,Number,String,Array,Date,RegExp,Function'.split(',');
    var isBoolean = buildPrimitiveClassCheck('boolean', ClassNames[0]);
    var isNumber = buildPrimitiveClassCheck('number', ClassNames[1]);
    var isString = buildPrimitiveClassCheck('string', ClassNames[2]);
    var isArray = buildClassCheck(ClassNames[3]);
    var isDate = buildClassCheck(ClassNames[4]);
    var isRegExp = buildClassCheck(ClassNames[5]);
    var isFunction = buildClassCheck(ClassNames[6]);
    function isClass(obj, klass, cached) {
        var k = cached || className(obj);
        return k === '[object ' + klass + ']';
    }
    function buildClassCheck(klass) {
        var fn = klass === 'Array' && array.isArray || function (obj, cached) {
                return isClass(obj, klass, cached);
            };
        typeChecks[klass] = fn;
        return fn;
    }
    function buildPrimitiveClassCheck(type, klass) {
        var fn = function (obj) {
            if (isObjectType(obj)) {
                return isClass(obj, klass);
            }
            return typeof obj === type;
        };
        typeChecks[klass] = fn;
        return fn;
    }
    function className(obj) {
        return internalToString.call(obj);
    }
    function initializeClasses() {
        initializeClass(object);
        iterateOverObject(ClassNames, function (i, name) {
            initializeClass(globalContext[name]);
        });
    }
    function initializeClass(klass) {
        if (klass['SugarMethods'])
            return;
        defineProperty(klass, 'SugarMethods', {});
        extend(klass, false, true, {
            'extend': function (methods, override, instance) {
                extend(klass, instance !== false, override, methods);
            },
            'sugarRestore': function () {
                return batchMethodExecute(this, klass, arguments, function (target, name, m) {
                    defineProperty(target, name, m.method);
                });
            },
            'sugarRevert': function () {
                return batchMethodExecute(this, klass, arguments, function (target, name, m) {
                    if (m['existed']) {
                        defineProperty(target, name, m['original']);
                    } else {
                        delete target[name];
                    }
                });
            }
        });
    }
    function extend(klass, instance, override, methods) {
        var extendee = instance ? klass.prototype : klass;
        initializeClass(klass);
        iterateOverObject(methods, function (name, extendedFn) {
            var nativeFn = extendee[name], existed = hasOwnProperty(extendee, name);
            if (isFunction(override) && nativeFn) {
                extendedFn = wrapNative(nativeFn, extendedFn, override);
            }
            if (override !== false || !nativeFn) {
                defineProperty(extendee, name, extendedFn);
            }
            klass['SugarMethods'][name] = {
                'method': extendedFn,
                'existed': existed,
                'original': nativeFn,
                'instance': instance
            };
        });
    }
    function extendSimilar(klass, instance, override, set, fn) {
        var methods = {};
        set = isString(set) ? set.split(',') : set;
        set.forEach(function (name, i) {
            fn(methods, name, i);
        });
        extend(klass, instance, override, methods);
    }
    function batchMethodExecute(target, klass, args, fn) {
        var all = args.length === 0, methods = multiArgs(args), changed = false;
        iterateOverObject(klass['SugarMethods'], function (name, m) {
            if (all || methods.indexOf(name) !== -1) {
                changed = true;
                fn(m['instance'] ? target.prototype : target, name, m);
            }
        });
        return changed;
    }
    function wrapNative(nativeFn, extendedFn, condition) {
        return function (a) {
            return condition.apply(this, arguments) ? extendedFn.apply(this, arguments) : nativeFn.apply(this, arguments);
        };
    }
    function defineProperty(target, name, method) {
        if (definePropertySupport) {
            object.defineProperty(target, name, {
                'value': method,
                'configurable': true,
                'enumerable': false,
                'writable': true
            });
        } else {
            target[name] = method;
        }
    }
    function multiArgs(args, fn, from) {
        var result = [], i = from || 0, len;
        for (len = args.length; i < len; i++) {
            result.push(args[i]);
            if (fn)
                fn.call(args, args[i], i);
        }
        return result;
    }
    function flattenedArgs(args, fn, from) {
        var arg = args[from || 0];
        if (isArray(arg)) {
            args = arg;
            from = 0;
        }
        return multiArgs(args, fn, from);
    }
    function checkCallback(fn) {
        if (!fn || !fn.call) {
            throw new TypeError('Callback is not callable');
        }
    }
    function isDefined(o) {
        return o !== Undefined;
    }
    function isUndefined(o) {
        return o === Undefined;
    }
    function hasProperty(obj, prop) {
        return !isPrimitiveType(obj) && prop in obj;
    }
    function hasOwnProperty(obj, prop) {
        return !!obj && internalHasOwnProperty.call(obj, prop);
    }
    function isObjectType(obj) {
        return !!obj && (typeof obj === 'object' || regexIsFunction && isRegExp(obj));
    }
    function isPrimitiveType(obj) {
        var type = typeof obj;
        return obj == null || type === 'string' || type === 'number' || type === 'boolean';
    }
    function isPlainObject(obj, klass) {
        klass = klass || className(obj);
        try {
            if (obj && obj.constructor && !hasOwnProperty(obj, 'constructor') && !hasOwnProperty(obj.constructor.prototype, 'isPrototypeOf')) {
                return false;
            }
        } catch (e) {
            return false;
        }
        return !!obj && klass === '[object Object]' && 'hasOwnProperty' in obj;
    }
    function iterateOverObject(obj, fn) {
        var key;
        for (key in obj) {
            if (!hasOwnProperty(obj, key))
                continue;
            if (fn.call(obj, key, obj[key], obj) === false)
                break;
        }
    }
    function simpleRepeat(n, fn) {
        for (var i = 0; i < n; i++) {
            fn(i);
        }
    }
    function simpleMerge(target, source) {
        iterateOverObject(source, function (key) {
            target[key] = source[key];
        });
        return target;
    }
    function coercePrimitiveToObject(obj) {
        if (isPrimitiveType(obj)) {
            obj = object(obj);
        }
        if (noKeysInStringObjects && isString(obj)) {
            forceStringCoercion(obj);
        }
        return obj;
    }
    function forceStringCoercion(obj) {
        var i = 0, chr;
        while (chr = obj.charAt(i)) {
            obj[i++] = chr;
        }
    }
    function Hash(obj) {
        simpleMerge(this, coercePrimitiveToObject(obj));
    }
    ;
    Hash.prototype.constructor = object;
    var abs = math.abs;
    var pow = math.pow;
    var ceil = math.ceil;
    var floor = math.floor;
    var round = math.round;
    var min = math.min;
    var max = math.max;
    function withPrecision(val, precision, fn) {
        var multiplier = pow(10, abs(precision || 0));
        fn = fn || round;
        if (precision < 0)
            multiplier = 1 / multiplier;
        return fn(val * multiplier) / multiplier;
    }
    var HalfWidthZeroCode = 48;
    var HalfWidthNineCode = 57;
    var FullWidthZeroCode = 65296;
    var FullWidthNineCode = 65305;
    var HalfWidthPeriod = '.';
    var FullWidthPeriod = '\uff0e';
    var HalfWidthComma = ',';
    var FullWidthDigits = '';
    var NumberNormalizeMap = {};
    var NumberNormalizeReg;
    function codeIsNumeral(code) {
        return code >= HalfWidthZeroCode && code <= HalfWidthNineCode || code >= FullWidthZeroCode && code <= FullWidthNineCode;
    }
    function buildNumberHelpers() {
        var digit, i;
        for (i = 0; i <= 9; i++) {
            digit = chr(i + FullWidthZeroCode);
            FullWidthDigits += digit;
            NumberNormalizeMap[digit] = chr(i + HalfWidthZeroCode);
        }
        NumberNormalizeMap[HalfWidthComma] = '';
        NumberNormalizeMap[FullWidthPeriod] = HalfWidthPeriod;
        NumberNormalizeMap[HalfWidthPeriod] = HalfWidthPeriod;
        NumberNormalizeReg = regexp('[' + FullWidthDigits + FullWidthPeriod + HalfWidthComma + HalfWidthPeriod + ']', 'g');
    }
    function chr(num) {
        return string.fromCharCode(num);
    }
    function getTrimmableCharacters() {
        return '\t\n\x0B\f\r \xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u2028\u2029\u3000\ufeff';
    }
    function repeatString(str, num) {
        var result = '', str = str.toString();
        while (num > 0) {
            if (num & 1) {
                result += str;
            }
            if (num >>= 1) {
                str += str;
            }
        }
        return result;
    }
    function stringToNumber(str, base) {
        var sanitized, isDecimal;
        sanitized = str.replace(NumberNormalizeReg, function (chr) {
            var replacement = NumberNormalizeMap[chr];
            if (replacement === HalfWidthPeriod) {
                isDecimal = true;
            }
            return replacement;
        });
        return isDecimal ? parseFloat(sanitized) : parseInt(sanitized, base || 10);
    }
    function padNumber(num, place, sign, base) {
        var str = abs(num).toString(base || 10);
        str = repeatString('0', place - str.replace(/\.\d+/, '').length) + str;
        if (sign || num < 0) {
            str = (num < 0 ? '-' : '+') + str;
        }
        return str;
    }
    function getOrdinalizedSuffix(num) {
        if (num >= 11 && num <= 13) {
            return 'th';
        } else {
            switch (num % 10) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
            }
        }
    }
    function getRegExpFlags(reg, add) {
        var flags = '';
        add = add || '';
        function checkFlag(prop, flag) {
            if (prop || add.indexOf(flag) > -1) {
                flags += flag;
            }
        }
        checkFlag(reg.multiline, 'm');
        checkFlag(reg.ignoreCase, 'i');
        checkFlag(reg.global, 'g');
        checkFlag(reg.sticky, 'y');
        return flags;
    }
    function escapeRegExp(str) {
        if (!isString(str))
            str = string(str);
        return str.replace(/([\\/\'*+?|()\[\]{}.^$])/g, '\\$1');
    }
    function callDateGet(d, method) {
        return d['get' + (d._utc ? 'UTC' : '') + method]();
    }
    function callDateSet(d, method, value) {
        return d['set' + (d._utc && method != 'ISOWeek' ? 'UTC' : '') + method](value);
    }
    function stringify(thing, stack) {
        var type = typeof thing, thingIsObject, thingIsArray, klass, value, arr, key, i, len;
        if (type === 'string')
            return thing;
        klass = internalToString.call(thing);
        thingIsObject = isPlainObject(thing, klass);
        thingIsArray = isArray(thing, klass);
        if (thing != null && thingIsObject || thingIsArray) {
            if (!stack)
                stack = [];
            if (stack.length > 1) {
                i = stack.length;
                while (i--) {
                    if (stack[i] === thing) {
                        return 'CYC';
                    }
                }
            }
            stack.push(thing);
            value = thing.valueOf() + string(thing.constructor);
            arr = thingIsArray ? thing : object.keys(thing).sort();
            for (i = 0, len = arr.length; i < len; i++) {
                key = thingIsArray ? i : arr[i];
                value += key + stringify(thing[key], stack);
            }
            stack.pop();
        } else if (1 / thing === -Infinity) {
            value = '-0';
        } else {
            value = string(thing && thing.valueOf ? thing.valueOf() : thing);
        }
        return type + klass + value;
    }
    function isEqual(a, b) {
        if (a === b) {
            return a !== 0 || 1 / a === 1 / b;
        } else if (objectIsMatchedByValue(a) && objectIsMatchedByValue(b)) {
            return stringify(a) === stringify(b);
        }
        return false;
    }
    function objectIsMatchedByValue(obj) {
        var klass = className(obj);
        return matchedByValueReg.test(klass) || isPlainObject(obj, klass);
    }
    function getEntriesForIndexes(obj, args, isString) {
        var result, length = obj.length, argsLen = args.length, overshoot = args[argsLen - 1] !== false, multiple = argsLen > (overshoot ? 1 : 2);
        if (!multiple) {
            return entryAtIndex(obj, length, args[0], overshoot, isString);
        }
        result = [];
        multiArgs(args, function (index) {
            if (isBoolean(index))
                return false;
            result.push(entryAtIndex(obj, length, index, overshoot, isString));
        });
        return result;
    }
    function entryAtIndex(obj, length, index, overshoot, isString) {
        if (overshoot) {
            index = index % length;
            if (index < 0)
                index = length + index;
        }
        return isString ? obj.charAt(index) : obj[index];
    }
    function buildObjectInstanceMethods(set, target) {
        extendSimilar(target, true, false, set, function (methods, name) {
            methods[name + (name === 'equal' ? 's' : '')] = function () {
                return object[name].apply(null, [this].concat(multiArgs(arguments)));
            };
        });
    }
    initializeClasses();
    buildNumberHelpers();
    extend(object, false, false, {
        'keys': function (obj) {
            var keys = [];
            if (!isObjectType(obj) && !isRegExp(obj) && !isFunction(obj)) {
                throw new TypeError('Object required');
            }
            iterateOverObject(obj, function (key, value) {
                keys.push(key);
            });
            return keys;
        }
    });
    function arrayIndexOf(arr, search, fromIndex, increment) {
        var length = arr.length, fromRight = increment == -1, start = fromRight ? length - 1 : 0, index = toIntegerWithDefault(fromIndex, start);
        if (index < 0) {
            index = length + index;
        }
        if (!fromRight && index < 0 || fromRight && index >= length) {
            index = start;
        }
        while (fromRight && index >= 0 || !fromRight && index < length) {
            if (arr[index] === search) {
                return index;
            }
            index += increment;
        }
        return -1;
    }
    function arrayReduce(arr, fn, initialValue, fromRight) {
        var length = arr.length, count = 0, defined = isDefined(initialValue), result, index;
        checkCallback(fn);
        if (length == 0 && !defined) {
            throw new TypeError('Reduce called on empty array with no initial value');
        } else if (defined) {
            result = initialValue;
        } else {
            result = arr[fromRight ? length - 1 : count];
            count++;
        }
        while (count < length) {
            index = fromRight ? length - count - 1 : count;
            if (index in arr) {
                result = fn(result, arr[index], index, arr);
            }
            count++;
        }
        return result;
    }
    function toIntegerWithDefault(i, d) {
        if (isNaN(i)) {
            return d;
        } else {
            return parseInt(i >> 0);
        }
    }
    function checkFirstArgumentExists(args) {
        if (args.length === 0) {
            throw new TypeError('First argument must be defined');
        }
    }
    extend(array, false, false, {
        'isArray': function (obj) {
            return isArray(obj);
        }
    });
    extend(array, true, false, {
        'every': function (fn, scope) {
            var length = this.length, index = 0;
            checkFirstArgumentExists(arguments);
            while (index < length) {
                if (index in this && !fn.call(scope, this[index], index, this)) {
                    return false;
                }
                index++;
            }
            return true;
        },
        'some': function (fn, scope) {
            var length = this.length, index = 0;
            checkFirstArgumentExists(arguments);
            while (index < length) {
                if (index in this && fn.call(scope, this[index], index, this)) {
                    return true;
                }
                index++;
            }
            return false;
        },
        'map': function (fn, scope) {
            var scope = arguments[1], length = this.length, index = 0, result = new Array(length);
            checkFirstArgumentExists(arguments);
            while (index < length) {
                if (index in this) {
                    result[index] = fn.call(scope, this[index], index, this);
                }
                index++;
            }
            return result;
        },
        'filter': function (fn) {
            var scope = arguments[1];
            var length = this.length, index = 0, result = [];
            checkFirstArgumentExists(arguments);
            while (index < length) {
                if (index in this && fn.call(scope, this[index], index, this)) {
                    result.push(this[index]);
                }
                index++;
            }
            return result;
        },
        'indexOf': function (search) {
            var fromIndex = arguments[1];
            if (isString(this))
                return this.indexOf(search, fromIndex);
            return arrayIndexOf(this, search, fromIndex, 1);
        },
        'lastIndexOf': function (search) {
            var fromIndex = arguments[1];
            if (isString(this))
                return this.lastIndexOf(search, fromIndex);
            return arrayIndexOf(this, search, fromIndex, -1);
        },
        'forEach': function (fn) {
            var length = this.length, index = 0, scope = arguments[1];
            checkCallback(fn);
            while (index < length) {
                if (index in this) {
                    fn.call(scope, this[index], index, this);
                }
                index++;
            }
        },
        'reduce': function (fn) {
            return arrayReduce(this, fn, arguments[1]);
        },
        'reduceRight': function (fn) {
            return arrayReduce(this, fn, arguments[1], true);
        }
    });
    function buildTrim() {
        var support = getTrimmableCharacters().match(/^\s+$/);
        try {
            string.prototype.trim.call([1]);
        } catch (e) {
            support = false;
        }
        extend(string, true, !support, {
            'trim': function () {
                return this.toString().trimLeft().trimRight();
            },
            'trimLeft': function () {
                return this.replace(regexp('^[' + getTrimmableCharacters() + ']+'), '');
            },
            'trimRight': function () {
                return this.replace(regexp('[' + getTrimmableCharacters() + ']+$'), '');
            }
        });
    }
    extend(Function, true, false, {
        'bind': function (scope) {
            var fn = this, args = multiArgs(arguments, null, 1), bound;
            if (!isFunction(this)) {
                throw new TypeError('Function.prototype.bind called on a non-function');
            }
            bound = function () {
                return fn.apply(fn.prototype && this instanceof fn ? this : scope, args.concat(multiArgs(arguments)));
            };
            bound.prototype = this.prototype;
            return bound;
        }
    });
    extend(date, false, false, {
        'now': function () {
            return new date().getTime();
        }
    });
    function buildISOString() {
        var d = new date(date.UTC(1999, 11, 31)), target = '1999-12-31T00:00:00.000Z';
        var support = d.toISOString && d.toISOString() === target;
        extendSimilar(date, true, !support, 'toISOString,toJSON', function (methods, name) {
            methods[name] = function () {
                return padNumber(this.getUTCFullYear(), 4) + '-' + padNumber(this.getUTCMonth() + 1, 2) + '-' + padNumber(this.getUTCDate(), 2) + 'T' + padNumber(this.getUTCHours(), 2) + ':' + padNumber(this.getUTCMinutes(), 2) + ':' + padNumber(this.getUTCSeconds(), 2) + '.' + padNumber(this.getUTCMilliseconds(), 3) + 'Z';
            };
        });
    }
    buildTrim();
    buildISOString();
    function regexMatcher(reg) {
        reg = regexp(reg);
        return function (el) {
            return reg.test(el);
        };
    }
    function dateMatcher(d) {
        var ms = d.getTime();
        return function (el) {
            return !!(el && el.getTime) && el.getTime() === ms;
        };
    }
    function functionMatcher(fn) {
        return function (el, i, arr) {
            return el === fn || fn.call(this, el, i, arr);
        };
    }
    function invertedArgsFunctionMatcher(fn) {
        return function (value, key, obj) {
            return value === fn || fn.call(obj, key, value, obj);
        };
    }
    function fuzzyMatcher(obj, isObject) {
        var matchers = {};
        return function (el, i, arr) {
            var key;
            if (!isObjectType(el)) {
                return false;
            }
            for (key in obj) {
                matchers[key] = matchers[key] || getMatcher(obj[key], isObject);
                if (matchers[key].call(arr, el[key], i, arr) === false) {
                    return false;
                }
            }
            return true;
        };
    }
    function defaultMatcher(f) {
        return function (el) {
            return el === f || isEqual(el, f);
        };
    }
    function getMatcher(f, isObject) {
        if (isPrimitiveType(f)) {
        } else if (isRegExp(f)) {
            return regexMatcher(f);
        } else if (isDate(f)) {
            return dateMatcher(f);
        } else if (isFunction(f)) {
            if (isObject) {
                return invertedArgsFunctionMatcher(f);
            } else {
                return functionMatcher(f);
            }
        } else if (isPlainObject(f)) {
            return fuzzyMatcher(f, isObject);
        }
        return defaultMatcher(f);
    }
    function transformArgument(el, map, context, mapArgs) {
        if (!map) {
            return el;
        } else if (map.apply) {
            return map.apply(context, mapArgs || []);
        } else if (isFunction(el[map])) {
            return el[map].call(el);
        } else {
            return el[map];
        }
    }
    function arrayEach(arr, fn, startIndex, loop) {
        var index, i, length = +arr.length;
        if (startIndex < 0)
            startIndex = arr.length + startIndex;
        i = isNaN(startIndex) ? 0 : startIndex;
        if (loop === true) {
            length += i;
        }
        while (i < length) {
            index = i % arr.length;
            if (!(index in arr)) {
                return iterateOverSparseArray(arr, fn, i, loop);
            } else if (fn.call(arr, arr[index], index, arr) === false) {
                break;
            }
            i++;
        }
    }
    function iterateOverSparseArray(arr, fn, fromIndex, loop) {
        var indexes = [], i;
        for (i in arr) {
            if (isArrayIndex(arr, i) && i >= fromIndex) {
                indexes.push(parseInt(i));
            }
        }
        indexes.sort().each(function (index) {
            return fn.call(arr, arr[index], index, arr);
        });
        return arr;
    }
    function isArrayIndex(arr, i) {
        return i in arr && toUInt32(i) == i && i != 4294967295;
    }
    function toUInt32(i) {
        return i >>> 0;
    }
    function arrayFind(arr, f, startIndex, loop, returnIndex, context) {
        var result, index, matcher;
        if (arr.length > 0) {
            matcher = getMatcher(f);
            arrayEach(arr, function (el, i) {
                if (matcher.call(context, el, i, arr)) {
                    result = el;
                    index = i;
                    return false;
                }
            }, startIndex, loop);
        }
        return returnIndex ? index : result;
    }
    function arrayUnique(arr, map) {
        var result = [], o = {}, transformed;
        arrayEach(arr, function (el, i) {
            transformed = map ? transformArgument(el, map, arr, [
                el,
                i,
                arr
            ]) : el;
            if (!checkForElementInHashAndSet(o, transformed)) {
                result.push(el);
            }
        });
        return result;
    }
    function arrayIntersect(arr1, arr2, subtract) {
        var result = [], o = {};
        arr2.each(function (el) {
            checkForElementInHashAndSet(o, el);
        });
        arr1.each(function (el) {
            var stringified = stringify(el), isReference = !objectIsMatchedByValue(el);
            if (elementExistsInHash(o, stringified, el, isReference) !== subtract) {
                discardElementFromHash(o, stringified, el, isReference);
                result.push(el);
            }
        });
        return result;
    }
    function arrayFlatten(arr, level, current) {
        level = level || Infinity;
        current = current || 0;
        var result = [];
        arrayEach(arr, function (el) {
            if (isArray(el) && current < level) {
                result = result.concat(arrayFlatten(el, level, current + 1));
            } else {
                result.push(el);
            }
        });
        return result;
    }
    function isArrayLike(obj) {
        return hasProperty(obj, 'length') && !isString(obj) && !isPlainObject(obj);
    }
    function isArgumentsObject(obj) {
        return hasProperty(obj, 'length') && (className(obj) === '[object Arguments]' || !!obj.callee);
    }
    function flatArguments(args) {
        var result = [];
        multiArgs(args, function (arg) {
            result = result.concat(arg);
        });
        return result;
    }
    function elementExistsInHash(hash, key, element, isReference) {
        var exists = key in hash;
        if (isReference) {
            if (!hash[key]) {
                hash[key] = [];
            }
            exists = hash[key].indexOf(element) !== -1;
        }
        return exists;
    }
    function checkForElementInHashAndSet(hash, element) {
        var stringified = stringify(element), isReference = !objectIsMatchedByValue(element), exists = elementExistsInHash(hash, stringified, element, isReference);
        if (isReference) {
            hash[stringified].push(element);
        } else {
            hash[stringified] = element;
        }
        return exists;
    }
    function discardElementFromHash(hash, key, element, isReference) {
        var arr, i = 0;
        if (isReference) {
            arr = hash[key];
            while (i < arr.length) {
                if (arr[i] === element) {
                    arr.splice(i, 1);
                } else {
                    i += 1;
                }
            }
        } else {
            delete hash[key];
        }
    }
    function getMinOrMax(obj, map, which, all) {
        var el, key, edge, test, result = [], max = which === 'max', min = which === 'min', isArray = array.isArray(obj);
        for (key in obj) {
            if (!obj.hasOwnProperty(key))
                continue;
            el = obj[key];
            test = transformArgument(el, map, obj, isArray ? [
                el,
                parseInt(key),
                obj
            ] : []);
            if (isUndefined(test)) {
                throw new TypeError('Cannot compare with undefined');
            }
            if (test === edge) {
                result.push(el);
            } else if (isUndefined(edge) || max && test > edge || min && test < edge) {
                result = [el];
                edge = test;
            }
        }
        if (!isArray)
            result = arrayFlatten(result, 1);
        return all ? result : result[0];
    }
    function collateStrings(a, b) {
        var aValue, bValue, aChar, bChar, aEquiv, bEquiv, index = 0, tiebreaker = 0;
        var sortIgnore = array[AlphanumericSortIgnore];
        var sortIgnoreCase = array[AlphanumericSortIgnoreCase];
        var sortEquivalents = array[AlphanumericSortEquivalents];
        var sortOrder = array[AlphanumericSortOrder];
        var naturalSort = array[AlphanumericSortNatural];
        a = getCollationReadyString(a, sortIgnore, sortIgnoreCase);
        b = getCollationReadyString(b, sortIgnore, sortIgnoreCase);
        do {
            aChar = getCollationCharacter(a, index, sortEquivalents);
            bChar = getCollationCharacter(b, index, sortEquivalents);
            aValue = getSortOrderIndex(aChar, sortOrder);
            bValue = getSortOrderIndex(bChar, sortOrder);
            if (aValue === -1 || bValue === -1) {
                aValue = a.charCodeAt(index) || null;
                bValue = b.charCodeAt(index) || null;
                if (naturalSort && codeIsNumeral(aValue) && codeIsNumeral(bValue)) {
                    aValue = stringToNumber(a.slice(index));
                    bValue = stringToNumber(b.slice(index));
                }
            } else {
                aEquiv = aChar !== a.charAt(index);
                bEquiv = bChar !== b.charAt(index);
                if (aEquiv !== bEquiv && tiebreaker === 0) {
                    tiebreaker = aEquiv - bEquiv;
                }
            }
            index += 1;
        } while (aValue != null && bValue != null && aValue === bValue);
        if (aValue === bValue)
            return tiebreaker;
        return aValue - bValue;
    }
    function getCollationReadyString(str, sortIgnore, sortIgnoreCase) {
        if (!isString(str))
            str = string(str);
        if (sortIgnoreCase) {
            str = str.toLowerCase();
        }
        if (sortIgnore) {
            str = str.replace(sortIgnore, '');
        }
        return str;
    }
    function getCollationCharacter(str, index, sortEquivalents) {
        var chr = str.charAt(index);
        return sortEquivalents[chr] || chr;
    }
    function getSortOrderIndex(chr, sortOrder) {
        if (!chr) {
            return null;
        } else {
            return sortOrder.indexOf(chr);
        }
    }
    var AlphanumericSort = 'AlphanumericSort';
    var AlphanumericSortOrder = 'AlphanumericSortOrder';
    var AlphanumericSortIgnore = 'AlphanumericSortIgnore';
    var AlphanumericSortIgnoreCase = 'AlphanumericSortIgnoreCase';
    var AlphanumericSortEquivalents = 'AlphanumericSortEquivalents';
    var AlphanumericSortNatural = 'AlphanumericSortNatural';
    function buildEnhancements() {
        var nativeMap = array.prototype.map;
        var callbackCheck = function () {
            var args = arguments;
            return args.length > 0 && !isFunction(args[0]);
        };
        extendSimilar(array, true, callbackCheck, 'every,all,some,filter,any,none,find,findIndex', function (methods, name) {
            var nativeFn = array.prototype[name];
            methods[name] = function (f) {
                var matcher = getMatcher(f);
                return nativeFn.call(this, function (el, index) {
                    return matcher(el, index, this);
                });
            };
        });
        extend(array, true, callbackCheck, {
            'map': function (f) {
                return nativeMap.call(this, function (el, index) {
                    return transformArgument(el, f, this, [
                        el,
                        index,
                        this
                    ]);
                });
            }
        });
    }
    function buildAlphanumericSort() {
        var order = 'A\xc1\xc0\xc2\xc3\u0104BC\u0106\u010c\xc7D\u010e\xd0E\xc9\xc8\u011a\xca\xcb\u0118FG\u011eH\u0131I\xcd\xcc\u0130\xce\xcfJKL\u0141MN\u0143\u0147\xd1O\xd3\xd2\xd4PQR\u0158S\u015a\u0160\u015eT\u0164U\xda\xd9\u016e\xdb\xdcVWXY\xddZ\u0179\u017b\u017d\xde\xc6\u0152\xd8\xd5\xc5\xc4\xd6';
        var equiv = 'A\xc1\xc0\xc2\xc3\xc4,C\xc7,E\xc9\xc8\xca\xcb,I\xcd\xcc\u0130\xce\xcf,O\xd3\xd2\xd4\xd5\xd6,S\xdf,U\xda\xd9\xdb\xdc';
        array[AlphanumericSortOrder] = order.split('').map(function (str) {
            return str + str.toLowerCase();
        }).join('');
        var equivalents = {};
        arrayEach(equiv.split(','), function (set) {
            var equivalent = set.charAt(0);
            arrayEach(set.slice(1).split(''), function (chr) {
                equivalents[chr] = equivalent;
                equivalents[chr.toLowerCase()] = equivalent.toLowerCase();
            });
        });
        array[AlphanumericSortNatural] = true;
        array[AlphanumericSortIgnoreCase] = true;
        array[AlphanumericSortEquivalents] = equivalents;
    }
    extend(array, false, true, {
        'create': function () {
            var result = [];
            multiArgs(arguments, function (a) {
                if (isArgumentsObject(a) || isArrayLike(a)) {
                    a = array.prototype.slice.call(a, 0);
                }
                result = result.concat(a);
            });
            return result;
        }
    });
    extend(array, true, false, {
        'find': function (f, context) {
            checkCallback(f);
            return arrayFind(this, f, 0, false, false, context);
        },
        'findIndex': function (f, context) {
            var index;
            checkCallback(f);
            index = arrayFind(this, f, 0, false, true, context);
            return isUndefined(index) ? -1 : index;
        }
    });
    extend(array, true, true, {
        'findFrom': function (f, index, loop) {
            return arrayFind(this, f, index, loop);
        },
        'findIndexFrom': function (f, index, loop) {
            var index = arrayFind(this, f, index, loop, true);
            return isUndefined(index) ? -1 : index;
        },
        'findAll': function (f, index, loop) {
            var result = [], matcher;
            if (this.length > 0) {
                matcher = getMatcher(f);
                arrayEach(this, function (el, i, arr) {
                    if (matcher(el, i, arr)) {
                        result.push(el);
                    }
                }, index, loop);
            }
            return result;
        },
        'count': function (f) {
            if (isUndefined(f))
                return this.length;
            return this.findAll(f).length;
        },
        'removeAt': function (start, end) {
            if (isUndefined(start))
                return this;
            if (isUndefined(end))
                end = start;
            this.splice(start, end - start + 1);
            return this;
        },
        'include': function (el, index) {
            return this.clone().add(el, index);
        },
        'exclude': function () {
            return array.prototype.remove.apply(this.clone(), arguments);
        },
        'clone': function () {
            return simpleMerge([], this);
        },
        'unique': function (map) {
            return arrayUnique(this, map);
        },
        'flatten': function (limit) {
            return arrayFlatten(this, limit);
        },
        'union': function () {
            return arrayUnique(this.concat(flatArguments(arguments)));
        },
        'intersect': function () {
            return arrayIntersect(this, flatArguments(arguments), false);
        },
        'subtract': function (a) {
            return arrayIntersect(this, flatArguments(arguments), true);
        },
        'at': function () {
            return getEntriesForIndexes(this, arguments);
        },
        'first': function (num) {
            if (isUndefined(num))
                return this[0];
            if (num < 0)
                num = 0;
            return this.slice(0, num);
        },
        'last': function (num) {
            if (isUndefined(num))
                return this[this.length - 1];
            var start = this.length - num < 0 ? 0 : this.length - num;
            return this.slice(start);
        },
        'from': function (num) {
            return this.slice(num);
        },
        'to': function (num) {
            if (isUndefined(num))
                num = this.length;
            return this.slice(0, num);
        },
        'min': function (map, all) {
            return getMinOrMax(this, map, 'min', all);
        },
        'max': function (map, all) {
            return getMinOrMax(this, map, 'max', all);
        },
        'least': function (map, all) {
            return getMinOrMax(this.groupBy.apply(this, [map]), 'length', 'min', all);
        },
        'most': function (map, all) {
            return getMinOrMax(this.groupBy.apply(this, [map]), 'length', 'max', all);
        },
        'sum': function (map) {
            var arr = map ? this.map(map) : this;
            return arr.length > 0 ? arr.reduce(function (a, b) {
                return a + b;
            }) : 0;
        },
        'average': function (map) {
            var arr = map ? this.map(map) : this;
            return arr.length > 0 ? arr.sum() / arr.length : 0;
        },
        'inGroups': function (num, padding) {
            var pad = arguments.length > 1;
            var arr = this;
            var result = [];
            var divisor = ceil(this.length / num);
            simpleRepeat(num, function (i) {
                var index = i * divisor;
                var group = arr.slice(index, index + divisor);
                if (pad && group.length < divisor) {
                    simpleRepeat(divisor - group.length, function () {
                        group = group.add(padding);
                    });
                }
                result.push(group);
            });
            return result;
        },
        'inGroupsOf': function (num, padding) {
            var result = [], len = this.length, arr = this, group;
            if (len === 0 || num === 0)
                return arr;
            if (isUndefined(num))
                num = 1;
            if (isUndefined(padding))
                padding = null;
            simpleRepeat(ceil(len / num), function (i) {
                group = arr.slice(num * i, num * i + num);
                while (group.length < num) {
                    group.push(padding);
                }
                result.push(group);
            });
            return result;
        },
        'isEmpty': function () {
            return this.compact().length == 0;
        },
        'sortBy': function (map, desc) {
            var arr = this.clone();
            arr.sort(function (a, b) {
                var aProperty, bProperty, comp;
                aProperty = transformArgument(a, map, arr, [a]);
                bProperty = transformArgument(b, map, arr, [b]);
                if (isString(aProperty) && isString(bProperty)) {
                    comp = collateStrings(aProperty, bProperty);
                } else if (aProperty < bProperty) {
                    comp = -1;
                } else if (aProperty > bProperty) {
                    comp = 1;
                } else {
                    comp = 0;
                }
                return comp * (desc ? -1 : 1);
            });
            return arr;
        },
        'randomize': function () {
            var arr = this.concat(), i = arr.length, j, x;
            while (i) {
                j = math.random() * i | 0;
                x = arr[--i];
                arr[i] = arr[j];
                arr[j] = x;
            }
            return arr;
        },
        'zip': function () {
            var args = multiArgs(arguments);
            return this.map(function (el, i) {
                return [el].concat(args.map(function (k) {
                    return i in k ? k[i] : null;
                }));
            });
        },
        'sample': function (num) {
            var arr = this.randomize();
            return arguments.length > 0 ? arr.slice(0, num) : arr[0];
        },
        'each': function (fn, index, loop) {
            arrayEach(this, fn, index, loop);
            return this;
        },
        'add': function (el, index) {
            if (!isNumber(number(index)) || isNaN(index))
                index = this.length;
            array.prototype.splice.apply(this, [
                index,
                0
            ].concat(el));
            return this;
        },
        'remove': function () {
            var arr = this;
            multiArgs(arguments, function (f) {
                var i = 0, matcher = getMatcher(f);
                while (i < arr.length) {
                    if (matcher(arr[i], i, arr)) {
                        arr.splice(i, 1);
                    } else {
                        i++;
                    }
                }
            });
            return arr;
        },
        'compact': function (all) {
            var result = [];
            arrayEach(this, function (el, i) {
                if (isArray(el)) {
                    result.push(el.compact());
                } else if (all && el) {
                    result.push(el);
                } else if (!all && el != null && el.valueOf() === el.valueOf()) {
                    result.push(el);
                }
            });
            return result;
        },
        'groupBy': function (map, fn) {
            var arr = this, result = {}, key;
            arrayEach(arr, function (el, index) {
                key = transformArgument(el, map, arr, [
                    el,
                    index,
                    arr
                ]);
                if (!result[key])
                    result[key] = [];
                result[key].push(el);
            });
            if (fn) {
                iterateOverObject(result, fn);
            }
            return result;
        },
        'none': function () {
            return !this.any.apply(this, arguments);
        }
    });
    extend(array, true, true, {
        'all': array.prototype.every,
        'any': array.prototype.some,
        'insert': array.prototype.add
    });
    function keysWithObjectCoercion(obj) {
        return object.keys(coercePrimitiveToObject(obj));
    }
    function buildEnumerableMethods(names, mapping) {
        extendSimilar(object, false, true, names, function (methods, name) {
            methods[name] = function (obj, arg1, arg2) {
                var result, coerced = keysWithObjectCoercion(obj), matcher;
                if (!mapping) {
                    matcher = getMatcher(arg1, true);
                }
                result = array.prototype[name].call(coerced, function (key) {
                    var value = obj[key];
                    if (mapping) {
                        return transformArgument(value, arg1, obj, [
                            key,
                            value,
                            obj
                        ]);
                    } else {
                        return matcher(value, key, obj);
                    }
                }, arg2);
                if (isArray(result)) {
                    result = result.reduce(function (o, key, i) {
                        o[key] = obj[key];
                        return o;
                    }, {});
                }
                return result;
            };
        });
        buildObjectInstanceMethods(names, Hash);
    }
    function exportSortAlgorithm() {
        array[AlphanumericSort] = collateStrings;
    }
    extend(object, false, true, {
        'map': function (obj, map) {
            var result = {}, key, value;
            for (key in obj) {
                if (!hasOwnProperty(obj, key))
                    continue;
                value = obj[key];
                result[key] = transformArgument(value, map, obj, [
                    key,
                    value,
                    obj
                ]);
            }
            return result;
        },
        'reduce': function (obj) {
            var values = keysWithObjectCoercion(obj).map(function (key) {
                    return obj[key];
                });
            return values.reduce.apply(values, multiArgs(arguments, null, 1));
        },
        'each': function (obj, fn) {
            checkCallback(fn);
            iterateOverObject(obj, fn);
            return obj;
        },
        'size': function (obj) {
            return keysWithObjectCoercion(obj).length;
        }
    });
    var EnumerableFindingMethods = 'any,all,none,count,find,findAll,isEmpty'.split(',');
    var EnumerableMappingMethods = 'sum,average,min,max,least,most'.split(',');
    var EnumerableOtherMethods = 'map,reduce,size'.split(',');
    var EnumerableMethods = EnumerableFindingMethods.concat(EnumerableMappingMethods).concat(EnumerableOtherMethods);
    buildEnhancements();
    buildAlphanumericSort();
    buildEnumerableMethods(EnumerableFindingMethods);
    buildEnumerableMethods(EnumerableMappingMethods, true);
    buildObjectInstanceMethods(EnumerableOtherMethods, Hash);
    exportSortAlgorithm();
    var English;
    var CurrentLocalization;
    var TimeFormat = [
            'ampm',
            'hour',
            'minute',
            'second',
            'ampm',
            'utc',
            'offset_sign',
            'offset_hours',
            'offset_minutes',
            'ampm'
        ];
    var DecimalReg = '(?:[,.]\\d+)?';
    var HoursReg = '\\d{1,2}' + DecimalReg;
    var SixtyReg = '[0-5]\\d' + DecimalReg;
    var RequiredTime = '({t})?\\s*(' + HoursReg + ')(?:{h}(' + SixtyReg + ')?{m}(?::?(' + SixtyReg + '){s})?\\s*(?:({t})|(Z)|(?:([+-])(\\d{2,2})(?::?(\\d{2,2}))?)?)?|\\s*({t}))';
    var KanjiDigits = '\u3007\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341\u767e\u5343\u4e07';
    var AsianDigitMap = {};
    var AsianDigitReg;
    var DateArgumentUnits;
    var DateUnitsReversed;
    var CoreDateFormats = [];
    var CompiledOutputFormats = {};
    var DateFormatTokens = {
            'yyyy': function (d) {
                return callDateGet(d, 'FullYear');
            },
            'yy': function (d) {
                return callDateGet(d, 'FullYear') % 100;
            },
            'ord': function (d) {
                var date = callDateGet(d, 'Date');
                return date + getOrdinalizedSuffix(date);
            },
            'tz': function (d) {
                return d.getUTCOffset();
            },
            'isotz': function (d) {
                return d.getUTCOffset(true);
            },
            'Z': function (d) {
                return d.getUTCOffset();
            },
            'ZZ': function (d) {
                return d.getUTCOffset().replace(/(\d{2})$/, ':$1');
            }
        };
    var DateUnits = [
            {
                name: 'year',
                method: 'FullYear',
                ambiguous: true,
                multiplier: function (d) {
                    var adjust = d ? d.isLeapYear() ? 1 : 0 : 0.25;
                    return (365 + adjust) * 24 * 60 * 60 * 1000;
                }
            },
            {
                name: 'month',
                error: 0.919,
                method: 'Month',
                ambiguous: true,
                multiplier: function (d, ms) {
                    var days = 30.4375, inMonth;
                    if (d) {
                        inMonth = d.daysInMonth();
                        if (ms <= inMonth.days()) {
                            days = inMonth;
                        }
                    }
                    return days * 24 * 60 * 60 * 1000;
                }
            },
            {
                name: 'week',
                method: 'ISOWeek',
                multiplier: function () {
                    return 7 * 24 * 60 * 60 * 1000;
                }
            },
            {
                name: 'day',
                error: 0.958,
                method: 'Date',
                ambiguous: true,
                multiplier: function () {
                    return 24 * 60 * 60 * 1000;
                }
            },
            {
                name: 'hour',
                method: 'Hours',
                multiplier: function () {
                    return 60 * 60 * 1000;
                }
            },
            {
                name: 'minute',
                method: 'Minutes',
                multiplier: function () {
                    return 60 * 1000;
                }
            },
            {
                name: 'second',
                method: 'Seconds',
                multiplier: function () {
                    return 1000;
                }
            },
            {
                name: 'millisecond',
                method: 'Milliseconds',
                multiplier: function () {
                    return 1;
                }
            }
        ];
    var Localizations = {};
    function Localization(l) {
        simpleMerge(this, l);
        this.compiledFormats = CoreDateFormats.concat();
    }
    Localization.prototype = {
        getMonth: function (n) {
            if (isNumber(n)) {
                return n - 1;
            } else {
                return this['months'].indexOf(n) % 12;
            }
        },
        getWeekday: function (n) {
            return this['weekdays'].indexOf(n) % 7;
        },
        getNumber: function (n) {
            var i;
            if (isNumber(n)) {
                return n;
            } else if (n && (i = this['numbers'].indexOf(n)) !== -1) {
                return (i + 1) % 10;
            } else {
                return 1;
            }
        },
        getNumericDate: function (n) {
            var self = this;
            return n.replace(regexp(this['num'], 'g'), function (d) {
                var num = self.getNumber(d);
                return num || '';
            });
        },
        getUnitIndex: function (n) {
            return this['units'].indexOf(n) % 8;
        },
        getRelativeFormat: function (adu) {
            return this.convertAdjustedToFormat(adu, adu[2] > 0 ? 'future' : 'past');
        },
        getDuration: function (ms) {
            return this.convertAdjustedToFormat(getAdjustedUnit(ms), 'duration');
        },
        hasVariant: function (code) {
            code = code || this.code;
            return code === 'en' || code === 'en-US' ? true : this['variant'];
        },
        matchAM: function (str) {
            return str === this['ampm'][0];
        },
        matchPM: function (str) {
            return str && str === this['ampm'][1];
        },
        convertAdjustedToFormat: function (adu, mode) {
            var sign, unit, mult, num = adu[0], u = adu[1], ms = adu[2], format = this[mode] || this['relative'];
            if (isFunction(format)) {
                return format.call(this, num, u, ms, mode);
            }
            mult = this['plural'] && num > 1 ? 1 : 0;
            unit = this['units'][mult * 8 + u] || this['units'][u];
            if (this['capitalizeUnit'])
                unit = simpleCapitalize(unit);
            sign = this['modifiers'].filter(function (m) {
                return m.name == 'sign' && m.value == (ms > 0 ? 1 : -1);
            })[0];
            return format.replace(/\{(.*?)\}/g, function (full, match) {
                switch (match) {
                case 'num':
                    return num;
                case 'unit':
                    return unit;
                case 'sign':
                    return sign.src;
                }
            });
        },
        getFormats: function () {
            return this.cachedFormat ? [this.cachedFormat].concat(this.compiledFormats) : this.compiledFormats;
        },
        addFormat: function (src, allowsTime, match, variant, iso) {
            var to = match || [], loc = this, time, timeMarkers, lastIsNumeral;
            src = src.replace(/\s+/g, '[,. ]*');
            src = src.replace(/\{([^,]+?)\}/g, function (all, k) {
                var value, arr, result, opt = k.match(/\?$/), nc = k.match(/^(\d+)\??$/), slice = k.match(/(\d)(?:-(\d))?/), key = k.replace(/[^a-z]+$/, '');
                if (nc) {
                    value = loc['tokens'][nc[1]];
                } else if (loc[key]) {
                    value = loc[key];
                } else if (loc[key + 's']) {
                    value = loc[key + 's'];
                    if (slice) {
                        arr = [];
                        value.forEach(function (m, i) {
                            var mod = i % (loc['units'] ? 8 : value.length);
                            if (mod >= slice[1] && mod <= (slice[2] || slice[1])) {
                                arr.push(m);
                            }
                        });
                        value = arr;
                    }
                    value = arrayToAlternates(value);
                }
                if (nc) {
                    result = '(?:' + value + ')';
                } else {
                    if (!match) {
                        to.push(key);
                    }
                    result = '(' + value + ')';
                }
                if (opt) {
                    result += '?';
                }
                return result;
            });
            if (allowsTime) {
                time = prepareTime(RequiredTime, loc, iso);
                timeMarkers = [
                    't',
                    '[\\s\\u3000]'
                ].concat(loc['timeMarker']);
                lastIsNumeral = src.match(/\\d\{\d,\d\}\)+\??$/);
                addDateInputFormat(loc, '(?:' + time + ')[,\\s\\u3000]+?' + src, TimeFormat.concat(to), variant);
                addDateInputFormat(loc, src + '(?:[,\\s]*(?:' + timeMarkers.join('|') + (lastIsNumeral ? '+' : '*') + ')' + time + ')?', to.concat(TimeFormat), variant);
            } else {
                addDateInputFormat(loc, src, to, variant);
            }
        }
    };
    function getLocalization(localeCode, fallback) {
        var loc;
        if (!isString(localeCode))
            localeCode = '';
        loc = Localizations[localeCode] || Localizations[localeCode.slice(0, 2)];
        if (fallback === false && !loc) {
            throw new TypeError('Invalid locale.');
        }
        return loc || CurrentLocalization;
    }
    function setLocalization(localeCode, set) {
        var loc, canAbbreviate;
        function initializeField(name) {
            var val = loc[name];
            if (isString(val)) {
                loc[name] = val.split(',');
            } else if (!val) {
                loc[name] = [];
            }
        }
        function eachAlternate(str, fn) {
            str = str.split('+').map(function (split) {
                return split.replace(/(.+):(.+)$/, function (full, base, suffixes) {
                    return suffixes.split('|').map(function (suffix) {
                        return base + suffix;
                    }).join('|');
                });
            }).join('|');
            return str.split('|').forEach(fn);
        }
        function setArray(name, abbreviate, multiple) {
            var arr = [];
            loc[name].forEach(function (full, i) {
                if (abbreviate) {
                    full += '+' + full.slice(0, 3);
                }
                eachAlternate(full, function (day, j) {
                    arr[j * multiple + i] = day.toLowerCase();
                });
            });
            loc[name] = arr;
        }
        function getDigit(start, stop, allowNumbers) {
            var str = '\\d{' + start + ',' + stop + '}';
            if (allowNumbers)
                str += '|(?:' + arrayToAlternates(loc['numbers']) + ')+';
            return str;
        }
        function getNum() {
            var arr = ['-?\\d+'].concat(loc['articles']);
            if (loc['numbers'])
                arr = arr.concat(loc['numbers']);
            return arrayToAlternates(arr);
        }
        function setDefault(name, value) {
            loc[name] = loc[name] || value;
        }
        function setModifiers() {
            var arr = [];
            loc.modifiersByName = {};
            loc['modifiers'].push({
                'name': 'day',
                'src': 'yesterday',
                'value': -1
            });
            loc['modifiers'].push({
                'name': 'day',
                'src': 'today',
                'value': 0
            });
            loc['modifiers'].push({
                'name': 'day',
                'src': 'tomorrow',
                'value': 1
            });
            loc['modifiers'].forEach(function (modifier) {
                var name = modifier.name;
                eachAlternate(modifier.src, function (t) {
                    var locEntry = loc[name];
                    loc.modifiersByName[t] = modifier;
                    arr.push({
                        name: name,
                        src: t,
                        value: modifier.value
                    });
                    loc[name] = locEntry ? locEntry + '|' + t : t;
                });
            });
            loc['day'] += '|' + arrayToAlternates(loc['weekdays']);
            loc['modifiers'] = arr;
        }
        loc = new Localization(set);
        initializeField('modifiers');
        'months,weekdays,units,numbers,articles,tokens,timeMarker,ampm,timeSuffixes,dateParse,timeParse'.split(',').forEach(initializeField);
        canAbbreviate = !loc['monthSuffix'];
        setArray('months', canAbbreviate, 12);
        setArray('weekdays', canAbbreviate, 7);
        setArray('units', false, 8);
        setArray('numbers', false, 10);
        setDefault('code', localeCode);
        setDefault('date', getDigit(1, 2, loc['digitDate']));
        setDefault('year', '\'\\d{2}|' + getDigit(4, 4));
        setDefault('num', getNum());
        setModifiers();
        if (loc['monthSuffix']) {
            loc['month'] = getDigit(1, 2);
            loc['months'] = '1,2,3,4,5,6,7,8,9,10,11,12'.split(',').map(function (n) {
                return n + loc['monthSuffix'];
            });
        }
        loc['full_month'] = getDigit(1, 2) + '|' + arrayToAlternates(loc['months']);
        if (loc['timeSuffixes'].length > 0) {
            loc.addFormat(prepareTime(RequiredTime, loc), false, TimeFormat);
        }
        loc.addFormat('{day}', true);
        loc.addFormat('{month}' + (loc['monthSuffix'] || ''));
        loc.addFormat('{year}' + (loc['yearSuffix'] || ''));
        loc['timeParse'].forEach(function (src) {
            loc.addFormat(src, true);
        });
        loc['dateParse'].forEach(function (src) {
            loc.addFormat(src);
        });
        return Localizations[localeCode] = loc;
    }
    function addDateInputFormat(locale, format, match, variant) {
        locale.compiledFormats.unshift({
            variant: variant,
            locale: locale,
            reg: regexp('^' + format + '$', 'i'),
            to: match
        });
    }
    function simpleCapitalize(str) {
        return str.slice(0, 1).toUpperCase() + str.slice(1);
    }
    function arrayToAlternates(arr) {
        return arr.filter(function (el) {
            return !!el;
        }).join('|');
    }
    function getNewDate() {
        var fn = date.SugarNewDate;
        return fn ? fn() : new date();
    }
    function collectDateArguments(args, allowDuration) {
        var obj;
        if (isObjectType(args[0])) {
            return args;
        } else if (isNumber(args[0]) && !isNumber(args[1])) {
            return [args[0]];
        } else if (isString(args[0]) && allowDuration) {
            return [
                getDateParamsFromString(args[0]),
                args[1]
            ];
        }
        obj = {};
        DateArgumentUnits.forEach(function (u, i) {
            obj[u.name] = args[i];
        });
        return [obj];
    }
    function getDateParamsFromString(str, num) {
        var match, params = {};
        match = str.match(/^(\d+)?\s?(\w+?)s?$/i);
        if (match) {
            if (isUndefined(num)) {
                num = parseInt(match[1]) || 1;
            }
            params[match[2].toLowerCase()] = num;
        }
        return params;
    }
    function iterateOverDateUnits(fn, from, to) {
        var i, unit;
        if (isUndefined(to))
            to = DateUnitsReversed.length;
        for (i = from || 0; i < to; i++) {
            unit = DateUnitsReversed[i];
            if (fn(unit.name, unit, i) === false) {
                break;
            }
        }
    }
    function getFormatMatch(match, arr) {
        var obj = {}, value, num;
        arr.forEach(function (key, i) {
            value = match[i + 1];
            if (isUndefined(value) || value === '')
                return;
            if (key === 'year') {
                obj.yearAsString = value.replace(/'/, '');
            }
            num = parseFloat(value.replace(/'/, '').replace(/,/, '.'));
            obj[key] = !isNaN(num) ? num : value.toLowerCase();
        });
        return obj;
    }
    function cleanDateInput(str) {
        str = str.trim().replace(/^just (?=now)|\.+$/i, '');
        return convertAsianDigits(str);
    }
    function convertAsianDigits(str) {
        return str.replace(AsianDigitReg, function (full, disallowed, match) {
            var sum = 0, place = 1, lastWasHolder, lastHolder;
            if (disallowed)
                return full;
            match.split('').reverse().forEach(function (letter) {
                var value = AsianDigitMap[letter], holder = value > 9;
                if (holder) {
                    if (lastWasHolder)
                        sum += place;
                    place *= value / (lastHolder || 1);
                    lastHolder = value;
                } else {
                    if (lastWasHolder === false) {
                        place *= 10;
                    }
                    sum += place * value;
                }
                lastWasHolder = holder;
            });
            if (lastWasHolder)
                sum += place;
            return sum;
        });
    }
    function getExtendedDate(f, localeCode, prefer, forceUTC) {
        var d, relative, baseLocalization, afterCallbacks, loc, set, unit, unitIndex, weekday, num, tmp;
        d = getNewDate();
        afterCallbacks = [];
        function afterDateSet(fn) {
            afterCallbacks.push(fn);
        }
        function fireCallbacks() {
            afterCallbacks.forEach(function (fn) {
                fn.call();
            });
        }
        function setWeekdayOfMonth() {
            var w = d.getWeekday();
            d.setWeekday(7 * (set['num'] - 1) + (w > weekday ? weekday + 7 : weekday));
        }
        function setUnitEdge() {
            var modifier = loc.modifiersByName[set['edge']];
            iterateOverDateUnits(function (name) {
                if (isDefined(set[name])) {
                    unit = name;
                    return false;
                }
            }, 4);
            if (unit === 'year')
                set.specificity = 'month';
            else if (unit === 'month' || unit === 'week')
                set.specificity = 'day';
            d[(modifier.value < 0 ? 'endOf' : 'beginningOf') + simpleCapitalize(unit)]();
            if (modifier.value === -2)
                d.reset();
        }
        function separateAbsoluteUnits() {
            var params;
            iterateOverDateUnits(function (name, u, i) {
                if (name === 'day')
                    name = 'date';
                if (isDefined(set[name])) {
                    if (i >= unitIndex) {
                        invalidateDate(d);
                        return false;
                    }
                    params = params || {};
                    params[name] = set[name];
                    delete set[name];
                }
            });
            if (params) {
                afterDateSet(function () {
                    d.set(params, true);
                });
            }
        }
        d.utc(forceUTC);
        if (isDate(f)) {
            d.utc(f.isUTC()).setTime(f.getTime());
        } else if (isNumber(f)) {
            d.setTime(f);
        } else if (isObjectType(f)) {
            d.set(f, true);
            set = f;
        } else if (isString(f)) {
            baseLocalization = getLocalization(localeCode);
            f = cleanDateInput(f);
            if (baseLocalization) {
                iterateOverObject(baseLocalization.getFormats(), function (i, dif) {
                    var match = f.match(dif.reg);
                    if (match) {
                        loc = dif.locale;
                        set = getFormatMatch(match, dif.to, loc);
                        loc.cachedFormat = dif;
                        if (set['utc']) {
                            d.utc();
                        }
                        if (set.timestamp) {
                            set = set.timestamp;
                            return false;
                        }
                        if (dif.variant && !isString(set['month']) && (isString(set['date']) || baseLocalization.hasVariant(localeCode))) {
                            tmp = set['month'];
                            set['month'] = set['date'];
                            set['date'] = tmp;
                        }
                        if (set['year'] && set.yearAsString.length === 2) {
                            set['year'] = getYearFromAbbreviation(set['year']);
                        }
                        if (set['month']) {
                            set['month'] = loc.getMonth(set['month']);
                            if (set['shift'] && !set['unit'])
                                set['unit'] = loc['units'][7];
                        }
                        if (set['weekday'] && set['date']) {
                            delete set['weekday'];
                        } else if (set['weekday']) {
                            set['weekday'] = loc.getWeekday(set['weekday']);
                            if (set['shift'] && !set['unit'])
                                set['unit'] = loc['units'][5];
                        }
                        if (set['day'] && (tmp = loc.modifiersByName[set['day']])) {
                            set['day'] = tmp.value;
                            d.reset();
                            relative = true;
                        } else if (set['day'] && (weekday = loc.getWeekday(set['day'])) > -1) {
                            delete set['day'];
                            if (set['num'] && set['month']) {
                                afterDateSet(setWeekdayOfMonth);
                                set['day'] = 1;
                            } else {
                                set['weekday'] = weekday;
                            }
                        }
                        if (set['date'] && !isNumber(set['date'])) {
                            set['date'] = loc.getNumericDate(set['date']);
                        }
                        if (loc.matchPM(set['ampm']) && set['hour'] < 12) {
                            set['hour'] += 12;
                        } else if (loc.matchAM(set['ampm']) && set['hour'] === 12) {
                            set['hour'] = 0;
                        }
                        if ('offset_hours' in set || 'offset_minutes' in set) {
                            d.utc();
                            set['offset_minutes'] = set['offset_minutes'] || 0;
                            set['offset_minutes'] += set['offset_hours'] * 60;
                            if (set['offset_sign'] === '-') {
                                set['offset_minutes'] *= -1;
                            }
                            set['minute'] -= set['offset_minutes'];
                        }
                        if (set['unit']) {
                            relative = true;
                            num = loc.getNumber(set['num']);
                            unitIndex = loc.getUnitIndex(set['unit']);
                            unit = English['units'][unitIndex];
                            separateAbsoluteUnits();
                            if (set['shift']) {
                                num *= (tmp = loc.modifiersByName[set['shift']]) ? tmp.value : 0;
                            }
                            if (set['sign'] && (tmp = loc.modifiersByName[set['sign']])) {
                                num *= tmp.value;
                            }
                            if (isDefined(set['weekday'])) {
                                d.set({ 'weekday': set['weekday'] }, true);
                                delete set['weekday'];
                            }
                            set[unit] = (set[unit] || 0) + num;
                        }
                        if (set['edge']) {
                            afterDateSet(setUnitEdge);
                        }
                        if (set['year_sign'] === '-') {
                            set['year'] *= -1;
                        }
                        iterateOverDateUnits(function (name, unit, i) {
                            var value = set[name], fraction = value % 1;
                            if (fraction) {
                                set[DateUnitsReversed[i - 1].name] = round(fraction * (name === 'second' ? 1000 : 60));
                                set[name] = floor(value);
                            }
                        }, 1, 4);
                        return false;
                    }
                });
            }
            if (!set) {
                if (f !== 'now') {
                    d = new date(f);
                }
                if (forceUTC) {
                    d.addMinutes(-d.getTimezoneOffset());
                }
            } else if (relative) {
                d.advance(set);
            } else {
                if (d._utc) {
                    d.reset();
                }
                updateDate(d, set, true, false, prefer);
            }
            fireCallbacks();
            d.utc(false);
        }
        return {
            date: d,
            set: set
        };
    }
    function getYearFromAbbreviation(year) {
        return round(callDateGet(getNewDate(), 'FullYear') / 100) * 100 - round(year / 100) * 100 + year;
    }
    function getShortHour(d) {
        var hours = callDateGet(d, 'Hours');
        return hours === 0 ? 12 : hours - floor(hours / 13) * 12;
    }
    function getWeekNumber(date) {
        date = date.clone();
        var dow = callDateGet(date, 'Day') || 7;
        date.addDays(4 - dow).reset();
        return 1 + floor(date.daysSince(date.clone().beginningOfYear()) / 7);
    }
    function getAdjustedUnit(ms) {
        var next, ams = abs(ms), value = ams, unitIndex = 0;
        iterateOverDateUnits(function (name, unit, i) {
            next = floor(withPrecision(ams / unit.multiplier(), 1));
            if (next >= 1) {
                value = next;
                unitIndex = i;
            }
        }, 1);
        return [
            value,
            unitIndex,
            ms
        ];
    }
    function getRelativeWithMonthFallback(date) {
        var adu = getAdjustedUnit(date.millisecondsFromNow());
        if (allowMonthFallback(date, adu)) {
            adu[0] = abs(date.monthsFromNow());
            adu[1] = 6;
        }
        return adu;
    }
    function allowMonthFallback(date, adu) {
        return adu[1] === 6 || adu[1] === 5 && adu[0] === 4 && date.daysFromNow() >= getNewDate().daysInMonth();
    }
    function createMeridianTokens(slice, caps) {
        var fn = function (d, localeCode) {
            var hours = callDateGet(d, 'Hours');
            return getLocalization(localeCode)['ampm'][floor(hours / 12)] || '';
        };
        createFormatToken('t', fn, 1);
        createFormatToken('tt', fn);
        createFormatToken('T', fn, 1, 1);
        createFormatToken('TT', fn, null, 2);
    }
    function createWeekdayTokens(slice, caps) {
        var fn = function (d, localeCode) {
            var dow = callDateGet(d, 'Day');
            return getLocalization(localeCode)['weekdays'][dow];
        };
        createFormatToken('dow', fn, 3);
        createFormatToken('Dow', fn, 3, 1);
        createFormatToken('weekday', fn);
        createFormatToken('Weekday', fn, null, 1);
    }
    function createMonthTokens(slice, caps) {
        createMonthToken('mon', 0, 3);
        createMonthToken('month', 0);
        createMonthToken('month2', 1);
        createMonthToken('month3', 2);
    }
    function createMonthToken(token, multiplier, slice) {
        var fn = function (d, localeCode) {
            var month = callDateGet(d, 'Month');
            return getLocalization(localeCode)['months'][month + multiplier * 12];
        };
        createFormatToken(token, fn, slice);
        createFormatToken(simpleCapitalize(token), fn, slice, 1);
    }
    function createFormatToken(t, fn, slice, caps) {
        DateFormatTokens[t] = function (d, localeCode) {
            var str = fn(d, localeCode);
            if (slice)
                str = str.slice(0, slice);
            if (caps)
                str = str.slice(0, caps).toUpperCase() + str.slice(caps);
            return str;
        };
    }
    function createPaddedToken(t, fn, ms) {
        DateFormatTokens[t] = fn;
        DateFormatTokens[t + t] = function (d, localeCode) {
            return padNumber(fn(d, localeCode), 2);
        };
        if (ms) {
            DateFormatTokens[t + t + t] = function (d, localeCode) {
                return padNumber(fn(d, localeCode), 3);
            };
            DateFormatTokens[t + t + t + t] = function (d, localeCode) {
                return padNumber(fn(d, localeCode), 4);
            };
        }
    }
    function buildCompiledOutputFormat(format) {
        var match = format.match(/(\{\w+\})|[^{}]+/g);
        CompiledOutputFormats[format] = match.map(function (p) {
            p.replace(/\{(\w+)\}/, function (full, token) {
                p = DateFormatTokens[token] || token;
                return token;
            });
            return p;
        });
    }
    function executeCompiledOutputFormat(date, format, localeCode) {
        var compiledFormat, length, i, t, result = '';
        compiledFormat = CompiledOutputFormats[format];
        for (i = 0, length = compiledFormat.length; i < length; i++) {
            t = compiledFormat[i];
            result += isFunction(t) ? t(date, localeCode) : t;
        }
        return result;
    }
    function formatDate(date, format, relative, localeCode) {
        var adu;
        if (!date.isValid()) {
            return 'Invalid Date';
        } else if (Date[format]) {
            format = Date[format];
        } else if (isFunction(format)) {
            adu = getRelativeWithMonthFallback(date);
            format = format.apply(date, adu.concat(getLocalization(localeCode)));
        }
        if (!format && relative) {
            adu = adu || getRelativeWithMonthFallback(date);
            if (adu[1] === 0) {
                adu[1] = 1;
                adu[0] = 1;
            }
            return getLocalization(localeCode).getRelativeFormat(adu);
        }
        format = format || 'long';
        if (format === 'short' || format === 'long' || format === 'full') {
            format = getLocalization(localeCode)[format];
        }
        if (!CompiledOutputFormats[format]) {
            buildCompiledOutputFormat(format);
        }
        return executeCompiledOutputFormat(date, format, localeCode);
    }
    function compareDate(d, find, localeCode, buffer, forceUTC) {
        var p, t, min, max, override, capitalized, accuracy = 0, loBuffer = 0, hiBuffer = 0;
        p = getExtendedDate(find, localeCode, null, forceUTC);
        if (buffer > 0) {
            loBuffer = hiBuffer = buffer;
            override = true;
        }
        if (!p.date.isValid())
            return false;
        if (p.set && p.set.specificity) {
            DateUnits.forEach(function (u, i) {
                if (u.name === p.set.specificity) {
                    accuracy = u.multiplier(p.date, d - p.date) - 1;
                }
            });
            capitalized = simpleCapitalize(p.set.specificity);
            if (p.set['edge'] || p.set['shift']) {
                p.date['beginningOf' + capitalized]();
            }
            if (p.set.specificity === 'month') {
                max = p.date.clone()['endOf' + capitalized]().getTime();
            }
            if (!override && p.set['sign'] && p.set.specificity != 'millisecond') {
                loBuffer = 50;
                hiBuffer = -50;
            }
        }
        t = d.getTime();
        min = p.date.getTime();
        max = max || min + accuracy;
        max = compensateForTimezoneTraversal(d, min, max);
        return t >= min - loBuffer && t <= max + hiBuffer;
    }
    function compensateForTimezoneTraversal(d, min, max) {
        var dMin, dMax, minOffset, maxOffset;
        dMin = new date(min);
        dMax = new date(max).utc(d.isUTC());
        if (callDateGet(dMax, 'Hours') !== 23) {
            minOffset = dMin.getTimezoneOffset();
            maxOffset = dMax.getTimezoneOffset();
            if (minOffset !== maxOffset) {
                max += (maxOffset - minOffset).minutes();
            }
        }
        return max;
    }
    function updateDate(d, params, reset, advance, prefer) {
        var weekday, specificityIndex;
        function getParam(key) {
            return isDefined(params[key]) ? params[key] : params[key + 's'];
        }
        function paramExists(key) {
            return isDefined(getParam(key));
        }
        function uniqueParamExists(key, isDay) {
            return paramExists(key) || isDay && paramExists('weekday');
        }
        function canDisambiguate() {
            switch (prefer) {
            case -1:
                return d > getNewDate();
            case 1:
                return d < getNewDate();
            }
        }
        if (isNumber(params) && advance) {
            params = { 'milliseconds': params };
        } else if (isNumber(params)) {
            d.setTime(params);
            return d;
        }
        if (isDefined(params['date'])) {
            params['day'] = params['date'];
        }
        iterateOverDateUnits(function (name, unit, i) {
            var isDay = name === 'day';
            if (uniqueParamExists(name, isDay)) {
                params.specificity = name;
                specificityIndex = +i;
                return false;
            } else if (reset && name !== 'week' && (!isDay || !paramExists('week'))) {
                callDateSet(d, unit.method, isDay ? 1 : 0);
            }
        });
        DateUnits.forEach(function (u, i) {
            var name = u.name, method = u.method, higherUnit = DateUnits[i - 1], value;
            value = getParam(name);
            if (isUndefined(value))
                return;
            if (advance) {
                if (name === 'week') {
                    value = (params['day'] || 0) + value * 7;
                    method = 'Date';
                }
                value = value * advance + callDateGet(d, method);
            } else if (name === 'month' && paramExists('day')) {
                callDateSet(d, 'Date', 15);
            }
            callDateSet(d, method, value);
            if (advance && name === 'month') {
                checkMonthTraversal(d, value);
            }
        });
        if (!advance && !paramExists('day') && paramExists('weekday')) {
            var weekday = getParam('weekday'), isAhead, futurePreferred;
            d.setWeekday(weekday);
        }
        if (canDisambiguate()) {
            iterateOverDateUnits(function (name, unit) {
                var ambiguous = unit.ambiguous || name === 'week' && paramExists('weekday');
                if (ambiguous && !uniqueParamExists(name, name === 'day')) {
                    d[unit.addMethod](prefer);
                    return false;
                }
            }, specificityIndex + 1);
        }
        return d;
    }
    function prepareTime(format, loc, iso) {
        var timeSuffixMapping = {
                'h': 0,
                'm': 1,
                's': 2
            }, add;
        loc = loc || English;
        return format.replace(/{([a-z])}/g, function (full, token) {
            var separators = [], isHours = token === 'h', tokenIsRequired = isHours && !iso;
            if (token === 't') {
                return loc['ampm'].join('|');
            } else {
                if (isHours) {
                    separators.push(':');
                }
                if (add = loc['timeSuffixes'][timeSuffixMapping[token]]) {
                    separators.push(add + '\\s*');
                }
                return separators.length === 0 ? '' : '(?:' + separators.join('|') + ')' + (tokenIsRequired ? '' : '?');
            }
        });
    }
    function checkMonthTraversal(date, targetMonth) {
        if (targetMonth < 0) {
            targetMonth = targetMonth % 12 + 12;
        }
        if (targetMonth % 12 != callDateGet(date, 'Month')) {
            callDateSet(date, 'Date', 0);
        }
    }
    function createDate(args, prefer, forceUTC) {
        var f, localeCode;
        if (isNumber(args[1])) {
            f = collectDateArguments(args)[0];
        } else {
            f = args[0];
            localeCode = args[1];
        }
        return getExtendedDate(f, localeCode, prefer, forceUTC).date;
    }
    function invalidateDate(d) {
        d.setTime(NaN);
    }
    function buildDateUnits() {
        DateUnitsReversed = DateUnits.concat().reverse();
        DateArgumentUnits = DateUnits.concat();
        DateArgumentUnits.splice(2, 1);
    }
    function buildDateMethods() {
        extendSimilar(date, true, true, DateUnits, function (methods, u, i) {
            var name = u.name, caps = simpleCapitalize(name), multiplier = u.multiplier(), since, until;
            u.addMethod = 'add' + caps + 's';
            function applyErrorMargin(ms) {
                var num = ms / multiplier, fraction = num % 1, error = u.error || 0.999;
                if (fraction && abs(fraction % 1) > error) {
                    num = round(num);
                }
                return num < 0 ? ceil(num) : floor(num);
            }
            since = function (f, localeCode) {
                return applyErrorMargin(this.getTime() - date.create(f, localeCode).getTime());
            };
            until = function (f, localeCode) {
                return applyErrorMargin(date.create(f, localeCode).getTime() - this.getTime());
            };
            methods[name + 'sAgo'] = until;
            methods[name + 'sUntil'] = until;
            methods[name + 'sSince'] = since;
            methods[name + 'sFromNow'] = since;
            methods[u.addMethod] = function (num, reset) {
                var set = {};
                set[name] = num;
                return this.advance(set, reset);
            };
            buildNumberToDateAlias(u, multiplier);
            if (i < 3) {
                [
                    'Last',
                    'This',
                    'Next'
                ].forEach(function (shift) {
                    methods['is' + shift + caps] = function () {
                        return compareDate(this, shift + ' ' + name, 'en');
                    };
                });
            }
            if (i < 4) {
                methods['beginningOf' + caps] = function () {
                    var set = {};
                    switch (name) {
                    case 'year':
                        set['year'] = callDateGet(this, 'FullYear');
                        break;
                    case 'month':
                        set['month'] = callDateGet(this, 'Month');
                        break;
                    case 'day':
                        set['day'] = callDateGet(this, 'Date');
                        break;
                    case 'week':
                        set['weekday'] = 0;
                        break;
                    }
                    return this.set(set, true);
                };
                methods['endOf' + caps] = function () {
                    var set = {
                            'hours': 23,
                            'minutes': 59,
                            'seconds': 59,
                            'milliseconds': 999
                        };
                    switch (name) {
                    case 'year':
                        set['month'] = 11;
                        set['day'] = 31;
                        break;
                    case 'month':
                        set['day'] = this.daysInMonth();
                        break;
                    case 'week':
                        set['weekday'] = 6;
                        break;
                    }
                    return this.set(set, true);
                };
            }
        });
    }
    function buildCoreInputFormats() {
        English.addFormat('([+-])?(\\d{4,4})[-.]?{full_month}[-.]?(\\d{1,2})?', true, [
            'year_sign',
            'year',
            'month',
            'date'
        ], false, true);
        English.addFormat('(\\d{1,2})[-.\\/]{full_month}(?:[-.\\/](\\d{2,4}))?', true, [
            'date',
            'month',
            'year'
        ], true);
        English.addFormat('{full_month}[-.](\\d{4,4})', false, [
            'month',
            'year'
        ]);
        English.addFormat('\\/Date\\((\\d+(?:[+-]\\d{4,4})?)\\)\\/', false, ['timestamp']);
        English.addFormat(prepareTime(RequiredTime, English), false, TimeFormat);
        CoreDateFormats = English.compiledFormats.slice(0, 7).reverse();
        English.compiledFormats = English.compiledFormats.slice(7).concat(CoreDateFormats);
    }
    function buildFormatTokens() {
        createPaddedToken('f', function (d) {
            return callDateGet(d, 'Milliseconds');
        }, true);
        createPaddedToken('s', function (d) {
            return callDateGet(d, 'Seconds');
        });
        createPaddedToken('m', function (d) {
            return callDateGet(d, 'Minutes');
        });
        createPaddedToken('h', function (d) {
            return callDateGet(d, 'Hours') % 12 || 12;
        });
        createPaddedToken('H', function (d) {
            return callDateGet(d, 'Hours');
        });
        createPaddedToken('d', function (d) {
            return callDateGet(d, 'Date');
        });
        createPaddedToken('M', function (d) {
            return callDateGet(d, 'Month') + 1;
        });
        createMeridianTokens();
        createWeekdayTokens();
        createMonthTokens();
        DateFormatTokens['ms'] = DateFormatTokens['f'];
        DateFormatTokens['milliseconds'] = DateFormatTokens['f'];
        DateFormatTokens['seconds'] = DateFormatTokens['s'];
        DateFormatTokens['minutes'] = DateFormatTokens['m'];
        DateFormatTokens['hours'] = DateFormatTokens['h'];
        DateFormatTokens['24hr'] = DateFormatTokens['H'];
        DateFormatTokens['12hr'] = DateFormatTokens['h'];
        DateFormatTokens['date'] = DateFormatTokens['d'];
        DateFormatTokens['day'] = DateFormatTokens['d'];
        DateFormatTokens['year'] = DateFormatTokens['yyyy'];
    }
    function buildFormatShortcuts() {
        extendSimilar(date, true, true, 'short,long,full', function (methods, name) {
            methods[name] = function (localeCode) {
                return formatDate(this, name, false, localeCode);
            };
        });
    }
    function buildAsianDigits() {
        KanjiDigits.split('').forEach(function (digit, value) {
            var holder;
            if (value > 9) {
                value = pow(10, value - 9);
            }
            AsianDigitMap[digit] = value;
        });
        simpleMerge(AsianDigitMap, NumberNormalizeMap);
        AsianDigitReg = regexp('([\u671f\u9031\u5468])?([' + KanjiDigits + FullWidthDigits + ']+)(?!\u6628)', 'g');
    }
    function buildRelativeAliases() {
        var special = 'today,yesterday,tomorrow,weekday,weekend,future,past'.split(',');
        var weekdays = English['weekdays'].slice(0, 7);
        var months = English['months'].slice(0, 12);
        extendSimilar(date, true, true, special.concat(weekdays).concat(months), function (methods, name) {
            methods['is' + simpleCapitalize(name)] = function (utc) {
                return this.is(name, 0, utc);
            };
        });
    }
    function buildUTCAliases() {
        if (date['utc'])
            return;
        date['utc'] = {
            'create': function () {
                return createDate(arguments, 0, true);
            },
            'past': function () {
                return createDate(arguments, -1, true);
            },
            'future': function () {
                return createDate(arguments, 1, true);
            }
        };
    }
    function setDateProperties() {
        extend(date, false, true, {
            'RFC1123': '{Dow}, {dd} {Mon} {yyyy} {HH}:{mm}:{ss} {tz}',
            'RFC1036': '{Weekday}, {dd}-{Mon}-{yy} {HH}:{mm}:{ss} {tz}',
            'ISO8601_DATE': '{yyyy}-{MM}-{dd}',
            'ISO8601_DATETIME': '{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}.{fff}{isotz}'
        });
    }
    extend(date, false, true, {
        'create': function () {
            return createDate(arguments);
        },
        'past': function () {
            return createDate(arguments, -1);
        },
        'future': function () {
            return createDate(arguments, 1);
        },
        'addLocale': function (localeCode, set) {
            return setLocalization(localeCode, set);
        },
        'setLocale': function (localeCode, set) {
            var loc = getLocalization(localeCode, false);
            CurrentLocalization = loc;
            if (localeCode && localeCode != loc['code']) {
                loc['code'] = localeCode;
            }
            return loc;
        },
        'getLocale': function (localeCode) {
            return !localeCode ? CurrentLocalization : getLocalization(localeCode, false);
        },
        'addFormat': function (format, match, localeCode) {
            addDateInputFormat(getLocalization(localeCode), format, match);
        }
    });
    extend(date, true, true, {
        'set': function () {
            var args = collectDateArguments(arguments);
            return updateDate(this, args[0], args[1]);
        },
        'setWeekday': function (dow) {
            if (isUndefined(dow))
                return;
            return callDateSet(this, 'Date', callDateGet(this, 'Date') + dow - callDateGet(this, 'Day'));
        },
        'setISOWeek': function (week) {
            var weekday = callDateGet(this, 'Day') || 7;
            if (isUndefined(week))
                return;
            this.set({
                'month': 0,
                'date': 4
            });
            this.set({ 'weekday': 1 });
            if (week > 1) {
                this.addWeeks(week - 1);
            }
            if (weekday !== 1) {
                this.advance({ 'days': weekday - 1 });
            }
            return this.getTime();
        },
        'getISOWeek': function () {
            return getWeekNumber(this);
        },
        'beginningOfISOWeek': function () {
            var day = this.getDay();
            if (day === 0) {
                day = -6;
            } else if (day !== 1) {
                day = 1;
            }
            this.setWeekday(day);
            return this.reset();
        },
        'endOfISOWeek': function () {
            if (this.getDay() !== 0) {
                this.setWeekday(7);
            }
            return this.endOfDay();
        },
        'getUTCOffset': function (iso) {
            var offset = this._utc ? 0 : this.getTimezoneOffset();
            var colon = iso === true ? ':' : '';
            if (!offset && iso)
                return 'Z';
            return padNumber(floor(-offset / 60), 2, true) + colon + padNumber(abs(offset % 60), 2);
        },
        'utc': function (set) {
            defineProperty(this, '_utc', set === true || arguments.length === 0);
            return this;
        },
        'isUTC': function () {
            return !!this._utc || this.getTimezoneOffset() === 0;
        },
        'advance': function () {
            var args = collectDateArguments(arguments, true);
            return updateDate(this, args[0], args[1], 1);
        },
        'rewind': function () {
            var args = collectDateArguments(arguments, true);
            return updateDate(this, args[0], args[1], -1);
        },
        'isValid': function () {
            return !isNaN(this.getTime());
        },
        'isAfter': function (d, margin, utc) {
            return this.getTime() > date.create(d).getTime() - (margin || 0);
        },
        'isBefore': function (d, margin) {
            return this.getTime() < date.create(d).getTime() + (margin || 0);
        },
        'isBetween': function (d1, d2, margin) {
            var t = this.getTime();
            var t1 = date.create(d1).getTime();
            var t2 = date.create(d2).getTime();
            var lo = min(t1, t2);
            var hi = max(t1, t2);
            margin = margin || 0;
            return lo - margin < t && hi + margin > t;
        },
        'isLeapYear': function () {
            var year = callDateGet(this, 'FullYear');
            return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
        },
        'daysInMonth': function () {
            return 32 - callDateGet(new date(callDateGet(this, 'FullYear'), callDateGet(this, 'Month'), 32), 'Date');
        },
        'format': function (f, localeCode) {
            return formatDate(this, f, false, localeCode);
        },
        'relative': function (fn, localeCode) {
            if (isString(fn)) {
                localeCode = fn;
                fn = null;
            }
            return formatDate(this, fn, true, localeCode);
        },
        'is': function (d, margin, utc) {
            var tmp, comp;
            if (!this.isValid())
                return;
            if (isString(d)) {
                d = d.trim().toLowerCase();
                comp = this.clone().utc(utc);
                switch (true) {
                case d === 'future':
                    return this.getTime() > getNewDate().getTime();
                case d === 'past':
                    return this.getTime() < getNewDate().getTime();
                case d === 'weekday':
                    return callDateGet(comp, 'Day') > 0 && callDateGet(comp, 'Day') < 6;
                case d === 'weekend':
                    return callDateGet(comp, 'Day') === 0 || callDateGet(comp, 'Day') === 6;
                case (tmp = English['weekdays'].indexOf(d) % 7) > -1:
                    return callDateGet(comp, 'Day') === tmp;
                case (tmp = English['months'].indexOf(d) % 12) > -1:
                    return callDateGet(comp, 'Month') === tmp;
                }
            }
            return compareDate(this, d, null, margin, utc);
        },
        'reset': function (unit) {
            var params = {}, recognized;
            unit = unit || 'hours';
            if (unit === 'date')
                unit = 'days';
            recognized = DateUnits.some(function (u) {
                return unit === u.name || unit === u.name + 's';
            });
            params[unit] = unit.match(/^days?/) ? 1 : 0;
            return recognized ? this.set(params, true) : this;
        },
        'clone': function () {
            var d = new date(this.getTime());
            d.utc(!!this._utc);
            return d;
        }
    });
    extend(date, true, true, {
        'iso': function () {
            return this.toISOString();
        },
        'getWeekday': date.prototype.getDay,
        'getUTCWeekday': date.prototype.getUTCDay
    });
    function buildNumberToDateAlias(u, multiplier) {
        var name = u.name, methods = {};
        function base() {
            return round(this * multiplier);
        }
        function after() {
            return createDate(arguments)[u.addMethod](this);
        }
        function before() {
            return createDate(arguments)[u.addMethod](-this);
        }
        methods[name] = base;
        methods[name + 's'] = base;
        methods[name + 'Before'] = before;
        methods[name + 'sBefore'] = before;
        methods[name + 'Ago'] = before;
        methods[name + 'sAgo'] = before;
        methods[name + 'After'] = after;
        methods[name + 'sAfter'] = after;
        methods[name + 'FromNow'] = after;
        methods[name + 'sFromNow'] = after;
        number.extend(methods);
    }
    extend(number, true, true, {
        'duration': function (localeCode) {
            return getLocalization(localeCode).getDuration(this);
        }
    });
    English = CurrentLocalization = date.addLocale('en', {
        'plural': true,
        'timeMarker': 'at',
        'ampm': 'am,pm',
        'months': 'January,February,March,April,May,June,July,August,September,October,November,December',
        'weekdays': 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
        'units': 'millisecond:|s,second:|s,minute:|s,hour:|s,day:|s,week:|s,month:|s,year:|s',
        'numbers': 'one,two,three,four,five,six,seven,eight,nine,ten',
        'articles': 'a,an,the',
        'tokens': 'the,st|nd|rd|th,of',
        'short': '{Month} {d}, {yyyy}',
        'long': '{Month} {d}, {yyyy} {h}:{mm}{tt}',
        'full': '{Weekday} {Month} {d}, {yyyy} {h}:{mm}:{ss}{tt}',
        'past': '{num} {unit} {sign}',
        'future': '{num} {unit} {sign}',
        'duration': '{num} {unit}',
        'modifiers': [
            {
                'name': 'sign',
                'src': 'ago|before',
                'value': -1
            },
            {
                'name': 'sign',
                'src': 'from now|after|from|in|later',
                'value': 1
            },
            {
                'name': 'edge',
                'src': 'last day',
                'value': -2
            },
            {
                'name': 'edge',
                'src': 'end',
                'value': -1
            },
            {
                'name': 'edge',
                'src': 'first day|beginning',
                'value': 1
            },
            {
                'name': 'shift',
                'src': 'last',
                'value': -1
            },
            {
                'name': 'shift',
                'src': 'the|this',
                'value': 0
            },
            {
                'name': 'shift',
                'src': 'next',
                'value': 1
            }
        ],
        'dateParse': [
            '{month} {year}',
            '{shift} {unit=5-7}',
            '{0?} {date}{1}',
            '{0?} {edge} of {shift?} {unit=4-7?}{month?}{year?}'
        ],
        'timeParse': [
            '{num} {unit} {sign}',
            '{sign} {num} {unit}',
            '{0} {num}{1} {day} of {month} {year?}',
            '{weekday?} {month} {date}{1?} {year?}',
            '{date} {month} {year}',
            '{date} {month}',
            '{shift} {weekday}',
            '{shift} week {weekday}',
            '{weekday} {2?} {shift} week',
            '{num} {unit=4-5} {sign} {day}',
            '{0?} {date}{1} of {month}',
            '{0?}{month?} {date?}{1?} of {shift} {unit=6-7}'
        ]
    });
    buildDateUnits();
    buildDateMethods();
    buildCoreInputFormats();
    buildFormatTokens();
    buildFormatShortcuts();
    buildAsianDigits();
    buildRelativeAliases();
    buildUTCAliases();
    setDateProperties();
    function Range(start, end) {
        this.start = cloneRangeMember(start);
        this.end = cloneRangeMember(end);
    }
    ;
    function getRangeMemberNumericValue(m) {
        return isString(m) ? m.charCodeAt(0) : m;
    }
    function getRangeMemberPrimitiveValue(m) {
        if (m == null)
            return m;
        return isDate(m) ? m.getTime() : m.valueOf();
    }
    function cloneRangeMember(m) {
        if (isDate(m)) {
            return new date(m.getTime());
        } else {
            return getRangeMemberPrimitiveValue(m);
        }
    }
    function isValidRangeMember(m) {
        var val = getRangeMemberPrimitiveValue(m);
        return !!val || val === 0;
    }
    function getDuration(amt) {
        var match, val, unit;
        if (isNumber(amt)) {
            return amt;
        }
        match = amt.toLowerCase().match(/^(\d+)?\s?(\w+?)s?$/i);
        val = parseInt(match[1]) || 1;
        unit = match[2].slice(0, 1).toUpperCase() + match[2].slice(1);
        if (unit.match(/hour|minute|second/i)) {
            unit += 's';
        } else if (unit === 'Year') {
            unit = 'FullYear';
        } else if (unit === 'Day') {
            unit = 'Date';
        }
        return [
            val,
            unit
        ];
    }
    function incrementDate(current, amount) {
        var num, unit, val, d;
        if (isNumber(amount)) {
            return new date(current.getTime() + amount);
        }
        num = amount[0];
        unit = amount[1];
        val = callDateGet(current, unit);
        d = new date(current.getTime());
        callDateSet(d, unit, val + num);
        return d;
    }
    function incrementString(current, amount) {
        return string.fromCharCode(current.charCodeAt(0) + amount);
    }
    function incrementNumber(current, amount) {
        return current + amount;
    }
    Range.prototype.toString = function () {
        return this.isValid() ? this.start + '..' + this.end : 'Invalid Range';
    };
    extend(Range, true, true, {
        'isValid': function () {
            return isValidRangeMember(this.start) && isValidRangeMember(this.end) && typeof this.start === typeof this.end;
        },
        'span': function () {
            return this.isValid() ? abs(getRangeMemberNumericValue(this.end) - getRangeMemberNumericValue(this.start)) + 1 : NaN;
        },
        'contains': function (obj) {
            var self = this, arr;
            if (obj == null)
                return false;
            if (obj.start && obj.end) {
                return obj.start >= this.start && obj.start <= this.end && obj.end >= this.start && obj.end <= this.end;
            } else {
                return obj >= this.start && obj <= this.end;
            }
        },
        'every': function (amount, fn) {
            var increment, start = this.start, end = this.end, inverse = end < start, current = start, index = 0, result = [];
            if (isFunction(amount)) {
                fn = amount;
                amount = null;
            }
            amount = amount || 1;
            if (isNumber(start)) {
                increment = incrementNumber;
            } else if (isString(start)) {
                increment = incrementString;
            } else if (isDate(start)) {
                amount = getDuration(amount);
                increment = incrementDate;
            }
            if (inverse && amount > 0) {
                amount *= -1;
            }
            while (inverse ? current >= end : current <= end) {
                result.push(current);
                if (fn) {
                    fn(current, index);
                }
                current = increment(current, amount);
                index++;
            }
            return result;
        },
        'union': function (range) {
            return new Range(this.start < range.start ? this.start : range.start, this.end > range.end ? this.end : range.end);
        },
        'intersect': function (range) {
            if (range.start > this.end || range.end < this.start) {
                return new Range(NaN, NaN);
            }
            return new Range(this.start > range.start ? this.start : range.start, this.end < range.end ? this.end : range.end);
        },
        'clone': function (range) {
            return new Range(this.start, this.end);
        },
        'clamp': function (obj) {
            var clamped, start = this.start, end = this.end, min = end < start ? end : start, max = start > end ? start : end;
            if (obj < min) {
                clamped = min;
            } else if (obj > max) {
                clamped = max;
            } else {
                clamped = obj;
            }
            return cloneRangeMember(clamped);
        }
    });
    [
        number,
        string,
        date
    ].forEach(function (klass) {
        extend(klass, false, true, {
            'range': function (start, end) {
                if (klass.create) {
                    start = klass.create(start);
                    end = klass.create(end);
                }
                return new Range(start, end);
            }
        });
    });
    extend(number, true, true, {
        'upto': function (num, fn, step) {
            return number.range(this, num).every(step, fn);
        },
        'clamp': function (start, end) {
            return new Range(start, end).clamp(this);
        },
        'cap': function (max) {
            return this.clamp(Undefined, max);
        }
    });
    extend(number, true, true, { 'downto': number.prototype.upto });
    extend(array, false, function (a) {
        return a instanceof Range;
    }, {
        'create': function (range) {
            return range.every();
        }
    });
    function setDelay(fn, ms, after, scope, args) {
        if (ms === Infinity)
            return;
        if (!fn.timers)
            fn.timers = [];
        if (!isNumber(ms))
            ms = 1;
        fn._canceled = false;
        fn.timers.push(setTimeout(function () {
            if (!fn._canceled) {
                after.apply(scope, args || []);
            }
        }, ms));
    }
    extend(Function, true, true, {
        'lazy': function (ms, immediate, limit) {
            var fn = this, queue = [], locked = false, execute, rounded, perExecution, result;
            ms = ms || 1;
            limit = limit || Infinity;
            rounded = ceil(ms);
            perExecution = round(rounded / ms) || 1;
            execute = function () {
                var queueLength = queue.length, maxPerRound;
                if (queueLength == 0)
                    return;
                maxPerRound = max(queueLength - perExecution, 0);
                while (queueLength > maxPerRound) {
                    result = Function.prototype.apply.apply(fn, queue.shift());
                    queueLength--;
                }
                setDelay(lazy, rounded, function () {
                    locked = false;
                    execute();
                });
            };
            function lazy() {
                if (queue.length < limit - (locked && immediate ? 1 : 0)) {
                    queue.push([
                        this,
                        arguments
                    ]);
                }
                if (!locked) {
                    locked = true;
                    if (immediate) {
                        execute();
                    } else {
                        setDelay(lazy, rounded, execute);
                    }
                }
                return result;
            }
            return lazy;
        },
        'throttle': function (ms) {
            return this.lazy(ms, true, 1);
        },
        'debounce': function (ms) {
            var fn = this;
            function debounced() {
                debounced.cancel();
                setDelay(debounced, ms, fn, this, arguments);
            }
            ;
            return debounced;
        },
        'delay': function (ms) {
            var fn = this;
            var args = multiArgs(arguments, null, 1);
            setDelay(fn, ms, fn, fn, args);
            return fn;
        },
        'every': function (ms) {
            var fn = this, args = arguments;
            args = args.length > 1 ? multiArgs(args, null, 1) : [];
            function execute() {
                fn.apply(fn, args);
                setDelay(fn, ms, execute);
            }
            setDelay(fn, ms, execute);
            return fn;
        },
        'cancel': function () {
            var timers = this.timers, timer;
            if (isArray(timers)) {
                while (timer = timers.shift()) {
                    clearTimeout(timer);
                }
            }
            this._canceled = true;
            return this;
        },
        'after': function (num) {
            var fn = this, counter = 0, storedArguments = [];
            if (!isNumber(num)) {
                num = 1;
            } else if (num === 0) {
                fn.call();
                return fn;
            }
            return function () {
                var ret;
                storedArguments.push(multiArgs(arguments));
                counter++;
                if (counter == num) {
                    ret = fn.call(this, storedArguments);
                    counter = 0;
                    storedArguments = [];
                    return ret;
                }
            };
        },
        'once': function () {
            return this.throttle(Infinity, true);
        },
        'fill': function () {
            var fn = this, curried = multiArgs(arguments);
            return function () {
                var args = multiArgs(arguments);
                curried.forEach(function (arg, index) {
                    if (arg != null || index >= args.length)
                        args.splice(index, 0, arg);
                });
                return fn.apply(this, args);
            };
        }
    });
    function abbreviateNumber(num, roundTo, str, mid, limit, bytes) {
        var fixed = num.toFixed(20), decimalPlace = fixed.search(/\./), numeralPlace = fixed.search(/[1-9]/), significant = decimalPlace - numeralPlace, unit, i, divisor;
        if (significant > 0) {
            significant -= 1;
        }
        i = max(min(floor(significant / 3), limit === false ? str.length : limit), -mid);
        unit = str.charAt(i + mid - 1);
        if (significant < -9) {
            i = -3;
            roundTo = abs(significant) - 9;
            unit = str.slice(0, 1);
        }
        divisor = bytes ? pow(2, 10 * i) : pow(10, i * 3);
        return withPrecision(num / divisor, roundTo || 0).format() + unit.trim();
    }
    extend(number, false, true, {
        'random': function (n1, n2) {
            var minNum, maxNum;
            if (arguments.length == 1)
                n2 = n1, n1 = 0;
            minNum = min(n1 || 0, isUndefined(n2) ? 1 : n2);
            maxNum = max(n1 || 0, isUndefined(n2) ? 1 : n2) + 1;
            return floor(math.random() * (maxNum - minNum) + minNum);
        }
    });
    extend(number, true, true, {
        'log': function (base) {
            return math.log(this) / (base ? math.log(base) : 1);
        },
        'abbr': function (precision) {
            return abbreviateNumber(this, precision, 'kmbt', 0, 4);
        },
        'metric': function (precision, limit) {
            return abbreviateNumber(this, precision, 'n\u03bcm kMGTPE', 4, isUndefined(limit) ? 1 : limit);
        },
        'bytes': function (precision, limit) {
            return abbreviateNumber(this, precision, 'kMGTPE', 0, isUndefined(limit) ? 4 : limit, true) + 'B';
        },
        'isInteger': function () {
            return this % 1 == 0;
        },
        'isOdd': function () {
            return !isNaN(this) && !this.isMultipleOf(2);
        },
        'isEven': function () {
            return this.isMultipleOf(2);
        },
        'isMultipleOf': function (num) {
            return this % num === 0;
        },
        'format': function (place, thousands, decimal) {
            var i, str, split, integer, fraction, result = '';
            if (isUndefined(thousands)) {
                thousands = ',';
            }
            if (isUndefined(decimal)) {
                decimal = '.';
            }
            str = (isNumber(place) ? withPrecision(this, place || 0).toFixed(max(place, 0)) : this.toString()).replace(/^-/, '');
            split = str.split('.');
            integer = split[0];
            fraction = split[1];
            for (i = integer.length; i > 0; i -= 3) {
                if (i < integer.length) {
                    result = thousands + result;
                }
                result = integer.slice(max(0, i - 3), i) + result;
            }
            if (fraction) {
                result += decimal + repeatString('0', (place || 0) - fraction.length) + fraction;
            }
            return (this < 0 ? '-' : '') + result;
        },
        'hex': function (pad) {
            return this.pad(pad || 1, false, 16);
        },
        'times': function (fn) {
            if (fn) {
                for (var i = 0; i < this; i++) {
                    fn.call(this, i);
                }
            }
            return this.toNumber();
        },
        'chr': function () {
            return string.fromCharCode(this);
        },
        'pad': function (place, sign, base) {
            return padNumber(this, place, sign, base);
        },
        'ordinalize': function () {
            var suffix, num = abs(this), last = parseInt(num.toString().slice(-2));
            return this + getOrdinalizedSuffix(last);
        },
        'toNumber': function () {
            return parseFloat(this, 10);
        }
    });
    function buildNumber() {
        function createRoundingFunction(fn) {
            return function (precision) {
                return precision ? withPrecision(this, precision, fn) : fn(this);
            };
        }
        extend(number, true, true, {
            'ceil': createRoundingFunction(ceil),
            'round': createRoundingFunction(round),
            'floor': createRoundingFunction(floor)
        });
        extendSimilar(number, true, true, 'abs,pow,sin,asin,cos,acos,tan,atan,exp,pow,sqrt', function (methods, name) {
            methods[name] = function (a, b) {
                return math[name](this, a, b);
            };
        });
    }
    buildNumber();
    var ObjectTypeMethods = 'isObject,isNaN'.split(',');
    var ObjectHashMethods = 'keys,values,select,reject,each,merge,clone,equal,watch,tap,has,toQueryString'.split(',');
    function setParamsObject(obj, param, value, castBoolean) {
        var reg = /^(.+?)(\[.*\])$/, paramIsArray, match, allKeys, key;
        if (match = param.match(reg)) {
            key = match[1];
            allKeys = match[2].replace(/^\[|\]$/g, '').split('][');
            allKeys.forEach(function (k) {
                paramIsArray = !k || k.match(/^\d+$/);
                if (!key && isArray(obj))
                    key = obj.length;
                if (!hasOwnProperty(obj, key)) {
                    obj[key] = paramIsArray ? [] : {};
                }
                obj = obj[key];
                key = k;
            });
            if (!key && paramIsArray)
                key = obj.length.toString();
            setParamsObject(obj, key, value, castBoolean);
        } else if (castBoolean && value === 'true') {
            obj[param] = true;
        } else if (castBoolean && value === 'false') {
            obj[param] = false;
        } else {
            obj[param] = value;
        }
    }
    function objectToQueryString(base, obj) {
        var tmp;
        if (isArray(obj) || isObjectType(obj) && obj.toString === internalToString) {
            tmp = [];
            iterateOverObject(obj, function (key, value) {
                if (base) {
                    key = base + '[' + key + ']';
                }
                tmp.push(objectToQueryString(key, value));
            });
            return tmp.join('&');
        } else {
            if (!base)
                return '';
            return sanitizeURIComponent(base) + '=' + (isDate(obj) ? obj.getTime() : sanitizeURIComponent(obj));
        }
    }
    function sanitizeURIComponent(obj) {
        return !obj && obj !== false && obj !== 0 ? '' : encodeURIComponent(obj).replace(/%20/g, '+');
    }
    function matchInObject(match, key, value) {
        if (isRegExp(match)) {
            return match.test(key);
        } else if (isObjectType(match)) {
            return match[key] === value;
        } else {
            return key === string(match);
        }
    }
    function selectFromObject(obj, args, select) {
        var match, result = obj instanceof Hash ? new Hash() : {};
        iterateOverObject(obj, function (key, value) {
            match = false;
            flattenedArgs(args, function (arg) {
                if (matchInObject(arg, key, value)) {
                    match = true;
                }
            }, 1);
            if (match === select) {
                result[key] = value;
            }
        });
        return result;
    }
    function buildTypeMethods() {
        extendSimilar(object, false, true, ClassNames, function (methods, name) {
            var method = 'is' + name;
            ObjectTypeMethods.push(method);
            methods[method] = typeChecks[name];
        });
    }
    function buildObjectExtend() {
        extend(object, false, function () {
            return arguments.length === 0;
        }, {
            'extend': function () {
                var methods = ObjectTypeMethods.concat(ObjectHashMethods);
                if (typeof EnumerableMethods !== 'undefined') {
                    methods = methods.concat(EnumerableMethods);
                }
                buildObjectInstanceMethods(methods, object);
            }
        });
    }
    extend(object, false, true, {
        'watch': function (obj, prop, fn) {
            if (!definePropertySupport)
                return;
            var value = obj[prop];
            object.defineProperty(obj, prop, {
                'enumerable': true,
                'configurable': true,
                'get': function () {
                    return value;
                },
                'set': function (to) {
                    value = fn.call(obj, prop, value, to);
                }
            });
        }
    });
    extend(object, false, function () {
        return arguments.length > 1;
    }, {
        'keys': function (obj, fn) {
            var keys = object.keys(obj);
            keys.forEach(function (key) {
                fn.call(obj, key, obj[key]);
            });
            return keys;
        }
    });
    extend(object, false, true, {
        'isObject': function (obj) {
            return isPlainObject(obj);
        },
        'isNaN': function (obj) {
            return isNumber(obj) && obj.valueOf() !== obj.valueOf();
        },
        'equal': function (a, b) {
            return isEqual(a, b);
        },
        'extended': function (obj) {
            return new Hash(obj);
        },
        'merge': function (target, source, deep, resolve) {
            var key, sourceIsObject, targetIsObject, sourceVal, targetVal, conflict, result;
            if (target && typeof source !== 'string') {
                for (key in source) {
                    if (!hasOwnProperty(source, key) || !target)
                        continue;
                    sourceVal = source[key];
                    targetVal = target[key];
                    conflict = isDefined(targetVal);
                    sourceIsObject = isObjectType(sourceVal);
                    targetIsObject = isObjectType(targetVal);
                    result = conflict && resolve === false ? targetVal : sourceVal;
                    if (conflict) {
                        if (isFunction(resolve)) {
                            result = resolve.call(source, key, targetVal, sourceVal);
                        }
                    }
                    if (deep && (sourceIsObject || targetIsObject)) {
                        if (isDate(sourceVal)) {
                            result = new date(sourceVal.getTime());
                        } else if (isRegExp(sourceVal)) {
                            result = new regexp(sourceVal.source, getRegExpFlags(sourceVal));
                        } else {
                            if (!targetIsObject)
                                target[key] = array.isArray(sourceVal) ? [] : {};
                            object.merge(target[key], sourceVal, deep, resolve);
                            continue;
                        }
                    }
                    target[key] = result;
                }
            }
            return target;
        },
        'values': function (obj, fn) {
            var values = [];
            iterateOverObject(obj, function (k, v) {
                values.push(v);
                if (fn)
                    fn.call(obj, v);
            });
            return values;
        },
        'clone': function (obj, deep) {
            var target, klass;
            if (!isObjectType(obj)) {
                return obj;
            }
            klass = className(obj);
            if (isDate(obj, klass) && obj.clone) {
                return obj.clone();
            } else if (isDate(obj, klass) || isRegExp(obj, klass)) {
                return new obj.constructor(obj);
            } else if (obj instanceof Hash) {
                target = new Hash();
            } else if (isArray(obj, klass)) {
                target = [];
            } else if (isPlainObject(obj, klass)) {
                target = {};
            } else {
                throw new TypeError('Clone must be a basic data type.');
            }
            return object.merge(target, obj, deep);
        },
        'fromQueryString': function (str, castBoolean) {
            var result = object.extended(), split;
            str = str && str.toString ? str.toString() : '';
            str.replace(/^.*?\?/, '').split('&').forEach(function (p) {
                var split = p.split('=');
                if (split.length !== 2)
                    return;
                setParamsObject(result, split[0], decodeURIComponent(split[1]), castBoolean);
            });
            return result;
        },
        'toQueryString': function (obj, namespace) {
            return objectToQueryString(namespace, obj);
        },
        'tap': function (obj, arg) {
            var fn = arg;
            if (!isFunction(arg)) {
                fn = function () {
                    if (arg)
                        obj[arg]();
                };
            }
            fn.call(obj, obj);
            return obj;
        },
        'has': function (obj, key) {
            return hasOwnProperty(obj, key);
        },
        'select': function (obj) {
            return selectFromObject(obj, arguments, true);
        },
        'reject': function (obj) {
            return selectFromObject(obj, arguments, false);
        }
    });
    buildTypeMethods();
    buildObjectExtend();
    buildObjectInstanceMethods(ObjectHashMethods, Hash);
    extend(regexp, false, true, {
        'escape': function (str) {
            return escapeRegExp(str);
        }
    });
    extend(regexp, true, true, {
        'getFlags': function () {
            return getRegExpFlags(this);
        },
        'setFlags': function (flags) {
            return regexp(this.source, flags);
        },
        'addFlag': function (flag) {
            return this.setFlags(getRegExpFlags(this, flag));
        },
        'removeFlag': function (flag) {
            return this.setFlags(getRegExpFlags(this).replace(flag, ''));
        }
    });
    function getAcronym(word) {
        var inflector = string.Inflector;
        var word = inflector && inflector.acronyms[word];
        if (isString(word)) {
            return word;
        }
    }
    function checkRepeatRange(num) {
        num = +num;
        if (num < 0 || num === Infinity) {
            throw new RangeError('Invalid number');
        }
        return num;
    }
    function padString(num, padding) {
        return repeatString(isDefined(padding) ? padding : ' ', num);
    }
    function truncateString(str, length, from, ellipsis, split) {
        var str1, str2, len1, len2;
        if (str.length <= length) {
            return str.toString();
        }
        ellipsis = isUndefined(ellipsis) ? '...' : ellipsis;
        switch (from) {
        case 'left':
            str2 = split ? truncateOnWord(str, length, true) : str.slice(str.length - length);
            return ellipsis + str2;
        case 'middle':
            len1 = ceil(length / 2);
            len2 = floor(length / 2);
            str1 = split ? truncateOnWord(str, len1) : str.slice(0, len1);
            str2 = split ? truncateOnWord(str, len2, true) : str.slice(str.length - len2);
            return str1 + ellipsis + str2;
        default:
            str1 = split ? truncateOnWord(str, length) : str.slice(0, length);
            return str1 + ellipsis;
        }
    }
    function truncateOnWord(str, limit, fromLeft) {
        if (fromLeft) {
            return truncateOnWord(str.reverse(), limit).reverse();
        }
        var reg = regexp('(?=[' + getTrimmableCharacters() + '])');
        var words = str.split(reg);
        var count = 0;
        return words.filter(function (word) {
            count += word.length;
            return count <= limit;
        }).join('');
    }
    function numberOrIndex(str, n, from) {
        if (isString(n)) {
            n = str.indexOf(n);
            if (n === -1) {
                n = from ? str.length : 0;
            }
        }
        return n;
    }
    var btoa, atob;
    function buildBase64(key) {
        if (globalContext.btoa) {
            btoa = globalContext.btoa;
            atob = globalContext.atob;
            return;
        }
        var base64reg = /[^A-Za-z0-9\+\/\=]/g;
        btoa = function (str) {
            var output = '';
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            do {
                chr1 = str.charCodeAt(i++);
                chr2 = str.charCodeAt(i++);
                chr3 = str.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = (chr1 & 3) << 4 | chr2 >> 4;
                enc3 = (chr2 & 15) << 2 | chr3 >> 6;
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
                chr1 = chr2 = chr3 = '';
                enc1 = enc2 = enc3 = enc4 = '';
            } while (i < str.length);
            return output;
        };
        atob = function (input) {
            var output = '';
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            if (input.match(base64reg)) {
                throw new Error('String contains invalid base64 characters');
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
            do {
                enc1 = key.indexOf(input.charAt(i++));
                enc2 = key.indexOf(input.charAt(i++));
                enc3 = key.indexOf(input.charAt(i++));
                enc4 = key.indexOf(input.charAt(i++));
                chr1 = enc1 << 2 | enc2 >> 4;
                chr2 = (enc2 & 15) << 4 | enc3 >> 2;
                chr3 = (enc3 & 3) << 6 | enc4;
                output = output + chr(chr1);
                if (enc3 != 64) {
                    output = output + chr(chr2);
                }
                if (enc4 != 64) {
                    output = output + chr(chr3);
                }
                chr1 = chr2 = chr3 = '';
                enc1 = enc2 = enc3 = enc4 = '';
            } while (i < input.length);
            return output;
        };
    }
    extend(string, true, false, {
        'repeat': function (num) {
            num = checkRepeatRange(num);
            return repeatString(this, num);
        }
    });
    extend(string, true, function (reg) {
        return isRegExp(reg) || arguments.length > 2;
    }, {
        'startsWith': function (reg) {
            var args = arguments, pos = args[1], c = args[2], str = this, source;
            if (pos)
                str = str.slice(pos);
            if (isUndefined(c))
                c = true;
            source = isRegExp(reg) ? reg.source.replace('^', '') : escapeRegExp(reg);
            return regexp('^' + source, c ? '' : 'i').test(str);
        },
        'endsWith': function (reg) {
            var args = arguments, pos = args[1], c = args[2], str = this, source;
            if (isDefined(pos))
                str = str.slice(0, pos);
            if (isUndefined(c))
                c = true;
            source = isRegExp(reg) ? reg.source.replace('$', '') : escapeRegExp(reg);
            return regexp(source + '$', c ? '' : 'i').test(str);
        }
    });
    extend(string, true, true, {
        'escapeRegExp': function () {
            return escapeRegExp(this);
        },
        'escapeURL': function (param) {
            return param ? encodeURIComponent(this) : encodeURI(this);
        },
        'unescapeURL': function (param) {
            return param ? decodeURI(this) : decodeURIComponent(this);
        },
        'escapeHTML': function () {
            return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/\//g, '&#x2f;');
        },
        'unescapeHTML': function () {
            return this.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, '\'').replace(/&#x2f;/g, '/').replace(/&amp;/g, '&');
        },
        'encodeBase64': function () {
            return btoa(unescape(encodeURIComponent(this)));
        },
        'decodeBase64': function () {
            return decodeURIComponent(escape(atob(this)));
        },
        'each': function (search, fn) {
            var match, i, len;
            if (isFunction(search)) {
                fn = search;
                search = /[\s\S]/g;
            } else if (!search) {
                search = /[\s\S]/g;
            } else if (isString(search)) {
                search = regexp(escapeRegExp(search), 'gi');
            } else if (isRegExp(search)) {
                search = regexp(search.source, getRegExpFlags(search, 'g'));
            }
            match = this.match(search) || [];
            if (fn) {
                for (i = 0, len = match.length; i < len; i++) {
                    match[i] = fn.call(this, match[i], i, match) || match[i];
                }
            }
            return match;
        },
        'shift': function (n) {
            var result = '';
            n = n || 0;
            this.codes(function (c) {
                result += chr(c + n);
            });
            return result;
        },
        'codes': function (fn) {
            var codes = [], i, len;
            for (i = 0, len = this.length; i < len; i++) {
                var code = this.charCodeAt(i);
                codes.push(code);
                if (fn)
                    fn.call(this, code, i);
            }
            return codes;
        },
        'chars': function (fn) {
            return this.each(fn);
        },
        'words': function (fn) {
            return this.trim().each(/\S+/g, fn);
        },
        'lines': function (fn) {
            return this.trim().each(/^.*$/gm, fn);
        },
        'paragraphs': function (fn) {
            var paragraphs = this.trim().split(/[\r\n]{2,}/);
            paragraphs = paragraphs.map(function (p) {
                if (fn)
                    var s = fn.call(p);
                return s ? s : p;
            });
            return paragraphs;
        },
        'isBlank': function () {
            return this.trim().length === 0;
        },
        'has': function (find) {
            return this.search(isRegExp(find) ? find : escapeRegExp(find)) !== -1;
        },
        'add': function (str, index) {
            index = isUndefined(index) ? this.length : index;
            return this.slice(0, index) + str + this.slice(index);
        },
        'remove': function (f) {
            return this.replace(f, '');
        },
        'reverse': function () {
            return this.split('').reverse().join('');
        },
        'compact': function () {
            return this.trim().replace(/([\r\n\s　])+/g, function (match, whitespace) {
                return whitespace === '\u3000' ? whitespace : ' ';
            });
        },
        'at': function () {
            return getEntriesForIndexes(this, arguments, true);
        },
        'from': function (from) {
            return this.slice(numberOrIndex(this, from, true));
        },
        'to': function (to) {
            if (isUndefined(to))
                to = this.length;
            return this.slice(0, numberOrIndex(this, to));
        },
        'dasherize': function () {
            return this.underscore().replace(/_/g, '-');
        },
        'underscore': function () {
            return this.replace(/[-\s]+/g, '_').replace(string.Inflector && string.Inflector.acronymRegExp, function (acronym, index) {
                return (index > 0 ? '_' : '') + acronym.toLowerCase();
            }).replace(/([A-Z\d]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').toLowerCase();
        },
        'camelize': function (first) {
            return this.underscore().replace(/(^|_)([^_]+)/g, function (match, pre, word, index) {
                var acronym = getAcronym(word), capitalize = first !== false || index > 0;
                if (acronym)
                    return capitalize ? acronym : acronym.toLowerCase();
                return capitalize ? word.capitalize() : word;
            });
        },
        'spacify': function () {
            return this.underscore().replace(/_/g, ' ');
        },
        'stripTags': function () {
            var str = this, args = arguments.length > 0 ? arguments : [''];
            flattenedArgs(args, function (tag) {
                str = str.replace(regexp('</?' + escapeRegExp(tag) + '[^<>]*>', 'gi'), '');
            });
            return str;
        },
        'removeTags': function () {
            var str = this, args = arguments.length > 0 ? arguments : ['\\S+'];
            flattenedArgs(args, function (t) {
                var reg = regexp('<(' + t + ')[^<>]*(?:\\/>|>.*?<\\/\\1>)', 'gi');
                str = str.replace(reg, '');
            });
            return str;
        },
        'truncate': function (length, from, ellipsis) {
            return truncateString(this, length, from, ellipsis);
        },
        'truncateOnWord': function (length, from, ellipsis) {
            return truncateString(this, length, from, ellipsis, true);
        },
        'pad': function (num, padding) {
            var half, front, back;
            num = checkRepeatRange(num);
            half = max(0, num - this.length) / 2;
            front = floor(half);
            back = ceil(half);
            return padString(front, padding) + this + padString(back, padding);
        },
        'padLeft': function (num, padding) {
            num = checkRepeatRange(num);
            return padString(max(0, num - this.length), padding) + this;
        },
        'padRight': function (num, padding) {
            num = checkRepeatRange(num);
            return this + padString(max(0, num - this.length), padding);
        },
        'first': function (num) {
            if (isUndefined(num))
                num = 1;
            return this.substr(0, num);
        },
        'last': function (num) {
            if (isUndefined(num))
                num = 1;
            var start = this.length - num < 0 ? 0 : this.length - num;
            return this.substr(start);
        },
        'toNumber': function (base) {
            return stringToNumber(this, base);
        },
        'capitalize': function (all) {
            var lastResponded;
            return this.toLowerCase().replace(all ? /[^']/g : /^\S/, function (lower) {
                var upper = lower.toUpperCase(), result;
                result = lastResponded ? lower : upper;
                lastResponded = upper !== lower;
                return result;
            });
        },
        'assign': function () {
            var assign = {};
            flattenedArgs(arguments, function (a, i) {
                if (isObjectType(a)) {
                    simpleMerge(assign, a);
                } else {
                    assign[i + 1] = a;
                }
            });
            return this.replace(/\{([^{]+?)\}/g, function (m, key) {
                return hasOwnProperty(assign, key) ? assign[key] : m;
            });
        }
    });
    extend(string, true, true, { 'insert': string.prototype.add });
    buildBase64('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=');
    var plurals = [], singulars = [], uncountables = [], humans = [], acronyms = {}, Downcased, Inflector;
    function removeFromArray(arr, find) {
        var index = arr.indexOf(find);
        if (index > -1) {
            arr.splice(index, 1);
        }
    }
    function removeFromUncountablesAndAddTo(arr, rule, replacement) {
        if (isString(rule)) {
            removeFromArray(uncountables, rule);
        }
        removeFromArray(uncountables, replacement);
        arr.unshift({
            rule: rule,
            replacement: replacement
        });
    }
    function paramMatchesType(param, type) {
        return param == type || param == 'all' || !param;
    }
    function isUncountable(word) {
        return uncountables.some(function (uncountable) {
            return new regexp('\\b' + uncountable + '$', 'i').test(word);
        });
    }
    function inflect(word, pluralize) {
        word = isString(word) ? word.toString() : '';
        if (word.isBlank() || isUncountable(word)) {
            return word;
        } else {
            return runReplacements(word, pluralize ? plurals : singulars);
        }
    }
    function runReplacements(word, table) {
        iterateOverObject(table, function (i, inflection) {
            if (word.match(inflection.rule)) {
                word = word.replace(inflection.rule, inflection.replacement);
                return false;
            }
        });
        return word;
    }
    function capitalize(word) {
        return word.replace(/^\W*[a-z]/, function (w) {
            return w.toUpperCase();
        });
    }
    Inflector = {
        'acronym': function (word) {
            acronyms[word.toLowerCase()] = word;
            var all = object.keys(acronyms).map(function (key) {
                    return acronyms[key];
                });
            Inflector.acronymRegExp = regexp(all.join('|'), 'g');
        },
        'plural': function (rule, replacement) {
            removeFromUncountablesAndAddTo(plurals, rule, replacement);
        },
        'singular': function (rule, replacement) {
            removeFromUncountablesAndAddTo(singulars, rule, replacement);
        },
        'irregular': function (singular, plural) {
            var singularFirst = singular.first(), singularRest = singular.from(1), pluralFirst = plural.first(), pluralRest = plural.from(1), pluralFirstUpper = pluralFirst.toUpperCase(), pluralFirstLower = pluralFirst.toLowerCase(), singularFirstUpper = singularFirst.toUpperCase(), singularFirstLower = singularFirst.toLowerCase();
            removeFromArray(uncountables, singular);
            removeFromArray(uncountables, plural);
            if (singularFirstUpper == pluralFirstUpper) {
                Inflector.plural(new regexp('({1}){2}$'.assign(singularFirst, singularRest), 'i'), '$1' + pluralRest);
                Inflector.plural(new regexp('({1}){2}$'.assign(pluralFirst, pluralRest), 'i'), '$1' + pluralRest);
                Inflector.singular(new regexp('({1}){2}$'.assign(pluralFirst, pluralRest), 'i'), '$1' + singularRest);
            } else {
                Inflector.plural(new regexp('{1}{2}$'.assign(singularFirstUpper, singularRest)), pluralFirstUpper + pluralRest);
                Inflector.plural(new regexp('{1}{2}$'.assign(singularFirstLower, singularRest)), pluralFirstLower + pluralRest);
                Inflector.plural(new regexp('{1}{2}$'.assign(pluralFirstUpper, pluralRest)), pluralFirstUpper + pluralRest);
                Inflector.plural(new regexp('{1}{2}$'.assign(pluralFirstLower, pluralRest)), pluralFirstLower + pluralRest);
                Inflector.singular(new regexp('{1}{2}$'.assign(pluralFirstUpper, pluralRest)), singularFirstUpper + singularRest);
                Inflector.singular(new regexp('{1}{2}$'.assign(pluralFirstLower, pluralRest)), singularFirstLower + singularRest);
            }
        },
        'uncountable': function (first) {
            var add = array.isArray(first) ? first : multiArgs(arguments);
            uncountables = uncountables.concat(add);
        },
        'human': function (rule, replacement) {
            humans.unshift({
                rule: rule,
                replacement: replacement
            });
        },
        'clear': function (type) {
            if (paramMatchesType(type, 'singulars'))
                singulars = [];
            if (paramMatchesType(type, 'plurals'))
                plurals = [];
            if (paramMatchesType(type, 'uncountables'))
                uncountables = [];
            if (paramMatchesType(type, 'humans'))
                humans = [];
            if (paramMatchesType(type, 'acronyms'))
                acronyms = {};
        }
    };
    Downcased = [
        'and',
        'or',
        'nor',
        'a',
        'an',
        'the',
        'so',
        'but',
        'to',
        'of',
        'at',
        'by',
        'from',
        'into',
        'on',
        'onto',
        'off',
        'out',
        'in',
        'over',
        'with',
        'for'
    ];
    Inflector.plural(/$/, 's');
    Inflector.plural(/s$/gi, 's');
    Inflector.plural(/(ax|test)is$/gi, '$1es');
    Inflector.plural(/(octop|vir|fung|foc|radi|alumn)(i|us)$/gi, '$1i');
    Inflector.plural(/(census|alias|status)$/gi, '$1es');
    Inflector.plural(/(bu)s$/gi, '$1ses');
    Inflector.plural(/(buffal|tomat)o$/gi, '$1oes');
    Inflector.plural(/([ti])um$/gi, '$1a');
    Inflector.plural(/([ti])a$/gi, '$1a');
    Inflector.plural(/sis$/gi, 'ses');
    Inflector.plural(/f+e?$/gi, 'ves');
    Inflector.plural(/(cuff|roof)$/gi, '$1s');
    Inflector.plural(/([ht]ive)$/gi, '$1s');
    Inflector.plural(/([^aeiouy]o)$/gi, '$1es');
    Inflector.plural(/([^aeiouy]|qu)y$/gi, '$1ies');
    Inflector.plural(/(x|ch|ss|sh)$/gi, '$1es');
    Inflector.plural(/(matr|vert|ind)(?:ix|ex)$/gi, '$1ices');
    Inflector.plural(/([ml])ouse$/gi, '$1ice');
    Inflector.plural(/([ml])ice$/gi, '$1ice');
    Inflector.plural(/^(ox)$/gi, '$1en');
    Inflector.plural(/^(oxen)$/gi, '$1');
    Inflector.plural(/(quiz)$/gi, '$1zes');
    Inflector.plural(/(phot|cant|hom|zer|pian|portic|pr|quart|kimon)o$/gi, '$1os');
    Inflector.plural(/(craft)$/gi, '$1');
    Inflector.plural(/([ft])[eo]{2}(th?)$/gi, '$1ee$2');
    Inflector.singular(/s$/gi, '');
    Inflector.singular(/([pst][aiu]s)$/gi, '$1');
    Inflector.singular(/([aeiouy])ss$/gi, '$1ss');
    Inflector.singular(/(n)ews$/gi, '$1ews');
    Inflector.singular(/([ti])a$/gi, '$1um');
    Inflector.singular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/gi, '$1$2sis');
    Inflector.singular(/(^analy)ses$/gi, '$1sis');
    Inflector.singular(/(i)(f|ves)$/i, '$1fe');
    Inflector.singular(/([aeolr]f?)(f|ves)$/i, '$1f');
    Inflector.singular(/([ht]ive)s$/gi, '$1');
    Inflector.singular(/([^aeiouy]|qu)ies$/gi, '$1y');
    Inflector.singular(/(s)eries$/gi, '$1eries');
    Inflector.singular(/(m)ovies$/gi, '$1ovie');
    Inflector.singular(/(x|ch|ss|sh)es$/gi, '$1');
    Inflector.singular(/([ml])(ous|ic)e$/gi, '$1ouse');
    Inflector.singular(/(bus)(es)?$/gi, '$1');
    Inflector.singular(/(o)es$/gi, '$1');
    Inflector.singular(/(shoe)s?$/gi, '$1');
    Inflector.singular(/(cris|ax|test)[ie]s$/gi, '$1is');
    Inflector.singular(/(octop|vir|fung|foc|radi|alumn)(i|us)$/gi, '$1us');
    Inflector.singular(/(census|alias|status)(es)?$/gi, '$1');
    Inflector.singular(/^(ox)(en)?/gi, '$1');
    Inflector.singular(/(vert|ind)(ex|ices)$/gi, '$1ex');
    Inflector.singular(/(matr)(ix|ices)$/gi, '$1ix');
    Inflector.singular(/(quiz)(zes)?$/gi, '$1');
    Inflector.singular(/(database)s?$/gi, '$1');
    Inflector.singular(/ee(th?)$/gi, 'oo$1');
    Inflector.irregular('person', 'people');
    Inflector.irregular('man', 'men');
    Inflector.irregular('child', 'children');
    Inflector.irregular('sex', 'sexes');
    Inflector.irregular('move', 'moves');
    Inflector.irregular('save', 'saves');
    Inflector.irregular('cow', 'kine');
    Inflector.irregular('goose', 'geese');
    Inflector.irregular('zombie', 'zombies');
    Inflector.uncountable('equipment,information,rice,money,species,series,fish,sheep,jeans'.split(','));
    extend(string, true, true, {
        'pluralize': function () {
            return inflect(this, true);
        },
        'singularize': function () {
            return inflect(this, false);
        },
        'humanize': function () {
            var str = runReplacements(this, humans), acronym;
            str = str.replace(/_id$/g, '');
            str = str.replace(/(_)?([a-z\d]*)/gi, function (match, _, word) {
                acronym = hasOwnProperty(acronyms, word) ? acronyms[word] : null;
                return (_ ? ' ' : '') + (acronym || word.toLowerCase());
            });
            return capitalize(str);
        },
        'titleize': function () {
            var fullStopPunctuation = /[.:;!]$/, hasPunctuation, lastHadPunctuation, isFirstOrLast;
            return this.spacify().humanize().words(function (word, index, words) {
                hasPunctuation = fullStopPunctuation.test(word);
                isFirstOrLast = index == 0 || index == words.length - 1 || hasPunctuation || lastHadPunctuation;
                lastHadPunctuation = hasPunctuation;
                if (isFirstOrLast || Downcased.indexOf(word) === -1) {
                    return capitalize(word);
                } else {
                    return word;
                }
            }).join(' ');
        },
        'parameterize': function (separator) {
            var str = this;
            if (separator === undefined)
                separator = '-';
            if (str.normalize) {
                str = str.normalize();
            }
            str = str.replace(/[^a-z0-9\-_]+/gi, separator);
            if (separator) {
                str = str.replace(new regexp('^{sep}+|{sep}+$|({sep}){sep}+'.assign({ 'sep': escapeRegExp(separator) }), 'g'), '$1');
            }
            return encodeURI(str.toLowerCase());
        }
    });
    string.Inflector = Inflector;
    string.Inflector.acronyms = acronyms;
    var unicodeScripts = [
            {
                names: ['Arabic'],
                source: '\u0600-\u06ff'
            },
            {
                names: ['Cyrillic'],
                source: '\u0400-\u04ff'
            },
            {
                names: ['Devanagari'],
                source: '\u0900-\u097f'
            },
            {
                names: ['Greek'],
                source: '\u0370-\u03ff'
            },
            {
                names: ['Hangul'],
                source: '\uac00-\ud7af\u1100-\u11ff'
            },
            {
                names: [
                    'Han',
                    'Kanji'
                ],
                source: '\u4e00-\u9fff\uf900-\ufaff'
            },
            {
                names: ['Hebrew'],
                source: '\u0590-\u05ff'
            },
            {
                names: ['Hiragana'],
                source: '\u3040-\u309f\u30fb-\u30fc'
            },
            {
                names: ['Kana'],
                source: '\u3040-\u30ff\uff61-\uff9f'
            },
            {
                names: ['Katakana'],
                source: '\u30a0-\u30ff\uff61-\uff9f'
            },
            {
                names: ['Latin'],
                source: '\x01-\x7f\x80-\xff\u0100-\u017f\u0180-\u024f'
            },
            {
                names: ['Thai'],
                source: '\u0e00-\u0e7f'
            }
        ];
    function buildUnicodeScripts() {
        unicodeScripts.forEach(function (s) {
            var is = regexp('^[' + s.source + '\\s]+$');
            var has = regexp('[' + s.source + ']');
            s.names.forEach(function (name) {
                defineProperty(string.prototype, 'is' + name, function () {
                    return is.test(this.trim());
                });
                defineProperty(string.prototype, 'has' + name, function () {
                    return has.test(this);
                });
            });
        });
    }
    var HALF_WIDTH_TO_FULL_WIDTH_TRAVERSAL = 65248;
    var widthConversionRanges = [
            {
                type: 'a',
                start: 65,
                end: 90
            },
            {
                type: 'a',
                start: 97,
                end: 122
            },
            {
                type: 'n',
                start: 48,
                end: 57
            },
            {
                type: 'p',
                start: 33,
                end: 47
            },
            {
                type: 'p',
                start: 58,
                end: 64
            },
            {
                type: 'p',
                start: 91,
                end: 96
            },
            {
                type: 'p',
                start: 123,
                end: 126
            }
        ];
    var WidthConversionTable;
    var allHankaku = /[\u0020-\u00A5]|[\uFF61-\uFF9F][ﾞﾟ]?/g;
    var allZenkaku = /[\u3000-\u301C]|[\u301A-\u30FC]|[\uFF01-\uFF60]|[\uFFE0-\uFFE6]/g;
    var hankakuPunctuation = '\uff61\uff64\uff62\uff63\xa5\xa2\xa3';
    var zenkakuPunctuation = '\u3002\u3001\u300c\u300d\uffe5\uffe0\uffe1';
    var voicedKatakana = /[カキクケコサシスセソタチツテトハヒフヘホ]/;
    var semiVoicedKatakana = /[ハヒフヘホヲ]/;
    var hankakuKatakana = '\uff71\uff72\uff73\uff74\uff75\uff67\uff68\uff69\uff6a\uff6b\uff76\uff77\uff78\uff79\uff7a\uff7b\uff7c\uff7d\uff7e\uff7f\uff80\uff81\uff82\uff6f\uff83\uff84\uff85\uff86\uff87\uff88\uff89\uff8a\uff8b\uff8c\uff8d\uff8e\uff8f\uff90\uff91\uff92\uff93\uff94\uff6c\uff95\uff6d\uff96\uff6e\uff97\uff98\uff99\uff9a\uff9b\uff9c\uff66\uff9d\uff70\uff65';
    var zenkakuKatakana = '\u30a2\u30a4\u30a6\u30a8\u30aa\u30a1\u30a3\u30a5\u30a7\u30a9\u30ab\u30ad\u30af\u30b1\u30b3\u30b5\u30b7\u30b9\u30bb\u30bd\u30bf\u30c1\u30c4\u30c3\u30c6\u30c8\u30ca\u30cb\u30cc\u30cd\u30ce\u30cf\u30d2\u30d5\u30d8\u30db\u30de\u30df\u30e0\u30e1\u30e2\u30e4\u30e3\u30e6\u30e5\u30e8\u30e7\u30e9\u30ea\u30eb\u30ec\u30ed\u30ef\u30f2\u30f3\u30fc\u30fb';
    function convertCharacterWidth(str, args, reg, type) {
        if (!WidthConversionTable) {
            buildWidthConversionTables();
        }
        var mode = multiArgs(args).join(''), table = WidthConversionTable[type];
        mode = mode.replace(/all/, '').replace(/(\w)lphabet|umbers?|atakana|paces?|unctuation/g, '$1');
        return str.replace(reg, function (c) {
            if (table[c] && (!mode || mode.has(table[c].type))) {
                return table[c].to;
            } else {
                return c;
            }
        });
    }
    function buildWidthConversionTables() {
        var hankaku;
        WidthConversionTable = {
            'zenkaku': {},
            'hankaku': {}
        };
        widthConversionRanges.forEach(function (r) {
            simpleRepeat(r.end - r.start + 1, function (n) {
                n += r.start;
                setWidthConversion(r.type, chr(n), chr(n + HALF_WIDTH_TO_FULL_WIDTH_TRAVERSAL));
            });
        });
        zenkakuKatakana.each(function (c, i) {
            hankaku = hankakuKatakana.charAt(i);
            setWidthConversion('k', hankaku, c);
            if (c.match(voicedKatakana)) {
                setWidthConversion('k', hankaku + '\uff9e', c.shift(1));
            }
            if (c.match(semiVoicedKatakana)) {
                setWidthConversion('k', hankaku + '\uff9f', c.shift(2));
            }
        });
        zenkakuPunctuation.each(function (c, i) {
            setWidthConversion('p', hankakuPunctuation.charAt(i), c);
        });
        setWidthConversion('k', '\uff73\uff9e', '\u30f4');
        setWidthConversion('k', '\uff66\uff9e', '\u30fa');
        setWidthConversion('s', ' ', '\u3000');
    }
    function setWidthConversion(type, half, full) {
        WidthConversionTable['zenkaku'][half] = {
            type: type,
            to: full
        };
        WidthConversionTable['hankaku'][full] = {
            type: type,
            to: half
        };
    }
    extend(string, true, true, {
        'hankaku': function () {
            return convertCharacterWidth(this, arguments, allZenkaku, 'hankaku');
        },
        'zenkaku': function () {
            return convertCharacterWidth(this, arguments, allHankaku, 'zenkaku');
        },
        'hiragana': function (all) {
            var str = this;
            if (all !== false) {
                str = str.zenkaku('k');
            }
            return str.replace(/[\u30A1-\u30F6]/g, function (c) {
                return c.shift(-96);
            });
        },
        'katakana': function () {
            return this.replace(/[\u3041-\u3096]/g, function (c) {
                return c.shift(96);
            });
        }
    });
    buildUnicodeScripts();
    Date.addLocale('da', {
        'plural': true,
        'months': 'januar,februar,marts,april,maj,juni,juli,august,september,oktober,november,december',
        'weekdays': 's\xf8ndag|sondag,mandag,tirsdag,onsdag,torsdag,fredag,l\xf8rdag|lordag',
        'units': 'millisekund:|er,sekund:|er,minut:|ter,tim:e|er,dag:|e,ug:e|er|en,m\xe5ned:|er|en+maaned:|er|en,\xe5r:||et+aar:||et',
        'numbers': 'en|et,to,tre,fire,fem,seks,syv,otte,ni,ti',
        'tokens': 'den,for',
        'articles': 'den',
        'short': 'd. {d}. {month} {yyyy}',
        'long': 'den {d}. {month} {yyyy} {H}:{mm}',
        'full': '{Weekday} den {d}. {month} {yyyy} {H}:{mm}:{ss}',
        'past': '{num} {unit} {sign}',
        'future': '{sign} {num} {unit}',
        'duration': '{num} {unit}',
        'ampm': 'am,pm',
        'modifiers': [
            {
                'name': 'day',
                'src': 'forg\xe5rs|i forg\xe5rs|forgaars|i forgaars',
                'value': -2
            },
            {
                'name': 'day',
                'src': 'i g\xe5r|ig\xe5r|i gaar|igaar',
                'value': -1
            },
            {
                'name': 'day',
                'src': 'i dag|idag',
                'value': 0
            },
            {
                'name': 'day',
                'src': 'i morgen|imorgen',
                'value': 1
            },
            {
                'name': 'day',
                'src': 'over morgon|overmorgen|i over morgen|i overmorgen|iovermorgen',
                'value': 2
            },
            {
                'name': 'sign',
                'src': 'siden',
                'value': -1
            },
            {
                'name': 'sign',
                'src': 'om',
                'value': 1
            },
            {
                'name': 'shift',
                'src': 'i sidste|sidste',
                'value': -1
            },
            {
                'name': 'shift',
                'src': 'denne',
                'value': 0
            },
            {
                'name': 'shift',
                'src': 'n\xe6ste|naeste',
                'value': 1
            }
        ],
        'dateParse': [
            '{num} {unit} {sign}',
            '{sign} {num} {unit}',
            '{1?} {num} {unit} {sign}',
            '{shift} {unit=5-7}'
        ],
        'timeParse': [
            '{0?} {weekday?} {date?} {month} {year}',
            '{date} {month}',
            '{shift} {weekday}'
        ]
    });
    Date.addLocale('de', {
        'plural': true,
        'capitalizeUnit': true,
        'months': 'Januar,Februar,M\xe4rz|Marz,April,Mai,Juni,Juli,August,September,Oktober,November,Dezember',
        'weekdays': 'Sonntag,Montag,Dienstag,Mittwoch,Donnerstag,Freitag,Samstag',
        'units': 'Millisekunde:|n,Sekunde:|n,Minute:|n,Stunde:|n,Tag:|en,Woche:|n,Monat:|en,Jahr:|en',
        'numbers': 'ein:|e|er|en|em,zwei,drei,vier,fuenf,sechs,sieben,acht,neun,zehn',
        'tokens': 'der',
        'short': '{d}. {Month} {yyyy}',
        'long': '{d}. {Month} {yyyy} {H}:{mm}',
        'full': '{Weekday} {d}. {Month} {yyyy} {H}:{mm}:{ss}',
        'past': '{sign} {num} {unit}',
        'future': '{sign} {num} {unit}',
        'duration': '{num} {unit}',
        'timeMarker': 'um',
        'ampm': 'am,pm',
        'modifiers': [
            {
                'name': 'day',
                'src': 'vorgestern',
                'value': -2
            },
            {
                'name': 'day',
                'src': 'gestern',
                'value': -1
            },
            {
                'name': 'day',
                'src': 'heute',
                'value': 0
            },
            {
                'name': 'day',
                'src': 'morgen',
                'value': 1
            },
            {
                'name': 'day',
                'src': '\xfcbermorgen|ubermorgen|uebermorgen',
                'value': 2
            },
            {
                'name': 'sign',
                'src': 'vor:|her',
                'value': -1
            },
            {
                'name': 'sign',
                'src': 'in',
                'value': 1
            },
            {
                'name': 'shift',
                'src': 'letzte:|r|n|s',
                'value': -1
            },
            {
                'name': 'shift',
                'src': 'n\xe4chste:|r|n|s+nachste:|r|n|s+naechste:|r|n|s+kommende:n|r',
                'value': 1
            }
        ],
        'dateParse': [
            '{sign} {num} {unit}',
            '{num} {unit} {sign}',
            '{shift} {unit=5-7}'
        ],
        'timeParse': [
            '{weekday?} {date?} {month} {year?}',
            '{shift} {weekday}'
        ]
    });
    Date.addLocale('es', {
        'plural': true,
        'months': 'enero,febrero,marzo,abril,mayo,junio,julio,agosto,septiembre,octubre,noviembre,diciembre',
        'weekdays': 'domingo,lunes,martes,mi\xe9rcoles|miercoles,jueves,viernes,s\xe1bado|sabado',
        'units': 'milisegundo:|s,segundo:|s,minuto:|s,hora:|s,d\xeda|d\xedas|dia|dias,semana:|s,mes:|es,a\xf1o|a\xf1os|ano|anos',
        'numbers': 'uno,dos,tres,cuatro,cinco,seis,siete,ocho,nueve,diez',
        'tokens': 'el,la,de',
        'short': '{d} {month} {yyyy}',
        'long': '{d} {month} {yyyy} {H}:{mm}',
        'full': '{Weekday} {d} {month} {yyyy} {H}:{mm}:{ss}',
        'past': '{sign} {num} {unit}',
        'future': '{sign} {num} {unit}',
        'duration': '{num} {unit}',
        'timeMarker': 'a las',
        'ampm': 'am,pm',
        'modifiers': [
            {
                'name': 'day',
                'src': 'anteayer',
                'value': -2
            },
            {
                'name': 'day',
                'src': 'ayer',
                'value': -1
            },
            {
                'name': 'day',
                'src': 'hoy',
                'value': 0
            },
            {
                'name': 'day',
                'src': 'ma\xf1ana|manana',
                'value': 1
            },
            {
                'name': 'sign',
                'src': 'hace',
                'value': -1
            },
            {
                'name': 'sign',
                'src': 'dentro de',
                'value': 1
            },
            {
                'name': 'shift',
                'src': 'pasad:o|a',
                'value': -1
            },
            {
                'name': 'shift',
                'src': 'pr\xf3ximo|pr\xf3xima|proximo|proxima',
                'value': 1
            }
        ],
        'dateParse': [
            '{sign} {num} {unit}',
            '{num} {unit} {sign}',
            '{0?}{1?} {unit=5-7} {shift}',
            '{0?}{1?} {shift} {unit=5-7}'
        ],
        'timeParse': [
            '{shift} {weekday}',
            '{weekday} {shift}',
            '{date?} {2?} {month} {2?} {year?}'
        ]
    });
    Date.addLocale('fi', {
        'plural': true,
        'timeMarker': 'kello',
        'ampm': ',',
        'months': 'tammikuu,helmikuu,maaliskuu,huhtikuu,toukokuu,kes\xe4kuu,hein\xe4kuu,elokuu,syyskuu,lokakuu,marraskuu,joulukuu',
        'weekdays': 'sunnuntai,maanantai,tiistai,keskiviikko,torstai,perjantai,lauantai',
        'units': 'millisekun:ti|tia|teja|tina|nin,sekun:ti|tia|teja|tina|nin,minuut:ti|tia|teja|tina|in,tun:ti|tia|teja|tina|nin,p\xe4iv:\xe4|\xe4\xe4|i\xe4|\xe4n\xe4|\xe4n,viik:ko|koa|koja|on|kona,kuukau:si|sia|tta|den|tena,vuo:si|sia|tta|den|tena',
        'numbers': 'yksi|ensimm\xe4inen,kaksi|toinen,kolm:e|as,nelj\xe4:s,vii:si|des,kuu:si|des,seitsem\xe4:n|s,kahdeksa:n|s,yhdeks\xe4:n|s,kymmene:n|s',
        'articles': '',
        'optionals': '',
        'short': '{d}. {month}ta {yyyy}',
        'long': '{d}. {month}ta {yyyy} kello {H}.{mm}',
        'full': '{Weekday}na {d}. {month}ta {yyyy} kello {H}.{mm}',
        'relative': function (num, unit, ms, format) {
            var units = this['units'];
            function numberWithUnit(mult) {
                return (num === 1 ? '' : num + ' ') + units[8 * mult + unit];
            }
            switch (format) {
            case 'duration':
                return numberWithUnit(0);
            case 'past':
                return numberWithUnit(num > 1 ? 1 : 0) + ' sitten';
            case 'future':
                return numberWithUnit(4) + ' p\xe4\xe4st\xe4';
            }
        },
        'modifiers': [
            {
                'name': 'day',
                'src': 'toissa p\xe4iv\xe4n\xe4|toissa p\xe4iv\xe4ist\xe4',
                'value': -2
            },
            {
                'name': 'day',
                'src': 'eilen|eilist\xe4',
                'value': -1
            },
            {
                'name': 'day',
                'src': 't\xe4n\xe4\xe4n',
                'value': 0
            },
            {
                'name': 'day',
                'src': 'huomenna|huomista',
                'value': 1
            },
            {
                'name': 'day',
                'src': 'ylihuomenna|ylihuomista',
                'value': 2
            },
            {
                'name': 'sign',
                'src': 'sitten|aiemmin',
                'value': -1
            },
            {
                'name': 'sign',
                'src': 'p\xe4\xe4st\xe4|kuluttua|my\xf6hemmin',
                'value': 1
            },
            {
                'name': 'edge',
                'src': 'viimeinen|viimeisen\xe4',
                'value': -2
            },
            {
                'name': 'edge',
                'src': 'lopussa',
                'value': -1
            },
            {
                'name': 'edge',
                'src': 'ensimm\xe4inen|ensimm\xe4isen\xe4',
                'value': 1
            },
            {
                'name': 'shift',
                'src': 'edellinen|edellisen\xe4|edelt\xe4v\xe4|edelt\xe4v\xe4n\xe4|viime|toissa',
                'value': -1
            },
            {
                'name': 'shift',
                'src': 't\xe4n\xe4|t\xe4m\xe4n',
                'value': 0
            },
            {
                'name': 'shift',
                'src': 'seuraava|seuraavana|tuleva|tulevana|ensi',
                'value': 1
            }
        ],
        'dateParse': [
            '{num} {unit} {sign}',
            '{sign} {num} {unit}',
            '{num} {unit=4-5} {sign} {day}',
            '{month} {year}',
            '{shift} {unit=5-7}'
        ],
        'timeParse': [
            '{0} {num}{1} {day} of {month} {year?}',
            '{weekday?} {month} {date}{1} {year?}',
            '{date} {month} {year}',
            '{shift} {weekday}',
            '{shift} week {weekday}',
            '{weekday} {2} {shift} week',
            '{0} {date}{1} of {month}',
            '{0}{month?} {date?}{1} of {shift} {unit=6-7}'
        ]
    });
    Date.addLocale('fr', {
        'plural': true,
        'months': 'janvier,f\xe9vrier|fevrier,mars,avril,mai,juin,juillet,ao\xfbt,septembre,octobre,novembre,d\xe9cembre|decembre',
        'weekdays': 'dimanche,lundi,mardi,mercredi,jeudi,vendredi,samedi',
        'units': 'milliseconde:|s,seconde:|s,minute:|s,heure:|s,jour:|s,semaine:|s,mois,an:|s|n\xe9e|nee',
        'numbers': 'un:|e,deux,trois,quatre,cinq,six,sept,huit,neuf,dix',
        'tokens': 'l\'|la|le',
        'short': '{d} {month} {yyyy}',
        'long': '{d} {month} {yyyy} {H}:{mm}',
        'full': '{Weekday} {d} {month} {yyyy} {H}:{mm}:{ss}',
        'past': '{sign} {num} {unit}',
        'future': '{sign} {num} {unit}',
        'duration': '{num} {unit}',
        'timeMarker': '\xe0',
        'ampm': 'am,pm',
        'modifiers': [
            {
                'name': 'day',
                'src': 'hier',
                'value': -1
            },
            {
                'name': 'day',
                'src': 'aujourd\'hui',
                'value': 0
            },
            {
                'name': 'day',
                'src': 'demain',
                'value': 1
            },
            {
                'name': 'sign',
                'src': 'il y a',
                'value': -1
            },
            {
                'name': 'sign',
                'src': 'dans|d\'ici',
                'value': 1
            },
            {
                'name': 'shift',
                'src': 'derni:\xe8r|er|\xe8re|ere',
                'value': -1
            },
            {
                'name': 'shift',
                'src': 'prochain:|e',
                'value': 1
            }
        ],
        'dateParse': [
            '{sign} {num} {unit}',
            '{sign} {num} {unit}',
            '{0?} {unit=5-7} {shift}'
        ],
        'timeParse': [
            '{weekday?} {0?} {date?} {month} {year?}',
            '{0?} {weekday} {shift}'
        ]
    });
    Date.addLocale('it', {
        'plural': true,
        'months': 'Gennaio,Febbraio,Marzo,Aprile,Maggio,Giugno,Luglio,Agosto,Settembre,Ottobre,Novembre,Dicembre',
        'weekdays': 'Domenica,Luned:\xec|i,Marted:\xec|i,Mercoled:\xec|i,Gioved:\xec|i,Venerd:\xec|i,Sabato',
        'units': 'millisecond:o|i,second:o|i,minut:o|i,or:a|e,giorn:o|i,settiman:a|e,mes:e|i,ann:o|i',
        'numbers': 'un:|a|o|\',due,tre,quattro,cinque,sei,sette,otto,nove,dieci',
        'tokens': 'l\'|la|il',
        'short': '{d} {Month} {yyyy}',
        'long': '{d} {Month} {yyyy} {H}:{mm}',
        'full': '{Weekday} {d} {Month} {yyyy} {H}:{mm}:{ss}',
        'past': '{num} {unit} {sign}',
        'future': '{num} {unit} {sign}',
        'duration': '{num} {unit}',
        'timeMarker': 'alle',
        'ampm': 'am,pm',
        'modifiers': [
            {
                'name': 'day',
                'src': 'ieri',
                'value': -1
            },
            {
                'name': 'day',
                'src': 'oggi',
                'value': 0
            },
            {
                'name': 'day',
                'src': 'domani',
                'value': 1
            },
            {
                'name': 'day',
                'src': 'dopodomani',
                'value': 2
            },
            {
                'name': 'sign',
                'src': 'fa',
                'value': -1
            },
            {
                'name': 'sign',
                'src': 'da adesso',
                'value': 1
            },
            {
                'name': 'shift',
                'src': 'scors:o|a',
                'value': -1
            },
            {
                'name': 'shift',
                'src': 'prossim:o|a',
                'value': 1
            }
        ],
        'dateParse': [
            '{num} {unit} {sign}',
            '{0?} {unit=5-7} {shift}',
            '{0?} {shift} {unit=5-7}'
        ],
        'timeParse': [
            '{weekday?} {date?} {month} {year?}',
            '{shift} {weekday}'
        ]
    });
    Date.addLocale('ja', {
        'monthSuffix': '\u6708',
        'weekdays': '\u65e5\u66dc\u65e5,\u6708\u66dc\u65e5,\u706b\u66dc\u65e5,\u6c34\u66dc\u65e5,\u6728\u66dc\u65e5,\u91d1\u66dc\u65e5,\u571f\u66dc\u65e5',
        'units': '\u30df\u30ea\u79d2,\u79d2,\u5206,\u6642\u9593,\u65e5,\u9031\u9593|\u9031,\u30f6\u6708|\u30f5\u6708|\u6708,\u5e74',
        'short': '{yyyy}\u5e74{M}\u6708{d}\u65e5',
        'long': '{yyyy}\u5e74{M}\u6708{d}\u65e5 {H}\u6642{mm}\u5206',
        'full': '{yyyy}\u5e74{M}\u6708{d}\u65e5 {Weekday} {H}\u6642{mm}\u5206{ss}\u79d2',
        'past': '{num}{unit}{sign}',
        'future': '{num}{unit}{sign}',
        'duration': '{num}{unit}',
        'timeSuffixes': '\u6642,\u5206,\u79d2',
        'ampm': '\u5348\u524d,\u5348\u5f8c',
        'modifiers': [
            {
                'name': 'day',
                'src': '\u4e00\u6628\u65e5',
                'value': -2
            },
            {
                'name': 'day',
                'src': '\u6628\u65e5',
                'value': -1
            },
            {
                'name': 'day',
                'src': '\u4eca\u65e5',
                'value': 0
            },
            {
                'name': 'day',
                'src': '\u660e\u65e5',
                'value': 1
            },
            {
                'name': 'day',
                'src': '\u660e\u5f8c\u65e5',
                'value': 2
            },
            {
                'name': 'sign',
                'src': '\u524d',
                'value': -1
            },
            {
                'name': 'sign',
                'src': '\u5f8c',
                'value': 1
            },
            {
                'name': 'shift',
                'src': '\u53bb|\u5148',
                'value': -1
            },
            {
                'name': 'shift',
                'src': '\u6765',
                'value': 1
            }
        ],
        'dateParse': ['{num}{unit}{sign}'],
        'timeParse': [
            '{shift}{unit=5-7}{weekday?}',
            '{year}\u5e74{month?}\u6708?{date?}\u65e5?',
            '{month}\u6708{date?}\u65e5?',
            '{date}\u65e5'
        ]
    });
    Date.addLocale('ko', {
        'digitDate': true,
        'monthSuffix': '\uc6d4',
        'weekdays': '\uc77c\uc694\uc77c,\uc6d4\uc694\uc77c,\ud654\uc694\uc77c,\uc218\uc694\uc77c,\ubaa9\uc694\uc77c,\uae08\uc694\uc77c,\ud1a0\uc694\uc77c',
        'units': '\ubc00\ub9ac\ucd08,\ucd08,\ubd84,\uc2dc\uac04,\uc77c,\uc8fc,\uac1c\uc6d4|\ub2ec,\ub144',
        'numbers': '\uc77c|\ud55c,\uc774,\uc0bc,\uc0ac,\uc624,\uc721,\uce60,\ud314,\uad6c,\uc2ed',
        'short': '{yyyy}\ub144{M}\uc6d4{d}\uc77c',
        'long': '{yyyy}\ub144{M}\uc6d4{d}\uc77c {H}\uc2dc{mm}\ubd84',
        'full': '{yyyy}\ub144{M}\uc6d4{d}\uc77c {Weekday} {H}\uc2dc{mm}\ubd84{ss}\ucd08',
        'past': '{num}{unit} {sign}',
        'future': '{num}{unit} {sign}',
        'duration': '{num}{unit}',
        'timeSuffixes': '\uc2dc,\ubd84,\ucd08',
        'ampm': '\uc624\uc804,\uc624\ud6c4',
        'modifiers': [
            {
                'name': 'day',
                'src': '\uadf8\uc800\uaed8',
                'value': -2
            },
            {
                'name': 'day',
                'src': '\uc5b4\uc81c',
                'value': -1
            },
            {
                'name': 'day',
                'src': '\uc624\ub298',
                'value': 0
            },
            {
                'name': 'day',
                'src': '\ub0b4\uc77c',
                'value': 1
            },
            {
                'name': 'day',
                'src': '\ubaa8\ub808',
                'value': 2
            },
            {
                'name': 'sign',
                'src': '\uc804',
                'value': -1
            },
            {
                'name': 'sign',
                'src': '\ud6c4',
                'value': 1
            },
            {
                'name': 'shift',
                'src': '\uc9c0\ub09c|\uc791',
                'value': -1
            },
            {
                'name': 'shift',
                'src': '\uc774\ubc88',
                'value': 0
            },
            {
                'name': 'shift',
                'src': '\ub2e4\uc74c|\ub0b4',
                'value': 1
            }
        ],
        'dateParse': [
            '{num}{unit} {sign}',
            '{shift?} {unit=5-7}'
        ],
        'timeParse': [
            '{shift} {unit=5?} {weekday}',
            '{year}\ub144{month?}\uc6d4?{date?}\uc77c?',
            '{month}\uc6d4{date?}\uc77c?',
            '{date}\uc77c'
        ]
    });
    Date.addLocale('nl', {
        'plural': true,
        'months': 'januari,februari,maart,april,mei,juni,juli,augustus,september,oktober,november,december',
        'weekdays': 'zondag|zo,maandag|ma,dinsdag|di,woensdag|woe|wo,donderdag|do,vrijdag|vrij|vr,zaterdag|za',
        'units': 'milliseconde:|n,seconde:|n,minu:ut|ten,uur,dag:|en,we:ek|ken,maand:|en,jaar',
        'numbers': 'een,twee,drie,vier,vijf,zes,zeven,acht,negen',
        'tokens': '',
        'short': '{d} {Month} {yyyy}',
        'long': '{d} {Month} {yyyy} {H}:{mm}',
        'full': '{Weekday} {d} {Month} {yyyy} {H}:{mm}:{ss}',
        'past': '{num} {unit} {sign}',
        'future': '{num} {unit} {sign}',
        'duration': '{num} {unit}',
        'timeMarker': '\'s|om',
        'modifiers': [
            {
                'name': 'day',
                'src': 'gisteren',
                'value': -1
            },
            {
                'name': 'day',
                'src': 'vandaag',
                'value': 0
            },
            {
                'name': 'day',
                'src': 'morgen',
                'value': 1
            },
            {
                'name': 'day',
                'src': 'overmorgen',
                'value': 2
            },
            {
                'name': 'sign',
                'src': 'geleden',
                'value': -1
            },
            {
                'name': 'sign',
                'src': 'vanaf nu',
                'value': 1
            },
            {
                'name': 'shift',
                'src': 'laatste|vorige|afgelopen',
                'value': -1
            },
            {
                'name': 'shift',
                'src': 'volgend:|e',
                'value': 1
            }
        ],
        'dateParse': [
            '{num} {unit} {sign}',
            '{0?} {unit=5-7} {shift}',
            '{0?} {shift} {unit=5-7}'
        ],
        'timeParse': [
            '{weekday?} {date?} {month} {year?}',
            '{shift} {weekday}'
        ]
    });
    Date.addLocale('pl', {
        'plural': true,
        'months': 'Stycze\u0144|Stycznia,Luty|Lutego,Marzec|Marca,Kwiecie\u0144|Kwietnia,Maj|Maja,Czerwiec|Czerwca,Lipiec|Lipca,Sierpie\u0144|Sierpnia,Wrzesie\u0144|Wrze\u015bnia,Pa\u017adziernik|Pa\u017adziernika,Listopad|Listopada,Grudzie\u0144|Grudnia',
        'weekdays': 'Niedziela|Niedziel\u0119,Poniedzia\u0142ek,Wtorek,\u015arod:a|\u0119,Czwartek,Pi\u0105tek,Sobota|Sobot\u0119',
        'units': 'milisekund:a|y|,sekund:a|y|,minut:a|y|,godzin:a|y|,dzie\u0144|dni,tydzie\u0144|tygodnie|tygodni,miesi\u0105ce|miesi\u0105ce|miesi\u0119cy,rok|lata|lat',
        'numbers': 'jeden|jedn\u0105,dwa|dwie,trzy,cztery,pi\u0119\u0107,sze\u015b\u0107,siedem,osiem,dziewi\u0119\u0107,dziesi\u0119\u0107',
        'optionals': 'w|we,roku',
        'short': '{d} {Month} {yyyy}',
        'long': '{d} {Month} {yyyy} {H}:{mm}',
        'full': '{Weekday}, {d} {Month} {yyyy} {H}:{mm}:{ss}',
        'past': '{num} {unit} {sign}',
        'future': '{sign} {num} {unit}',
        'duration': '{num} {unit}',
        'timeMarker': 'o',
        'ampm': 'am,pm',
        'modifiers': [
            {
                'name': 'day',
                'src': 'przedwczoraj',
                'value': -2
            },
            {
                'name': 'day',
                'src': 'wczoraj',
                'value': -1
            },
            {
                'name': 'day',
                'src': 'dzisiaj|dzi\u015b',
                'value': 0
            },
            {
                'name': 'day',
                'src': 'jutro',
                'value': 1
            },
            {
                'name': 'day',
                'src': 'pojutrze',
                'value': 2
            },
            {
                'name': 'sign',
                'src': 'temu|przed',
                'value': -1
            },
            {
                'name': 'sign',
                'src': 'za',
                'value': 1
            },
            {
                'name': 'shift',
                'src': 'zesz\u0142y|zesz\u0142a|ostatni|ostatnia',
                'value': -1
            },
            {
                'name': 'shift',
                'src': 'nast\u0119pny|nast\u0119pna|nast\u0119pnego|przysz\u0142y|przysz\u0142a|przysz\u0142ego',
                'value': 1
            }
        ],
        'dateParse': [
            '{num} {unit} {sign}',
            '{sign} {num} {unit}',
            '{month} {year}',
            '{shift} {unit=5-7}',
            '{0} {shift?} {weekday}'
        ],
        'timeParse': [
            '{date} {month} {year?} {1}',
            '{0} {shift?} {weekday}'
        ]
    });
    Date.addLocale('pt', {
        'plural': true,
        'months': 'janeiro,fevereiro,mar\xe7o,abril,maio,junho,julho,agosto,setembro,outubro,novembro,dezembro',
        'weekdays': 'domingo,segunda-feira,ter\xe7a-feira,quarta-feira,quinta-feira,sexta-feira,s\xe1bado|sabado',
        'units': 'milisegundo:|s,segundo:|s,minuto:|s,hora:|s,dia:|s,semana:|s,m\xeas|m\xeases|mes|meses,ano:|s',
        'numbers': 'um,dois,tr\xeas|tres,quatro,cinco,seis,sete,oito,nove,dez,uma,duas',
        'tokens': 'a,de',
        'short': '{d} de {month} de {yyyy}',
        'long': '{d} de {month} de {yyyy} {H}:{mm}',
        'full': '{Weekday}, {d} de {month} de {yyyy} {H}:{mm}:{ss}',
        'past': '{num} {unit} {sign}',
        'future': '{sign} {num} {unit}',
        'duration': '{num} {unit}',
        'timeMarker': '\xe0s',
        'ampm': 'am,pm',
        'modifiers': [
            {
                'name': 'day',
                'src': 'anteontem',
                'value': -2
            },
            {
                'name': 'day',
                'src': 'ontem',
                'value': -1
            },
            {
                'name': 'day',
                'src': 'hoje',
                'value': 0
            },
            {
                'name': 'day',
                'src': 'amanh:\xe3|a',
                'value': 1
            },
            {
                'name': 'sign',
                'src': 'atr\xe1s|atras|h\xe1|ha',
                'value': -1
            },
            {
                'name': 'sign',
                'src': 'daqui a',
                'value': 1
            },
            {
                'name': 'shift',
                'src': 'passad:o|a',
                'value': -1
            },
            {
                'name': 'shift',
                'src': 'pr\xf3ximo|pr\xf3xima|proximo|proxima',
                'value': 1
            }
        ],
        'dateParse': [
            '{num} {unit} {sign}',
            '{sign} {num} {unit}',
            '{0?} {unit=5-7} {shift}',
            '{0?} {shift} {unit=5-7}'
        ],
        'timeParse': [
            '{date?} {1?} {month} {1?} {year?}',
            '{0?} {shift} {weekday}'
        ]
    });
    Date.addLocale('ru', {
        'months': '\u042f\u043d\u0432\u0430\u0440:\u044f|\u044c,\u0424\u0435\u0432\u0440\u0430\u043b:\u044f|\u044c,\u041c\u0430\u0440\u0442:\u0430|,\u0410\u043f\u0440\u0435\u043b:\u044f|\u044c,\u041c\u0430:\u044f|\u0439,\u0418\u044e\u043d:\u044f|\u044c,\u0418\u044e\u043b:\u044f|\u044c,\u0410\u0432\u0433\u0443\u0441\u0442:\u0430|,\u0421\u0435\u043d\u0442\u044f\u0431\u0440:\u044f|\u044c,\u041e\u043a\u0442\u044f\u0431\u0440:\u044f|\u044c,\u041d\u043e\u044f\u0431\u0440:\u044f|\u044c,\u0414\u0435\u043a\u0430\u0431\u0440:\u044f|\u044c',
        'weekdays': '\u0412\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435,\u041f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a,\u0412\u0442\u043e\u0440\u043d\u0438\u043a,\u0421\u0440\u0435\u0434\u0430,\u0427\u0435\u0442\u0432\u0435\u0440\u0433,\u041f\u044f\u0442\u043d\u0438\u0446\u0430,\u0421\u0443\u0431\u0431\u043e\u0442\u0430',
        'units': '\u043c\u0438\u043b\u043b\u0438\u0441\u0435\u043a\u0443\u043d\u0434:\u0430|\u0443|\u044b|,\u0441\u0435\u043a\u0443\u043d\u0434:\u0430|\u0443|\u044b|,\u043c\u0438\u043d\u0443\u0442:\u0430|\u0443|\u044b|,\u0447\u0430\u0441:||\u0430|\u043e\u0432,\u0434\u0435\u043d\u044c|\u0434\u0435\u043d\u044c|\u0434\u043d\u044f|\u0434\u043d\u0435\u0439,\u043d\u0435\u0434\u0435\u043b:\u044f|\u044e|\u0438|\u044c|\u0435,\u043c\u0435\u0441\u044f\u0446:||\u0430|\u0435\u0432|\u0435,\u0433\u043e\u0434|\u0433\u043e\u0434|\u0433\u043e\u0434\u0430|\u043b\u0435\u0442|\u0433\u043e\u0434\u0443',
        'numbers': '\u043e\u0434:\u0438\u043d|\u043d\u0443,\u0434\u0432:\u0430|\u0435,\u0442\u0440\u0438,\u0447\u0435\u0442\u044b\u0440\u0435,\u043f\u044f\u0442\u044c,\u0448\u0435\u0441\u0442\u044c,\u0441\u0435\u043c\u044c,\u0432\u043e\u0441\u0435\u043c\u044c,\u0434\u0435\u0432\u044f\u0442\u044c,\u0434\u0435\u0441\u044f\u0442\u044c',
        'tokens': '\u0432|\u043d\u0430,\u0433\u043e\u0434\u0430',
        'short': '{d} {month} {yyyy} \u0433\u043e\u0434\u0430',
        'long': '{d} {month} {yyyy} \u0433\u043e\u0434\u0430 {H}:{mm}',
        'full': '{Weekday} {d} {month} {yyyy} \u0433\u043e\u0434\u0430 {H}:{mm}:{ss}',
        'relative': function (num, unit, ms, format) {
            var numberWithUnit, last = num.toString().slice(-1), mult;
            switch (true) {
            case num >= 11 && num <= 15:
                mult = 3;
                break;
            case last == 1:
                mult = 1;
                break;
            case last >= 2 && last <= 4:
                mult = 2;
                break;
            default:
                mult = 3;
            }
            numberWithUnit = num + ' ' + this['units'][mult * 8 + unit];
            switch (format) {
            case 'duration':
                return numberWithUnit;
            case 'past':
                return numberWithUnit + ' \u043d\u0430\u0437\u0430\u0434';
            case 'future':
                return '\u0447\u0435\u0440\u0435\u0437 ' + numberWithUnit;
            }
        },
        'timeMarker': '\u0432',
        'ampm': ' \u0443\u0442\u0440\u0430, \u0432\u0435\u0447\u0435\u0440\u0430',
        'modifiers': [
            {
                'name': 'day',
                'src': '\u043f\u043e\u0437\u0430\u0432\u0447\u0435\u0440\u0430',
                'value': -2
            },
            {
                'name': 'day',
                'src': '\u0432\u0447\u0435\u0440\u0430',
                'value': -1
            },
            {
                'name': 'day',
                'src': '\u0441\u0435\u0433\u043e\u0434\u043d\u044f',
                'value': 0
            },
            {
                'name': 'day',
                'src': '\u0437\u0430\u0432\u0442\u0440\u0430',
                'value': 1
            },
            {
                'name': 'day',
                'src': '\u043f\u043e\u0441\u043b\u0435\u0437\u0430\u0432\u0442\u0440\u0430',
                'value': 2
            },
            {
                'name': 'sign',
                'src': '\u043d\u0430\u0437\u0430\u0434',
                'value': -1
            },
            {
                'name': 'sign',
                'src': '\u0447\u0435\u0440\u0435\u0437',
                'value': 1
            },
            {
                'name': 'shift',
                'src': '\u043f\u0440\u043e\u0448\u043b:\u044b\u0439|\u043e\u0439|\u043e\u043c',
                'value': -1
            },
            {
                'name': 'shift',
                'src': '\u0441\u043b\u0435\u0434\u0443\u044e\u0449:\u0438\u0439|\u0435\u0439|\u0435\u043c',
                'value': 1
            }
        ],
        'dateParse': [
            '{num} {unit} {sign}',
            '{sign} {num} {unit}',
            '{month} {year}',
            '{0?} {shift} {unit=5-7}'
        ],
        'timeParse': [
            '{date} {month} {year?} {1?}',
            '{0?} {shift} {weekday}'
        ]
    });
    Date.addLocale('sv', {
        'plural': true,
        'months': 'januari,februari,mars,april,maj,juni,juli,augusti,september,oktober,november,december',
        'weekdays': 's\xf6ndag|sondag,m\xe5ndag:|en+mandag:|en,tisdag,onsdag,torsdag,fredag,l\xf6rdag|lordag',
        'units': 'millisekund:|er,sekund:|er,minut:|er,timm:e|ar,dag:|ar,veck:a|or|an,m\xe5nad:|er|en+manad:|er|en,\xe5r:||et+ar:||et',
        'numbers': 'en|ett,tv\xe5|tva,tre,fyra,fem,sex,sju,\xe5tta|atta,nio,tio',
        'tokens': 'den,f\xf6r|for',
        'articles': 'den',
        'short': 'den {d} {month} {yyyy}',
        'long': 'den {d} {month} {yyyy} {H}:{mm}',
        'full': '{Weekday} den {d} {month} {yyyy} {H}:{mm}:{ss}',
        'past': '{num} {unit} {sign}',
        'future': '{sign} {num} {unit}',
        'duration': '{num} {unit}',
        'ampm': 'am,pm',
        'modifiers': [
            {
                'name': 'day',
                'src': 'f\xf6rrg\xe5r|i f\xf6rrg\xe5r|if\xf6rrg\xe5r|forrgar|i forrgar|iforrgar',
                'value': -2
            },
            {
                'name': 'day',
                'src': 'g\xe5r|i g\xe5r|ig\xe5r|gar|i gar|igar',
                'value': -1
            },
            {
                'name': 'day',
                'src': 'dag|i dag|idag',
                'value': 0
            },
            {
                'name': 'day',
                'src': 'morgon|i morgon|imorgon',
                'value': 1
            },
            {
                'name': 'day',
                'src': '\xf6ver morgon|\xf6vermorgon|i \xf6ver morgon|i \xf6vermorgon|i\xf6vermorgon|over morgon|overmorgon|i over morgon|i overmorgon|iovermorgon',
                'value': 2
            },
            {
                'name': 'sign',
                'src': 'sedan|sen',
                'value': -1
            },
            {
                'name': 'sign',
                'src': 'om',
                'value': 1
            },
            {
                'name': 'shift',
                'src': 'i f\xf6rra|f\xf6rra|i forra|forra',
                'value': -1
            },
            {
                'name': 'shift',
                'src': 'denna',
                'value': 0
            },
            {
                'name': 'shift',
                'src': 'n\xe4sta|nasta',
                'value': 1
            }
        ],
        'dateParse': [
            '{num} {unit} {sign}',
            '{sign} {num} {unit}',
            '{1?} {num} {unit} {sign}',
            '{shift} {unit=5-7}'
        ],
        'timeParse': [
            '{0?} {weekday?} {date?} {month} {year}',
            '{date} {month}',
            '{shift} {weekday}'
        ]
    });
    Date.addLocale('zh-CN', {
        'variant': true,
        'monthSuffix': '\u6708',
        'weekdays': '\u661f\u671f\u65e5|\u5468\u65e5,\u661f\u671f\u4e00|\u5468\u4e00,\u661f\u671f\u4e8c|\u5468\u4e8c,\u661f\u671f\u4e09|\u5468\u4e09,\u661f\u671f\u56db|\u5468\u56db,\u661f\u671f\u4e94|\u5468\u4e94,\u661f\u671f\u516d|\u5468\u516d',
        'units': '\u6beb\u79d2,\u79d2\u949f,\u5206\u949f,\u5c0f\u65f6,\u5929,\u4e2a\u661f\u671f|\u5468,\u4e2a\u6708,\u5e74',
        'tokens': '\u65e5|\u53f7',
        'short': '{yyyy}\u5e74{M}\u6708{d}\u65e5',
        'long': '{yyyy}\u5e74{M}\u6708{d}\u65e5 {tt}{h}:{mm}',
        'full': '{yyyy}\u5e74{M}\u6708{d}\u65e5 {weekday} {tt}{h}:{mm}:{ss}',
        'past': '{num}{unit}{sign}',
        'future': '{num}{unit}{sign}',
        'duration': '{num}{unit}',
        'timeSuffixes': '\u70b9|\u65f6,\u5206\u949f?,\u79d2',
        'ampm': '\u4e0a\u5348,\u4e0b\u5348',
        'modifiers': [
            {
                'name': 'day',
                'src': '\u524d\u5929',
                'value': -2
            },
            {
                'name': 'day',
                'src': '\u6628\u5929',
                'value': -1
            },
            {
                'name': 'day',
                'src': '\u4eca\u5929',
                'value': 0
            },
            {
                'name': 'day',
                'src': '\u660e\u5929',
                'value': 1
            },
            {
                'name': 'day',
                'src': '\u540e\u5929',
                'value': 2
            },
            {
                'name': 'sign',
                'src': '\u524d',
                'value': -1
            },
            {
                'name': 'sign',
                'src': '\u540e',
                'value': 1
            },
            {
                'name': 'shift',
                'src': '\u4e0a|\u53bb',
                'value': -1
            },
            {
                'name': 'shift',
                'src': '\u8fd9',
                'value': 0
            },
            {
                'name': 'shift',
                'src': '\u4e0b|\u660e',
                'value': 1
            }
        ],
        'dateParse': [
            '{num}{unit}{sign}',
            '{shift}{unit=5-7}'
        ],
        'timeParse': [
            '{shift}{weekday}',
            '{year}\u5e74{month?}\u6708?{date?}{0?}',
            '{month}\u6708{date?}{0?}',
            '{date}[\u65e5\u53f7]'
        ]
    });
    Date.addLocale('zh-TW', {
        'monthSuffix': '\u6708',
        'weekdays': '\u661f\u671f\u65e5|\u9031\u65e5,\u661f\u671f\u4e00|\u9031\u4e00,\u661f\u671f\u4e8c|\u9031\u4e8c,\u661f\u671f\u4e09|\u9031\u4e09,\u661f\u671f\u56db|\u9031\u56db,\u661f\u671f\u4e94|\u9031\u4e94,\u661f\u671f\u516d|\u9031\u516d',
        'units': '\u6beb\u79d2,\u79d2\u9418,\u5206\u9418,\u5c0f\u6642,\u5929,\u500b\u661f\u671f|\u9031,\u500b\u6708,\u5e74',
        'tokens': '\u65e5|\u865f',
        'short': '{yyyy}\u5e74{M}\u6708{d}\u65e5',
        'long': '{yyyy}\u5e74{M}\u6708{d}\u65e5 {tt}{h}:{mm}',
        'full': '{yyyy}\u5e74{M}\u6708{d}\u65e5 {Weekday} {tt}{h}:{mm}:{ss}',
        'past': '{num}{unit}{sign}',
        'future': '{num}{unit}{sign}',
        'duration': '{num}{unit}',
        'timeSuffixes': '\u9ede|\u6642,\u5206\u9418?,\u79d2',
        'ampm': '\u4e0a\u5348,\u4e0b\u5348',
        'modifiers': [
            {
                'name': 'day',
                'src': '\u524d\u5929',
                'value': -2
            },
            {
                'name': 'day',
                'src': '\u6628\u5929',
                'value': -1
            },
            {
                'name': 'day',
                'src': '\u4eca\u5929',
                'value': 0
            },
            {
                'name': 'day',
                'src': '\u660e\u5929',
                'value': 1
            },
            {
                'name': 'day',
                'src': '\u5f8c\u5929',
                'value': 2
            },
            {
                'name': 'sign',
                'src': '\u524d',
                'value': -1
            },
            {
                'name': 'sign',
                'src': '\u5f8c',
                'value': 1
            },
            {
                'name': 'shift',
                'src': '\u4e0a|\u53bb',
                'value': -1
            },
            {
                'name': 'shift',
                'src': '\u9019',
                'value': 0
            },
            {
                'name': 'shift',
                'src': '\u4e0b|\u660e',
                'value': 1
            }
        ],
        'dateParse': [
            '{num}{unit}{sign}',
            '{shift}{unit=5-7}'
        ],
        'timeParse': [
            '{shift}{weekday}',
            '{year}\u5e74{month?}\u6708?{date?}{0?}',
            '{month}\u6708{date?}{0?}',
            '{date}[\u65e5\u865f]'
        ]
    });
}.call(this));
});
require.define('129', function(module, exports, __dirname, __filename, undefined){
(function () {
    var CheckBox, Consent, Drawable, Markdown, Page, Stimulus, layout, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('72', module).Stimulus;
    Drawable = require('72', module).Drawable;
    layout = require('73', module);
    Markdown = require('96', module).Markdown;
    CheckBox = require('127', module).CheckBox;
    Page = require('98', module).Page;
    Consent = function (_super) {
        __extends(Consent, _super);
        function Consent(spec) {
            var outer;
            if (spec == null) {
                spec = {};
            }
            Consent.__super__.constructor.call(this, spec);
            if (this.spec.url.endsWith('.md')) {
                this.content = new Markdown({ url: this.spec.url });
            } else if (this.spec.url.endsWith('.html')) {
                this.content = new Page({ url: this.spec.url });
            }
            this.checkbox = new CheckBox({ label: 'I consent to participate in this study' });
            this.el = $(document.createElement('div'));
            (function (_this) {
                return function () {
                    var check;
                    _this.el.append(_this.content.element());
                    check = _this.checkbox.element();
                    return _this.el.append(check);
                };
            }(this).delay(2000));
            this.el.css('margin-bottom', '15px');
            outer = this;
            this.checkbox.on('checked', function () {
                console.log('received consent!');
                return outer.emit('consent');
            });
        }
        Consent.prototype.presentable = function (element) {
            return new (function (_super1) {
                __extends(_Class, _super1);
                function _Class(element) {
                    this.element = element;
                }
                _Class.prototype.x = function () {
                    return this.element.position().left;
                };
                _Class.prototype.y = function () {
                    return this.element.position().top;
                };
                _Class.prototype.width = function () {
                    return this.element.width();
                };
                _Class.prototype.height = function () {
                    return this.element.height();
                };
                _Class.prototype.present = function (context) {
                    context.appendHtml(this.element);
                    return this.element.show();
                };
                return _Class;
            }(Drawable))(element);
        };
        Consent.prototype.render = function (context) {
            return this.presentable(this.el);
        };
        return Consent;
    }(Stimulus);
    exports.Consent = Consent;
}.call(this));
});
require.define('132', function(module, exports, __dirname, __filename, undefined){
(function () {
    var TextField, html, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('76', module);
    TextField = function (_super) {
        __extends(TextField, _super);
        function TextField() {
            return TextField.__super__.constructor.apply(this, arguments);
        }
        TextField.prototype.defaults = {
            placeholder: '',
            icon: '',
            'class': ''
        };
        TextField.prototype.signals = ['change'];
        TextField.prototype.initialize = function () {
            var outer, placeholder;
            outer = this;
            this.el = this.div();
            this.el.addClass('ui input');
            placeholder = this.spec.placeholder;
            this.input = $('<input type="text" placeholder="' + placeholder + '">  ');
            this.el.append(this.input);
            this.el.addClass(this.spec['class']);
            outer = this;
            return this.input.on('change', function () {
                var content;
                content = void 0;
                content = $(this).val();
                return outer.emit('change', {
                    id: outer.id,
                    val: content,
                    source: outer,
                    name: outer.name
                });
            });
        };
        return TextField;
    }(html.HtmlStimulus);
    exports.TextField = TextField;
}.call(this));
});
require.define('133', function(module, exports, __dirname, __filename, undefined){
(function () {
    var DropDown, html, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('76', module);
    DropDown = function (_super) {
        __extends(DropDown, _super);
        DropDown.prototype.defaults = {
            choices: [
                'male',
                'female'
            ],
            name: ''
        };
        DropDown.prototype.signals = ['change'];
        function DropDown(spec) {
            if (spec == null) {
                spec = {};
            }
            DropDown.__super__.constructor.call(this, spec);
        }
        DropDown.prototype.initialize = function () {
            var choice, defaultText, icon, item, menu, outer, _i, _len, _ref;
            this.el = this.div();
            this.el.addClass('ui selection dropdown');
            this.input = $('<input type="hidden" name="' + this.spec.name + '">');
            defaultText = this.div().text(this.spec.name).addClass('default text');
            icon = $('<i class="dropdown icon"></i>');
            menu = this.div().addClass('menu');
            _ref = this.spec.choices;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                choice = _ref[_i];
                item = this.div();
                item.addClass('item');
                item.attr('data-value', choice);
                item.text(choice);
                menu.append(item);
            }
            this.el.append(this.input);
            this.el.append(defaultText);
            this.el.append(icon);
            this.el.append(menu);
            outer = this;
            return this.el.dropdown({
                onChange: function (newval) {
                    return outer.emit('change', {
                        id: outer.id,
                        val: newval,
                        source: outer,
                        name: outer.name
                    });
                }
            });
        };
        return DropDown;
    }(html.HtmlStimulus);
    exports.DropDown = DropDown;
}.call(this));
});
require.define('134', function(module, exports, __dirname, __filename, undefined){
(function () {
    var MultiChoice, div, html, input, label, p, render, table, td, tr, _, _ref, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('76', module);
    _ = require('16', module);
    _ref = require('61', module), render = _ref.render, div = _ref.div, p = _ref.p, td = _ref.td, tr = _ref.tr, table = _ref.table, input = _ref.input, label = _ref.label;
    MultiChoice = function (_super) {
        __extends(MultiChoice, _super);
        MultiChoice.prototype.defaults = {
            choices: [
                '1',
                '2',
                '3',
                '4'
            ]
        };
        MultiChoice.prototype.signals = ['change'];
        MultiChoice.prototype.renderForm = function () {
            var form, outer;
            outer = this;
            form = render(function (_this) {
                return function () {
                    var spec;
                    spec = _this.spec;
                    return div('#multichoice.ui.form', function () {
                        return div('.grouped.inline.fields', function () {
                            var choice, _i, _len, _ref1, _results;
                            _ref1 = spec.choices;
                            _results = [];
                            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                                choice = _ref1[_i];
                                _results.push(div('.field', function () {
                                    return div('.ui.radio.checkbox', function () {
                                        input('#' + choice, {
                                            type: 'radio',
                                            name: 'multichoice_' + outer.id,
                                            id: choice
                                        });
                                        return label(choice);
                                    });
                                }));
                            }
                            return _results;
                        });
                    });
                };
            }(this));
            return $(form);
        };
        function MultiChoice(spec) {
            if (spec == null) {
                spec = {};
            }
            MultiChoice.__super__.constructor.call(this, spec);
            if (_.unique(this.spec.choices).length !== this.spec.choices.length) {
                throw new Error('MultiChoice: no duplicate elements allowed in \'choices\' argument');
            }
        }
        MultiChoice.prototype.initialize = function () {
            var outer;
            outer = this;
            this.el = this.div();
            this.form = this.renderForm();
            this.el.append(this.form);
            return this.el.find('.ui.radio.checkbox').checkbox({
                onChange: function () {
                    return outer.emit('change', $(this).attr('id'));
                }
            });
        };
        return MultiChoice;
    }(html.HtmlStimulus);
    exports.MultiChoice = MultiChoice;
}.call(this));
});
require.define('135', function(module, exports, __dirname, __filename, undefined){
(function () {
    var DropDown, MultiChoice, Question, TextField, div, h4, html, input, label, p, render, table, td, tr, _ref, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('76', module);
    DropDown = require('133', module).DropDown;
    MultiChoice = require('134', module).MultiChoice;
    TextField = require('132', module).TextField;
    _ref = require('61', module), render = _ref.render, div = _ref.div, p = _ref.p, td = _ref.td, tr = _ref.tr, table = _ref.table, input = _ref.input, label = _ref.label, h4 = _ref.h4;
    Question = function (_super) {
        __extends(Question, _super);
        Question.prototype.defaults = {
            question: 'What is your name?',
            type: 'dropdown',
            paddingBottom: 15,
            headerSize: 'huge',
            headerFontColor: 'black',
            headerInverted: true
        };
        Question.prototype.inputElement = function () {
            switch (this.spec.type) {
            case 'dropdown':
                return new DropDown(this.spec);
            case 'multichoice':
                return new MultiChoice(this.spec);
            case 'textfield':
                return new TextField(this.spec);
            default:
                throw new Error('Question: illegal type argument --  ' + this.spec.type);
            }
        };
        Question.prototype.hasChildren = function () {
            return true;
        };
        Question.prototype.getChildren = function () {
            return [this.question];
        };
        function Question(spec) {
            if (spec == null) {
                spec = {};
            }
            Question.__super__.constructor.call(this, spec);
        }
        Question.prototype.addReaction = function (name, fun, selector) {
            if (selector == null) {
                return this.question.on(name, fun);
            } else {
                if (selector.id === this.id) {
                    return this.question.on(name, fun);
                }
            }
        };
        Question.prototype.initialize = function () {
            var content, hclass, headerClass;
            this.el = this.div();
            this.question = this.inputElement();
            headerClass = function (_this) {
                return function () {
                    var header;
                    header = 'ui ' + _this.spec.headerSize + ' top attached ' + _this.spec.headerFontColor;
                    if (_this.spec.headerInverted) {
                        return header = header + ' inverted block header';
                    } else {
                        return header = header + ' block header';
                    }
                };
            }(this);
            hclass = headerClass();
            this.title = $('<h4 class="' + hclass + '">').text(this.spec.question);
            this.segment = $('<div class="ui segment attached">');
            content = this.question.el;
            console.log('content is', content);
            this.segment.append(content);
            this.el.append(this.title);
            this.el.append(this.segment);
            this.el.css('width', '95%');
            return this.el.css('padding-bottom', this.spec.paddingBottom + 'px');
        };
        return Question;
    }(html.HtmlStimulus);
    exports.Question = Question;
}.call(this));
});
require.define('136', function(module, exports, __dirname, __filename, undefined){
exports.get = function (obj, path) {
    var parsed = exports.parse(path);
    return getPathValue(parsed, obj);
};
exports.set = function (obj, path, val) {
    var parsed = exports.parse(path);
    setPathValue(parsed, val, obj);
};
exports.parse = function (path) {
    var str = (path || '').replace(/\[/g, '.[');
    var parts = str.match(/(\\\.|[^.]+?)+/g);
    return parts.map(function (value) {
        var re = /\[(\d+)\]$/, mArr = re.exec(value);
        if (mArr)
            return { i: parseFloat(mArr[1]) };
        else
            return { p: value };
    });
};
function getPathValue(parsed, obj) {
    var tmp = obj;
    var res;
    for (var i = 0, l = parsed.length; i < l; i++) {
        var part = parsed[i];
        if (tmp) {
            if (defined(part.p))
                tmp = tmp[part.p];
            else if (defined(part.i))
                tmp = tmp[part.i];
            if (i == l - 1)
                res = tmp;
        } else {
            res = undefined;
        }
    }
    return res;
}
;
function setPathValue(parsed, val, obj) {
    var tmp = obj;
    var i = 0;
    var l = parsed.length;
    var part;
    for (; i < l; i++) {
        part = parsed[i];
        if (defined(tmp) && i == l - 1) {
            var x = defined(part.p) ? part.p : part.i;
            tmp[x] = val;
        } else if (defined(tmp)) {
            if (defined(part.p) && tmp[part.p]) {
                tmp = tmp[part.p];
            } else if (defined(part.i) && tmp[part.i]) {
                tmp = tmp[part.i];
            } else {
                var next = parsed[i + 1];
                var x = defined(part.p) ? part.p : part.i;
                var y = defined(next.p) ? {} : [];
                tmp[x] = y;
                tmp = tmp[x];
            }
        } else {
            if (i == l - 1)
                tmp = val;
            else if (defined(part.p))
                tmp = {};
            else if (defined(part.i))
                tmp = [];
        }
    }
}
;
function defined(val) {
    return !(!val && 'undefined' === typeof val);
}
});
require.define('137', function(module, exports, __dirname, __filename, undefined){
(function () {
    var ButtonGroup, html, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('76', module);
    _ = require('16', module);
    ButtonGroup = function (_super) {
        __extends(ButtonGroup, _super);
        ButtonGroup.prototype.description = 'An set of html button aligned in a row or column.';
        ButtonGroup.prototype.defaults = {
            labels: [],
            margin: 2,
            size: 'large'
        };
        ButtonGroup.prototype.signals = ['clicked'];
        function ButtonGroup(spec) {
            if (spec == null) {
                spec = {};
            }
            ButtonGroup.__super__.constructor.call(this, spec);
        }
        ButtonGroup.prototype.initialize = function () {
            var outer;
            ButtonGroup.__super__.initialize.call(this);
            this.el = this.div();
            this.el.addClass(this.spec.size + ' ui buttons');
            outer = this;
            return _.forEach(this.spec.labels, function (_this) {
                return function (label) {
                    var div;
                    div = _this.div();
                    div.addClass('ui button');
                    div.append(label);
                    div.css('margin', _this.spec.margin);
                    div.on('click', function () {
                        console.log('emitting button group clicked with label', label);
                        return outer.emit('clicked', {
                            id: outer.id,
                            source: outer,
                            label: label,
                            name: outer.name
                        });
                    });
                    return _this.el.append(div);
                };
            }(this));
        };
        return ButtonGroup;
    }(html.HtmlStimulus);
    exports.ButtonGroup = ButtonGroup;
}.call(this));
});
return require('65');
})((function() {
  var loading = {};
  var files = {};
  var outer;
  if (typeof require === 'function') {
    outer = require;
  }
  function inner(id, parentModule) {
    if({}.hasOwnProperty.call(inner.cache, id))
      return inner.cache[id];

    if({}.hasOwnProperty.call(loading, id))
      return loading[id].exports;

    var resolved = inner.resolve(id);
    if(!resolved && outer) {
      return inner.cache[id] = outer(id);
    }
    if(!resolved) throw new Error("Failed to resolve module '" + id + "'");

    var dirname;
    var filename = files[id] || '';
    if (filename && typeof __dirname === 'string')
      filename = __dirname + '/' + filename;
    if (filename)
      dirname = filename.slice(0, filename.lastIndexOf('/') + 1);
    else
      dirname = '';
    var module$ = {
      id: id,
      require: inner,
      exports: {},
      loaded: false,
      parent: parentModule,
      children: []
    };
    if(parentModule) parentModule.children.push(module$);

    loading[id] = module$;
    resolved.call(this, module$, module$.exports, dirname, filename);
    inner.cache[id] = module$.exports;
    delete loading[id];
    module$.loaded = true;
    return inner.cache[id] = module$.exports;
  }

  inner.modules = {};
  inner.cache = {};

  inner.resolve = function(id){
    return {}.hasOwnProperty.call(inner.modules, id) ? inner.modules[id] : void 0;
  };
  inner.define = function(id, fn){ inner.modules[id] = fn; };

  return inner;
})()));
//# sourceMappingURL=undefined