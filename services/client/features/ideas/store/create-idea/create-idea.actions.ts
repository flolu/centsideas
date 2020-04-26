import * as __ngrxStoreTypes from '@ngrx/store/src/models';

import { createAction, props } from '@ngrx/store';

import { IIdeaState, Dtos } from '@centsideas/models';
import { appPrefix, failSuffix, doneSuffix } from '@cic/shared';

const prefix = `${appPrefix}/ideas`;
const createPrefix = prefix + '/create';

// TODO sync draft actions

const createIdea = createAction(createPrefix, props<Dtos.ICreateIdeaDto>());
const createIdeaDone = createAction(createPrefix + doneSuffix, props<{ created: IIdeaState }>());
const createIdeaFail = createAction(createPrefix + failSuffix, props<{ error: string }>());

export const CreateIdeaActions = {
  createIdea,
  createIdeaDone,
  createIdeaFail,
};
