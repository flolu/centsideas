export interface PrivateUserCreatedData {
  id: string;
  email: string;
}

export interface EmailChangeRequestedData {
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

export interface DeletionRequestedData {}

export interface DeletionConfirmedData {
  deletedAt: string;
}
