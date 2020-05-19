import {UserId, IdeaId, ISODate} from '@centsideas/types';

import {Idea} from './idea';

export class IdeaService {
  async create({userId}: any) {
    const user = UserId.fromString(userId);
    const id = IdeaId.generate();
    const timestamp = ISODate.now();

    const idea = Idea.create(id, user, timestamp);
    // TODO probably only return id?!
    return idea;
  }

  // async update() {}
  // async publish() {}
  // async delete() {}
}
