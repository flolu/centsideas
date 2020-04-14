export interface IUserState {
  id: string;
  username: string;
  email: string;
  pendingEmail: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  tokenId: string;
  lastEventId: string;
}
