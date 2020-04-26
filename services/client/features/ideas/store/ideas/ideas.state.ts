import { EntityState } from '@ngrx/entity';

import { IIdeaViewModel } from '@centsideas/models';
import { LoadStatus } from '@cic/shared';

export interface IIdeasReducerState extends EntityState<IIdeaViewModel> {
  error: string | null;
  pageStatus: LoadStatus;
}
