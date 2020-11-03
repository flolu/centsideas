export interface FullUserReadState {
  id: string
  username: string
  role: string
  avatarUrl?: string
  displayName?: string
  bio?: string
  location?: string
  website?: string
  email?: string
  pendingEmail?: string
  createdAt: string
  updatedAt: string
}

export namespace UserWrite {
  export interface Rename {
    id: string
    username: string
  }

  export interface UpdateProfileOptions {
    avatar?: string
    name?: string
    bio?: string
    location?: string
    website?: string
    email?: string
  }

  export interface UpdateProfile extends UpdateProfileOptions {
    id: string
  }

  export interface ConfirmEmail {
    token: string
  }

  export interface RequestDeletion {
    id: string
  }

  export interface ConfirmDeletion {
    token: string
  }

  export interface GetEvents {
    from?: number
  }
}

export namespace UserRead {
  export interface GetByEmail {
    email: string
    auid?: string
  }

  export interface GetByUsername {
    username: string
    auid?: string
  }

  export interface GetMe {
    id: string
  }
}
