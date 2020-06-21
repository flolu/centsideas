import {UserModels} from '@centsideas/models';

export interface GetMe {
  id: string;
}

export interface GetById {
  id: string;
}

export interface GetUsers {}

export interface Service {
  getMe: (
    payload: GetMe,
  ) => Promise<{public: UserModels.UserView; private: UserModels.PrivateUserView}>;
  getById: (payload: GetById) => Promise<UserModels.UserView>;
  getAll: (payload: GetUsers) => Promise<{users: UserModels.UserView[]}>;
}
