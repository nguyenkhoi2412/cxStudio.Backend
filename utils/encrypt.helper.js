import CryptoJs from "crypto-js"; // encrypt use AES
import RSAKey from "react-native-rsa"; // encrypt use RSA
// import speakeasy from "speakeasy"; // security 2FA (Two-factor authentication)
import qrcode from "qrcode"; // security 2FA (Two-factor authentication)
import otplib from "otplib"; // security 2FA (Two-factor authentication)

const { authenticator } = otplib;
const keyStringBase64 = process.env.KEY_BASE_64;

export default {
  //#region UTF8
  utf8: {
    encrypt: (e) => {
      let initialString = "";
      let n;
      let r;
      let i;
      let s;
      let o;
      let u;
      let a;
      let f = 0;
      let m = utf8.endcode(e);
      while (f < m.length) {
        n = m.charCodeAt(f++);
        r = m.charCodeAt(f++);
        i = m.charCodeAt(f++);
        s = n >> 2;
        o = ((n & 3) << 4) | (r >> 4);
        u = ((r & 15) << 2) | (i >> 6);
        a = i & 63;
        if (isNaN(r)) {
          u = a = 64;
        } else if (isNaN(i)) {
          a = 64;
        }
        initialString =
          initialString +
          keyStringBase64.charAt(s) +
          keyStringBase64.charAt(o) +
          keyStringBase64.charAt(u) +
          keyStringBase64.charAt(a);
      }
      return initialString;
    },
    decrypt: (e) => {
      let t = "";
      let n;
      let r;
      let i;
      let s;
      let o;
      let u;
      let a;
      let f = 0;
      let m = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      while (f < m.length) {
        s = keyStringBase64.indexOf(m.charAt(f++));
        o = keyStringBase64.indexOf(m.charAt(f++));
        u = keyStringBase64.indexOf(m.charAt(f++));
        a = keyStringBase64.indexOf(m.charAt(f++));
        n = (s << 2) | (o >> 4);
        r = ((o & 15) << 4) | (u >> 2);
        i = ((u & 3) << 6) | a;
        t += String.fromCharCode(n);
        if (u != 64) {
          t += String.fromCharCode(r);
        }
        if (a != 64) {
          t += String.fromCharCode(i);
        }
      }
      return utf8.decode(t);
    },
  },
  //#endregion
  //#region string Base64
  base64: {
    encrypt: (stringToEncode) => btoa(stringToEncode),
    decrypt: (stringToDecode) => atob(stringToDecode),
  },
  //#endregion
  //#region cryptoJs-aes
  aes: {
    encrypt: (dataObj) => {
      return CryptoJs.AES.encrypt(JSON.stringify(dataObj), process.env.SALT_AES)
        .toString()
        .replace(/\+/g, "p1L2u3S")
        .replace(/\//g, "s1L2a3S4h")
        .replace(/=/g, "e1Q2u3A4l");
    },
    decrypt: (dataEncrypted) => {
      dataEncrypted = dataEncrypted
        .replace(/p1L2u3S/g, "+")
        .replace(/s1L2a3S4h/g, "/")
        .replace(/e1Q2u3A4l/g, "=");

      var bytes = CryptoJs.AES.decrypt(dataEncrypted, process.env.SALT_AES);
      return JSON.parse(bytes.toString(CryptoJs.enc.Utf8));
    },
    generateKey: (length = 128, wordArray = false) => {
      let random = CryptoJs.lib.WordArray.random(length / 8);
      return wordArray ? random : random.toString();
    },
  },
  //#endregion
  //#region react-native-rsa
  rsa: {
    encrypt: (dataObj) => {
      var rsa = new RSAKey();

      // encrypt
      rsa.setPublicString(process.env.PUBLIC_KEY_RSA.replace(/\\/g, ""));
      var encrypted = rsa.encrypt(JSON.stringify(dataObj));
      return encrypted;
    },
    decrypt: (dataEncrypted) => {
      var rsa = new RSAKey();

      // decrypt
      rsa.setPrivateString(process.env.PRIVATE_KEY_RSA.replace(/\\/g, ""));
      var decrypted = rsa.decrypt(dataEncrypted); // decrypted == originText
      return JSON.parse(decrypted);
    },
    generateKey: (length = 2048) => {
      const bits = length;
      const exponent = "10001"; // must be a string. This is hex string. decimal = 65537
      var rsa = new RSAKey();
      rsa.generate(bits, exponent);
      var publicKey = rsa.getPublicString(); // return json encoded string
      var privateKey = rsa.getPrivateString(); // return json encoded string

      return {
        publicKey: publicKey,
        privateKey: privateKey,
      };
    },
  },
  //#endregion
  //#region 2FA - TOTP
  // totp: {
  //   //* verify token coming from client, will return True if tokens match
  //   verified: (secret, token, encoding = "base32") => {
  //     let secretType = secret.base32; // default is base32

  //     switch (encoding) {
  //       case "ascii":
  //         secretType = secret.ascii;
  //         break;

  //       case "hex":
  //         secretType = secret.hex;
  //         break;

  //       case "otpauth_url":
  //         secretType = secret.otpauth_url;
  //         break;
  //     }

  //     return speakeasy.totp.verify({
  //       secret: secretType,
  //       encoding: encoding,
  //       token: token,
  //       window: 6,
  //     });
  //   },
  //   //* generate 6 digit code based on base32 secret
  //   generateToken: (secret, encoding = "base32") => {
  //     let secretType = secret.base32; // default is base32

  //     switch (encoding) {
  //       case "ascii":
  //         secretType = secret.ascii;
  //         break;

  //       case "hex":
  //         secretType = secret.hex;
  //         break;

  //       case "otpauth_url":
  //         secretType = secret.otpauth_url;
  //         break;
  //     }

  //     return speakeasy.totp({
  //       secret: secretType,
  //       encoding: encoding,
  //     });
  //   },
  //   //* generate ascii, hex, base32, otpauth_url
  //   generateKey: (issuer = "INC") => {
  //     return speakeasy.generateSecret({
  //       issuer: issuer,
  //       google_auth_qr: true,
  //       qr_codes: true,
  //     });
  //   },
  // },
  //#endregion
  //#region 2FA - Otplib, qrcode
  /*
   * Note: secret params it generated from otplib.generateKey() when register user
   */
  otplib: {
    verified: (token, secret) => {
      return authenticator.verify({ token, secret });
    },
    generateToken: (username, secret, serviceName = "Community") => {
      return authenticator.keyuri(username, serviceName, secret);
    },
    generateKey: () => {
      // base32 encoded hex secret key
      return authenticator.generateSecret();
    },
    generateQRCode: (otpAuth) => {
      return new Promise(async (resolve, reject) => {
        await qrcode.toDataURL(otpAuth, (err, imageUrl) => {
          if (err) {
            console.log("Could not generate QR code", err);
            reject(error);
          }

          resolve(imageUrl);
        });
      });
    },
  },
  //#endregion
};

const utf8 = {
  endcode: (e) => {
    e = e.replace(/\r\n/g, "\n");
    let t = "";
    for (let n = 0; n < e.length; n++) {
      const r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r);
      } else if (r > 127 && r < 2048) {
        t += String.fromCharCode((r >> 6) | 192);
        t += String.fromCharCode((r & 63) | 128);
      } else {
        t += String.fromCharCode((r >> 12) | 224);
        t += String.fromCharCode(((r >> 6) & 63) | 128);
        t += String.fromCharCode((r & 63) | 128);
      }
    }
    return t;
  },
  decode: (e) => {
    let t = "";
    let n = 0;
    let c2;
    let c1;
    let r = (c1 = c2 = 0);
    while (n < e.length) {
      r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r);
        n++;
      } else if (r > 191 && r < 224) {
        c2 = e.charCodeAt(n + 1);
        t += String.fromCharCode(((r & 31) << 6) | (c2 & 63));

        n += 2;
      } else {
        c2 = e.charCodeAt(n + 1);
        c3 = e.charCodeAt(n + 2);
        t += String.fromCharCode(
          ((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
        );
        n += 3;
      }
    }
    return t;
  },
};
