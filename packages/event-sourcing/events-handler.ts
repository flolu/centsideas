import {injectable, inject, postConstruct} from 'inversify';

import {PersistedEvent} from '@centsideas/models';
import {Logger} from '@centsideas/utils';

import {EventListener} from './event-bus';
import {EVENTS_HANDLER_TOPICS} from './event-handler';

@injectable()
export abstract class EventsHandler {
  @inject(EventListener) private eventListener!: EventListener;
  @inject(Logger) private logger!: Logger;

  abstract consumerGroupName: string;

  @postConstruct()
  initialize() {
    const topics: string[] = Reflect.getMetadata(EVENTS_HANDLER_TOPICS, this);
    const topicsRegex = new RegExp(topics.join('|'));
    this.eventListener
      .listen(topicsRegex, this.consumerGroupName)
      // needs to be called via `=>` because `this` will change otherwise
      .subscribe(e => this.handleEvent(e));
  }

  get connected() {
    return this.eventListener.connected;
  }

  async disconnect() {
    await this.eventListener.disconnect();
  }

  private async handleEvent(event: PersistedEvent) {
    const handlerMethodName = Reflect.getMetadata(event.name, this);
    if (!handlerMethodName) return;
    if (!(this as any)[handlerMethodName])
      throw new Error(`No handler for event ${event.name} found!`);

    try {
      await (this as any)[handlerMethodName](event);
    } catch (error) {
      // FIXME handle errors that occured in event handlers?!
      error.message = `Error in event handler ${event.name}: ${error.message}`;
      this.logger.error(error);
    }
  }
}
