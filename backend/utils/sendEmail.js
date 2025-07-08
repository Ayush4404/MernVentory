const nodemailer = require("nodemailer");

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const options = {
    from: sent_from,
    to: send_to,
    replyTo: reply_to,
    subject: subject,
    html: message,
  };

  try {
    const info = await transporter.sendMail(options);
    console.log("Email sent: ", info.response);
  } catch (err) {
    console.error("Error sending email: ", err);
    throw new Error("Email failed to send");
  }
};

module.exports = sendEmail;
