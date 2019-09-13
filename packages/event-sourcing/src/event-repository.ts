import { IEntityConstructor, IEventEntity } from './event-entity';

export abstract class EventRepository<TEntity extends IEventEntity> {
  constructor(protected readonly Entity: IEntityConstructor<TEntity>) {}

  abstract async save(entity: TEntity): Promise<TEntity>;
  abstract async findById(id: string): Promise<TEntity | null>;
}
