import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { UserService } from './user.service';
import { ENVIRONMENT } from '../../environments';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        UserService,
        {
          provide: ENVIRONMENT,
          useValue: { production: true, gatewayHost: 'http://mock-server.test' },
        },
      ],
    });
  });

  it('should be created', () => {
    const service = TestBed.inject(UserService);
    expect(service).toBeTruthy();
  });
});
