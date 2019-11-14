import { EntityState } from '@ngrx/entity';

import { IIdeaViewModel } from '@cents-ideas/models';

export interface IdeasState extends EntityState<IIdeaViewModel> {
  loading: boolean;
  loaded: boolean;
  error: string;
}
