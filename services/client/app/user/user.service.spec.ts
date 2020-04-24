import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserTransferStateModule } from '@angular/platform-browser';

import { UserService } from './user.service';
import { ENVIRONMENT, environment } from '@cic/environment';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, BrowserTransferStateModule],
      // FIXME consider creating a dedicated "testing environment"
      providers: [UserService, { provide: ENVIRONMENT, useValue: environment }],
    });
  });

  it('should be created', () => {
    const service = TestBed.inject(UserService);
    expect(service).toBeTruthy();
  });
});
