import path from "path";

export class helpersExtension {
  //#region generate
  static generateKey = (pre) => {
    return `${this.isNotNull(pre) ? pre + "_" : ""}${
      new Date().getTime() + this.randomNumber()
    }`;
  };

  // Generate a cryptographically secure random password.
  static generatePassword = (length = 8) => {
    let password = "";
    const chars = [
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      "abcdefghijklmnopqrstuvwxyz",
      "@$!%*?&",
      "1234567890",
    ];
    for (let j = 0; j < chars.length; j++) {
      password += chars[j].charAt(Math.floor(Math.random() * chars[j].length));
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
  };

  static uuidv4 = () => {
    var dt = new Date().getTime();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  };

  static randomNumber = (min = 1, max = 100) => {
    return min + Math.random() * (max - min);
  };
  //#endregion

  //#region check
  static isNotNull(data) {
    return (
      data !== null && data !== undefined && !objectExtension.isEmpty(data)
    );
  }

  static acceptFileExtension(file, filetypes = /jpeg|jpg|png/) {
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    return mimetype && extname;
  }
  //#endregion

  //#region simulator
  static simulateNetworkRequest(timer = 2000) {
    return new Promise((resolve) => setTimeout(resolve, timer));
  }
  //#endregion
}

//#region objects
export class objectExtension {
  // keys: as a string example to use: getValueObjects(object, "a.b.c.d")
  static getValue = (object, keys) =>
    keys.split(".").reduce((o, k) => (o || {})[k], object);

  static parseToQueryString = (url, params) =>
    url +
    Object.keys(params)
      .map((key) => params[key])
      .join("&");

  static createQueryString = (url, queryObject) => {
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
  };

  static queryStringToObject = (queryString = "", options = {}) => {
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
  };

  static getDiff = (newObj, oldObj) => {
    let diff = Object.keys(newObj).reduce((diff, key) => {
      if (newObj[key] === oldObj[key]) return diff;
      return {
        ...diff,
        [key]: newObj[key],
      };
    }, {});

    return diff;
  };

  static diffArrayObjects = (current, otherArray, filterKey = "_id") => {
    return current.filter(
      ({ [filterKey]: currentKey }) =>
        !otherArray.some(({ [filterKey]: otherKey }) => currentKey === otherKey)
    );
  };

  static isEmpty = (obj) => {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
    return true;
  };

  static compareArrays = (a, b) =>
    a.length === b.length &&
    a.every(
      (element, index) =>
        element === b[index] ||
        JSON.stringify(element) === JSON.stringify(b[index])
    );
}
//#endregion

//#region array
export class arrayExtension {
  static insert = (arr, index, ...items) => {
    return [
      // part of the array before the specified index
      ...arr.slice(0, index),
      // inserted items
      ...items,
      // part of the array after the specified index
      ...arr.slice(index),
    ];
  };

  static update = (arr, newItem, field = "_id") => {
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
  };

  static delete = (arr, objItems, field = "_id") => {
    return objItems.length
      ? objectExtension.diffArrayObjects(arr, objItems) // deleteMany
      : arr.filter((item) => {
          // deleteOne
          return item[field] !== objItems[field];
        });
  };

  //* shuffle array
  static shuffle = (array) => {
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
  };

  //* build hierarchy
  static buildHierarchy = (
    array = [],
    idField = "_id",
    parentField = "parent"
  ) => {
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
      tree = arrayExtension.update(tree, item);
    });

    return tree;
  };
}
//#endregion

//#region string
export class stringExtension {
  static render = (value, langCode = "", defaultValue = "Noname") => {
    return helpersExtension.isNotNull(value)
      ? langCode !== ""
        ? helpersExtension.isNotNull(value[langCode])
          ? value[langCode]
          : defaultValue
        : value
      : defaultValue;
  };

  static stripedHtml = (text) => {
    text = text.replace(/[<|>]/gi, "");

    if (
      text.toLowerCase().indexOf("javascript") > -1 ||
      text.toLowerCase().indexOf("&lt;") > -1 ||
      text.toLowerCase().indexOf("&gt;") > -1
    ) {
      text = text.replace(/[javascript|&lt;|&gt;]/gi, "");
    }

    return text;
  };

  //#region convert currency
  static numberWithSympol(value, dot = ",", decimal_point = 0) {
    let valueCheck = isNaN(value) ? 0 : parseFloat(value);

    return valueCheck
      .toFixed(decimal_point)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1" + dot);
  }

  static compactNumber(value) {
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
  }

  static formatBytes(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + sizes[i];
  }

  //* RANK
  static ordinalSuffix(value) {
    let j = number % 10;
    let k = number % 100;
    if (j == 1 && k != 11) {
      return `${value}st`;
    }

    if (j == 2 && k != 12) {
      return `${value}nd`;
    }

    if (j == 3 && k != 13) {
      return `${value}rd`;
    }

    return `${value}th`;
  }
  //#endregion
}
//#endregion
