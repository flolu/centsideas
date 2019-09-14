export interface ISaveIdeaDto {
  title?: string;
  description?: string;
}

export interface ICommitIdeaDraftDto extends ISaveIdeaDto {}
export interface IUpdateIdeaDraftDto extends ISaveIdeaDto {}

export interface IQueryIdeaDto {
  id: string;
}
