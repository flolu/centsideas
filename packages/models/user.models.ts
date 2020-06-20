export interface PrivateUserCreatedData {
  id: string;
  email: string;
}

export interface PrivateUserDeletedData {
  deletedAt: string;
}

export interface EmailChangeRequestedData {
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
  userId: string;
  requestedAt: string;
}

export interface DeletionConfirmedData {
  deletedAt: string;
}
