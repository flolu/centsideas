export interface IdeaDetailModel {
  id: string;
  userId: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  publishedAt: string;
  deletedAt: string;
}

export interface IdeaCreatedData {
  id: string;
  userId: string;
  createdAt: string;
}

export interface IdeaDeletedData {
  id: string;
  deletedAt: string;
}

export interface IdeaDescriptionEditedData {
  id: string;
  description: string;
}

export interface IdeaPublishedData {
  id: string;
  publishedAt: string;
}

export interface IdeaRenamedData {
  id: string;
  title: string;
}

export interface IdeaTagsAddedData {
  id: string;
  tags: string[];
}

export interface IdeaTagsRemovedData {
  id: string;
  tags: string[];
}
