import {IdeaTitle} from './idea-title';
import {IdeaTitleTooShort} from './errors/idea-title-too-short';
import {IdeaTitleTooLong} from './errors/idea-title-too-long';

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
    expect(() => IdeaTitle.fromString('no')).toThrowError(new IdeaTitleTooShort());
    expect(() => IdeaTitle.fromString('')).toThrowError(new IdeaTitleTooShort());
  });

  it('recognizes titles, that are too long', () => {
    expect(() => IdeaTitle.fromString('to long '.repeat(50))).toThrowError(new IdeaTitleTooLong());
  });

  it('it sanitizes input strings', () => {
    const insane = 'This<script>alert("Muhaha");</script> is not good!';
    const sane = 'This is not good!';
    expect(IdeaTitle.fromString(insane).toString()).toEqual(sane);
  });
});
