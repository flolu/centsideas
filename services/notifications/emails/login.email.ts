import { IUserState } from '@centsideas/models';

const suject = 'CENTS Ideas Login Confirmation';
const sujectFirst = 'Complete Your Sign Up at CENTS Ideas';

const html = (url: string, user?: IUserState) =>
  `
<p>Hey ${user ? user.username : 'there'}!</p>
<p>Click the button below to sign back in</p>
<a href="${url}">Let's Go</a>
`;
const htmlFirst = (url: string) =>
  `
  <p>Glad to have you!</p>
  <p>Click the button below to finish the sign up</p>
  <a href="${url}">Let's Go</a>
`;

const text = (url: string, user?: IUserState) =>
  `
Hey ${user ? user.username : 'there'}!
To sign in, just open the link below:

${url}
`;
const textFirst = (url: string) =>
  `
Glad to have you!
Finish your sign up by navigating to the link below:

${url}
`;

export const LoginEmail = {
  suject,
  sujectFirst,
  html,
  htmlFirst,
  text,
  textFirst,
};
