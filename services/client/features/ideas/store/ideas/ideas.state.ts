import { EntityState } from '@ngrx/entity';

import { IIdeaViewModel } from '@centsideas/models';

export interface IIdeasReducerState extends EntityState<IIdeaViewModel> {
  // TODO not sure about status (maybe one for loading list and one for page?)
  error: string | null;
}
