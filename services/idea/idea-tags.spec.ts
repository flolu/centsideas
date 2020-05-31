import 'reflect-metadata';

import {IdeaTagsCount} from '@centsideas/enums';

import * as Errors from './idea.errors';
import {IdeaTags} from './idea-tags';

describe('IdeaTags', () => {
  const tags = ['mock', 'test', 'idea', 'awesome'];

  it('creates valid tags from string array', () => {
    expect(() => IdeaTags.fromArray(tags)).not.toThrow();
  });

  it('converts tags to string array', () => {
    expect(IdeaTags.fromArray(tags).toArray()).toEqual(tags);
  });

  it('recognizes too many tags', () => {
    const tooMany: string[] = [];
    for (let i = 0; i < 10; i++) {
      tags.forEach(t => tooMany.push(`${t}${i}`));
    }
    expect(() => IdeaTags.fromArray(tooMany)).toThrowError(new Errors.TooManyIdeaTags(tooMany));
  });

  it('recognizes tags, that are too short', () => {
    const tooShort = 't';
    expect(() => IdeaTags.fromArray(['has', tooShort, 'short', 'tags'])).toThrowError(
      new Errors.IdeaTagTooShort(tooShort),
    );
  });

  it('recognizes tags, that are too long', () => {
    const tooLong = 'too long'.repeat(10);
    expect(() => IdeaTags.fromArray(['has', tooLong])).toThrowError(
      new Errors.IdeaTagTooLong(tooLong),
    );
  });

  it('sanitizes tags', () => {
    const insane = ['good', 'sane', 'insa<script></script>ne', 'ok'];
    const sane = ['good', 'sane', 'insane', 'ok'];
    expect(IdeaTags.fromArray(insane).toArray()).toEqual(sane);
  });

  it('removes duplicates', () => {
    const dup = ['duplicate', 'tag', 'duplicate', 'twice', 'twice', 'twice', 'dont', 'dont-remove'];
    const dedup = ['duplicate', 'tag', 'twice', 'dont', 'dont-remove'];
    expect(IdeaTags.fromArray(dup).toArray()).toEqual(dedup);
  });

  it('removes tags', () => {
    const base = IdeaTags.fromArray(tags);
    const remove = IdeaTags.fromArray(['test', 'awesome', 'not included']);
    base.remove(remove);
    expect(base.toArray()).toEqual(['mock', 'idea']);
  });

  it('adds tags', () => {
    const base = IdeaTags.fromArray(tags);
    const add = IdeaTags.fromArray(['add', 'other']);
    base.add(add);
    expect(base.toArray()).toEqual([...tags, 'add', 'other']);
  });

  it('does not add duplicate tags', () => {
    const base = IdeaTags.fromArray(tags);
    const add = IdeaTags.fromArray(['add', 'add', 'idea']);
    base.add(add);
    expect(base.toArray()).toEqual([...tags, 'add']);
  });

  it('sanitizes tags when adding new tags', () => {
    const base = IdeaTags.fromArray(tags);
    const add = IdeaTags.fromArray(['add', 'insa<script></script>ne']);
    base.add(add);
    expect(base.toArray()).toEqual([...tags, 'add', 'insane']);
  });

  it('checks max tag count when adding tags', () => {
    const base = IdeaTags.fromArray(tags);
    const tooMany: string[] = [];
    for (let i = 0; i < IdeaTagsCount.Max; i++) {
      tooMany.push(`dummy${i}`);
    }
    expect(() => base.add(IdeaTags.fromArray(tooMany))).toThrowError(
      new Errors.TooManyIdeaTags(tooMany),
    );
  });

  it('creates empty tag list', () => {
    const empty = IdeaTags.empty();
    expect(empty.toArray()).toEqual([]);
  });

  it('it removes whitespaces from tags', () => {
    const t = IdeaTags.fromArray(['white space', 'with empty chars']);
    expect(t.toArray()).toEqual(['white-space', 'with-empty-chars']);
  });

  it('finds difference', () => {
    const base = IdeaTags.fromArray(tags);
    const changed = IdeaTags.fromArray(['mock', 'inserted', 'idea', 'wow']);
    const {removed, added} = base.findDifference(changed);
    expect(removed.toArray()).toEqual(['test', 'awesome']);
    expect(added.toArray()).toEqual(['inserted', 'wow']);
  });
});
