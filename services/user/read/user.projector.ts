import {injectable} from 'inversify'

import {UserEvents} from '@centsideas/common/enums'
import {MongoProjector, PersistedESEvent} from '@centsideas/event-sourcing'
import {Id, Username, UserRole} from '@centsideas/common/types'
import {Config} from '@centsideas/config'
import {UserWriteAdapter} from '@centsideas/adapters'

import * as Events from '../user.events'

export interface UserReadState {
  id: string
  username: string
  role: string
  createdAt: string
  updatedAt: string
}

@injectable()
export class UserProjector extends MongoProjector {
  private readonly collectionName = 'users'

  topic = 'event-sourcing.user'
  sequenceCounterName = 'userSequence'
  consumerGroup = 'projector.user'
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
    return this.writeAdapter.getPublicEvents(from)
  }

  async handleEvent({event}: PersistedESEvent) {
    const collection = await this.collection()

    const userId = event.aggregateId.toString()
    switch (event.name.toString()) {
      case UserEvents.Created: {
        const payload = event.payload as Events.UserCreated
        await collection.insertOne({
          id: userId,
          username: payload.username,
          role: UserRole.Basic().toString(),
          createdAt: event.timestamp.toString(),
          updatedAt: event.timestamp.toString(),
        })
        break
      }

      case UserEvents.Renamed: {
        const {username} = event.payload as Events.UserRenamed
        await collection.findOneAndUpdate({id: userId}, {$set: {username}})
        break
      }

      case UserEvents.RoleChanged: {
        const {role} = event.payload as Events.RoleChanged
        await collection.findOneAndUpdate({id: userId}, {$set: {role}})
        break
      }

      case UserEvents.DeletionConfirmed: {
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

  async getByUsername(username: Username) {
    const collection = await this.collection()
    return collection.findOne({username: username.toString()})
  }

  async getAll() {
    const collection = await this.collection()
    return (await collection.find({})).toArray()
  }

  private async collection() {
    const db = await this.db()
    return db.collection<UserReadState>(this.collectionName)
  }
}
