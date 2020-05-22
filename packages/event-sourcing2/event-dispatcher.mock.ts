import {Message} from 'kafkajs';
import {injectable} from 'inversify';

@injectable()
export class EventDispatcherMock {
  async dispatch(_topic: string, _messages: Message[]) {
    //
  }
}
