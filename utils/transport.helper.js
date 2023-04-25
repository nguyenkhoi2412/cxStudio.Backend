import nodemailer from "nodemailer";

export default {
  //#region sent mail
  mail: {
    smtp: (mailOptions) => {
      var transporter = nodemailer.createTransport(
        //* Enable these links below
        //* https://accounts.google.com/DisplayUnlockCaptcha
        //* https://myaccount.google.com/lesssecureapps
        {
          // config mail server
          // service: process.env.SMTP_SERVICE,
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: false,
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
          },
        }
      );

      var options = {
        // thiết lập đối tượng, nội dung gửi mail
        from: mailOptions.from || `cxStudio 🌠<` + process.env.SMTP_EMAIL + `>`,
        to: mailOptions.to,
        subject: mailOptions.subject,
        text: mailOptions.text || "",
        html: mailOptions.html || "",
        // attachments: [
        //   {
        //     // Use a URL as an attachment
        //     filename: "your-testla.png",
        //     path: "https://media.gettyimages.com/photos/view-of-tesla-model-s-in-barcelona-spain-on-september-10-2018-picture-id1032050330?s=2048x2048",
        //   },
        // ],
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
          console.log("Message sent: " + info.response);
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
