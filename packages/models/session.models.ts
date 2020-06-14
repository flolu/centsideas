export interface SignInRequestedData {
  sessionId: string;
  method: string;
  email: string;
  requestedAt: string;
}

export interface SignInConfirmedData {
  isSignUpSession: boolean;
  userId: string;
  confirmedAt: string;
}

export interface GoogleSignInConfirmedData {
  sessionId: string;
  userId: string;
  email: string;
  googleUserId: string;
  isSignUp: boolean;
  requestedAt: string;
  confirmedAt: string;
}

export interface SignedOutData {
  signedOutAt: string;
}
