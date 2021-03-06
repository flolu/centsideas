export interface SignInRequestedData {
  sessionId: string;
  method: string;
  email: string;
  requestedAt: string;
}

export interface SignInConfirmedData {
  isSignUp: boolean;
  userId: string;
  confirmedAt: string;
  email: string;
}

export interface GoogleSignInConfirmedData {
  sessionId: string;
  userId: string;
  email: string;
  isSignUp: boolean;
  requestedAt: string;
  confirmedAt: string;
}

export interface SignedOutData {
  signedOutAt: string;
}
