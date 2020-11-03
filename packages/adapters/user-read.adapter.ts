import {injectable} from 'inversify'
import axios from 'axios'

import {Email, Id} from '@centsideas/common/types'
import {Config} from '@centsideas/config'
import {Ports, RpcStatus, UserReadApi} from '@centsideas/common/enums'
import {FullUserReadState, UserRead} from '@centsideas/schema'

@injectable()
export class UserReadAdapter {
  private readonly userReadHost = `http://${this.config.get('userRead.host')}:${Ports.HttpApi}`
  private readonly api = {
    getByEmail: `${this.userReadHost}/${UserReadApi.GetByEmail}`,
    getByUsername: `${this.userReadHost}/${UserReadApi.GetByUsername}`,
    getAll: `${this.userReadHost}/${UserReadApi.GetAll}`,
    getMe: `${this.userReadHost}/${UserReadApi.GetMe}`,
  }

  constructor(private readonly config: Config) {}

  async getByEmail(email: Email) {
    try {
      const payload: UserRead.GetByEmail = {email: email.toString()}
      const response = await axios.post<FullUserReadState>(this.api.getByEmail, payload)
      return response.data
    } catch (error) {
      if (error.response.data.code === RpcStatus.NOT_FOUND) return undefined
      throw error
    }
  }

  async getByUsername(username: string, auid?: Id) {
    try {
      const payload: UserRead.GetByUsername = {username, auid: auid?.toString()}
      const response = await axios.post<FullUserReadState>(this.api.getByUsername, payload)
      return response.data
    } catch (error) {
      if (error.response.data.code === RpcStatus.NOT_FOUND) return undefined
      throw error
    }
  }

  async getAll() {
    const response = await axios.post<FullUserReadState[]>(this.api.getAll)
    return response.data
  }

  async getById(user: Id) {
    const payload: UserRead.GetMe = {id: user.toString()}
    const response = await axios.post<FullUserReadState>(this.api.getMe, payload)
    return response.data
  }
}
