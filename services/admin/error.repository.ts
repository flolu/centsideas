import { KafkaMessage } from 'kafkajs';
import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';
import { IErrorOccurredPayload } from '@centsideas/models';

import { ErrorEntity } from './error.entity';
import { AdminEnvironment } from './admin.environment';

@injectable()
export class ErrorRepository extends EventRepository<ErrorEntity> {
  constructor(private _messageBroker: MessageBroker, private _env: AdminEnvironment) {
    super(
      _messageBroker.dispatchEvents,
      ErrorEntity,
      _env.adminDatabaseUrl,
      _env.errorDatabaseName,
      EventTopics.Ideas,
    );
  }

  handleErrorOccurred = async (kafkaMessage: KafkaMessage) => {
    const payload = JSON.parse(kafkaMessage.value.toString());
    const {
      occurredAt,
      unexpected,
      service,
      stack,
      details,
      name,
      message,
    }: IErrorOccurredPayload = payload;

    const errorId = await this.generateAggregateId();
    const error = ErrorEntity.create(
      errorId,
      occurredAt,
      unexpected,
      service,
      stack,
      details,
      name,
      message,
    );

    const created = await this.save(error);
    return created.persistedState;
  };
}
