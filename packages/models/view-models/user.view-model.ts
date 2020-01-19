export interface IUserViewModel {
  id: string;
  username: string;
  createdAt: string;
  lastEventId: string;
  private: {
    email: string;
    pendingEmail: string | null;
  } | null;
}
