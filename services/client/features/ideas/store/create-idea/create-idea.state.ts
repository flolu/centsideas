import { SyncStatus } from '@cic/shared';
import { IIdeaForm } from '../ideas.state';

export interface ICreateIdeaReducerState {
  status: SyncStatus.None;
  error: string | null;
  form: IIdeaForm | null;
  persisted: IIdeaForm | null;
}
