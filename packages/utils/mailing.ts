import * as nodemailer from 'nodemailer';

interface ISendMailOptions {
  service: string;
  user: string;
  password: string;
}

export const sendMail = (
  from: string,
  to: string,
  subject: string,
  text: string,
  html: string,
  options: ISendMailOptions,
): Promise<any> => {
  const message: nodemailer.SendMailOptions = { from, to, subject, text, html };
  const transporter = nodemailer.createTransport({
    service: options.service,
    auth: {
      user: options.user,
      pass: options.password,
    },
  });
  return transporter.sendMail(message);
};
