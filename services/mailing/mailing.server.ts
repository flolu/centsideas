import {injectable} from 'inversify';
import * as http from 'http';

// import {AuthenticationEventNames} from '@centsideas/enums';

@injectable()
export class MailingServer {
  constructor() {
    http.createServer((_, res) => res.writeHead(200).end()).listen(3000);
  }

  /* @EventHandler(AuthenticationEventNames.SignInRequested)
  signInRequested() {
    console.log('got sign in requested event');
  } */
}
