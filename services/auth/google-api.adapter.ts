import {injectable} from 'inversify'
import * as queryString from 'query-string'
import axios from 'axios'

import {Config} from '@centsideas/config'
import {Email} from '@centsideas/common/types'

enum GoogleApi {
  EmailScope = 'https://www.googleapis.com/auth/userinfo.email',
  ProfileScope = 'https://www.googleapis.com/auth/userinfo.profile',
  SignIn = 'https://accounts.google.com/o/oauth2/v2/auth',
  Token = 'https://oauth2.googleapis.com/token',
  UserInfo = 'https://www.googleapis.com/oauth2/v2/userinfo',
}

@injectable()
export class GoogleApiAdapter {
  private readonly googleClientId = this.config.get('secrets.google.clientId')
  private readonly googleClientSecret = this.config.get('secrets.google.clientSecret')
  private readonly environment = this.config.get('environment')
  private readonly googleRedirectHost =
    this.environment === 'microk8s' ? 'http://localhost:3000' : this.config.get('api')
  private readonly googleRedirectUrl = this.googleRedirectHost + '/auth/signin/google/token'

  constructor(private config: Config) {}

  get signInUrl() {
    const params = queryString.stringify({
      client_id: this.googleClientId,
      redirect_uri: this.googleRedirectUrl,
      scope: [GoogleApi.EmailScope, GoogleApi.ProfileScope].join(' '),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
    })
    return `${GoogleApi.SignIn}?${params}`
  }

  async getAccessToken(code: string) {
    const tokenResponse = await axios.post(GoogleApi.Token, {
      client_id: this.googleClientId,
      client_secret: this.googleClientSecret,
      redirect_uri: this.googleRedirectUrl,
      grant_type: 'authorization_code',
      code,
    })
    return tokenResponse.data.access_token
  }

  async getUserInfo(accessToken: string) {
    const userInfoResponse = await axios.get(GoogleApi.UserInfo, {
      headers: {Authorization: `Bearer ${accessToken}`},
    })
    const {email} = userInfoResponse.data
    return Email.fromString(email)
  }
}
