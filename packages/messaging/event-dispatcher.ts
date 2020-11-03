import {injectable} from 'inversify'
import {Kafka, Message} from 'kafkajs'

import {Config} from '@centsideas/config'
import {Logger} from '@centsideas/common/helpers'

@injectable()
export class EventDispatcher {
  private kafka = new Kafka({brokers: this.config.getArray('kafka.brokers')})
  private producer = this.kafka.producer()
  private connected = false

  constructor(private readonly config: Config, private readonly logger: Logger) {
    this.connect()
  }

  async dispatch(topic: string, messages: Message[]) {
    await this.connect()
    await this.producer.send({topic, messages})
    this.logger.log('[dispatch]', topic, messages)
  }

  async disconnect() {
    await this.producer.disconnect()
    this.connected = false
  }

  isConnected() {
    return this.connected
  }

  private async connect() {
    if (!this.connected) {
      await this.producer.connect()
      this.connected = true
    }
  }
}
