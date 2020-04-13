import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { UserService } from './user.service';
import { EnvironmentModule } from '../../shared/environment';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, EnvironmentModule],
      providers: [UserService],
    });
  });

  it('should be created', () => {
    const service = TestBed.inject(UserService);
    expect(service).toBeTruthy();
  });
});
