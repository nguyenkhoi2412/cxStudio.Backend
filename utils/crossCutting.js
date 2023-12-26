import path from "path";

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
      for (let j = 0; j < chars.length; j++) {
        password += chars[j].charAt(
          Math.floor(Math.random() * chars[j].length)
        );
      }
      if (length > chars.length) {
        length = length - chars.length;
        for (let i = 0; i < length; i++) {
          const index = Math.floor(Math.random() * chars.length);
          password += chars[index].charAt(
            Math.floor(Math.random() * chars[index].length)
          );
        }
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
  },
  //#endregion
  //#region check
  check: {
    isNotNull: (value) => {
      return value !== null && value !== undefined && !object.isEmpty(value);
    },
    isNull: (value) => {
      return !crossCutting.check.isNotNull(value);
    },
    acceptFileExtension: (file, filetypes = /jpeg|jpg|png/) => {
      var mimetype = filetypes.test(file.mimetype);
      var extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );

      return mimetype && extname;
    },
    isEquals: (a, b) => {
      if (a === b) return true;

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
  simulateNetworkRequest(timer = 2000) {
    return new Promise((resolve) => setTimeout(resolve, timer));
  },
  //#endregion
};

export const string = {
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
  getDiff: (newObj, oldObj) => {
    let diff = Object.keys(newObj).reduce((diff, key) => {
      if (newObj[key] === oldObj[key]) return diff;
      return {
        ...diff,
        [key]: newObj[key],
      };
    }, {});

    return diff;
  },
};

export const array = {
  /**
   * Insert new item into an array
   * @params array: original array
   * @params index: index position append new item
   * @params items: item insert
   */
  insert: (currentArray, index, ...items) => {
    return currentArray.splice(index + 1, 0, ...items);
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
  delete: (arr, objItems, field = "_id") => {
    return objItems.length
      ? array.diffArrayObjects(arr, objItems) // deleteMany
      : arr.filter((item) => {
          // deleteOne
          return item[field] !== objItems[field];
        });
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
  diffArrayObjects: (current, otherArray, filterKey = "_id") => {
    return current.filter(
      ({ [filterKey]: currentKey }) =>
        !otherArray.some(({ [filterKey]: otherKey }) => currentKey === otherKey)
    );
  },
  buildHierarchy: (array = [], idField = "_id", parentField = "parent") => {
    let arr = [...array];
    let arrMap = new Map(arr.map((item) => [item[idField], item]));
    let tree = [];
    let tempItem = [];

    for (let i = 0; i < arr.length; i++) {
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
    }

    tempItem.map((item) => {
      tree = crossCutting.array.update(tree, item);
    });

    return tree;
  },
  isEquals: (a, b) => {
    return crossCutting.check.isEquals(a, b);
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
  chunks: (currentAray, chunk_size) => {
    var results = [];

    while (currentAray.length) {
      results.push(currentAray.splice(0, chunk_size));
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
