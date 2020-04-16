export interface ILoginState {
  id: string;
  email: string;
  confirmedAt: string | null;
  confirmedByUserId: string | null;
  createdAt: string | null;
  lastEventId: string;
}
