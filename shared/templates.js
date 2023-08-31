export const TEMPLATES = {
  EMAIL: {
    VERIFICATION_CODE: `
      <table align="center" cellpadding="0" cellspacing="0" border="0" width="100%"bgcolor="#f0f0f0">
        <tr>
          <td style="padding: 30px 30px 20px 30px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#ffffff" style="max-width: 479px; margin: auto;">
              <tr>
                  <td colspan="2" align="left" style="border-top:6px solid #333; border-bottom:1px solid #eee; border-radius: 4px 4px 0 0; padding: 15px 40px;">
                    <h2 style="margin: 0; line-height: 40px; font-weight:300; font-family: 'Nunito Sans', Arial, Verdana, Helvetica, sans-serif; text-align: left; padding: 0;">
                      Verification code
                    </h2>
                  </td>
              </tr>
              <tr>
                  <td style="text-align: left; padding: 20px 40px;" valign="top">
                      <p style="font-size: 18px; margin: 0; line-height: 24px; font-family: 'Nunito Sans', Arial, Verdana, Helvetica, sans-serif; text-align: left; padding-bottom: 1%;">
                          Hi {{user.givenname}},
                      </p>
                      <p style="font-size: 18px; margin: 0; line-height: 24px; font-family: 'Nunito Sans', Arial, Verdana, Helvetica, sans-serif; text-align: left; padding-bottom: 3%;">
                          Please use this one time password to sign in to your application:
                      </p>
                      <h2 style="margin: 0 auto;width: max-content;padding: 5px 10px;color: #fff;border-radius: 4px; letter-spacing: 4px;">
                        <img src='{{OTPCode}}' alt='qr-code' />
                      </h2>
                      <h3 style="font-weight: 300; margin: 15px auto; width: max-content;">Your token expires in 3 minutes</h3>
                  </td>
              </tr>
              <tr>
                  <td align="left" style="padding: 20px 40px; border-bottom:1px solid #eee" valign="top">
                      <p style="font-size: 18px; margin: 0; line-height: 24px; font-family: 'Nunito Sans', Arial, Verdana, Helvetica, sans-serif; text-align: left;">
                          Thank you for using our application. <br />
                          <span>Regards,<span/>
                      </p>
                  </td>
              </tr>
              <tr>
                  <td colspan="2" align="left" style="padding: 0 40px 0; border-bottom:6px solid #333; border-radius: 0 0 4px 4px;">
                    <div style="float:left;padding:0;color:#aaa;font-size:0.8em;line-height:10px;">
                      <p>{{yourBand}} Inc</p>
                      <p>1600 Amphitheatre Parkway</p>
                      <p>California</p>
                    </div>
                  </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
    RECOVERY_PASSWORD: `
      <table align="center" cellpadding="0" cellspacing="0" border="0" width="100%"bgcolor="#f0f0f0">
        <tr>
          <td style="padding: 30px 30px 20px 30px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#ffffff" style="max-width: 479px; margin: auto;">
              <tr>
                  <td colspan="2" align="left" style="border-top:6px solid #333; border-bottom:1px solid #eee; border-radius: 4px 4px 0 0; padding: 15px 40px;">
                    <h2 style="margin: 0; line-height: 40px; font-weight:300; font-family: 'Nunito Sans', Arial, Verdana, Helvetica, sans-serif; text-align: left; padding: 0;">
                      Recovery password
                    </h2>
                  </td>
              </tr>
              <tr>
                  <td style="text-align: left; padding: 20px 40px;" valign="top">
                      <p style="font-size: 18px; margin: 0; line-height: 24px; font-family: 'Nunito Sans', Arial, Verdana, Helvetica, sans-serif; text-align: left; padding-bottom: 1%;">
                          Hi {{user.givenname}},
                      </p>
                      <p style="font-size: 18px; margin: 0; line-height: 24px; font-family: 'Nunito Sans', Arial, Verdana, Helvetica, sans-serif; text-align: left; padding-bottom: 3%;">
                          Your password has been reset, please use this one to sign in your application:
                      </p>
                      <h2 style="background: #333;margin: 0 auto;width: max-content;padding: 5px 10px;color: #fff;border-radius: 4px; letter-spacing: 4px;">{{password}}</h2>
                  </td>
              </tr>
              <tr>
                  <td align="left" style="padding: 20px 40px; border-bottom:1px solid #eee" valign="top">
                      <p style="font-size: 18px; margin: 0; line-height: 24px; font-family: 'Nunito Sans', Arial, Verdana, Helvetica, sans-serif; text-align: left;">
                          Thank you for using our application. <br />
                          <span>Regards,<span/>
                      </p>
                  </td>
              </tr>
              <tr>
                  <td colspan="2" align="left" style="padding: 0 40px 0; border-bottom:6px solid #333; border-radius: 0 0 4px 4px;">
                    <div style="float:left;padding:0;color:#aaa;font-size:0.8em;line-height:10px;">
                      <p>{{yourBand}} Inc</p>
                      <p>1600 Amphitheatre Parkway</p>
                      <p>California</p>
                    </div>
                  </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  },
};
