export interface SignInRequestedData {
  sessionId: string;
  method: string;
  email: string;
  requestedAt: string;
  googleUserId?: string;
}

export interface SignInConfirmedData {
  isSignUpSession: boolean;
  userId: string;
  confirmedAt: string;
}

export interface SignedOutData {
  signedOutAt: string;
}
