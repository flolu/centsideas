import {CookieOptions} from 'express';

export class Cookie {
  constructor(public name: string, public val: string, public options: CookieOptions = {}) {
    return {name, val, options};
  }
}
