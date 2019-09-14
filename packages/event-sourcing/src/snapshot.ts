export interface ISnapshot<EntityState = any> {
  lastEventId: string;
  state: EntityState;
}
