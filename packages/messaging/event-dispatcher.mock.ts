import {injectable} from 'inversify'
import {EachMessagePayload, KafkaMessage, Message} from 'kafkajs'

import {Timestamp} from '@centsideas/common/types'

import {MockEmitter} from './mock-emitter'

@injectable()
export class EventDispatcherMock {
  constructor(private emitter: MockEmitter) {}

  async dispatch(topic: string, messages: Message[]) {
    for (const message of messages) {
      const fakeKafkaMessage: KafkaMessage = {
        key: Buffer.from(message.key?.toString() || ''),
        value: Buffer.from(message.value || ''),
        timestamp: message.timestamp || Timestamp.now().toString(),
        size: 0,
        attributes: 0,
        offset: '',
      }
      const payload: EachMessagePayload = {topic, message: fakeKafkaMessage, partition: 0}
      this.emitter.emit(topic, payload)
    }
  }
}
