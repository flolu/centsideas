import 'reflect-metadata';

import * as Errors from './idea.errors';
import {IdeaTitle} from './idea-title';

describe('IdeaTitle', () => {
  const title = 'My awesome idea';

  it('creates valid titles from string', () => {
    expect(() => {
      IdeaTitle.fromString(title);
    }).not.toThrow();
  });

  it('converts titles to string', () => {
    expect(IdeaTitle.fromString(title).toString()).toEqual(title);
  });

  it('recognizes titles, that are too short', () => {
    const tooShort = 'no';
    expect(() => IdeaTitle.fromString(tooShort)).toThrowError(
      new Errors.IdeaTitleTooShort(tooShort),
    );
    expect(() => IdeaTitle.fromString('')).toThrowError(new Errors.IdeaTitleTooShort(''));
  });

  it('recognizes titles, that are too long', () => {
    const tooLong = 'too long '.repeat(50);
    expect(() => IdeaTitle.fromString(tooLong)).toThrowError(new Errors.IdeaTitleTooLong(tooLong));
  });

  it('it sanitizes input strings', () => {
    const insane = 'This<script>alert("Muhaha");</script> is not good!';
    const sane = 'This is not good!';
    expect(IdeaTitle.fromString(insane).toString()).toEqual(sane);
  });
});
