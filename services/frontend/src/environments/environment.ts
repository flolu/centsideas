export const environment = {
  production: false,
  routing: {
    ideas: {
      name: 'ideas',
    },
    auth: {
      // TODO don't hard-code those strings
      login: {
        name: 'login',
      },
      confirmSignUp: {
        name: 'confirm-sign-up',
      },
      confirmLogin: {
        name: 'confirm-login',
      },
    },
    user: {
      name: 'user',
    },
  },
  tokenKey: 'token',
};
