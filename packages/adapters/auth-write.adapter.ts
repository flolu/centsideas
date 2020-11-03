import {injectable} from 'inversify'
import axios from 'axios'

import {Ports, AuthApi} from '@centsideas/common/enums'
import {Config} from '@centsideas/config'
import {AuthWrite} from '@centsideas/schema'
import {Id} from '@centsideas/common/types'

@injectable()
export class AuthWriteAdapter {
  private readonly authHost = `http://${this.config.get('auth.host')}:${Ports.HttpApi}`
  private readonly api = {
    refreshTokens: `${this.authHost}/${AuthApi.RefreshTokens}`,
    requestEmailSignIn: `${this.authHost}/${AuthApi.RequestEmailSignIn}`,
    confirmEmailSignIn: `${this.authHost}/${AuthApi.ConfirmEmailSignIn}`,
    googleSignIn: `${this.authHost}/${AuthApi.GoogleSignIn}`,
    signOut: `${this.authHost}/${AuthApi.SignOut}`,
  }

  constructor(private readonly config: Config) {}

  async refresh(currentRefreshToken: string) {
    const payload: AuthWrite.RefreshTokens = {token: currentRefreshToken}
    const {data} = await axios.post<AuthWrite.Tokens>(this.api.refreshTokens, payload)
    return data
  }

  async requestEmailSignIn(email: string, session: Id) {
    const payload: AuthWrite.RequestEmailSignIn = {email, sessionId: session.toString()}
    await axios.post(this.api.requestEmailSignIn, payload)
  }

  async confirmEmailSignIn(token: string) {
    const payload: AuthWrite.ConfirmEmailSignIn = {token}
    const {data} = await axios.post<AuthWrite.Tokens>(this.api.confirmEmailSignIn, payload)
    return data
  }

  async googleSignIn(code: string, session: Id) {
    const payload: AuthWrite.GoogleSignIn = {code, sessionId: session.toString()}
    const {data} = await axios.post<AuthWrite.Tokens>(this.api.googleSignIn, payload)
    return data
  }

  async signOut(session: Id) {
    const payload: AuthWrite.SignOut = {sessionId: session.toString()}
    const {data} = await axios.post<AuthWrite.Tokens>(this.api.signOut, payload)
    return data
  }
}
