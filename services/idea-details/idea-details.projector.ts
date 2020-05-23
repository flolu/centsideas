import {injectable} from 'inversify';

import {EventListener} from '@centsideas/event-sourcing2';
import {EventTopics, IdeaEventNames} from '@centsideas/enums';
import {Logger} from '@centsideas/utils';
import {GlobalEnvironment} from '@centsideas/environment';
import {
  IdeaCreatedData,
  IdeaDeletedData,
  IdeaDescriptionEditedData,
  IdeaPublishedData,
  IdeaRenamedData,
  IdeaTagsAddedData,
  IdeaTagsRemovedData,
} from '@centsideas/models';

interface IdeaDetail {
  id: string;
  userId: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  publishedAt: string;
  deletedAt: string;
  // NOW consider storing last event id or something similar?!
}

@injectable()
export class IdeaDetailsProjector {
  bookmark = -1;
  documents: Record<string, IdeaDetail> = {};

  constructor(
    // NOW factory + set consumenr group id
    private eventListener: EventListener,
    private logger: Logger,
    private globalEnv: GlobalEnvironment,
  ) {
    this.logger.info('launch in', this.globalEnv.environment, 'mode');
    this.eventListener.listen(EventTopics.Idea).subscribe(message => {
      const eventName = message.headers?.eventName.toString();
      if (!eventName) return;

      const value = JSON.parse(message.value.toString());
      const data = value.data;
      this.logger.info(eventName, value);

      switch (eventName) {
        case IdeaEventNames.Created:
          return this.created(data);
        case IdeaEventNames.Deleted:
          return this.deleted(data);
        case IdeaEventNames.DescriptionEdited:
          return this.descriptionEdited(data);
        case IdeaEventNames.Published:
          return this.published(data);
        case IdeaEventNames.Renamed:
          return this.renamed(data);
        case IdeaEventNames.TagsAdded:
          return this.tagsAdded(data);
        case IdeaEventNames.TagsRemoved:
          return this.tagsRemoved(data);
      }
    });
  }

  created({id, userId, createdAt}: IdeaCreatedData) {
    this.documents[id] = {
      id,
      userId,
      createdAt,
      title: '',
      description: '',
      tags: [],
      publishedAt: '',
      deletedAt: '',
    };
  }

  deleted({id, deletedAt}: IdeaDeletedData) {
    this.documents[id].deletedAt = deletedAt;
  }

  descriptionEdited({id, description}: IdeaDescriptionEditedData) {
    this.documents[id].description = description;
  }

  published({id, publishedAt}: IdeaPublishedData) {
    this.documents[id].publishedAt = publishedAt;
  }

  renamed({id, title}: IdeaRenamedData) {
    this.documents[id].title = title;
  }

  tagsAdded({id, tags}: IdeaTagsAddedData) {
    this.documents[id].tags.push(...tags);
  }

  tagsRemoved({id, tags}: IdeaTagsRemovedData) {
    this.documents[id].tags = this.documents[id].tags.filter(t => !tags.includes(t));
  }
}
