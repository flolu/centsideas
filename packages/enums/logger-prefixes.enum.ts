export enum LoggerPrefixes {
  Gateway = 'gateway',
  Users = 'users',
  Reviews = 'reviews',
  Consumer = 'consumer',
  Ideas = 'ideas',
}

export const LoggerStyles: Record<string, string[]> = {
  [LoggerPrefixes.Gateway]: ['bold', 'inverse'],
  [LoggerPrefixes.Users]: ['bold', 'green'],
  [LoggerPrefixes.Ideas]: ['bold', 'yellow'],
  [LoggerPrefixes.Reviews]: ['bold', 'cyan'],
  [LoggerPrefixes.Consumer]: ['bold', 'blue'],
  undefined: ['bold', 'strikethrough'],
};
