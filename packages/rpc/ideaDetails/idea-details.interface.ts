// NOW return type
type GetIdeaById = (payload: {id: string}) => Promise<any>;

export interface IdeaDetails {
  getById: GetIdeaById;
}
