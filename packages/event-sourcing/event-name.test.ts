import 'reflect-metadata'

import {EventName, EventNameInvalid} from './event-name'

describe('event name', () => {
  it('can be created from a string', () => {
    const name1 = EventName.fromString('aggregate:eventName')
    expect(name1.aggregate).toEqual('aggregate')
    expect(name1.name).toEqual('eventName')

    const name2 = EventName.fromString('service.aggregate:eventName')
    expect(name2.aggregate).toEqual('aggregate')
    expect(name2.name).toEqual('eventName')
    expect(name2.service).toEqual('service')
  })

  it('converts to string', () => {
    const name1 = new EventName('eventName', 'aggregate')
    expect(name1.toString()).toEqual('aggregate:eventName')

    const name2 = new EventName('eventName', 'aggregate', 'service')
    expect(name2.toString()).toEqual('service.aggregate:eventName')
  })

  it('detects wrong inputs', () => {
    expect(() => new EventName('no.dots', 'aggregate')).toThrow(new EventNameInvalid('no.dots'))
    expect(() => new EventName('no:columns', 'aggregate')).toThrow(
      new EventNameInvalid('no:columns'),
    )
    expect(() => new EventName('alright', ':')).toThrow(new EventNameInvalid(':'))
    expect(() => new EventName('alright', '.')).toThrow(new EventNameInvalid('.'))
    expect(() => new EventName('alright', 'ok', ':')).toThrow(new EventNameInvalid(':'))
    expect(() => new EventName('alright', 'ok', '.')).toThrow(new EventNameInvalid('.'))
    expect(() => new EventName('', 'ok')).toThrow(new EventNameInvalid(''))
  })

  it('compares two event names', () => {
    const name1 = EventName.fromString('sample:tested')
    const name2 = EventName.fromString('service.sample:tested')
    expect(name1.equals(name1)).toBeTrue()
    expect(name1.equals(name2)).toBeFalse()
    expect(name2.equals(name1)).toBeFalse()

    expect(name1.equalsString(name1.toString())).toBeTrue()
    expect(name1.equalsString(name2.toString())).toBeFalse()
    expect(name2.equalsString(name1.toString())).toBeFalse()
  })
})
