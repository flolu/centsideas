import {injectable, inject, postConstruct} from 'inversify';

import {PersistedEvent} from '@centsideas/models';

import {EventListener} from './event-bus';
import {EVENTS_HANDLER_TOPICS} from './event-handler';

@injectable()
export abstract class EventsHandler {
  @inject(EventListener) private eventListener!: EventListener;

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

  private async handleEvent(event: PersistedEvent) {
    const handlerMethodName = Reflect.getMetadata(event.name, this);
    // TODO consider converting all `throw new Error` to internal error excpection classes
    if (!handlerMethodName || !(this as any)[handlerMethodName])
      throw new Error(`No handler for event ${event.name} found!`);

    // TODO catch errors ... what to do then?
    await (this as any)[handlerMethodName](event);
  }
}
