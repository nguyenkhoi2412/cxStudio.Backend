import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

export default {
  //#region sent mail
  mail: {
    smtp: (mailOptions) => {
      var transporter = nodemailer.createTransport(
        //* Enable these links below
        //* https://accounts.google.com/DisplayUnlockCaptcha
        //* https://myaccount.google.com/lesssecureapps
        smtpTransport({
          // config mail server
          service: process.env.SMTP_SERVICE,
          host: process.env.SMTP_HOST,
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
          },
        })
      );

      var options = {
        // thiết lập đối tượng, nội dung gửi mail
        from:
          mailOptions.from || `E-GO Stores 🌠<` + process.env.SMTP_EMAIL + `>`,
        to: mailOptions.to,
        subject: mailOptions.subject,
        text: mailOptions.text || "",
        html: mailOptions.html || "",
      };

      transporter.sendMail(options, function (err, info) {
        if (err) {
          console.log(err);
          // return {
          //   code: 405,
          //   ok: false,
          //   message: err,
          // };
        } else {
          console.log('Message sent: ' + info.response);
          // return {
          //   code: 250,
          //   ok: true,
          //   message: info,
          // };
        }
      });
    },
  },
  //#endregion
  //#region sms
  sms: {},
  //#endregion
};
