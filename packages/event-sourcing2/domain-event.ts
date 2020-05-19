export abstract class DomainEvent {
  abstract serialize(): object;
  // FIXME wtf typescript, please support! https://github.com/microsoft/TypeScript/issues/34516
  // static abstract deserialize(serializedData: any): Object;
  // static abstract readonly eventName: string;
}
