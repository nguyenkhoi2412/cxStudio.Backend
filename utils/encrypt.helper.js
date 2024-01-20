import CryptoJs from "crypto-js"; // encrypt use AES
import RSAKey from "react-native-rsa"; // encrypt use RSA
// import speakeasy from "speakeasy"; // security 2FA (Two-factor authentication)
import qrcode from "qrcode"; // security 2FA (Two-factor authentication)
import otplib from "otplib"; // security 2FA (Two-factor authentication)

const { authenticator } = otplib;

export default {
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
