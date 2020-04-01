import * as sgMail from '@sendgrid/mail';

export const sendMail = (
  from: string,
  to: string,
  subject: string,
  text: string,
  html: string,
  apiKey: string,
): Promise<any> => {
  sgMail.setApiKey(apiKey);
  const message = { to, from, subject, text, html };
  return sgMail.send(message);
};
