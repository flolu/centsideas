export interface ICreateIdeaDto {
  title: string;
  description: string;
}

export interface IUpdateIdeaDto extends ICreateIdeaDto {
  id: string;
}
