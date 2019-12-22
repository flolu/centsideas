export interface IUserState {
  id: string;
  username: string;
  email: string;
  createdAt: string | null;
  updatedAt: string | null;
  lastEventId: string;
}
