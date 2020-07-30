import {
  IdeaTitleLength,
  RpcStatus,
  IdeaErrorNames,
  IdeaDescriptionLength,
  IdeaTagsLength,
  IdeaTagsCount,
} from '@centsideas/enums';
import {IdeaId, UserId} from '@centsideas/types';
import {Exception} from '@centsideas/utils';

export class IdeaAlreadyDeleted extends Exception {
  name = IdeaErrorNames.AlreadyDeleted;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(idea: IdeaId, user: UserId) {
    super('Idea has already been deleted', {ideaId: idea.toString(), userId: user.toString()});
  }
}

export class IdeaAlreadyPublished extends Exception {
  name = IdeaErrorNames.AlreadyPublished;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(idea: IdeaId, user: UserId) {
    super('Idea has already been published', {ideaId: idea.toString(), userId: user.toString()});
  }
}
export class IdeaTitleTooShort extends Exception {
  name = IdeaErrorNames.TitleTooShort;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(title: string) {
    super(`Idea title too short. Min length is ${IdeaTitleLength.Min}.`, {title});
  }
}

export class IdeaTitleRequired extends Exception {
  name = IdeaErrorNames.TitleRequired;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(idea: IdeaId, user: UserId) {
    super('Idea title is required', {ideaId: idea.toString(), userId: user.toString()});
  }
}
export class IdeaTitleTooLong extends Exception {
  name = IdeaErrorNames.TitleTooLong;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(title: string) {
    super(`Idea title too long. Max length is ${IdeaTitleLength.Max}!`, {title});
  }
}

export class IdeaDescriptionTooLong extends Exception {
  name = IdeaErrorNames.DescriptionTooLong;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(description: string) {
    super(`Idea description too long. Max length is ${IdeaDescriptionLength.Max}!`, {description});
  }
}

export class IdeaTagTooLong extends Exception {
  name = IdeaErrorNames.TagTooLong;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(tag: string) {
    super(`Idea tag ${tag} is too long. Max length is ${IdeaTagsLength.Max}!`, {tag});
  }
}

export class IdeaTagTooShort extends Exception {
  name = IdeaErrorNames.TagTooShort;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(tag: string) {
    super(`Idea tag ${tag} is too short. Min length is ${IdeaTagsLength.Min}!`, {tag});
  }
}

export class TooManyIdeaTags extends Exception {
  name = IdeaErrorNames.ToManyTags;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(tags: string[]) {
    super(`Too many tags. Max number of tags is ${IdeaTagsCount.Max}!`, {tags});
  }
}

export class NoPermissionToAccessIdea extends Exception {
  name = IdeaErrorNames.NoPermission;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(idea: IdeaId, user: UserId) {
    super(`No permission to access idea with id: ${idea.toString()}`, {
      ideaId: idea.toString(),
      userId: user.toString(),
    });
  }
}

export class IdeaNotFound extends Exception {
  name = IdeaErrorNames.NotFound;
  code = RpcStatus.NOT_FOUND;

  constructor(id: IdeaId) {
    super(`Idea with id ${id.toString()} was not found`);
  }
}
