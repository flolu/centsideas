import {IdeaDescription} from './idea-description';
import {IdeaDescriptionTooLong} from './errors/idea-description-too-long';

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
    expect(() => IdeaDescription.fromString('to long '.repeat(500))).toThrowError(
      IdeaDescriptionTooLong,
    );
  });

  it('it sanitizes input strings', () => {
    const insane = 'This<script>alert("Muhaha");</script> is not good!';
    const sane = 'This is not good!';
    expect(IdeaDescription.fromString(insane).toString()).toEqual(sane);
  });
});
