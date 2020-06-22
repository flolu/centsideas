import * as protobuf from 'protobufjs';
import * as path from 'path';

import {EventName} from '@centsideas/types';
import {PersistedEvent} from '@centsideas/models';

export abstract class SchemaMessage {
  protected abstract name: string;
  protected abstract package: string;
  protected abstract proto: string;

  encode(event: PersistedEvent) {
    const Message = this.Message;
    const eventName = EventName.fromString(event.name);
    const message = Message.create({...event, data: {[eventName.name]: event.data}});
    return Message.encode(message).finish() as Buffer;
  }

  decode(buffer: Buffer, eventName: EventName): PersistedEvent {
    const Message = this.Message;
    const decoded: PersistedEvent = Object(Message.decode(buffer));
    const data = (decoded.data as any)[eventName.name];
    return {...decoded, data};
  }

  private get Message() {
    const root = protobuf.loadSync(path.join(__dirname, this.package, this.proto));
    return root.lookupType(this.name);
  }
}
