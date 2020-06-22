export interface IdeaModel {
  id: string;
  userId: string;
  title: string | undefined;
  description: string | undefined;
  tags: string[];
  createdAt: string;
  publishedAt: string | undefined;
  deletedAt: string | undefined;
  lastEventVersion: number;
  updatedAt: string;
}

export interface IdeaCreatedData {
  id: string;
  userId: string;
  createdAt: string;
}

export interface IdeaDeletedData {
  deletedAt: string;
}

export interface IdeaDescriptionEditedData {
  description: string;
}

export interface IdeaPublishedData {
  publishedAt: string;
}

export interface IdeaRenamedData {
  title: string;
}

export interface IdeaTagsAddedData {
  tags: string[];
}

export interface IdeaTagsRemovedData {
  tags: string[];
}
