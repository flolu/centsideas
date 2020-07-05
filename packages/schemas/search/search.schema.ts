export interface SearchIdeaPayload {
  input: string;
}

export interface Service {
  searchIdeas: (
    payload: SearchIdeaPayload,
  ) => Promise<{
    hits: {id: string; title: string; description: string; tags: string}[];
  }>;
}
