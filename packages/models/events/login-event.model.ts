export interface ILoginRequestedEvent {
  email: string;
  firstLogin: boolean;
}

export interface IGoogleLoginRequestedEvnet {
  email: string;
  googleUserId: string;
  firstLogin: boolean;
}

export interface ILoginMailSentEvent {
  email: string;
}

export interface ILoginConfirmedEvent {
  userId: string;
}
