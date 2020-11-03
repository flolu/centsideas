import {injectable} from 'inversify'

import {Email, Id, Timestamp, Username, UserRole} from '@centsideas/common/types'
import {FullUserReadState} from '@centsideas/schema'

const id1 = Id.generate()
const email1 = Email.fromString('ronny@centsideas.com')
const username1 = Username.fromString('ronny')
const fakeUser1: FullUserReadState = {
  id: id1.toString(),
  avatarUrl: 'https://images.centsideas.com/abc.jpg',
  bio: 'Hi, I am Ronny!',
  location: 'Ort',
  displayName: 'Ronny Schnackelmann',
  website: 'ronny.com',
  email: email1.toString(),
  username: username1.toString(),
  role: UserRole.Basic().toString(),
  createdAt: Timestamp.now().toString(),
  updatedAt: Timestamp.now().toString(),
}

const id2 = Id.generate()
const email2 = Email.fromString('john@centsideas.com')
const username2 = Username.fromString('john')
const fakeUser2: FullUserReadState = {
  id: id2.toString(),
  email: email2.toString(),
  username: username2.toString(),
  role: UserRole.Basic().toString(),
  createdAt: Timestamp.now().toString(),
  updatedAt: Timestamp.now().toString(),
}

const email3 = Email.fromString('someone@email.com')

export const userReadMocks = {
  id1,
  email1,
  username1,
  fakeUser1,
  id2,
  email2,
  username2,
  fakeUser2,
  email3,
}

@injectable()
export class UserReadAdapterMock {
  async getByEmail(email: Email) {
    if (email.equals(email1)) return fakeUser1
    if (email.equals(email2)) return fakeUser2
    return undefined
  }

  async getByUsername(username: string, _auid?: Id) {
    if (username === username1.toString()) return fakeUser1
    if (username === username2.toString()) return fakeUser2
    return undefined
  }

  async getAll() {
    return [fakeUser1, fakeUser2]
  }

  async getById(user: Id) {
    if (user.equals(id1)) return fakeUser1
    if (user.equals(id2)) return fakeUser2
    return {...fakeUser2, id: user.toString()}
  }
}
