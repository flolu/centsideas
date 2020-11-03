import {Event} from '@centsideas/event-sourcing'
import {UserEvents} from '@centsideas/common/enums'

@Event(UserEvents.DeletionConfirmed)
export class DeletionConfirmed {}

@Event(UserEvents.DeletionRequested)
export class DeletionRequested {}

@Event(UserEvents.RoleChanged)
export class RoleChanged {
  constructor(public readonly role: string) {}
}

@Event(UserEvents.Created)
export class UserCreated {
  constructor(public readonly id: string, public readonly username: string) {}
}

@Event(UserEvents.Renamed)
export class UserRenamed {
  constructor(public readonly username: string) {}
}
