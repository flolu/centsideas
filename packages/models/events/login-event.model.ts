export interface ILoginRequestedEvent {
  email: string;
  firstLogin: boolean;
}

export interface ILoginMailSentEvent {
  email: string;
}

export interface ILoginConfirmedEvent {
  userId: string;
}
