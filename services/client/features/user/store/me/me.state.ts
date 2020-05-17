import {SyncStatus} from '@cic/shared';

export interface IMeForm {
  username: string;
  email: string;
}

export interface IMeReducerState {
  formData: IMeForm | null;
  status: SyncStatus;
  // FIXME advanced error handling, where error is displayed for a specific input field
  error: string;
}
