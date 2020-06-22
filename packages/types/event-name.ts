import {Exception} from '@centsideas/utils';
import {RpcStatus, EventSourcingErrorNames, EventTopics} from '@centsideas/enums';

export class EventName {
  private regex = new RegExp(/^[A-Z]+$/i);

  constructor(
    public readonly name: string,
    public readonly aggregate: string,
    public readonly service?: string,
  ) {
    if (!this.regex.exec(name)) throw new EventNameInvalid(name);
    if (!this.regex.exec(aggregate)) throw new EventNameInvalid(aggregate);
    if (service && !this.regex.exec(service)) throw new EventNameInvalid(service);
  }

  static fromString(rawName: string) {
    const [namespace, name] = rawName.split(':');
    const aggregate = namespace.includes('.')
      ? namespace.substring(namespace.lastIndexOf('.') + 1, namespace.length)
      : namespace;
    const service = namespace.includes('.')
      ? namespace.substring(0, namespace.indexOf('.'))
      : undefined;
    return new EventName(name, aggregate, service);
  }

  toString() {
    return this.service
      ? `${this.service}.${this.aggregate}:${this.name}`
      : `${this.aggregate}:${this.name}`;
  }

  getTopic() {
    const topic = this.service || this.aggregate;
    return `centsideas.events.${topic}` as EventTopics;
  }
}

export class EventNameInvalid extends Exception {
  code = RpcStatus.INVALID_ARGUMENT;
  name = EventSourcingErrorNames.InvalidEventName;

  constructor(invalidName: string) {
    super(`Event name ${invalidName} is invalid.`);
  }
}
