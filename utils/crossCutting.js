import path from "path";

export class crossCutting {
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

  static isNull(data) {
    return !this.isNotNull(data);
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
