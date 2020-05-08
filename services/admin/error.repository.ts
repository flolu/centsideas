import { KafkaMessage } from 'kafkajs';
import { injectable, inject } from 'inversify';

import { EventRepository } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';
import { IErrorOccurredPayload } from '@centsideas/models';

import { ErrorEntity } from './error.entity';
import { AdminEnvironment } from './admin.environment';

@injectable()
export class ErrorRepository extends EventRepository<ErrorEntity> {
  constructor(@inject(AdminEnvironment) env: AdminEnvironment) {
    super(ErrorEntity, env.adminDatabaseUrl, env.errorDatabaseName, EventTopics.Ideas);
  }

  handleErrorOccurred = async (kafkaMessage: KafkaMessage) => {
    const payload: IErrorOccurredPayload = JSON.parse(kafkaMessage.value.toString());
    const errorId = await this.generateAggregateId();
    const error = ErrorEntity.create({ ...payload, errorId });
    const created = await this.save(error);
    return created.persistedState;
  };
}
