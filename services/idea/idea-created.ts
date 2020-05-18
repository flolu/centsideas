import {IdeaId, UserId} from '@centsideas/types';

export class IdeaCreated {
  // TODO how to enforce events to have thos properties when typescript cant handle abstract static props?
  static readonly eventName = 'idea.created';

  constructor(public readonly id: IdeaId, public readonly userId: UserId) {}

  // NOW serialize and deserialize
}
