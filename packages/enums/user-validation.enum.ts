export enum UsernameLength {
  Max = 30,
  Min = 3,
}

export const UsernameRegex = new RegExp('^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$');
