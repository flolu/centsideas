import { IEmailContent } from '../models';

const subject = 'Your Email Adress Has Been Updated';
const html = (newEmail: string) =>
  `
<p>You have successfully changed your email to ${newEmail}</p>
`;
const text = (newEmail: string) =>
  `
You have successfully changed your email to ${newEmail}
`;

export const getEmailChangedEmail = (newEmail: string): IEmailContent => ({
  subject,
  html: html(newEmail),
  text: text(newEmail),
});
