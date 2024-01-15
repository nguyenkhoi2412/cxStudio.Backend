import path from "path";

//* ==============================|| CROSSCUTTING ||============================== //
export const crossCutting = {
  //#region generate
  generate: {
    uuidv4: () => {
      var dt = new Date().getTime();
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (dt + Math.random() * 16) % 16 | 0;
          dt = Math.floor(dt / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
    },
    key: (pre) => {
      return `${crossCutting.check.isNotNull(pre) ? pre + "_" : ""}${
        new Date().getTime() + crossCutting.generate.number()
      }`;
    },
    password: (length = 8) => {
      let password = "";
      const chars = [
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "abcdefghijklmnopqrstuvwxyz",
        "@$!%*?&",
        "1234567890",
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
        .split("")
        .sort(function () {
          return 0.5 - Math.random();
        })
        .join("");
    },
    number: (min = 1, max = 100) => {
      return min + Math.random() * (max - min);
    },
    color: (color = "") => {
      switch (color) {
        //* Generate light color
        case "light":
          var letters = "BCDEF".split("");
          var letterLen = letters.length;
          var color = "#";
          var i = 0;
          while (i < 6) {
            color += letters[Math.floor(Math.random() * letterLen)];
            i++;
          }
          return color;

        //* Generate dark color
        case "dark":
          var lum = -0.25;
          var hex = String(
            "#" + Math.random().toString(16).slice(2, 8).toUpperCase()
          ).replace(/[^0-9a-f]/gi, "");
          if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
          }
          var rgb = "#",
            c,
            i = 0;
          while (i < 3) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(
              16
            );
            rgb += ("00" + c).substr(c.length);

            i++;
          }
          return rgb;

        default:
          return (
            "#" +
            Math.floor(Math.random() * 16777215)
              .toString(16)
              .padStart(6, "0")
          );
      }
    },
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
        (typeof value === "string"
          ? string.isEmptyOrWhitespace(value) // check string is EMPTY
          : Array.isArray(value)
          ? array.isEmpty(value) // check Array is EMPTY
          : object.isEmpty(value)) // check Object is EMPTY
      );
    },
    isEquals: (a, b) => {
      if (crossCutting.check.isNull(a) && crossCutting.check.isNull(b))
        return true;

      if (a === b) return true;
      if (JSON.stringify(a) === JSON.stringify(b)) return true;
      if (typeof a === "function" && typeof b === "function") return true;

      if (a instanceof Date && b instanceof Date)
        return a.getTime() === b.getTime();

      if (!a || !b || (typeof a !== "object" && typeof b !== "object"))
        return a === b;

      if (a.prototype !== b.prototype) return false;

      const keys = Object.keys(a);
      if (keys.length !== Object.keys(b).length) return false;

      return (
        // array compare with object
        keys.every((k) => crossCutting.check.isEquals(a[k], b[k]))
        // || array
        // (a.length === b.length &&
        //   a.every(
        //     (element, index) =>
        //       element === b[index] ||
        //       JSON.stringify(element) === JSON.stringify(b[index])
        //   )) ||
        // Object.is(a, b)
      );
    },
    acceptFileExtension: (file, filetypes = /jpeg|jpg|png/) => {
      var mimetype = filetypes.test(file.mimetype);
      var extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );

      return mimetype && extname;
    },
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
    return new Promise((resolve) => setTimeout(resolve, timer));
  },
  //#endregion
};

//* ==============================|| STRING ||============================== //
export const string = {
  /**
   * isEmptyOrWhitespace(' '); // true
   * isEmptyOrWhitespace('\t\n\r'); // true
   */
  isEmptyOrWhitespace: (value) =>
    typeof value === "string" && /^\s*$/.test(value),

  stripedHtml: (text) => {
    text = text.replace(/[<|>]/gi, "");

    if (
      text.toLowerCase().indexOf("javascript") > -1 ||
      text.toLowerCase().indexOf("&lt;") > -1 ||
      text.toLowerCase().indexOf("&gt;") > -1
    ) {
      text = text.replace(/[javascript|&lt;|&gt;]/gi, "");
    }

    return text;
  },
  numberWithSympol: (value, dot = ",", decimal_point = 0) => {
    let valueCheck = isNaN(value) ? 0 : parseFloat(value);

    return valueCheck
      .toFixed(decimal_point)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1" + dot);
  },
  compactNumber: (value) => {
    const suffixes = ["", "k", "m", "b", "t"];
    const suffixNum = Math.floor(("" + value).length / 3);

    let shortValue = parseFloat(
      (suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(
        2
      )
    );

    if (shortValue % 1 != 0) {
      shortValue = shortValue.toFixed(1);
    }

    return shortValue + suffixes[suffixNum];
  },
  formatBytes: (bytes) => {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + sizes[i];
  },
  //* RANK
  ordinalSuffix: (number) => {
    let j = number % 10;
    let k = number % 100;
    if (j == 1 && k != 11) {
      return `${number}st`;
    }

    if (j == 2 && k != 12) {
      return `${number}nd`;
    }

    if (j == 3 && k != 13) {
      return `${number}rd`;
    }

    return `${number}th`;
  },
};

//* ==============================|| OBJECT ||============================== //
export const object = {
  // getValue: (object, keys) =>
  //   keys.split(".").reduce((o, k) => (o || {})[k], object),

  /**
   * Get nested object property from path string
   * const obj = {
   *   selector: { to: { val: 'val to select' } },
   *   target: [1, 2, { a: 'test' }],
   * };
   * get(obj, 'selector.to.val', 'target[0]', 'target[2].a'); // ['val to select', 1, 'test']
   *
   */
  getValue: (obj, ...selectors) => {
    const rs = [...selectors].map((item) =>
      item
        .replace(/\[([^\[\]]*)\]/g, ".$1.")
        .split(".")
        .filter((t) => t !== "")
        .reduce((prev, cur) => prev && prev[cur], obj)
    );
    if (rs?.length === 1) {
      return rs[0];
    }

    return rs;
  },

  isEmpty: (obj) => {
    let isE =
      obj === null || obj === undefined || !(Object.keys(obj) || obj).length;
    if (isE) return true;

    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
    return true;
  },

  isEquals: (a, b) => {
    return crossCutting.check.isEquals(a, b);
  },

  //* QUERY
  parseToQueryString: (url, params) =>
    url +
    Object.keys(params)
      .map((key) => params[key])
      .join("&"),

  createQueryString: (url, queryObject) => {
    // url +
    // Object.keys(params)
    //   .map((key) => params[key])
    //   .join("&");
    let queryString = Object.keys(queryObject)
      .filter(
        (key) =>
          queryObject[key] &&
          !(Array.isArray(queryObject[key]) && !queryObject[key].length)
      )
      .map((key) => {
        return Array.isArray(queryObject[key])
          ? queryObject[key]
              .map(
                (item) =>
                  `${encodeURIComponent(key)}=${encodeURIComponent(item)}`
              )
              .join("&")
          : `${encodeURIComponent(key)}=${encodeURIComponent(
              queryObject[key]
            )}`;
      })
      .join("&");
    return url + (queryString ? `?${queryString}` : "");
  },

  queryStringToObject: (queryString = "", options = {}) => {
    let queryObject = {};
    queryString &&
      decodeURIComponent(queryString.replace("?", ""))
        .split("&")
        .map((itemString) => {
          let [itemKey, itemValue] = itemString.split("=");
          if (options.hasOwnProperty(itemKey)) {
            if (!queryObject[itemKey] && Array.isArray(options[itemKey])) {
              queryObject[itemKey] = [];
            }
            Array.isArray(options[itemKey])
              ? queryObject[itemKey].push(itemValue)
              : (queryObject[itemKey] =
                  typeof options[itemKey] === "number"
                    ? parseInt(itemValue)
                    : itemValue);
          }
        });
    return queryObject;
  },

  //* GET DIFF/COMPARE
  getDiff: (baseObj, newObj) => {
    const isNativeType1 = typeof baseObj !== "object";
    const isNativeType2 = typeof newObj !== "object";
    if (isNativeType1 && isNativeType2) {
      return baseObj === newObj ? null : newObj;
    }
    if (isNativeType1 && !isNativeType2) {
      return newObj;
    }
    if (!isNativeType1 && isNativeType2) {
      return newObj;
    }
    const isArray1 = Array.isArray(baseObj);
    const isArray2 = Array.isArray(newObj);
    if (isArray1 && isArray2) {
      const firstLenght = baseObj.length;
      const secondLenght = newObj.length;
      const hasSameLength = firstLenght === secondLenght;
      if (!hasSameLength) return newObj;
      let hasChange = false;
      let indexArr = 0;
      do {
        const element1 = baseObj[indexArr];
        const element2 = newObj[indexArr];
        const changed = object.getDiff(element1, element2);
        if (changed) {
          hasChange = true;
        }

        indexArr++;
      } while (indexArr < firstLenght);

      return hasChange ? newObj : null;
    }
    if (isArray1 || isArray2) return newObj;
    const keys1 = Object.keys(baseObj);
    const keys2 = Object.keys(newObj);
    const keys1Len = keys1.length;
    const keys2Len = keys2.length;
    const hasSameKeys = keys1Len === keys2Len;
    if (!hasSameKeys) {
      const retObj = { ...newObj };
      let indexKey = 0;
      do {
        const key = keys1[indexKey];
        if (!keys2.includes(key)) {
          retObj[key] = null;
          // eslint-disable-next-line no-continue
          continue;
        }
        delete retObj[key];

        indexKey++;
      } while (indexKey < keys1Len);

      return retObj;
    }
    let hasChange = false;
    const retObj = {};

    let index = 0;
    do {
      const key = keys1[index];
      const element1 = baseObj[key];
      const element2 = newObj[key];
      const changed = object.getDiff(element1, element2);
      if (changed) {
        hasChange = true;
      }
      if (changed) {
        retObj[key] = changed;
      }
      index++;
    } while (index < keys1Len);

    return hasChange ? retObj : null;
  },

  // Check if the input is a json object (whether startsWidth '{' and endsWidth '}') or not
  isJsonObject: (text) => {
    let str = String(text).trim();

    if (!str.startsWith("{") || !str.endsWith("}")) return false;

    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }

    return true;
  },
};

//* ==============================|| ARRAY ||============================== //
export const array = {
  /**
   * Insert new item into an array
   * @params array: original array
   * @params index: index position append new item
   * @params items: item insert
   */
  insert: (currentArray, index, items) => {
    return [
      ...currentArray.slice(0, index),
      ...items,
      ...currentArray.slice(index),
    ];
  },
  update: (arr, newItem, field = "_id") => {
    var itemField = Array.isArray(newItem) ? newItem[0] : newItem;

    if (Array.isArray(arr)) {
      return arr.map((item) => {
        if (item[field] === itemField[field]) {
          return {
            ...item,
            ...itemField,
          };
        }

        return item;
      });
    }

    return itemField;
  },
  delete: (arr, objItems) => {
    let tempArray = [...arr];
    if (Array.isArray(objItems)) {
      // delete multiple objectItems
      var itemLength = objItems?.length || 0;
      let i = 0;
      do {
        let indexItem = array.findIndex(tempArray, objItems[i]);
        tempArray.splice(indexItem, 1);

        i++;
      } while (i < itemLength);
      return tempArray;
    }

    // Find index from objItems
    let indexItem = array.findIndex(tempArray, objItems);
    tempArray.splice(indexItem, 1);
    return tempArray;
  },
  removeDuplicate: (currentArray) => {
    return [...new Set(currentArray)];
  },
  shuffle: (array) => {
    let ctr = array.length;
    let temp;
    let index;

    // While there are elements in the array
    while (ctr > 0) {
      // Pick a random index
      index = Math.floor(Math.random() * ctr);
      // Decrease ctr by 1
      ctr--;
      // And swap the last element with it
      temp = array[ctr];
      array[ctr] = array[index];
      array[index] = temp;
    }
    return array;
  },
  /**
   * Find index by binarySearch
   * findIndex([1, 2, 3, 4, 5], 5); // 4
   */
  findIndex: (arr, item) => {
    let l = 0,
      r = arr.length - 1;
    while (l <= r) {
      const mid = Math.floor((l + r) / 2);
      const guess = arr[mid];
      if (guess === item) return mid;
      if (guess > item) r = mid - 1;
      else l = mid + 1;
    }
    return -1;
  },
  /**
   * Find index of all
   * indexOfAll([1, 2, 3, 1, 2, 3], 1); // [0, 3]
   * indexOfAll([1, 2, 3], 4); // []
   */
  findIndexOfAll: (arr, val) =>
    arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), []),
  /**
   * array.combine
   * How to use it?
   * const x = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Maria' }
    ];
   * const y = [
      { id: 1, age: 28 },
      { id: 3, age: 26 },
      { age: 3}
    ];
   *
   * combine(x, y, 'id');
   */
  combine: (a, b, prop) =>
    Object.values(
      [...a, ...b].reduce((acc, v) => {
        if (v[prop])
          acc[v[prop]] = acc[v[prop]] ? { ...acc[v[prop]], ...v } : { ...v };
        return acc;
      }, {})
    ),
  // Check if the input is a json array (whether startsWidth '[' and endsWidth ']') or not
  isJsonArray: (text) => {
    let str = String(text).trim();
    return str.startsWith("[") && str.endsWith("]");
  },
  mergeArrayObjects: (current, newArray, field = "_id") => {
    const rsAdd = newArray.filter(
      ({ [field]: id1 }) => !current.some(({ [field]: id2 }) => id2 === id1)
    );
    const rsRemoved = current.filter(
      ({ [field]: id1 }) => !newArray.some(({ [field]: id2 }) => id2 === id1)
    );
    const rsUpdated = newArray.filter(({ [field]: id1, ...rest1 }) =>
      current.some(
        ({ [field]: id2, ...rest2 }) =>
          id2 === id1 && JSON.stringify(rest1) !== JSON.stringify(rest2)
      )
    );

    let tempArray = [...current];
    // Delete in current
    if (rsRemoved?.length > 0) {
      tempArray = array.delete(tempArray, rsRemoved, field);
    }

    // Update data for current array
    const rsUpdatedLen = rsUpdated?.length;
    if (rsUpdatedLen > 0) {
      let i = 0;
      do {
        tempArray = array.update(tempArray, rsUpdated[i], field);
        i++;
      } while (i < rsUpdatedLen);
    }

    // Insert new item for current array
    if (rsAdd?.length > 0) {
      tempArray = array.insert(tempArray, tempArray.length, rsAdd);
    }

    return {
      isChanged:
        rsAdd?.length > 0 || rsUpdated?.length > 0 || rsRemoved?.length > 0,
      originalList: current,
      newList: tempArray,
      inserted: rsAdd,
      updated: rsUpdated,
      deleted: rsRemoved,
    };
  },
  buildHierarchy: (array = [], idField = "_id", parentField = "parent") => {
    let arr = [...array];
    let arrMap = new Map(arr.map((item) => [item[idField], item]));
    let tree = [];
    let tempItem = [];
    let arrLength = arr.length;
    let i = 0;
    do {
      let item = arr[i];

      if (item[parentField] !== "") {
        let parentItem = arrMap.get(item[parentField]);

        if (parentItem) {
          parentItem = {
            ...parentItem,
            children: [...parentItem.children, item],
          };

          tempItem.push(parentItem);
        }
      } else {
        tree.push(item);
      }

      i++;
    } while (i < arrLength);

    tempItem.map((item) => {
      tree = crossCutting.array.update(tree, item);
    });

    return tree;
  },
  isEquals: (a, b) => {
    return crossCutting.check.isEquals(a, b);
  },
  isEmpty: (array) => {
    //If  not an array, return FALSE.
    if (!Array.isArray(array)) {
      return false;
    }
    //If it is an array, check its length property
    if (array?.length === 0) {
      //Return TRUE if the array is empty
      return true;
    }
    //Otherwise, return FALSE.
    return false;
  },
  /**
   * array.orderBy
   * How to use it?
   * [{ name: 'fred', age: 48 },
   * { name: 'barney', age: 36 },
   * { name: 'fred', age: 40 }]
   * orderBy(users, ['name', 'age'], ['asc', 'desc']);
   */
  orderBy: (arr, props, orders) =>
    [...arr].sort((a, b) =>
      props.reduce((acc, prop, i) => {
        if (acc === 0) {
          const [p1, p2] =
            orders && orders[i] === "desc"
              ? [b[prop], a[prop]]
              : [a[prop], b[prop]];
          acc = p1 > p2 ? 1 : p1 < p2 ? -1 : 0;
        }
        return acc;
      }, 0)
    ),
  chunks: (currentArray, chunk_size) => {
    var results = [];
    var arrayLength = currentArray.length;

    while (arrayLength) {
      results.push(currentArray.splice(0, chunk_size));
    }

    return results;
  },
  /**
   * Partition array in two
   * const users = [
      { user: 'barney', age: 36, active: false },
      { user: 'barn', age: 75, active: true },
      { user: 'fred', age: 40, active: true },
    ];
    array.partition(users, o => o.active);
   */
  partition: (arr, fn) =>
    arr.reduce(
      (acc, val, i, arr) => {
        acc[fn(val, i, arr) ? 0 : 1].push(val);
        return acc;
      },
      [[], []]
    ),
};

export const loop = {
  /**
   * <= 3000 => forEach
   * <= 10000 => do...while
   * 10001 ~ 2000000 => while
   * > 2000000 => for
   */
  every: (arr, func, type = "auto", conditionBreak = null) => {
    if (typeof func !== "function") return;

    // const isBreak = (index) => conditionBreak && eval(conditionBreak);
    const arrLength = arr.length;
    let index = 0;

    var loop = {
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
      },
    };

    // callback function with type
    if (type === "auto") {
      if (arrLength <= 3000) {
        loop["forEach"]();
      }

      if (arrLength > 3000 && arrLength <= 10000) {
        loop["doWhile"]();
      }

      if (arrLength > 10000 && arrLength <= 2000000) {
        loop["while"]();
      }

      if (arrLength > 2000000) {
        loop["for"]();
      }
    } else loop[type || "doWhile"]();
  },
};

//* ==============================|| DATETIME ||============================== //
export const datetime = {
  diffInDays: (startDateVal, endDateVal) => {
    var startDate = new Date(startDateVal); //Default date format
    var endDate = new Date(endDateVal);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = endDate.getTime() - startDate.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
  },

  getUtcDateTime: (isoDate, locales = "en") => {
    const date = new Date(isoDate);
    // let d = Date.UTC(
    //   date.getFullYear(),
    //   date.getMonth(),
    //   date.getDate(),
    //   date.getHours(),
    //   date.getMinutes(),
    //   date.getSeconds()
    // );

    const localTime = date.toLocaleTimeString(locales, {
      timeStyle: "short",
    });
    const utcTime = date.getUTCHours() + ":" + date.getUTCMinutes();
    const data = {
      toISOString: isoDate,
      toUTCString: new Date(date.toUTCString().slice(0, -4)).toString(), // ignore the timezone
      local: {
        date: date.toLocaleDateString(locales),
        time: localTime,
      },
      utc: {
        time: utcTime,
      },
    };

    return data;

    // var curLocalDate = new Date(datetime);
    // var curlLocalMiliSec = curLocalDate.getTime();
    // var utcOffsetInMin = curLocalDate.getTimezoneOffset();
    // var utcOffsetInMiliSec = utcOffsetInMin * 60 * 1000;

    // var utcTime = new Date(curlLocalMiliSec + utcOffsetInMiliSec);

    // var utcHour = utcTime.getHours();
    // var utcMinutes = utcTime.getMinutes();

    // return {
    //   localTime: curLocalDate.getHours() + ":" + curLocalDate.getMinutes(),
    //   utcTime: utcHour + ":" + utcMinutes,
    // };
  },

  /**
   * Check date input is valid?
   * isDateValid('December 17, 1995 03:24:00'); // true
   * isDateValid('1995-12-17T03:24:00'); // true
   * isDateValid(1995, 11, 17); // true
   * isDateValid('1995-12-17 T03:24:00'); // false
   * isDateValid('Duck'); // false
   * isDateValid(1995, 11, 17, 'Duck'); // false
   * isDateValid({}); // false
   */
  isDateValid: (...val) => !Number.isNaN(new Date(...val).valueOf()),

  /**
   * Check days of work in week
   *
   */
  isWeekday: (date) => date.getDay() % 6 !== 0,

  /**
   * toTimestamp(new Date('2024-01-04')); // 1704326400
   */
  toTimestamp: (date) => Math.floor(date.getTime() / 1000),

  /**
   * fromTimestamp(1704326400); // 2024-01-04T00:00:00.000Z
   */
  fromTimestamp: (timestamp) => new Date(timestamp * 1000),

  /**
   * daysAgo(20); // 2023-12-17 (if current date is 2024-01-06)
   */
  daysAgo: (n) => {
    let d = new Date();
    d.setDate(d.getDate() - Math.abs(n));
    return d;
  },

  /**
   * daysFromToday(20); 2024-01-26 (if current date is 2024-01-06)
   */
  daysFromToday: (n) => {
    let d = new Date();
    d.setDate(d.getDate() + Math.abs(n));
    return d;
  },

  /**
   * dayOfYear(new Date('2024-09-28')); // 272
   */
  dayOfYear: (date) =>
    Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86_400_000),

  /**
   * quarterOfYear(new Date('2024-09-28')); // 3
   */
  weekOfYear: (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    startOfYear.setDate(startOfYear.getDate() + (startOfYear.getDay() % 7));
    return Math.round((date - startOfYear) / 604_800_000);
  },

  /**
   * weekOfYear(new Date('2021-06-18')); // 23
   */
  quarterOfYear: (date) => Math.ceil((date.getMonth() + 1) / 3),

  /**
   * daysInMonth(2020, 12)); // 31
   * daysInMonth(2024, 2)); // 29
   */
  daysInMonth: (year, month) => new Date(year, month, 0).getDate(),

  /**
   * const dates = [
   *  new Date('2017-05-13'),
   *  new Date('2018-03-12'),
   *  new Date('2016-01-10'),
   *  new Date('2016-01-09')
   * ];
   * minDate(...dates); // 2016-01-09
   * maxDate(...dates); // 2018-03-12
   */
  minDate: (...dates) => new Date(Math.min(...dates)),
  maxDate: (...dates) => new Date(Math.max(...dates)),

  /**
   * monthOfYear(new Date('2024-09-28')); // 9
   */
  monthOfYear: (date) => date.getMonth() + 1,

  //#region add time todate
  /**
   * addSecondsToDate(new Date('2020-10-19 12:00:00'), 10); // 2020-10-19 12:00:10
   */
  addSecondsToDate: (date, n) => {
    const d = new Date(date);
    d.setTime(d.getTime() + n * 1000);
    return d;
  },

  /**
   * addMinutesToDate('2020-10-19 12:00:00', 10); // 2020-10-19 12:10:00
   */
  addMinutesToDate: (date, n) => {
    const d = new Date(date);
    d.setTime(d.getTime() + n * 60_000);
    return d;
  },

  /**
   * addHoursToDate('2020-10-19 12:00:00', 10); // 2020-10-19 22:00:00
   */
  addHoursToDate: (date, n) => {
    const d = new Date(date);
    d.setTime(d.getTime() + n * 3_600_000);
    return d;
  },

  /**
   * addDaysToDate('2020-10-19 12:00:00', 10); // 2020-10-29 12:00:00
   */
  addDaysToDate: (date, n) => {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  },

  /**
   * addWeekDays('2020-10-05', 5); // 2020-10-12
   */
  addWeekDays: (date, n) => {
    const s = Math.sign(n);
    const d = new Date(date);
    return Array.from({ length: Math.abs(n) }).reduce((currentDate) => {
      currentDate = addDaysToDate(currentDate, s);
      while (!datetime.isWeekday(currentDate))
        currentDate = addDaysToDate(currentDate, s);
      return currentDate;
    }, d);
  },
  //#endregion
};
