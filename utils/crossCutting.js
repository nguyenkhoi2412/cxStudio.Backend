import path from 'path';
import fs from 'fs';
import encrypt from './encrypt.helper.js';

//* ==============================|| CROSSCUTTING ||============================== //
export const crossCutting = {
  //#region generate
  generate: {
    uuidv4: () => {
      var dt = new Date().getTime();
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          var r = (dt + Math.random() * 16) % 16 | 0;
          dt = Math.floor(dt / 16);
          return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
    },
    sessionId: Math.random().toString(36).substring(2),
    key: (pre) => {
      return `${crossCutting.check.isNotNull(pre) ? pre + '_' : ''}${
        new Date().getTime() + crossCutting.generate.number()
      }`;
    },
    password: (length = 8) => {
      let password = '';
      const chars = [
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        'abcdefghijklmnopqrstuvwxyz',
        '@$!%*?&',
        '1234567890'
      ];
      const charsLength = chars.length;
      let j = 0;
      do {
        const charsJ = chars[j];
        const charsJLen = charsJ.length;
        password += charsJ.charAt(Math.floor(Math.random() * charsJLen));
        j++;
      } while (j < charsLength);
      if (length > charsLength) {
        length = length - charsLength;
        let i = 0;
        do {
          const index = Math.floor(Math.random() * charsLength);
          password += chars[index].charAt(
            Math.floor(Math.random() * chars[index].length)
          );
          i++;
        } while (i < length);
      }
      return password
        .split('')
        .sort(function () {
          return 0.5 - Math.random();
        })
        .join('');
    },
    number: (min = 1, max = 100) => {
      return min + Math.random() * (max - min);
    },
    color: (color = '') => {
      switch (color) {
        //* Generate light color
        case 'light':
          var letters = 'BCDEF'.split('');
          var letterLen = letters.length;
          var color = '#';
          var i = 0;
          while (i < 6) {
            color += letters[Math.floor(Math.random() * letterLen)];
            i++;
          }
          return color;

        //* Generate dark color
        case 'dark':
          var lum = -0.25;
          var hex = String(
            '#' + Math.random().toString(16).slice(2, 8).toUpperCase()
          ).replace(/[^0-9a-f]/gi, '');
          if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
          }
          var rgb = '#',
            c,
            i = 0;
          while (i < 3) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(
              16
            );
            rgb += ('00' + c).substr(c.length);

            i++;
          }
          return rgb;

        default:
          return (
            '#' +
            Math.floor(Math.random() * 16777215)
              .toString(16)
              .padStart(6, '0')
          );
      }
    }
  },
  //#endregion
  //#region check
  check: {
    isNotNull: (value) => {
      return !crossCutting.check.isNull(value);
    },
    isNull: (value) => {
      return (
        value === null ||
        value === undefined ||
        !Object.keys(value).length ||
        (typeof value === 'string'
          ? string.isEmptyOrWhitespace(value) // check string is EMPTY
          : Array.isArray(value)
          ? array.isEmpty(value) // check Array is EMPTY
          : object.isEmpty(value)) // check Object is EMPTY
      );
    },
    isEquals: (objA, objB, map = new WeakMap()) => {
      if (typeof objA === 'function' && typeof objB === 'function') return true;
      // if (React.isValidElement(objA) || React.isValidElement(objB)) return true;

      // P1
      if (Object.is(objA, objB)) return true;

      // P2
      if (objA instanceof Date && objB instanceof Date) {
        return objA.getTime() === objB.getTime();
      }
      if (objA instanceof RegExp && objB instanceof RegExp) {
        return objA.toString() === objB.toString();
      }

      // P3
      if (
        typeof objA !== 'object' ||
        objA === null ||
        typeof objB !== 'object' ||
        objB === null
      ) {
        return false;
      }

      // P4
      if (map.get(objA) === objB) return true;
      map.set(objA, objB);

      // P5
      const keysA = Reflect.ownKeys(objA);
      const keysB = Reflect.ownKeys(objB);

      if (keysA.length !== keysB.length) {
        return false;
      }

      for (let i = 0; i < keysA.length; i++) {
        if (
          !Reflect.has(objB, keysA[i]) ||
          !crossCutting.check.isEquals(objA[keysA[i]], objB[keysA[i]], map)
        ) {
          return false;
        }
      }

      return true;
    },
    /**
     * Check object/array has data/not
     * @param obj It can be object/array
     * @returns true/false
     */
    sizeOf: (obj) => {
      return Array.isArray(obj) ? obj.length : Object.values(obj).length;
    },
    acceptFileExtension: (file, filetypes = /jpeg|jpg|png/) => {
      var mimetype = filetypes.test(file.mimetype);
      var extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );

      return mimetype && extname;
    }
  },
  //#endregion
  //#region simulate
  debounce: (func, wait = 400) => {
    let timeout;
    return function (...args) {
      const context = this;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, wait);
    };
  },
  simulateNetworkRequest: (timer = 2000) => {
    // return new Promise((resolve) => setTimeout(resolve, timer));
    return new Promise((resolve, reject) => {
      try {
        if (timer < 0) {
          throw new Error('Timer cannot be negative'); // Gây lỗi
        }

        setTimeout(resolve, timer);
      } catch (error) {
        reject(error); // Gọi reject nếu có lỗi xảy ra
      }
    });
  }
  //#endregion
};

//* ==============================|| HELPERS ||============================== //
export const helper = {
  paging: (params) => {
    const { pageno, pagesize } = params;

    const skip = !crossCutting.check.isNotNull(pageno)
      ? 0
      : parseInt(pageno) - 1; // pageno
    const limit = !crossCutting.check.isNotNull(pagesize)
      ? 1000
      : parseInt(pagesize); // pagesize

    let query = null;
    if (params.hasOwnProperty('query'))
      query = encrypt.aes.decrypt(params.query);
    else {
      query = { $sort: { created_at: -1 } };
    }

    // const { sortCriteria, filterCriteria } = crossCutting.check.isNotNull(query)
    //   ? encrypt.aes.decrypt(query)
    //   : {
    //       sortCriteria: null,
    //       filterCriteria: null
    //     };

    // const sortInfos = crossCutting.check.isNotNull(sortCriteria)
    //   ? sortCriteria
    //   : { created_at: -1 }; //default with sort created_at asc: 1/desc: -1

    // const filterInfos = crossCutting.check.isNotNull(filterCriteria)
    //   ? filterCriteria
    //   : {};

    return {
      skip: skip * limit || 0,
      limit: limit,
      queryCriteria: query
    };
  }
};

//* ==============================|| STRING ||============================== //
export const string = {
  /**
   * isEmptyOrWhitespace(' '); // true
   * isEmptyOrWhitespace('\t\n\r'); // true
   */
  isEmptyOrWhitespace: (value) =>
    typeof value === 'string' && /^\s*$/.test(value)
};

//* ==============================|| NUMBER ||============================== //
export const number = {
  /**
   * Round decimal number
   */
  roundDecimalNumber(number, decimalIndex) {
    if (typeof number !== 'number' || typeof decimalIndex !== 'number')
      return false;

    var signature = number >= 0 ? 1 : -1;

    return (
      Math.round(number * Math.pow(10, decimalIndex) + signature * 0.0001) /
      Math.pow(10, decimalIndex)
    ).toFixed(decimalIndex);
  },

  toPercentage(number, percentage) {
    if (number == null || number == '' || number == 0) {
      return 0;
    }

    if (percentage == null || percentage == '' || percentage == 0) {
      return false;
    }

    return parseFloat((number / 100) * percentage);
  }
};

//* ==============================|| OBJECT ||============================== //
export const object = {
  isEmpty: (obj) => {
    const isE =
      obj === null ||
      obj === undefined ||
      !Object.keys(obj).length ||
      crossCutting.check.sizeOf(obj) === 0;
    if (isE) return true;

    for (const prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
    return true;
  },
  /**
   * Omit objects name from complex object
   * @example
   * const obj = { a: 1, b: '2', c: 3 };
   * omit(obj, ['b']); // { 'a': 1, 'c': 3 }
   * @param obj
   * @param arr
   * @returns object
   */
  omit: (obj, arr) =>
    Object.fromEntries(Object.entries({...obj}).filter(([k]) => !arr.includes(k)))
};

//* ==============================|| ARRAY ||============================== //
export const array = {};

export const loop = {
  /**
   * use loop increase performance depend on array's length
   * @param arr
   * @param func callback function
   * @param type doWhile, while, for, forEach
   */
  forEach: (arr, func, type = 'auto', conditionBreak = null) => {
    if (typeof func !== 'function') return;

    // const isBreak = (index) => conditionBreak && eval(conditionBreak);
    const arrLength = arr.length;
    let index = 0;

    const loop = {
      doWhile: () => {
        do {
          const item = arr[index];
          func(item, index);

          index++;
          // if (isBreak(index)) break;
        } while (index < arrLength);
      },
      while: () => {
        while (index < arrLength) {
          const item = arr[index];
          func(item, index);

          index++;
          // if (isBreak(index)) break;
        }
      },
      for: () => {
        for (let i = 0; i < arrLength; i++) {
          const item = arr[i];
          func(item, i);
        }
      },
      forEach: () => {
        arr.forEach((item, i) => {
          func(item, i);
        });
      }
    };

    // callback function with type
    if (type === 'auto') {
      if (arrLength <= 1000000) {
        loop['while']();
      } else {
        loop['for']();
      }
    } else loop[type || 'doWhile']();
  }
};

//* ==============================|| DATETIME ||============================== //
export const datetime = {};

//* ==============================|| DIRECTORY FS ||============================== //
export const directory = {
  createDirIfNotExists: (dir) =>
    !fs.existsSync(dir) ? fs.mkdirSync(dir) : undefined
};

export const file = {};
