import {injectable} from 'inversify'
import axios from 'axios'

import {Ports, UserApi} from '@centsideas/common/enums'
import {Config} from '@centsideas/config'
import {Id} from '@centsideas/common/types'
import {UserWrite} from '@centsideas/schema'
import {PersistedESEvent, SerializedPersistedESEvent} from '@centsideas/event-sourcing'

@injectable()
export class UserWriteAdapter {
  private readonly userHost = `http://${this.config.get('user.host')}:${Ports.HttpApi}`
  private readonly api = {
    rename: `${this.userHost}/${UserApi.Rename}`,
    updateProfile: `${this.userHost}/${UserApi.UpdateProfile}`,
    confirmEmailChange: `${this.userHost}/${UserApi.ConfirmEmailChange}`,
    requestDeletion: `${this.userHost}/${UserApi.RequestDeletion}`,
    confirmDeletion: `${this.userHost}/${UserApi.ConfirmDeletion}`,
    getPublicEvents: `${this.userHost}/${UserApi.GetPublicEvents}`,
    getPrivateEvents: `${this.userHost}/${UserApi.GetPrivateEvents}`,
  }

  constructor(private readonly config: Config) {}

  async rename(auid: Id, username: string) {
    const payload: UserWrite.Rename = {id: auid.toString(), username}
    await axios.post(this.api.rename, payload)
  }

  async updateProfile(auid: Id, options: UserWrite.UpdateProfileOptions) {
    const payload: UserWrite.UpdateProfile = {id: auid.toString(), ...options}
    await axios.post(this.api.updateProfile, payload)
  }

  async confirmEmail(token: string) {
    const payload: UserWrite.ConfirmEmail = {token}
    await axios.post(this.api.confirmEmailChange, payload)
  }

  async requestDeletion(auid: Id) {
    const payload: UserWrite.RequestDeletion = {id: auid.toString()}
    await axios.post(this.api.requestDeletion, payload)
  }

  async confirmDeletion(token: string) {
    const payload: UserWrite.ConfirmDeletion = {token}
    await axios.post(this.api.confirmDeletion, payload)
  }

  async getPublicEvents(from?: number) {
    const payload: UserWrite.GetEvents = {from}
    const {data} = await axios.post(this.api.getPublicEvents, payload)
    const events: SerializedPersistedESEvent[] = data
    return events.map(PersistedESEvent.fromObject)
  }

  async getPrivateEvents(from?: number) {
    const payload: UserWrite.GetEvents = {from}
    const {data} = await axios.post(this.api.getPrivateEvents, payload)
    const events: SerializedPersistedESEvent[] = data
    return events.map(PersistedESEvent.fromObject)
  }
}
