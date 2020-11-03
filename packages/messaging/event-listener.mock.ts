import {injectable} from 'inversify'
import {EachMessagePayload} from 'kafkajs'
import {Observable, Observer} from 'rxjs'

import {MockEmitter} from './mock-emitter'

@injectable()
export class EventListenerMock {
  constructor(private emitter: MockEmitter) {}

  async consume(_groupId: string, topic: string, _fromBeginning = false) {
    return new Observable((observer: Observer<EachMessagePayload>) => {
      this.emitter.addListener(topic, messsage => observer.next(messsage))
    })
  }

  async disconnectAll() {
    this.emitter.removeAllListeners()
  }
}
