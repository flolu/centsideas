import {createAction, props} from '@ngrx/store';

import {IIdeaState} from '@centsideas/models';
import {appPrefix, failSuffix, doneSuffix} from '@cic/shared';

const prefix = `${appPrefix}/ideas`;
const createPrefix = prefix + '/create';

const createIdea = createAction(createPrefix, props<{title: string; description: string}>());
const createIdeaDone = createAction(createPrefix + doneSuffix, props<{created: IIdeaState}>());
const createIdeaFail = createAction(createPrefix + failSuffix, props<{error: string}>());

export const CreateIdeaActions = {
  createIdea,
  createIdeaDone,
  createIdeaFail,
};
