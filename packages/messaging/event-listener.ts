import {injectable} from 'inversify'
import {Kafka, Consumer, EachMessagePayload} from 'kafkajs'
import {Observable, Observer} from 'rxjs'

import {Config} from '@centsideas/config'
import {Logger} from '@centsideas/common/helpers'

@injectable()
export class EventListener {
  private readonly brokers = this.config.getArray('kafka.brokers')
  private kafka = new Kafka({brokers: this.brokers})
  private consumers: Consumer[] = []
  private consumerConnections: boolean[] = []

  constructor(private readonly config: Config, private readonly logger: Logger) {}

  // FIXME don't acknowledge message if error is thrown in observer.next?
  async consume(groupId: string, topic: string | RegExp, fromBeginning = false) {
    const consumer = this.kafka.consumer({groupId})
    this.consumers.push(consumer)
    this.consumerConnections.push(false)
    const index = this.consumerConnections.length - 1

    consumer.on('consumer.disconnect', () => {
      this.consumerConnections[index] = false
    })

    await consumer.connect()
    this.logger.log('connected to consumer for topic', topic)
    this.consumerConnections[index] = true
    await consumer.subscribe({topic, fromBeginning})
    return new Observable((observer: Observer<EachMessagePayload>) => {
      consumer.run({
        eachMessage: async message => {
          this.logger.log('[consume]:', topic, JSON.parse(message.message.value?.toString()!))
          observer.next(message)
        },
      })
    })
  }

  async disconnectAll() {
    await Promise.all(this.consumers.map(c => c.disconnect()))
    this.consumers = []
    this.consumerConnections = []
  }

  isConnected() {
    for (const connected of this.consumerConnections) {
      if (!connected) return false
    }
    return true
  }
}
