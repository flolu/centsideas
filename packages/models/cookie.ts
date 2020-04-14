import { CookieOptions } from 'express';

// TODO make cookie a class with constructor
export interface Cookie {
  name: string;
  val: string;
  options: CookieOptions;
}
