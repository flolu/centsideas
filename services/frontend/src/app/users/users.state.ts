export interface IUsersState {
  loading: boolean;
  loaded: boolean;
  error: string | null;
  user: IUsersState | null;
  activationUrl: string | null;
  token: string | null;
}
