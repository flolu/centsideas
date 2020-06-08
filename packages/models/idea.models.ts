export interface IdeaModel {
  id: string;
  userId: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  publishedAt: string;
  deletedAt: string;
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
