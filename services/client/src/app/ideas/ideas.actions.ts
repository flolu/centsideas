import * as __ngrxStoreTypes from '@ngrx/store/src/models';

import { createAction, props } from '@ngrx/store';

import {
  IIdeaViewModel,
  IIdeaState,
  ICreateIdeaDto,
  IIdeaQueryDto,
  IUpdateIdeaDto,
} from '@cents-ideas/models';

const PREFIX = '[ideas]';
const FAIL = 'fail';
const DONE = 'done';

const GET = 'get';
const getIdeas = createAction(`${PREFIX} ${GET}`);
const getIdeasDone = createAction(`${PREFIX} ${GET} ${DONE}`, props<{ ideas: IIdeaViewModel[] }>());
const getIdeasFail = createAction(`${PREFIX} ${GET} ${FAIL}`, props<{ error: string }>());

const GET_BY_ID = 'get-by-id';
const getIdeaById = createAction(`${PREFIX} ${GET_BY_ID}`, props<{ id: string }>());
const getIdeaByIdDone = createAction(
  `${PREFIX} ${GET_BY_ID} ${DONE}`,
  props<{ idea: IIdeaViewModel }>(),
);
const getIdeaByIdFail = createAction(`${PREFIX} ${GET_BY_ID} ${FAIL}`, props<{ error: string }>());

const CREATE = 'create';
const createIdea = createAction(`${PREFIX} ${CREATE}`, props<ICreateIdeaDto>());
const createIdeaDone = createAction(
  `${PREFIX} ${CREATE} ${DONE}`,
  props<{ created: IIdeaState }>(),
);
const createIdeaFail = createAction(`${PREFIX} ${CREATE} ${FAIL}`, props<{ error: string }>());

const UPDATE = 'update';
const updateIdea = createAction(`${PREFIX} ${UPDATE}`, props<IUpdateIdeaDto>());
const updateIdeaDone = createAction(
  `${PREFIX} ${UPDATE} ${DONE}`,
  props<{ updated: IIdeaState }>(),
);
const updateIdeaFail = createAction(`${PREFIX} ${UPDATE} ${FAIL}`, props<{ error: string }>());

const DELETE = 'delete';
const deleteIdea = createAction(`${PREFIX} ${DELETE}`, props<IIdeaQueryDto>());
const deleteIdeaDone = createAction(
  `${PREFIX} ${DELETE} ${DONE}`,
  props<{ deleted: IIdeaState }>(),
);
const deleteIdeaFail = createAction(`${PREFIX} ${DELETE} ${FAIL}`, props<{ error: string }>());

export const IdeasActions = {
  getIdeas,
  getIdeasDone,
  getIdeasFail,
  getIdeaById,
  getIdeaByIdDone,
  getIdeaByIdFail,
  createIdea,
  createIdeaDone,
  createIdeaFail,
  updateIdea,
  updateIdeaDone,
  updateIdeaFail,
  deleteIdea,
  deleteIdeaDone,
  deleteIdeaFail,
};
