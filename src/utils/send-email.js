import nodemailer from "nodemailer";

export const sendEmail = async (email = "", subj = "", msg = "") => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.APP_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
    to: email,
    subject: subj,
    html: msg,
  });
};
