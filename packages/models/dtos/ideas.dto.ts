// TODO maybe move to protobuf package
export interface ICreateIdeaDto {
  title: string;
  description: string;
  userId: string;
}

export interface IUpdateIdeaDto {
  title: string;
  description: string;
  userId: string;
  ideaId: string;
}

export interface IDeleteIdeaDto {
  userId: string;
  ideaId: string;
}
