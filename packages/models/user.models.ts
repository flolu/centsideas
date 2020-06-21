export interface PrivateUserCreatedData {
  id: string;
  email: string;
}

export interface PrivateUserDeletedData {
  deletedAt: string;
}

export interface EmailChangeRequestedData {
  // TODO i dont think i need userId here?
  userId: string;
  newEmail: string;
}

export interface EmailChangeConfirmedData {}

export interface UserCreatedData {
  id: string;
  username: string;
  createdAt: string;
}

export interface UserRenamedData {
  username: string;
}

export interface DeletionRequestedData {
  // TODO i dont think i need userId here?
  userId: string;
  requestedAt: string;
}

export interface DeletionConfirmedData {
  deletedAt: string;
}

export interface UserView {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | undefined;
  lastEventVersion: number;
}

export interface PrivateUserView {
  id: string;
  email: string;
  pendingEmail: string | undefined;
  lastEventVersion: number;
}
