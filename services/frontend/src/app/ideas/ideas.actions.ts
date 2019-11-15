import { createAction, props } from '@ngrx/store';

import { IIdeaViewModel, IIdeaState } from '@cents-ideas/models';

const PREFIX = '[ideas]';
const FAIL = 'fail';
const DONE = 'done';

const GET = 'get';
export const getIdeas = createAction(`${PREFIX} ${GET}`);
export const getIdeasDone = createAction(`${PREFIX} ${GET} ${DONE}`, props<{ ideas: IIdeaViewModel[] }>());
export const getIdeasFail = createAction(`${PREFIX} ${GET} ${FAIL}`, props<{ error: string }>());

const CREATE = 'create';
export const createIdea = createAction(`${PREFIX} ${CREATE}`, props<{ title: string; description: string }>());
export const createIdeaDone = createAction(`${PREFIX} ${CREATE} ${DONE}`, props<{ created: IIdeaState }>());
export const createIdeaFail = createAction(`${PREFIX} ${CREATE} ${FAIL}`, props<{ error: string }>());

const UPDATE = 'update';
export const updateIdea = createAction(
  `${PREFIX} ${UPDATE}`,
  props<{ id: string; title: string; description: string }>(),
);
export const updateIdeaDone = createAction(`${PREFIX} ${UPDATE} ${DONE}`, props<{ updated: IIdeaState }>());
export const updateIdeaFail = createAction(`${PREFIX} ${UPDATE} ${FAIL}`, props<{ error: string }>());

const PUBLISH = 'publish';
export const publishIdea = createAction(`${PREFIX} ${PUBLISH}`, props<{ id: string }>());
export const publishIdeaDone = createAction(`${PREFIX} ${PUBLISH} ${DONE}`, props<{ published: IIdeaState }>());
export const publishIdeaFail = createAction(`${PREFIX} ${PUBLISH} ${FAIL}`, props<{ error: string }>());
