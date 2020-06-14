import {injectable} from 'inversify';
import * as queryString from 'query-string';
import axios from 'axios';

import {SecretsConfig, GlobalConfig} from '@centsideas/config';

@injectable()
export class GoogleApiAdapter {
  private readonly googleClientId = this.secretesConfig.get('secrets.google.client_id');
  private readonly googleClientSecret = this.secretesConfig.get('secrets.google.client_secret');
  private readonly googleRedirectUrl =
    this.globalConfig.get('global.api.url') + '/auth/google/signin/token'; // FIXME frontend url evenrually

  constructor(private secretesConfig: SecretsConfig, private globalConfig: GlobalConfig) {}

  get getSignInUrl() {
    const params = queryString.stringify({
      client_id: this.secretesConfig.get('secrets.google.client_id'),
      redirect_uri: this.googleRedirectUrl,
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' '),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  async getAccessToken(code: string) {
    const tokenResponse = await axios.post(`https://oauth2.googleapis.com/token`, {
      client_id: this.googleClientId,
      client_secret: this.googleClientSecret,
      redirect_uri: this.googleRedirectUrl,
      grant_type: 'authorization_code',
      code,
    });
    const {access_token} = tokenResponse.data;
    return access_token;
  }

  async getUserInfo(accessToken: string) {
    const userInfoResponse = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo`, {
      headers: {Authorization: `Bearer ${accessToken}`},
    });
    const {id, email} = userInfoResponse.data;
    return {id, email};
  }
}
