export abstract class DomainEvent {
  abstract readonly eventName: string;
  abstract serialize(): object;
  // FIXME wtf typescript, please support! https://github.com/microsoft/TypeScript/issues/34516
  // static abstract deserialize(serializedData: object): Object;
}

export type DomainEventInstance<T extends DomainEvent> = T;
