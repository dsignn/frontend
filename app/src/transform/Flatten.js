/**
 * @class Flatten
 */
export class Flatten {

    /**
     *
     * @param data
     * @param breakOnNonObject
     */
    flatten (data, breakOnNonObject) {
        let output = {};

        let _process = function (key, val, output) {
            let k;

            if (typeof val === 'object') {
                for (k in val) {
                    if (breakOnNonObject && typeof val[k] !== 'object') {
                        output[key] = val;
                    } else {
                        _process(key + '[' + k + ']', val[k], output);
                    }
                }
            } else if (typeof val !== 'function') {
                output[key] = val;
            } else {
                throw new Error('There was an error processing for inflateKeys().');
            }
        };

        for (let key in data) {
            _process(key, data[key], output);
        }

        return output;
    }

    /**
     * @param key
     * @param value
     * @param data
     * @param useArrayWhenFirstKeyIsNumeric
     * @private
     */
    _unFlattenValue(key, value, data, useArrayWhenFirstKeyIsNumeric) {
        // Avoid indirect modifications
        if (value instanceof Array) {
            // slices() clones the array and returns the reference to the new array
            value = value.slice();
        }

        let j, ct, p, lastObj, obj, lastIter, undef, chr,
            postLeftBracketPos, keys, keysLen;
        while (key.charAt(0) === ' ') {
            key = key.slice(1);
        }
        if (key.indexOf('\x00') > -1) {
            key = key.slice(0, key.indexOf('\x00'));
        }
        if (key && key.charAt(0) !== '[') {
            keys = [];
            postLeftBracketPos = 0;
            for (j = 0; j < key.length; j++) {
                if (key.charAt(j) === '[' && !postLeftBracketPos) {
                    postLeftBracketPos = j + 1;
                } else if (key.charAt(j) === ']') {
                    if (postLeftBracketPos) {
                        if (!keys.length) {
                            keys.push(key.slice(0, postLeftBracketPos - 1));
                        }
                        keys.push(key.substr(postLeftBracketPos, j - postLeftBracketPos));
                        postLeftBracketPos = 0;
                        if (key.charAt(j + 1) !== '[') {
                            break;
                        }
                    }
                }
            }
            if (!keys.length) {
                keys = [key];
            }
            for (j = 0; j < keys[0].length; j++) {
                chr = keys[0].charAt(j);
                if (chr === ' ' || chr === '.' || chr === '[') {
                    keys[0] = keys[0].substr(0, j) + '_' + keys[0].substr(j + 1);
                }
                if (chr === '[') {
                    break;
                }
            }

            obj = data;
            for (j = 0, keysLen = keys.length; j < keysLen; j++) {
                key = keys[j].replace(/^['"]/, '')
                    .replace(/['"]$/, '');
                lastIter = j !== keys.length - 1;
                lastObj = obj;
                if ((key !== '' && key !== ' ') || j === 0) {
                    if (obj[key] === undef) {
                        if (useArrayWhenFirstKeyIsNumeric && (j + 1) < keysLen && !isNaN(parseInt(keys[j + 1].replace(/^['"]/, '').replace(/['"]$/, '')))) {
                            obj[key] = [];
                        } else {
                            obj[key] = {};
                        }
                    }
                    obj = obj[key];
                } else {
                    // To insert new dimension
                    ct = -1;
                    for (p in obj) {
                        if (obj.hasOwnProperty(p)) {
                            if (+p > ct && p.match(/^\d+$/g)) {
                                ct = +p;
                            }
                        }
                    }
                    key = ct + 1;
                }
            }
            lastObj[key] = value;
        }
    }

    /**
     * @param data
     * @return {object}
     */
    unFlatten(data) {
        let obj = {};
        for (let property in data) {
           this._unFlattenValue(property, data[property], obj, true);
        }
        return obj;
    }
}