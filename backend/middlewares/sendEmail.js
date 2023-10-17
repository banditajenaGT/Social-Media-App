const nodeMailer = require("nodemailer")


exports.sendEmail = async (options) => {
  // const transpoter=nodeMailer.createTransport({
  //     host:process.env.SMPT_HOST,
  //     port:process.env.SMPT_PORT,
  //     auth:{
  //         user:process.env.SMPT_MAIL,
  //         pass:process.env.SMPT_PASSWORD
  //     },
  //     service:process.env.SMPT_SERVICE
  // })
  var transporter = nodeMailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "84e7492866c0c5",
      pass: "c9dc2867879ee6"
    }
  });
  const mailOptions = {
    // from:process.env.SMPT_MAIL,
    from: "",
    to: options.email,
    subject: options.subject,
    text: options.message
  }
  await transporter.sendMail(mailOptions)
}