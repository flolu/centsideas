import * as Errors from './idea.errors';
import {IdeaDescription} from './idea-description';

describe('IdeaDescription', () => {
  const description = 'This is idea is meant to be great, but also a dummy mock test description!';

  it('creates valid descriptions from string', () => {
    expect(() => {
      IdeaDescription.fromString(description);
    }).not.toThrow();
  });

  it('converts descriptions to string', () => {
    expect(IdeaDescription.fromString(description).toString()).toEqual(description);
  });

  it('recognizes descriptions, that are too long', () => {
    const tooLong = 'too long '.repeat(500);
    expect(() => IdeaDescription.fromString(tooLong)).toThrowError(
      new Errors.IdeaDescriptionTooLong(tooLong),
    );
  });

  it('it sanitizes input strings', () => {
    const insane = 'This<script>alert("Muhaha");</script> is not good!';
    const sane = 'This is not good!';
    expect(IdeaDescription.fromString(insane).toString()).toEqual(sane);
  });
});
