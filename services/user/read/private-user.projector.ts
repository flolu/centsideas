import {injectable} from 'inversify'

import {PersistedESEvent, MongoProjector} from '@centsideas/event-sourcing'
import {PrivateUserEvents} from '@centsideas/common/enums'
import {Email, Id} from '@centsideas/common/types'
import {Config} from '@centsideas/config'
import {UserWriteAdapter} from '@centsideas/adapters'

import {
  PrivateUserCreated,
  AvatarChanged,
  DisplayNameChanged,
  BioUpdated,
  LocationChanged,
  WebsiteChanged,
  EmailChangeRequested,
} from '../private-user.events'

export interface PrivateUserReadState {
  id: string
  avatarUrl: string
  displayName: string
  bio: string
  location: string
  website: string
  email: string
  pendingEmail: string
  createdAt: string
  updatedAt: string
}

@injectable()
export class PrivateUserProjector extends MongoProjector {
  private readonly collectionName = 'privateUsers'

  topic = 'event-sourcing.privateUser'
  sequenceCounterName = 'privateUserSequence'
  consumerGroup = 'projector.privateUser'
  databaseAuth = {
    user: this.config.get('readDatabase.user'),
    password: this.config.get('secrets.readDatabase.password'),
  }
  databaseName = this.config.get('userRead.database.name')
  databaseUrl = this.config.get('readDatabase.url')

  constructor(private readonly config: Config, private readonly writeAdapter: UserWriteAdapter) {
    super()
  }

  async getEvents(from: number) {
    return this.writeAdapter.getPrivateEvents(from)
  }

  async handleEvent({event}: PersistedESEvent) {
    const collection = await this.collection()

    const userId = event.aggregateId.toString()
    switch (event.name.toString()) {
      case PrivateUserEvents.Created: {
        const payload = event.payload as PrivateUserCreated
        await collection.insertOne({
          id: userId,
          avatarUrl: '',
          displayName: '',
          bio: '',
          location: '',
          website: '',
          email: payload.email,
          pendingEmail: '',
          createdAt: event.timestamp.toString(),
          updatedAt: '',
        })
        break
      }

      case PrivateUserEvents.AvatarChanged: {
        const {url} = event.payload as AvatarChanged
        await collection.findOneAndUpdate({id: userId}, {$set: {avatarUrl: url}})
        break
      }

      case PrivateUserEvents.DisplayNameChanged: {
        const {name} = event.payload as DisplayNameChanged
        await collection.findOneAndUpdate({id: userId}, {$set: {displayName: name}})
        break
      }

      case PrivateUserEvents.BioUpdated: {
        const {bio} = event.payload as BioUpdated
        await collection.findOneAndUpdate({id: userId}, {$set: {bio}})
        break
      }

      case PrivateUserEvents.LocationChanged: {
        const {location} = event.payload as LocationChanged
        await collection.findOneAndUpdate({id: userId}, {$set: {location}})
        break
      }

      case PrivateUserEvents.WebsiteChanged: {
        const {website} = event.payload as WebsiteChanged
        await collection.findOneAndUpdate({id: userId}, {$set: {website}})
        break
      }

      case PrivateUserEvents.EmailChangeRequested: {
        const {email} = event.payload as EmailChangeRequested
        await collection.findOneAndUpdate({id: userId}, {$set: {pendingEmail: email}})
        break
      }

      case PrivateUserEvents.EmailChangeConfirmed: {
        const current = await collection.findOne({id: userId})
        await collection.findOneAndUpdate(
          {id: userId},
          {$set: {email: current!.pendingEmail, pendingEmail: ''}},
        )
        break
      }

      case PrivateUserEvents.Deleted: {
        await collection.deleteOne({id: userId})
        return
      }
    }

    await collection.findOneAndUpdate({id: userId}, {$set: {updatedAt: event.timestamp.toString()}})
  }

  async getById(userId: Id) {
    const collection = await this.collection()
    return collection.findOne({id: userId.toString()})
  }

  async getByEmail(email: Email) {
    const collection = await this.collection()
    return collection.findOne({email: email.toString()})
  }

  async getAll() {
    const collection = await this.collection()
    return (await collection.find({})).toArray()
  }

  private async collection() {
    const db = await this.db()
    return db.collection<PrivateUserReadState>(this.collectionName)
  }
}
