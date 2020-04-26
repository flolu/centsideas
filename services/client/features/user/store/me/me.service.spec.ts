import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserTransferStateModule } from '@angular/platform-browser';

import { MeService } from './me.service';
import { ENVIRONMENT, environment } from '@cic/environment';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, BrowserTransferStateModule],
      // FIXME consider creating a dedicated "testing environment"
      providers: [MeService, { provide: ENVIRONMENT, useValue: environment }],
    });
  });

  it('should be created', () => {
    const service = TestBed.inject(MeService);
    expect(service).toBeTruthy();
  });
});
