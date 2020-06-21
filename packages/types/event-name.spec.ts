import 'reflect-metadata';

import {EventName, EventNameInvalid} from './event-name';

describe('EventName', () => {
  it('can be created from a string', () => {
    const name1 = EventName.fromString('aggregate:eventName');
    expect(name1.aggregate).toEqual('aggregate');
    expect(name1.name).toEqual('eventName');

    const name2 = EventName.fromString('service.aggregate:eventName');
    expect(name2.aggregate).toEqual('aggregate');
    expect(name2.name).toEqual('eventName');
    expect(name2.service).toEqual('service');
  });

  it('converts to string', () => {
    const name1 = new EventName('eventName', 'aggregate');
    expect(name1.toString()).toEqual('aggregate:eventName');

    const name2 = new EventName('eventName', 'aggregate', 'service');
    expect(name2.toString()).toEqual('service.aggregate:eventName');
  });

  it('detects wrong inputs', () => {
    expect(() => new EventName('no.dots', 'aggregate')).toThrowError(
      new EventNameInvalid('no.dots'),
    );
    expect(() => new EventName('no:columns', 'aggregate')).toThrowError(
      new EventNameInvalid('no:columns'),
    );
    expect(() => new EventName('alright', ':')).toThrowError(new EventNameInvalid(':'));
    expect(() => new EventName('alright', '.')).toThrowError(new EventNameInvalid('.'));
    expect(() => new EventName('alright', 'ok', ':')).toThrowError(new EventNameInvalid(':'));
    expect(() => new EventName('alright', 'ok', '.')).toThrowError(new EventNameInvalid('.'));
    expect(() => new EventName('', 'ok')).toThrowError(new EventNameInvalid(''));
  });
});
