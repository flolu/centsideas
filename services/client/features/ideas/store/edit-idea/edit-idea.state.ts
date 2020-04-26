import { LoadStatus } from '@cic/shared';
import { IIdeaForm } from '../ideas.state';

export interface IEditIdeaReducerState {
  status: LoadStatus;
  ideaId: string | null;
  error: string | null;
  form: IIdeaForm | null;
  editing: boolean;
}
