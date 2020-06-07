export enum SignInMethods {
  Email = 'email',
  Google = 'google',
}

export class SignInMethod {
  constructor(private readonly method: SignInMethods) {}

  static fromString(method: string) {
    if (!Object.values(SignInMethods).includes(method as any))
      throw new Error(`${method} is not a valid SignInMethod!`);
    return new SignInMethod(method as SignInMethods);
  }

  toString() {
    return this.method;
  }
}
