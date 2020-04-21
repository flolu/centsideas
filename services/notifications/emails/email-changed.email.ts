const subject = 'Your Email Adress Has Been Updated';
const html = (newEmail: string) =>
  `
<p>You have successfully changed your email to ${newEmail}</p>
`;
const text = (newEmail: string) =>
  `
You have successfully changed your email to ${newEmail}
`;

export const EmailChangedEmail = {
  subject,
  html,
  text,
};
