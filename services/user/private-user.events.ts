import {Event} from '@centsideas/event-sourcing'
import {PrivateUserEvents} from '@centsideas/common/enums'

@Event(PrivateUserEvents.WebsiteChanged)
export class WebsiteChanged {
  constructor(public readonly website: string) {}
}

@Event(PrivateUserEvents.LocationChanged)
export class LocationChanged {
  constructor(public readonly location: string) {}
}

@Event(PrivateUserEvents.Created)
export class PrivateUserCreated {
  constructor(public readonly id: string, public readonly email: string) {}
}

@Event(PrivateUserEvents.Deleted)
export class PrivateUserDeleted {}

@Event(PrivateUserEvents.DisplayNameChanged)
export class DisplayNameChanged {
  constructor(public readonly name: string) {}
}

@Event(PrivateUserEvents.EmailChangeConfirmed)
export class EmailChangeConfirmed {}

@Event(PrivateUserEvents.EmailChangeRequested)
export class EmailChangeRequested {
  constructor(public readonly email: string) {}
}

@Event(PrivateUserEvents.AvatarChanged)
export class AvatarChanged {
  constructor(public readonly url: string) {}
}

@Event(PrivateUserEvents.BioUpdated)
export class BioUpdated {
  constructor(public readonly bio: string) {}
}
