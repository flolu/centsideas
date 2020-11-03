import {Aggregate, ESEvent, Apply, Snapshot} from '@centsideas/event-sourcing'
import {Id, URL, Email} from '@centsideas/common/types'

import * as Events from './private-user.events'
import * as Errors from './user.errors'
import {DisplayName} from './display-name'
import {Bio} from './bio'
import {Location} from './location'

export interface PrivateUserState {
  id: string
  isDeleted: boolean
  email: string
  pendingEmail?: string
  avatarUrl?: string
  bio?: string
  location?: string
  displayName?: string
  website?: string
}

export class PrivateUser extends Aggregate<PrivateUserState> {
  protected id!: Id
  private isDeleted = false
  private email!: Email
  private pendingEmail?: Email
  private avatar?: URL
  private bio?: Bio
  private location?: Location
  private name?: DisplayName
  private website?: URL

  static buildFrom(events: ESEvent[], snapshot?: Snapshot<PrivateUserState>) {
    return this.build(PrivateUser, events, snapshot)
  }

  static create(id: Id, email: Email) {
    const privateUser = new PrivateUser()
    return privateUser.raise(new Events.PrivateUserCreated(id.toString(), email.toString()))
  }

  changeAvatar(url: URL) {
    this.checkConditions()
    if (this.avatar?.toString() === url.toString()) return
    this.raise(new Events.AvatarChanged(url.toString()))
  }

  changeDisplayName(name: DisplayName) {
    this.checkConditions()
    if (this.name?.toString() === name.toString()) return
    this.raise(new Events.DisplayNameChanged(name.toString()))
  }

  updateBio(bio: Bio) {
    this.checkConditions()
    if (this.bio?.toString() === bio.toString()) return
    this.raise(new Events.BioUpdated(bio.toString()))
  }

  changeLocation(location: Location) {
    this.checkConditions()
    if (this.location?.toString() === location.toString()) return
    this.raise(new Events.LocationChanged(location.toString()))
  }

  changeWebsite(website: URL) {
    this.checkConditions()
    if (this.website?.toString() === website.toString()) return
    this.raise(new Events.WebsiteChanged(website.toString()))
  }

  requestEmailChange(email: Email) {
    this.checkConditions()
    if (this.email.equals(email)) return
    this.raise(new Events.EmailChangeRequested(email.toString()))
  }

  confirmEmailChange() {
    this.checkConditions()
    this.raise(new Events.EmailChangeConfirmed())
  }

  delete() {
    this.checkConditions()
    this.raise(new Events.PrivateUserDeleted())
  }

  private checkConditions() {
    if (this.isDeleted) throw new Errors.UserAlreadyDeleted(this.id)
  }

  applyState(state: PrivateUserState) {
    this.isDeleted = state.isDeleted
    this.email = Email.fromString(state.email)
    this.pendingEmail = state.pendingEmail ? Email.fromString(state.pendingEmail) : undefined
    this.avatar = state.avatarUrl ? URL.fromString(state.avatarUrl) : undefined
    this.bio = state.bio ? Bio.fromString(state.bio) : undefined
    this.location = state.location ? Location.fromString(state.location) : undefined
    this.name = state.displayName ? DisplayName.fromString(state.displayName) : undefined
    this.website = state.website ? URL.fromString(state.website) : undefined
  }

  get currentState(): PrivateUserState {
    return {
      id: this.id.toString(),
      isDeleted: this.isDeleted,
      email: this.email.toString(),
      pendingEmail: this.pendingEmail?.toString(),
      avatarUrl: this.avatar?.toString(),
      bio: this.bio?.toString(),
      location: this.location?.toString(),
      displayName: this.name?.toString(),
      website: this.website?.toString(),
    }
  }

  getEmail() {
    return this.email
  }

  getPendingEmail() {
    return this.pendingEmail
  }

  @Apply(Events.PrivateUserCreated)
  private created(payload: Events.PrivateUserCreated) {
    this.id = Id.fromString(payload.id)
    this.email = Email.fromString(payload.email)
  }

  @Apply(Events.EmailChangeRequested)
  private emailChangeRequested(payload: Events.EmailChangeRequested) {
    this.pendingEmail = Email.fromString(payload.email)
  }

  @Apply(Events.EmailChangeConfirmed)
  private emailChangeConfirmed() {
    this.email = this.pendingEmail!
    this.pendingEmail = undefined
  }

  @Apply(Events.AvatarChanged)
  private avatarChanged(payload: Events.AvatarChanged) {
    this.avatar = URL.fromString(payload.url)
  }

  @Apply(Events.DisplayNameChanged)
  private displayNameChanged(payload: Events.DisplayNameChanged) {
    this.name = DisplayName.fromString(payload.name)
  }

  @Apply(Events.LocationChanged)
  private locationChanged(payload: Events.LocationChanged) {
    this.location = Location.fromString(payload.location)
  }

  @Apply(Events.WebsiteChanged)
  private websiteChanged(payload: Events.WebsiteChanged) {
    this.website = URL.fromString(payload.website, false)
  }

  @Apply(Events.BioUpdated)
  private bioUpdated(payload: Events.BioUpdated) {
    this.bio = Bio.fromString(payload.bio)
  }

  @Apply(Events.PrivateUserDeleted)
  private deleted() {
    this.isDeleted = true
  }
}
