export abstract class EventRepository {
  constructor() {}

  // FIXME type
  abstract async save(entity: any): Promise<any>;
  abstract async findById(id: string): Promise<any>;
}
