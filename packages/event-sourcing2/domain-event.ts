export interface IDomainEvent {
  serialize(): object;
}

export type DomainEventInstance<T extends IDomainEvent> = T;

export const EVENT_NAME_METADATA = '__eventName__';

export const eventDeserializerMap = new Map();

export const DomainEvent = (name: string) => {
  // tslint:disable-next-line:ban-types
  return function DomainEventDecorator(target: Function) {
    Reflect.defineMetadata(EVENT_NAME_METADATA, name, target.prototype);
    const deserialize = (target as any).deserialize;
    if (!deserialize)
      throw new Error(
        `DomainEvent ${name} does not have a "static deserialize" method. Please implement it!`,
      );
    eventDeserializerMap.set(name, deserialize);
  };
};
