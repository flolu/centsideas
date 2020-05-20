import {IdeaId, UserId} from '@centsideas/types';

export class NoPermissionToAccessIdea extends Error {
  constructor(idea: IdeaId, user: UserId) {
    super(
      `User with id ${user.toString()} has no permission to access idea with id: ${idea.toString()}`,
    );
  }
}
