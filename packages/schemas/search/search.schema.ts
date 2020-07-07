export interface SearchIdeaPayload {
  input: string;
}

export interface SearchIdeaResult {
  hits: IdeaSearchHit[];
}

export interface IdeaSearchHit {
  score: number;
  id: string;
  userId: string;
  title: string;
  description: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
}

export interface Service {
  searchIdeas: (payload: SearchIdeaPayload) => Promise<SearchIdeaResult>;
}
