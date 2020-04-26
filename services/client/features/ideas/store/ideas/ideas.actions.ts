import * as __ngrxStoreTypes from '@ngrx/store/src/models';

import { createAction, props } from '@ngrx/store';

import { IIdeaViewModel } from '@centsideas/models';
import { appPrefix, failSuffix, doneSuffix } from '@cic/shared';

const prefix = `${appPrefix}/ideas`;
const getPrefix = prefix + '/get';
const getByIdPrefix = prefix + '/get-by-id';

const getIdeas = createAction(getPrefix);
const getIdeasDone = createAction(getPrefix + doneSuffix, props<{ ideas: IIdeaViewModel[] }>());
const getIdeasFail = createAction(getPrefix + failSuffix, props<{ error: string }>());

const getIdeaById = createAction(getByIdPrefix, props<{ id: string }>());
const getIdeaByIdDone = createAction(getByIdPrefix + doneSuffix, props<{ idea: IIdeaViewModel }>());
const getIdeaByIdFail = createAction(getByIdPrefix + failSuffix, props<{ error: string }>());

export const IdeasActions = {
  getIdeas,
  getIdeasDone,
  getIdeasFail,
  getIdeaById,
  getIdeaByIdDone,
  getIdeaByIdFail,
};
