import {Aggregate, ESEvent, Apply, Snapshot} from '@centsideas/event-sourcing'
import {Id, Username, UserRole} from '@centsideas/common/types'

import * as Events from './user.events'
import * as Errors from './user.errors'

export interface UserState {
  id: string
  isDeleted: boolean
  username: string
}

export class User extends Aggregate<UserState> {
  protected id!: Id
  private isDeleted = false
  private username!: Username

  static buildFrom(events: ESEvent[], snapshot?: Snapshot<UserState>) {
    return this.build(User, events, snapshot)
  }

  static create(id: Id, username: Username) {
    const user = new User()
    return user.raise(new Events.UserCreated(id.toString(), username.toString()))
  }

  rename(username: Username) {
    this.checkConditions()
    if (this.username.equals(username)) return
    this.raise(new Events.UserRenamed(username.toString()))
  }

  changeRole(role: UserRole) {
    this.checkConditions()
    this.raise(new Events.RoleChanged(role.toString()))
  }

  requestDeletion() {
    this.checkConditions()
    this.raise(new Events.DeletionRequested())
  }

  confirmDeletion() {
    this.checkConditions()
    this.raise(new Events.DeletionConfirmed())
  }

  private checkConditions() {
    if (this.isDeleted) throw new Errors.UserAlreadyDeleted(this.id)
  }

  applyState(state: UserState) {
    this.isDeleted = state.isDeleted
    this.username = Username.fromString(state.username)
  }

  get currentState() {
    return {
      id: this.id.toString(),
      username: this.username.toString(),
      isDeleted: this.isDeleted,
    }
  }

  @Apply(Events.UserCreated)
  private created(payload: Events.UserCreated) {
    this.id = Id.fromString(payload.id)
    this.username = Username.fromString(payload.username)
  }

  @Apply(Events.DeletionConfirmed)
  private deletionConfirmed() {
    this.isDeleted = true
  }
}
