import {Id} from '@centsideas/common/types'

import {SerializedSnapshot, Snapshot} from './snapshot'

interface State {
  balance: number
  isClosed: boolean
}

describe('snapshot', () => {
  const aggregateId = Id.generate()
  const state: State = {balance: 100, isClosed: false}
  const version = 42

  const serialized: SerializedSnapshot<State> = {
    aggregateId: aggregateId.toString(),
    version,
    state,
  }

  it('can be created from serialized object', () => {
    const snapshot = Snapshot.fromObject(serialized)
    expect(snapshot.aggregateId).toEqual(aggregateId)
    expect(snapshot.version).toEqual(version)
    expect(snapshot.state).toEqual(state)
  })

  it('can be serialized', () => {
    const snapshot = new Snapshot(aggregateId, version, state)
    expect(snapshot.serialize()).toEqual(serialized)
    expect(snapshot).toEqual(Snapshot.fromObject(serialized))
  })
})
