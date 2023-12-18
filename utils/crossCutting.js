import path from "path";
import { objectHelper } from "./object.helper.js";

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
    return data !== null && data !== undefined && !objectHelper.isEmpty(data);
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
